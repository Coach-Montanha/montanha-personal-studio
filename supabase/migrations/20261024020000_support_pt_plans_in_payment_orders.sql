-- Adiciona suporte explícito a alunos e planos de Personal Trainer (pt_students / pt_plans) na tabela payment_orders
ALTER TABLE public.payment_orders 
  ADD COLUMN IF NOT EXISTS pt_student_id uuid REFERENCES public.pt_students(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS pt_plan_id uuid REFERENCES public.pt_plans(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS plan_type text NOT NULL DEFAULT 'studio'; -- 'studio' ou 'pt'

-- Torna student_id anulável para casos em que o pedido é de aluno exclusivamente Personal
ALTER TABLE public.payment_orders ALTER COLUMN student_id DROP NOT NULL;

-- Atualiza RLS para alunos de Personal também visualizarem seus pedidos
DROP POLICY IF EXISTS "Students can view their own payment orders" ON public.payment_orders;
CREATE POLICY "Students can view their own payment orders"
  ON public.payment_orders
  FOR SELECT
  TO authenticated
  USING (
    (student_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = payment_orders.student_id
      AND s.account_user_id = auth.uid()
    ))
    OR
    (pt_student_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.pt_students pts
      WHERE pts.id = payment_orders.pt_student_id
      AND pts.account_user_id = auth.uid()
    ))
  );

-- Atualiza RPC para suportar Studio e Personal Trainer
CREATE OR REPLACE FUNCTION public.apply_plan_migration_and_payment(
  p_student_id uuid,
  p_plan_id uuid,
  p_amount numeric,
  p_payment_method text,
  p_order_nsu text DEFAULT NULL,
  p_plan_type text DEFAULT 'studio'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_billing_cycle text;
  v_plan_name text;
  v_sessions integer;
  v_today date := CURRENT_DATE;
  v_due_date date;
  v_payment_id uuid;
BEGIN
  IF p_plan_type = 'pt' THEN
    -- Fluxo para Personal Trainer (pt_plans / pt_students / pt_payments)
    SELECT user_id, name, billing_cycle, sessions_per_cycle
    INTO v_user_id, v_plan_name, v_billing_cycle, v_sessions
    FROM public.pt_plans
    WHERE id = p_plan_id;

    IF NOT FOUND THEN
      SELECT user_id INTO v_user_id FROM public.pt_students WHERE id = p_student_id;
      v_billing_cycle := 'monthly';
    END IF;

    -- Calcular data de vencimento
    IF v_billing_cycle = 'quarterly' THEN
      v_due_date := v_today + INTERVAL '3 months';
    ELSIF v_billing_cycle = 'semiannual' THEN
      v_due_date := v_today + INTERVAL '6 months';
    ELSIF v_billing_cycle = 'annual' THEN
      v_due_date := v_today + INTERVAL '12 months';
    ELSE
      v_due_date := v_today + INTERVAL '1 month';
    END IF;

    -- Atualiza aluno de Personal (status ativo e vincula o plano)
    UPDATE public.pt_students
    SET status = 'active',
        training_plan = COALESCE(v_plan_name, training_plan),
        updated_at = now()
    WHERE id = p_student_id;

    -- Registra o pagamento em pt_payments
    INSERT INTO public.pt_payments (
      user_id,
      pt_student_id,
      pt_plan_id,
      amount,
      payment_date,
      due_date,
      payment_method,
      status,
      notes
    ) VALUES (
      v_user_id,
      p_student_id,
      p_plan_id,
      p_amount,
      v_today,
      v_due_date,
      p_payment_method,
      'paid',
      CASE 
        WHEN p_order_nsu IS NOT NULL THEN 'Pagamento via InfinitePay (NSU: ' || p_order_nsu || ')'
        ELSE 'Pagamento e ativação de plano Personal manual'
      END
    )
    RETURNING id INTO v_payment_id;

  ELSE
    -- Fluxo para Studio (plans / students / payments / student_plan_history)
    SELECT user_id, billing_cycle
    INTO v_user_id, v_billing_cycle
    FROM public.plans
    WHERE id = p_plan_id;

    IF NOT FOUND THEN
      SELECT user_id INTO v_user_id FROM public.students WHERE id = p_student_id;
      v_billing_cycle := 'monthly';
    END IF;

    IF v_billing_cycle = 'quarterly' THEN
      v_due_date := v_today + INTERVAL '3 months';
    ELSIF v_billing_cycle = 'semiannual' THEN
      v_due_date := v_today + INTERVAL '6 months';
    ELSIF v_billing_cycle = 'annual' THEN
      v_due_date := v_today + INTERVAL '12 months';
    ELSE
      v_due_date := v_today + INTERVAL '1 month';
    END IF;

    -- Fechar plano anterior no histórico
    UPDATE public.student_plan_history
    SET end_date = v_today,
        is_current = false,
        updated_at = now()
    WHERE student_id = p_student_id
      AND is_current = true;

    -- Inserir novo plano no histórico
    INSERT INTO public.student_plan_history (
      user_id,
      student_id,
      plan_id,
      start_date,
      is_current
    ) VALUES (
      v_user_id,
      p_student_id,
      p_plan_id,
      v_today,
      true
    );

    -- Atualizar status do aluno
    UPDATE public.students
    SET status = 'active',
        updated_at = now()
    WHERE id = p_student_id;

    -- Inserir pagamento do studio
    INSERT INTO public.payments (
      user_id,
      student_id,
      plan_id,
      amount,
      payment_date,
      due_date,
      payment_method,
      status,
      notes
    ) VALUES (
      v_user_id,
      p_student_id,
      p_plan_id,
      p_amount,
      v_today,
      v_due_date,
      p_payment_method,
      'paid',
      CASE 
        WHEN p_order_nsu IS NOT NULL THEN 'Pagamento via InfinitePay (NSU: ' || p_order_nsu || ')'
        ELSE 'Pagamento e ativação de plano manual'
      END
    )
    RETURNING id INTO v_payment_id;
  END IF;

  -- Se houver pedido registrado em payment_orders, marcar como pago
  IF p_order_nsu IS NOT NULL THEN
    UPDATE public.payment_orders
    SET status = 'paid',
        paid_at = now(),
        updated_at = now()
    WHERE order_nsu = p_order_nsu;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'payment_id', v_payment_id,
    'student_id', p_student_id,
    'plan_id', p_plan_id,
    'plan_type', p_plan_type,
    'due_date', v_due_date
  );
END;
$$;
