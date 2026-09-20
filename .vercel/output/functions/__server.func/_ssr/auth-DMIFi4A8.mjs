import { t as supabase } from "./client-CCQALzHq.mjs";
import { j as redirect, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DMIFi4A8.js
function safeNext(next) {
	if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) return "/";
	return next;
}
var $$splitComponentImporter = () => import("./auth-C-UPXM-j.mjs");
var Route = createFileRoute("/auth")({
	ssr: false,
	validateSearch: (s) => ({ next: typeof s.next === "string" ? s.next : void 0 }),
	beforeLoad: async ({ search }) => {
		const { data } = await supabase.auth.getSession();
		if (data.session) throw redirect({ href: safeNext(search.next) });
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { safeNext as n, Route as t };
