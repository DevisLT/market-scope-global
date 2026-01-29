import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { usePrices, usePriceHistory } from "@/hooks/usePrices";
import { useProducts } from "@/hooks/useProducts";
import { useLocations } from "@/hooks/useLocations";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  BarChart3,
  LineChartIcon,
} from "lucide-react";
import { format } from "date-fns";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(142, 76%, 36%)",
  "hsl(262, 83%, 58%)",
];

export default function MarketComparison() {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const { data: products, isLoading: productsLoading } = useProducts({ approved: true });
  const { data: prices, isLoading: pricesLoading } = usePrices({ productId: selectedProduct });
  const { data: priceHistory } = usePriceHistory(selectedProduct);
  const { data: locations } = useLocations();

  // Prepare chart data - group by date and location
  const chartData = useMemo(() => {
    if (!priceHistory) return [];

    const grouped = priceHistory.reduce((acc, price) => {
      const date = format(new Date(price.recorded_at), "MMM d");
      if (!acc[date]) {
        acc[date] = { date };
      }
      const locationName = locations?.find((l) => l.id === price.location_id)?.name || "Unknown";
      acc[date][locationName] = price.price;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  }, [priceHistory, locations]);

  // Get unique locations for the selected product
  const productLocations = useMemo(() => {
    if (!prices) return [];
    const locationIds = [...new Set(prices.map((p) => p.location_id))];
    return locations?.filter((l) => locationIds.includes(l.id)) || [];
  }, [prices, locations]);

  // Calculate price comparison
  const priceComparison = useMemo(() => {
    if (!prices || prices.length === 0) return [];

    // Get latest price per location
    const latestByLocation = new Map<string, typeof prices[0]>();
    prices.forEach((p) => {
      const existing = latestByLocation.get(p.location_id);
      if (!existing || new Date(p.recorded_at) > new Date(existing.recorded_at)) {
        latestByLocation.set(p.location_id, p);
      }
    });

    return Array.from(latestByLocation.values()).map((p) => ({
      location: p.location?.name || "Unknown",
      price: p.price,
      currency: p.currency,
    }));
  }, [prices]);

  const isLoading = productsLoading || pricesLoading;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Market Comparison</h1>
          <p className="text-muted-foreground">
            Compare prices across different markets and track trends
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Product</CardTitle>
            <CardDescription>
              Choose a product to view price comparisons across markets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {products?.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({product.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedProduct && (
          <>
            {/* Price Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {priceComparison.map((item, index) => {
                const minPrice = Math.min(...priceComparison.map((p) => p.price));
                const maxPrice = Math.max(...priceComparison.map((p) => p.price));
                const isLowest = item.price === minPrice;
                const isHighest = item.price === maxPrice;

                return (
                  <Card key={item.location}>
                    <CardHeader className="pb-2">
                      <CardDescription>{item.location}</CardDescription>
                      <CardTitle className="flex items-center justify-between">
                        <span className="font-mono text-2xl">
                          {item.currency} {item.price.toFixed(2)}
                        </span>
                        {isLowest && (
                          <Badge className="bg-success text-success-foreground">
                            <TrendingDown className="mr-1 h-3 w-3" />
                            Lowest
                          </Badge>
                        )}
                        {isHighest && (
                          <Badge variant="destructive">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            Highest
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            {/* Price Trend Chart */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Price Trends</CardTitle>
                    <CardDescription>
                      Historical price data across markets
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setChartType("line")}
                      className={`p-2 rounded-lg transition-colors ${
                        chartType === "line"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <LineChartIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setChartType("bar")}
                      className={`p-2 rounded-lg transition-colors ${
                        chartType === "bar"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <BarChart3 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No price history available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    {chartType === "line" ? (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                          dataKey="date"
                          className="text-muted-foreground"
                          fontSize={12}
                        />
                        <YAxis className="text-muted-foreground" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        {productLocations.map((loc, index) => (
                          <Line
                            key={loc.id}
                            type="monotone"
                            dataKey={loc.name}
                            stroke={COLORS[index % COLORS.length]}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        ))}
                      </LineChart>
                    ) : (
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                          dataKey="date"
                          className="text-muted-foreground"
                          fontSize={12}
                        />
                        <YAxis className="text-muted-foreground" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        {productLocations.map((loc, index) => (
                          <Bar
                            key={loc.id}
                            dataKey={loc.name}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {!selectedProduct && (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Select a Product</h3>
              <p className="text-muted-foreground">
                Choose a product above to view market comparisons and trends
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
