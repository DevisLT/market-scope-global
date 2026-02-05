 import { useQuery } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 
 export interface PriceTrend {
   productId: string;
   productName: string;
   unit: string;
   locationId: string;
   locationName: string;
   currentPrice: number;
   previousPrice: number;
   currency: string;
   priceChange: number;
   percentChange: number;
   trend: "rising" | "falling" | "stable";
   recordedAt: string;
 }
 
 export function usePriceTrends(options?: {
   limit?: number;
   categoryId?: string;
   locationId?: string;
 }) {
   return useQuery({
     queryKey: ["price-trends", options],
     queryFn: async () => {
       // Get all prices with product and location info, ordered by recorded_at
       let query = supabase
         .from("prices")
         .select(`
           id,
           product_id,
           location_id,
           price,
           currency,
           recorded_at,
           product:products(id, name, unit, category_id),
           location:locations(id, name)
         `)
         .order("recorded_at", { ascending: false });
 
       const { data: prices, error } = await query;
       if (error) throw error;
 
       // Group prices by product-location combination
       const priceMap = new Map<string, typeof prices>();
       
       prices?.forEach((price) => {
         const key = `${price.product_id}-${price.location_id}`;
         const existing = priceMap.get(key) || [];
         existing.push(price);
         priceMap.set(key, existing);
       });
 
       // Calculate trends for each product-location combination
       const trends: PriceTrend[] = [];
 
       priceMap.forEach((priceRecords) => {
         if (priceRecords.length < 1) return;
 
         // Sort by date descending
         priceRecords.sort((a, b) => 
           new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
         );
 
         const current = priceRecords[0];
         const previous = priceRecords[1] || current;
         
         const priceChange = current.price - previous.price;
         const percentChange = previous.price > 0 
           ? ((priceChange / previous.price) * 100) 
           : 0;
 
         let trend: "rising" | "falling" | "stable" = "stable";
         if (priceChange > 0) trend = "rising";
         else if (priceChange < 0) trend = "falling";
 
         // Filter by category if specified
         if (options?.categoryId && current.product?.category_id !== options.categoryId) {
           return;
         }
 
         // Filter by location if specified
         if (options?.locationId && current.location_id !== options.locationId) {
           return;
         }
 
         trends.push({
           productId: current.product_id,
           productName: current.product?.name || "Unknown",
           unit: current.product?.unit || "unit",
           locationId: current.location_id,
           locationName: current.location?.name || "Unknown",
           currentPrice: current.price,
           previousPrice: previous.price,
           currency: current.currency,
           priceChange,
           percentChange,
           trend,
           recordedAt: current.recorded_at,
         });
       });
 
       // Sort by absolute percent change (most significant changes first)
       trends.sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange));
 
       // Apply limit
       if (options?.limit) {
         return trends.slice(0, options.limit);
       }
 
       return trends;
     },
   });
 }
 
 export function useTopMovers(limit: number = 6) {
   const { data: trends, ...rest } = usePriceTrends();
 
   const topMovers = trends?.slice(0, limit) || [];
   const risers = topMovers.filter((t) => t.trend === "rising").slice(0, Math.ceil(limit / 2));
   const fallers = topMovers.filter((t) => t.trend === "falling").slice(0, Math.ceil(limit / 2));
 
   return {
     ...rest,
     data: { risers, fallers, all: topMovers },
   };
 }