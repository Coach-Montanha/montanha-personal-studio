-- ==============================================================================
-- Migration: 20261125204000_unified_students_tags_and_sync.sql
-- Description: Adiciona coluna `tags` ('studio', 'personal') no cadastro central
-- `students` e garante sincronização automática com `pt_students` preservando
-- `account_user_id` e `temp_password` para evitar falhas de vinculação de treino.
-- ==============================================================================

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT ARRAY['studio']::text[];

CREATE INDEX IF NOT EXISTS idx_students_tags ON public.students USING gin (tags);

-- Backfill: alunos do Studio que também possuem vínculo real de Personal Trainer recebem ambas as tags
UPDATE public.students s
SET tags = ARRAY['studio', 'personal']::text[]
WHERE EXISTS (
  SELECT 1
  FROM public.pt_students p
  WHERE (p.id = s.id OR (s.email IS NOT NULL AND lower(trim(p.email)) = lower(trim(s.email))))
    AND COALESCE(p.notes, '') NOT LIKE '%[Studio]%'
    AND COALESCE(p.notes, '') NOT LIKE '%[Aluno Studio]%'
    AND p.deleted_at IS NULL
)
AND NOT ('personal' = ANY(s.tags));

-- Migra alunos exclusivamente de Personal que ainda não estejam na tabela central `students`
INSERT INTO public.students (
  id, user_id, name, email, phone, birth_date, start_date, status,
  account_user_id, temp_password, notes, tags, deleted_at, created_at, updated_at
)
SELECT
  p.id,
  p.user_id,
  p.name,
  p.email,
  p.phone,
  p.birth_date,
  p.start_date,
  p.status,
  p.account_user_id,
  p.temp_password,
  p.notes,
  ARRAY['personal']::text[],
  p.deleted_at,
  p.created_at,
  p.updated_at
FROM public.pt_students p
WHERE p.id <> '00000000-0000-0000-0000-000000000001'
  AND NOT EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = p.id
       OR (p.email IS NOT NULL AND trim(p.email) <> '' AND lower(trim(s.email)) = lower(trim(p.email)))
  )
ON CONFLICT (id) DO NOTHING;

-- Reconcilia `account_user_id` entre `students` e `pt_students` quando houver e-mail igual
UPDATE public.pt_students p
SET account_user_id = s.account_user_id,
    temp_password = COALESCE(p.temp_password, s.temp_password),
    updated_at = now()
FROM public.students s
WHERE p.account_user_id IS NULL
  AND s.account_user_id IS NOT NULL
  AND (p.id = s.id OR (p.email IS NOT NULL AND s.email IS NOT NULL AND lower(trim(p.email)) = lower(trim(s.email))));

-- Trigger de sincronização automática: alterações no cadastro central `students`
-- mantêm `pt_students` atualizado sem jamais apagar `account_user_id`.
CREATE OR REPLACE FUNCTION public.sync_student_to_pt_students()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_has_pt boolean;
BEGIN
  SELECT EXISTS (SELECT 1 FROM public.pt_students WHERE id = NEW.id) INTO v_has_pt;

  IF v_has_pt OR ('personal' = ANY(NEW.tags)) THEN
    INSERT INTO public.pt_students (
      id, user_id, name, email, phone, birth_date, start_date,
      status, account_user_id, temp_password, notes, deleted_at, updated_at
    )
    VALUES (
      NEW.id,
      NEW.user_id,
      NEW.name,
      NEW.email,
      NEW.phone,
      NEW.birth_date,
      NEW.start_date,
      CASE WHEN NEW.status = 'inactive' THEN 'inactive' ELSE 'active' END,
      NEW.account_user_id,
      NEW.temp_password,
      CASE
        WHEN 'studio' = ANY(NEW.tags) AND NOT ('personal' = ANY(NEW.tags)) THEN '[Aluno Studio]'
        ELSE NEW.notes
      END,
      NEW.deleted_at,
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      birth_date = EXCLUDED.birth_date,
      start_date = EXCLUDED.start_date,
      status = EXCLUDED.status,
      account_user_id = COALESCE(EXCLUDED.account_user_id, public.pt_students.account_user_id),
      temp_password = COALESCE(EXCLUDED.temp_password, public.pt_students.temp_password),
      deleted_at = EXCLUDED.deleted_at,
      updated_at = now();
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_sync_student_to_pt_students ON public.students;
CREATE TRIGGER trg_sync_student_to_pt_students
AFTER INSERT OR UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.sync_student_to_pt_students();
