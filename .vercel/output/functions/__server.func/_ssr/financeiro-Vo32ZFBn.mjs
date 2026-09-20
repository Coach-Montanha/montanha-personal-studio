import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { G as Plus, Ht as Eye, Jt as DollarSign, Kt as Dumbbell, Lt as FileText, Rt as FileSpreadsheet, W as Receipt, Wn as Activity, Z as Pencil, _n as ChartColumn, b as Trash2, r as Wallet, v as TrendingUp, y as TrendingDown, z as Scale } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { a as PointerSensor, g as CSS, h as useSensors, i as KeyboardSensor, m as useSensor, o as closestCenter, t as DndContext } from "../_libs/@dnd-kit/core+[...].mjs";
import { t as PageHeader } from "./PageHeader-CRue-aiN.mjs";
import { i as DialogFooter, n as DialogContent, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DEnZ0u5J.mjs";
import { t as EmptyState } from "./EmptyState-DK3vCNbs.mjs";
import { c as startOfMonth, r as subMonths, s as format } from "../_libs/date-fns.mjs";
import { a as formatDateBR, i as formatBRL, o as formatMonthLabel, r as currentMonthKey, t as addMonths$1, u as paymentMethodLabel } from "./format-BT-nao3-.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useScopeFilter } from "./use-scope-filter-q5Imal9c.mjs";
import { t as chartTooltip } from "./chart-theme-DG2ASWF8.mjs";
import { t as KPICard } from "./KPICard-CS1xEcGG.mjs";
import { n as YearPicker, t as MonthYearPicker } from "./MonthYearPicker-BRYGdsSp.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { a as useSortable, i as sortableKeyboardCoordinates, n as arrayMove, o as verticalListSortingStrategy, r as rectSortingStrategy, t as SortableContext } from "../_libs/dnd-kit__sortable.mjs";
import { n as SortableChartCard, r as useLocalStorage, t as HiddenChartChips } from "./SortableChartCard-C38x-lr8.mjs";
import { t as useModules } from "./use-modules-DlxYE7n1.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as YAxis, c as Line, d as Pie, f as Cell, h as Legend, i as LineChart, l as CartesianGrid, m as Tooltip, n as PieChart, o as XAxis, p as ResponsiveContainer, r as BarChart, s as Area, t as AreaChart, u as Bar } from "../_libs/recharts+[...].mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-iwNaZIEJ.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DT1SSYuq.mjs";
import { t as Route } from "./financeiro-NOyznWvM.mjs";
import { t as DialogHeadline } from "./DialogHeadline-BQ9h1Ac-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/financeiro-Vo32ZFBn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Exporta o Demonstrativo de Resultado (DRE) para Excel (.xlsx) */
async function exportDreToExcel(rows, businessName = "Studio Coach Montanha") {
	const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
	const wb = XLSX.utils.book_new();
	const data = [
		[businessName],
		["DEMONSTRATIVO DO RESULTADO DO EXERCÍCIO (DRE)"],
		[`Gerado em: ${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")}`],
		[],
		[
			"Mês",
			"Receita Studio (R$)",
			"Receita PT (R$)",
			"Total Receitas (R$)",
			"Despesas Fixas (R$)",
			"Despesas Variáveis (R$)",
			"Total Despesas (R$)",
			"Lucro / Prejuízo (R$)",
			"Margem (%)"
		]
	];
	let totalStudio = 0;
	let totalPt = 0;
	let totalRev = 0;
	let totalFixed = 0;
	let totalVar = 0;
	let totalExp = 0;
	let totalProfit = 0;
	for (const r of rows) {
		totalStudio += r.studioRev;
		totalPt += r.ptRev;
		totalRev += r.totalRev;
		totalFixed += r.fixedExp;
		totalVar += r.varExp;
		totalExp += r.totalExp;
		totalProfit += r.profit;
		data.push([
			r.label,
			r.studioRev,
			r.ptRev,
			r.totalRev,
			r.fixedExp,
			r.varExp,
			r.totalExp,
			r.profit,
			`${r.margin.toFixed(1)}%`
		]);
	}
	const overallMargin = totalRev > 0 ? totalProfit / totalRev * 100 : 0;
	data.push([]);
	data.push([
		"TOTAL DO PERÍODO",
		totalStudio,
		totalPt,
		totalRev,
		totalFixed,
		totalVar,
		totalExp,
		totalProfit,
		`${overallMargin.toFixed(1)}%`
	]);
	const ws = XLSX.utils.aoa_to_sheet(data);
	ws["!cols"] = [
		{ wch: 18 },
		{ wch: 18 },
		{ wch: 16 },
		{ wch: 18 },
		{ wch: 18 },
		{ wch: 22 },
		{ wch: 18 },
		{ wch: 20 },
		{ wch: 14 }
	];
	XLSX.utils.book_append_sheet(wb, ws, "DRE Contábil");
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	XLSX.writeFile(wb, `DRE_${businessName.replace(/[^\w\-]+/g, "_")}_${today}.xlsx`);
}
/** Exporta o Demonstrativo de Resultado (DRE) para PDF */
async function exportDreToPdf(rows, businessName = "Studio Coach Montanha") {
	const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("../_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t())), import("../_libs/jspdf-autotable.mjs").then((n) => n.t)]);
	const doc = new jsPDF({
		unit: "pt",
		format: "a4",
		orientation: "landscape"
	});
	const pageWidth = doc.internal.pageSize.getWidth();
	const margin = 36;
	let y = 46;
	doc.setFillColor(30, 41, 59);
	doc.roundedRect(margin, y, pageWidth - margin * 2, 44, 4, 4, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(14);
	doc.text(businessName, 50, y + 20);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.text("DEMONSTRATIVO DE RESULTADO DO EXERCÍCIO (DRE)", 50, y + 34);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(8.5);
	doc.text(`Emissão: ${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")}`, pageWidth - margin - 14, y + 26, { align: "right" });
	y += 56;
	const totals = rows.reduce((acc, r) => ({
		studioRev: acc.studioRev + r.studioRev,
		ptRev: acc.ptRev + r.ptRev,
		totalRev: acc.totalRev + r.totalRev,
		fixedExp: acc.fixedExp + r.fixedExp,
		varExp: acc.varExp + r.varExp,
		totalExp: acc.totalExp + r.totalExp,
		profit: acc.profit + r.profit
	}), {
		studioRev: 0,
		ptRev: 0,
		totalRev: 0,
		fixedExp: 0,
		varExp: 0,
		totalExp: 0,
		profit: 0
	});
	const overallMargin = totals.totalRev > 0 ? totals.profit / totals.totalRev * 100 : 0;
	const tableHead = [[
		"Mês",
		"Rec. Studio",
		"Rec. PT",
		"Total Receita",
		"Desp. Fixas",
		"Desp. Variáveis",
		"Total Despesas",
		"Lucro / Prejuízo",
		"Margem"
	]];
	const tableBody = rows.map((r) => [
		r.label,
		formatBRL(r.studioRev),
		formatBRL(r.ptRev),
		formatBRL(r.totalRev),
		formatBRL(r.fixedExp),
		formatBRL(r.varExp),
		formatBRL(r.totalExp),
		formatBRL(r.profit),
		`${r.margin.toFixed(1)}%`
	]);
	const tableFoot = [[
		"TOTAL",
		formatBRL(totals.studioRev),
		formatBRL(totals.ptRev),
		formatBRL(totals.totalRev),
		formatBRL(totals.fixedExp),
		formatBRL(totals.varExp),
		formatBRL(totals.totalExp),
		formatBRL(totals.profit),
		`${overallMargin.toFixed(1)}%`
	]];
	autoTable(doc, {
		startY: y,
		head: tableHead,
		body: tableBody,
		foot: tableFoot,
		styles: {
			fontSize: 8.5,
			cellPadding: 6
		},
		headStyles: {
			fillColor: [
				241,
				245,
				249
			],
			textColor: [
				51,
				65,
				85
			],
			fontStyle: "bold"
		},
		footStyles: {
			fillColor: [
				241,
				245,
				249
			],
			textColor: [
				15,
				23,
				42
			],
			fontStyle: "bold",
			fontSize: 9
		},
		columnStyles: {
			0: {
				fontStyle: "bold",
				cellWidth: 80
			},
			1: { halign: "right" },
			2: { halign: "right" },
			3: {
				halign: "right",
				fontStyle: "bold"
			},
			4: { halign: "right" },
			5: { halign: "right" },
			6: {
				halign: "right",
				fontStyle: "bold"
			},
			7: {
				halign: "right",
				fontStyle: "bold"
			},
			8: {
				halign: "right",
				fontStyle: "bold"
			}
		},
		margin: {
			left: margin,
			right: margin
		}
	});
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	doc.save(`DRE_${businessName.replace(/[^\w\-]+/g, "_")}_${today}.pdf`);
}
function StudioAnalyticsPanel() {
	const { scopeId, scopeKey, ready } = useScopeFilter();
	const [year, setYear] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getFullYear());
	const [compareYear, setCompareYear] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getFullYear() - 1);
	const [ltvSort, setLtvSort] = (0, import_react.useState)("desc");
	const [ltvPage, setLtvPage] = (0, import_react.useState)(0);
	const LTV_PER_PAGE = 20;
	const { data: payments = [] } = useQuery({
		queryKey: ["payments-analytics", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let allRows = [];
			let from = 0;
			const PAGE = 1e3;
			while (true) {
				let q = supabase.from("payments").select("amount,payment_date,reference_month,payment_method,status,student_id,plan_id,students(name),plans(name)").is("deleted_at", null).eq("status", "paid").range(from, from + PAGE - 1);
				if (scopeId) q = q.eq("user_id", scopeId);
				const { data, error } = await q;
				if (error) throw error;
				allRows = allRows.concat(data ?? []);
				if (!data || data.length < PAGE) break;
				from += PAGE;
			}
			return allRows;
		}
	});
	const months = (0, import_react.useMemo)(() => Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, "0")}`), [year, compareYear]);
	const revenueData = (0, import_react.useMemo)(() => {
		return months.map((m, i) => {
			const prevM = `${compareYear}-${String(i + 1).padStart(2, "0")}`;
			const cur = payments.filter((p) => p.reference_month === m).reduce((s, p) => s + Number(p.amount), 0);
			const prev = payments.filter((p) => p.reference_month === prevM).reduce((s, p) => s + Number(p.amount), 0);
			return {
				label: formatMonthLabel(m),
				atual: cur,
				anterior: prev
			};
		});
	}, [
		months,
		payments,
		compareYear
	]);
	const breakdown = (0, import_react.useMemo)(() => {
		return months.map((m) => {
			const pays = payments.filter((p) => p.reference_month === m);
			const total = pays.reduce((s, p) => s + Number(p.amount), 0);
			const avg = pays.length ? total / pays.length : 0;
			return {
				month: m,
				label: formatMonthLabel(m),
				total,
				count: pays.length,
				avg
			};
		});
	}, [months, payments]);
	const studentFlow = (0, import_react.useMemo)(() => {
		const firstPayment = /* @__PURE__ */ new Map();
		const lastPayment = /* @__PURE__ */ new Map();
		for (const p of payments) {
			const cur = firstPayment.get(p.student_id);
			if (!cur || p.reference_month < cur) firstPayment.set(p.student_id, p.reference_month);
			const last = lastPayment.get(p.student_id);
			if (!last || p.reference_month > last) lastPayment.set(p.student_id, p.reference_month);
		}
		return months.map((m, i) => {
			const prevM = i === 0 ? `${compareYear}-12` : months[i - 1];
			const activeNow = new Set(payments.filter((p) => p.reference_month === m).map((p) => p.student_id));
			const activePrev = new Set(payments.filter((p) => p.reference_month === prevM).map((p) => p.student_id));
			const novos = [...firstPayment.entries()].filter(([, fm]) => fm === m).length;
			const saidas = [...activePrev].filter((s) => !activeNow.has(s)).length;
			const retencao = activePrev.size ? (activeNow.size - novos) / activePrev.size * 100 : 0;
			return {
				label: formatMonthLabel(m),
				novos,
				saidas,
				ativos: activeNow.size,
				retencao: Number(retencao.toFixed(1))
			};
		});
	}, [
		months,
		payments,
		compareYear
	]);
	const ltvData = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of payments) {
			const id = p.student_id;
			const cur = map.get(id) ?? {
				name: p.students?.name ?? "—",
				total: 0,
				plan: p.plans?.name ?? null
			};
			cur.total += Number(p.amount);
			cur.plan = cur.plan ?? p.plans?.name ?? null;
			map.set(id, cur);
		}
		const arr = [...map.values()].sort((a, b) => b.total - a.total);
		return {
			rows: arr,
			avg: arr.length ? arr.reduce((s, r) => s + r.total, 0) / arr.length : 0,
			top: arr.slice(0, 10)
		};
	}, [payments]);
	const sortedLtv = (0, import_react.useMemo)(() => {
		const arr = [...ltvData.rows];
		if (ltvSort === "desc") arr.sort((a, b) => b.total - a.total);
		if (ltvSort === "asc") arr.sort((a, b) => a.total - b.total);
		if (ltvSort === "alpha") arr.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
		return arr;
	}, [ltvData.rows, ltvSort]);
	const ltvPageRows = sortedLtv.slice(ltvPage * LTV_PER_PAGE, (ltvPage + 1) * LTV_PER_PAGE);
	const ltvTotalPages = Math.max(1, Math.ceil(sortedLtv.length / LTV_PER_PAGE));
	const ltvByPlan = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const r of ltvData.rows) {
			const k = r.plan ?? "Sem plano";
			const cur = map.get(k) ?? {
				total: 0,
				count: 0
			};
			cur.total += r.total;
			cur.count++;
			map.set(k, cur);
		}
		return [...map].map(([name, v]) => ({
			name,
			ltv: v.count ? v.total / v.count : 0
		}));
	}, [ltvData]);
	const yearPays = (0, import_react.useMemo)(() => payments.filter((p) => p.reference_month.startsWith(String(year))), [payments, year]);
	const planNames = (0, import_react.useMemo)(() => Array.from(new Set(yearPays.map((p) => p.plans?.name ?? "Sem plano"))), [yearPays]);
	const stackedByPlan = (0, import_react.useMemo)(() => {
		return months.map((m) => {
			const row = { label: formatMonthLabel(m) };
			for (const name of planNames) row[name] = yearPays.filter((p) => p.reference_month === m && (p.plans?.name ?? "Sem plano") === name).reduce((s, p) => s + Number(p.amount), 0);
			return row;
		});
	}, [
		months,
		yearPays,
		planNames
	]);
	const planTable = (0, import_react.useMemo)(() => {
		const total = yearPays.reduce((s, p) => s + Number(p.amount), 0);
		return planNames.map((name) => {
			const pays = yearPays.filter((p) => (p.plans?.name ?? "Sem plano") === name);
			const rev = pays.reduce((s, p) => s + Number(p.amount), 0);
			return {
				name,
				students: new Set(pays.map((p) => p.student_id)).size,
				rev,
				avg: pays.length ? rev / pays.length : 0,
				pct: total ? rev / total * 100 : 0
			};
		}).sort((a, b) => b.rev - a.rev);
	}, [yearPays, planNames]);
	const byMethod = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of yearPays) {
			const k = paymentMethodLabel(p.payment_method);
			map.set(k, (map.get(k) ?? 0) + Number(p.amount));
		}
		return [...map].map(([name, value]) => ({
			name,
			value
		}));
	}, [yearPays]);
	const methodTrend = (0, import_react.useMemo)(() => {
		return months.map((m) => {
			const row = { label: formatMonthLabel(m) };
			for (const method of [
				"pix",
				"credit_card",
				"debit_card",
				"bank_slip",
				"cash",
				"transfer"
			]) row[paymentMethodLabel(method)] = yearPays.filter((p) => p.reference_month === m && p.payment_method === method).reduce((s, p) => s + Number(p.amount), 0);
			return row;
		});
	}, [months, yearPays]);
	const colors = [
		"var(--color-chart-1)",
		"var(--color-chart-2)",
		"var(--color-chart-3)",
		"var(--color-chart-4)",
		"var(--color-chart-5)"
	];
	const Section = ({ title, children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-4 text-base font-semibold",
			children: title
		}), children]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-overline mb-1 text-muted-foreground",
							children: "Studio"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold tracking-tight text-foreground",
							children: "Análises do Studio"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-caption mt-1.5 text-muted-foreground",
							children: "Métricas detalhadas do seu negócio"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground",
							children: "Ano principal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YearPicker, {
							value: year,
							onChange: setYear
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground",
							children: "Comparar com"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YearPicker, {
							value: compareYear,
							onChange: setCompareYear
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: `Receita — ${year} vs ${compareYear}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: revenueData,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "var(--color-border)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								tick: { fontSize: 11 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: { fontSize: 11 },
								tickFormatter: (v) => `R$${(v / 1e3).toFixed(0)}k`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								...chartTooltip,
								formatter: (v) => formatBRL(v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "atual",
								name: String(year),
								stroke: "var(--color-chart-1)",
								strokeWidth: 2.5
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "anterior",
								name: String(compareYear),
								stroke: "var(--color-chart-3)",
								strokeWidth: 2,
								strokeDasharray: "4 4"
							})
						]
					}) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Mês" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Receita"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "# Pagamentos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Ticket Médio"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Crescimento MoM"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: breakdown.map((b, i) => {
						const prev = i > 0 ? breakdown[i - 1].total : 0;
						const mom = prev ? (b.total - prev) / prev * 100 : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "capitalize",
								children: b.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right font-mono",
								children: formatBRL(b.total)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right font-mono",
								children: b.count
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right font-mono",
								children: formatBRL(b.avg)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: `text-right font-mono ${mom >= 0 ? "text-success" : "text-destructive"}`,
								children: i === 0 ? "—" : `${mom >= 0 ? "+" : ""}${mom.toFixed(1)}%`
							})
						] }, b.month);
					}) })] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Fluxo de alunos (entradas, saídas, retenção)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: studentFlow,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "var(--color-border)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 11 } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...chartTooltip }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "ativos",
									stroke: "var(--color-chart-1)",
									strokeWidth: 2.5
								})
							]
						}) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: studentFlow,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "var(--color-border)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 11 } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...chartTooltip }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "novos",
									name: "Entradas",
									fill: "var(--color-chart-2)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "saidas",
									name: "Saídas",
									fill: "var(--color-chart-4)"
								})
							]
						}) })
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "LTV — Lifetime Value",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-muted/40 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs uppercase text-muted-foreground",
									children: "LTV médio"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-2xl font-bold",
									children: formatBRL(ltvData.avg)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [ltvData.rows.length, " alunos analisados"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-4 text-sm font-semibold",
							children: "LTV por plano"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 h-48",
							children: ltvByPlan.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: ltvByPlan,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "var(--color-border)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										tick: { fontSize: 11 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: { fontSize: 11 },
										tickFormatter: (v) => `R$${(v / 1e3).toFixed(0)}k`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										...chartTooltip,
										formatter: (v) => formatBRL(v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "ltv",
										fill: "var(--color-chart-2)",
										radius: [
											4,
											4,
											0,
											0
										]
									})
								]
							}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "Sem dados" })
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-sm font-semibold",
									children: [
										"Todos os alunos por LTV (",
										ltvData.rows.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: ltvSort,
									onValueChange: (v) => {
										setLtvSort(v);
										setLtvPage(0);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[200px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "desc",
											children: "Maior LTV primeiro"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "asc",
											children: "Menor LTV primeiro"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "alpha",
											children: "Ordem alfabética"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "w-10",
									children: "#"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Aluno" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Plano" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "LTV"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: ltvPageRows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-mono text-xs text-muted-foreground",
									children: ltvPage * LTV_PER_PAGE + i + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-medium",
									children: r.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs text-muted-foreground",
									children: r.plan ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right font-mono",
									children: formatBRL(r.total)
								})
							] }, ltvPage * LTV_PER_PAGE + i)) })] }),
							sortedLtv.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-muted-foreground",
									children: [
										"Página ",
										ltvPage + 1,
										" de ",
										ltvTotalPages
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										disabled: ltvPage === 0,
										onClick: () => setLtvPage((p) => p - 1),
										children: "Anterior"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										disabled: (ltvPage + 1) * LTV_PER_PAGE >= sortedLtv.length,
										onClick: () => setLtvPage((p) => p + 1),
										children: "Próxima"
									})]
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Planos",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-72",
					children: planNames.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: stackedByPlan,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "var(--color-border)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								tick: { fontSize: 11 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: { fontSize: 11 },
								tickFormatter: (v) => `R$${(v / 1e3).toFixed(0)}k`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								...chartTooltip,
								formatter: (v) => formatBRL(v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
							planNames.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: p,
								stackId: "a",
								fill: colors[i % colors.length]
							}, p))
						]
					}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "Sem pagamentos no ano" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Plano" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Alunos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Receita"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Ticket Médio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "% Total"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: planTable.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.name }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right font-mono",
						children: r.students
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right font-mono",
						children: formatBRL(r.rev)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right font-mono",
						children: formatBRL(r.avg)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "text-right font-mono",
						children: [r.pct.toFixed(1), "%"]
					})
				] }, r.name)) })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Formas de pagamento",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: byMethod.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: byMethod,
								dataKey: "value",
								nameKey: "name",
								innerRadius: 50,
								outerRadius: 90,
								children: byMethod.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: colors[i % colors.length] }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								...chartTooltip,
								formatter: (v) => formatBRL(v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } })
						] }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "Sem dados" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: methodTrend,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "var(--color-border)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: { fontSize: 11 },
									tickFormatter: (v) => `R$${(v / 1e3).toFixed(0)}k`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									...chartTooltip,
									formatter: (v) => formatBRL(v)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
								[
									"PIX",
									"Cartão de Crédito",
									"Boleto"
								].map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: m,
									stackId: "1",
									stroke: colors[i],
									fill: colors[i],
									fillOpacity: .5
								}, m))
							]
						}) })
					})]
				})
			})
		]
	});
}
function PtAnalyticsPanel() {
	const { scopeId, scopeKey, ready } = useScopeFilter();
	const { data: payments = [] } = useQuery({
		queryKey: ["pt-analytics-payments", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("pt_payments").select("amount,status,payment_date,reference_month,pt_plan_id,pt_student_id,pt_plans(name)").is("deleted_at", null);
			if (scopeId) q = q.eq("user_id", scopeId);
			return (await q).data ?? [];
		}
	});
	const { data: sessions = [] } = useQuery({
		queryKey: ["pt-analytics-sessions", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("pt_sessions").select("session_date,status,pt_student_id");
			if (scopeId) q = q.eq("user_id", scopeId);
			return (await q).data ?? [];
		}
	});
	const { data: students = [] } = useQuery({
		queryKey: ["pt-analytics-students", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("pt_students").select("id,name,status,created_at").is("deleted_at", null);
			if (scopeId) q = q.eq("user_id", scopeId);
			return (await q).data ?? [];
		}
	});
	const months12 = (0, import_react.useMemo)(() => {
		const arr = [];
		for (let i = 11; i >= 0; i--) arr.push(format(startOfMonth(subMonths(/* @__PURE__ */ new Date(), i)), "yyyy-MM"));
		return arr;
	}, []);
	const revenueByMonth = (0, import_react.useMemo)(() => {
		const map = new Map(months12.map((m) => [m, 0]));
		for (const p of payments) {
			if (p.status !== "paid") continue;
			const k = p.reference_month ?? p.payment_date.slice(0, 7);
			if (map.has(k)) map.set(k, (map.get(k) ?? 0) + Number(p.amount));
		}
		return [...map.entries()].map(([k, v]) => ({
			month: formatMonthLabel(k),
			value: v
		}));
	}, [payments, months12]);
	const revenueByPlan = (0, import_react.useMemo)(() => {
		const planNames = /* @__PURE__ */ new Set();
		const byMonth = {};
		for (const m of months12) byMonth[m] = {};
		for (const p of payments) {
			if (p.status !== "paid") continue;
			const k = p.reference_month ?? p.payment_date.slice(0, 7);
			if (!byMonth[k]) continue;
			const name = p.pt_plans?.name ?? "Sem plano";
			planNames.add(name);
			byMonth[k][name] = (byMonth[k][name] ?? 0) + Number(p.amount);
		}
		return {
			data: months12.map((m) => ({
				month: formatMonthLabel(m),
				...byMonth[m]
			})),
			plans: [...planNames]
		};
	}, [payments, months12]);
	const sessionsByStatusMonth = (0, import_react.useMemo)(() => {
		return months12.map((m) => {
			const inMonth = sessions.filter((s) => s.session_date.startsWith(m));
			return {
				month: formatMonthLabel(m),
				completed: inMonth.filter((x) => x.status === "completed").length,
				cancelled: inMonth.filter((x) => x.status === "cancelled_student" || x.status === "cancelled_trainer").length,
				no_show: inMonth.filter((x) => x.status === "no_show").length
			};
		});
	}, [sessions, months12]);
	const avgAttendance = (0, import_react.useMemo)(() => {
		return months12.map((m) => {
			const inMonth = sessions.filter((s) => s.session_date.startsWith(m));
			const done = inMonth.filter((s) => s.status === "completed").length;
			return {
				month: formatMonthLabel(m),
				rate: inMonth.length ? done / inMonth.length * 100 : 0
			};
		});
	}, [sessions, months12]);
	const studentStats = (0, import_react.useMemo)(() => {
		return students.map((st) => {
			const ss = sessions.filter((s) => s.pt_student_id === st.id);
			const done = ss.filter((s) => s.status === "completed").length;
			const absent = ss.filter((s) => s.status === "no_show").length;
			const rate = ss.length ? done / ss.length * 100 : 0;
			const ltv = payments.filter((p) => p.pt_student_id === st.id && p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
			return {
				id: st.id,
				name: st.name,
				status: st.status,
				total: ss.length,
				done,
				absent,
				rate,
				ltv
			};
		});
	}, [
		students,
		sessions,
		payments
	]);
	const topAttendance = (0, import_react.useMemo)(() => [...studentStats].filter((s) => s.total >= 3).sort((a, b) => b.rate - a.rate).slice(0, 5), [studentStats]);
	const topAbsences = (0, import_react.useMemo)(() => [...studentStats].filter((s) => s.absent > 0).sort((a, b) => b.absent - a.absent).slice(0, 5), [studentStats]);
	const topLTV = (0, import_react.useMemo)(() => [...studentStats].sort((a, b) => b.ltv - a.ltv).slice(0, 10), [studentStats]);
	const activeOverTime = (0, import_react.useMemo)(() => {
		return months12.map((m) => {
			const end = `${m}-31`;
			const active = students.filter((s) => s.status === "active" && s.created_at.slice(0, 10) <= end).length;
			return {
				month: formatMonthLabel(m),
				value: active
			};
		});
	}, [students, months12]);
	const newVsChurn = (0, import_react.useMemo)(() => {
		return months12.map((m) => {
			const created = students.filter((s) => s.created_at.startsWith(m)).length;
			const churned = students.filter((s) => s.status === "churned" && s.created_at.startsWith(m)).length;
			return {
				month: formatMonthLabel(m),
				novos: created,
				perdidos: churned
			};
		});
	}, [students, months12]);
	const planColors = [
		"var(--color-chart-1)",
		"var(--color-chart-2)",
		"var(--color-chart-3)",
		"var(--color-chart-4)",
		"var(--color-chart-6)",
		"var(--color-chart-7)"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-overline mb-1 text-muted-foreground",
						children: "Personal Trainer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold tracking-tight text-foreground",
						children: "Análises PT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-caption mt-1.5 text-muted-foreground",
						children: "Receita, frequência e retenção dos alunos de personal"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Receita PT"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-3 text-sm font-semibold",
							children: "Receita mensal (12 meses)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: revenueByMonth,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											className: "stroke-border"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "month",
											tick: { fontSize: 12 }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											tick: { fontSize: 12 },
											tickFormatter: (v) => formatBRL(v),
											width: 90
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											...chartTooltip,
											formatter: (v) => formatBRL(v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "value",
											fill: "var(--color-primary)",
											radius: [
												4,
												4,
												0,
												0
											]
										})
									]
								})
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-3 text-sm font-semibold",
							children: "Receita por plano"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: revenueByPlan.data,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											className: "stroke-border"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "month",
											tick: { fontSize: 12 }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											tick: { fontSize: 12 },
											tickFormatter: (v) => formatBRL(v),
											width: 90
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											...chartTooltip,
											formatter: (v) => formatBRL(v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
										revenueByPlan.plans.map((name, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: name,
											stackId: "rev",
											fill: planColors[i % planColors.length]
										}, name))
									]
								})
							})
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Frequência"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-sm font-semibold",
								children: "Taxa média de presença"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-64",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
										data: avgAttendance,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												strokeDasharray: "3 3",
												className: "stroke-border"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "month",
												tick: { fontSize: 12 }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
												tick: { fontSize: 12 },
												tickFormatter: (v) => `${v.toFixed(0)}%`
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
												...chartTooltip,
												formatter: (v) => `${v.toFixed(1)}%`
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
												type: "monotone",
												dataKey: "rate",
												stroke: "var(--color-success)",
												strokeWidth: 2
											})
										]
									})
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-sm font-semibold",
								children: "Aulas por status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-64",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
										data: sessionsByStatusMonth,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												strokeDasharray: "3 3",
												className: "stroke-border"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "month",
												tick: { fontSize: 12 }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
												tick: { fontSize: 12 },
												allowDecimals: false
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...chartTooltip }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												dataKey: "completed",
												stackId: "s",
												name: "Realizadas",
												fill: "var(--color-success)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												dataKey: "cancelled",
												stackId: "s",
												name: "Canceladas",
												fill: "var(--color-destructive)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												dataKey: "no_show",
												stackId: "s",
												name: "Faltas",
												fill: "var(--color-warning)"
											})
										]
									})
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-sm font-semibold",
								children: "Top alunos por presença"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Aluno" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Aulas"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Taxa"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: topAttendance.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 3,
								className: "text-center text-xs text-muted-foreground",
								children: "Sem dados"
							}) }) : topAttendance.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: s.name }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right font-mono",
									children: s.total
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
									className: "text-right font-mono text-success",
									children: [s.rate.toFixed(1).replace(".", ","), "%"]
								})
							] }, s.id)) })] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5 border-destructive/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-sm font-semibold",
								children: "⚠️ Alunos com mais faltas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Aluno" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Faltas"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Taxa"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: topAbsences.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 3,
								className: "text-center text-xs text-muted-foreground",
								children: "Sem faltas registradas"
							}) }) : topAbsences.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: s.name }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right font-mono text-destructive",
									children: s.absent
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
									className: "text-right font-mono",
									children: [s.rate.toFixed(1).replace(".", ","), "%"]
								})
							] }, s.id)) })] })]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Alunos PT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-sm font-semibold",
								children: "Alunos ativos ao longo do tempo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-64",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
										data: activeOverTime,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												strokeDasharray: "3 3",
												className: "stroke-border"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "month",
												tick: { fontSize: 12 }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
												tick: { fontSize: 12 },
												allowDecimals: false
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...chartTooltip }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
												type: "monotone",
												dataKey: "value",
												stroke: "var(--color-primary)",
												strokeWidth: 2
											})
										]
									})
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-sm font-semibold",
								children: "Novos vs. perdidos"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-64",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
										data: newVsChurn,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												strokeDasharray: "3 3",
												className: "stroke-border"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "month",
												tick: { fontSize: 12 }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
												tick: { fontSize: 12 },
												allowDecimals: false
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...chartTooltip }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												dataKey: "novos",
												fill: "var(--color-success)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												dataKey: "perdidos",
												fill: "var(--color-destructive)"
											})
										]
									})
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-3 text-sm font-semibold",
							children: "Ranking de LTV"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "#" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Aluno" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Aulas realizadas"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Taxa"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "LTV"
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: topLTV.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 5,
							className: "text-center text-xs text-muted-foreground",
							children: "Sem dados"
						}) }) : topLTV.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-mono",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: s.name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right font-mono",
								children: s.done
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
								className: "text-right font-mono",
								children: [s.rate.toFixed(1).replace(".", ","), "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right font-mono font-semibold",
								children: formatBRL(s.ltv)
							})
						] }, s.id)) })] })]
					})
				]
			})
		]
	});
}
function ExpenseDialog({ open, onOpenChange, expense }) {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({});
	const { data: categories = [] } = useQuery({
		queryKey: ["expense-categories"],
		queryFn: async () => {
			const { data } = await supabase.from("expense_categories").select("*").eq("is_active", true).order("segment").order("name");
			return data ?? [];
		}
	});
	(0, import_react.useEffect)(() => {
		if (open) setForm(expense ?? {
			expense_date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
			reference_month: currentMonthKey(),
			segment: "general",
			type: "variable",
			recurrent: false,
			payment_method: "transfer"
		});
	}, [open, expense]);
	function applyCategory(catId) {
		const cat = categories.find((c) => c.id === catId);
		if (!cat) return;
		setForm((f) => ({
			...f,
			category_id: catId,
			segment: cat.segment,
			type: cat.type
		}));
	}
	async function save() {
		if (!form.description || !form.amount || !form.expense_date) return toast.error("Preencha descrição, valor e data.");
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) return;
		const payload = {
			user_id: userId,
			category_id: form.category_id ?? null,
			description: form.description,
			amount: Number(form.amount),
			expense_date: form.expense_date,
			reference_month: form.reference_month ?? currentMonthKey(),
			segment: form.segment ?? "general",
			type: form.type ?? "variable",
			recurrent: form.recurrent ?? false,
			recurrent_months: form.recurrent ? form.recurrent_months ?? null : null,
			payment_method: form.payment_method ?? "transfer",
			notes: form.notes ?? null
		};
		if (form.id) {
			const { error } = await supabase.from("expenses").update(payload).eq("id", form.id);
			if (error) return toast.error(error.message);
		} else if (form.recurrent && form.recurrent_months && form.recurrent_months > 1) {
			const [y, m] = (form.reference_month ?? currentMonthKey()).split("-").map(Number);
			for (let i = 0; i < form.recurrent_months; i++) {
				const month = (m - 1 + i) % 12 + 1;
				const refMonth = `${y + Math.floor((m - 1 + i) / 12)}-${String(month).padStart(2, "0")}`;
				await supabase.from("expenses").insert({
					...payload,
					reference_month: refMonth
				});
			}
		} else {
			const { error } = await supabase.from("expenses").insert(payload);
			if (error) return toast.error(error.message);
		}
		toast.success(form.id ? "Despesa atualizada" : "Despesa registrada");
		qc.invalidateQueries();
		onOpenChange(false);
	}
	const groupedCategories = categories.reduce((acc, c) => {
		const group = c.segment === "studio" ? "Studio" : c.segment === "pt" ? "Personal Trainer" : "Geral";
		if (!acc[group]) acc[group] = [];
		acc[group].push(c);
		return acc;
	}, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeadline, {
					icon: Wallet,
					title: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: form.id ? "Editar despesa" : "Nova despesa" }),
					description: "Categoria, valor e data da despesa."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Descrição *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.description ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									description: e.target.value
								})),
								placeholder: "Ex: Aluguel do studio, conta de energia…"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Categoria" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.category_id ?? "none",
								onValueChange: (v) => v === "none" ? setForm((f) => ({
									...f,
									category_id: null
								})) : applyCategory(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione uma categoria" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "none",
									children: "Sem categoria"
								}), Object.entries(groupedCategories).map(([group, cats]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-2 py-1 text-xs font-semibold text-muted-foreground",
									children: group
								}), cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: c.id,
									children: [
										c.icon,
										" ",
										c.name
									]
								}, c.id))] }, group))] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Valor (R$) *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.01",
									value: form.amount ?? "",
									onChange: (e) => setForm((f) => ({
										...f,
										amount: Number(e.target.value)
									}))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: form.expense_date ?? "",
									onChange: (e) => setForm((f) => ({
										...f,
										expense_date: e.target.value
									}))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mês de referência" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "month",
								value: form.reference_month ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									reference_month: e.target.value
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Segmento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.segment ?? "general",
									onValueChange: (v) => setForm((f) => ({
										...f,
										segment: v
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "general",
											children: "🏢 Geral"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "studio",
											children: "🎯 Studio"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "pt",
											children: "🏋️ Personal Trainer"
										})
									] })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tipo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.type ?? "variable",
									onValueChange: (v) => setForm((f) => ({
										...f,
										type: v
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "fixed",
										children: "🔒 Fixa"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "variable",
										children: "🔄 Variável"
									})] })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Forma de pagamento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.payment_method ?? "transfer",
								onValueChange: (v) => setForm((f) => ({
									...f,
									payment_method: v
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
									"pix",
									"credit_card",
									"debit_card",
									"bank_slip",
									"cash",
									"transfer"
								].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: m,
									children: paymentMethodLabel(m)
								}, m)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Despesa recorrente?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.recurrent ? "yes" : "no",
								onValueChange: (v) => setForm((f) => ({
									...f,
									recurrent: v === "yes"
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "no",
									children: "Não"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "yes",
									children: "Sim"
								})] })]
							})]
						}),
						form.recurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Repetir por quantos meses?" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									value: form.recurrent_months ?? "",
									onChange: (e) => setForm((f) => ({
										...f,
										recurrent_months: Number(e.target.value)
									})),
									placeholder: "Ex: 12 (para repetir por 1 ano)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"Serão criados ",
										form.recurrent_months ?? 0,
										" registros, um por mês."
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: form.notes ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									notes: e.target.value
								}))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: save,
					children: "Salvar"
				})] })
			]
		})
	});
}
var SEGMENT_LABELS = {
	general: "Geral",
	studio: "Studio",
	pt: "Personal Trainer"
};
var COLORS = [
	"var(--color-chart-1)",
	"var(--color-chart-2)",
	"var(--color-chart-3)",
	"var(--color-chart-4)",
	"var(--color-chart-6)",
	"var(--color-chart-8)",
	"var(--color-chart-7)",
	"var(--color-muted-foreground)"
];
function SortableKPICard({ id, onHide, ...props }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: setNodeRef,
		style: {
			transform: CSS.Translate.toString(transform),
			transition,
			zIndex: isDragging ? 50 : void 0,
			opacity: isDragging ? .5 : 1
		},
		className: "min-w-0 max-w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
			...props,
			onHide,
			dragHandleProps: {
				...attributes,
				...listeners
			}
		})
	});
}
function FinanceiroPage() {
	const qc = useQueryClient();
	const navigate = Route.useNavigate();
	const { tab: tabParam } = Route.useSearch();
	const { hasModule, loading: modulesLoading } = useModules();
	const tab = tabParam ?? "overview";
	const setTab = (v) => navigate({
		search: { tab: v },
		replace: true
	});
	const { scopeId, scopeKey, ready } = useScopeFilter();
	const [month, setMonth] = (0, import_react.useState)(currentMonthKey());
	const [segment, setSegment] = (0, import_react.useState)("all");
	const [expenseOpen, setExpenseOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [kpiOrder, setKpiOrder] = useLocalStorage("financeiro.kpiOrder", [
		"revenue",
		"expenses",
		"fixed",
		"variable",
		"profit",
		"margin"
	]);
	const [hiddenKpis, setHiddenKpis] = useLocalStorage("financeiro.hiddenKpis", []);
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
	function handleDragEnd(event) {
		const { active, over } = event;
		if (over && active.id !== over.id) setKpiOrder((items) => {
			return arrayMove(items, items.indexOf(active.id), items.indexOf(over.id));
		});
	}
	function toggleKpi(id) {
		setHiddenKpis((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
	}
	const [chartOrder, setChartOrder] = useLocalStorage("financeiro.chartOrder", [
		"rev-exp",
		"profit",
		"categories",
		"balance"
	]);
	const [hiddenCharts, setHiddenCharts] = useLocalStorage("financeiro.hiddenCharts", []);
	function handleChartDragEnd(event) {
		const { active, over } = event;
		if (over && active.id !== over.id) setChartOrder((items) => {
			const oldIndex = items.indexOf(active.id);
			const newIndex = items.indexOf(over.id);
			if (oldIndex < 0 || newIndex < 0) return items;
			return arrayMove(items, oldIndex, newIndex);
		});
	}
	function toggleChart(id) {
		setHiddenCharts((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
	}
	const { data: allExpenses = [] } = useQuery({
		queryKey: ["expenses-all", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let all = [];
			let from = 0;
			let pages = 0;
			while (pages < 20) {
				pages++;
				let q = supabase.from("expenses").select("*,expense_categories(name,icon,color,segment,type)").order("expense_date", { ascending: false }).range(from, from + 999);
				if (scopeId) q = q.eq("user_id", scopeId);
				const { data, error } = await q;
				if (error) throw error;
				all = all.concat(data ?? []);
				if (!data || data.length < 1e3) break;
				from += 1e3;
			}
			return all;
		}
	});
	const { data: allPayments = [] } = useQuery({
		queryKey: ["payments-financeiro", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let all = [];
			let from = 0;
			let pages = 0;
			while (pages < 20) {
				pages++;
				let q = supabase.from("payments").select("amount,reference_month,status").is("deleted_at", null).eq("status", "paid").range(from, from + 999);
				if (scopeId) q = q.eq("user_id", scopeId);
				const { data, error } = await q;
				if (error) throw error;
				all = all.concat(data ?? []);
				if (!data || data.length < 1e3) break;
				from += 1e3;
			}
			return all;
		}
	});
	const { data: allPtPayments = [] } = useQuery({
		queryKey: ["pt-payments-financeiro", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let all = [];
			let from = 0;
			let pages = 0;
			while (pages < 20) {
				pages++;
				let q = supabase.from("pt_payments").select("amount,reference_month,status").eq("status", "paid").is("deleted_at", null).range(from, from + 999);
				if (scopeId) q = q.eq("user_id", scopeId);
				const { data, error } = await q;
				if (error) throw error;
				all = all.concat(data ?? []);
				if (!data || data.length < 1e3) break;
				from += 1e3;
			}
			return all;
		}
	});
	const monthExpenses = (0, import_react.useMemo)(() => allExpenses.filter((e) => {
		if (e.reference_month !== month) return false;
		if (segment !== "all" && e.segment !== segment) return false;
		return true;
	}), [
		allExpenses,
		month,
		segment
	]);
	const monthRevenue = (0, import_react.useMemo)(() => {
		const studio = allPayments.filter((p) => p.reference_month === month).reduce((s, p) => s + Number(p.amount), 0);
		const pt = allPtPayments.filter((p) => p.reference_month === month).reduce((s, p) => s + Number(p.amount), 0);
		return {
			studio,
			pt,
			total: studio + pt
		};
	}, [
		allPayments,
		allPtPayments,
		month
	]);
	const kpis = (0, import_react.useMemo)(() => {
		const totalExpenses = monthExpenses.reduce((s, e) => s + Number(e.amount), 0);
		const fixedExpenses = monthExpenses.filter((e) => e.type === "fixed").reduce((s, e) => s + Number(e.amount), 0);
		const variableExpenses = monthExpenses.filter((e) => e.type === "variable").reduce((s, e) => s + Number(e.amount), 0);
		const revenue = segment === "pt" ? monthRevenue.pt : segment === "studio" ? monthRevenue.studio : monthRevenue.total;
		const profit = revenue - totalExpenses;
		return {
			revenue,
			totalExpenses,
			fixedExpenses,
			variableExpenses,
			profit,
			margin: revenue > 0 ? profit / revenue * 100 : 0
		};
	}, [
		monthExpenses,
		monthRevenue,
		segment
	]);
	const monthlySeries = (0, import_react.useMemo)(() => {
		return Array.from({ length: 12 }, (_, i) => {
			const m = addMonths$1(month, i - 11);
			const revenue = (segment === "pt" ? allPtPayments : segment === "studio" ? allPayments : [...allPayments, ...allPtPayments]).filter((p) => p.reference_month === m).reduce((s, p) => s + Number(p.amount), 0);
			const expenses = allExpenses.filter((e) => e.reference_month === m && (segment === "all" || e.segment === segment)).reduce((s, e) => s + Number(e.amount), 0);
			return {
				label: formatMonthLabel(m),
				receita: revenue,
				despesas: expenses,
				lucro: revenue - expenses
			};
		});
	}, [
		month,
		allPayments,
		allPtPayments,
		allExpenses,
		segment
	]);
	const byCategory = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const e of monthExpenses) {
			const key = e.category_id ?? "sem-categoria";
			const cur = map.get(key) ?? {
				name: e.expense_categories?.name ?? "Sem categoria",
				icon: e.expense_categories?.icon ?? "📦",
				color: e.expense_categories?.color ?? "var(--color-muted-foreground)",
				total: 0
			};
			cur.total += Number(e.amount);
			map.set(key, cur);
		}
		return [...map.values()].sort((a, b) => b.total - a.total);
	}, [monthExpenses]);
	const dreData = (0, import_react.useMemo)(() => {
		return Array.from({ length: 12 }, (_, i) => {
			const m = addMonths$1(month, i - 11);
			const studioRev = allPayments.filter((p) => p.reference_month === m).reduce((s, p) => s + Number(p.amount), 0);
			const ptRev = allPtPayments.filter((p) => p.reference_month === m).reduce((s, p) => s + Number(p.amount), 0);
			const totalRev = studioRev + ptRev;
			const fixedExp = allExpenses.filter((e) => e.reference_month === m && e.type === "fixed").reduce((s, e) => s + Number(e.amount), 0);
			const varExp = allExpenses.filter((e) => e.reference_month === m && e.type === "variable").reduce((s, e) => s + Number(e.amount), 0);
			const totalExp = fixedExp + varExp;
			const profit = totalRev - totalExp;
			const margin = totalRev > 0 ? profit / totalRev * 100 : 0;
			return {
				month: m,
				label: formatMonthLabel(m),
				studioRev,
				ptRev,
				totalRev,
				fixedExp,
				varExp,
				totalExp,
				profit,
				margin
			};
		}).reverse();
	}, [
		month,
		allPayments,
		allPtPayments,
		allExpenses
	]);
	async function remove(id) {
		if (!await confirmDialog("Excluir esta despesa?")) return;
		const { error } = await supabase.from("expenses").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Despesa excluída");
		qc.invalidateQueries({ queryKey: ["expenses-all", scopeKey] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 max-w-full space-y-6 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				icon: Wallet,
				eyebrow: "Gestão",
				title: "Financeiro",
				description: "Balanço completo de receitas e despesas",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full min-w-0 flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full sm:w-auto min-w-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthYearPicker, {
								value: month,
								onChange: setMonth
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: segment,
								onValueChange: setSegment,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-11 w-full sm:h-10 sm:w-[200px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "🏢 Todos os segmentos"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "studio",
										children: "🎯 Studio"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "pt",
										children: "🏋️ Personal Trainer"
									})
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "h-11 w-full sm:h-10 sm:w-auto",
								onClick: () => {
									setEditing(null);
									setExpenseOpen(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Nova despesa"]
							})]
						}),
						hiddenKpis.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-2 sm:border-l sm:border-t-0 sm:pl-2 sm:pt-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-muted-foreground",
								children: "Ocultos:"
							}), hiddenKpis.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								size: "sm",
								className: "h-7 gap-1 px-2 text-[10px]",
								onClick: () => toggleKpi(id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" }), id === "revenue" ? "Receita" : id === "expenses" ? "Despesas" : id === "fixed" ? "Fixas" : id === "variable" ? "Variáveis" : id === "profit" ? "Lucro" : "Margem"]
							}, id))]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndContext, {
				sensors,
				collisionDetection: closestCenter,
				onDragEnd: handleDragEnd,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
					items: kpiOrder,
					strategy: verticalListSortingStrategy,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-6 min-w-0 max-w-full",
						children: kpiOrder.map((id) => {
							if (hiddenKpis.includes(id)) return null;
							if (id === "revenue") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableKPICard, {
								id,
								label: "Receita",
								value: formatBRL(kpis.revenue),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }),
								hint: segment === "all" ? "Studio + PT" : SEGMENT_LABELS[segment],
								onHide: () => toggleKpi(id)
							}, id);
							if (id === "expenses") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableKPICard, {
								id,
								label: "Despesas totais",
								value: formatBRL(kpis.totalExpenses),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-4 w-4" }),
								onHide: () => toggleKpi(id)
							}, id);
							if (id === "fixed") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableKPICard, {
								id,
								label: "Despesas fixas",
								value: formatBRL(kpis.fixedExpenses),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }),
								onHide: () => toggleKpi(id)
							}, id);
							if (id === "variable") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableKPICard, {
								id,
								label: "Despesas variáveis",
								value: formatBRL(kpis.variableExpenses),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }),
								onHide: () => toggleKpi(id)
							}, id);
							if (id === "profit") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableKPICard, {
								id,
								label: kpis.profit >= 0 ? "✅ Lucro líquido" : "❌ Prejuízo",
								value: formatBRL(Math.abs(kpis.profit)),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-4 w-4" }),
								hint: `Margem: ${kpis.margin.toFixed(1)}%`,
								onHide: () => toggleKpi(id)
							}, id);
							if (id === "margin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableKPICard, {
								id,
								label: "Margem",
								value: `${kpis.margin.toFixed(1)}%`,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "h-4 w-4" }),
								hint: kpis.margin >= 0 ? "Positiva" : "Negativa",
								onHide: () => toggleKpi(id)
							}, id);
							return null;
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: tab,
				onValueChange: setTab,
				className: "min-w-0 max-w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full max-w-full overflow-x-auto pb-1 [touch-action:pan-x] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
							className: "h-auto w-max gap-1 rounded-xl border border-border/60 bg-muted/40 p-1",
							children: [
								{
									v: "overview",
									label: "Visão Geral",
									short: "Visão",
									icon: Wallet
								},
								{
									v: "expenses",
									label: "Despesas",
									short: "Despesas",
									icon: Receipt
								},
								{
									v: "dre",
									label: "DRE",
									short: "DRE",
									icon: FileSpreadsheet
								},
								{
									v: "cashflow",
									label: "Fluxo de Caixa",
									short: "Fluxo",
									icon: Activity
								},
								...!modulesLoading && hasModule("studio") ? [{
									v: "studio",
									label: "Análise Studio",
									short: "Studio",
									icon: ChartColumn
								}] : [],
								...!modulesLoading && hasModule("pt") ? [{
									v: "pt",
									label: "Análise PT",
									short: "PT",
									icon: Dumbbell
								}] : []
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: t.v,
								className: "gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, { className: "h-4 w-4 shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: t.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sm:hidden",
										children: t.short
									})
								]
							}, t.v))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "overview",
						children: (() => {
							const chartLabels = {
								"rev-exp": "Receita vs Despesas",
								profit: "Lucro líquido",
								categories: "Despesas por categoria",
								balance: "Balanço do mês"
							};
							const renderChart = (id) => {
								if (id === "rev-exp") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableChartCard, {
									id,
									title: "Receita vs Despesas (12 meses)",
									onHide: () => toggleChart(id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-72",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
											width: "100%",
											height: "100%",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
												data: monthlySeries,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { strokeDasharray: "3 3" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, { dataKey: "label" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tickFormatter: (v) => `R$${(v / 1e3).toFixed(0)}k` }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
														...chartTooltip,
														formatter: (v) => formatBRL(v)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
														dataKey: "receita",
														fill: "var(--color-state-paid)",
														name: "Receita"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
														dataKey: "despesas",
														fill: "var(--color-state-late)",
														name: "Despesas"
													})
												]
											})
										})
									})
								}, id);
								if (id === "profit") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableChartCard, {
									id,
									title: "Lucro líquido (12 meses)",
									onHide: () => toggleChart(id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-72",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
											width: "100%",
											height: "100%",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
												data: monthlySeries,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { strokeDasharray: "3 3" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, { dataKey: "label" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tickFormatter: (v) => `R$${(v / 1e3).toFixed(0)}k` }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
														...chartTooltip,
														formatter: (v) => formatBRL(v)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
														type: "monotone",
														dataKey: "lucro",
														stroke: "var(--color-chart-1)",
														strokeWidth: 2,
														name: "Lucro"
													})
												]
											})
										})
									})
								}, id);
								if (id === "categories") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableChartCard, {
									id,
									title: `Despesas por categoria — ${formatMonthLabel(month)}`,
									onHide: () => toggleChart(id),
									children: byCategory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "Sem despesas neste mês" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-4 md:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-64",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
												width: "100%",
												height: "100%",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
													data: byCategory,
													dataKey: "total",
													nameKey: "name",
													innerRadius: 50,
													outerRadius: 90,
													children: byCategory.map((_c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
													...chartTooltip,
													formatter: (v) => formatBRL(v)
												})] })
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: byCategory.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between rounded-md border p-2 text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.name })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-medium",
													children: formatBRL(c.total)
												})]
											}, i))
										})]
									})
								}, id);
								if (id === "balance") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableChartCard, {
									id,
									title: `Balanço do mês — ${formatMonthLabel(month)}`,
									onHide: () => toggleChart(id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1 text-sm",
										children: [[
											{
												label: "Receita Studio",
												value: monthRevenue.studio,
												color: "text-state-paid"
											},
											{
												label: "Receita PT",
												value: monthRevenue.pt,
												color: "text-state-paid"
											},
											{
												label: "Total receita",
												value: monthRevenue.total,
												color: "text-state-paid",
												bold: true
											},
											{
												label: "Despesas fixas",
												value: -kpis.fixedExpenses,
												color: "text-destructive"
											},
											{
												label: "Despesas variáveis",
												value: -kpis.variableExpenses,
												color: "text-destructive"
											},
											{
												label: "Total despesas",
												value: -kpis.totalExpenses,
												color: "text-state-late",
												bold: true
											},
											{
												label: "Lucro líquido",
												value: kpis.profit,
												color: kpis.profit >= 0 ? "text-state-paid" : "text-destructive",
												bold: true,
												separator: true
											}
										].map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [row.separator && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `font-mono ${row.color} ${row.bold ? "font-semibold" : ""}`,
												children: formatBRL(Math.abs(row.value))
											})]
										})] }, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 border-t pt-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium",
													children: "Margem líquida"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: `font-mono font-semibold ${kpis.margin >= 0 ? "text-state-paid" : "text-destructive"}`,
													children: [kpis.margin.toFixed(1), "%"]
												})]
											})
										})]
									})
								}, id);
								return null;
							};
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HiddenChartChips, {
									hidden: hiddenCharts,
									labels: chartLabels,
									onRestore: toggleChart
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndContext, {
									sensors,
									collisionDetection: closestCenter,
									onDragEnd: handleChartDragEnd,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
										items: chartOrder,
										strategy: rectSortingStrategy,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
											children: chartOrder.filter((id) => !hiddenCharts.includes(id)).map(renderChart)
										})
									})
								})]
							});
						})()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "expenses",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-3.5 sm:p-5 min-w-0 max-w-full overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-sm font-semibold",
									children: [
										"Despesas — ",
										formatMonthLabel(month),
										segment !== "all" && ` · ${SEGMENT_LABELS[segment]}`
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => {
										setEditing(null);
										setExpenseOpen(true);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Nova despesa"]
								})]
							}), monthExpenses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" }),
								title: "Nenhuma despesa neste mês",
								description: "Registre suas despesas para acompanhar o balanço.",
								action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setExpenseOpen(true),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Registrar despesa"]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full max-w-full overflow-x-auto [touch-action:pan-x]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Descrição" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Categoria" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Segmento" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tipo" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "text-right",
										children: "Valor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [monthExpenses.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "font-medium",
										children: e.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: e.expense_categories ? `${e.expense_categories.icon ?? "📦"} ${e.expense_categories.name}` : "—" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: SEGMENT_LABELS[e.segment] ?? e.segment }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs",
										children: e.type === "fixed" ? "🔒 Fixa" : "🔄 Variável"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDateBR(e.expense_date) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right font-mono",
										children: formatBRL(e.amount)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-end gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => {
												setEditing(e);
												setExpenseOpen(true);
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => remove(e.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
										})]
									}) })
								] }, e.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										colSpan: 5,
										className: "font-semibold",
										children: "Total despesas do mês"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right font-mono font-semibold",
										children: formatBRL(kpis.totalExpenses)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {})
								] })] })] })
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "dre",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-3.5 sm:p-5 min-w-0 max-w-full overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex flex-wrap items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold",
									children: "DRE — Demonstrativo de Resultado (últimos 12 meses)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Visão contábil detalhada de receitas, despesas e margens operacionais."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "h-8 gap-1.5 text-xs",
										onClick: async () => {
											try {
												await exportDreToExcel(dreData);
												toast.success("DRE exportado em Excel (.xlsx) com sucesso!");
											} catch (err) {
												toast.error("Erro ao exportar Excel: " + err.message);
											}
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" }), "Exportar Excel"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "h-8 gap-1.5 text-xs",
										onClick: async () => {
											try {
												await exportDreToPdf(dreData);
												toast.success("DRE exportado em PDF com sucesso!");
											} catch (err) {
												toast.error("Erro ao exportar PDF: " + err.message);
											}
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-blue-600 dark:text-blue-400" }), "Exportar PDF"]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full max-w-full overflow-x-auto [touch-action:pan-x]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Mês" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "text-right",
										children: "Rec. Studio"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "text-right",
										children: "Rec. PT"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "text-right",
										children: "Total Receita"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "text-right",
										children: "Desp. Fixas"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "text-right",
										children: "Desp. Variáveis"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "text-right",
										children: "Total Despesas"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "text-right",
										children: "Lucro"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "text-right",
										children: "Margem"
									})
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: dreData.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "font-medium",
										children: row.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right font-mono",
										children: formatBRL(row.studioRev)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right font-mono",
										children: formatBRL(row.ptRev)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right font-mono",
										children: formatBRL(row.totalRev)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right font-mono",
										children: formatBRL(row.fixedExp)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right font-mono",
										children: formatBRL(row.varExp)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right font-mono",
										children: formatBRL(row.totalExp)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: `text-right font-mono ${row.profit >= 0 ? "text-state-paid" : "text-destructive"}`,
										children: formatBRL(row.profit)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
										className: `text-right font-mono ${row.margin >= 0 ? "text-state-paid" : "text-destructive"}`,
										children: [row.margin.toFixed(1), "%"]
									})
								] }, row.month)) })] })
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "cashflow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-3.5 sm:p-5 min-w-0 max-w-full overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-3 text-sm font-semibold",
									children: "Fluxo de Caixa (últimos 12 meses)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-72",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
										width: "100%",
										height: "100%",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
											data: monthlySeries,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { strokeDasharray: "3 3" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, { dataKey: "label" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tickFormatter: (v) => `R$${(v / 1e3).toFixed(0)}k` }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
													...chartTooltip,
													formatter: (v) => formatBRL(v)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
													dataKey: "receita",
													fill: "var(--color-state-paid)",
													name: "Entradas"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
													dataKey: "despesas",
													fill: "var(--color-state-late)",
													name: "Saídas"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
													dataKey: "lucro",
													fill: "var(--color-chart-1)",
													name: "Saldo"
												})
											]
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 w-full max-w-full overflow-x-auto [touch-action:pan-x]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Mês" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right",
											children: "Entradas"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right",
											children: "Saídas"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right",
											children: "Saldo do mês"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right",
											children: "Saldo acumulado"
										})
									] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: (() => {
										let accumulated = 0;
										return [...dreData].reverse().map((row) => {
											accumulated += row.profit;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "font-medium",
													children: row.label
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-right font-mono",
													children: formatBRL(row.totalRev)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-right font-mono",
													children: formatBRL(row.totalExp)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: `text-right font-mono ${row.profit >= 0 ? "text-state-paid" : "text-destructive"}`,
													children: formatBRL(row.profit)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: `text-right font-mono ${accumulated >= 0 ? "text-state-paid" : "text-destructive"}`,
													children: formatBRL(accumulated)
												})
											] }, row.month);
										});
									})() })] })
								})
							]
						})
					}),
					!modulesLoading && hasModule("studio") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "studio",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioAnalyticsPanel, {})
					}),
					!modulesLoading && hasModule("pt") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "pt",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PtAnalyticsPanel, {})
					}),
					modulesLoading && (tab === "studio" || tab === "pt") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-56" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 rounded-xl" })]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpenseDialog, {
				open: expenseOpen,
				onOpenChange: setExpenseOpen,
				expense: editing
			})
		]
	});
}
//#endregion
export { FinanceiroPage as component };
