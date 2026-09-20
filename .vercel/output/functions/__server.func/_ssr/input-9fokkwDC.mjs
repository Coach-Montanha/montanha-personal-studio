import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-9fokkwDC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn([
			"flex h-11 w-full rounded-lg border border-input bg-card px-3 py-1 text-base shadow-card sm:h-9 md:text-sm",
			"transition-[color,background-color,border-color,box-shadow] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
			"file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
			"placeholder:text-muted-foreground hover:border-primary/30",
			"outline-hidden focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/35",
			"disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
			"aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/30"
		].join(" "), className),
		ref,
		...props
	});
});
Input.displayName = "Input";
//#endregion
export { Input as t };
