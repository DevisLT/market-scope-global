
-- Restrict profiles SELECT to authenticated users only (remove unauthenticated PII exposure)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING ((deleted_at IS NULL) OR is_admin(auth.uid()));

-- Restrict industry_categories SELECT to authenticated users
DROP POLICY IF EXISTS "Anyone can view industry category assignments" ON public.industry_categories;
CREATE POLICY "Authenticated users can view industry category assignments"
  ON public.industry_categories FOR SELECT
  TO authenticated
  USING (true);

-- Restrict notifications INSERT: only owner-targeted or admin; SECURITY DEFINER triggers bypass RLS
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "Users can insert own notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR is_admin(auth.uid()));
