import { t as cn } from "./utils-C_uf36nf.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as statusLabel } from "./format-BT-nao3-.mjs";
import { a as TooltipTrigger, n as TooltipContent, r as TooltipProvider, t as Tooltip } from "./tooltip-CJZST3UV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Badges-BwuNwA-M.js
var import_jsx_runtime = require_jsx_runtime();
var paymentStyles = {
	paid: "bg-state-paid-soft text-state-paid border-state-paid/30",
	pending: "bg-state-pending-soft text-state-pending border-state-pending/30",
	overdue: "bg-state-late-soft text-state-late border-state-late/30",
	cancelled: "bg-muted text-muted-foreground border-border"
};
var studentStyles = {
	active: "bg-state-paid-soft text-state-paid border-state-paid/30",
	inactive: "bg-state-pending-soft text-state-pending border-state-pending/30",
	churned: "bg-state-late-soft text-state-late border-state-late/30",
	paused: "bg-state-frozen-soft text-state-frozen border-state-frozen/30"
};
var studentTooltips = {
	inactive: "Sem pagamento há 1 mês",
	churned: "Sem pagamento há 2 meses ou mais"
};
var studentDisplay = {
	active: "Ativo",
	inactive: "Inativo",
	churned: "Churn",
	paused: "Congelado"
};
function PaymentStatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", paymentStyles[status] ?? paymentStyles.cancelled),
		children: statusLabel.payment[status] ?? status
	});
}
function StudentStatusBadge({ status }) {
	const badge = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", studentStyles[status] ?? studentStyles.inactive),
		children: studentDisplay[status] ?? status
	});
	const tip = studentTooltips[status];
	if (!tip) return badge;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 200,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: badge })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: tip })] })
	});
}
function PlanBadge({ name }) {
	if (!name) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs text-muted-foreground",
		children: "—"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
		children: name
	});
}
//#endregion
export { PlanBadge as n, StudentStatusBadge as r, PaymentStatusBadge as t };
