import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCoach() {
  return useQuery({
    queryKey: ["coach", "me"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;

      // Tenta buscar na tabela coaches se ela existir
      try {
        const { data, error } = await supabase
          .from("coaches" as any)
          .select("*")
          .eq("auth_user_id", u.user.id)
          .maybeSingle();

        if (!error && data) {
          return data as { id: string; auth_user_id: string; nome: string; email: string };
        }
      } catch {
        // Tabela coaches não provisionada ou erro
      }

      // Fallback nativo do Personal Studio: o próprio usuário autenticado é o treinador
      return {
        id: u.user.id,
        auth_user_id: u.user.id,
        nome:
          u.user.user_metadata?.nome ||
          u.user.user_metadata?.name ||
          u.user.email?.split("@")[0] ||
          "Coach Montanha",
        email: u.user.email ?? "",
      };
    },
  });
}
