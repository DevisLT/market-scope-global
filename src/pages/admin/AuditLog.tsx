import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminLayout } from "@/components/admin";
import { useAuditLogs, useRealtimeAuditLogs, type AuditActionType } from "@/hooks/useAuditLog";
import {
  Search,
  Loader2,
  UserCheck,
  UserX,
  ShieldCheck,
  ShieldOff,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  Filter,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const actionConfig: Record<
  AuditActionType,
  { label: string; icon: React.ElementType; color: string }
> = {
  user_suspended: {
    label: "User Suspended",
    icon: UserX,
    color: "text-[hsl(var(--admin-danger))]",
  },
  user_unsuspended: {
    label: "User Unsuspended",
    icon: UserCheck,
    color: "text-[hsl(var(--admin-success))]",
  },
  user_verified: {
    label: "User Verified",
    icon: ShieldCheck,
    color: "text-[hsl(var(--admin-success))]",
  },
  user_unverified: {
    label: "User Unverified",
    icon: ShieldOff,
    color: "text-[hsl(var(--admin-warning))]",
  },
  user_role_changed: {
    label: "Role Changed",
    icon: ShieldCheck,
    color: "text-[hsl(var(--admin-accent))]",
  },
  product_approved: {
    label: "Product Approved",
    icon: CheckCircle,
    color: "text-[hsl(var(--admin-success))]",
  },
  product_rejected: {
    label: "Product Rejected",
    icon: XCircle,
    color: "text-[hsl(var(--admin-danger))]",
  },
  product_deleted: {
    label: "Product Deleted",
    icon: Trash2,
    color: "text-[hsl(var(--admin-danger))]",
  },
  price_verified: {
    label: "Price Verified",
    icon: CheckCircle,
    color: "text-[hsl(var(--admin-success))]",
  },
  price_deleted: {
    label: "Price Deleted",
    icon: Trash2,
    color: "text-[hsl(var(--admin-danger))]",
  },
  settings_changed: {
    label: "Settings Changed",
    icon: ShieldCheck,
    color: "text-[hsl(var(--admin-accent))]",
  },
};

const targetTypeLabels: Record<string, string> = {
  user: "User",
  product: "Product",
  price: "Price",
  settings: "Settings",
};

export default function AuditLog() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterTarget, setFilterTarget] = useState<string>("all");

  const { data: logs, isLoading } = useAuditLogs(100);
  const realtimeEntries = useRealtimeAuditLogs();

  // Combine realtime entries with fetched logs (avoiding duplicates)
  const allLogs = logs
    ? [...realtimeEntries.filter((r) => !logs.find((l) => l.id === r.id)), ...logs]
    : realtimeEntries;

  const filteredLogs = allLogs.filter((log) => {
    const matchesSearch =
      !search ||
      log.target_name?.toLowerCase().includes(search.toLowerCase()) ||
      log.admin?.username.toLowerCase().includes(search.toLowerCase()) ||
      log.action_type.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === "all" || log.action_type === filterType;
    const matchesTarget = filterTarget === "all" || log.target_type === filterTarget;

    return matchesSearch && matchesType && matchesTarget;
  });

  return (
    <AdminLayout title="Audit Log" description="Track all administrative actions and changes">
      <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
        <CardHeader>
          <CardTitle className="text-[hsl(var(--admin-foreground))]">Activity History</CardTitle>
          <CardDescription className="text-[hsl(var(--admin-foreground-muted))]">
            Complete log of all admin actions with real-time updates
          </CardDescription>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--admin-foreground-muted))]" />
              <Input
                placeholder="Search by admin, target, or action..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))] placeholder:text-[hsl(var(--admin-foreground-muted))]"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]">
                <Filter className="h-4 w-4 mr-2 text-[hsl(var(--admin-foreground-muted))]" />
                <SelectValue placeholder="Action type" />
              </SelectTrigger>
              <SelectContent className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
                <SelectItem value="all">All Actions</SelectItem>
                {Object.entries(actionConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterTarget} onValueChange={setFilterTarget}>
              <SelectTrigger className="w-[150px] bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]">
                <SelectValue placeholder="Target type" />
              </SelectTrigger>
              <SelectContent className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
                <SelectItem value="all">All Targets</SelectItem>
                {Object.entries(targetTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--admin-accent))]" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-[hsl(var(--admin-foreground-muted))]">
              {search || filterType !== "all" || filterTarget !== "all"
                ? "No audit logs match your filters."
                : "No audit logs yet. Actions will appear here as admins make changes."}
            </div>
          ) : (
            <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
              {filteredLogs.map((log) => {
                const config = actionConfig[log.action_type] || {
                  label: log.action_type,
                  icon: Clock,
                  color: "text-[hsl(var(--admin-foreground-muted))]",
                };
                const Icon = config.icon;

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 bg-[hsl(var(--admin-bg-muted))] rounded-lg hover:bg-[hsl(var(--admin-bg-muted))]/80 transition-colors"
                  >
                    {/* Action Icon */}
                    <div
                      className={`p-2 rounded-full bg-[hsl(var(--admin-bg))] ${config.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-xs border-current ${config.color}`}
                        >
                          {config.label}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-[hsl(var(--admin-bg))] text-[hsl(var(--admin-foreground-muted))]"
                        >
                          {targetTypeLabels[log.target_type] || log.target_type}
                        </Badge>
                      </div>

                      <p className="text-sm text-[hsl(var(--admin-foreground))] mt-1">
                        {log.target_name ? (
                          <>
                            Target: <span className="font-medium">{log.target_name}</span>
                          </>
                        ) : log.target_id ? (
                          <>
                            ID: <span className="font-mono text-xs">{log.target_id}</span>
                          </>
                        ) : (
                          "System action"
                        )}
                      </p>

                      {log.details && Object.keys(log.details).length > 0 && (
                        <p className="text-xs text-[hsl(var(--admin-foreground-muted))] mt-1">
                          {JSON.stringify(log.details)}
                        </p>
                      )}
                    </div>

                    {/* Admin & Time */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[hsl(var(--admin-foreground-muted))]">
                          {log.admin?.username || "Unknown"}
                        </span>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={log.admin?.avatar_url || undefined} />
                          <AvatarFallback className="bg-[hsl(var(--admin-accent))] text-[hsl(var(--admin-accent-foreground))] text-xs">
                            {log.admin?.username?.slice(0, 2).toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="text-xs text-[hsl(var(--admin-foreground-muted))] flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
