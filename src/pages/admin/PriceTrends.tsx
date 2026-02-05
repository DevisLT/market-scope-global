 import { AdminLayout } from "@/components/admin";
 import { PriceTrendsDashboard } from "@/components/prices/PriceTrendsDashboard";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { usePriceTrends } from "@/hooks/usePriceTrends";
 import { TrendingUp, TrendingDown, Minus, DollarSign } from "lucide-react";
 
 export default function AdminPriceTrends() {
   const { data: trends } = usePriceTrends();
 
   const stats = {
     totalProducts: new Set(trends?.map((t) => t.productId)).size || 0,
     rising: trends?.filter((t) => t.trend === "rising").length || 0,
     falling: trends?.filter((t) => t.trend === "falling").length || 0,
     stable: trends?.filter((t) => t.trend === "stable").length || 0,
   };
 
   return (
     <AdminLayout
       title="Price Trends"
       description="Monitor price movements across all products"
     >
       {/* Stats */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-[hsl(var(--admin-foreground-muted))]">
               Products Tracked
             </CardTitle>
             <DollarSign className="h-4 w-4 text-[hsl(var(--admin-accent))]" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-[hsl(var(--admin-foreground))]">
               {stats.totalProducts}
             </div>
           </CardContent>
         </Card>
 
         <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-[hsl(var(--admin-foreground-muted))]">
               Prices Rising
             </CardTitle>
             <TrendingUp className="h-4 w-4 text-red-400" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-destructive">
               {stats.rising}
             </div>
           </CardContent>
         </Card>
 
         <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-[hsl(var(--admin-foreground-muted))]">
               Prices Falling
             </CardTitle>
             <TrendingDown className="h-4 w-4 text-[hsl(var(--admin-success))]" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-[hsl(var(--admin-success))]">
               {stats.falling}
             </div>
           </CardContent>
         </Card>
 
         <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-[hsl(var(--admin-foreground-muted))]">
               Prices Stable
             </CardTitle>
             <Minus className="h-4 w-4 text-[hsl(var(--admin-foreground-muted))]" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-[hsl(var(--admin-foreground))]">
               {stats.stable}
             </div>
           </CardContent>
         </Card>
       </div>
 
       {/* Trends Dashboard */}
       <PriceTrendsDashboard variant="admin" limit={10} showTitle={false} />
     </AdminLayout>
   );
 }