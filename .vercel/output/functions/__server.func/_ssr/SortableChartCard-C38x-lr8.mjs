import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Ht as Eye, Mt as GripVertical, Ut as EyeOff } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { g as CSS } from "../_libs/@dnd-kit/core+[...].mjs";
import { a as useSortable } from "../_libs/dnd-kit__sortable.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SortableChartCard-C38x-lr8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useLocalStorage(key, initialValue) {
	const [value, setValue] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return initialValue;
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(`Error reading localStorage key "${key}":`, error);
			return initialValue;
		}
	});
	(0, import_react.useEffect)(() => {
		try {
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Error writing localStorage key "${key}":`, error);
		}
	}, [key, value]);
	return [value, setValue];
}
/**
* Card de gráfico arrastável e ocultável — mesma mecânica dos KPIs,
* mas preservando a altura/spando gráfico dentro do grid.
*/
function SortableChartCard({ id, title, actions, onHide, children, className }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		ref: setNodeRef,
		style: {
			transform: CSS.Transform.toString(transform),
			transition
		},
		className: cn("group relative flex min-w-0 max-w-full overflow-hidden flex-col p-3.5 sm:p-5", isDragging && "z-20 opacity-80 shadow-float", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Reordenar card",
					className: "focus-ring -ml-1 cursor-grab rounded p-1 text-muted-foreground/50 opacity-0 transition-ui hover:text-foreground group-hover:opacity-100 active:cursor-grabbing",
					...attributes,
					...listeners,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "truncate text-sm font-semibold",
					children: title
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center gap-1",
				children: [actions, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Ocultar card",
					onClick: onHide,
					className: "focus-ring rounded p-1 text-muted-foreground/50 opacity-0 transition-ui hover:text-foreground group-hover:opacity-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-w-0 max-w-full flex-1 overflow-hidden",
			children
		})]
	});
}
/** Chips para restaurar cards de gráficos ocultos. */
function HiddenChartChips({ hidden, labels, onRestore }) {
	if (hidden.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-medium text-muted-foreground",
			children: "Gráficos ocultos:"
		}), hidden.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "secondary",
			size: "sm",
			className: "h-7 gap-1 px-2 text-[10px]",
			onClick: () => onRestore(id),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" }), labels[id] ?? id]
		}, id))]
	});
}
//#endregion
export { SortableChartCard as n, useLocalStorage as r, HiddenChartChips as t };
