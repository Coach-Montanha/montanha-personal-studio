import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/financeiro-NOyznWvM.js
var $$splitComponentImporter = () => import("./financeiro-Vo32ZFBn.mjs");
var Route = createFileRoute("/_authenticated/financeiro")({
	head: () => ({ meta: [{ title: "Financeiro — EduFinance" }] }),
	validateSearch: (s) => {
		const t = s.tab;
		return typeof t === "string" && [
			"overview",
			"expenses",
			"dre",
			"cashflow",
			"studio",
			"pt"
		].includes(t) ? { tab: t } : {};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
