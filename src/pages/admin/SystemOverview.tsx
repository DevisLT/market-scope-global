import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminLayout } from "@/components/admin";
import { useAdminStats } from "@/hooks/useAdmin";
import {
  Users,
  Package,
  CreditCard,
  Shield,
  Settings,
  Eye,
  CheckCircle,
  Loader2,
  ArrowRight,
  Activity,
  Server,
  Database,
  Zap,
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
      color: "text-[hsl(var(--admin-accent))]",
    },
    {
      title: "User Management",
      description: "Suspend, verify, or manage user accounts and roles",
      icon: Users,
      href: "/admin",
      color: "text-[hsl(var(--admin-success))]",
    },
    {
      title: "Product Moderation",
      description: "Review and approve product listings from sellers",
      icon: Package,
      href: "/admin",
      badge: stats?.pendingProducts,
      badgeVariant: "destructive" as const,
      color: "text-[hsl(var(--admin-warning))]",
    },
    {
      title: "Subscriptions",
      description: "Monitor active subscriptions and billing status",
      icon: CreditCard,
      href: "/admin",
      badge: stats?.activeSubscriptions,
      color: "text-purple-400",
    },
    {
      title: "Security & Access",
      description: "Manage system security, roles, and permissions",
      icon: Shield,
      href: "/admin",
      color: "text-[hsl(var(--admin-danger))]",
    },
    {
      title: "System Settings",
      description: "Configure platform settings and preferences",
      icon: Settings,
      href: "/settings",
      color: "text-[hsl(var(--admin-foreground-muted))]",
    },
  ];

  const systemServices = [
    { name: "Database", status: "operational", icon: Database },
    { name: "Authentication", status: "operational", icon: Shield },
    { name: "Payments", status: "operational", icon: CreditCard },
    { name: "API Gateway", status: "operational", icon: Server },
    { name: "Edge Functions", status: "operational", icon: Zap },
  ];

  return (
    <AdminLayout title="System Overview" description="Central control panel for managing the entire platform">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "text-[hsl(var(--admin-accent))]",
          },
          {
            label: "Products",
            value: stats?.totalProducts || 0,
            icon: Package,
            color: "text-[hsl(var(--admin-success))]",
          },
          {
            label: "Pending",
            value: stats?.pendingProducts || 0,
            icon: Activity,
            color: "text-[hsl(var(--admin-warning))]",
          },
          {
            label: "Active Subs",
            value: stats?.activeSubscriptions || 0,
            icon: CreditCard,
            color: "text-purple-400",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]"
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[hsl(var(--admin-foreground))]">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      stat.value.toLocaleString()
                    )}
                  </p>
                  <p className="text-sm text-[hsl(var(--admin-foreground-muted))]">{stat.label}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-50`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {adminModules.map((module) => (
          <Card
            key={module.title}
            className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))] hover:border-[hsl(var(--admin-accent))]/50 transition-all cursor-pointer group"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg bg-[hsl(var(--admin-bg-muted))] ${module.color}`}>
                  <module.icon className="h-6 w-6" />
                </div>
                {module.badge !== undefined && module.badge > 0 && (
                  <Badge
                    className={
                      module.badgeVariant === "destructive"
                        ? "bg-[hsl(var(--admin-danger))]/20 text-[hsl(var(--admin-danger))] border-[hsl(var(--admin-danger))]/30"
                        : "bg-[hsl(var(--admin-accent))]/20 text-[hsl(var(--admin-accent))] border-[hsl(var(--admin-accent))]/30"
                    }
                  >
                    {module.badge}
                  </Badge>
                )}
              </div>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--admin-foreground))]">
                {module.title}
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-[hsl(var(--admin-accent))]" />
              </CardTitle>
              <CardDescription className="text-[hsl(var(--admin-foreground-muted))]">
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))] hover:bg-[hsl(var(--admin-bg-muted))] hover:border-[hsl(var(--admin-accent))]/50"
                asChild
              >
                <Link to={module.href}>Open {module.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Health */}
      <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--admin-foreground))]">
            <Activity className="h-5 w-5 text-[hsl(var(--admin-accent))]" />
            System Health
          </CardTitle>
          <CardDescription className="text-[hsl(var(--admin-foreground-muted))]">
            Current platform status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            {systemServices.map((service) => (
              <div
                key={service.name}
                className="flex items-center gap-3 p-4 rounded-lg bg-[hsl(var(--admin-bg-muted))] border border-[hsl(var(--admin-border))]"
              >
                <div className="relative">
                  <service.icon className="h-5 w-5 text-[hsl(var(--admin-accent))]" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[hsl(var(--admin-success))] animate-pulse" />
                </div>
                <div>
                  <p className="font-medium text-[hsl(var(--admin-foreground))]">{service.name}</p>
                  <p className="text-xs text-[hsl(var(--admin-success))]">Operational</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
