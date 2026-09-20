import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as DialogHeader, o as DialogTitle, r as DialogDescription } from "./dialog-C26xL9O3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DialogHeadline-BQ9h1Ac-.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Cabeçalho padrão dos diálogos: cápsula com ícone + título e apoio.
* Mantém alinhamento e hierarquia iguais em todo o app.
*/
function DialogHeadline({ icon: Icon, title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": true,
			className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: title }), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: description })]
		})]
	}) });
}
//#endregion
export { DialogHeadline as t };
