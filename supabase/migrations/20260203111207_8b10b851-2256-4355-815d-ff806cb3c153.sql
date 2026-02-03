-- Add deleted_at column for soft delete to all admin-managed tables

-- Profiles table
ALTER TABLE public.profiles ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Products table  
ALTER TABLE public.products ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Categories table
ALTER TABLE public.categories ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Locations table
ALTER TABLE public.locations ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Messages table
ALTER TABLE public.messages ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create indexes for efficient soft delete queries
CREATE INDEX idx_profiles_deleted_at ON public.profiles(deleted_at);
CREATE INDEX idx_products_deleted_at ON public.products(deleted_at);
CREATE INDEX idx_categories_deleted_at ON public.categories(deleted_at);
CREATE INDEX idx_locations_deleted_at ON public.locations(deleted_at);
CREATE INDEX idx_messages_deleted_at ON public.messages(deleted_at);

-- Update RLS policies to exclude soft-deleted records for non-admins

-- Update profiles SELECT policy (users can only view non-deleted profiles)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view all profiles" ON public.profiles
FOR SELECT USING (deleted_at IS NULL OR is_admin(auth.uid()));

-- Update products SELECT policies
DROP POLICY IF EXISTS "Anyone can view approved products" ON public.products;
CREATE POLICY "Anyone can view approved products" ON public.products
FOR SELECT USING ((is_active = true AND is_approved = true AND deleted_at IS NULL));

DROP POLICY IF EXISTS "Sellers can view own products" ON public.products;
CREATE POLICY "Sellers can view own products" ON public.products
FOR SELECT USING (seller_id = auth.uid() AND deleted_at IS NULL);

-- Update categories SELECT policy
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
CREATE POLICY "Anyone can view active categories" ON public.categories
FOR SELECT USING (is_active = true AND deleted_at IS NULL);

-- Update locations SELECT policy  
DROP POLICY IF EXISTS "Anyone can view active locations" ON public.locations;
CREATE POLICY "Anyone can view active locations" ON public.locations
FOR SELECT USING (is_active = true AND deleted_at IS NULL);

-- Update messages SELECT policy for non-admins
DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
CREATE POLICY "Users can view own messages" ON public.messages
FOR SELECT USING ((sender_id = auth.uid() OR receiver_id = auth.uid()) AND deleted_at IS NULL);

-- Function to soft delete a record
CREATE OR REPLACE FUNCTION public.soft_delete_record(
  table_name TEXT,
  record_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE format('UPDATE public.%I SET deleted_at = now() WHERE id = $1', table_name) USING record_id;
END;
$$;

-- Function to restore a soft-deleted record
CREATE OR REPLACE FUNCTION public.restore_record(
  table_name TEXT,
  record_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE format('UPDATE public.%I SET deleted_at = NULL WHERE id = $1', table_name) USING record_id;
END;
$$;