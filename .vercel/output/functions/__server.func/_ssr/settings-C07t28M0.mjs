import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-C07t28M0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var FONT_SIZE_PX = {
	sm: 15,
	md: 17,
	lg: 19,
	xl: 22
};
var FONT_SIZE_MOBILE_PX = {
	sm: 14,
	md: 15,
	lg: 16,
	xl: 17
};
var FONT_SIZE_LABEL = {
	sm: "Pequeno",
	md: "Padrão",
	lg: "Grande",
	xl: "Extra grande"
};
var KEY = "edufinance.fontSize";
function getStoredFontSize() {
	if (typeof window === "undefined") return "md";
	const v = window.localStorage.getItem(KEY);
	if (v === "sm" || v === "md" || v === "lg" || v === "xl") return v;
	return "md";
}
function applyFontSize(key) {
	if (typeof document === "undefined") return;
	const px = typeof window !== "undefined" && window.innerWidth < 640 ? FONT_SIZE_MOBILE_PX[key] ?? 15 : FONT_SIZE_PX[key] ?? 17;
	document.documentElement.style.fontSize = `${px}px`;
}
/** Sincroniza a preferência global de fonte com o <html>. Deve ser chamado uma vez no root. */
function useApplyFontSize() {
	(0, import_react.useEffect)(() => {
		const handler = () => applyFontSize(getStoredFontSize());
		handler();
		window.addEventListener("resize", handler);
		return () => window.removeEventListener("resize", handler);
	}, []);
}
/** Estado + setter para a UI de configuração. */
function useFontSize() {
	const [size, setSize] = (0, import_react.useState)(() => getStoredFontSize());
	function update(next) {
		setSize(next);
		if (typeof window !== "undefined") window.localStorage.setItem(KEY, next);
		applyFontSize(next);
	}
	return {
		size,
		setSize: update
	};
}
var TABS = [
	"geral",
	"dados",
	"prompts",
	"lixeira"
];
var $$splitComponentImporter = () => import("./settings-BNOglYWz.mjs");
var Route = createFileRoute("/_authenticated/settings")({
	head: () => ({ meta: [{ title: "Configurações — EduFinance" }] }),
	validateSearch: (search) => ({ tab: TABS.includes(search.tab) ? search.tab : "geral" }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { useApplyFontSize as a, TABS as i, FONT_SIZE_PX as n, useFontSize as o, Route as r, FONT_SIZE_LABEL as t };
