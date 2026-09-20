import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { t as useAuth } from "./use-auth-ChcWg5G-.mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-scope-filter-q5Imal9c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useRole() {
	const { user, loading: authLoading } = useAuth();
	const { data, isLoading } = useQuery({
		queryKey: ["user-role", user?.id],
		enabled: !!user?.id,
		queryFn: async () => {
			const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
			return (data ?? []).map((r) => r.role);
		},
		staleTime: 6e4
	});
	const roles = data ?? [];
	const isSuperAdmin = roles.includes("super_admin");
	const isAdmin = roles.includes("admin") || isSuperAdmin;
	return {
		roles,
		isAdmin,
		isSuperAdmin,
		isStudent: roles.includes("student") && !isAdmin,
		loading: authLoading || isLoading
	};
}
/**
* Profile mode for super_admin users.
* - "super_admin" → full super admin: cross-tenant scope selector, admin nav, etc.
* - "admin"       → act as a regular admin scoped to own data (support/edit
*                   without accidentally touching other tenants).
*
* For users who are NOT super_admin this hook always resolves to "admin"
* (RLS already prevents cross-tenant access).
*/
var PROFILE_MODE_KEY = "edufinance.profileMode";
function subscribe$1(cb) {
	const h = (e) => {
		if (e.key === "edufinance.profileMode") cb();
	};
	window.addEventListener("storage", h);
	window.addEventListener("edufinance:profileMode", cb);
	return () => {
		window.removeEventListener("storage", h);
		window.removeEventListener("edufinance:profileMode", cb);
	};
}
function getSnapshot$1() {
	if (typeof window === "undefined") return "super_admin";
	return localStorage.getItem("edufinance.profileMode") || "super_admin";
}
function useProfileMode() {
	return {
		mode: (0, import_react.useSyncExternalStore)(subscribe$1, getSnapshot$1, () => "super_admin"),
		setMode: (0, import_react.useCallback)((next) => {
			if (typeof window === "undefined") return;
			if (next === "super_admin") localStorage.removeItem(PROFILE_MODE_KEY);
			else localStorage.setItem(PROFILE_MODE_KEY, next);
			window.dispatchEvent(new Event("edufinance:profileMode"));
		}, [])
	};
}
/**
* Tenant scope selector for super_admin users.
* - "own"  → only the current user's rows (default; hides other trainers)
* - "all"  → all tenants (raw super_admin visibility)
* - <uuid> → a specific trainer's tenant
*
* Non–super_admin users always resolve to "own" — RLS still enforces that
* they see only their own data regardless of this value.
*/
var TENANT_SCOPE_KEY = "edufinance.tenantScope";
function subscribe(cb) {
	const handler = (e) => {
		if (e.key === "edufinance.tenantScope") cb();
	};
	window.addEventListener("storage", handler);
	window.addEventListener("edufinance:tenantScope", cb);
	return () => {
		window.removeEventListener("storage", handler);
		window.removeEventListener("edufinance:tenantScope", cb);
	};
}
function getSnapshot() {
	if (typeof window === "undefined") return "own";
	return localStorage.getItem("edufinance.tenantScope") || "own";
}
function useTenantScope() {
	return {
		scope: (0, import_react.useSyncExternalStore)(subscribe, getSnapshot, () => "own"),
		setScope: (0, import_react.useCallback)((next) => {
			if (typeof window === "undefined") return;
			if (next === "own") localStorage.removeItem(TENANT_SCOPE_KEY);
			else localStorage.setItem(TENANT_SCOPE_KEY, next);
			window.dispatchEvent(new Event("edufinance:tenantScope"));
		}, [])
	};
}
/**
* Resolves which tenant's data queries should filter by.
*
* Returns:
*  - `scopeId`  → uuid to filter `user_id` by, or `null` for no filter
*                 (only super_admin in "super_admin" mode with scope="all"
*                 sees everything).
*  - `scopeKey` → stable string for query keys (safe when scopeId is null).
*  - `ready`    → false while auth is still loading.
*
* Non–super_admin users always get their own uuid, regardless of the stored
* scope selection. Super_admin acting in "admin" profile mode is also forced
* to their own uuid.
*/
function useScopeFilter() {
	const { user, loading: authLoading } = useAuth();
	const { isSuperAdmin, loading: roleLoading } = useRole();
	const { mode } = useProfileMode();
	const { scope } = useTenantScope();
	const effectivelySuperAdmin = isSuperAdmin && mode === "super_admin";
	let scopeId = user?.id ?? null;
	if (effectivelySuperAdmin) if (scope === "all") scopeId = null;
	else if (scope === "own") scopeId = user?.id ?? null;
	else scopeId = scope;
	return {
		scopeId,
		scopeKey: scopeId ?? "all",
		ready: !authLoading && !roleLoading,
		effectivelySuperAdmin
	};
}
//#endregion
export { useTenantScope as i, useRole as n, useScopeFilter as r, useProfileMode as t };
