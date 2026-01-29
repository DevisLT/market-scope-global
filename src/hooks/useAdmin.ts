import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { AppRole } from "@/lib/auth";

export interface AdminUser {
  id: string;
  username: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  is_suspended: boolean;
  created_at: string;
  role?: AppRole;
}

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  pendingProducts: number;
  totalPrices: number;
  activeSubscriptions: number;
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const roleMap = new Map(roles.map((r) => [r.user_id, r.role]));

      return profiles.map((profile) => ({
        ...profile,
        role: roleMap.get(profile.id),
      })) as AdminUser[];
    },
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(id, name),
          seller:profiles!products_seller_id_fkey(id, username)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [usersRes, productsRes, pendingRes, pricesRes, subsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("is_approved", false),
        supabase.from("prices").select("id", { count: "exact", head: true }),
        supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
      ]);

      return {
        totalUsers: usersRes.count || 0,
        totalProducts: productsRes.count || 0,
        pendingProducts: pendingRes.count || 0,
        totalPrices: pricesRes.count || 0,
        activeSubscriptions: subsRes.count || 0,
      } as AdminStats;
    },
  });
}

export function useApproveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from("products")
        .update({ is_approved: true })
        .eq("id", productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product approved");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve product");
    },
  });
}

export function useRejectProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from("products")
        .update({ is_approved: false, is_active: false })
        .eq("id", productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product rejected");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject product");
    },
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, suspend }: { userId: string; suspend: boolean }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_suspended: suspend })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: (_, { suspend }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(suspend ? "User suspended" : "User unsuspended");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user status");
    },
  });
}

export function useVerifyUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, verify }: { userId: string; verify: boolean }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_verified: verify })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: (_, { verify }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(verify ? "User verified" : "User unverified");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user verification");
    },
  });
}
