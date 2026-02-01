import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export type AuditActionType =
  | "user_suspended"
  | "user_unsuspended"
  | "user_verified"
  | "user_unverified"
  | "user_role_changed"
  | "product_approved"
  | "product_rejected"
  | "product_deleted"
  | "price_verified"
  | "price_deleted"
  | "settings_changed";

export interface AuditLogEntry {
  id: string;
  admin_id: string;
  action_type: AuditActionType;
  target_type: "user" | "product" | "price" | "settings";
  target_id: string | null;
  target_name: string | null;
  details: Record<string, unknown>;
  created_at: string;
  admin?: {
    username: string;
    avatar_url: string | null;
  };
}

export function useAuditLogs(limit = 50) {
  return useQuery({
    queryKey: ["audit-logs", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_audit_logs")
        .select(`
          *,
          admin:profiles!admin_audit_logs_admin_id_fkey(username, avatar_url)
        `)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as AuditLogEntry[];
    },
  });
}

export function useCreateAuditLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      action_type,
      target_type,
      target_id,
      target_name,
      details = {},
    }: {
      action_type: AuditActionType;
      target_type: "user" | "product" | "price" | "settings";
      target_id?: string | null;
      target_name?: string | null;
      details?: Record<string, unknown>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("admin_audit_logs").insert({
        admin_id: user.id,
        action_type,
        target_type,
        target_id: target_id || null,
        target_name: target_name || null,
        details: details as unknown as Record<string, never>,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    },
  });
}

export function useRealtimeAuditLogs() {
  const [newEntries, setNewEntries] = useState<AuditLogEntry[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("audit-logs-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "admin_audit_logs",
        },
        async (payload) => {
          // Fetch the admin info for the new entry
          const { data: admin } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", payload.new.admin_id)
            .single();

          const entry = {
            ...payload.new,
            admin,
          } as AuditLogEntry;

          setNewEntries((prev) => [entry, ...prev].slice(0, 10));
          queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return newEntries;
}
