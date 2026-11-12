-- ==============================================================================
-- Migration: 20261112080000_fix_pt_student_active_status_and_programs.sql
-- Description: Garante que alunos de Personal Trainer com programa de treino ativo,
-- vínculo Studio ativo ou pagamentos vigentes/recentes NUNCA fiquem inativos ou em churn.
-- ==============================================================================

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
  v_has_active_program boolean;
  v_has_active_plan boolean;
  v_has_active_studio boolean;
  v_new_status text;
BEGIN
  SELECT id, user_id, status, training_plan, email
  INTO v_student
  FROM public.pt_students
  WHERE id = p_student_id;

  IF NOT FOUND THEN RETURN; END IF;

  -- 1. Verifica trancamento ativo
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

  -- 2. REGRA MESTRA: Aluno com programa de treino ativo ou ficha de treino NUNCA fica inativo/churn!
  SELECT EXISTS (
    SELECT 1 FROM public.pt_programs
    WHERE pt_student_id = p_student_id
      AND is_active = true
      AND is_deleted = false
  ) OR (v_student.training_plan IS NOT NULL AND trim(v_student.training_plan) <> '')
  INTO v_has_active_program;

  IF v_has_active_program THEN
    IF v_student.status <> 'active' THEN
      UPDATE public.pt_students SET status = 'active', updated_at = now() WHERE id = p_student_id;
    END IF;
    RETURN;
  END IF;

  -- 3. Verifica se possui vínculo ativo no Studio (mesmo ID ou mesmo e-mail)
  SELECT EXISTS (
    SELECT 1 FROM public.students s
    WHERE (s.id = p_student_id OR (v_student.email IS NOT NULL AND s.email ILIKE v_student.email))
      AND s.status = 'active'
  ) OR EXISTS (
    SELECT 1 FROM public.payments p
    JOIN public.students s ON s.id = p.student_id
    WHERE (s.id = p_student_id OR (v_student.email IS NOT NULL AND s.email ILIKE v_student.email))
      AND p.status = 'paid'
      AND (p.due_date IS NULL OR p.due_date >= CURRENT_DATE OR (CURRENT_DATE - p.payment_date) <= 45)
  ) INTO v_has_active_studio;

  IF v_has_active_studio THEN
    IF v_student.status <> 'active' THEN
      UPDATE public.pt_students SET status = 'active', updated_at = now() WHERE id = p_student_id;
    END IF;
    RETURN;
  END IF;

  -- 4. Verifica pagamentos vigentes ou recentes no Personal
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
      IF (CURRENT_DATE - v_last_paid_date) <= 45 THEN
        v_new_status := 'active';
      ELSIF (CURRENT_DATE - v_last_paid_date) <= 90 THEN
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
