import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface PendingProduct {
  id: string;
  name: string;
  description: string | null;
  category_id: string;
  seller_id: string;
  unit: string;
  image_url: string | null;
  is_active: boolean;
  is_approved: boolean;
  created_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  seller?: {
    id: string;
    username: string;
    full_name: string | null;
  };
}

export function usePendingApprovals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["pending-approvals", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get categories assigned to this industry user
      const { data: assignments, error: assignError } = await supabase
        .from("industry_categories")
        .select("category_id")
        .eq("industry_user_id", user.id);

      if (assignError) throw assignError;

      if (!assignments || assignments.length === 0) {
        return [];
      }

      const categoryIds = assignments.map((a) => a.category_id);

      // Get pending products in those categories
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(id, name, slug),
          seller:profiles!products_seller_id_fkey(id, username, full_name)
        `)
        .in("category_id", categoryIds)
        .eq("is_approved", false)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PendingProduct[];
    },
    enabled: !!user,
  });
}

export function useApproveProduct() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("products")
        .update({
          is_approved: true,
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          rejection_reason: null,
        })
        .eq("id", productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product approved successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve product");
    },
  });
}

export function useRejectProduct() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ productId, reason }: { productId: string; reason: string }) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("products")
        .update({
          is_approved: false,
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          rejection_reason: reason,
        })
        .eq("id", productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product rejected");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject product");
    },
  });
}

// Hook for admin to manage industry-category assignments
export function useIndustryCategoryAssignments() {
  return useQuery({
    queryKey: ["industry-category-assignments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("industry_categories")
        .select(`
          *,
          industry_user:profiles!industry_categories_industry_user_id_fkey(id, username, full_name),
          category:categories(id, name, slug)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useAssignCategoryToIndustry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ industryUserId, categoryId }: { industryUserId: string; categoryId: string }) => {
      const { error } = await supabase
        .from("industry_categories")
        .insert({
          industry_user_id: industryUserId,
          category_id: categoryId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["industry-category-assignments"] });
      toast.success("Category assigned successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign category");
    },
  });
}

export function useUnassignCategoryFromIndustry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from("industry_categories")
        .delete()
        .eq("id", assignmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["industry-category-assignments"] });
      toast.success("Category unassigned");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unassign category");
    },
  });
}
