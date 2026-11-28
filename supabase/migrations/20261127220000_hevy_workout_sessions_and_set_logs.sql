-- Etapa 1: Modelo de dados para registro série a série no estilo Hevy
-- Preserva 100% das tabelas existentes (pt_programs, pt_training_days, pt_training_exercises, pt_training_executions).

-- 1. Sessões de treino (em_andamento | concluido)
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  routine_day_id uuid NOT NULL REFERENCES public.pt_training_days(id) ON DELETE CASCADE,
  started_at timestamptz,
  finished_at timestamptz,
  duration_seconds int NOT NULL DEFAULT 0,
  total_volume_kg numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'concluido')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS workout_sessions_user_status_idx
  ON public.workout_sessions(user_id, status, started_at DESC);

CREATE INDEX IF NOT EXISTS workout_sessions_user_day_idx
  ON public.workout_sessions(user_id, routine_day_id, finished_at DESC);

ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own workout_sessions" ON public.workout_sessions;
CREATE POLICY "Users manage own workout_sessions"
  ON public.workout_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_sessions TO authenticated;
GRANT ALL ON public.workout_sessions TO service_role;

-- 2. Registros série a série (set_logs)
CREATE TABLE IF NOT EXISTS public.set_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES public.pt_training_exercises(id) ON DELETE CASCADE,
  set_order int NOT NULL,
  set_type text NOT NULL DEFAULT 'normal' CHECK (set_type IN ('aquecimento', 'normal', 'drop', 'falha')),
  weight_kg numeric(6,2),
  reps int,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS set_logs_session_exercise_idx
  ON public.set_logs(session_id, exercise_id, set_order);

CREATE INDEX IF NOT EXISTS set_logs_exercise_completed_idx
  ON public.set_logs(exercise_id, completed, completed_at DESC);

ALTER TABLE public.set_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own set_logs" ON public.set_logs;
CREATE POLICY "Users manage own set_logs"
  ON public.set_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions ws
      WHERE ws.id = set_logs.session_id
        AND ws.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_sessions ws
      WHERE ws.id = set_logs.session_id
        AND ws.user_id = auth.uid()
    )
  );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.set_logs TO authenticated;
GRANT ALL ON public.set_logs TO service_role;

-- 3. Notas por exercício na sessão
CREATE TABLE IF NOT EXISTS public.session_exercise_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES public.pt_training_exercises(id) ON DELETE CASCADE,
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, exercise_id)
);

CREATE INDEX IF NOT EXISTS session_exercise_notes_session_idx
  ON public.session_exercise_notes(session_id, exercise_id);

ALTER TABLE public.session_exercise_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own session_exercise_notes" ON public.session_exercise_notes;
CREATE POLICY "Users manage own session_exercise_notes"
  ON public.session_exercise_notes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions ws
      WHERE ws.id = session_exercise_notes.session_id
        AND ws.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_sessions ws
      WHERE ws.id = session_exercise_notes.session_id
        AND ws.user_id = auth.uid()
    )
  );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.session_exercise_notes TO authenticated;
GRANT ALL ON public.session_exercise_notes TO service_role;
