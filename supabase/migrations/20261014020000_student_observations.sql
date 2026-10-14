-- Table for student observations (text + small images/attachments)
CREATE TABLE IF NOT EXISTS public.student_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  content text NOT NULL,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_observations TO authenticated;
GRANT ALL ON public.student_observations TO service_role;

ALTER TABLE public.student_observations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage own student_observations"
  ON public.student_observations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS student_observations_student_id_idx ON public.student_observations (student_id);
CREATE INDEX IF NOT EXISTS student_observations_user_id_idx ON public.student_observations (user_id);
