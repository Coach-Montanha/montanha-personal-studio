-- Allow users to delete their own notifications
CREATE POLICY "Users can delete their own notifications"
ON public.pt_notifications FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
