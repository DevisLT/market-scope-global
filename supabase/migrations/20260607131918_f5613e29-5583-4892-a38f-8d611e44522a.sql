-- Allow industry users to view pending products in their assigned categories
CREATE POLICY "Industry can view assignable products"
ON public.products
FOR SELECT
TO authenticated
USING (can_approve_product(auth.uid(), id));

-- Add WITH CHECK to existing update policy so industry approvals succeed
DROP POLICY IF EXISTS "Industry can approve assigned products" ON public.products;
CREATE POLICY "Industry can approve assigned products"
ON public.products
FOR UPDATE
TO authenticated
USING (can_approve_product(auth.uid(), id))
WITH CHECK (can_approve_product(auth.uid(), id));