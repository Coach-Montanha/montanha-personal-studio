import { t as useModules } from "./use-modules-DlxYE7n1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-landing-page-CK5BT-cY.js
var LANDING_OPTIONS = [
	{
		path: "/",
		label: "Dashboard"
	},
	{
		path: "/students",
		label: "Alunos",
		module: "studio"
	},
	{
		path: "/payments",
		label: "Pagamentos",
		module: "studio"
	},
	{
		path: "/plans",
		label: "Planos",
		module: "studio"
	},
	{
		path: "/agenda",
		label: "Turmas & Agenda",
		module: "studio"
	},
	{
		path: "/programs",
		label: "Programas",
		module: "studio"
	},
	{
		path: "/analytics",
		label: "Análises",
		module: "studio"
	},
	{
		path: "/personal-trainer",
		label: "Personal Trainer",
		module: "pt"
	},
	{
		path: "/personal-trainer/checkin",
		label: "⚡ Check-in Rápido (PT)",
		module: "pt"
	},
	{
		path: "/financeiro",
		label: "Financeiro",
		module: "financeiro"
	},
	{
		path: "/crm",
		label: "CRM",
		module: "crm"
	}
];
var LANDING_STORAGE_KEY = "edufinance.landingPage";
var LANDING_REDIRECT_FLAG = "edufinance.landingRedirected";
function useLandingOptions() {
	const { hasModule } = useModules();
	return LANDING_OPTIONS.filter((o) => !o.module || hasModule(o.module));
}
//#endregion
export { LANDING_STORAGE_KEY as n, useLandingOptions as r, LANDING_REDIRECT_FLAG as t };
