import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type PortalMode = "studio" | "pt" | "both" | null;

/**
 * Detecta se o aluno autenticado é vinculado ao módulo de Studio
 * (linha em `students.account_user_id`) ou ao módulo de Personal Trainer
 * (linha em `pt_students.account_user_id`). Retorna null enquanto carrega.
 */
export function usePortalMode(): { mode: PortalMode; loading: boolean; ptStudentId: string | null; studentId: string | null } {
  const { user, loading: authLoading } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["portal-mode", user?.id, user?.email],
    enabled: !!user?.id,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
    queryFn: async () => {
      let [studio, pt] = await Promise.all([
        supabase.from("students").select("id").eq("account_user_id", user!.id).maybeSingle(),
        supabase.from("pt_students").select("id").eq("account_user_id", user!.id).maybeSingle(),
      ]);

      const email = user?.email?.trim();
      if (!studio.data?.id && email) {
        const resSt = await supabase.from("students").select("id").ilike("email", email).maybeSingle();
        if (resSt.data?.id) studio = resSt;
      }
      if (!pt.data?.id && email) {
        const resPt = await supabase.from("pt_students").select("id").ilike("email", email).maybeSingle();
        if (resPt.data?.id) pt = resPt;
      }

      if (pt.data?.id && studio.data?.id)
        return { mode: "both" as const, ptStudentId: pt.data.id, studentId: studio.data.id };
      if (pt.data?.id) return { mode: "pt" as const, ptStudentId: pt.data.id, studentId: null };
      if (studio.data?.id) return { mode: "studio" as const, ptStudentId: null, studentId: studio.data.id };
      return { mode: null, ptStudentId: null, studentId: null };
    },
  });
  return {
    mode: data?.mode ?? null,
    ptStudentId: data?.ptStudentId ?? null,
    studentId: data?.studentId ?? null,
    loading: authLoading || isLoading,
  };
}
