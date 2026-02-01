-- Add full admin access to messages table (currently only SELECT)
CREATE POLICY "Admins can update messages"
ON public.messages
FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete messages"
ON public.messages
FOR DELETE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert messages"
ON public.messages
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Add admin management policies for profiles (currently only user self-update)
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
USING (is_admin(auth.uid()));