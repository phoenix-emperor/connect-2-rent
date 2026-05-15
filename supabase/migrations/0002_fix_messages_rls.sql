-- Ensures that the INSERT policy for messages exists and is correct

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can send messages." ON public.messages;

CREATE POLICY "Users can send messages."
  ON public.messages FOR INSERT
  WITH CHECK ( auth.uid() = sender_id );
