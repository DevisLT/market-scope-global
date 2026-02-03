import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface UserProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  role?: string;
}

export function useUsers(options?: { search?: string; excludeSelf?: boolean }) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["users", options?.search, options?.excludeSelf, user?.id],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select(`
          id,
          username,
          full_name,
          avatar_url,
          email
        `)
        .is("deleted_at", null)
        .order("username", { ascending: true })
        .limit(50);

      // Exclude current user if requested
      if (options?.excludeSelf && user) {
        query = query.neq("id", user.id);
      }

      // Search by username or full_name
      if (options?.search) {
        query = query.or(
          `username.ilike.%${options.search}%,full_name.ilike.%${options.search}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;

      // Get roles for each user
      const usersWithRoles = await Promise.all(
        (data || []).map(async (profile) => {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", profile.id)
            .single();

          return {
            ...profile,
            role: roleData?.role,
          } as UserProfile;
        })
      );

      return usersWithRoles;
    },
    enabled: !!user,
  });
}

export function useIndustryUsers() {
  return useQuery({
    queryKey: ["industry-users"],
    queryFn: async () => {
      // Get all users with industry role
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "industry");

      if (rolesError) throw rolesError;

      if (!roles || roles.length === 0) return [];

      const userIds = roles.map((r) => r.user_id);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, email")
        .in("id", userIds)
        .is("deleted_at", null)
        .order("username", { ascending: true });

      if (error) throw error;

      return data as UserProfile[];
    },
  });
}
