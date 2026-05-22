import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const priceInputSchema = z.object({
  product_id: z.string().uuid("Invalid product"),
  location_id: z.string().uuid("Invalid location"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than zero")
    .max(9_999_999_999.99, "Price is too large"),
  currency: z.string().trim().length(3, "Currency must be a 3-letter code").optional(),
  source: z.string().trim().max(200, "Source is too long").optional(),
  notes: z.string().trim().max(500, "Notes are too long").optional(),
});

const priceUpdateSchema = priceInputSchema.partial().extend({
  is_verified: z.boolean().optional(),
});

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
      const parsed = priceInputSchema.safeParse(input);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Invalid price data");
      }
      const { data, error } = await supabase
        .from("prices")
        .insert({
          product_id: parsed.data.product_id,
          location_id: parsed.data.location_id,
          price: parsed.data.price,
          currency: parsed.data.currency,
          source: parsed.data.source,
          notes: parsed.data.notes,
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
      const parsed = priceUpdateSchema.safeParse(input);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Invalid price data");
      }
      const { data, error } = await supabase
        .from("prices")
        .update(parsed.data)
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
