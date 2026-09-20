import { t as cn } from "./utils-C_uf36nf.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SectionCard-Dhxnzc2Q.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Card de seção com header interno consistente.
* Substitui os blocos `<Card><CardHeader>…` repetidos em analytics,
* perfil e settings, com a mesma escala de respiro em todas as telas.
*/
function SectionCard({ title, description, icon: Icon, actions, children, footer, padded = true, className, bodyClassName }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("overflow-hidden rounded-[var(--radius-card-val)] border border-border bg-card shadow-card transition-ui", className),
		children: [
			(title || actions) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3.5 sm:px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2.5",
					children: [Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: "shrink-0 text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-section truncate text-foreground",
							children: title
						}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-caption mt-0.5 truncate text-muted-foreground",
							children: description
						})]
					})]
				}), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex shrink-0 items-center gap-2",
					children: actions
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn(padded && "p-4 sm:p-5", bodyClassName),
				children
			}),
			footer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border bg-surface-sunken px-4 py-3 sm:px-5",
				children: footer
			})
		]
	});
}
//#endregion
export { SectionCard as t };
