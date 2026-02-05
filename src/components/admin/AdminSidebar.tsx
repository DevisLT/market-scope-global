import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Package,
  Eye,
  Activity,
  Shield,
  Settings,
  ChevronLeft,
  CreditCard,
  TrendingUp,
  Database,
  Bell,
  LogOut,
  History,
  FolderTree,
  Trash2,
  Factory,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    label: "System Overview",
    href: "/admin/system",
    icon: Activity,
  },
  {
    label: "User Management",
    href: "/admin",
    icon: Users,
  },
  {
    label: "User Credentials",
    href: "/admin/credentials",
    icon: Eye,
  },
  {
    label: "Data Management",
    href: "/admin/data",
    icon: FolderTree,
  },
  {
    label: "Deleted Items",
    href: "/admin/deleted",
    icon: Trash2,
  },
  {
    label: "Industry Categories",
    href: "/admin/industry-categories",
    icon: Factory,
  },
   {
     label: "Price Trends",
     href: "/admin/price-trends",
     icon: TrendingUp,
   },
  {
    label: "Audit Log",
    href: "/admin/audit-log",
    icon: History,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    label: "Database",
    href: "/admin/database",
    icon: Database,
  },
  {
    label: "Security",
    href: "/admin/security",
    icon: Shield,
  },
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
        "bg-[hsl(var(--admin-sidebar-bg))] border-r border-[hsl(var(--admin-sidebar-border))]",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[hsl(var(--admin-sidebar-border))]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[hsl(var(--admin-accent))]">
              <Shield className="w-5 h-5 text-[hsl(var(--admin-accent-foreground))]" />
            </div>
            <div>
              <span className="font-bold text-[hsl(var(--admin-foreground))]">
                Admin
              </span>
              <span className="text-[hsl(var(--admin-accent))] font-bold">Panel</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[hsl(var(--admin-accent))] mx-auto">
            <Shield className="w-5 h-5 text-[hsl(var(--admin-accent-foreground))]" />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className={cn(
          "absolute -right-3 top-20 z-50 h-6 w-6 rounded-full border",
          "bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-sidebar-border))]",
          "hover:bg-[hsl(var(--admin-sidebar-hover))] text-[hsl(var(--admin-foreground))]"
        )}
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform",
            collapsed && "rotate-180"
          )}
        />
      </Button>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3 overflow-y-auto h-[calc(100vh-8rem)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "text-[hsl(var(--admin-foreground-muted))] hover:text-[hsl(var(--admin-foreground))]",
                "hover:bg-[hsl(var(--admin-sidebar-hover))]",
                isActive && [
                  "bg-[hsl(var(--admin-accent))]/10 text-[hsl(var(--admin-accent))]",
                  "border-l-2 border-[hsl(var(--admin-accent))] -ml-[2px] pl-[calc(0.75rem+2px)]",
                ],
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-[hsl(var(--admin-accent))]")} />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[hsl(var(--admin-sidebar-border))]">
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--admin-accent))]">
              <span className="text-xs font-bold text-[hsl(var(--admin-accent-foreground))]">
                {profile?.username?.slice(0, 2).toUpperCase() || "AD"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[hsl(var(--admin-foreground))] truncate">
                {profile?.username}
              </p>
              <p className="text-xs text-[hsl(var(--admin-foreground-muted))]">
                System Admin
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-[hsl(var(--admin-foreground-muted))] hover:text-[hsl(var(--admin-danger))] hover:bg-[hsl(var(--admin-danger))]/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="w-full text-[hsl(var(--admin-foreground-muted))] hover:text-[hsl(var(--admin-danger))] hover:bg-[hsl(var(--admin-danger))]/10"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </aside>
  );
}
