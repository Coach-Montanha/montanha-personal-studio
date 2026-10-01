-- ==============================================================================
-- Migration: 20261001000000_student_bonus_rpcs.sql
-- Description: Stored Procedures para Agendamento e Cancelamento de Check-in Bônus
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.book_class_with_bonus(
  p_session_id uuid,
  p_student_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id uuid;
  v_student_id uuid;
  v_student record;
  v_session record;
  v_effective_capacity integer;
  v_current_count integer;
  v_session_start timestamptz;
  v_opens_at timestamptz;
  v_closes_at timestamptz;
  v_allow_multi boolean;
  v_attendance_id uuid;
  v_tx_id uuid;
  v_is_admin boolean;
BEGIN
  IF p_session_id IS NULL THEN
    RAISE EXCEPTION 'p_session_id é obrigatório';
  END IF;

  v_caller_id := auth.uid();

  IF p_student_id IS NOT NULL THEN
    v_student_id := p_student_id;
  ELSE
    SELECT id INTO v_student_id
    FROM public.students
    WHERE account_user_id = v_caller_id
    LIMIT 1;

    IF v_student_id IS NULL THEN
      RAISE EXCEPTION 'Perfil de aluno não encontrado para o usuário conectado';
    END IF;
  END IF;

  SELECT id, user_id, account_user_id, bonus_checkins_balance, name
  INTO v_student
  FROM public.students
  WHERE id = v_student_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aluno não encontrado';
  END IF;

  v_is_admin := (v_caller_id IS NOT NULL AND v_caller_id = v_student.user_id) 
                OR public.has_role(v_caller_id, 'admin'::public.app_role)
                OR public.is_super_admin(v_caller_id)
                OR COALESCE(auth.role(), '') = 'service_role';

  IF NOT v_is_admin AND (v_caller_id IS NULL OR v_caller_id <> v_student.account_user_id) THEN
    RAISE EXCEPTION 'Acesso negado: sem autorização para realizar agendamento para este aluno';
  END IF;

  IF v_student.bonus_checkins_balance < 1 THEN
    RAISE EXCEPTION 'Saldo de bônus insuficiente para reservar a aula (saldo atual: %)', v_student.bonus_checkins_balance;
  END IF;

  SELECT cs.id, cs.user_id, cs.class_id, cs.session_date, cs.start_time, cs.capacity_override, cs.status,
         c.name AS class_name, c.capacity AS class_capacity,
         c.checkin_opens_minutes_before, c.checkin_closes_minutes_before,
         c.program_id
  INTO v_session
  FROM public.class_sessions cs
  JOIN public.classes c ON c.id = cs.class_id
  WHERE cs.id = p_session_id
  FOR UPDATE OF cs;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Sessão de aula não encontrada ou sem turma vinculada';
  END IF;

  IF v_session.user_id <> v_student.user_id THEN
    RAISE EXCEPTION 'A sessão selecionada pertence a outro studio';
  END IF;

  IF v_session.status <> 'scheduled' THEN
    RAISE EXCEPTION 'Não é possível agendar nesta aula (status da sessão: %)', v_session.status;
  END IF;

  v_session_start := ((v_session.session_date::text || ' ' || substring(v_session.start_time::text from 1 for 8) || '-03')::timestamptz);
  v_opens_at := v_session_start - (COALESCE(v_session.checkin_opens_minutes_before, 60) * interval '1 minute');
  v_closes_at := v_session_start - (COALESCE(v_session.checkin_closes_minutes_before, 15) * interval '1 minute');

  IF NOT v_is_admin THEN
    IF now() < v_opens_at THEN
      RAISE EXCEPTION 'Check-in ainda não está aberto (abre às %)', 
        to_char(v_opens_at AT TIME ZONE 'America/Sao_Paulo', 'HH24:MI');
    END IF;
    IF now() > v_closes_at THEN
      RAISE EXCEPTION 'Check-in encerrado para esta aula (encerrou às %)', 
        to_char(v_closes_at AT TIME ZONE 'America/Sao_Paulo', 'HH24:MI');
    END IF;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.class_attendance
    WHERE session_id = p_session_id AND student_id = v_student.id
  ) THEN
    RAISE EXCEPTION 'Você já possui check-in nesta sessão';
  END IF;

  v_effective_capacity := COALESCE(v_session.capacity_override, v_session.class_capacity, 10);
  
  SELECT count(*) INTO v_current_count
  FROM public.class_attendance
  WHERE session_id = p_session_id;

  IF v_current_count >= v_effective_capacity THEN
    RAISE EXCEPTION 'Turma sem vagas disponíveis (% de % vagas preenchidas)', v_current_count, v_effective_capacity;
  END IF;

  IF v_session.program_id IS NOT NULL THEN
    SELECT allow_multi_checkin_same_program_per_day INTO v_allow_multi
    FROM public.studio_settings
    WHERE user_id = v_student.user_id;

    IF NOT COALESCE(v_allow_multi, false) THEN
      IF EXISTS (
        SELECT 1
        FROM public.class_attendance ca
        JOIN public.class_sessions cs2 ON cs2.id = ca.session_id
        JOIN public.classes c2 ON c2.id = cs2.class_id
        WHERE ca.student_id = v_student.id
          AND cs2.session_date = v_session.session_date
          AND c2.program_id = v_session.program_id
      ) THEN
        RAISE EXCEPTION 'Você já fez check-in em outra aula deste programa hoje';
      END IF;
    END IF;
  END IF;

  UPDATE public.students
  SET bonus_checkins_balance = bonus_checkins_balance - 1,
      updated_at = now()
  WHERE id = v_student.id;

  INSERT INTO public.class_attendance (
    user_id,
    session_id,
    student_id,
    status,
    is_bonus
  ) VALUES (
    v_session.user_id,
    p_session_id,
    v_student.id,
    'present',
    true
  )
  RETURNING id INTO v_attendance_id;

  INSERT INTO public.student_bonus_transactions (
    user_id,
    student_id,
    amount,
    transaction_type,
    session_id,
    attendance_id,
    reason,
    created_by
  ) VALUES (
    v_session.user_id,
    v_student.id,
    -1,
    'usage',
    p_session_id,
    v_attendance_id,
    'Agendamento de aula com bônus (' || v_session.class_name || ')',
    v_caller_id
  )
  RETURNING id INTO v_tx_id;

  RETURN jsonb_build_object(
    'success', true,
    'session_id', p_session_id,
    'student_id', v_student.id,
    'student_name', v_student.name,
    'class_name', v_session.class_name,
    'attendance_id', v_attendance_id,
    'transaction_id', v_tx_id,
    'remaining_balance', v_student.bonus_checkins_balance - 1
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_class_checkin(
  p_session_id uuid,
  p_student_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id uuid;
  v_student_id uuid;
  v_student record;
  v_session record;
  v_attendance record;
  v_session_start timestamptz;
  v_closes_at timestamptz;
  v_tx_id uuid;
  v_was_bonus boolean := false;
  v_new_balance integer;
  v_is_admin boolean;
BEGIN
  IF p_session_id IS NULL THEN
    RAISE EXCEPTION 'p_session_id é obrigatório';
  END IF;

  v_caller_id := auth.uid();

  IF p_student_id IS NOT NULL THEN
    v_student_id := p_student_id;
  ELSE
    SELECT id INTO v_student_id
    FROM public.students
    WHERE account_user_id = v_caller_id
    LIMIT 1;

    IF v_student_id IS NULL THEN
      RAISE EXCEPTION 'Perfil de aluno não encontrado para o usuário conectado';
    END IF;
  END IF;

  SELECT id, user_id, account_user_id, bonus_checkins_balance, name
  INTO v_student
  FROM public.students
  WHERE id = v_student_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aluno não encontrado';
  END IF;

  v_is_admin := (v_caller_id IS NOT NULL AND v_caller_id = v_student.user_id) 
                OR public.has_role(v_caller_id, 'admin'::public.app_role)
                OR public.is_super_admin(v_caller_id)
                OR COALESCE(auth.role(), '') = 'service_role';

  IF NOT v_is_admin AND (v_caller_id IS NULL OR v_caller_id <> v_student.account_user_id) THEN
    RAISE EXCEPTION 'Acesso negado: sem autorização para cancelar agendamento deste aluno';
  END IF;

  SELECT id, is_bonus, user_id
  INTO v_attendance
  FROM public.class_attendance
  WHERE session_id = p_session_id AND student_id = v_student.id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Você não possui check-in confirmado nesta aula';
  END IF;

  v_was_bonus := COALESCE(v_attendance.is_bonus, false);

  SELECT cs.id, cs.user_id, cs.session_date, cs.start_time,
         c.name AS class_name, c.checkin_closes_minutes_before
  INTO v_session
  FROM public.class_sessions cs
  JOIN public.classes c ON c.id = cs.class_id
  WHERE cs.id = p_session_id;

  v_session_start := ((v_session.session_date::text || ' ' || substring(v_session.start_time::text from 1 for 8) || '-03')::timestamptz);
  v_closes_at := v_session_start - (COALESCE(v_session.checkin_closes_minutes_before, 15) * interval '1 minute');

  IF NOT v_is_admin AND now() > v_closes_at THEN
    RAISE EXCEPTION 'Prazo de cancelamento expirado para esta aula (limite foi às %)',
      to_char(v_closes_at AT TIME ZONE 'America/Sao_Paulo', 'HH24:MI');
  END IF;

  DELETE FROM public.class_attendance
  WHERE id = v_attendance.id;

  v_new_balance := v_student.bonus_checkins_balance;

  IF v_was_bonus THEN
    v_new_balance := v_student.bonus_checkins_balance + 1;

    UPDATE public.students
    SET bonus_checkins_balance = v_new_balance,
        updated_at = now()
    WHERE id = v_student.id;

    INSERT INTO public.student_bonus_transactions (
      user_id,
      student_id,
      amount,
      transaction_type,
      session_id,
      attendance_id,
      reason,
      created_by
    ) VALUES (
      v_attendance.user_id,
      v_student.id,
      1,
      'refund',
      p_session_id,
      v_attendance.id,
      'Estorno de check-in cancelado (' || v_session.class_name || ')',
      v_caller_id
    )
    RETURNING id INTO v_tx_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'session_id', p_session_id,
    'student_id', v_student.id,
    'student_name', v_student.name,
    'was_bonus', v_was_bonus,
    'refunded', v_was_bonus,
    'new_balance', v_new_balance,
    'refund_transaction_id', v_tx_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.book_class_with_bonus(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.book_class_with_bonus(uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.cancel_class_checkin(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_class_checkin(uuid, uuid) TO service_role;
