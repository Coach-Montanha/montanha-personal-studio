import "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva([
	"inline-flex items-center gap-1.5 rounded-[var(--radius-button,9999px)] border px-2.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide",
	"transition-[color,background-color,border-color] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
	"outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
].join(" "), {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "border-border text-foreground",
		paid: "border-state-paid/25 bg-state-paid-soft text-state-paid",
		pending: "border-state-pending/25 bg-state-pending-soft text-state-pending",
		late: "border-state-late/25 bg-state-late-soft text-state-late",
		frozen: "border-state-frozen/25 bg-state-frozen-soft text-state-frozen"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };
