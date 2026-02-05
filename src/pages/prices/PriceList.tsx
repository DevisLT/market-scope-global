 import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
 import { usePrices, usePriceHistory } from "@/hooks/usePrices";
 import { usePriceTrends } from "@/hooks/usePriceTrends";
import { useCategories } from "@/hooks/useCategories";
import { useLocations } from "@/hooks/useLocations";
import {
  Search,
  Filter,
   TrendingUp as TrendingUpIcon,
   TrendingDown as TrendingDownIcon,
   Minus as MinusIcon,
  Loader2,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";

 import { PriceTrendBadge } from "@/components/prices/PriceTrendBadge";
 
 export default function PriceList() {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("");

  const { data: prices, isLoading } = usePrices({ limit: 100 });
  const { data: locations } = useLocations();
 const { data: priceTrends } = usePriceTrends();
 
 // Create a map for quick trend lookup
 const trendMap = useMemo(() => {
   const map = new Map<string, { currentPrice: number; previousPrice: number }>();
   priceTrends?.forEach((trend) => {
     const key = `${trend.productId}-${trend.locationId}`;
     map.set(key, {
       currentPrice: trend.currentPrice,
       previousPrice: trend.previousPrice,
     });
   });
   return map;
 }, [priceTrends]);

  const filteredPrices = prices?.filter((p) => {
    const matchesSearch = p.product?.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesLocation = !locationFilter || p.location_id === locationFilter;
    return matchesSearch && matchesLocation;
  });

  // Group prices by product for comparison
  const groupedByProduct = filteredPrices?.reduce((acc, price) => {
    const productId = price.product_id;
    if (!acc[productId]) {
      acc[productId] = [];
    }
    acc[productId].push(price);
    return acc;
  }, {} as Record<string, typeof filteredPrices>);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Market Prices</h1>
          <p className="text-muted-foreground">
            Browse and compare prices across different markets
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={locationFilter || "all"} onValueChange={(v) => setLocationFilter(v === "all" ? "" : v)}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations?.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setLocationFilter("");
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredPrices?.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
               <TrendingUpIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No prices found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Latest Prices</CardTitle>
              <CardDescription>
                Showing {filteredPrices?.length} price records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrices?.map((price) => (
                    <TableRow key={price.id}>
                      <TableCell>
                        <div className="font-medium">{price.product?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          per {price.product?.unit}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {price.location?.name}
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {price.location?.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2">
                           <span className="font-mono font-bold text-lg">
                             {price.currency} {price.price.toFixed(2)}
                           </span>
                           {(() => {
                             const key = `${price.product_id}-${price.location_id}`;
                             const trend = trendMap.get(key);
                             if (trend && trend.previousPrice !== trend.currentPrice) {
                               return (
                                 <PriceTrendBadge
                                   currentPrice={trend.currentPrice}
                                   previousPrice={trend.previousPrice}
                                   size="sm"
                                 />
                               );
                             }
                             return null;
                           })()}
                         </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {price.product?.seller?.username || "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(price.recorded_at), "MMM d, yyyy")}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
