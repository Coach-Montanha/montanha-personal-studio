import { o as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as Slot } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { _t as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-C0L5fFXX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva([
	"relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button,var(--radius-md,calc(var(--radius)-2px)))]",
	"text-sm font-semibold cursor-pointer select-none",
	"transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
	"outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
	"active:translate-y-px",
	"disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
	"[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
].join(" "), {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-card hover:bg-primary/90 hover:shadow-float",
			destructive: "bg-destructive text-destructive-foreground shadow-card hover:bg-destructive/90 hover:shadow-float",
			outline: "border border-border bg-card text-foreground shadow-card hover:border-primary/40 hover:bg-muted/60 hover:text-foreground",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
			ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
			link: "text-primary underline-offset-4 hover:underline active:translate-y-0",
			success: "bg-state-paid text-primary-foreground shadow-card hover:brightness-110"
		},
		size: {
			default: "h-10 px-4 py-2 sm:h-9",
			sm: "h-9 rounded-md px-3 text-xs sm:h-8",
			lg: "h-11 rounded-lg px-7 text-[0.9375rem]",
			icon: "h-10 w-10 sm:h-9 sm:w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
	const Comp = asChild ? Slot : "button";
	if (asChild) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props,
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		disabled: disabled || loading,
		"aria-busy": loading || void 0,
		...props,
		children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
			className: "h-4 w-4 animate-spin",
			"aria-hidden": true
		}), children]
	});
});
Button.displayName = "Button";
//#endregion
export { buttonVariants as n, Button as t };
