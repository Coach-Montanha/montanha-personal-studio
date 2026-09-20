import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-impersonate-D1wFi3Sj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var IMPERSONATE_STORAGE_KEY = "edufinance.impersonate";
function read() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(IMPERSONATE_STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
var listeners = /* @__PURE__ */ new Set();
function emit() {
	for (const l of listeners) l();
}
function setImpersonate(meta) {
	if (typeof window === "undefined") return;
	if (meta) localStorage.setItem(IMPERSONATE_STORAGE_KEY, JSON.stringify(meta));
	else localStorage.removeItem(IMPERSONATE_STORAGE_KEY);
	try {
		const toRemove = [];
		for (let i = 0; i < window.localStorage.length; i++) {
			const k = window.localStorage.key(i);
			if (k && k.startsWith("ef-portal-cache:")) toRemove.push(k);
		}
		toRemove.forEach((k) => window.localStorage.removeItem(k));
	} catch {}
	emit();
}
function clearImpersonation() {
	setImpersonate(null);
	if (typeof window !== "undefined") try {
		const url = new URL(window.location.href);
		url.searchParams.delete("impersonate");
		window.location.href = url.pathname + (url.search ? url.search : "") + url.hash;
	} catch {
		window.location.reload();
	}
}
function useImpersonate() {
	return (0, import_react.useSyncExternalStore)((cb) => {
		listeners.add(cb);
		const onStorage = (e) => {
			if (e.key === "edufinance.impersonate") cb();
		};
		window.addEventListener("storage", onStorage);
		return () => {
			listeners.delete(cb);
			window.removeEventListener("storage", onStorage);
		};
	}, read, () => null);
}
//#endregion
export { useImpersonate as i, clearImpersonation as n, setImpersonate as r, IMPERSONATE_STORAGE_KEY as t };
