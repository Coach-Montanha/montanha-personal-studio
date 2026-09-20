import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { fn as ChevronRight, pn as ChevronLeft } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { s as formatMonthLong, t as addMonths$1 } from "./format-BT-nao3-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MonthYearPicker-BRYGdsSp.js
var import_jsx_runtime = require_jsx_runtime();
function MonthYearPicker({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex w-full sm:w-auto items-center justify-between rounded-lg border bg-card shadow-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				className: "h-10 w-10 sm:h-9 sm:w-9 shrink-0",
				onClick: () => onChange(addMonths$1(value, -1)),
				"aria-label": "Mês anterior",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 sm:min-w-[140px] px-2 text-center text-sm font-medium capitalize truncate",
				children: formatMonthLong(value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				className: "h-10 w-10 sm:h-9 sm:w-9 shrink-0",
				onClick: () => onChange(addMonths$1(value, 1)),
				"aria-label": "Próximo mês",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
			})
		]
	});
}
function YearPicker({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center rounded-lg border bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				onClick: () => onChange(value - 1),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-w-[60px] px-2 text-center text-sm font-medium font-mono",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				onClick: () => onChange(value + 1),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
			})
		]
	});
}
//#endregion
export { YearPicker as n, MonthYearPicker as t };
