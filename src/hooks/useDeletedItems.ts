import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCreateAuditLog } from "./useAuditLog";

export interface DeletedItem {
  id: string;
  name: string;
  type: "user" | "product" | "category" | "location" | "message";
  deleted_at: string;
  details?: Record<string, any>;
}

export function useDeletedUsers() {
  return useQuery({
    queryKey: ["deleted-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useDeletedProducts() {
  return useQuery({
    queryKey: ["deleted-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(id, name),
          seller:profiles!products_seller_id_fkey(id, username)
        `)
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useDeletedCategories() {
  return useQuery({
    queryKey: ["deleted-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useDeletedLocations() {
  return useQuery({
    queryKey: ["deleted-locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useDeletedMessages() {
  return useQuery({
    queryKey: ["deleted-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, username),
          receiver:profiles!messages_receiver_id_fkey(id, username)
        `)
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useSoftDeleteUser() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ userId, username }: { userId: string; username: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", userId);

      if (error) throw error;
      return { userId, username };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["deleted-users"] });
      toast.success("User moved to trash");
      
      createAuditLog.mutate({
        action_type: "user_deleted",
        target_type: "user",
        target_id: data.userId,
        target_name: data.username,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });
}

export function useRestoreUser() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ userId, username }: { userId: string; username: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ deleted_at: null })
        .eq("id", userId);

      if (error) throw error;
      return { userId, username };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["deleted-users"] });
      toast.success("User restored");
      
      createAuditLog.mutate({
        action_type: "user_restored",
        target_type: "user",
        target_id: data.userId,
        target_name: data.username,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to restore user");
    },
  });
}

export function useSoftDeleteProduct() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ productId, productName }: { productId: string; productName: string }) => {
      const { error } = await supabase
        .from("products")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", productId);

      if (error) throw error;
      return { productId, productName };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["deleted-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product moved to trash");
      
      createAuditLog.mutate({
        action_type: "product_deleted",
        target_type: "product",
        target_id: data.productId,
        target_name: data.productName,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });
}

export function useRestoreProduct() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ productId, productName }: { productId: string; productName: string }) => {
      const { error } = await supabase
        .from("products")
        .update({ deleted_at: null })
        .eq("id", productId);

      if (error) throw error;
      return { productId, productName };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["deleted-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product restored");
      
      createAuditLog.mutate({
        action_type: "product_restored",
        target_type: "product",
        target_id: data.productId,
        target_name: data.productName,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to restore product");
    },
  });
}

export function useSoftDeleteCategory() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ categoryId, categoryName }: { categoryId: string; categoryName: string }) => {
      const { error } = await supabase
        .from("categories")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", categoryId);

      if (error) throw error;
      return { categoryId, categoryName };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["deleted-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category moved to trash");
      
      createAuditLog.mutate({
        action_type: "category_deleted",
        target_type: "category",
        target_id: data.categoryId,
        target_name: data.categoryName,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });
}

export function useRestoreCategory() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ categoryId, categoryName }: { categoryId: string; categoryName: string }) => {
      const { error } = await supabase
        .from("categories")
        .update({ deleted_at: null })
        .eq("id", categoryId);

      if (error) throw error;
      return { categoryId, categoryName };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["deleted-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category restored");
      
      createAuditLog.mutate({
        action_type: "category_restored",
        target_type: "category",
        target_id: data.categoryId,
        target_name: data.categoryName,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to restore category");
    },
  });
}

export function useSoftDeleteLocation() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ locationId, locationName }: { locationId: string; locationName: string }) => {
      const { error } = await supabase
        .from("locations")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", locationId);

      if (error) throw error;
      return { locationId, locationName };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      queryClient.invalidateQueries({ queryKey: ["deleted-locations"] });
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location moved to trash");
      
      createAuditLog.mutate({
        action_type: "location_deleted",
        target_type: "location",
        target_id: data.locationId,
        target_name: data.locationName,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete location");
    },
  });
}

export function useRestoreLocation() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ locationId, locationName }: { locationId: string; locationName: string }) => {
      const { error } = await supabase
        .from("locations")
        .update({ deleted_at: null })
        .eq("id", locationId);

      if (error) throw error;
      return { locationId, locationName };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      queryClient.invalidateQueries({ queryKey: ["deleted-locations"] });
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location restored");
      
      createAuditLog.mutate({
        action_type: "location_restored",
        target_type: "location",
        target_id: data.locationId,
        target_name: data.locationName,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to restore location");
    },
  });
}

export function useSoftDeleteMessage() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ messageId }: { messageId: string }) => {
      const { error } = await supabase
        .from("messages")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", messageId);

      if (error) throw error;
      return { messageId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["deleted-messages"] });
      toast.success("Message moved to trash");
      
      createAuditLog.mutate({
        action_type: "message_deleted",
        target_type: "message",
        target_id: data.messageId,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete message");
    },
  });
}

export function useRestoreMessage() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ messageId }: { messageId: string }) => {
      const { error } = await supabase
        .from("messages")
        .update({ deleted_at: null })
        .eq("id", messageId);

      if (error) throw error;
      return { messageId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["deleted-messages"] });
      toast.success("Message restored");
      
      createAuditLog.mutate({
        action_type: "message_restored",
        target_type: "message",
        target_id: data.messageId,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to restore message");
    },
  });
}

export function usePermanentlyDelete() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ 
      table, 
      id, 
      name 
    }: { 
      table: "profiles" | "products" | "categories" | "locations" | "messages";
      id: string;
      name?: string;
    }) => {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { table, id, name };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`deleted-${data.table === "profiles" ? "users" : data.table}`] });
      toast.success("Permanently deleted");
      
      const actionMap: Record<string, "user_permanently_deleted" | "product_permanently_deleted" | "category_permanently_deleted" | "location_permanently_deleted" | "message_permanently_deleted"> = {
        profiles: "user_permanently_deleted",
        products: "product_permanently_deleted",
        categories: "category_permanently_deleted",
        locations: "location_permanently_deleted",
        messages: "message_permanently_deleted",
      };
      
      const targetMap: Record<string, "user" | "product" | "category" | "location" | "message"> = {
        profiles: "user",
        products: "product",
        categories: "category",
        locations: "location",
        messages: "message",
      };
      
      createAuditLog.mutate({
        action_type: actionMap[data.table],
        target_type: targetMap[data.table],
        target_id: data.id,
        target_name: data.name,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to permanently delete");
    },
  });
}
