 import { TrendingUp, TrendingDown, Minus } from "lucide-react";
 import { Badge } from "@/components/ui/badge";
 import { cn } from "@/lib/utils";
 
 interface PriceTrendBadgeProps {
   currentPrice: number;
   previousPrice: number;
   showAmount?: boolean;
   size?: "sm" | "md" | "lg";
 }
 
 export function PriceTrendBadge({
   currentPrice,
   previousPrice,
   showAmount = true,
   size = "md",
 }: PriceTrendBadgeProps) {
   const difference = currentPrice - previousPrice;
   const percentChange = previousPrice > 0 ? ((difference / previousPrice) * 100) : 0;
   
   const isRising = difference > 0;
   const isFalling = difference < 0;
   const isStable = difference === 0;
 
   const iconSizes = {
     sm: "h-3 w-3",
     md: "h-4 w-4",
     lg: "h-5 w-5",
   };
 
   if (isStable) {
     return (
       <Badge variant="outline" className="gap-1">
         <Minus className={iconSizes[size]} />
         {showAmount && <span>Stable</span>}
       </Badge>
     );
   }
 
   if (isRising) {
     return (
       <Badge className="gap-1 bg-destructive text-destructive-foreground">
         <TrendingUp className={iconSizes[size]} />
         {showAmount && (
           <span>+{Math.abs(percentChange).toFixed(1)}%</span>
         )}
       </Badge>
     );
   }
 
   return (
     <Badge className="gap-1 bg-success text-success-foreground">
       <TrendingDown className={iconSizes[size]} />
       {showAmount && (
         <span>-{Math.abs(percentChange).toFixed(1)}%</span>
       )}
     </Badge>
   );
 }
 
 interface PriceTrendIndicatorProps {
   currentPrice: number;
   previousPrice: number;
   currency?: string;
   showDetails?: boolean;
 }
 
 export function PriceTrendIndicator({
   currentPrice,
   previousPrice,
   currency = "USD",
   showDetails = true,
 }: PriceTrendIndicatorProps) {
   const difference = currentPrice - previousPrice;
   const percentChange = previousPrice > 0 ? ((difference / previousPrice) * 100) : 0;
   
   const isRising = difference > 0;
   const isFalling = difference < 0;
 
   return (
     <div className="flex items-center gap-2">
       <span className="font-mono font-bold text-lg">
         {currency} {currentPrice.toFixed(2)}
       </span>
       <PriceTrendBadge
         currentPrice={currentPrice}
         previousPrice={previousPrice}
       />
       {showDetails && previousPrice > 0 && (
         <span className="text-xs text-muted-foreground">
           {isRising ? "↑" : isFalling ? "↓" : "→"} {currency} {Math.abs(difference).toFixed(2)}
         </span>
       )}
     </div>
   );
 }