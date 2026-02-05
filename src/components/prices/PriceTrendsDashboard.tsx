 
 import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
 } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import {
   TrendingUp,
   TrendingDown,
   Loader2,
   BarChart3,
 } from "lucide-react";
 import { useTopMovers } from "@/hooks/usePriceTrends";
 
 interface PriceTrendsDashboardProps {
   variant?: "default" | "admin";
   limit?: number;
   showTitle?: boolean;
 }
 
 export function PriceTrendsDashboard({
   variant = "default",
   limit = 10,
   showTitle = true,
 }: PriceTrendsDashboardProps) {
   const { data: movers, isLoading } = useTopMovers(limit);
 
   const isAdmin = variant === "admin";
   
   const cardClasses = isAdmin
     ? "bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]"
     : "";
   
   const textClasses = isAdmin
     ? "text-[hsl(var(--admin-foreground))]"
     : "";
   
   const mutedTextClasses = isAdmin
     ? "text-[hsl(var(--admin-foreground-muted))]"
     : "text-muted-foreground";
 
   if (isLoading) {
     return (
       <Card className={cardClasses}>
         <CardContent className="flex items-center justify-center py-12">
           <Loader2 className={`h-8 w-8 animate-spin ${mutedTextClasses}`} />
         </CardContent>
       </Card>
     );
   }
 
   const hasData = movers && (movers.risers.length > 0 || movers.fallers.length > 0);
 
   if (!hasData) {
     return (
       <Card className={cardClasses}>
         <CardContent className="text-center py-12">
           <BarChart3 className={`h-12 w-12 mx-auto mb-4 ${mutedTextClasses}`} />
           <h3 className={`text-lg font-medium ${textClasses}`}>No price data yet</h3>
           <p className={mutedTextClasses}>
             Price trends will appear once products have multiple price records
           </p>
         </CardContent>
       </Card>
     );
   }
 
   return (
     <div className="space-y-6">
       {showTitle && (
         <div>
           <h2 className={`text-2xl font-bold ${textClasses}`}>Price Movements</h2>
           <p className={mutedTextClasses}>Real-time price rises and falls</p>
         </div>
       )}
 
       <div className="grid md:grid-cols-2 gap-6">
         {/* Rising Prices */}
         <Card className={cardClasses}>
           <CardHeader className="pb-3">
             <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
               <TrendingUp className="h-5 w-5 text-destructive" />
               Price Increases
             </CardTitle>
             <CardDescription className={mutedTextClasses}>
               Products with rising prices
             </CardDescription>
           </CardHeader>
           <CardContent>
             {movers.risers.length === 0 ? (
               <p className={`text-sm ${mutedTextClasses}`}>No price increases detected</p>
             ) : (
               <div className="space-y-3">
                 {movers.risers.map((item) => (
                   <div
                     key={`${item.productId}-${item.locationId}`}
                     className={`flex items-center justify-between p-3 rounded-lg ${
                       isAdmin ? "bg-[hsl(var(--admin-bg-muted))]" : "bg-muted/50"
                     }`}
                   >
                     <div>
                       <p className={`font-medium ${textClasses}`}>{item.productName}</p>
                       <p className={`text-sm ${mutedTextClasses}`}>
                         {item.locationName} • per {item.unit}
                       </p>
                     </div>
                     <div className="text-right">
                       <div className="flex items-center gap-2">
                         <span className={`font-mono font-bold ${textClasses}`}>
                           {item.currency} {item.currentPrice.toFixed(2)}
                         </span>
                         <Badge className="bg-destructive text-destructive-foreground">
                           <TrendingUp className="h-3 w-3 mr-1" />
                           +{item.percentChange.toFixed(1)}%
                         </Badge>
                       </div>
                       <p className={`text-xs ${mutedTextClasses}`}>
                         was {item.currency} {item.previousPrice.toFixed(2)}
                       </p>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </CardContent>
         </Card>
 
         {/* Falling Prices */}
         <Card className={cardClasses}>
           <CardHeader className="pb-3">
             <CardTitle className={`flex items-center gap-2 ${textClasses}`}>
               <TrendingDown className="h-5 w-5 text-success" />
               Price Decreases
             </CardTitle>
             <CardDescription className={mutedTextClasses}>
               Products with falling prices
             </CardDescription>
           </CardHeader>
           <CardContent>
             {movers.fallers.length === 0 ? (
               <p className={`text-sm ${mutedTextClasses}`}>No price decreases detected</p>
             ) : (
               <div className="space-y-3">
                 {movers.fallers.map((item) => (
                   <div
                     key={`${item.productId}-${item.locationId}`}
                     className={`flex items-center justify-between p-3 rounded-lg ${
                       isAdmin ? "bg-[hsl(var(--admin-bg-muted))]" : "bg-muted/50"
                     }`}
                   >
                     <div>
                       <p className={`font-medium ${textClasses}`}>{item.productName}</p>
                       <p className={`text-sm ${mutedTextClasses}`}>
                         {item.locationName} • per {item.unit}
                       </p>
                     </div>
                     <div className="text-right">
                       <div className="flex items-center gap-2">
                         <span className={`font-mono font-bold ${textClasses}`}>
                           {item.currency} {item.currentPrice.toFixed(2)}
                         </span>
                         <Badge className="bg-success text-success-foreground">
                           <TrendingDown className="h-3 w-3 mr-1" />
                           {item.percentChange.toFixed(1)}%
                         </Badge>
                       </div>
                       <p className={`text-xs ${mutedTextClasses}`}>
                         was {item.currency} {item.previousPrice.toFixed(2)}
                       </p>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </CardContent>
         </Card>
       </div>
     </div>
   );
 }