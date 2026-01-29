import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type LocationType = Database["public"]["Enums"]["location_type"];

export interface Location {
  id: string;
  name: string;
  slug: string;
  type: LocationType;
  country_code: string | null;
  currency_code: string | null;
  parent_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useLocations(type?: LocationType) {
  return useQuery({
    queryKey: ["locations", type],
    queryFn: async () => {
      let query = supabase
        .from("locations")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (type) {
        query = query.eq("type", type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Location[];
    },
  });
}

export function useLocation(id: string) {
  return useQuery({
    queryKey: ["location", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Location;
    },
    enabled: !!id,
  });
}
