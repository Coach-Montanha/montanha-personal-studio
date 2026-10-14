-- Add studio_student_id to pt_programs so Studio students can have training plans
ALTER TABLE public.pt_programs
  ADD COLUMN IF NOT EXISTS studio_student_id uuid REFERENCES public.students(id) ON DELETE CASCADE;

-- Make pt_student_id nullable so programs can belong to a Studio student (no pt_students FK needed)
ALTER TABLE public.pt_programs
  ALTER COLUMN pt_student_id DROP NOT NULL;

-- Index for fast lookup by studio student
CREATE INDEX IF NOT EXISTS pt_programs_studio_student_id_idx ON public.pt_programs (studio_student_id);

-- Add studio_student_id to pt_training_executions
ALTER TABLE public.pt_training_executions
  ADD COLUMN IF NOT EXISTS studio_student_id uuid REFERENCES public.students(id) ON DELETE CASCADE;

-- Make pt_student_id nullable in executions too
ALTER TABLE public.pt_training_executions
  ALTER COLUMN pt_student_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS pt_training_executions_studio_student_id_idx ON public.pt_training_executions (studio_student_id);
