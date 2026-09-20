import { t as cn } from "./utils-C_uf36nf.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmptyState-DK3vCNbs.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Estado vazio padrão — mesma linguagem visual do `DataState`
* (borda tracejada, superfície rebaixada, ícone em cápsula com anel).
*/
function EmptyState({ icon, title, description, action, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-surface-sunken px-6 py-12 text-center", className),
		children: [
			icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-section text-foreground",
					children: title
				}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-caption mx-auto max-w-sm text-muted-foreground",
					children: description
				})]
			}),
			action
		]
	});
}
//#endregion
export { EmptyState as t };
