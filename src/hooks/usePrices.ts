import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Price {
  id: string;
  product_id: string;
  location_id: string;
  price: number;
  currency: string;
  source: string | null;
  notes: string | null;
  is_verified: boolean;
  recorded_at: string;
  created_at: string;
  product?: {
    id: string;
    name: string;
    unit: string;
    seller?: {
      id: string;
      username: string;
    };
  };
  location?: {
    id: string;
    name: string;
    type: string;
  };
}

export interface CreatePriceInput {
  product_id: string;
  location_id: string;
  price: number;
  currency?: string;
  source?: string;
  notes?: string;
}

export interface UpdatePriceInput extends Partial<CreatePriceInput> {
  is_verified?: boolean;
}

export function usePrices(options?: { 
  productId?: string; 
  locationId?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["prices", options],
    queryFn: async () => {
      let query = supabase
        .from("prices")
        .select(`
          *,
          product:products(id, name, unit, seller:profiles!products_seller_id_fkey(id, username)),
          location:locations(id, name, type)
        `)
        .order("recorded_at", { ascending: false });

      if (options?.productId) {
        query = query.eq("product_id", options.productId);
      }
      if (options?.locationId) {
        query = query.eq("location_id", options.locationId);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Price[];
    },
  });
}

export function usePriceHistory(productId: string, locationId?: string) {
  return useQuery({
    queryKey: ["price-history", productId, locationId],
    queryFn: async () => {
      let query = supabase
        .from("prices")
        .select("*")
        .eq("product_id", productId)
        .order("recorded_at", { ascending: true });

      if (locationId) {
        query = query.eq("location_id", locationId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Price[];
    },
    enabled: !!productId,
  });
}

export function useCreatePrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePriceInput) => {
      const { data, error } = await supabase
        .from("prices")
        .insert({
          ...input,
          recorded_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prices"] });
      queryClient.invalidateQueries({ queryKey: ["price-history"] });
      toast.success("Price added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add price");
    },
  });
}

export function useUpdatePrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdatePriceInput & { id: string }) => {
      const { data, error } = await supabase
        .from("prices")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prices"] });
      queryClient.invalidateQueries({ queryKey: ["price-history"] });
      toast.success("Price updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update price");
    },
  });
}
