-- ==============================================================================
-- Migration: 20260924000000_student_bonus_checkins.sql
-- Description: Schema extensions, ledger, and atomic RPCs for Student Bonus Check-ins
-- Milestone: M1 — Database Schema, Ledger & Atomic RPCs
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Students: Bonus Check-ins Balance
-- ------------------------------------------------------------------------------
ALTER TABLE public.students 
  ADD COLUMN IF NOT EXISTS bonus_checkins_balance integer NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'students_bonus_checkins_balance_check'
      AND conrelid = 'public.students'::regclass
  ) THEN
    ALTER TABLE public.students
      ADD CONSTRAINT students_bonus_checkins_balance_check CHECK (bonus_checkins_balance >= 0);
  END IF;
END $$;

-- Fast index for studio owner queries filtering students with active bonus balance
CREATE INDEX IF NOT EXISTS idx_students_bonus_balance 
  ON public.students(user_id, bonus_checkins_balance) 
  WHERE bonus_checkins_balance > 0;

-- ------------------------------------------------------------------------------
-- 2. Class Attendance: Bonus Booking Indicator
-- ------------------------------------------------------------------------------
ALTER TABLE public.class_attendance 
  ADD COLUMN IF NOT EXISTS is_bonus boolean NOT NULL DEFAULT false;

-- Composite index to accelerate computeQuotaUsage (filtering regular plan vs bonus check-ins)
CREATE INDEX IF NOT EXISTS idx_class_attendance_student_is_bonus 
  ON public.class_attendance(student_id, is_bonus);

-- Partial index for fast lookups of bonus attendees in session management
CREATE INDEX IF NOT EXISTS idx_class_attendance_is_bonus 
  ON public.class_attendance(session_id) 
  WHERE is_bonus = true;

-- ------------------------------------------------------------------------------
-- 3. Student Bonus Transactions (Immutable Audit Ledger)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_bonus_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  transaction_type text NOT NULL,
  related_student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
  session_id uuid REFERENCES public.class_sessions(id) ON DELETE SET NULL,
  attendance_id uuid REFERENCES public.class_attendance(id) ON DELETE SET NULL,
  reason text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT sbt_amount_nonzero CHECK (amount <> 0),
  CONSTRAINT sbt_transaction_type_check CHECK (
    transaction_type IN ('grant', 'adjustment', 'usage', 'checkin', 'refund', 'transfer_in', 'transfer_out')
  ),
  CONSTRAINT sbt_amount_sign_check CHECK (
    (transaction_type = 'grant' AND amount > 0) OR
    (transaction_type = 'transfer_in' AND amount > 0) OR
    (transaction_type = 'refund' AND amount > 0) OR
    (transaction_type = 'usage' AND amount < 0) OR
    (transaction_type = 'checkin' AND amount < 0) OR
    (transaction_type = 'transfer_out' AND amount < 0) OR
    (transaction_type = 'adjustment' AND amount <> 0)
  ),
  CONSTRAINT sbt_distinct_students CHECK (
    related_student_id IS NULL OR related_student_id <> student_id
  )
);

-- Indices for high-frequency queries
CREATE INDEX IF NOT EXISTS idx_sbt_student_created 
  ON public.student_bonus_transactions(student_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sbt_user_created 
  ON public.student_bonus_transactions(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sbt_session 
  ON public.student_bonus_transactions(session_id) 
  WHERE session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sbt_related_student 
  ON public.student_bonus_transactions(related_student_id) 
  WHERE related_student_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sbt_attendance 
  ON public.student_bonus_transactions(attendance_id) 
  WHERE attendance_id IS NOT NULL;

-- ------------------------------------------------------------------------------
-- 4. Permissions & Row Level Security (RLS) for Ledger
-- ------------------------------------------------------------------------------
-- Enforce append-only ledger: only SELECT and INSERT are granted to authenticated
GRANT SELECT, INSERT ON public.student_bonus_transactions TO authenticated;
GRANT ALL ON public.student_bonus_transactions TO service_role;

ALTER TABLE public.student_bonus_transactions ENABLE ROW LEVEL SECURITY;

-- Policy 1: Studio owner reads all transactions in their studio
DROP POLICY IF EXISTS "admin reads studio bonus transactions" ON public.student_bonus_transactions;
CREATE POLICY "admin reads studio bonus transactions" 
  ON public.student_bonus_transactions 
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

-- Policy 2: Studio owner inserts transactions for students in their studio
DROP POLICY IF EXISTS "admin inserts studio bonus transactions" ON public.student_bonus_transactions;
CREATE POLICY "admin inserts studio bonus transactions" 
  ON public.student_bonus_transactions 
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Student reads only their own transactions via account_user_id
DROP POLICY IF EXISTS "student reads own bonus transactions" ON public.student_bonus_transactions;
CREATE POLICY "student reads own bonus transactions" 
  ON public.student_bonus_transactions 
  FOR SELECT TO authenticated 
  USING (
    student_id IN (
      SELECT id FROM public.students WHERE account_user_id = auth.uid()
    )
  );

-- Policy 4: Super Admin read access (strictly read-only)
DROP POLICY IF EXISTS "Super admin can read all bonus transactions" ON public.student_bonus_transactions;
CREATE POLICY "Super admin can read all bonus transactions" 
  ON public.student_bonus_transactions 
  FOR SELECT TO authenticated 
  USING (public.is_super_admin(auth.uid()));

-- ------------------------------------------------------------------------------
-- 5. Atomic Stored Procedure: admin_adjust_bonus_checkins
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_adjust_bonus_checkins(
  p_student_id uuid,
  p_amount integer,
  p_reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id uuid;
  v_student record;
  v_new_balance integer;
  v_tx_type text;
  v_tx_id uuid;
BEGIN
  -- 1. Validação de parâmetros
  IF p_student_id IS NULL THEN
    RAISE EXCEPTION 'student_id é obrigatório';
  END IF;

  IF p_amount IS NULL OR p_amount = 0 THEN
    RAISE EXCEPTION 'A quantidade para ajuste deve ser diferente de zero';
  END IF;

  v_caller_id := auth.uid();

  -- 2. Lock atômico exclusivo na linha do aluno
  SELECT id, user_id, bonus_checkins_balance, name
  INTO v_student
  FROM public.students
  WHERE id = p_student_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aluno não encontrado (id: %)', p_student_id;
  END IF;

  -- 3. Autorização: gestor do studio, admin da plataforma ou service_role
  IF v_caller_id IS NOT NULL 
     AND v_caller_id <> v_student.user_id 
     AND NOT public.has_role(v_caller_id, 'admin'::public.app_role) 
     AND NOT public.is_super_admin(v_caller_id)
     AND COALESCE(auth.role(), '') <> 'service_role' THEN
    RAISE EXCEPTION 'Acesso negado: você não tem permissão para gerenciar este aluno';
  END IF;

  -- 4. Cálculo e validação contra saldo negativo
  v_new_balance := v_student.bonus_checkins_balance + p_amount;
  IF v_new_balance < 0 THEN
    RAISE EXCEPTION 'Saldo insuficiente de bônus. Saldo atual: %, ajuste solicitado: %', 
      v_student.bonus_checkins_balance, p_amount;
  END IF;

  -- 5. Definição do tipo contábil da transação
  IF p_amount > 0 THEN
    v_tx_type := 'grant';
  ELSE
    v_tx_type := 'adjustment';
  END IF;

  -- 6. Atualização atômica do saldo
  UPDATE public.students
  SET bonus_checkins_balance = v_new_balance,
      updated_at = now()
  WHERE id = v_student.id;

  -- 7. Registro imutável no ledger
  INSERT INTO public.student_bonus_transactions (
    user_id,
    student_id,
    amount,
    transaction_type,
    reason,
    created_by
  ) VALUES (
    v_student.user_id,
    v_student.id,
    p_amount,
    v_tx_type,
    COALESCE(p_reason, CASE WHEN p_amount > 0 THEN 'Concessão de check-ins bônus' ELSE 'Ajuste de check-ins bônus' END),
    v_caller_id
  )
  RETURNING id INTO v_tx_id;

  -- 8. Retorno estruturado em JSON
  RETURN jsonb_build_object(
    'success', true,
    'student_id', v_student.id,
    'student_name', v_student.name,
    'previous_balance', v_student.bonus_checkins_balance,
    'new_balance', v_new_balance,
    'amount', p_amount,
    'transaction_id', v_tx_id,
    'transaction_type', v_tx_type
  );
END;
$$;

-- ------------------------------------------------------------------------------
-- 6. Atomic Stored Procedure: admin_transfer_bonus_checkins
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_transfer_bonus_checkins(
  p_source_student_id uuid,
  p_target_student_id uuid,
  p_amount integer,
  p_reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id uuid;
  v_first_id uuid;
  v_second_id uuid;
  v_rec1 record;
  v_rec2 record;
  v_source record;
  v_target record;
  v_source_new_balance integer;
  v_target_new_balance integer;
  v_tx_out_id uuid;
  v_tx_in_id uuid;
  v_reason text;
BEGIN
  -- 1. Validações preliminares
  IF p_source_student_id IS NULL OR p_target_student_id IS NULL THEN
    RAISE EXCEPTION 'IDs de aluno de origem e destino são obrigatórios';
  END IF;

  IF p_source_student_id = p_target_student_id THEN
    RAISE EXCEPTION 'O aluno de origem e destino não podem ser o mesmo';
  END IF;

  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'A quantidade para transferência deve ser um número inteiro positivo maior que zero';
  END IF;

  v_caller_id := auth.uid();

  -- 2. Ordenação lexicográfica de locks para eliminar possibilidade de deadlocks
  IF p_source_student_id < p_target_student_id THEN
    v_first_id := p_source_student_id;
    v_second_id := p_target_student_id;
  ELSE
    v_first_id := p_target_student_id;
    v_second_id := p_source_student_id;
  END IF;

  -- Lock no primeiro registro ordenado
  SELECT id, user_id, bonus_checkins_balance, name
  INTO v_rec1
  FROM public.students
  WHERE id = v_first_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aluno não encontrado durante a transferência (id: %)', v_first_id;
  END IF;

  -- Lock no segundo registro ordenado
  SELECT id, user_id, bonus_checkins_balance, name
  INTO v_rec2
  FROM public.students
  WHERE id = v_second_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aluno não encontrado durante a transferência (id: %)', v_second_id;
  END IF;

  -- Mapeamento correto de origem e destino
  IF v_rec1.id = p_source_student_id THEN
    v_source := v_rec1;
    v_target := v_rec2;
  ELSE
    v_source := v_rec2;
    v_target := v_rec1;
  END IF;

  -- 3. Isolamento multi-tenant: ambos os alunos devem pertencer ao mesmo studio
  IF v_source.user_id <> v_target.user_id THEN
    RAISE EXCEPTION 'Transferência inválida: alunos pertencem a studios distintos';
  END IF;

  -- 4. Validação de autorização
  IF v_caller_id IS NOT NULL 
     AND v_caller_id <> v_source.user_id 
     AND NOT public.has_role(v_caller_id, 'admin'::public.app_role) 
     AND NOT public.is_super_admin(v_caller_id)
     AND COALESCE(auth.role(), '') <> 'service_role' THEN
    RAISE EXCEPTION 'Acesso negado: você não tem permissão para realizar transferências neste studio';
  END IF;

  -- 5. Checagem de saldo suficiente na origem
  IF v_source.bonus_checkins_balance < p_amount THEN
    RAISE EXCEPTION 'Saldo insuficiente no aluno de origem para transferência. Saldo atual: %, solicitado: %',
      v_source.bonus_checkins_balance, p_amount;
  END IF;

  v_source_new_balance := v_source.bonus_checkins_balance - p_amount;
  v_target_new_balance := v_target.bonus_checkins_balance + p_amount;

  -- 6. Atualização atômica dos saldos
  UPDATE public.students
  SET bonus_checkins_balance = v_source_new_balance,
      updated_at = now()
  WHERE id = v_source.id;

  UPDATE public.students
  SET bonus_checkins_balance = v_target_new_balance,
      updated_at = now()
  WHERE id = v_target.id;

  -- 7. Registro contábil de dupla entrada no ledger
  v_reason := COALESCE(p_reason, 'Transferência de bônus entre alunos');

  -- Débito na origem
  INSERT INTO public.student_bonus_transactions (
    user_id,
    student_id,
    amount,
    transaction_type,
    related_student_id,
    reason,
    created_by
  ) VALUES (
    v_source.user_id,
    v_source.id,
    -p_amount,
    'transfer_out',
    v_target.id,
    v_reason || ' (enviado para ' || v_target.name || ')',
    v_caller_id
  )
  RETURNING id INTO v_tx_out_id;

  -- Crédito no destino
  INSERT INTO public.student_bonus_transactions (
    user_id,
    student_id,
    amount,
    transaction_type,
    related_student_id,
    reason,
    created_by
  ) VALUES (
    v_target.user_id,
    v_target.id,
    p_amount,
    'transfer_in',
    v_source.id,
    v_reason || ' (recebido de ' || v_source.name || ')',
    v_caller_id
  )
  RETURNING id INTO v_tx_in_id;

  -- 8. Retorno do resultado estruturado
  RETURN jsonb_build_object(
    'success', true,
    'amount', p_amount,
    'source_student_id', v_source.id,
    'source_student_name', v_source.name,
    'source_previous_balance', v_source.bonus_checkins_balance,
    'source_new_balance', v_source_new_balance,
    'target_student_id', v_target.id,
    'target_student_name', v_target.name,
    'target_previous_balance', v_target.bonus_checkins_balance,
    'target_new_balance', v_target_new_balance,
    'source_transaction_id', v_tx_out_id,
    'target_transaction_id', v_tx_in_id
  );
END;
$$;

-- ------------------------------------------------------------------------------
-- 7. Atomic Stored Procedure: book_class_with_bonus
-- ------------------------------------------------------------------------------
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
  -- 1. Validação de parâmetros
  IF p_session_id IS NULL THEN
    RAISE EXCEPTION 'p_session_id é obrigatório';
  END IF;

  v_caller_id := auth.uid();

  -- 2. Resolução do perfil de aluno
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

  -- 3. Lock atômico do registro do aluno
  SELECT id, user_id, account_user_id, bonus_checkins_balance, name
  INTO v_student
  FROM public.students
  WHERE id = v_student_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aluno não encontrado';
  END IF;

  -- 4. Verificação de autorização (próprio aluno, gestor ou admin)
  v_is_admin := (v_caller_id IS NOT NULL AND v_caller_id = v_student.user_id) 
                OR public.has_role(v_caller_id, 'admin'::public.app_role)
                OR public.is_super_admin(v_caller_id)
                OR COALESCE(auth.role(), '') = 'service_role';

  IF NOT v_is_admin AND (v_caller_id IS NULL OR v_caller_id <> v_student.account_user_id) THEN
    RAISE EXCEPTION 'Acesso negado: sem autorização para realizar agendamento para este aluno';
  END IF;

  -- 5. Checagem estrita de saldo de bônus
  IF v_student.bonus_checkins_balance < 1 THEN
    RAISE EXCEPTION 'Saldo de bônus insuficiente para reservar a aula (saldo atual: %)', v_student.bonus_checkins_balance;
  END IF;

  -- 6. Lock atômico da sessão de aula
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

  -- 7. Validação de tenant
  IF v_session.user_id <> v_student.user_id THEN
    RAISE EXCEPTION 'A sessão selecionada pertence a outro studio';
  END IF;

  -- 8. Validação de status da sessão
  IF v_session.status <> 'scheduled' THEN
    RAISE EXCEPTION 'Não é possível agendar nesta aula (status da sessão: %)', v_session.status;
  END IF;

  -- 9. Validação da janela de agendamento (fuso de Brasília UTC-3)
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

  -- 10. Validação de duplicidade (aluno já presente na sessão)
  IF EXISTS (
    SELECT 1 FROM public.class_attendance
    WHERE session_id = p_session_id AND student_id = v_student.id
  ) THEN
    RAISE EXCEPTION 'Você já possui check-in nesta sessão';
  END IF;

  -- 11. Validação de capacidade da turma sob lock serializado
  v_effective_capacity := COALESCE(v_session.capacity_override, v_session.class_capacity, 10);
  
  SELECT count(*) INTO v_current_count
  FROM public.class_attendance
  WHERE session_id = p_session_id;

  IF v_current_count >= v_effective_capacity THEN
    RAISE EXCEPTION 'Turma sem vagas disponíveis (% de % vagas preenchidas)', v_current_count, v_effective_capacity;
  END IF;

  -- 12. Regra de programa único por dia (se configurado no studio)
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

  -- 13. Débito atômico de 1 crédito bônus
  UPDATE public.students
  SET bonus_checkins_balance = bonus_checkins_balance - 1,
      updated_at = now()
  WHERE id = v_student.id;

  -- 14. Inserção da reserva com flag is_bonus = true
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

  -- 15. Registro de débito no ledger
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

  -- 16. Retorno de confirmação
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

-- ------------------------------------------------------------------------------
-- 8. Atomic Stored Procedure: cancel_class_checkin
-- ------------------------------------------------------------------------------
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
  v_is_coach boolean;
  v_refunded boolean := false;
  v_new_balance integer;
  v_tx_id uuid := NULL;
BEGIN
  -- 1. Validação de parâmetros
  IF p_session_id IS NULL THEN
    RAISE EXCEPTION 'p_session_id é obrigatório';
  END IF;

  v_caller_id := auth.uid();

  -- 2. Resolução do aluno
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

  -- 3. Lock atômico do aluno (ordem consistente: students -> class_sessions -> attendance)
  SELECT id, user_id, account_user_id, bonus_checkins_balance, name
  INTO v_student
  FROM public.students
  WHERE id = v_student_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aluno não encontrado';
  END IF;

  -- 4. Verificação de permissão
  v_is_coach := (v_caller_id IS NOT NULL AND v_caller_id = v_student.user_id) 
                OR public.has_role(v_caller_id, 'admin'::public.app_role)
                OR public.is_super_admin(v_caller_id)
                OR COALESCE(auth.role(), '') = 'service_role';

  IF NOT v_is_coach AND (v_caller_id IS NULL OR v_caller_id <> v_student.account_user_id) THEN
    RAISE EXCEPTION 'Acesso negado: sem autorização para cancelar este agendamento';
  END IF;

  -- 5. Lock da presença em class_attendance
  SELECT id, user_id, session_id, student_id, status, is_bonus
  INTO v_attendance
  FROM public.class_attendance
  WHERE session_id = p_session_id AND student_id = v_student.id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Nenhum check-in encontrado para este aluno nesta sessão';
  END IF;

  -- 6. Verificação do prazo limite de cancelamento
  SELECT cs.id, cs.user_id, cs.session_date, cs.start_time,
         c.name AS class_name, c.checkin_closes_minutes_before
  INTO v_session
  FROM public.class_sessions cs
  JOIN public.classes c ON c.id = cs.class_id
  WHERE cs.id = p_session_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Sessão da aula não encontrada';
  END IF;

  v_session_start := ((v_session.session_date::text || ' ' || substring(v_session.start_time::text from 1 for 8) || '-03')::timestamptz);
  v_closes_at := v_session_start - (COALESCE(v_session.checkin_closes_minutes_before, 15) * interval '1 minute');

  -- O aluno só pode cancelar se a janela de cancelamento ainda estiver aberta
  IF NOT v_is_coach AND now() > v_closes_at THEN
    RAISE EXCEPTION 'Cancelamento encerrado para esta aula (encerrou às %)',
      to_char(v_closes_at AT TIME ZONE 'America/Sao_Paulo', 'HH24:MI');
  END IF;

  -- 7. Restituição condicional do bônus
  v_new_balance := v_student.bonus_checkins_balance;

  IF v_attendance.is_bonus IS TRUE THEN
    v_new_balance := v_student.bonus_checkins_balance + 1;
    v_refunded := true;

    UPDATE public.students
    SET bonus_checkins_balance = v_new_balance,
        updated_at = now()
    WHERE id = v_student.id;

    -- Registro do estorno no ledger
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
      1,
      'refund',
      p_session_id,
      v_attendance.id,
      'Estorno de check-in bônus por cancelamento de aula (' || v_session.class_name || ')',
      v_caller_id
    )
    RETURNING id INTO v_tx_id;
  END IF;

  -- 8. Remoção atômica do registro de presença
  DELETE FROM public.class_attendance
  WHERE id = v_attendance.id;

  -- 9. Retorno do resultado estruturado
  RETURN jsonb_build_object(
    'success', true,
    'session_id', p_session_id,
    'student_id', v_student.id,
    'student_name', v_student.name,
    'class_name', v_session.class_name,
    'was_bonus', v_attendance.is_bonus,
    'refunded', v_refunded,
    'refund_transaction_id', v_tx_id,
    'new_balance', v_new_balance
  );
END;
$$;

-- ------------------------------------------------------------------------------
-- 9. Execution Grants and Security Tightening for RPC Functions
-- ------------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.admin_adjust_bonus_checkins(uuid, integer, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_adjust_bonus_checkins(uuid, integer, text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.admin_transfer_bonus_checkins(uuid, uuid, integer, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_transfer_bonus_checkins(uuid, uuid, integer, text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.book_class_with_bonus(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.book_class_with_bonus(uuid, uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.cancel_class_checkin(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_class_checkin(uuid, uuid) TO authenticated, service_role;
