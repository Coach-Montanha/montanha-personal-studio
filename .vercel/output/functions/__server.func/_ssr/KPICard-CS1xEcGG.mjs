import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Mt as GripVertical, Nn as ArrowUp, Ut as EyeOff, fn as ChevronRight, zn as ArrowDown } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/KPICard-CS1xEcGG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var toneColors = {
	primary: {
		stroke: "var(--primary, #0ea5e9)",
		fill: "var(--primary, #0ea5e9)"
	},
	success: {
		stroke: "#10b981",
		fill: "#10b981"
	},
	warning: {
		stroke: "#f59e0b",
		fill: "#f59e0b"
	},
	destructive: {
		stroke: "#ef4444",
		fill: "#ef4444"
	},
	neutral: {
		stroke: "currentColor",
		fill: "currentColor"
	}
};
function Sparkline({ data, height = 32, strokeWidth = 2, tone = "primary", fill = true, className, ...props }) {
	const gradientId = `sparkline-grad-${import_react.useId()}`;
	if (!data || data.length < 2) return null;
	const width = 100;
	const paddingY = 4;
	const usableHeight = height - paddingY * 2;
	const min = Math.min(...data);
	const max = Math.max(...data);
	const range = max - min === 0 ? 1 : max - min;
	const points = data.map((val, idx) => {
		return {
			x: idx / (data.length - 1) * width,
			y: paddingY + usableHeight - (val - min) / range * usableHeight
		};
	});
	const linePath = points.reduce((acc, point, i, arr) => {
		if (i === 0) return `M ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
		const prev = arr[i - 1];
		const midX = ((prev.x + point.x) / 2).toFixed(1);
		const midY = ((prev.y + point.y) / 2).toFixed(1);
		return `${acc} Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)}, ${midX} ${midY}`;
	}, "");
	const lastPoint = points[points.length - 1];
	const fullLinePath = `${linePath} T ${lastPoint.x.toFixed(1)} ${lastPoint.y.toFixed(1)}`;
	const areaPath = `${fullLinePath} L ${width} ${height} L 0 ${height} Z`;
	const colors = toneColors[tone] || toneColors.primary;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative w-full overflow-hidden", className),
		style: { height },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: `0 0 ${width} ${height}`,
			preserveAspectRatio: "none",
			className: "h-full w-full overflow-visible",
			...props,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: gradientId,
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: colors.fill,
						stopOpacity: .25
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: colors.fill,
						stopOpacity: 0
					})]
				}) }),
				fill && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: areaPath,
					fill: `url(#${gradientId})`,
					className: "transition-all duration-300"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: fullLinePath,
					fill: "none",
					stroke: colors.stroke,
					strokeWidth,
					strokeLinecap: "round",
					strokeLinejoin: "round",
					vectorEffect: "non-scaling-stroke",
					className: "transition-all duration-300"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: lastPoint.x,
					cy: lastPoint.y,
					r: strokeWidth * 1.5,
					fill: colors.stroke,
					className: "animate-pulse"
				})
			]
		})
	});
}
function KPICard({ label, value, icon, trend, trendData, hint, onClick, disabled, onHide, dragHandleProps }) {
	const showTrend = trend && Number.isFinite(trend.value);
	const isUp = (trend?.value ?? 0) >= 0;
	const good = trend?.positiveIsGood ?? true ? isUp : !isUp;
	const interactive = Boolean(onClick) && !disabled;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		...interactive ? {
			role: "button",
			tabIndex: 0,
			onClick,
			onKeyDown: (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick?.();
				}
			}
		} : {},
		"aria-disabled": onClick && disabled ? true : void 0,
		className: cn("group relative min-w-0 max-w-full overflow-hidden p-3 shadow-card transition-ui sm:p-5", interactive ? "focus-ring cursor-pointer hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-float active:translate-y-0" : onClick && disabled ? "cursor-default opacity-60" : "hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-float"),
		children: [
			onHide && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: (e) => {
					e.stopPropagation();
					onHide();
				},
				className: "absolute right-2 top-2 z-10 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100",
				title: "Esconder card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" })
			}),
			dragHandleProps && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				...dragHandleProps,
				className: "absolute left-1.5 top-1/2 z-10 -translate-y-1/2 cursor-grab rounded-md p-1 text-muted-foreground/30 opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 active:cursor-grabbing",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-ui group-hover:opacity-100"
			}),
			interactive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
				"aria-hidden": true,
				className: "absolute bottom-4 right-4 h-4 w-4 text-muted-foreground opacity-0 transition-ui group-hover:translate-x-0.5 group-hover:opacity-100"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-1.5 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[0.6875rem] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-0 leading-tight break-words line-clamp-2",
					children: label
				}), icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-[var(--radius-button,9999px)] bg-primary/10 text-primary ring-1 ring-inset ring-primary/15 transition-ui group-hover:bg-primary/15",
					children: icon
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-numeric mt-1.5 text-lg font-bold text-foreground sm:mt-3 sm:text-2xl lg:text-[1.75rem] truncate",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1.5 sm:mt-2 flex flex-wrap items-center gap-x-2 gap-y-1",
				children: [showTrend && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[0.6875rem] font-semibold", good ? "bg-state-paid-soft text-state-paid" : "bg-state-late-soft text-state-late"),
					children: [
						isUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-3 w-3" }),
						Math.abs(trend.value).toFixed(1).replace(".", ","),
						"%"
					]
				}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-caption min-w-0 truncate text-muted-foreground",
					children: hint
				})]
			}),
			trendData && trendData.length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2.5 pt-0.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
					data: trendData,
					tone: good ? "success" : "destructive",
					height: 26
				})
			})
		]
	});
}
//#endregion
export { KPICard as t };
