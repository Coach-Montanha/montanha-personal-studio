import { t as cn } from "./utils-C_uf36nf.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FormSection-CxKu2XVA.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Grupo de campos dentro de um diálogo/formulário.
* Rótulo em overline + grade responsiva (1 coluna no mobile, 2 a partir de `sm`).
*/
function FormSection({ title, description, children, className, divided = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn(divided && "border-t border-border pt-4", className),
		children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-overline text-muted-foreground",
				children: title
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-caption mt-1 text-muted-foreground",
				children: description
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2",
			children
		})]
	});
}
/** Campo individual. `full` ocupa a linha inteira na grade de 2 colunas. */
function Field({ label, hint, full, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("space-y-1.5", full && "sm:col-span-2", className),
		children: [
			label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-caption text-foreground",
				children: label
			}),
			children,
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-caption text-muted-foreground",
				children: hint
			})
		]
	});
}
//#endregion
export { FormSection as n, Field as t };
