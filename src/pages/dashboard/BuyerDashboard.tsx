import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import {
  Search,
  TrendingUp,
  TrendingDown,
  MapPin,
  MessageSquare,
  Heart,
  Bell,
  BarChart3,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const watchlist = [
  { name: "Tomatoes", price: "$2.50/kg", change: "+5.2%", up: true, location: "Lagos, Nigeria" },
  { name: "Petrol", price: "$1.45/L", change: "-2.1%", up: false, location: "Nairobi, Kenya" },
  { name: "Rice", price: "$1.80/kg", change: "+0.8%", up: true, location: "Mumbai, India" },
  { name: "Cement", price: "$12.00/bag", change: "-1.5%", up: false, location: "São Paulo, Brazil" },
];

const recentSearches = [
  "Tomatoes in Lagos",
  "Fuel prices Nigeria",
  "Building materials Kenya",
  "Rice price trends",
];

export default function BuyerDashboard() {
  const { profile } = useAuth();

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {profile?.full_name || profile?.username}!
            </h1>
            <p className="text-muted-foreground">
              Track prices and find the best deals across markets.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/dashboard/buyer/alerts">
                <Bell className="mr-2 h-4 w-4" />
                Alerts
              </Link>
            </Button>
            <Button asChild>
              <Link to="/prices">
                <Search className="mr-2 h-4 w-4" />
                Browse Prices
              </Link>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for products, markets, or locations..."
                  className="pl-10"
                />
              </div>
              <Button>Search</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {recentSearches.map((search) => (
                <Badge
                  key={search}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                >
                  {search}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Watchlist */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Your Watchlist
                  </CardTitle>
                  <CardDescription>Products you're tracking</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard/buyer/watchlist">Manage</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {watchlist.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.up ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}>
                        {item.up ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <TrendingDown className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{item.price}</p>
                      <p className={`text-sm ${item.up ? "text-green-600" : "text-red-600"}`}>
                        {item.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/prices">
                    <Search className="mr-2 h-4 w-4" />
                    Browse Prices
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/trends">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Trends
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/markets">
                    <MapPin className="mr-2 h-4 w-4" />
                    Compare Markets
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/dashboard/messages">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Price Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Tomatoes {"<"} $2.00</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Petrol {"<"} $1.30</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
                <Button variant="link" className="mt-4 px-0" asChild>
                  <Link to="/dashboard/buyer/alerts">Manage alerts →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
