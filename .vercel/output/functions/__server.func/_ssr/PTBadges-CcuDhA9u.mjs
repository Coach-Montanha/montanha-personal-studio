import { t as cn } from "./utils-C_uf36nf.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as TooltipTrigger, n as TooltipContent, r as TooltipProvider, t as Tooltip } from "./tooltip-CJZST3UV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PTBadges-CcuDhA9u.js
var import_jsx_runtime = require_jsx_runtime();
var ptSessionStatusLabel = {
	completed: "Realizada",
	cancelled_student: "Cancelada (aluno)",
	cancelled_trainer: "Cancelada (professor)",
	no_show: "Falta sem aviso"
};
var ptBillingTypeLabel = {
	monthly: "Mensal",
	per_session: "Por sessão",
	package: "Pacote"
};
function PTSessionStatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", {
			completed: "bg-success/10 text-success border-success/20",
			cancelled_student: "bg-destructive/10 text-destructive border-destructive/20",
			cancelled_trainer: "bg-destructive/10 text-destructive border-destructive/20",
			no_show: "bg-warning/15 text-warning-foreground border-warning/30"
		}[status] ?? "bg-muted text-muted-foreground border-border"),
		children: ptSessionStatusLabel[status] ?? status
	});
}
function PTStudentStatusBadge({ status }) {
	const styles = {
		active: "bg-state-paid-soft text-state-paid border-state-paid/30",
		inactive: "bg-state-pending-soft text-state-pending border-state-pending/30",
		paused: "bg-state-frozen-soft text-state-frozen border-state-frozen/30",
		churned: "bg-state-late-soft text-state-late border-state-late/30"
	};
	const labels = {
		active: "Ativo",
		inactive: "Inativo",
		paused: "Pausado",
		churned: "Churn"
	};
	const tooltips = {
		inactive: "Sem pagamento há 1 mês",
		churned: "Sem pagamento há 2 meses ou mais"
	};
	const badge = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", styles[status] ?? styles.inactive),
		children: labels[status] ?? status
	});
	const tip = tooltips[status];
	if (!tip) return badge;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 200,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: badge })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: tip })] })
	});
}
function PTBillingBadge({ type }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
		children: ptBillingTypeLabel[type] ?? type
	});
}
function PTBadge() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex items-center rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400",
		children: "PT"
	});
}
//#endregion
export { PTStudentStatusBadge as i, PTBillingBadge as n, PTSessionStatusBadge as r, PTBadge as t };
