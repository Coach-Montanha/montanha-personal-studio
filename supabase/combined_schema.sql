CREATE TABLE public.pt_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, UPDATE, DELETE ON public.pt_notifications TO authenticated;
GRANT ALL ON public.pt_notifications TO service_role;

ALTER TABLE public.pt_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own notifications"
ON public.pt_notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.pt_notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Add column for student name in executions if not exists (checked schema earlier, executions has student_id)

-- Students
CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own students" ON public.students FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX students_user_id_idx ON public.students(user_id);

-- Plans
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric NOT NULL,
  billing_cycle text NOT NULL DEFAULT 'monthly',
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plans TO authenticated;
GRANT ALL ON public.plans TO service_role;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own plans" ON public.plans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX plans_user_id_idx ON public.plans(user_id);

-- Payments
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES public.plans(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  payment_date date NOT NULL,
  due_date date,
  reference_month text NOT NULL,
  payment_method text NOT NULL DEFAULT 'pix',
  status text NOT NULL DEFAULT 'paid',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own payments" ON public.payments FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX payments_user_id_idx ON public.payments(user_id);
CREATE INDEX payments_student_id_idx ON public.payments(student_id);
CREATE INDEX payments_reference_month_idx ON public.payments(reference_month);
CREATE INDEX payments_payment_date_idx ON public.payments(payment_date);

-- Student plan history
CREATE TABLE public.student_plan_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES public.plans(id) ON DELETE SET NULL,
  start_date date NOT NULL,
  end_date date,
  is_current boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_plan_history TO authenticated;
GRANT ALL ON public.student_plan_history TO service_role;
ALTER TABLE public.student_plan_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own history" ON public.student_plan_history FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX sph_student_id_idx ON public.student_plan_history(student_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_students_updated BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_plans_updated BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- pt_students
CREATE TABLE public.pt_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  birth_date date,
  goal text,
  health_notes text,
  status text NOT NULL DEFAULT 'active',
  start_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pt_students TO authenticated;
GRANT ALL ON public.pt_students TO service_role;
ALTER TABLE public.pt_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own pt_students" ON public.pt_students FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- pt_plans
CREATE TABLE public.pt_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  sessions_per_month int,
  price_per_month numeric,
  price_per_session numeric,
  billing_type text NOT NULL DEFAULT 'monthly',
  package_sessions int,
  package_price numeric,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pt_plans TO authenticated;
GRANT ALL ON public.pt_plans TO service_role;
ALTER TABLE public.pt_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own pt_plans" ON public.pt_plans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- pt_payments
CREATE TABLE public.pt_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  pt_student_id uuid NOT NULL REFERENCES public.pt_students(id) ON DELETE CASCADE,
  pt_plan_id uuid REFERENCES public.pt_plans(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  payment_date date NOT NULL,
  due_date date,
  reference_month text,
  payment_method text NOT NULL DEFAULT 'pix',
  status text NOT NULL DEFAULT 'paid',
  sessions_paid int,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pt_payments TO authenticated;
GRANT ALL ON public.pt_payments TO service_role;
ALTER TABLE public.pt_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own pt_payments" ON public.pt_payments FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- pt_sessions
CREATE TABLE public.pt_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  pt_student_id uuid NOT NULL REFERENCES public.pt_students(id) ON DELETE CASCADE,
  pt_payment_id uuid REFERENCES public.pt_payments(id) ON DELETE SET NULL,
  session_date date NOT NULL,
  session_time time,
  duration_minutes int NOT NULL DEFAULT 60,
  status text NOT NULL DEFAULT 'completed',
  exercises text,
  performance_notes text,
  next_session_plan text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pt_sessions TO authenticated;
GRANT ALL ON public.pt_sessions TO service_role;
ALTER TABLE public.pt_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own pt_sessions" ON public.pt_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- updated_at triggers (function already exists)
CREATE TRIGGER pt_students_updated_at BEFORE UPDATE ON public.pt_students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER pt_plans_updated_at BEFORE UPDATE ON public.pt_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER pt_payments_updated_at BEFORE UPDATE ON public.pt_payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER pt_sessions_updated_at BEFORE UPDATE ON public.pt_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- helpful indexes
CREATE INDEX pt_payments_student_idx ON public.pt_payments(pt_student_id);
CREATE INDEX pt_sessions_student_idx ON public.pt_sessions(pt_student_id);
CREATE INDEX pt_sessions_date_idx ON public.pt_sessions(session_date);
CREATE INDEX pt_payments_user_idx ON public.pt_payments(user_id);
CREATE INDEX pt_sessions_user_idx ON public.pt_sessions(user_id);
-- Students status auto-calc
CREATE OR REPLACE FUNCTION public.recalculate_student_status(p_student_id uuid)
RETURNS void AS $$
DECLARE
  v_current_month text := to_char(now(), 'YYYY-MM');
  v_last_month text := to_char(now() - interval '1 month', 'YYYY-MM');
  v_paid_current bool;
  v_paid_last bool;
  v_new_status text;
BEGIN
  SELECT EXISTS (SELECT 1 FROM public.payments WHERE student_id = p_student_id AND status = 'paid' AND reference_month = v_current_month) INTO v_paid_current;
  SELECT EXISTS (SELECT 1 FROM public.payments WHERE student_id = p_student_id AND status = 'paid' AND reference_month = v_last_month) INTO v_paid_last;
  IF v_paid_current THEN
    v_new_status := 'active';
  ELSIF v_paid_last AND NOT v_paid_current THEN
    v_new_status := 'inactive';
  ELSIF NOT v_paid_last AND NOT v_paid_current THEN
    v_new_status := 'churned';
  ELSE
    v_new_status := 'inactive';
  END IF;
  UPDATE public.students SET status = v_new_status, updated_at = now() WHERE id = p_student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.trigger_recalculate_student_status()
RETURNS trigger AS $$
DECLARE v_student_id uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN v_student_id := OLD.student_id; ELSE v_student_id := NEW.student_id; END IF;
  PERFORM public.recalculate_student_status(v_student_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_payment_change ON public.payments;
CREATE TRIGGER on_payment_change
  AFTER INSERT OR UPDATE OR DELETE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.trigger_recalculate_student_status();

CREATE OR REPLACE FUNCTION public.recalculate_all_student_statuses()
RETURNS void AS $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT id FROM public.students LOOP
    PERFORM public.recalculate_student_status(r.id);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- PT students
CREATE OR REPLACE FUNCTION public.recalculate_pt_student_status(p_student_id uuid)
RETURNS void AS $$
DECLARE
  v_current_month text := to_char(now(), 'YYYY-MM');
  v_last_month text := to_char(now() - interval '1 month', 'YYYY-MM');
  v_paid_current bool;
  v_paid_last bool;
  v_new_status text;
BEGIN
  SELECT EXISTS (SELECT 1 FROM public.pt_payments WHERE pt_student_id = p_student_id AND status = 'paid' AND reference_month = v_current_month) INTO v_paid_current;
  SELECT EXISTS (SELECT 1 FROM public.pt_payments WHERE pt_student_id = p_student_id AND status = 'paid' AND reference_month = v_last_month) INTO v_paid_last;
  IF v_paid_current THEN
    v_new_status := 'active';
  ELSIF v_paid_last AND NOT v_paid_current THEN
    v_new_status := 'inactive';
  ELSIF NOT v_paid_last AND NOT v_paid_current THEN
    v_new_status := 'churned';
  ELSE
    v_new_status := 'inactive';
  END IF;
  UPDATE public.pt_students SET status = v_new_status, updated_at = now() WHERE id = p_student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.trigger_recalculate_pt_student_status()
RETURNS trigger AS $$
DECLARE v_student_id uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN v_student_id := OLD.pt_student_id; ELSE v_student_id := NEW.pt_student_id; END IF;
  PERFORM public.recalculate_pt_student_status(v_student_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_pt_payment_change ON public.pt_payments;
CREATE TRIGGER on_pt_payment_change
  AFTER INSERT OR UPDATE OR DELETE ON public.pt_payments
  FOR EACH ROW EXECUTE FUNCTION public.trigger_recalculate_pt_student_status();

CREATE OR REPLACE FUNCTION public.recalculate_all_pt_student_statuses()
RETURNS void AS $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT id FROM public.pt_students LOOP
    PERFORM public.recalculate_pt_student_status(r.id);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

SELECT public.recalculate_all_student_statuses();
SELECT public.recalculate_all_pt_student_statuses();
-- Lock down SECURITY DEFINER functions: revoke public EXECUTE and grant narrowly.

REVOKE ALL ON FUNCTION public.recalculate_student_status(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.recalculate_pt_student_status(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.trigger_recalculate_student_status() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.trigger_recalculate_pt_student_status() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.recalculate_all_student_statuses() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.recalculate_all_pt_student_statuses() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.recalculate_all_student_statuses() TO authenticated;
GRANT EXECUTE ON FUNCTION public.recalculate_all_pt_student_statuses() TO authenticated;
CREATE OR REPLACE FUNCTION public.recalculate_all_student_statuses()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  r RECORD;
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  FOR r IN SELECT id FROM public.students WHERE user_id = v_uid LOOP
    PERFORM public.recalculate_student_status(r.id);
  END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.recalculate_all_pt_student_statuses()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  r RECORD;
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  FOR r IN SELECT id FROM public.pt_students WHERE user_id = v_uid LOOP
    PERFORM public.recalculate_pt_student_status(r.id);
  END LOOP;
END;
$function$;
CREATE OR REPLACE FUNCTION public.recalculate_all_student_statuses()
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
DECLARE
  r RECORD;
  v_uid uuid := auth.uid();
  v_current_month text := to_char(now(), 'YYYY-MM');
  v_last_month text := to_char(now() - interval '1 month', 'YYYY-MM');
  v_paid_current bool;
  v_paid_last bool;
  v_new_status text;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  FOR r IN SELECT id FROM public.students WHERE user_id = v_uid LOOP
    SELECT EXISTS (SELECT 1 FROM public.payments WHERE student_id = r.id AND status = 'paid' AND reference_month = v_current_month) INTO v_paid_current;
    SELECT EXISTS (SELECT 1 FROM public.payments WHERE student_id = r.id AND status = 'paid' AND reference_month = v_last_month) INTO v_paid_last;
    IF v_paid_current THEN v_new_status := 'active';
    ELSIF v_paid_last AND NOT v_paid_current THEN v_new_status := 'inactive';
    ELSIF NOT v_paid_last AND NOT v_paid_current THEN v_new_status := 'churned';
    ELSE v_new_status := 'inactive';
    END IF;
    UPDATE public.students SET status = v_new_status, updated_at = now() WHERE id = r.id AND user_id = v_uid;
  END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.recalculate_all_pt_student_statuses()
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
DECLARE
  r RECORD;
  v_uid uuid := auth.uid();
  v_current_month text := to_char(now(), 'YYYY-MM');
  v_last_month text := to_char(now() - interval '1 month', 'YYYY-MM');
  v_paid_current bool;
  v_paid_last bool;
  v_new_status text;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  FOR r IN SELECT id FROM public.pt_students WHERE user_id = v_uid LOOP
    SELECT EXISTS (SELECT 1 FROM public.pt_payments WHERE pt_student_id = r.id AND status = 'paid' AND reference_month = v_current_month) INTO v_paid_current;
    SELECT EXISTS (SELECT 1 FROM public.pt_payments WHERE pt_student_id = r.id AND status = 'paid' AND reference_month = v_last_month) INTO v_paid_last;
    IF v_paid_current THEN v_new_status := 'active';
    ELSIF v_paid_last AND NOT v_paid_current THEN v_new_status := 'inactive';
    ELSIF NOT v_paid_last AND NOT v_paid_current THEN v_new_status := 'churned';
    ELSE v_new_status := 'inactive';
    END IF;
    UPDATE public.pt_students SET status = v_new_status, updated_at = now() WHERE id = r.id AND user_id = v_uid;
  END LOOP;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.recalculate_all_student_statuses() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalculate_all_pt_student_statuses() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.recalculate_all_student_statuses() TO service_role;
GRANT EXECUTE ON FUNCTION public.recalculate_all_pt_student_statuses() TO service_role;

DROP FUNCTION IF EXISTS public.recalculate_all_student_statuses();
DROP FUNCTION IF EXISTS public.recalculate_all_pt_student_statuses();

CREATE OR REPLACE FUNCTION public.recalculate_all_student_statuses_for(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $$
DECLARE
  r RECORD;
  v_current_month text := to_char(now(), 'YYYY-MM');
  v_last_month text := to_char(now() - interval '1 month', 'YYYY-MM');
  v_paid_current bool;
  v_paid_last bool;
  v_new_status text;
BEGIN
  IF p_user_id IS NULL THEN RAISE EXCEPTION 'user_id required'; END IF;
  FOR r IN SELECT id FROM public.students WHERE user_id = p_user_id LOOP
    SELECT EXISTS (SELECT 1 FROM public.payments WHERE student_id = r.id AND status = 'paid' AND reference_month = v_current_month) INTO v_paid_current;
    SELECT EXISTS (SELECT 1 FROM public.payments WHERE student_id = r.id AND status = 'paid' AND reference_month = v_last_month) INTO v_paid_last;
    IF v_paid_current THEN v_new_status := 'active';
    ELSIF v_paid_last AND NOT v_paid_current THEN v_new_status := 'inactive';
    ELSIF NOT v_paid_last AND NOT v_paid_current THEN v_new_status := 'churned';
    ELSE v_new_status := 'inactive';
    END IF;
    UPDATE public.students SET status = v_new_status, updated_at = now() WHERE id = r.id AND user_id = p_user_id;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.recalculate_all_pt_student_statuses_for(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $$
DECLARE
  r RECORD;
  v_current_month text := to_char(now(), 'YYYY-MM');
  v_last_month text := to_char(now() - interval '1 month', 'YYYY-MM');
  v_paid_current bool;
  v_paid_last bool;
  v_new_status text;
BEGIN
  IF p_user_id IS NULL THEN RAISE EXCEPTION 'user_id required'; END IF;
  FOR r IN SELECT id FROM public.pt_students WHERE user_id = p_user_id LOOP
    SELECT EXISTS (SELECT 1 FROM public.pt_payments WHERE pt_student_id = r.id AND status = 'paid' AND reference_month = v_current_month) INTO v_paid_current;
    SELECT EXISTS (SELECT 1 FROM public.pt_payments WHERE pt_student_id = r.id AND status = 'paid' AND reference_month = v_last_month) INTO v_paid_last;
    IF v_paid_current THEN v_new_status := 'active';
    ELSIF v_paid_last AND NOT v_paid_current THEN v_new_status := 'inactive';
    ELSIF NOT v_paid_last AND NOT v_paid_current THEN v_new_status := 'churned';
    ELSE v_new_status := 'inactive';
    END IF;
    UPDATE public.pt_students SET status = v_new_status, updated_at = now() WHERE id = r.id AND user_id = p_user_id;
  END LOOP;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.recalculate_all_student_statuses_for(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalculate_all_pt_student_statuses_for(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.recalculate_all_student_statuses_for(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.recalculate_all_pt_student_statuses_for(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.recalculate_student_status(p_student_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_paid_date date;
  v_days_since int;
  v_new_status text;
BEGIN
  SELECT MAX(payment_date::date)
    INTO v_last_paid_date
  FROM public.payments
  WHERE student_id = p_student_id AND status = 'paid';

  IF v_last_paid_date IS NULL THEN
    v_new_status := 'churned';
  ELSE
    v_days_since := CURRENT_DATE - v_last_paid_date;
    IF v_days_since <= 30 THEN
      v_new_status := 'active';
    ELSIF v_days_since <= 60 THEN
      v_new_status := 'inactive';
    ELSE
      v_new_status := 'churned';
    END IF;
  END IF;

  UPDATE public.students
     SET status = v_new_status, updated_at = now()
   WHERE id = p_student_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.recalculate_pt_student_status(p_student_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_paid_date date;
  v_days_since int;
  v_new_status text;
BEGIN
  SELECT MAX(payment_date::date)
    INTO v_last_paid_date
  FROM public.pt_payments
  WHERE pt_student_id = p_student_id AND status = 'paid';

  IF v_last_paid_date IS NULL THEN
    v_new_status := 'churned';
  ELSE
    v_days_since := CURRENT_DATE - v_last_paid_date;
    IF v_days_since <= 30 THEN
      v_new_status := 'active';
    ELSIF v_days_since <= 60 THEN
      v_new_status := 'inactive';
    ELSE
      v_new_status := 'churned';
    END IF;
  END IF;

  UPDATE public.pt_students
     SET status = v_new_status, updated_at = now()
   WHERE id = p_student_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.recalculate_all_student_statuses_for(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  r RECORD;
  v_last_paid_date date;
  v_days_since int;
  v_new_status text;
BEGIN
  IF p_user_id IS NULL THEN RAISE EXCEPTION 'user_id required'; END IF;
  FOR r IN SELECT id FROM public.students WHERE user_id = p_user_id LOOP
    SELECT MAX(payment_date::date) INTO v_last_paid_date
      FROM public.payments WHERE student_id = r.id AND status = 'paid';
    IF v_last_paid_date IS NULL THEN
      v_new_status := 'churned';
    ELSE
      v_days_since := CURRENT_DATE - v_last_paid_date;
      IF v_days_since <= 30 THEN v_new_status := 'active';
      ELSIF v_days_since <= 60 THEN v_new_status := 'inactive';
      ELSE v_new_status := 'churned';
      END IF;
    END IF;
    UPDATE public.students SET status = v_new_status, updated_at = now()
     WHERE id = r.id AND user_id = p_user_id;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.recalculate_all_pt_student_statuses_for(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  r RECORD;
  v_last_paid_date date;
  v_days_since int;
  v_new_status text;
BEGIN
  IF p_user_id IS NULL THEN RAISE EXCEPTION 'user_id required'; END IF;
  FOR r IN SELECT id FROM public.pt_students WHERE user_id = p_user_id LOOP
    SELECT MAX(payment_date::date) INTO v_last_paid_date
      FROM public.pt_payments WHERE pt_student_id = r.id AND status = 'paid';
    IF v_last_paid_date IS NULL THEN
      v_new_status := 'churned';
    ELSE
      v_days_since := CURRENT_DATE - v_last_paid_date;
      IF v_days_since <= 30 THEN v_new_status := 'active';
      ELSIF v_days_since <= 60 THEN v_new_status := 'inactive';
      ELSE v_new_status := 'churned';
      END IF;
    END IF;
    UPDATE public.pt_students SET status = v_new_status, updated_at = now()
     WHERE id = r.id AND user_id = p_user_id;
  END LOOP;
END;
$$;

-- Refresh all existing student statuses now (per-user loop to respect security scoping)
DO $$
DECLARE u RECORD;
BEGIN
  FOR u IN SELECT DISTINCT user_id FROM public.students LOOP
    PERFORM public.recalculate_all_student_statuses_for(u.user_id);
  END LOOP;
  FOR u IN SELECT DISTINCT user_id FROM public.pt_students LOOP
    PERFORM public.recalculate_all_pt_student_statuses_for(u.user_id);
  END LOOP;
END $$;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS birth_date date;

CREATE POLICY "Contracts: users can upload to own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'contracts'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Contracts: users can read own files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'contracts'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Contracts: users can update own files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'contracts'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Contracts: users can delete own files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'contracts'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Avatars: users can upload to own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Avatars: users can update own files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Avatars: users can delete own files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Avatars: authenticated can read all"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars');
CREATE TABLE IF NOT EXISTS public.student_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size int,
  file_type text,
  notes text,
  signed_at date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_contracts TO authenticated;
GRANT ALL ON public.student_contracts TO service_role;
ALTER TABLE public.student_contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own contracts" ON public.student_contracts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.pt_student_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  pt_student_id uuid NOT NULL REFERENCES public.pt_students(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size int,
  file_type text,
  notes text,
  signed_at date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pt_student_contracts TO authenticated;
GRANT ALL ON public.pt_student_contracts TO service_role;
ALTER TABLE public.pt_student_contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own pt contracts" ON public.pt_student_contracts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.expense_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📦',
  color TEXT DEFAULT '#6B7280',
  segment TEXT NOT NULL DEFAULT 'general',
  type TEXT NOT NULL DEFAULT 'variable',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expense_categories TO authenticated;
GRANT ALL ON public.expense_categories TO service_role;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own expense categories" ON public.expense_categories
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_expense_categories_updated_at
  BEFORE UPDATE ON public.expense_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  category_id UUID REFERENCES public.expense_categories ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  expense_date DATE NOT NULL,
  reference_month TEXT NOT NULL,
  segment TEXT NOT NULL DEFAULT 'general',
  type TEXT NOT NULL DEFAULT 'variable',
  recurrent BOOLEAN NOT NULL DEFAULT false,
  recurrent_months INT,
  payment_method TEXT NOT NULL DEFAULT 'transfer',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own expenses" ON public.expenses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_expenses_user_month ON public.expenses(user_id, reference_month);
CREATE INDEX idx_expenses_user_date ON public.expenses(user_id, expense_date);

-- ROLES
DO $$ BEGIN CREATE TYPE public.app_role AS ENUM ('admin','student'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;

-- LINK STUDENT ACCOUNT
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS account_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.pt_students ADD COLUMN IF NOT EXISTS account_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_students_account_user ON public.students(account_user_id);
CREATE INDEX IF NOT EXISTS idx_pt_students_account_user ON public.pt_students(account_user_id);

-- CLASSES TABLES (create all first, add cross-referencing policies after)
CREATE TABLE IF NOT EXISTS public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  trainer_name text,
  day_of_week smallint,
  start_time time NOT NULL,
  duration_minutes int NOT NULL DEFAULT 60,
  capacity int NOT NULL DEFAULT 10,
  is_recurring boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classes TO authenticated;
GRANT ALL ON public.classes TO service_role;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.class_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE,
  session_date date NOT NULL,
  start_time time NOT NULL,
  duration_minutes int NOT NULL DEFAULT 60,
  capacity_override int,
  status text NOT NULL DEFAULT 'scheduled',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.class_sessions TO authenticated;
GRANT ALL ON public.class_sessions TO service_role;
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.class_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  active boolean NOT NULL DEFAULT true,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(class_id, student_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.class_enrollments TO authenticated;
GRANT ALL ON public.class_enrollments TO service_role;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.class_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_id uuid NOT NULL REFERENCES public.class_sessions(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'present',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id, student_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.class_attendance TO authenticated;
GRANT ALL ON public.class_attendance TO service_role;
ALTER TABLE public.class_attendance ENABLE ROW LEVEL SECURITY;

-- POLICIES
DROP POLICY IF EXISTS "read own roles" ON public.user_roles;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "student reads own profile" ON public.students;
CREATE POLICY "student reads own profile" ON public.students FOR SELECT TO authenticated
  USING (account_user_id = auth.uid());

DROP POLICY IF EXISTS "student reads own payments" ON public.payments;
CREATE POLICY "student reads own payments" ON public.payments FOR SELECT TO authenticated
  USING (student_id IN (SELECT id FROM public.students WHERE account_user_id = auth.uid()));

DROP POLICY IF EXISTS "student reads own plan history" ON public.student_plan_history;
CREATE POLICY "student reads own plan history" ON public.student_plan_history FOR SELECT TO authenticated
  USING (student_id IN (SELECT id FROM public.students WHERE account_user_id = auth.uid()));

DROP POLICY IF EXISTS "student reads plans" ON public.plans;
CREATE POLICY "student reads plans" ON public.plans FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'student'));

DROP POLICY IF EXISTS "admin manages classes" ON public.classes;
CREATE POLICY "admin manages classes" ON public.classes FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "student reads active classes" ON public.classes;
CREATE POLICY "student reads active classes" ON public.classes FOR SELECT TO authenticated
  USING (is_active AND public.has_role(auth.uid(), 'student'));

DROP POLICY IF EXISTS "admin manages sessions" ON public.class_sessions;
CREATE POLICY "admin manages sessions" ON public.class_sessions FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "student reads sessions of own classes" ON public.class_sessions;
CREATE POLICY "student reads sessions of own classes" ON public.class_sessions FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'student') AND
    class_id IN (
      SELECT ce.class_id FROM public.class_enrollments ce
      JOIN public.students s ON s.id = ce.student_id
      WHERE s.account_user_id = auth.uid() AND ce.active
    )
  );

DROP POLICY IF EXISTS "admin manages enrollments" ON public.class_enrollments;
CREATE POLICY "admin manages enrollments" ON public.class_enrollments FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "student reads own enrollments" ON public.class_enrollments;
CREATE POLICY "student reads own enrollments" ON public.class_enrollments FOR SELECT TO authenticated
  USING (student_id IN (SELECT id FROM public.students WHERE account_user_id = auth.uid()));
DROP POLICY IF EXISTS "student self-enroll" ON public.class_enrollments;
CREATE POLICY "student self-enroll" ON public.class_enrollments FOR INSERT TO authenticated
  WITH CHECK (student_id IN (SELECT id FROM public.students WHERE account_user_id = auth.uid()));
DROP POLICY IF EXISTS "student self-cancel" ON public.class_enrollments;
CREATE POLICY "student self-cancel" ON public.class_enrollments FOR UPDATE TO authenticated
  USING (student_id IN (SELECT id FROM public.students WHERE account_user_id = auth.uid()))
  WITH CHECK (student_id IN (SELECT id FROM public.students WHERE account_user_id = auth.uid()));
DROP POLICY IF EXISTS "student self-delete-enroll" ON public.class_enrollments;
CREATE POLICY "student self-delete-enroll" ON public.class_enrollments FOR DELETE TO authenticated
  USING (student_id IN (SELECT id FROM public.students WHERE account_user_id = auth.uid()));

DROP POLICY IF EXISTS "admin manages attendance" ON public.class_attendance;
CREATE POLICY "admin manages attendance" ON public.class_attendance FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "student reads own attendance" ON public.class_attendance;
CREATE POLICY "student reads own attendance" ON public.class_attendance FOR SELECT TO authenticated
  USING (student_id IN (SELECT id FROM public.students WHERE account_user_id = auth.uid()));

-- TRIGGERS
DROP TRIGGER IF EXISTS trg_classes_updated ON public.classes;
CREATE TRIGGER trg_classes_updated BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS trg_class_sessions_updated ON public.class_sessions;
CREATE TRIGGER trg_class_sessions_updated BEFORE UPDATE ON public.class_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Avatars: restrict SELECT to own folder
DROP POLICY IF EXISTS "Avatars: authenticated can read all" ON storage.objects;
CREATE POLICY "Avatars: users can read own files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- Plans: scope student reads to plans of their own educator
DROP POLICY IF EXISTS "student reads plans" ON public.plans;
CREATE POLICY "student reads own educator plans"
ON public.plans FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'student'::app_role)
  AND EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.account_user_id = auth.uid()
      AND s.user_id = plans.user_id
  )
);

-- Classes: scope student reads to classes of their own educator
DROP POLICY IF EXISTS "student reads active classes" ON public.classes;
CREATE POLICY "student reads own educator active classes"
ON public.classes FOR SELECT TO authenticated
USING (
  is_active
  AND has_role(auth.uid(), 'student'::app_role)
  AND EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.account_user_id = auth.uid()
      AND s.user_id = classes.user_id
  )
);

-- Enforce ownership consistency between payments and students
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_user_id_id_key;
ALTER TABLE public.students ADD CONSTRAINT students_user_id_id_key UNIQUE (user_id, id);
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_student_owner_fk;
ALTER TABLE public.payments
  ADD CONSTRAINT payments_student_owner_fk
  FOREIGN KEY (user_id, student_id)
  REFERENCES public.students(user_id, id) ON DELETE CASCADE;

ALTER TABLE public.pt_students DROP CONSTRAINT IF EXISTS pt_students_user_id_id_key;
ALTER TABLE public.pt_students ADD CONSTRAINT pt_students_user_id_id_key UNIQUE (user_id, id);
ALTER TABLE public.pt_payments DROP CONSTRAINT IF EXISTS pt_payments_student_owner_fk;
ALTER TABLE public.pt_payments
  ADD CONSTRAINT pt_payments_student_owner_fk
  FOREIGN KEY (user_id, pt_student_id)
  REFERENCES public.pt_students(user_id, id) ON DELETE CASCADE;

-- Lock down SECURITY DEFINER functions from being called via the API
REVOKE ALL ON FUNCTION public.recalculate_student_status(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.recalculate_pt_student_status(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.trigger_recalculate_student_status() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.trigger_recalculate_pt_student_status() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.recalculate_all_student_statuses_for(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.recalculate_all_pt_student_statuses_for(uuid) FROM PUBLIC, anon;

-- Drop redundant composite FKs that caused PostgREST embed ambiguity
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_student_owner_fk;
ALTER TABLE public.pt_payments DROP CONSTRAINT IF EXISTS pt_payments_student_owner_fk;

-- Move ownership guard inside the SECURITY DEFINER trigger functions
CREATE OR REPLACE FUNCTION public.recalculate_student_status(p_student_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_last_paid_date date;
  v_days_since int;
  v_new_status text;
  v_owner uuid;
BEGIN
  SELECT user_id INTO v_owner FROM public.students WHERE id = p_student_id;
  IF v_owner IS NULL THEN RETURN; END IF;
  -- Only allow the owner to trigger recalculation (auth.uid() is NULL for service_role)
  IF auth.uid() IS NOT NULL AND v_owner <> auth.uid() THEN RETURN; END IF;

  SELECT MAX(payment_date::date) INTO v_last_paid_date
  FROM public.payments WHERE student_id = p_student_id AND status = 'paid';

  IF v_last_paid_date IS NULL THEN v_new_status := 'churned';
  ELSE
    v_days_since := CURRENT_DATE - v_last_paid_date;
    IF v_days_since <= 30 THEN v_new_status := 'active';
    ELSIF v_days_since <= 60 THEN v_new_status := 'inactive';
    ELSE v_new_status := 'churned';
    END IF;
  END IF;

  UPDATE public.students SET status = v_new_status, updated_at = now() WHERE id = p_student_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.recalculate_pt_student_status(p_student_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_last_paid_date date;
  v_days_since int;
  v_new_status text;
  v_owner uuid;
BEGIN
  SELECT user_id INTO v_owner FROM public.pt_students WHERE id = p_student_id;
  IF v_owner IS NULL THEN RETURN; END IF;
  IF auth.uid() IS NOT NULL AND v_owner <> auth.uid() THEN RETURN; END IF;

  SELECT MAX(payment_date::date) INTO v_last_paid_date
  FROM public.pt_payments WHERE pt_student_id = p_student_id AND status = 'paid';

  IF v_last_paid_date IS NULL THEN v_new_status := 'churned';
  ELSE
    v_days_since := CURRENT_DATE - v_last_paid_date;
    IF v_days_since <= 30 THEN v_new_status := 'active';
    ELSIF v_days_since <= 60 THEN v_new_status := 'inactive';
    ELSE v_new_status := 'churned';
    END IF;
  END IF;

  UPDATE public.pt_students SET status = v_new_status, updated_at = now() WHERE id = p_student_id;
END;
$function$;
CREATE TABLE public.user_email_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  resend_api_key TEXT,
  sender_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_email_settings TO authenticated;
GRANT ALL ON public.user_email_settings TO service_role;

ALTER TABLE public.user_email_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own email settings"
  ON public.user_email_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_user_email_settings_updated_at
  BEFORE UPDATE ON public.user_email_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- Revoke direct API execution of SECURITY DEFINER helpers.
-- Triggers still run them (owner privileges) and server functions still call them via service_role.
REVOKE ALL ON FUNCTION public.recalculate_student_status(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.recalculate_pt_student_status(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.trigger_recalculate_student_status() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.trigger_recalculate_pt_student_status() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.recalculate_all_student_statuses_for(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.recalculate_all_pt_student_statuses_for(uuid) FROM PUBLIC, anon, authenticated;

-- has_role is used inside RLS policies, so authenticated MUST retain EXECUTE.
-- Anon has no policies that call it, so revoke there.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
-- =========================================
-- 1. PROGRAMS
-- =========================================
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366f1',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX programs_user_id_idx ON public.programs(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.programs TO authenticated;
GRANT ALL ON public.programs TO service_role;

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin manages programs"
  ON public.programs FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "student reads own educator programs"
  ON public.programs FOR SELECT TO authenticated
  USING (
    is_active
    AND public.has_role(auth.uid(), 'student')
    AND EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.account_user_id = auth.uid() AND s.user_id = programs.user_id
    )
  );

CREATE TRIGGER trg_programs_updated
  BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- 2. STUDIO_SETTINGS
-- =========================================
CREATE TABLE public.studio_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  allow_multi_checkin_same_program_per_day BOOLEAN NOT NULL DEFAULT false,
  default_checkin_opens_minutes_before INT NOT NULL DEFAULT 60,
  default_checkin_closes_minutes_before INT NOT NULL DEFAULT 15,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.studio_settings TO authenticated;
GRANT ALL ON public.studio_settings TO service_role;

ALTER TABLE public.studio_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin manages own studio settings"
  ON public.studio_settings FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "student reads own educator studio settings"
  ON public.studio_settings FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'student')
    AND EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.account_user_id = auth.uid() AND s.user_id = studio_settings.user_id
    )
  );

CREATE TRIGGER trg_studio_settings_updated
  BEFORE UPDATE ON public.studio_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- 3. CLASSES — multi-day + checkin window + program
-- =========================================
ALTER TABLE public.classes
  ADD COLUMN days_of_week SMALLINT[] NOT NULL DEFAULT '{}',
  ADD COLUMN checkin_opens_minutes_before INT NOT NULL DEFAULT 60,
  ADD COLUMN checkin_closes_minutes_before INT NOT NULL DEFAULT 15,
  ADD COLUMN program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL;

-- Backfill days_of_week from day_of_week
UPDATE public.classes
   SET days_of_week = ARRAY[day_of_week]::SMALLINT[]
 WHERE day_of_week IS NOT NULL AND array_length(days_of_week, 1) IS NULL;

CREATE INDEX classes_program_id_idx ON public.classes(program_id);

-- =========================================
-- 4. PLANS — check-in quota
-- =========================================
ALTER TABLE public.plans
  ADD COLUMN checkin_quota_type TEXT NOT NULL DEFAULT 'none',
  ADD COLUMN checkin_quota_amount INT,
  ADD COLUMN package_valid_days INT;

ALTER TABLE public.plans
  ADD CONSTRAINT plans_checkin_quota_type_check
  CHECK (checkin_quota_type IN ('none','weekly','monthly','package'));

CREATE TABLE public.plan_programs (
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (plan_id, program_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.plan_programs TO authenticated;
GRANT ALL ON public.plan_programs TO service_role;

ALTER TABLE public.plan_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own plan_programs"
  ON public.plan_programs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_plan_programs_plan_id ON public.plan_programs(plan_id);
CREATE INDEX idx_plan_programs_program_id ON public.plan_programs(program_id);

-- Function to sync student_plan_history from paid payments
CREATE OR REPLACE FUNCTION public.sync_student_plan_from_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.plan_id IS NULL OR NEW.status <> 'paid' THEN
    RETURN NEW;
  END IF;

  -- Mark previous current plan(s) for this student as not current
  UPDATE public.student_plan_history
     SET is_current = false,
         end_date = COALESCE(end_date, NEW.payment_date)
   WHERE student_id = NEW.student_id
     AND is_current = true
     AND plan_id <> NEW.plan_id;

  -- Upsert current row for (student, plan)
  IF EXISTS (
    SELECT 1 FROM public.student_plan_history
     WHERE student_id = NEW.student_id AND plan_id = NEW.plan_id
  ) THEN
    UPDATE public.student_plan_history
       SET is_current = true,
           end_date = NULL,
           start_date = LEAST(start_date, NEW.payment_date)
     WHERE student_id = NEW.student_id AND plan_id = NEW.plan_id;
  ELSE
    INSERT INTO public.student_plan_history (user_id, student_id, plan_id, start_date, is_current)
    VALUES (NEW.user_id, NEW.student_id, NEW.plan_id, NEW.payment_date, true);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_student_plan_from_payment ON public.payments;
CREATE TRIGGER trg_sync_student_plan_from_payment
AFTER INSERT OR UPDATE OF plan_id, status, payment_date ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.sync_student_plan_from_payment();

-- Backfill from existing paid payments (latest paid payment with plan per student wins)
WITH latest AS (
  SELECT DISTINCT ON (student_id)
         user_id, student_id, plan_id, payment_date
    FROM public.payments
   WHERE plan_id IS NOT NULL AND status = 'paid'
   ORDER BY student_id, payment_date DESC, created_at DESC
)
INSERT INTO public.student_plan_history (user_id, student_id, plan_id, start_date, is_current)
SELECT l.user_id, l.student_id, l.plan_id, l.payment_date, true
  FROM latest l
ON CONFLICT DO NOTHING;

-- Ensure only one current row per student
WITH ranked AS (
  SELECT id,
         row_number() OVER (PARTITION BY student_id ORDER BY start_date DESC, created_at DESC) AS rn
    FROM public.student_plan_history
   WHERE is_current = true
)
UPDATE public.student_plan_history h
   SET is_current = false
  FROM ranked r
 WHERE h.id = r.id AND r.rn > 1;

-- For students whose latest paid payment plan differs from their current history row, promote it
WITH latest AS (
  SELECT DISTINCT ON (student_id)
         student_id, plan_id, payment_date
    FROM public.payments
   WHERE plan_id IS NOT NULL AND status = 'paid'
   ORDER BY student_id, payment_date DESC, created_at DESC
)
UPDATE public.student_plan_history h
   SET is_current = true
  FROM latest l
 WHERE h.student_id = l.student_id
   AND h.plan_id = l.plan_id
   AND h.is_current = false
   AND NOT EXISTS (
     SELECT 1 FROM public.student_plan_history h2
      WHERE h2.student_id = l.student_id AND h2.plan_id = l.plan_id AND h2.is_current = true
   );

REVOKE EXECUTE ON FUNCTION public.sync_student_plan_from_payment() FROM PUBLIC, anon, authenticated;

-- Allow students to see sessions from their studio (plan-based filtering happens in server code)
DROP POLICY IF EXISTS "student reads sessions of own classes" ON public.class_sessions;
CREATE POLICY "student reads own educator sessions"
ON public.class_sessions
FOR SELECT
USING (
  has_role(auth.uid(), 'student'::app_role) AND EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.account_user_id = auth.uid()
      AND s.user_id = class_sessions.user_id
  )
);

-- Allow students to check-in / cancel their own attendance
DROP POLICY IF EXISTS "student inserts own attendance" ON public.class_attendance;
CREATE POLICY "student inserts own attendance"
ON public.class_attendance
FOR INSERT
WITH CHECK (
  student_id IN (SELECT id FROM public.students WHERE account_user_id = auth.uid())
);

DROP POLICY IF EXISTS "student deletes own attendance" ON public.class_attendance;
CREATE POLICY "student deletes own attendance"
ON public.class_attendance
FOR DELETE
USING (
  student_id IN (SELECT id FROM public.students WHERE account_user_id = auth.uid())
);
-- Keep student current plan synced from the latest paid payment with a plan.
CREATE OR REPLACE FUNCTION public.sync_student_plan_from_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_latest RECORD;
BEGIN
  -- Recalculate from the student's latest paid payment with a plan after any relevant change.
  SELECT p.user_id, p.student_id, p.plan_id, p.payment_date, p.created_at
    INTO v_latest
    FROM public.payments p
   WHERE p.student_id = NEW.student_id
     AND p.plan_id IS NOT NULL
     AND p.status = 'paid'
   ORDER BY p.payment_date DESC, p.created_at DESC
   LIMIT 1;

  IF v_latest.student_id IS NULL THEN
    UPDATE public.student_plan_history
       SET is_current = false,
           end_date = COALESCE(end_date, CURRENT_DATE)
     WHERE student_id = NEW.student_id
       AND is_current = true;
    RETURN NEW;
  END IF;

  UPDATE public.student_plan_history
     SET is_current = false,
         end_date = COALESCE(end_date, v_latest.payment_date)
   WHERE student_id = v_latest.student_id
     AND is_current = true
     AND (plan_id IS DISTINCT FROM v_latest.plan_id OR start_date IS DISTINCT FROM v_latest.payment_date);

  INSERT INTO public.student_plan_history (user_id, student_id, plan_id, start_date, end_date, is_current)
  SELECT v_latest.user_id, v_latest.student_id, v_latest.plan_id, v_latest.payment_date, NULL, true
  WHERE NOT EXISTS (
    SELECT 1
      FROM public.student_plan_history h
     WHERE h.student_id = v_latest.student_id
       AND h.plan_id = v_latest.plan_id
       AND h.start_date = v_latest.payment_date
       AND h.is_current = true
  );

  -- If multiple rows are current, keep only the newest one.
  WITH ranked AS (
    SELECT id,
           row_number() OVER (PARTITION BY student_id ORDER BY start_date DESC, created_at DESC, id DESC) AS rn
      FROM public.student_plan_history
     WHERE student_id = v_latest.student_id
       AND is_current = true
  )
  UPDATE public.student_plan_history h
     SET is_current = false,
         end_date = COALESCE(end_date, v_latest.payment_date)
    FROM ranked r
   WHERE h.id = r.id
     AND r.rn > 1;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_student_plan_from_payment ON public.payments;
CREATE TRIGGER trg_sync_student_plan_from_payment
AFTER INSERT OR UPDATE OF plan_id, status, payment_date, student_id ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.sync_student_plan_from_payment();

-- Rebuild current-plan history from latest paid payments so existing students are fixed too.
WITH latest AS (
  SELECT DISTINCT ON (student_id)
         user_id, student_id, plan_id, payment_date, created_at
    FROM public.payments
   WHERE plan_id IS NOT NULL
     AND status = 'paid'
   ORDER BY student_id, payment_date DESC, created_at DESC
)
UPDATE public.student_plan_history h
   SET is_current = false,
       end_date = COALESCE(end_date, l.payment_date)
  FROM latest l
 WHERE h.student_id = l.student_id
   AND h.is_current = true
   AND (h.plan_id IS DISTINCT FROM l.plan_id OR h.start_date IS DISTINCT FROM l.payment_date);

WITH latest AS (
  SELECT DISTINCT ON (student_id)
         user_id, student_id, plan_id, payment_date, created_at
    FROM public.payments
   WHERE plan_id IS NOT NULL
     AND status = 'paid'
   ORDER BY student_id, payment_date DESC, created_at DESC
)
INSERT INTO public.student_plan_history (user_id, student_id, plan_id, start_date, end_date, is_current)
SELECT l.user_id, l.student_id, l.plan_id, l.payment_date, NULL, true
  FROM latest l
 WHERE NOT EXISTS (
   SELECT 1
     FROM public.student_plan_history h
    WHERE h.student_id = l.student_id
      AND h.plan_id = l.plan_id
      AND h.start_date = l.payment_date
      AND h.is_current = true
 );

WITH ranked AS (
  SELECT id,
         row_number() OVER (PARTITION BY student_id ORDER BY start_date DESC, created_at DESC, id DESC) AS rn
    FROM public.student_plan_history
   WHERE is_current = true
)
UPDATE public.student_plan_history h
   SET is_current = false,
       end_date = COALESCE(end_date, h.start_date)
  FROM ranked r
 WHERE h.id = r.id
   AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS student_plan_history_one_current_per_student
ON public.student_plan_history (student_id)
WHERE is_current = true;

-- Generate future sessions for active recurring classes that are missing from the agenda.
WITH class_days AS (
  SELECT c.id AS class_id,
         c.user_id,
         c.start_time,
         c.duration_minutes,
         unnest(COALESCE(NULLIF(c.days_of_week, '{}'::smallint[]), ARRAY[c.day_of_week]::smallint[]))::int AS dow
    FROM public.classes c
   WHERE c.is_active = true
     AND c.is_recurring = true
     AND COALESCE(array_length(COALESCE(NULLIF(c.days_of_week, '{}'::smallint[]), ARRAY[c.day_of_week]::smallint[]), 1), 0) > 0
), generated AS (
  SELECT cd.user_id,
         cd.class_id,
         (CURRENT_DATE + (((cd.dow - EXTRACT(DOW FROM CURRENT_DATE)::int + 7) % 7) + (week_no * 7)))::date AS session_date,
         cd.start_time,
         cd.duration_minutes
    FROM class_days cd
   CROSS JOIN generate_series(0, 11) AS week_no
)
INSERT INTO public.class_sessions (user_id, class_id, session_date, start_time, duration_minutes)
SELECT g.user_id, g.class_id, g.session_date, g.start_time, g.duration_minutes
  FROM generated g
 WHERE NOT EXISTS (
   SELECT 1
     FROM public.class_sessions cs
    WHERE cs.class_id = g.class_id
      AND cs.session_date = g.session_date
      AND cs.start_time = g.start_time
 );

-- Remove duplicated check-ins for the same student/session, keeping the earliest record.
WITH ranked AS (
  SELECT id,
         row_number() OVER (PARTITION BY student_id, session_id ORDER BY created_at ASC, id ASC) AS rn
    FROM public.class_attendance
)
DELETE FROM public.class_attendance ca
 USING ranked r
 WHERE ca.id = r.id
   AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS class_attendance_unique_student_session
ON public.class_attendance (student_id, session_id);

-- Student-facing access rules needed after removing manual class enrollment.
DROP POLICY IF EXISTS "student reads own educator sessions" ON public.class_sessions;
CREATE POLICY "student reads own educator sessions"
ON public.class_sessions
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'student'::app_role)
  AND EXISTS (
    SELECT 1
      FROM public.students s
     WHERE s.account_user_id = auth.uid()
       AND s.user_id = class_sessions.user_id
  )
);

DROP POLICY IF EXISTS "student reads own educator active classes" ON public.classes;
CREATE POLICY "student reads own educator active classes"
ON public.classes
FOR SELECT
TO authenticated
USING (
  is_active
  AND public.has_role(auth.uid(), 'student'::app_role)
  AND EXISTS (
    SELECT 1
      FROM public.students s
     WHERE s.account_user_id = auth.uid()
       AND s.user_id = classes.user_id
  )
);

DROP POLICY IF EXISTS "student reads own educator programs" ON public.programs;
CREATE POLICY "student reads own educator programs"
ON public.programs
FOR SELECT
TO authenticated
USING (
  is_active
  AND public.has_role(auth.uid(), 'student'::app_role)
  AND EXISTS (
    SELECT 1
      FROM public.students s
     WHERE s.account_user_id = auth.uid()
       AND s.user_id = programs.user_id
  )
);

DROP POLICY IF EXISTS "student reads plan programs from own current plan" ON public.plan_programs;
CREATE POLICY "student reads plan programs from own current plan"
ON public.plan_programs
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'student'::app_role)
  AND EXISTS (
    SELECT 1
      FROM public.students s
      JOIN public.student_plan_history h ON h.student_id = s.id AND h.is_current = true
     WHERE s.account_user_id = auth.uid()
       AND s.user_id = plan_programs.user_id
       AND h.plan_id = plan_programs.plan_id
  )
);

DROP POLICY IF EXISTS "student reads own attendance" ON public.class_attendance;
CREATE POLICY "student reads own attendance"
ON public.class_attendance
FOR SELECT
TO authenticated
USING (
  student_id IN (
    SELECT id FROM public.students WHERE account_user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
      FROM public.students s
      JOIN public.class_sessions cs ON cs.id = class_attendance.session_id
     WHERE s.account_user_id = auth.uid()
       AND s.user_id = cs.user_id
  )
);
REVOKE EXECUTE ON FUNCTION public.sync_student_plan_from_payment() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_student_plan_from_payment() TO service_role;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS temp_password text;

-- class_attendance: student insert/delete
DROP POLICY IF EXISTS "student inserts own attendance" ON public.class_attendance;
CREATE POLICY "student inserts own attendance" ON public.class_attendance
  FOR INSERT TO authenticated
  WITH CHECK (student_id IN (SELECT id FROM public.students WHERE account_user_id = auth.uid()));

DROP POLICY IF EXISTS "student deletes own attendance" ON public.class_attendance;
CREATE POLICY "student deletes own attendance" ON public.class_attendance
  FOR DELETE TO authenticated
  USING (student_id IN (SELECT id FROM public.students WHERE account_user_id = auth.uid()));

-- expense_categories
DROP POLICY IF EXISTS "Users manage own expense categories" ON public.expense_categories;
CREATE POLICY "Users manage own expense categories" ON public.expense_categories
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- expenses
DROP POLICY IF EXISTS "Users manage own expenses" ON public.expenses;
CREATE POLICY "Users manage own expenses" ON public.expenses
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- payments
DROP POLICY IF EXISTS "users manage own payments" ON public.payments;
CREATE POLICY "users manage own payments" ON public.payments
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- plan_programs
DROP POLICY IF EXISTS "Users manage their own plan_programs" ON public.plan_programs;
CREATE POLICY "Users manage their own plan_programs" ON public.plan_programs
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- plans
DROP POLICY IF EXISTS "users manage own plans" ON public.plans;
CREATE POLICY "users manage own plans" ON public.plans
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- pt_payments
DROP POLICY IF EXISTS "users manage own pt_payments" ON public.pt_payments;
CREATE POLICY "users manage own pt_payments" ON public.pt_payments
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- pt_plans
DROP POLICY IF EXISTS "users manage own pt_plans" ON public.pt_plans;
CREATE POLICY "users manage own pt_plans" ON public.pt_plans
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- pt_sessions
DROP POLICY IF EXISTS "users manage own pt_sessions" ON public.pt_sessions;
CREATE POLICY "users manage own pt_sessions" ON public.pt_sessions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- pt_student_contracts
DROP POLICY IF EXISTS "users manage own pt contracts" ON public.pt_student_contracts;
CREATE POLICY "users manage own pt contracts" ON public.pt_student_contracts
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- pt_students
DROP POLICY IF EXISTS "users manage own pt_students" ON public.pt_students;
CREATE POLICY "users manage own pt_students" ON public.pt_students
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- student_contracts
DROP POLICY IF EXISTS "users manage own contracts" ON public.student_contracts;
CREATE POLICY "users manage own contracts" ON public.student_contracts
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- student_plan_history
DROP POLICY IF EXISTS "users manage own history" ON public.student_plan_history;
CREATE POLICY "users manage own history" ON public.student_plan_history
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- students
DROP POLICY IF EXISTS "users manage own students" ON public.students;
CREATE POLICY "users manage own students" ON public.students
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX notifications_recipient_created_idx ON public.notifications (recipient_user_id, created_at DESC);

GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recipients read own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = recipient_user_id OR auth.uid() = sender_user_id);

CREATE POLICY "Recipients mark own as read"
  ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = recipient_user_id)
  WITH CHECK (auth.uid() = recipient_user_id);

CREATE POLICY "Senders delete own sent notifications"
  ON public.notifications FOR DELETE TO authenticated
  USING (auth.uid() = sender_user_id);

ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

CREATE TABLE public.payment_methods (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key text NOT NULL,
  label text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, key)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_methods TO authenticated;
GRANT ALL ON public.payment_methods TO service_role;

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own payment methods"
  ON public.payment_methods
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX payment_methods_user_sort_idx
  ON public.payment_methods (user_id, sort_order, label);
CREATE POLICY "pt_students self read via account_user_id" ON public.pt_students FOR SELECT TO authenticated USING (account_user_id = auth.uid());
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS attendance_offset integer NOT NULL DEFAULT 0;

CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  body TEXT,
  image_url TEXT,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their announcements"
  ON public.announcements FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated can read active announcements in window"
  ON public.announcements FOR SELECT
  TO authenticated
  USING (active = true AND now() >= starts_at AND now() <= ends_at);

CREATE INDEX announcements_user_active_idx ON public.announcements (user_id, active, starts_at, ends_at);

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Owners upload announcement images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'announcements' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Owners update announcement images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'announcements' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Owners delete announcement images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'announcements' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated read announcement images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'announcements');

-- 1) Campos novos no cadastro de aluno PT
ALTER TABLE public.pt_students
  ADD COLUMN IF NOT EXISTS temp_password text,
  ADD COLUMN IF NOT EXISTS training_plan text;

-- 2) Políticas RLS: aluno PT autenticado lê a própria linha e seus dados
DROP POLICY IF EXISTS "PT student can view own row" ON public.pt_students;
CREATE POLICY "PT student can view own row"
  ON public.pt_students
  FOR SELECT
  TO authenticated
  USING (account_user_id = auth.uid());

DROP POLICY IF EXISTS "PT student can view own sessions" ON public.pt_sessions;
CREATE POLICY "PT student can view own sessions"
  ON public.pt_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.pt_students s
      WHERE s.id = pt_sessions.pt_student_id
        AND s.account_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "PT student can view own payments" ON public.pt_payments;
CREATE POLICY "PT student can view own payments"
  ON public.pt_payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.pt_students s
      WHERE s.id = pt_payments.pt_student_id
        AND s.account_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "PT student can view plans of own payments" ON public.pt_plans;
CREATE POLICY "PT student can view plans of own payments"
  ON public.pt_plans
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.pt_payments p
      JOIN public.pt_students s ON s.id = p.pt_student_id
      WHERE p.pt_plan_id = pt_plans.id
        AND s.account_user_id = auth.uid()
    )
  );

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS cpf text,
  ADD COLUMN IF NOT EXISTS rg text,
  ADD COLUMN IF NOT EXISTS start_date date,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS postal_code text,
  ADD COLUMN IF NOT EXISTS neighborhood text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS country text;

-- pt_programs
CREATE TABLE public.pt_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pt_student_id uuid NOT NULL REFERENCES public.pt_students(id) ON DELETE CASCADE,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  goals text,
  category text NOT NULL DEFAULT 'general',
  level text NOT NULL DEFAULT 'intermediate',
  training_type text NOT NULL DEFAULT 'numeric',
  show_to_student boolean NOT NULL DEFAULT true,
  auto_archive boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  is_archived boolean NOT NULL DEFAULT false,
  is_deleted boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pt_programs TO authenticated;
GRANT ALL ON public.pt_programs TO service_role;

ALTER TABLE public.pt_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage own pt_programs"
  ON public.pt_programs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "PT students view own visible pt_programs"
  ON public.pt_programs FOR SELECT
  USING (
    show_to_student = true
    AND is_archived = false
    AND is_deleted = false
    AND EXISTS (
      SELECT 1 FROM public.pt_students s
      WHERE s.id = pt_programs.pt_student_id
        AND s.account_user_id = auth.uid()
    )
  );

CREATE TRIGGER update_pt_programs_updated_at
  BEFORE UPDATE ON public.pt_programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX pt_programs_student_idx ON public.pt_programs(pt_student_id);

-- pt_training_days
CREATE TABLE public.pt_training_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES public.pt_programs(id) ON DELETE CASCADE,
  name text NOT NULL,
  day_label text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pt_training_days TO authenticated;
GRANT ALL ON public.pt_training_days TO service_role;

ALTER TABLE public.pt_training_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage own pt_training_days"
  ON public.pt_training_days FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "PT students view own pt_training_days"
  ON public.pt_training_days FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.pt_programs p
      JOIN public.pt_students s ON s.id = p.pt_student_id
      WHERE p.id = pt_training_days.program_id
        AND s.account_user_id = auth.uid()
        AND p.show_to_student = true
        AND p.is_archived = false
        AND p.is_deleted = false
    )
  );

CREATE TRIGGER update_pt_training_days_updated_at
  BEFORE UPDATE ON public.pt_training_days
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX pt_training_days_program_idx ON public.pt_training_days(program_id);

-- pt_training_executions
CREATE TABLE public.pt_training_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  training_day_id uuid NOT NULL REFERENCES public.pt_training_days(id) ON DELETE CASCADE,
  pt_student_id uuid NOT NULL REFERENCES public.pt_students(id) ON DELETE CASCADE,
  executed_at date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  feedback text,
  rating int CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pt_training_executions TO authenticated;
GRANT ALL ON public.pt_training_executions TO service_role;

ALTER TABLE public.pt_training_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage own pt_training_executions"
  ON public.pt_training_executions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "PT students view own pt_training_executions"
  ON public.pt_training_executions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pt_students s
      WHERE s.id = pt_training_executions.pt_student_id
        AND s.account_user_id = auth.uid()
    )
  );

CREATE INDEX pt_training_executions_student_idx ON public.pt_training_executions(pt_student_id);
CREATE INDEX pt_training_executions_day_idx ON public.pt_training_executions(training_day_id);

CREATE TABLE IF NOT EXISTS public.pt_exercises_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  muscle_group text,
  description text,
  media_url text,
  media_type text,
  thumbnail_url text,
  is_global boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pt_exercises_library TO authenticated;
GRANT ALL ON public.pt_exercises_library TO service_role;

ALTER TABLE public.pt_exercises_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view own or global library"
  ON public.pt_exercises_library FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_global = true);

CREATE POLICY "insert own library"
  ON public.pt_exercises_library FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update own library"
  ON public.pt_exercises_library FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete own library"
  ON public.pt_exercises_library FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS public.pt_training_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  training_day_id uuid NOT NULL REFERENCES public.pt_training_days(id) ON DELETE CASCADE,
  exercise_library_id uuid REFERENCES public.pt_exercises_library(id) ON DELETE SET NULL,
  name text NOT NULL,
  media_url text,
  media_type text DEFAULT 'image',
  thumbnail_url text,
  sets_reps text,
  load text,
  rest_seconds text,
  observations text,
  sort_order int NOT NULL DEFAULT 0,
  is_superset boolean NOT NULL DEFAULT false,
  superset_group text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pt_training_exercises_day_idx ON public.pt_training_exercises(training_day_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pt_training_exercises TO authenticated;
GRANT ALL ON public.pt_training_exercises TO service_role;

ALTER TABLE public.pt_training_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trainer manages own exercises"
  ON public.pt_training_exercises FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "student views own visible exercises"
  ON public.pt_training_exercises FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.pt_training_days d
      JOIN public.pt_programs p ON p.id = d.program_id
      JOIN public.pt_students s ON s.id = p.pt_student_id
      WHERE d.id = pt_training_exercises.training_day_id
        AND p.show_to_student = true
        AND p.is_archived = false
        AND p.is_deleted = false
        AND s.account_user_id = auth.uid()
    )
  );

CREATE POLICY "exercise-media authenticated read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'exercise-media');

CREATE POLICY "exercise-media upload own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'exercise-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "exercise-media update own folder"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'exercise-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "exercise-media delete own folder"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'exercise-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Announcements: replace broad authenticated read with owner + linked students
DROP POLICY IF EXISTS "Authenticated read announcement images" ON storage.objects;

CREATE POLICY "Announcements: owner or linked student can read"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'announcements'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.account_user_id = auth.uid()
        AND s.user_id::text = (storage.foldername(name))[1]
    )
    OR EXISTS (
      SELECT 1 FROM public.pt_students p
      WHERE p.account_user_id = auth.uid()
        AND p.user_id::text = (storage.foldername(name))[1]
    )
  )
);

-- Exercise media: replace broad authenticated read with owner + linked PT students
DROP POLICY IF EXISTS "exercise-media authenticated read" ON storage.objects;

CREATE POLICY "exercise-media: owner or linked PT student can read"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'exercise-media'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.pt_students p
      WHERE p.account_user_id = auth.uid()
        AND p.user_id::text = (storage.foldername(name))[1]
    )
  )
);

-- 1) Add super_admin to app_role enum
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'app_role' AND e.enumlabel = 'super_admin'
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'super_admin';
  END IF;
END $$;

-- 2) Module enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_module') THEN
    CREATE TYPE public.app_module AS ENUM ('studio','pt','financeiro','crm');
  END IF;
END $$;

-- 3) user_modules table
CREATE TABLE IF NOT EXISTS public.user_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module public.app_module NOT NULL,
  active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, module)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_modules TO authenticated;
GRANT ALL ON public.user_modules TO service_role;

ALTER TABLE public.user_modules ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS trg_user_modules_updated_at ON public.user_modules;
CREATE TRIGGER trg_user_modules_updated_at
  BEFORE UPDATE ON public.user_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Helpers — compare role::text to sidestep "new enum value not committed" rule
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role::text = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_module(_user_id uuid, _module public.app_module)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT
    public.is_super_admin(_user_id)
    OR EXISTS (
      SELECT 1 FROM public.user_modules
      WHERE user_id = _user_id
        AND module = _module
        AND active = true
        AND (expires_at IS NULL OR expires_at > now())
    );
$$;

-- 5) Policies on user_modules
DROP POLICY IF EXISTS "Users view own modules" ON public.user_modules;
CREATE POLICY "Users view own modules" ON public.user_modules
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "Super admin manages modules" ON public.user_modules;
CREATE POLICY "Super admin manages modules" ON public.user_modules
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- 6) Super admin READ policies on all tenant tables
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'students','pt_students','payments','pt_payments','plans','pt_plans',
    'programs','pt_programs','plan_programs','classes','class_sessions',
    'class_attendance','class_enrollments','expenses','expense_categories',
    'announcements','notifications','payment_methods','pt_exercises_library',
    'pt_sessions','pt_student_contracts','pt_training_days',
    'pt_training_executions','pt_training_exercises','student_contracts',
    'student_plan_history','studio_settings','user_email_settings','user_roles'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Super admin can read all" ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY "Super admin can read all" ON public.%I FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()))',
      t
    );
  END LOOP;
END $$;

REVOKE ALL ON FUNCTION public.is_super_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_super_admin(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.has_module(uuid, public.app_module) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_module(uuid, public.app_module) TO authenticated, service_role;
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'announcements','class_attendance','class_enrollments','class_sessions','classes',
    'expense_categories','expenses','notifications','payment_methods','payments',
    'plan_programs','plans','programs','pt_exercises_library','pt_payments','pt_plans',
    'pt_programs','pt_sessions','pt_student_contracts','pt_students','pt_training_days',
    'pt_training_executions','pt_training_exercises','student_contracts',
    'student_plan_history','students','studio_settings','user_email_settings'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Super admin can manage all" ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY "Super admin can manage all" ON public.%I FOR ALL TO authenticated USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()))',
      t
    );
  END LOOP;
END $$;

-- 1. Soft-delete columns
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.pt_students ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.pt_payments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_students_deleted_at ON public.students(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_deleted_at ON public.payments(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pt_students_deleted_at ON public.pt_students(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pt_payments_deleted_at ON public.pt_payments(deleted_at) WHERE deleted_at IS NOT NULL;

-- 2. Split "manage all" super_admin policies so DELETE is NOT granted cross-tenant.
-- STUDENTS
DROP POLICY IF EXISTS "Super admin can manage all" ON public.students;
CREATE POLICY "Super admin can read all students" ON public.students
  FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can insert students" ON public.students
  FOR INSERT WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can update students" ON public.students
  FOR UPDATE USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));
-- (no super_admin DELETE policy: cross-tenant delete now blocked; owner-DELETE keeps working via existing "users manage own students" policy)

-- PAYMENTS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='payments' AND policyname='Super admin can manage all') THEN
    DROP POLICY "Super admin can manage all" ON public.payments;
  END IF;
END $$;
CREATE POLICY "Super admin can read all payments" ON public.payments
  FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can insert payments" ON public.payments
  FOR INSERT WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can update payments" ON public.payments
  FOR UPDATE USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

-- PT_STUDENTS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pt_students' AND policyname='Super admin can manage all') THEN
    DROP POLICY "Super admin can manage all" ON public.pt_students;
  END IF;
END $$;
CREATE POLICY "Super admin can read all pt_students" ON public.pt_students
  FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can insert pt_students" ON public.pt_students
  FOR INSERT WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can update pt_students" ON public.pt_students
  FOR UPDATE USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

-- PT_PAYMENTS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pt_payments' AND policyname='Super admin can manage all') THEN
    DROP POLICY "Super admin can manage all" ON public.pt_payments;
  END IF;
END $$;
CREATE POLICY "Super admin can read all pt_payments" ON public.pt_payments
  FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can insert pt_payments" ON public.pt_payments
  FOR INSERT WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can update pt_payments" ON public.pt_payments
  FOR UPDATE USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

-- 3. Restore helpers (super_admin only) for undelete
CREATE OR REPLACE FUNCTION public.restore_student(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF NOT public.is_super_admin(auth.uid()) THEN RAISE EXCEPTION 'not authorized'; END IF;
  UPDATE public.students SET deleted_at = NULL WHERE id = _id;
  UPDATE public.payments SET deleted_at = NULL WHERE student_id = _id;
END $$;

CREATE OR REPLACE FUNCTION public.restore_payment(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF NOT public.is_super_admin(auth.uid()) THEN RAISE EXCEPTION 'not authorized'; END IF;
  UPDATE public.payments SET deleted_at = NULL WHERE id = _id;
END $$;

REVOKE ALL ON FUNCTION public.restore_student(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.restore_payment(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.restore_student(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.restore_payment(uuid) TO authenticated;

CREATE POLICY "Super admin can delete students" ON public.students FOR DELETE USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can delete payments" ON public.payments FOR DELETE USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can delete pt_students" ON public.pt_students FOR DELETE USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can delete pt_payments" ON public.pt_payments FOR DELETE USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can delete expenses" ON public.expenses FOR DELETE USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can delete plans" ON public.plans FOR DELETE USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can delete student_plan_history" ON public.student_plan_history FOR DELETE USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can delete student_contracts" ON public.student_contracts FOR DELETE USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can delete pt_student_contracts" ON public.pt_student_contracts FOR DELETE USING (public.is_super_admin(auth.uid()));

-- Also grant super_admin UPDATE/INSERT/DELETE where missing on ancillary tables
CREATE POLICY "Super admin can update expenses" ON public.expenses FOR UPDATE USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can insert expenses" ON public.expenses FOR INSERT WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can select expenses" ON public.expenses FOR SELECT USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admin can update plans" ON public.plans FOR UPDATE USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can insert plans" ON public.plans FOR INSERT WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can select plans" ON public.plans FOR SELECT USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admin can update student_plan_history" ON public.student_plan_history FOR UPDATE USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can insert student_plan_history" ON public.student_plan_history FOR INSERT WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can select student_plan_history" ON public.student_plan_history FOR SELECT USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admin can update student_contracts" ON public.student_contracts FOR UPDATE USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can insert student_contracts" ON public.student_contracts FOR INSERT WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can select student_contracts" ON public.student_contracts FOR SELECT USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admin can update pt_student_contracts" ON public.pt_student_contracts FOR UPDATE USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can insert pt_student_contracts" ON public.pt_student_contracts FOR INSERT WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admin can select pt_student_contracts" ON public.pt_student_contracts FOR SELECT USING (public.is_super_admin(auth.uid()));

DO $$
DECLARE
  src uuid := '89a09a39-f560-43a0-9477-44719a5efda4';
  dst uuid := 'f4ddca03-67ad-43ec-bf0b-33ba28c5e295';
BEGIN
  -- Remove admin role duplicado na origem (destino já possui admin; super_admin fica na origem)
  DELETE FROM public.user_roles WHERE user_id = src AND role = 'admin';

  -- Reassinala tenant ownership de todas as tabelas com user_id
  UPDATE public.announcements            SET user_id = dst WHERE user_id = src;
  UPDATE public.class_attendance         SET user_id = dst WHERE user_id = src;
  UPDATE public.class_enrollments        SET user_id = dst WHERE user_id = src;
  UPDATE public.class_sessions           SET user_id = dst WHERE user_id = src;
  UPDATE public.classes                  SET user_id = dst WHERE user_id = src;
  UPDATE public.expense_categories       SET user_id = dst WHERE user_id = src;
  UPDATE public.expenses                 SET user_id = dst WHERE user_id = src;
  UPDATE public.payment_methods          SET user_id = dst WHERE user_id = src;
  UPDATE public.payments                 SET user_id = dst WHERE user_id = src;
  UPDATE public.plan_programs            SET user_id = dst WHERE user_id = src;
  UPDATE public.plans                    SET user_id = dst WHERE user_id = src;
  UPDATE public.programs                 SET user_id = dst WHERE user_id = src;
  UPDATE public.pt_exercises_library     SET user_id = dst WHERE user_id = src;
  UPDATE public.pt_payments              SET user_id = dst WHERE user_id = src;
  UPDATE public.pt_plans                 SET user_id = dst WHERE user_id = src;
  UPDATE public.pt_programs              SET user_id = dst WHERE user_id = src;
  UPDATE public.pt_sessions              SET user_id = dst WHERE user_id = src;
  UPDATE public.pt_student_contracts     SET user_id = dst WHERE user_id = src;
  UPDATE public.pt_students              SET user_id = dst WHERE user_id = src;
  UPDATE public.pt_training_days         SET user_id = dst WHERE user_id = src;
  UPDATE public.pt_training_executions   SET user_id = dst WHERE user_id = src;
  UPDATE public.pt_training_exercises    SET user_id = dst WHERE user_id = src;
  UPDATE public.student_contracts        SET user_id = dst WHERE user_id = src;
  UPDATE public.student_plan_history     SET user_id = dst WHERE user_id = src;
  UPDATE public.students                 SET user_id = dst WHERE user_id = src;
  UPDATE public.studio_settings          SET user_id = dst WHERE user_id = src;
  UPDATE public.user_email_settings      SET user_id = dst WHERE user_id = src;
  -- user_modules: origem não tem linhas, nada a fazer
  -- user_roles: super_admin permanece na origem por decisão do usuário

  -- Recalcula status dos alunos migrados
  PERFORM public.recalculate_all_student_statuses_for(dst);
  PERFORM public.recalculate_all_pt_student_statuses_for(dst);
END $$;

-- 1) Add max_freeze_days to Studio plans
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS max_freeze_days INTEGER;

-- 2) Create payment_freezes table (trancamentos)
CREATE TABLE IF NOT EXISTS public.payment_freezes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  freeze_days INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_freezes TO authenticated;
GRANT ALL ON public.payment_freezes TO service_role;

ALTER TABLE public.payment_freezes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own freezes"
  ON public.payment_freezes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super admin manage all freezes"
  ON public.payment_freezes FOR ALL
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE TRIGGER update_payment_freezes_updated_at
  BEFORE UPDATE ON public.payment_freezes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_payment_freezes_student ON public.payment_freezes(student_id);
CREATE INDEX IF NOT EXISTS idx_payment_freezes_payment ON public.payment_freezes(payment_id);
-- Fix: prevent students / PT students from reading their own temp_password
-- Replace the broad self-read SELECT policies with row filters that exclude the temp_password column,
-- by removing SELECT on temp_password when the reader is the linked student account.

-- We split the self-read into TWO permissive policies: one covering all NON-temp_password reads,
-- enforced with a restrictive policy that blocks any SELECT touching temp_password unless the caller
-- is the tenant owner. Since Postgres RLS is row-level (not column-level), we instead use a
-- security_invoker=off view for the self-read path and drop the direct self-read SELECT policies.

-- 1) Drop the offending self-read policies
DROP POLICY IF EXISTS "student reads own profile" ON public.students;
DROP POLICY IF EXISTS "PT student can view own row" ON public.pt_students;
DROP POLICY IF EXISTS "pt_students self read via account_user_id" ON public.pt_students;

-- 2) Create SECURITY DEFINER views (security_invoker=off) that expose every column
--    EXCEPT temp_password, filtered to the caller's linked student row.
CREATE OR REPLACE VIEW public.students_self
WITH (security_invoker = off) AS
SELECT
  id, user_id, name, email, phone, status, notes, created_at, updated_at,
  birth_date, account_user_id, attendance_offset, cpf, rg, start_date,
  address, postal_code, neighborhood, city, state, country, deleted_at
FROM public.students
WHERE account_user_id = auth.uid()
  AND deleted_at IS NULL;

CREATE OR REPLACE VIEW public.pt_students_self
WITH (security_invoker = off) AS
SELECT
  id, user_id, name, email, phone, birth_date, goal, health_notes, status,
  start_date, notes, created_at, updated_at, account_user_id, training_plan,
  deleted_at
FROM public.pt_students
WHERE account_user_id = auth.uid()
  AND deleted_at IS NULL;

-- 3) Grant read access on the views to authenticated users (RLS on base table is bypassed
--    because the views are SECURITY DEFINER / security_invoker=off, so the WHERE clause
--    inside the view is what limits the caller to their own row).
GRANT SELECT ON public.students_self TO authenticated;
GRANT SELECT ON public.pt_students_self TO authenticated;
-- Remove the SECURITY DEFINER views from previous migration
DROP VIEW IF EXISTS public.students_self;
DROP VIEW IF EXISTS public.pt_students_self;

-- Restore the students / pt_students self-read policies (rows the linked student may see)
CREATE POLICY "student reads own profile"
  ON public.students FOR SELECT
  TO authenticated
  USING (account_user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "PT student can view own row"
  ON public.pt_students FOR SELECT
  TO authenticated
  USING (account_user_id = auth.uid() AND deleted_at IS NULL);

-- Column-level: no signed-in user can read temp_password directly.
-- Tenant owners fetch it via the SECURITY DEFINER RPC below.
REVOKE SELECT (temp_password) ON public.students FROM authenticated, anon;
REVOKE SELECT (temp_password) ON public.pt_students FROM authenticated, anon;

-- RPCs: only the tenant owner (user_id = auth.uid()) may fetch a student's temp_password.
CREATE OR REPLACE FUNCTION public.get_student_credentials(_student_id uuid)
RETURNS TABLE(email text, temp_password text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT s.email, s.temp_password
    FROM public.students s
    WHERE s.id = _student_id
      AND s.user_id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.get_pt_student_credentials(_student_id uuid)
RETURNS TABLE(email text, temp_password text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT s.email, s.temp_password
    FROM public.pt_students s
    WHERE s.id = _student_id
      AND s.user_id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.get_student_credentials(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_pt_student_credentials(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_student_credentials(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_pt_student_credentials(uuid) TO authenticated;
DROP POLICY IF EXISTS "Authenticated can read active announcements in window" ON public.announcements;

CREATE POLICY "Linked students read active announcements"
  ON public.announcements FOR SELECT
  TO authenticated
  USING (
    active = true
    AND now() >= starts_at
    AND now() <= ends_at
    AND (
      auth.uid() = user_id
      OR EXISTS (
        SELECT 1 FROM public.students s
        WHERE s.account_user_id = auth.uid()
          AND s.user_id = announcements.user_id
          AND s.deleted_at IS NULL
      )
      OR EXISTS (
        SELECT 1 FROM public.pt_students ps
        WHERE ps.account_user_id = auth.uid()
          AND ps.user_id = announcements.user_id
          AND ps.deleted_at IS NULL
      )
    )
  );
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS auto_renew boolean NOT NULL DEFAULT false;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS auto_renew boolean;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS renewed_from_payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_payments_renewed_from ON public.payments(renewed_from_payment_id);
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS max_renewals integer;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS renewals_remaining integer;

CREATE INDEX IF NOT EXISTS idx_payments_user_status_due ON public.payments(user_id, status, due_date);
CREATE INDEX IF NOT EXISTS idx_payments_student ON public.payments(student_id);
CREATE INDEX IF NOT EXISTS idx_pt_payments_user_status ON public.pt_payments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_pt_payments_student ON public.pt_payments(pt_student_id);
CREATE INDEX IF NOT EXISTS idx_students_user_status ON public.students(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_pt_students_user_status ON public.pt_students(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_pt_sessions_student_date ON public.pt_sessions(pt_student_id, session_date);
CREATE INDEX IF NOT EXISTS idx_pt_sessions_user_date ON public.pt_sessions(user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_pt_training_exercises_day ON public.pt_training_exercises(training_day_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_pt_training_days_program ON public.pt_training_days(program_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses(user_id, expense_date);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_read ON public.notifications(recipient_user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_class_attendance_session ON public.class_attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_class_sessions_class_date ON public.class_sessions(class_id, session_date);

CREATE TABLE public.ai_image_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_hash text NOT NULL,
  prompt text NOT NULL,
  model text NOT NULL,
  aspect text NOT NULL,
  image_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, prompt_hash)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_image_cache TO authenticated;
GRANT ALL ON public.ai_image_cache TO service_role;

ALTER TABLE public.ai_image_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own select ai_image_cache" ON public.ai_image_cache
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own insert ai_image_cache" ON public.ai_image_cache
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own delete ai_image_cache" ON public.ai_image_cache
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE INDEX ai_image_cache_user_created_idx
  ON public.ai_image_cache (user_id, created_at DESC);

REVOKE SELECT (temp_password) ON public.students FROM authenticated, anon;
REVOKE SELECT (temp_password) ON public.pt_students FROM authenticated, anon;
GRANT SELECT (temp_password) ON public.students TO service_role;
GRANT SELECT (temp_password) ON public.pt_students TO service_role;
ALTER TABLE public.pt_programs
  ADD COLUMN IF NOT EXISTS ai_prompt text,
  ADD COLUMN IF NOT EXISTS ai_generated_at timestamptz;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS checkin_quota_override integer;

-- Security Hardening Migration v2

-- 1. PT Students RLS
ALTER TABLE public.pt_students ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pt_students TO authenticated;
GRANT ALL ON public.pt_students TO service_role;

DROP POLICY IF EXISTS "Users can manage their own PT students" ON public.pt_students;
CREATE POLICY "Users can manage their own PT students"
ON public.pt_students
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 2. Announcements RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;

DROP POLICY IF EXISTS "Users can manage their own announcements" ON public.announcements;
CREATE POLICY "Users can manage their own announcements"
ON public.announcements
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 3. Class Attendance RLS (Prevent cross-trainer check-ins)
ALTER TABLE public.class_attendance ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.class_attendance TO authenticated;
GRANT ALL ON public.class_attendance TO service_role;

DROP POLICY IF EXISTS "Students can only check-in to sessions they are linked to" ON public.class_attendance;
CREATE POLICY "Students can only check-in to sessions they are linked to"
ON public.class_attendance
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.class_sessions s
    JOIN public.students st ON st.user_id = s.user_id
    WHERE s.id = class_attendance.session_id
      AND st.account_user_id = auth.uid()
  )
);

-- 4. User Email Settings RLS (Ensuring it exists and is scoped)
-- The table was created in the failed migration (or part of it)
ALTER TABLE public.user_email_settings ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_email_settings TO authenticated;
GRANT ALL ON public.user_email_settings TO service_role;

DROP POLICY IF EXISTS "Users can manage their own email settings" ON public.user_email_settings;
CREATE POLICY "Users can manage their own email settings"
ON public.user_email_settings
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = 'f4ddca03-67ad-43ec-bf0b-33ba28c5e295') THEN
    INSERT INTO public.announcements (user_id, title, body, active, starts_at, ends_at) 
    VALUES ('f4ddca03-67ad-43ec-bf0b-33ba28c5e295', 'Status da Integração', 'não aconteceu a integração, ainda não consigo ver o banco de exercícios em minha biblioteca', true, now(), now() + interval '1 year');
  END IF;
END $$;
ALTER TABLE public.pt_training_exercises ADD COLUMN series_type text DEFAULT 'reps_load';
ALTER TABLE public.pt_training_exercises ADD COLUMN time_seconds integer;
ALTER TABLE public.pt_training_exercises ADD COLUMN inclination text;
ALTER TABLE public.pt_training_exercises ADD COLUMN pace text;
ALTER TABLE public.pt_training_exercises ADD COLUMN cadence text;
GRANT INSERT, SELECT, UPDATE, DELETE ON public.pt_training_executions TO authenticated;
GRANT ALL ON public.pt_training_executions TO service_role;

DROP POLICY IF EXISTS "PT students can insert own training executions" ON public.pt_training_executions;

CREATE POLICY "PT students can insert own training executions"
ON public.pt_training_executions
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pt_students s
    WHERE s.id = pt_training_executions.pt_student_id
    AND s.account_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "PT students view own pt_training_executions" ON public.pt_training_executions;
CREATE POLICY "PT students view own pt_training_executions"
ON public.pt_training_executions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pt_students s
    WHERE s.id = pt_training_executions.pt_student_id
    AND s.account_user_id = auth.uid()
  )
);
DROP POLICY IF EXISTS "Trainers manage own pt_training_executions" ON public.pt_training_executions;
CREATE POLICY "Trainers manage own pt_training_executions"
ON public.pt_training_executions
FOR ALL
TO authenticated
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.pt_students s
    WHERE s.id = pt_training_executions.pt_student_id
    AND s.user_id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.pt_students s
    WHERE s.id = pt_training_executions.pt_student_id
    AND s.user_id = auth.uid()
  )
);
ALTER TABLE public.pt_training_exercises ADD COLUMN substitute_exercise_id uuid REFERENCES public.pt_training_exercises(id) ON DELETE SET NULL;
GRANT ALL ON public.pt_training_exercises TO authenticated;
GRANT ALL ON public.pt_training_exercises TO service_role;
-- Add checkin_week_start_day to studio_settings
ALTER TABLE public.studio_settings 
ADD COLUMN IF NOT EXISTS checkin_week_start_day integer DEFAULT 0;

COMMENT ON COLUMN public.studio_settings.checkin_week_start_day IS 'Day of the week when check-in quota resets (0=Sunday, 1=Monday, etc.)';

-- Ensure existing rows have the default
UPDATE public.studio_settings SET checkin_week_start_day = 0 WHERE checkin_week_start_day IS NULL;
ALTER TABLE public.studio_settings ADD COLUMN IF NOT EXISTS logo_pt_base64 text;
ALTER TABLE public.studio_settings ADD COLUMN IF NOT EXISTS logo_studio_base64 text;
GRANT SELECT, UPDATE ON public.studio_settings TO authenticated;
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (qual LIKE '%is_super_admin%' OR with_check LIKE '%is_super_admin%')
      AND roles::text LIKE '%public%'
  LOOP
    EXECUTE format('ALTER POLICY %I ON %I.%I TO authenticated', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;
-- Adiciona coluna partner_student_id na tabela pt_students para suporte a alunos em dupla
ALTER TABLE public.pt_students ADD COLUMN IF NOT EXISTS partner_student_id uuid REFERENCES public.pt_students(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_pt_students_partner ON public.pt_students(partner_student_id);
-- Tabela de Avaliações Físicas e Antropometria (Personal Trainer)
create table if not exists public.pt_physical_assessments (
  id uuid primary key default gen_random_uuid(),
  pt_student_id uuid not null references public.pt_students(id) on delete cascade,
  user_id uuid not null,
  assessment_date date not null default current_date,
  weight numeric(5,2) not null,
  height numeric(5,2) not null,
  body_fat_percentage numeric(4,1),
  muscle_mass_percentage numeric(4,1),
  notes text,

  -- Circunferências (cm)
  chest numeric(5,2),
  waist numeric(5,2),
  abdomen numeric(5,2),
  hips numeric(5,2),
  right_arm numeric(5,2),
  left_arm numeric(5,2),
  right_thigh numeric(5,2),
  left_thigh numeric(5,2),
  right_calf numeric(5,2),
  left_calf numeric(5,2),

  -- Fotos de avaliação
  photo_front text,
  photo_back text,
  photo_side text,

  created_at timestamptz default now()
);

-- Índices para buscas rápidas
create index if not exists idx_pt_physical_assessments_student 
  on public.pt_physical_assessments (pt_student_id, assessment_date desc);
-- pt_student_anamnesis (Anamnese e Questionário de Prontidão PAR-Q)
CREATE TABLE IF NOT EXISTS public.pt_student_anamnesis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  pt_student_id uuid NOT NULL REFERENCES public.pt_students(id) ON DELETE CASCADE,
  
  -- Perguntas Internacionais PAR-Q (Physical Activity Readiness Questionnaire)
  parq_heart_condition boolean DEFAULT false,
  parq_chest_pain_activity boolean DEFAULT false,
  parq_chest_pain_rest boolean DEFAULT false,
  parq_dizziness boolean DEFAULT false,
  parq_bone_joint_problem boolean DEFAULT false,
  parq_blood_pressure_meds boolean DEFAULT false,
  parq_other_reason boolean DEFAULT false,
  
  -- Articulações e Lesões Ortopédicas
  joint_spine boolean DEFAULT false,
  joint_knee boolean DEFAULT false,
  joint_shoulder boolean DEFAULT false,
  joint_hip boolean DEFAULT false,
  joint_ankle boolean DEFAULT false,
  orthopedic_injuries text,
  
  -- Histórico Médico e Clínico
  medical_conditions text,
  surgeries text,
  medications text,
  
  -- Hábitos & Perfil
  sleep_hours numeric,
  stress_level text DEFAULT 'moderate',
  exercise_experience text DEFAULT 'iniciante',
  contraindications text,
  risk_level text NOT NULL DEFAULT 'low',
  notes text,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pt_student_anamnesis_student ON public.pt_student_anamnesis(pt_student_id);
CREATE INDEX IF NOT EXISTS idx_pt_student_anamnesis_user ON public.pt_student_anamnesis(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pt_student_anamnesis TO authenticated;
GRANT ALL ON public.pt_student_anamnesis TO service_role;
ALTER TABLE public.pt_student_anamnesis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users manage own pt_student_anamnesis" ON public.pt_student_anamnesis;
CREATE POLICY "users manage own pt_student_anamnesis" ON public.pt_student_anamnesis
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pt_students self read anamnesis" ON public.pt_student_anamnesis;
CREATE POLICY "pt_students self read anamnesis" ON public.pt_student_anamnesis
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.pt_students s
      WHERE s.id = pt_student_anamnesis.pt_student_id
        AND s.account_user_id = auth.uid()
    )
  );
