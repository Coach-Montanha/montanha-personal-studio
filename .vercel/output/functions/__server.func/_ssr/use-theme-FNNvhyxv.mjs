import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-theme-FNNvhyxv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ThemeContext = (0, import_react.createContext)(null);
function getInitialTheme() {
	if (typeof window === "undefined") return "light";
	try {
		const stored = localStorage.getItem("edufinance.theme");
		if (stored === "dark" || stored === "light") return stored;
		if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
	} catch {}
	return "light";
}
function getInitialVisualTheme() {
	if (typeof window === "undefined") return "midnight";
	try {
		const stored = localStorage.getItem("edufinance.visualTheme");
		if (stored === "padrao" || stored === "pulse" || stored === "midnight") return stored;
		return "midnight";
	} catch {}
	return "midnight";
}
function ThemeProvider({ children }) {
	const [theme, setTheme] = (0, import_react.useState)(getInitialTheme);
	const [visualTheme, setVisualTheme] = (0, import_react.useState)(getInitialVisualTheme);
	(0, import_react.useEffect)(() => {
		try {
			if (!localStorage.getItem("edufinance.visualTheme")) localStorage.setItem("edufinance.visualTheme", "midnight");
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		if (theme === "dark") root.classList.add("dark");
		else root.classList.remove("dark");
		try {
			localStorage.setItem("edufinance.theme", theme);
		} catch {}
	}, [theme]);
	(0, import_react.useEffect)(() => {
		document.documentElement.setAttribute("data-tema", visualTheme);
		try {
			localStorage.setItem("edufinance.visualTheme", visualTheme);
		} catch {}
	}, [visualTheme]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const onStorage = (e) => {
			if (e.key === "edufinance.theme" && (e.newValue === "light" || e.newValue === "dark")) setTheme(e.newValue);
			if (e.key === "edufinance.visualTheme" && (e.newValue === "padrao" || e.newValue === "pulse" || e.newValue === "midnight")) setVisualTheme(e.newValue);
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);
	const toggleTheme = (0, import_react.useCallback)(() => {
		setTheme((t) => t === "light" ? "dark" : "light");
	}, []);
	const changeVisualTheme = (0, import_react.useCallback)((nextTheme) => {
		setVisualTheme(nextTheme);
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		theme,
		setTheme,
		toggleTheme,
		visualTheme,
		changeVisualTheme
	}), [
		theme,
		toggleTheme,
		visualTheme,
		changeVisualTheme
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value,
		children
	});
}
function useTheme() {
	const context = (0, import_react.useContext)(ThemeContext);
	if (!context) return {
		theme: getInitialTheme(),
		setTheme: () => {},
		toggleTheme: () => {
			if (typeof window !== "undefined") {
				const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
				if (next === "dark") document.documentElement.classList.add("dark");
				else document.documentElement.classList.remove("dark");
				try {
					localStorage.setItem("edufinance.theme", next);
				} catch {}
			}
		},
		visualTheme: getInitialVisualTheme(),
		changeVisualTheme: () => {}
	};
	return context;
}
//#endregion
export { useTheme as n, ThemeProvider as t };
