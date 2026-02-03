import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCreateAuditLog } from "./useAuditLog";
import type { AppRole } from "@/lib/auth";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      username, 
      newRole, 
      oldRole 
    }: { 
      userId: string; 
      username: string; 
      newRole: AppRole;
      oldRole?: AppRole;
    }) => {
      // First, delete the existing role
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      // Then, insert the new role
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: newRole });

      if (insertError) throw insertError;

      return { userId, username, newRole, oldRole };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(`Role updated to ${data.newRole}`);
      
      createAuditLog.mutate({
        action_type: "role_changed",
        target_type: "user",
        target_id: data.userId,
        target_name: data.username,
        details: { from: data.oldRole, to: data.newRole },
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update role");
    },
  });
}
