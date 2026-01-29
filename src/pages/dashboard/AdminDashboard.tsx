import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Settings,
  Shield,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

const stats = [
  { label: "Total Users", value: "12,485", icon: Users, change: "+524 this month" },
  { label: "Active Products", value: "8,234", icon: Package, change: "+1,250 this week" },
  { label: "Total Revenue", value: "$24,500", icon: DollarSign, change: "+18% vs last month" },
  { label: "Price Updates", value: "145K", icon: TrendingUp, change: "This month" },
];

const pendingApprovals = [
  { id: 1, type: "Product", name: "Organic Wheat Flour", user: "SL234", time: "2 hours ago" },
  { id: 2, type: "Price", name: "Tomatoes - Lagos Market", user: "SL156", time: "3 hours ago" },
  { id: 3, type: "User", name: "New Industry Account", user: "TL45", time: "5 hours ago" },
];

const recentActivity = [
  { text: "New user registered: BL1024", type: "info", time: "10 min ago" },
  { text: "Price anomaly detected: Petrol in Kenya", type: "warning", time: "25 min ago" },
  { text: "Product approved: Rice Premium", type: "success", time: "1 hour ago" },
  { text: "Subscription upgraded: TL32", type: "info", time: "2 hours ago" },
];

export default function AdminDashboard() {
  const { profile } = useAuth();

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.full_name || profile?.username}. Manage the entire platform.
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
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
          {/* Pending Approvals */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Approvals
                  </CardTitle>
                  <CardDescription>Items requiring your review</CardDescription>
                </div>
                <Badge variant="destructive">{pendingApprovals.length} pending</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{item.type}</Badge>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          By {item.user} • {item.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="mt-4 px-0" asChild>
                <Link to="/dashboard/admin/approvals">View all pending items →</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/dashboard/admin/users">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/dashboard/admin/products">
                    <Package className="mr-2 h-4 w-4" />
                    Manage Products
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/dashboard/admin/analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/dashboard/admin/security">
                    <Shield className="mr-2 h-4 w-4" />
                    Security
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {activity.type === "warning" ? (
                        <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500" />
                      ) : activity.type === "success" ? (
                        <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
