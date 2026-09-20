import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students._id-Ds3vfVTS.js
var $$splitComponentImporter = () => import("./students._id-DCFcrW3c.mjs");
var STUDENT_TABS = [
	"overview",
	"personal",
	"plan",
	"payments",
	"checkins",
	"attendance"
];
var Route = createFileRoute("/_authenticated/students/$id")({
	head: () => ({ meta: [{ title: "Aluno — EduFinance" }] }),
	validateSearch: (search) => ({ tab: STUDENT_TABS.includes(search.tab) ? search.tab : "overview" }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
