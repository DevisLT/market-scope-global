import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart3,
  TrendingUp,
  FileText,
  MessageSquare,
  Plus,
  Globe,
  Factory,
  Package,
} from "lucide-react";

const stats = [
  { label: "Active Demands", value: "5", icon: FileText, change: "2 responses" },
  { label: "Markets Tracked", value: "24", icon: Globe, change: "Across 8 countries" },
  { label: "Suppliers Connected", value: "18", icon: Factory, change: "+3 this month" },
  { label: "Products Analyzed", value: "156", icon: Package, change: "Last 30 days" },
];

const demandListings = [
  {
    id: 1,
    title: "Bulk Rice Supply - 500 tonnes",
    category: "Food & Agriculture",
    budget: "$50,000 - $75,000",
    deadline: "2024-02-15",
    responses: 8,
    status: "active",
  },
  {
    id: 2,
    title: "Cement for Construction Project",
    category: "Building Materials",
    budget: "$25,000 - $30,000",
    deadline: "2024-02-20",
    responses: 5,
    status: "active",
  },
  {
    id: 3,
    title: "Steel Rods - Industrial Grade",
    category: "Metals & Minerals",
    budget: "$100,000+",
    deadline: "2024-01-30",
    responses: 12,
    status: "closed",
  },
];

export default function IndustryDashboard() {
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
              Access market intelligence and manage bulk demands.
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard/industry/demands/new">
              <Plus className="mr-2 h-4 w-4" />
              Post New Demand
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Demand Listings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Demand Listings</CardTitle>
                  <CardDescription>Manage your bulk purchase requests</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard/industry/demands">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demandListings.map((demand) => (
                  <div
                    key={demand.id}
                    className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{demand.title}</h4>
                        <p className="text-sm text-muted-foreground">{demand.category}</p>
                      </div>
                      <Badge variant={demand.status === "active" ? "default" : "secondary"}>
                        {demand.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Budget: {demand.budget}</span>
                      <span>Deadline: {demand.deadline}</span>
                      <span className="text-primary">{demand.responses} responses</span>
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
                  <Link to="/dashboard/industry/demands/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Post Demand
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/dashboard/industry/analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Market Analytics
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/trends">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Price Trends
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

            {/* Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
                <CardDescription>Key trends this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Food & Agriculture</span>
                    <Badge variant="outline" className="text-green-600">
                      +2.5%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Building Materials</span>
                    <Badge variant="outline" className="text-red-600">
                      -1.2%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fuel & Energy</span>
                    <Badge variant="outline" className="text-green-600">
                      +0.8%
                    </Badge>
                  </div>
                </div>
                <Button variant="link" className="mt-4 px-0" asChild>
                  <Link to="/dashboard/industry/analytics">Full report →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
