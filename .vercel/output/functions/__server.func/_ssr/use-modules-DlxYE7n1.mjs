import { t as supabase } from "./client-CCQALzHq.mjs";
import { t as useAuth } from "./use-auth-ChcWg5G-.mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as useRole } from "./use-scope-filter-q5Imal9c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-modules-DlxYE7n1.js
var ALL_MODULES = [
	"studio",
	"pt",
	"financeiro",
	"crm"
];
/**
* Retorna quais módulos o usuário atual tem acesso.
* Super admin tem acesso a todos automaticamente.
*/
function useModules() {
	const { user, loading: authLoading } = useAuth();
	const { roles, loading: roleLoading } = useRole();
	const isSuperAdmin = roles.includes("super_admin");
	const { data, isLoading } = useQuery({
		queryKey: ["user-modules", user?.id],
		enabled: !!user?.id && !isSuperAdmin,
		staleTime: 6e4,
		queryFn: async () => {
			const { data, error } = await supabase.from("user_modules").select("module, active, expires_at").eq("user_id", user.id);
			if (error) throw error;
			const now = Date.now();
			const active = (data ?? []).filter((r) => r.active && (r.expires_at === null || new Date(r.expires_at).getTime() > now)).map((r) => r.module);
			return new Set(active);
		}
	});
	const modules = isSuperAdmin ? new Set(ALL_MODULES) : data ?? /* @__PURE__ */ new Set();
	const hasModule = (m) => modules.has(m);
	return {
		modules,
		hasModule,
		isSuperAdmin,
		loading: authLoading || roleLoading || !isSuperAdmin && isLoading
	};
}
//#endregion
export { useModules as t };
