import { useActivityFeed, type ActivityItem } from "@/hooks/useActivityFeed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  UserPlus,
  Package,
  DollarSign,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

function getActivityIcon(activity: ActivityItem) {
  switch (activity.type) {
    case "user":
      return <UserPlus className="h-4 w-4" />;
    case "product":
      return <Package className="h-4 w-4" />;
    case "price":
      return <DollarSign className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
}

function getActivityColor(activity: ActivityItem) {
  if (activity.action === "delete") return "text-[hsl(var(--admin-danger))]";
  if (activity.action === "insert") return "text-[hsl(var(--admin-success))]";
  if (activity.text.includes("rejected") || activity.text.includes("suspended")) {
    return "text-[hsl(var(--admin-warning))]";
  }
  return "text-[hsl(var(--admin-accent))]";
}

function getStatusIcon(activity: ActivityItem) {
  if (activity.text.includes("approved") || activity.text.includes("verified")) {
    return <CheckCircle className="h-3 w-3 text-[hsl(var(--admin-success))]" />;
  }
  if (activity.text.includes("rejected") || activity.text.includes("suspended") || activity.action === "delete") {
    return <XCircle className="h-3 w-3 text-[hsl(var(--admin-danger))]" />;
  }
  if (activity.text.includes("unsuspended")) {
    return <AlertTriangle className="h-3 w-3 text-[hsl(var(--admin-warning))]" />;
  }
  return null;
}

function ActivityItemRow({ activity }: { activity: ActivityItem }) {
  const [, setTick] = useState(0);

  // Update relative time every minute
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-[hsl(var(--admin-bg-muted))] border border-[hsl(var(--admin-border))] animate-in slide-in-from-top-2 duration-300">
      <div className={`mt-0.5 ${getActivityColor(activity)}`}>
        {getActivityIcon(activity)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm text-[hsl(var(--admin-foreground))] truncate">
            {activity.text}
          </p>
          {getStatusIcon(activity)}
        </div>
        <p className="text-xs text-[hsl(var(--admin-foreground-muted))]">
          {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
        </p>
      </div>
      <Badge
        variant="outline"
        className="text-[10px] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground-muted))] shrink-0"
      >
        {activity.type}
      </Badge>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Activity className="h-10 w-10 text-[hsl(var(--admin-foreground-muted))] mb-3 animate-pulse" />
      <p className="text-sm text-[hsl(var(--admin-foreground-muted))]">
        Waiting for activity...
      </p>
      <p className="text-xs text-[hsl(var(--admin-foreground-muted))] mt-1">
        Real-time updates will appear here
      </p>
    </div>
  );
}

export function LiveActivityFeed() {
  const { activities, isConnected } = useActivityFeed();

  return (
    <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--admin-foreground))]">
            <Activity className="h-4 w-4 text-[hsl(var(--admin-accent))]" />
            Live Activity
          </CardTitle>
          <div className="flex items-center gap-1.5">
            {isConnected ? (
              <>
                <Wifi className="h-3.5 w-3.5 text-[hsl(var(--admin-success))]" />
                <span className="text-xs text-[hsl(var(--admin-success))]">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5 text-[hsl(var(--admin-danger))]" />
                <span className="text-xs text-[hsl(var(--admin-danger))]">Offline</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-3">
          {activities.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-2">
              {activities.map((activity) => (
                <ActivityItemRow key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
