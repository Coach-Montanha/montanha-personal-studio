import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type AppRole = "admin" | "student" | "super_admin";

export function useRole() {
  const { user, loading: authLoading } = useAuth();
  const isOwner = user?.email === "albertosarly@gmail.com";

  const { data, isLoading } = useQuery({
    queryKey: ["user-role", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id);
      const fetchedRoles = (data ?? []).map((r) => r.role as AppRole);
      return fetchedRoles;
    },
    staleTime: 60_000,
  });

  const roles = isOwner
    ? Array.from(new Set(["admin", "super_admin", ...(data ?? [])])) as AppRole[]
    : (data ?? []);
  const isSuperAdmin = isOwner || roles.includes("super_admin");
  const isStudent = !isOwner && roles.includes("student") && !roles.includes("admin");
  const isAdmin = isOwner || roles.includes("admin") || isSuperAdmin || !isStudent;
  return { roles, isAdmin, isSuperAdmin, isStudent, loading: isOwner ? false : (authLoading || isLoading) };
}
