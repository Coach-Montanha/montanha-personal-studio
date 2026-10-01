-- ==============================================================================
-- Migration: 20261001170000_protect_students_with_bonus_status.sql
-- Description: Garante que alunos com saldo de bônus ativo (> 0) NUNCA sejam
-- inativados por falta de pagamento, além de respeitar a vigência do vencimento (due_date)
-- e o período de trancamento ativo (payment_freezes).
-- ==============================================================================

-- 1. recalculate_student_status (Individual Studio Student)
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
  v_new_status text;
BEGIN
  -- Carrega dados do aluno
  SELECT id, user_id, status, COALESCE(bonus_checkins_balance, 0) AS bonus_balance
  INTO v_student
  FROM public.students
  WHERE id = p_student_id;

  IF NOT FOUND THEN RETURN; END IF;

  -- REGRA MESTRA: Aluno com saldo de bônus ativo (> 0) NUNCA pode ser inativado por falta de pagamento!
  IF v_student.bonus_balance > 0 THEN
    IF v_student.status IN ('inactive', 'churned') THEN
      UPDATE public.students SET status = 'active', updated_at = now() WHERE id = p_student_id;
    END IF;
    RETURN;
  END IF;

  -- Verifica se o aluno possui trancamento ativo (período corrente)
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

  -- Verifica se o aluno possui pagamento com vencimento em aberto ou futuro (plano vigente)
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
      v_new_status := 'churned';
    ELSE
      IF (CURRENT_DATE - v_last_paid_date) <= 30 THEN
        v_new_status := 'active';
      ELSIF (CURRENT_DATE - v_last_paid_date) <= 60 THEN
        v_new_status := 'inactive';
      ELSE
        v_new_status := 'churned';
      END IF;
    END IF;
  END IF;

  IF v_student.status IS DISTINCT FROM v_new_status THEN
    UPDATE public.students SET status = v_new_status, updated_at = now() WHERE id = p_student_id;
  END IF;
END;
$function$;

-- 2. recalculate_all_student_statuses_for (Todos alunos de um Studio)
CREATE OR REPLACE FUNCTION public.recalculate_all_student_statuses_for(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  r RECORD;
BEGIN
  IF p_user_id IS NULL THEN RAISE EXCEPTION 'user_id required'; END IF;
  FOR r IN SELECT id FROM public.students WHERE user_id = p_user_id LOOP
    PERFORM public.recalculate_student_status(r.id);
  END LOOP;
END;
$function$;

-- 3. recalculate_all_student_statuses (Global Studio)
CREATE OR REPLACE FUNCTION public.recalculate_all_student_statuses()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM public.students LOOP
    PERFORM public.recalculate_student_status(r.id);
  END LOOP;
END;
$function$;

-- 4. recalculate_pt_student_status (Individual Personal Trainer)
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
      v_new_status := 'churned';
    ELSE
      IF (CURRENT_DATE - v_last_paid_date) <= 30 THEN
        v_new_status := 'active';
      ELSIF (CURRENT_DATE - v_last_paid_date) <= 60 THEN
        v_new_status := 'inactive';
      ELSE
        v_new_status := 'churned';
      END IF;
    END IF;
  END IF;

  IF v_student.status IS DISTINCT FROM v_new_status THEN
    UPDATE public.pt_students SET status = v_new_status, updated_at = now() WHERE id = p_student_id;
  END IF;
END;
$function$;

-- 5. recalculate_all_pt_student_statuses_for (Todos alunos de um Personal)
CREATE OR REPLACE FUNCTION public.recalculate_all_pt_student_statuses_for(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  r RECORD;
BEGIN
  IF p_user_id IS NULL THEN RAISE EXCEPTION 'user_id required'; END IF;
  FOR r IN SELECT id FROM public.pt_students WHERE user_id = p_user_id LOOP
    PERFORM public.recalculate_pt_student_status(r.id);
  END LOOP;
END;
$function$;

-- 6. Reativação automática imediata de todos os alunos que possuem saldo de bônus > 0
UPDATE public.students
SET status = 'active', updated_at = now()
WHERE bonus_checkins_balance > 0 AND status IN ('inactive', 'churned');
