-- ==============================================================================
-- Migration: 20261011220000_prevent_active_plan_students_churn.sql
-- Description: Garante que alunos com plano ativo (student_plan_history com is_current = true)
-- NUNCA entrem em churn automático ('churned'), preservando sua matrícula e vínculo.
-- Se houver pendência financeira, o status máximo de penalização é 'inactive' (inadimplente),
-- jamais 'churned' (desligamento que exige cancelamento explícito).
-- ==============================================================================

-- 1. Atualizar recalculate_student_status (Studio)
CREATE OR REPLACE FUNCTION public.recalculate_student_status(p_student_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_student record;
  v_last_paid_date date;
  v_max_due_date date;
  v_is_frozen boolean;
  v_has_active_plan boolean;
  v_new_status text;
BEGIN
  -- Carrega dados do aluno
  SELECT id, user_id, status, COALESCE(bonus_checkins_balance, 0) AS bonus_balance
  INTO v_student
  FROM public.students
  WHERE id = p_student_id;

  IF NOT FOUND THEN RETURN; END IF;

  -- REGRA 1: Aluno com saldo de bônus ativo (> 0) NUNCA pode ser inativado por falta de pagamento!
  IF v_student.bonus_balance > 0 THEN
    IF v_student.status IN ('inactive', 'churned') THEN
      UPDATE public.students SET status = 'active', updated_at = now() WHERE id = p_student_id;
    END IF;
    RETURN;
  END IF;

  -- REGRA 2: Verifica se o aluno possui trancamento ativo (período corrente)
  SELECT EXISTS (
    SELECT 1 FROM public.payment_freezes
    WHERE student_id = p_student_id
      AND start_date <= CURRENT_DATE
      AND end_date >= CURRENT_DATE
  ) INTO v_is_frozen;

  IF v_is_frozen THEN
    IF v_student.status <> 'paused' THEN
      UPDATE public.students SET status = 'paused', updated_at = now() WHERE id = p_student_id;
    END IF;
    RETURN;
  END IF;

  -- REGRA 3: Aluno com plano ativo vinculado (student_plan_history is_current = true)
  SELECT EXISTS (
    SELECT 1 FROM public.student_plan_history sph
    JOIN public.plans p ON p.id = sph.plan_id
    WHERE sph.student_id = p_student_id
      AND sph.is_current = true
      AND (sph.end_date IS NULL OR sph.end_date >= CURRENT_DATE)
  ) INTO v_has_active_plan;

  -- Verifica vencimento mais recente de pagamento pago (ou futuro)
  SELECT MAX(due_date::date) INTO v_max_due_date
  FROM public.payments
  WHERE student_id = p_student_id AND status = 'paid' AND due_date IS NOT NULL;

  IF v_max_due_date IS NOT NULL AND v_max_due_date >= CURRENT_DATE THEN
    v_new_status := 'active';
  ELSE
    SELECT MAX(payment_date::date) INTO v_last_paid_date
    FROM public.payments
    WHERE student_id = p_student_id AND status = 'paid';

    IF v_last_paid_date IS NULL THEN
      -- Sem histórico de pagamento: se tem plano ativo, fica 'active' ou 'inactive', NUNCA 'churned'!
      IF v_has_active_plan THEN
        v_new_status := 'active';
      ELSE
        v_new_status := 'churned';
      END IF;
    ELSE
      IF (CURRENT_DATE - v_last_paid_date) <= 30 THEN
        v_new_status := 'active';
      ELSIF (CURRENT_DATE - v_last_paid_date) <= 60 THEN
        v_new_status := 'inactive';
      ELSE
        -- REGRA MESTRA: Aluno com plano ativo NUNCA entra em churn automático!
        IF v_has_active_plan THEN
          v_new_status := 'inactive';
        ELSE
          v_new_status := 'churned';
        END IF;
      END IF;
    END IF;
  END IF;

  -- Salvaguarda: se tem plano ativo e o resultado deu churn, bloqueia churn
  IF v_has_active_plan AND v_new_status = 'churned' THEN
    v_new_status := 'inactive';
  END IF;

  IF v_student.status IS DISTINCT FROM v_new_status THEN
    UPDATE public.students SET status = v_new_status, updated_at = now() WHERE id = p_student_id;
  END IF;
END;
$function$;

-- 2. Atualizar recalculate_pt_student_status (Personal Trainer)
CREATE OR REPLACE FUNCTION public.recalculate_pt_student_status(p_student_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_student record;
  v_last_paid_date date;
  v_max_due_date date;
  v_is_frozen boolean;
  v_has_active_plan boolean;
  v_new_status text;
BEGIN
  SELECT id, user_id, status
  INTO v_student
  FROM public.pt_students
  WHERE id = p_student_id;

  IF NOT FOUND THEN RETURN; END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.payment_freezes
    WHERE student_id = p_student_id
      AND start_date <= CURRENT_DATE
      AND end_date >= CURRENT_DATE
  ) INTO v_is_frozen;

  IF v_is_frozen THEN
    IF v_student.status <> 'paused' THEN
      UPDATE public.pt_students SET status = 'paused', updated_at = now() WHERE id = p_student_id;
    END IF;
    RETURN;
  END IF;

  -- Verifica se possui plano/pagamento vigente
  SELECT EXISTS (
    SELECT 1 FROM public.pt_payments pp
    WHERE pp.pt_student_id = p_student_id
      AND pp.status = 'paid'
      AND (pp.due_date IS NULL OR pp.due_date >= CURRENT_DATE)
  ) INTO v_has_active_plan;

  SELECT MAX(due_date::date) INTO v_max_due_date
  FROM public.pt_payments
  WHERE pt_student_id = p_student_id AND status = 'paid' AND due_date IS NOT NULL;

  IF v_max_due_date IS NOT NULL AND v_max_due_date >= CURRENT_DATE THEN
    v_new_status := 'active';
  ELSE
    SELECT MAX(payment_date::date) INTO v_last_paid_date
    FROM public.pt_payments
    WHERE pt_student_id = p_student_id AND status = 'paid';

    IF v_last_paid_date IS NULL THEN
      IF v_has_active_plan THEN
        v_new_status := 'active';
      ELSE
        v_new_status := 'churned';
      END IF;
    ELSE
      IF (CURRENT_DATE - v_last_paid_date) <= 30 THEN
        v_new_status := 'active';
      ELSIF (CURRENT_DATE - v_last_paid_date) <= 60 THEN
        v_new_status := 'inactive';
      ELSE
        IF v_has_active_plan THEN
          v_new_status := 'inactive';
        ELSE
          v_new_status := 'churned';
        END IF;
      END IF;
    END IF;
  END IF;

  IF v_has_active_plan AND v_new_status = 'churned' THEN
    v_new_status := 'inactive';
  END IF;

  IF v_student.status IS DISTINCT FROM v_new_status THEN
    UPDATE public.pt_students SET status = v_new_status, updated_at = now() WHERE id = p_student_id;
  END IF;
END;
$function$;

-- 3. Restauração imediata de todos os alunos com plano ativo que estavam em churn
UPDATE public.students s
SET status = 'active', updated_at = now()
WHERE s.status = 'churned'
  AND EXISTS (
    SELECT 1 FROM public.student_plan_history sph
    JOIN public.plans p ON p.id = sph.plan_id
    WHERE sph.student_id = s.id
      AND sph.is_current = true
      AND (sph.end_date IS NULL OR sph.end_date >= CURRENT_DATE)
  );

UPDATE public.pt_students ps
SET status = 'active', updated_at = now()
WHERE ps.status = 'churned'
  AND EXISTS (
    SELECT 1 FROM public.pt_payments pp
    WHERE pp.pt_student_id = ps.id
      AND pp.status = 'paid'
      AND (pp.due_date IS NULL OR pp.due_date >= CURRENT_DATE)
  );
