-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'product_approved', 'product_rejected', 'new_message', 'product_pending_approval'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  reference_id UUID, -- can reference product_id, message_id, etc.
  reference_type TEXT, -- 'product', 'message', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create industry_categories table for category assignments
CREATE TABLE public.industry_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(industry_user_id, category_id)
);

-- Add approval fields to products
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage notifications"
  ON public.notifications FOR ALL
  USING (is_admin(auth.uid()));

-- Enable RLS on industry_categories
ALTER TABLE public.industry_categories ENABLE ROW LEVEL SECURITY;

-- Industry categories policies
CREATE POLICY "Anyone can view industry category assignments"
  ON public.industry_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage industry categories"
  ON public.industry_categories FOR ALL
  USING (is_admin(auth.uid()));

-- Create function to check if industry user can approve product
CREATE OR REPLACE FUNCTION public.can_approve_product(_user_id UUID, _product_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.industry_categories ic
    JOIN public.products p ON p.category_id = ic.category_id
    WHERE ic.industry_user_id = _user_id
      AND p.id = _product_id
      AND is_industry(_user_id)
  ) OR is_admin(_user_id)
$$;

-- Policy for industry users to update products they can approve
CREATE POLICY "Industry can approve assigned products"
  ON public.products FOR UPDATE
  USING (can_approve_product(auth.uid(), id));

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create function to notify seller when product is approved/rejected
CREATE OR REPLACE FUNCTION public.notify_product_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If product approval status changed
  IF OLD.is_approved IS DISTINCT FROM NEW.is_approved THEN
    IF NEW.is_approved = true THEN
      INSERT INTO public.notifications (user_id, type, title, message, reference_id, reference_type)
      VALUES (
        NEW.seller_id,
        'product_approved',
        'Product Approved',
        'Your product "' || NEW.name || '" has been approved and is now visible to buyers.',
        NEW.id,
        'product'
      );
    ELSIF NEW.rejection_reason IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, type, title, message, reference_id, reference_type)
      VALUES (
        NEW.seller_id,
        'product_rejected',
        'Product Rejected',
        'Your product "' || NEW.name || '" was rejected. Reason: ' || NEW.rejection_reason,
        NEW.id,
        'product'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for product approval notifications
CREATE TRIGGER on_product_approval
  AFTER UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_product_approval();

-- Create function to notify industry users when product is created
CREATE OR REPLACE FUNCTION public.notify_industry_new_product()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  industry_user RECORD;
BEGIN
  -- Notify all industry users assigned to this product's category
  FOR industry_user IN 
    SELECT ic.industry_user_id 
    FROM public.industry_categories ic
    WHERE ic.category_id = NEW.category_id
  LOOP
    INSERT INTO public.notifications (user_id, type, title, message, reference_id, reference_type)
    VALUES (
      industry_user.industry_user_id,
      'product_pending_approval',
      'New Product Awaiting Approval',
      'A new product "' || NEW.name || '" needs your review.',
      NEW.id,
      'product'
    );
  END LOOP;
  RETURN NEW;
END;
$$;

-- Create trigger for new product notifications
CREATE TRIGGER on_product_created
  AFTER INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_industry_new_product();

-- Create function to notify on new message
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sender_name TEXT;
BEGIN
  SELECT COALESCE(full_name, username) INTO sender_name
  FROM public.profiles WHERE id = NEW.sender_id;
  
  INSERT INTO public.notifications (user_id, type, title, message, reference_id, reference_type)
  VALUES (
    NEW.receiver_id,
    'new_message',
    'New Message',
    'You have a new message from ' || sender_name,
    NEW.id,
    'message'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new message notifications
CREATE TRIGGER on_message_created
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_message();