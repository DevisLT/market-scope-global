import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminStats } from "@/hooks/useAdmin";
import {
  Users,
  Package,
  CreditCard,
  Shield,
  Settings,
  Eye,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Activity,
} from "lucide-react";

export default function SystemOverview() {
  const { data: stats, isLoading } = useAdminStats();

  const adminModules = [
    {
      title: "User Credentials",
      description: "View all user emails, usernames, phone numbers, and account details",
      icon: Eye,
      href: "/admin/credentials",
      badge: stats?.totalUsers,
      color: "text-blue-500",
    },
    {
      title: "User Management",
      description: "Suspend, verify, or manage user accounts and roles",
      icon: Users,
      href: "/admin",
      color: "text-green-500",
    },
    {
      title: "Product Moderation",
      description: "Review and approve product listings from sellers",
      icon: Package,
      href: "/admin",
      badge: stats?.pendingProducts,
      badgeVariant: "destructive" as const,
      color: "text-amber-500",
    },
    {
      title: "Subscriptions",
      description: "Monitor active subscriptions and billing status",
      icon: CreditCard,
      href: "/admin",
      badge: stats?.activeSubscriptions,
      color: "text-purple-500",
    },
    {
      title: "Security & Access",
      description: "Manage system security, roles, and permissions",
      icon: Shield,
      href: "/admin",
      color: "text-red-500",
    },
    {
      title: "System Settings",
      description: "Configure platform settings and preferences",
      icon: Settings,
      href: "/settings",
      color: "text-gray-500",
    },
  ];

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">System Administration</h1>
          <p className="text-muted-foreground">
            Central control panel for managing the entire platform
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Users",
              value: stats?.totalUsers || 0,
              icon: Users,
              color: "text-blue-500",
            },
            {
              label: "Products",
              value: stats?.totalProducts || 0,
              icon: Package,
              color: "text-green-500",
            },
            {
              label: "Pending",
              value: stats?.pendingProducts || 0,
              icon: AlertTriangle,
              color: "text-amber-500",
            },
            {
              label: "Active Subs",
              value: stats?.activeSubscriptions || 0,
              icon: CreditCard,
              color: "text-purple-500",
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        stat.value.toLocaleString()
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color} opacity-50`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module) => (
            <Card
              key={module.title}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg bg-muted ${module.color}`}>
                    <module.icon className="h-6 w-6" />
                  </div>
                  {module.badge !== undefined && module.badge > 0 && (
                    <Badge variant={module.badgeVariant || "secondary"}>
                      {module.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="flex items-center gap-2">
                  {module.title}
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={module.href}>Open {module.title}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Health */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>Current platform status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Authentication</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Payments</p>
                  <p className="text-sm text-muted-foreground">Stripe Connected</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
