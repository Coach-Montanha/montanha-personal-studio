import { t as cn } from "./utils-C_uf36nf.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PageHeader-CRue-aiN.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Cabeçalho de página padrão.
*
* Layout: grid de duas colunas no mobile (texto encolhe/trunca, ações fixas),
* vira flex a partir de `sm`. Respiro na escala de 4/8px.
*/
function PageHeader({ title, description, icon: Icon, eyebrow, actions, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cn("flex w-full max-w-full min-w-0 flex-col gap-3 pb-4 sm:pb-6 sm:flex-row sm:items-center sm:justify-between", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 max-w-full flex-1 items-start gap-2.5 sm:gap-3",
			children: [Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: "mt-0.5 grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 sm:h-5 sm:w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-overline mb-0.5 text-muted-foreground",
						children: eyebrow
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-bold tracking-tight text-foreground sm:text-title break-words",
						children: title
					}),
					description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-caption mt-1 max-w-prose text-muted-foreground break-words",
						children: description
					})
				]
			})]
		}), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex w-full max-w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:shrink-0 sm:justify-end",
			children: actions
		})]
	});
}
//#endregion
export { PageHeader as t };
