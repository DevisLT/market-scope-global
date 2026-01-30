import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  BarChart3,
  Calendar,
  Globe,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const trendData = [
  { month: "Jul", wheat: 0.82, rice: 1.65, corn: 0.45 },
  { month: "Aug", wheat: 0.85, rice: 1.70, corn: 0.48 },
  { month: "Sep", wheat: 0.88, rice: 1.68, corn: 0.52 },
  { month: "Oct", wheat: 0.92, rice: 1.72, corn: 0.55 },
  { month: "Nov", wheat: 0.95, rice: 1.78, corn: 0.58 },
  { month: "Dec", wheat: 0.98, rice: 1.82, corn: 0.60 },
  { month: "Jan", wheat: 0.95, rice: 1.80, corn: 0.62 },
];

const topMovers = [
  { name: "Tomatoes", change: "+15.2%", price: "$2.85/kg", up: true },
  { name: "Onions", change: "+12.8%", price: "$1.45/kg", up: true },
  { name: "Petrol", change: "+8.5%", price: "$1.52/L", up: true },
  { name: "Soybean", change: "-7.3%", price: "$0.65/kg", up: false },
  { name: "Sugar", change: "-5.1%", price: "$0.72/kg", up: false },
  { name: "Palm Oil", change: "-4.8%", price: "$1.12/L", up: false },
];

const categoryTrends = [
  {
    category: "Agricultural",
    trend: "Rising",
    change: "+6.2%",
    description: "Seasonal demand and weather impacts driving prices up",
    up: true,
  },
  {
    category: "Energy",
    trend: "Stable",
    change: "+1.8%",
    description: "Balanced supply and demand with minor fluctuations",
    up: true,
  },
  {
    category: "Building Materials",
    trend: "Rising",
    change: "+4.5%",
    description: "Infrastructure projects boosting construction demand",
    up: true,
  },
  {
    category: "Consumer Goods",
    trend: "Falling",
    change: "-2.1%",
    description: "Increased competition and supply chain improvements",
    up: false,
  },
];

const regionalData = [
  { region: "North America", trend: "Stable", change: "+1.2%" },
  { region: "Europe", trend: "Rising", change: "+3.8%" },
  { region: "Asia Pacific", trend: "Rising", change: "+5.2%" },
  { region: "Africa", trend: "Rising", change: "+7.1%" },
  { region: "Latin America", trend: "Falling", change: "-1.5%" },
];

export default function Trends() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <BarChart3 className="w-4 h-4 mr-1" />
              Market Intelligence
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Market <span className="text-gradient">Trends & Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Stay ahead of the market with real-time trend analysis and
              predictive insights across all categories.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Select defaultValue="30d">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="agricultural">Agricultural</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="building">Building Materials</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Chart */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Price Trends Overview</CardTitle>
                  <CardDescription>
                    6-month price movement for major commodities
                  </CardDescription>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    Wheat
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    Rice
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    Corn
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="rice"
                      stroke="hsl(142, 76%, 36%)"
                      fill="hsl(142, 76%, 36%)"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="wheat"
                      stroke="hsl(221, 83%, 53%)"
                      fill="hsl(221, 83%, 53%)"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="corn"
                      stroke="hsl(45, 93%, 47%)"
                      fill="hsl(45, 93%, 47%)"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Top Movers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Top Movers This Week</h2>
            <p className="text-muted-foreground">Products with the biggest price changes</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {topMovers.map((item) => (
              <Card key={item.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className={`flex items-center gap-1 font-bold ${item.up ? "text-green-600" : "text-red-600"}`}>
                      {item.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {item.change}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">{item.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Category Trends */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trends by Category</h2>
            <p className="text-muted-foreground">How different sectors are performing</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {categoryTrends.map((item) => (
              <Card key={item.category}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.category}</CardTitle>
                    <Badge variant={item.up ? "default" : "destructive"}>
                      {item.trend} {item.change}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Trends */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Regional Price Trends</h2>
            <p className="text-muted-foreground">How prices are moving across different regions</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {regionalData.map((region) => (
                    <div key={region.region} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-primary" />
                        <span className="font-medium">{region.region}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{region.trend}</Badge>
                        <span className={`font-bold ${region.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                          {region.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Personalized Trend Alerts
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Set up custom alerts to get notified when products you track show
            significant price movements.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
