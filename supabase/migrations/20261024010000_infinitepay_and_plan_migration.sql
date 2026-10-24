-- Migração para suporte a pedidos de pagamento, InfinitePay Checkout e migração automática de planos
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_nsu text UNIQUE NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES public.plans(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL,
  payment_method text NOT NULL DEFAULT 'infinitepay', -- 'infinitepay', 'pix', 'credit_card', 'cash'
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'cancelled'
  checkout_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  paid_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Índices para buscas rápidas
CREATE INDEX IF NOT EXISTS idx_payment_orders_order_nsu ON public.payment_orders(order_nsu);
CREATE INDEX IF NOT EXISTS idx_payment_orders_student_id ON public.payment_orders(student_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON public.payment_orders(status);

-- RLS
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view and manage payment orders"
  ON public.payment_orders
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can view their own payment orders"
  ON public.payment_orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = payment_orders.student_id
      AND s.account_user_id = auth.uid()
    )
  );

-- Função RPC para processar e efetivar a transição de plano após confirmação de pagamento
CREATE OR REPLACE FUNCTION public.apply_plan_migration_and_payment(
  p_student_id uuid,
  p_plan_id uuid,
  p_amount numeric,
  p_payment_method text,
  p_order_nsu text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_billing_cycle text;
  v_today date := CURRENT_DATE;
  v_due_date date;
  v_payment_id uuid;
BEGIN
  -- 1. Obter dados do plano e do studio
  SELECT user_id, billing_cycle
  INTO v_user_id, v_billing_cycle
  FROM public.plans
  WHERE id = p_plan_id;

  IF NOT FOUND THEN
    -- Fallback se o plano não for encontrado
    SELECT user_id INTO v_user_id FROM public.students WHERE id = p_student_id;
    v_billing_cycle := 'monthly';
  END IF;

  -- 2. Calcular due_date com base no ciclo
  IF v_billing_cycle = 'quarterly' THEN
    v_due_date := v_today + INTERVAL '3 months';
  ELSIF v_billing_cycle = 'semiannual' THEN
    v_due_date := v_today + INTERVAL '6 months';
  ELSIF v_billing_cycle = 'annual' THEN
    v_due_date := v_today + INTERVAL '12 months';
  ELSE
    v_due_date := v_today + INTERVAL '1 month';
  END IF;

  -- 3. Fechar plano anterior no histórico
  UPDATE public.student_plan_history
  SET end_date = v_today,
      is_current = false,
      updated_at = now()
  WHERE student_id = p_student_id
    AND is_current = true;

  -- 4. Inserir novo plano no histórico
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

  -- 5. Atualizar status do aluno para ativo
  UPDATE public.students
  SET status = 'active',
      updated_at = now()
  WHERE id = p_student_id;

  -- 6. Inserir o pagamento correspondente
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

  -- 7. Se houver pedido registrado, marcar como pago
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
    'due_date', v_due_date
  );
END;
$$;
