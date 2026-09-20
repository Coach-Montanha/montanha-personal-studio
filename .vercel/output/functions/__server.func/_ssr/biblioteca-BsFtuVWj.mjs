import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/biblioteca-BsFtuVWj.js
var $$splitComponentImporter = () => import("./biblioteca-DPnRww0k.mjs");
var Route = createFileRoute("/_authenticated/personal-trainer/biblioteca")({
	head: () => ({ meta: [{ title: "Biblioteca — EduFinance PT" }, {
		name: "description",
		content: "Catálogo reutilizável de exercícios com vídeos de referência e importação de programas prontos."
	}] }),
	validateSearch: (s) => s.tab === "importar" || s.tab === "movimentos" || s.tab === "exercicios" ? { tab: s.tab } : {},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
