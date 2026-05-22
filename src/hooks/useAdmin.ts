import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { AppRole } from "@/lib/auth";
import { useCreateAuditLog } from "./useAuditLog";

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
        .is("deleted_at", null)
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
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ productId, productName }: { productId: string; productName: string }) => {
      const { error } = await supabase
        .from("products")
        .update({ is_approved: true })
        .eq("id", productId);

      if (error) throw error;
      return { productId, productName };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product approved");
      
      createAuditLog.mutate({
        action_type: "product_approved",
        target_type: "product",
        target_id: data.productId,
        target_name: data.productName,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve product");
    },
  });
}

export function useRejectProduct() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ productId, productName }: { productId: string; productName: string }) => {
      const { error } = await supabase
        .from("products")
        .update({ is_approved: false, is_active: false })
        .eq("id", productId);

      if (error) throw error;
      return { productId, productName };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product rejected");
      
      createAuditLog.mutate({
        action_type: "product_rejected",
        target_type: "product",
        target_id: data.productId,
        target_name: data.productName,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject product");
    },
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ userId, username, suspend }: { userId: string; username: string; suspend: boolean }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_suspended: suspend })
        .eq("id", userId);

      if (error) throw error;
      return { userId, username, suspend };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(data.suspend ? "User suspended" : "User unsuspended");
      
      createAuditLog.mutate({
        action_type: data.suspend ? "user_suspended" : "user_unsuspended",
        target_type: "user",
        target_id: data.userId,
        target_name: data.username,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user status");
    },
  });
}

export function useVerifyUser() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ userId, username, verify }: { userId: string; username: string; verify: boolean }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_verified: verify })
        .eq("id", userId);

      if (error) throw error;
      return { userId, username, verify };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(data.verify ? "User verified" : "User unverified");
      
      createAuditLog.mutate({
        action_type: data.verify ? "user_verified" : "user_unverified",
        target_type: "user",
        target_id: data.userId,
        target_name: data.username,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user verification");
    },
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({
      userId,
      username,
      updates,
    }: {
      userId: string;
      username: string;
      updates: { full_name?: string; email?: string; phone?: string };
    }) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (error) throw error;
      return { userId, username, updates };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Profile updated");

      createAuditLog.mutate({
        action_type: "profile_updated",
        target_type: "user",
        target_id: data.userId,
        target_name: data.username,
        details: data.updates,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}
