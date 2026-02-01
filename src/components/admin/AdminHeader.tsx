import { Bell, Search, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminStats } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  title: string;
  description?: string;
  collapsed: boolean;
}

export function AdminHeader({ title, description, collapsed }: AdminHeaderProps) {
  const { data: stats } = useAdminStats();
  const pendingCount = stats?.pendingProducts || 0;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-16 border-b transition-all duration-300",
        "bg-[hsl(var(--admin-bg))]/95 backdrop-blur-lg border-[hsl(var(--admin-border))]",
        collapsed ? "ml-16" : "ml-64"
      )}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Left: Title and Breadcrumb */}
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[hsl(var(--admin-accent))]" />
            <h1 className="text-lg font-bold text-[hsl(var(--admin-foreground))]">
              {title}
            </h1>
          </div>
          {description && (
            <p className="text-sm text-[hsl(var(--admin-foreground-muted))]">
              {description}
            </p>
          )}
        </div>

        {/* Center: Global Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--admin-foreground-muted))]" />
            <Input
              placeholder="Search users, products, settings..."
              className={cn(
                "pl-10 bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))]",
                "text-[hsl(var(--admin-foreground))] placeholder:text-[hsl(var(--admin-foreground-muted))]",
                "focus:ring-[hsl(var(--admin-accent))] focus:border-[hsl(var(--admin-accent))]"
              )}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-[hsl(var(--admin-foreground-muted))] hover:text-[hsl(var(--admin-foreground))] hover:bg-[hsl(var(--admin-bg-muted))]"
              >
                <Bell className="h-5 w-5" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(var(--admin-danger))] text-[10px] font-bold text-white">
                    {pendingCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]"
            >
              <div className="p-3 border-b border-[hsl(var(--admin-border))]">
                <p className="font-medium">Notifications</p>
                <p className="text-xs text-[hsl(var(--admin-foreground-muted))]">
                  {pendingCount} items need attention
                </p>
              </div>
              <DropdownMenuItem className="p-3 focus:bg-[hsl(var(--admin-bg-muted))]">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--admin-warning))]/20">
                    <Shield className="h-4 w-4 text-[hsl(var(--admin-warning))]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pending Approvals</p>
                    <p className="text-xs text-[hsl(var(--admin-foreground-muted))]">
                      {pendingCount} products awaiting review
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "gap-2 bg-[hsl(var(--admin-accent))] text-[hsl(var(--admin-accent-foreground))]",
                  "border-[hsl(var(--admin-accent))] hover:bg-[hsl(var(--admin-accent-glow))]"
                )}
              >
                Quick Actions
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]"
            >
              <DropdownMenuItem className="focus:bg-[hsl(var(--admin-bg-muted))]">
                Add New User
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-[hsl(var(--admin-bg-muted))]">
                Review Products
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-[hsl(var(--admin-bg-muted))]">
                Run Security Scan
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-[hsl(var(--admin-bg-muted))]">
                Export Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Badge */}
          <Badge
            variant="outline"
            className="hidden lg:flex gap-1 border-[hsl(var(--admin-success))] text-[hsl(var(--admin-success))] bg-[hsl(var(--admin-success))]/10"
          >
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--admin-success))] animate-pulse" />
            Systems Online
          </Badge>
        </div>
      </div>
    </header>
  );
}
