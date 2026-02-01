import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin";
import { useAuth } from "@/hooks/useAuth";
import { useAdminStats } from "@/hooks/useAdmin";
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
  Loader2,
  ArrowUpRight,
  Activity,
} from "lucide-react";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { data: stats, isLoading: statsLoading } = useAdminStats();

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      change: "+12% this month",
      color: "text-[hsl(var(--admin-accent))]",
    },
    {
      label: "Active Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      change: "+8% this week",
      color: "text-[hsl(var(--admin-success))]",
    },
    {
      label: "Revenue",
      value: `$${((stats?.activeSubscriptions || 0) * 9.99).toFixed(0)}`,
      icon: DollarSign,
      change: "+18% vs last month",
      color: "text-[hsl(var(--admin-warning))]",
    },
    {
      label: "Price Updates",
      value: stats?.totalPrices || 0,
      icon: TrendingUp,
      change: "This month",
      color: "text-purple-400",
    },
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

  return (
    <AdminLayout title="Dashboard" description={`Welcome back, ${profile?.full_name || profile?.username}`}>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))] hover:border-[hsl(var(--admin-accent))]/50 transition-colors"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--admin-foreground-muted))]">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--admin-foreground))]">
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value
                )}
              </div>
              <p className="text-xs text-[hsl(var(--admin-foreground-muted))] flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-[hsl(var(--admin-success))]" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <Card className="lg:col-span-2 bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-[hsl(var(--admin-foreground))]">
                  <Clock className="h-5 w-5 text-[hsl(var(--admin-accent))]" />
                  Pending Approvals
                </CardTitle>
                <CardDescription className="text-[hsl(var(--admin-foreground-muted))]">
                  Items requiring your review
                </CardDescription>
              </div>
              <Badge className="bg-[hsl(var(--admin-danger))]/20 text-[hsl(var(--admin-danger))] border border-[hsl(var(--admin-danger))]/30">
                {stats?.pendingProducts || pendingApprovals.length} pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[hsl(var(--admin-bg-muted))] border border-[hsl(var(--admin-border))] hover:border-[hsl(var(--admin-accent))]/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className="border-[hsl(var(--admin-accent))] text-[hsl(var(--admin-accent))]"
                    >
                      {item.type}
                    </Badge>
                    <div>
                      <p className="font-medium text-[hsl(var(--admin-foreground))]">{item.name}</p>
                      <p className="text-sm text-[hsl(var(--admin-foreground-muted))]">
                        By {item.user} • {item.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))] hover:bg-[hsl(var(--admin-bg-muted))]"
                    >
                      Review
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[hsl(var(--admin-accent))] text-[hsl(var(--admin-accent-foreground))] hover:bg-[hsl(var(--admin-accent-glow))]"
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="link"
              className="mt-4 px-0 text-[hsl(var(--admin-accent))]"
              asChild
            >
              <Link to="/admin">View all pending items →</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--admin-foreground))]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { icon: Users, label: "Manage Users", href: "/admin" },
                { icon: Package, label: "Manage Products", href: "/admin" },
                { icon: BarChart3, label: "View Analytics", href: "/admin/analytics" },
                { icon: Shield, label: "Security", href: "/admin/security" },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="w-full justify-start border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))] hover:bg-[hsl(var(--admin-bg-muted))] hover:border-[hsl(var(--admin-accent))]/50"
                  asChild
                >
                  <Link to={action.href}>
                    <action.icon className="mr-2 h-4 w-4 text-[hsl(var(--admin-accent))]" />
                    {action.label}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--admin-foreground))]">
                <Activity className="h-4 w-4 text-[hsl(var(--admin-accent))]" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {activity.type === "warning" ? (
                      <AlertTriangle className="h-4 w-4 mt-0.5 text-[hsl(var(--admin-warning))]" />
                    ) : activity.type === "success" ? (
                      <CheckCircle className="h-4 w-4 mt-0.5 text-[hsl(var(--admin-success))]" />
                    ) : (
                      <Clock className="h-4 w-4 mt-0.5 text-[hsl(var(--admin-foreground-muted))]" />
                    )}
                    <div>
                      <p className="text-sm text-[hsl(var(--admin-foreground))]">{activity.text}</p>
                      <p className="text-xs text-[hsl(var(--admin-foreground-muted))]">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
