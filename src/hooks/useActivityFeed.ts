import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export interface ActivityItem {
  id: string;
  type: "user" | "product" | "price";
  action: "insert" | "update" | "delete";
  text: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

const MAX_ITEMS = 20;

export function useActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel("admin-activity-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          handleProfileChange(payload);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          handleProductChange(payload);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "prices" },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          handlePriceChange(payload);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addActivity = (activity: Omit<ActivityItem, "id" | "timestamp">) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    setActivities((prev) => [newActivity, ...prev].slice(0, MAX_ITEMS));
  };

  const handleProfileChange = (
    payload: RealtimePostgresChangesPayload<Record<string, unknown>>
  ) => {
    const eventType = payload.eventType;
    const record = (payload.new as Record<string, unknown>) || {};

    if (eventType === "INSERT") {
      addActivity({
        type: "user",
        action: "insert",
        text: `New user registered: ${record.username || "Unknown"}`,
        metadata: { userId: record.id, username: record.username },
      });
    } else if (eventType === "UPDATE") {
      const oldRecord = (payload.old as Record<string, unknown>) || {};
      if (oldRecord.is_verified !== record.is_verified && record.is_verified) {
        addActivity({
          type: "user",
          action: "update",
          text: `User verified: ${record.username}`,
          metadata: { userId: record.id },
        });
      } else if (oldRecord.is_suspended !== record.is_suspended) {
        addActivity({
          type: "user",
          action: "update",
          text: record.is_suspended
            ? `User suspended: ${record.username}`
            : `User unsuspended: ${record.username}`,
          metadata: { userId: record.id },
        });
      }
    }
  };

  const handleProductChange = (
    payload: RealtimePostgresChangesPayload<Record<string, unknown>>
  ) => {
    const eventType = payload.eventType;
    const record = (payload.new as Record<string, unknown>) || {};

    if (eventType === "INSERT") {
      addActivity({
        type: "product",
        action: "insert",
        text: `New product submitted: ${record.name || "Unknown"}`,
        metadata: { productId: record.id, name: record.name },
      });
    } else if (eventType === "UPDATE") {
      const oldRecord = (payload.old as Record<string, unknown>) || {};
      if (oldRecord.is_approved !== record.is_approved && record.is_approved) {
        addActivity({
          type: "product",
          action: "update",
          text: `Product approved: ${record.name}`,
          metadata: { productId: record.id },
        });
      } else if (oldRecord.is_approved !== record.is_approved && !record.is_approved) {
        addActivity({
          type: "product",
          action: "update",
          text: `Product rejected: ${record.name}`,
          metadata: { productId: record.id },
        });
      }
    } else if (eventType === "DELETE") {
      const oldRecord = (payload.old as Record<string, unknown>) || {};
      addActivity({
        type: "product",
        action: "delete",
        text: `Product deleted: ${oldRecord.name || "Unknown"}`,
        metadata: { productId: oldRecord.id },
      });
    }
  };

  const handlePriceChange = (
    payload: RealtimePostgresChangesPayload<Record<string, unknown>>
  ) => {
    const eventType = payload.eventType;
    const record = (payload.new as Record<string, unknown>) || {};

    if (eventType === "INSERT") {
      addActivity({
        type: "price",
        action: "insert",
        text: `New price recorded: ${record.currency}${record.price}`,
        metadata: { priceId: record.id, price: record.price, currency: record.currency },
      });
    } else if (eventType === "UPDATE") {
      addActivity({
        type: "price",
        action: "update",
        text: `Price updated: ${record.currency}${record.price}`,
        metadata: { priceId: record.id },
      });
    }
  };

  return { activities, isConnected };
}
