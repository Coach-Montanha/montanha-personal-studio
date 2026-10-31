CREATE TABLE IF NOT EXISTS public.pt_notifications (
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

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'pt_notifications' AND policyname = 'Users can see their own notifications'
    ) THEN
        CREATE POLICY "Users can see their own notifications"
        ON public.pt_notifications FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'pt_notifications' AND policyname = 'Users can update their own notifications'
    ) THEN
        CREATE POLICY "Users can update their own notifications"
        ON public.pt_notifications FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id);
    END IF;
END $$;
