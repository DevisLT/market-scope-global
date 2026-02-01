import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCreateAuditLog } from "./useAuditLog";
import type { Category } from "./useCategories";
import type { Location, LocationType } from "./useLocations";

// Categories CRUD
export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Category[];
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async (category: {
      name: string;
      slug: string;
      description?: string;
      icon?: string;
      parent_id?: string;
      is_active?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("categories")
        .insert(category)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created");

      createAuditLog.mutate({
        action_type: "category_created",
        target_type: "category",
        target_id: data.id,
        target_name: data.name,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create category");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      name?: string;
      slug?: string;
      description?: string;
      icon?: string;
      parent_id?: string | null;
      is_active?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated");

      createAuditLog.mutate({
        action_type: "category_updated",
        target_type: "category",
        target_id: data.id,
        target_name: data.name,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;
      return { id, name };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");

      createAuditLog.mutate({
        action_type: "category_deleted",
        target_type: "category",
        target_id: data.id,
        target_name: data.name,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });
}

// Locations CRUD
export function useAdminLocations() {
  return useQuery({
    queryKey: ["admin-locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Location[];
    },
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async (location: {
      name: string;
      slug: string;
      type: LocationType;
      country_code?: string;
      currency_code?: string;
      parent_id?: string;
      is_active?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("locations")
        .insert(location)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location created");

      createAuditLog.mutate({
        action_type: "location_created",
        target_type: "location",
        target_id: data.id,
        target_name: data.name,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create location");
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      name?: string;
      slug?: string;
      type?: LocationType;
      country_code?: string | null;
      currency_code?: string | null;
      parent_id?: string | null;
      is_active?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("locations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location updated");

      createAuditLog.mutate({
        action_type: "location_updated",
        target_type: "location",
        target_id: data.id,
        target_name: data.name,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update location");
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase.from("locations").delete().eq("id", id);

      if (error) throw error;
      return { id, name };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location deleted");

      createAuditLog.mutate({
        action_type: "location_deleted",
        target_type: "location",
        target_id: data.id,
        target_name: data.name,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete location");
    },
  });
}
