import { t as supabase } from "./client-CCQALzHq.mjs";
import { t as useAuth } from "./use-auth-ChcWg5G-.mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-portal-mode-OB6P155i.js
/**
* Detecta se o aluno autenticado é vinculado ao módulo de Studio
* (linha em `students.account_user_id`) ou ao módulo de Personal Trainer
* (linha em `pt_students.account_user_id`). Retorna null enquanto carrega.
*/
function usePortalMode() {
	const { user, loading: authLoading } = useAuth();
	const { data, isLoading } = useQuery({
		queryKey: ["portal-mode", user?.id],
		enabled: !!user?.id,
		staleTime: 5 * 6e4,
		gcTime: 30 * 6e4,
		queryFn: async () => {
			const [studio, pt] = await Promise.all([supabase.from("students").select("id").eq("account_user_id", user.id).maybeSingle(), supabase.from("pt_students").select("id").eq("account_user_id", user.id).maybeSingle()]);
			if (pt.data?.id && studio.data?.id) return {
				mode: "both",
				ptStudentId: pt.data.id,
				studentId: studio.data.id
			};
			if (pt.data?.id) return {
				mode: "pt",
				ptStudentId: pt.data.id,
				studentId: null
			};
			if (studio.data?.id) return {
				mode: "studio",
				ptStudentId: null,
				studentId: studio.data.id
			};
			return {
				mode: null,
				ptStudentId: null,
				studentId: null
			};
		}
	});
	return {
		mode: data?.mode ?? null,
		ptStudentId: data?.ptStudentId ?? null,
		studentId: data?.studentId ?? null,
		loading: authLoading || isLoading
	};
}
//#endregion
export { usePortalMode as t };
