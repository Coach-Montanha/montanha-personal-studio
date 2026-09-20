import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Ft as Funnel, fn as ChevronRight, pn as ChevronLeft } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as getAgenda } from "./classes.functions-CBapcCd4.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AgendaView-B1OE-VVR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DOW_FULL = [
	"Domingo",
	"Segunda",
	"Terça",
	"Quarta",
	"Quinta",
	"Sexta",
	"Sábado"
];
function weekStart(d) {
	const diffToMonday = (d.getDay() + 6) % 7;
	const s = new Date(d);
	s.setDate(d.getDate() - diffToMonday);
	s.setHours(0, 0, 0, 0);
	return s;
}
function fmtDateKey(d) {
	return d.toISOString().slice(0, 10);
}
function addDays(d, n) {
	const c = new Date(d);
	c.setDate(d.getDate() + n);
	return c;
}
function AgendaView({ renderCard }) {
	const [anchor, setAnchor] = (0, import_react.useState)(() => weekStart(/* @__PURE__ */ new Date()));
	const [programId, setProgramId] = (0, import_react.useState)("all");
	const fetchAgenda = useServerFn(getAgenda);
	const from = anchor;
	const to = addDays(anchor, 6);
	const { data: programs = [] } = useQuery({
		queryKey: ["agenda-programs"],
		queryFn: async () => {
			const { data } = await supabase.from("programs").select("id,name,color").order("name");
			return data ?? [];
		},
		staleTime: 5 * 6e4,
		gcTime: 30 * 6e4
	});
	const today = (0, import_react.useMemo)(() => {
		const d = /* @__PURE__ */ new Date();
		d.setHours(0, 0, 0, 0);
		return d;
	}, []);
	const mobileFrom = today;
	const mobileTo = addDays(today, 6);
	const rangeFrom = from < mobileFrom ? from : mobileFrom;
	const rangeTo = to > mobileTo ? to : mobileTo;
	const { data: sessions = [], isLoading } = useQuery({
		queryKey: [
			"agenda",
			fmtDateKey(rangeFrom),
			fmtDateKey(rangeTo),
			programId
		],
		queryFn: () => fetchAgenda({ data: {
			from: fmtDateKey(rangeFrom),
			to: fmtDateKey(rangeTo),
			programId: programId === "all" ? null : programId
		} }),
		staleTime: 3e4,
		gcTime: 5 * 6e4,
		placeholderData: (prev) => prev
	});
	const byDay = (0, import_react.useMemo)(() => {
		const map = {};
		const start = rangeFrom;
		const totalDays = Math.round((rangeTo.getTime() - rangeFrom.getTime()) / 864e5) + 1;
		for (let i = 0; i < totalDays; i++) map[fmtDateKey(addDays(start, i))] = [];
		for (const s of sessions) if (map[s.session_date]) map[s.session_date].push(s);
		return map;
	}, [
		sessions,
		rangeFrom,
		rangeTo
	]);
	const todayKey = fmtDateKey(/* @__PURE__ */ new Date());
	const weekDays = Array.from({ length: 7 }).map((_, i) => {
		const d = addDays(from, i);
		const key = fmtDateKey(d);
		return {
			d,
			key,
			list: byDay[key] ?? [],
			isToday: todayKey === key,
			isPast: key < todayKey
		};
	});
	const mobileDays = Array.from({ length: 7 }).map((_, i) => {
		const d = addDays(mobileFrom, i);
		const key = fmtDateKey(d);
		return {
			d,
			key,
			list: byDay[key] ?? [],
			isToday: todayKey === key,
			isPast: false
		};
	});
	const renderDay = (x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("border-b pb-1.5 text-center text-xs font-semibold uppercase tracking-wide transition-colors duration-200", x.isToday ? "border-primary text-primary" : "border-border text-muted-foreground"),
			children: [
				DOW_FULL[x.d.getDay()].slice(0, 3),
				" ",
				x.d.getDate()
			]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonDay, {}) : x.list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-4 text-center text-xs text-muted-foreground/70",
			children: "—"
		}) : x.list.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: renderCard(s) }, s.id))]
	}, x.key);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		"aria-busy": isLoading || void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-end gap-3 md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden md:flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							onClick: () => setAnchor(addDays(anchor, -7)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setAnchor(weekStart(/* @__PURE__ */ new Date())),
							children: "Hoje"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							onClick: () => setAnchor(addDays(anchor, 7)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-2 text-sm font-medium tabular-nums",
							children: [
								from.toLocaleDateString("pt-BR"),
								" — ",
								to.toLocaleDateString("pt-BR")
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: programId,
						onValueChange: setProgramId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[200px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Todos os programas"
						}), programs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: p.id,
							children: p.name
						}, p.id))] })]
					})]
				})]
			}),
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Carregando turmas da semana"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:grid gap-3 md:grid-cols-7",
				children: weekDays.map(renderDay)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:hidden",
				children: mobileDays.map(renderDay)
			})
		]
	});
}
function SkeletonDay() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2",
		children: [
			0,
			1,
			2
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-16 animate-pulse rounded-xl border border-border/60 bg-muted/40",
			style: { animationDelay: `${i * 60}ms` }
		}, i))
	});
}
//#endregion
export { AgendaView as t };
