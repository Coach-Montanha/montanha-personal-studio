import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { B as RotateCw, G as Plus, Lt as FileText, R as Search, Xt as CreditCard, Z as Pencil, _t as LoaderCircle, b as Trash2, hn as Check, n as X } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { t as PageHeader } from "./PageHeader-CRue-aiN.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DEnZ0u5J.mjs";
import { t as EmptyState } from "./EmptyState-DK3vCNbs.mjs";
import { a as formatDateBR, i as formatBRL, o as formatMonthLabel, r as currentMonthKey, t as addMonths$1 } from "./format-BT-nao3-.mjs";
import { a as TooltipTrigger, n as TooltipContent, r as TooltipProvider, t as Tooltip } from "./tooltip-CJZST3UV.mjs";
import { n as PlanBadge, t as PaymentStatusBadge } from "./Badges-BwuNwA-M.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useScopeFilter } from "./use-scope-filter-q5Imal9c.mjs";
import { t as MonthYearPicker } from "./MonthYearPicker-BRYGdsSp.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-BymSQoye.mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { t as Checkbox } from "./checkbox-kt6FvQcE.mjs";
import { n as renewPayment, r as renewPtPayment, t as downloadReceiptPdf } from "./receipt-pdf-NiEaxcs2.mjs";
import { n as usePaymentMethods } from "./use-payment-methods-Ch_8GI_2.mjs";
import { t as PaymentDialog } from "./PaymentDialog-DLBzOv9b.mjs";
import { t as PTPaymentDialog } from "./PTPaymentDialog-EiiOhpI7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-BCOE_bLA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_OPTIONS = [
	{
		value: "paid",
		label: "Pago"
	},
	{
		value: "pending",
		label: "Pendente"
	},
	{
		value: "overdue",
		label: "Atrasado"
	},
	{
		value: "cancelled",
		label: "Cancelado"
	}
];
function BulkPaymentEditBar({ selectedIds, onClear }) {
	const qc = useQueryClient();
	const { methods } = usePaymentMethods({ activeOnly: true });
	const [method, setMethod] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [planOpen, setPlanOpen] = (0, import_react.useState)(false);
	const [planId, setPlanId] = (0, import_react.useState)("");
	const { data: plans = [] } = useQuery({
		queryKey: ["plans-active"],
		queryFn: async () => {
			const { data } = await supabase.from("plans").select("id,name,price").eq("is_active", true).order("name");
			return data ?? [];
		}
	});
	const count = selectedIds.length;
	if (count === 0) return null;
	async function applyUpdate(patch, kind) {
		setBusy(kind);
		const { error } = await supabase.from("payments").update(patch).in("id", selectedIds);
		setBusy(null);
		if (error) return toast.error(error.message);
		toast.success(`${count} pagamento(s) atualizado(s).`);
		qc.invalidateQueries();
		onClear();
	}
	async function bulkDelete() {
		if (!await confirmDialog(`Excluir ${count} pagamento(s)? Esta ação não pode ser desfeita.`)) return;
		setBusy("delete");
		const { error } = await supabase.from("payments").delete().in("id", selectedIds);
		setBusy(null);
		if (error) return toast.error(error.message);
		toast.success(`${count} pagamento(s) excluído(s).`);
		qc.invalidateQueries();
		onClear();
	}
	async function applyPlan() {
		if (!planId) return;
		setBusy("plan");
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) {
			setBusy(null);
			return;
		}
		const { error: updErr } = await supabase.from("payments").update({ plan_id: planId }).in("id", selectedIds);
		if (updErr) {
			setBusy(null);
			return toast.error(updErr.message);
		}
		const { data: pays, error: payErr } = await supabase.from("payments").select("student_id, payment_date").in("id", selectedIds).order("payment_date", { ascending: false });
		if (payErr) {
			setBusy(null);
			return toast.error(payErr.message);
		}
		const latestByStudent = /* @__PURE__ */ new Map();
		for (const p of pays ?? []) if (!latestByStudent.has(p.student_id)) latestByStudent.set(p.student_id, p.payment_date);
		let ok = 0;
		const errs = [];
		for (const [sid, startDate] of latestByStudent) {
			await supabase.from("student_plan_history").update({
				end_date: startDate,
				is_current: false
			}).eq("student_id", sid).eq("is_current", true);
			const { error } = await supabase.from("student_plan_history").insert({
				user_id: userId,
				student_id: sid,
				plan_id: planId,
				start_date: startDate,
				is_current: true
			});
			if (error) errs.push(error.message);
			else ok++;
		}
		setBusy(null);
		setPlanOpen(false);
		setPlanId("");
		qc.invalidateQueries();
		toast.success(`Plano vinculado a ${count} pagamento(s)` + (ok ? ` e ${ok} aluno(s) atualizados` : ""));
		if (errs.length) toast.error(`${errs.length} erro(s) ao atualizar histórico`);
		onClear();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sticky bottom-3 z-20 mx-auto flex w-full max-w-3xl flex-col gap-2 rounded-xl border bg-card p-3 shadow-lg ring-1 ring-primary/10 sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-primary px-2 text-xs font-semibold text-primary-foreground",
					children: count
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium",
					children: "selecionado(s)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "h-8 w-8",
					onClick: onClear,
					"aria-label": "Limpar seleção",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: method,
					onValueChange: (v) => {
						setMethod(v);
						applyUpdate({ payment_method: v }, "method");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "h-9 w-[180px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Alterar forma…" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: methods.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: m.key,
						children: m.label
					}, m.key)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: status,
					onValueChange: (v) => {
						setStatus(v);
						applyUpdate({ status: v }, "status");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "h-9 w-[160px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Alterar status…" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUS_OPTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: s.value,
						children: s.label
					}, s.value)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "sm",
					className: "h-9",
					onClick: () => setPlanOpen(true),
					disabled: busy !== null,
					children: "Alterar plano"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "destructive",
					size: "sm",
					className: "h-9",
					onClick: bulkDelete,
					disabled: busy !== null,
					children: [busy === "delete" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), "Excluir"]
				}),
				busy && busy !== "delete" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), " aplicando…"]
				}),
				!busy && (method || status) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 text-xs text-state-paid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " aplicado"]
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open: planOpen,
		onOpenChange: setPlanOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Alterar plano em massa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
				"Isso encerrará o plano atual dos alunos vinculados aos ",
				count,
				" pagamento(s) selecionado(s) e iniciará o novo plano a partir de hoje."
			] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: planId,
					onValueChange: setPlanId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione um plano" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: plans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: p.id,
						children: [
							p.name,
							" — ",
							formatBRL(Number(p.price))
						]
					}, p.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: applyPlan,
				disabled: !planId || busy === "plan",
				children: busy === "plan" ? "Aplicando…" : "Aplicar"
			})] })
		] })
	})] });
}
function PaymentsPage() {
	const qc = useQueryClient();
	const { scopeId, scopeKey, ready } = useScopeFilter();
	const [kind, setKind] = (0, import_react.useState)("studio");
	const [month, setMonth] = (0, import_react.useState)(currentMonthKey());
	const [allMonths, setAllMonths] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [studioOpen, setStudioOpen] = (0, import_react.useState)(false);
	const [ptOpen, setPtOpen] = (0, import_react.useState)(false);
	const [editingStudio, setEditingStudio] = (0, import_react.useState)(null);
	const [editingPt, setEditingPt] = (0, import_react.useState)(null);
	const [useRange, setUseRange] = (0, import_react.useState)(false);
	const [rangeStart, setRangeStart] = (0, import_react.useState)("");
	const [rangeEnd, setRangeEnd] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const { methods: availableMethods, labelFor: pmLabel } = usePaymentMethods({ activeOnly: true });
	const [sortBy, setSortBy] = (0, import_react.useState)("payment_date_desc");
	const [renewingId, setRenewingId] = (0, import_react.useState)(null);
	async function renewRow(r) {
		setRenewingId(r.id);
		try {
			if (r.kind === "studio" ? await renewPayment({
				id: r.original.id,
				student_id: r.original.student_id,
				plan_id: r.original.plan_id,
				amount: Number(r.original.amount),
				payment_date: r.original.payment_date,
				reference_month: r.original.reference_month,
				payment_method: r.original.payment_method,
				notes: r.original.notes ?? null,
				renewals_remaining: r.original.renewals_remaining,
				plans: r.original.plans
			}) : await renewPtPayment({
				id: r.original.id,
				pt_student_id: r.original.pt_student_id,
				pt_plan_id: r.original.pt_plan_id,
				amount: Number(r.original.amount),
				payment_date: r.original.payment_date,
				reference_month: r.original.reference_month,
				payment_method: r.original.payment_method,
				notes: r.original.notes ?? null,
				sessions_paid: r.original.sessions_paid ?? null
			})) {
				qc.invalidateQueries({ queryKey: ["payments-studio"] });
				qc.invalidateQueries({ queryKey: ["payments-pt"] });
			}
		} finally {
			setRenewingId(null);
		}
	}
	async function handleGenerateReceipt(r) {
		if (r.status !== "paid") {
			toast.error("Recibos só podem ser emitidos para pagamentos quitados.");
			return;
		}
		try {
			const studentInfo = r.original.students || r.original.pt_students || {};
			await downloadReceiptPdf({
				receiptId: r.id,
				studentName: r.student_name,
				studentEmail: studentInfo.email,
				studentPhone: studentInfo.phone,
				studentCpf: studentInfo.cpf,
				amount: r.amount,
				paymentDate: r.payment_date,
				dueDate: r.due_date,
				referenceMonth: r.reference_month,
				paymentMethod: r.payment_method,
				planName: r.plan_name,
				notes: r.original.notes,
				kind: r.kind
			});
			toast.success("Recibo gerado com sucesso!");
		} catch (err) {
			toast.error("Erro ao gerar recibo: " + err.message);
		}
	}
	const queryPeriodKey = allMonths ? "all" : useRange ? `range_${rangeStart}_${rangeEnd}` : month;
	const { data: studioRows = [], isLoading: loadingStudio } = useQuery({
		queryKey: [
			"payments-studio",
			scopeKey,
			queryPeriodKey
		],
		enabled: ready && (kind === "studio" || kind === "all"),
		queryFn: async () => {
			let all = [];
			let from = 0;
			const PAGE = 1e3;
			while (true) {
				let q = supabase.from("payments").select("id,amount,payment_date,due_date,reference_month,payment_method,status,student_id,plan_id,notes,renewals_remaining,students(name,email,phone,cpf),plans(name,billing_cycle,max_renewals)").is("deleted_at", null).order("payment_date", { ascending: false });
				if (!allMonths) if (useRange) {
					if (rangeStart) q = q.gte("payment_date", rangeStart);
					if (rangeEnd) q = q.lte("payment_date", rangeEnd);
				} else q = q.eq("reference_month", month);
				if (scopeId) q = q.eq("user_id", scopeId);
				const { data, error } = await q.range(from, from + PAGE - 1);
				if (error) throw error;
				all = all.concat(data ?? []);
				if (!data || data.length < PAGE) break;
				from += PAGE;
			}
			return all.map((p) => ({
				id: p.id,
				kind: "studio",
				amount: Number(p.amount),
				payment_date: p.payment_date,
				due_date: p.due_date,
				reference_month: p.reference_month,
				payment_method: p.payment_method,
				status: p.status,
				student_name: p.students?.name ?? "—",
				plan_name: p.plans?.name ?? null,
				original: p
			}));
		}
	});
	const { data: ptRows = [], isLoading: loadingPt } = useQuery({
		queryKey: [
			"payments-pt",
			scopeKey,
			queryPeriodKey
		],
		enabled: ready && (kind === "pt" || kind === "all"),
		queryFn: async () => {
			let all = [];
			let from = 0;
			const PAGE = 1e3;
			while (true) {
				let q = supabase.from("pt_payments").select("id,amount,payment_date,due_date,reference_month,payment_method,status,pt_student_id,pt_plan_id,notes,sessions_paid,pt_students(name,email,phone),pt_plans(name)").is("deleted_at", null).order("payment_date", { ascending: false });
				if (!allMonths) if (useRange) {
					if (rangeStart) q = q.gte("payment_date", rangeStart);
					if (rangeEnd) q = q.lte("payment_date", rangeEnd);
				} else q = q.or(`reference_month.eq.${month},reference_month.is.null`);
				if (scopeId) q = q.eq("user_id", scopeId);
				const { data, error } = await q.range(from, from + PAGE - 1);
				if (error) throw error;
				all = all.concat(data ?? []);
				if (!data || data.length < PAGE) break;
				from += PAGE;
			}
			return all.map((p) => ({
				id: p.id,
				kind: "pt",
				amount: Number(p.amount),
				payment_date: p.payment_date,
				due_date: p.due_date,
				reference_month: p.reference_month ?? p.payment_date.slice(0, 7),
				payment_method: p.payment_method,
				status: p.status,
				student_name: p.pt_students?.name ?? "—",
				plan_name: p.pt_plans?.name ?? null,
				original: p
			}));
		}
	});
	const payments = (0, import_react.useMemo)(() => {
		if (kind === "studio") return studioRows;
		if (kind === "pt") return ptRows;
		return [...studioRows, ...ptRows].sort((a, b) => a.payment_date < b.payment_date ? 1 : -1);
	}, [
		kind,
		studioRows,
		ptRows
	]);
	const isLoading = kind === "studio" && loadingStudio || kind === "pt" && loadingPt || kind === "all" && (loadingStudio || loadingPt);
	(0, import_react.useEffect)(() => {
		setSelected(/* @__PURE__ */ new Set());
	}, [kind]);
	const [page, setPage] = (0, import_react.useState)(0);
	const PER_PAGE = 50;
	const rows = (0, import_react.useMemo)(() => {
		const q = search.toLowerCase();
		const filtered = payments.filter((p) => {
			if (useRange) {
				if (rangeStart && p.payment_date < rangeStart) return false;
				if (rangeEnd && p.payment_date > rangeEnd) return false;
			} else if (!allMonths && p.reference_month !== month) return false;
			if (method !== "all" && p.payment_method !== method) return false;
			if (status !== "all" && p.status !== status) return false;
			if (q && !p.student_name.toLowerCase().includes(q)) return false;
			return true;
		});
		const statusOrder = {
			overdue: 0,
			pending: 1,
			paid: 2,
			cancelled: 3
		};
		const sorted = [...filtered];
		sorted.sort((a, b) => {
			switch (sortBy) {
				case "payment_date_asc": return a.payment_date < b.payment_date ? -1 : a.payment_date > b.payment_date ? 1 : 0;
				case "payment_date_desc": return a.payment_date < b.payment_date ? 1 : a.payment_date > b.payment_date ? -1 : 0;
				case "due_date_asc": {
					const ad = a.due_date ?? "9999-12-31";
					const bd = b.due_date ?? "9999-12-31";
					return ad < bd ? -1 : ad > bd ? 1 : 0;
				}
				case "due_date_desc": {
					const ad = a.due_date ?? "0000-01-01";
					const bd = b.due_date ?? "0000-01-01";
					return ad < bd ? 1 : ad > bd ? -1 : 0;
				}
				case "amount_desc": return b.amount - a.amount;
				case "amount_asc": return a.amount - b.amount;
				case "student_asc": return a.student_name.localeCompare(b.student_name, "pt-BR");
				case "student_desc": return b.student_name.localeCompare(a.student_name, "pt-BR");
				case "status": return (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
				case "plan": return (a.plan_name ?? "").localeCompare(b.plan_name ?? "", "pt-BR");
				case "method": return a.payment_method.localeCompare(b.payment_method);
				case "reference_desc": return a.reference_month < b.reference_month ? 1 : a.reference_month > b.reference_month ? -1 : 0;
				case "reference_asc": return a.reference_month < b.reference_month ? -1 : a.reference_month > b.reference_month ? 1 : 0;
				default: return 0;
			}
		});
		return sorted;
	}, [
		payments,
		month,
		allMonths,
		useRange,
		rangeStart,
		rangeEnd,
		method,
		status,
		search,
		sortBy
	]);
	const totals = (0, import_react.useMemo)(() => {
		const paid = rows.filter((r) => r.status === "paid").reduce((s, r) => s + r.amount, 0);
		return {
			count: rows.length,
			paid
		};
	}, [rows]);
	const pageRows = rows.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
	const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
	(0, import_react.useEffect)(() => {
		setPage(0);
	}, [
		search,
		method,
		status,
		month,
		allMonths,
		useRange,
		rangeStart,
		rangeEnd,
		kind
	]);
	async function remove(r) {
		if (!await confirmDialog("Mover este pagamento para a Lixeira?")) return;
		const table = r.kind === "studio" ? "payments" : "pt_payments";
		const { error, count } = await supabase.from(table).update({ deleted_at: (/* @__PURE__ */ new Date()).toISOString() }, { count: "exact" }).eq("id", r.id).is("deleted_at", null);
		if (error) return toast.error(error.message);
		if (!count) return toast.error("Nada foi excluído (permissão negada).");
		toast.success("Pagamento movido para a Lixeira");
		qc.invalidateQueries({ queryKey: ["payments-studio"] });
		qc.invalidateQueries({ queryKey: ["payments-pt"] });
	}
	function editRow(r) {
		if (r.kind === "studio") {
			setEditingStudio(r.original);
			setStudioOpen(true);
		} else {
			setEditingPt(r.original);
			setPtOpen(true);
		}
	}
	const bulkEnabled = kind === "studio";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 200,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
					icon: CreditCard,
					eyebrow: "Gestão",
					title: "Pagamentos",
					description: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						totals.count,
						" registro(s)",
						useRange && rangeStart && rangeEnd ? ` · ${(/* @__PURE__ */ new Date(rangeStart + "T00:00")).toLocaleDateString("pt-BR")} até ${(/* @__PURE__ */ new Date(rangeEnd + "T00:00")).toLocaleDateString("pt-BR")}` : "",
						" · ",
						"Total pago: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-numeric font-medium text-foreground",
							children: formatBRL(totals.paid)
						})
					] }),
					actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex rounded-md border p-0.5",
							children: [
								"studio",
								"pt",
								"all"
							].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: kind === k ? "default" : "ghost",
								size: "sm",
								className: "h-9 rounded-sm",
								onClick: () => setKind(k),
								children: k === "studio" ? "Studio" : k === "pt" ? "PT" : "Todos"
							}, k))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							className: "h-11 sm:h-9",
							onClick: () => {
								setAllMonths(false);
								setUseRange(false);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: !allMonths && !useRange ? "text-primary" : "",
								children: "Mês"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							className: "h-11 sm:h-9",
							onClick: () => {
								setAllMonths(true);
								setUseRange(false);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: allMonths ? "text-primary" : "",
								children: "Todos"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							className: "h-11 sm:h-9",
							onClick: () => {
								setAllMonths(false);
								setUseRange(true);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: useRange ? "text-primary" : "",
								children: "Período"
							})
						}),
						!allMonths && !useRange && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthYearPicker, {
							value: month,
							onChange: setMonth
						}),
						useRange && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full items-center gap-2 sm:w-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: rangeStart,
									onChange: (e) => setRangeStart(e.target.value),
									className: "h-11 flex-1 sm:h-10 sm:w-[150px] sm:flex-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "até"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: rangeEnd,
									onChange: (e) => setRangeEnd(e.target.value),
									className: "h-11 flex-1 sm:h-10 sm:w-[150px] sm:flex-none"
								})
							]
						}),
						kind === "pt" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							"data-testid": "button-new-payment-pt",
							className: "h-11 w-full sm:h-10 sm:w-auto",
							onClick: () => {
								setEditingPt(null);
								setPtOpen(true);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Novo pagamento PT"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							"data-testid": "button-new-payment",
							className: "h-11 w-full sm:h-10 sm:w-auto",
							onClick: () => {
								setEditingStudio(null);
								setStudioOpen(true);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Novo pagamento"]
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-3 sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex-1 sm:min-w-[200px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										"data-testid": "input-search-payments",
										placeholder: "Buscar por aluno",
										className: "h-11 pl-9 sm:h-10",
										value: search,
										onChange: (e) => setSearch(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: method,
									onValueChange: setMethod,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-11 w-full sm:h-10 sm:w-[180px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "Todos métodos"
									}), (availableMethods.length > 0 ? availableMethods.map((m) => ({
										key: m.key,
										label: m.label
									})) : [
										"pix",
										"credit_card",
										"debit_card",
										"bank_slip",
										"cash",
										"transfer"
									].map((k) => ({
										key: k,
										label: pmLabel(k)
									}))).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: m.key,
										children: m.label
									}, m.key))] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: status,
									onValueChange: setStatus,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-11 w-full sm:h-10 sm:w-[160px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "all",
											children: "Todos status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "paid",
											children: "Pago"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "pending",
											children: "Pendente"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "overdue",
											children: "Atrasado"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "cancelled",
											children: "Cancelado"
										})
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: sortBy,
									onValueChange: setSortBy,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
										className: "h-11 w-full sm:h-10 sm:w-[220px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mr-1 text-xs text-muted-foreground",
											children: "Organizar por:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "payment_date_desc",
											children: "Pagamento (mais recente)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "payment_date_asc",
											children: "Pagamento (mais antigo)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "due_date_asc",
											children: "Vencimento (mais próximo)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "due_date_desc",
											children: "Vencimento (mais distante)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "reference_desc",
											children: "Mês ref. (mais recente)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "reference_asc",
											children: "Mês ref. (mais antigo)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "amount_desc",
											children: "Valor (maior)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "amount_asc",
											children: "Valor (menor)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "student_asc",
											children: "Aluno (A-Z)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "student_desc",
											children: "Aluno (Z-A)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "status",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "plan",
											children: "Plano"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "method",
											children: "Método"
										})
									] })]
								})
							]
						}),
						isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: "Carregando…"
						}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "Sem pagamentos",
							description: "Nenhum pagamento neste filtro"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2 md:hidden",
							children: pageRows.map((p) => {
								const checked = selected.has(p.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: `rounded-xl border bg-card p-3.5 shadow-card transition-ui hover:border-primary/25 hover:shadow-float ${checked ? "border-primary/40 ring-2 ring-ring/30" : "border-border"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [
											bulkEnabled && p.kind === "studio" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
												checked,
												onCheckedChange: (v) => {
													setSelected((prev) => {
														const n = new Set(prev);
														if (v) n.add(p.id);
														else n.delete(p.id);
														return n;
													});
												},
												className: "mt-1",
												"aria-label": "Selecionar pagamento"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 truncate",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "truncate font-semibold",
														children: p.student_name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindBadge, { kind: p.kind })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-1 flex flex-wrap items-center gap-1.5 text-[11px]",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentStatusBadge, { status: p.status }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanBadge, { name: p.plan_name }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "rounded bg-muted px-1.5 py-0.5 uppercase text-muted-foreground",
															children: formatMonthLabel(p.reference_month)
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-mono text-base font-semibold",
													children: formatBRL(p.amount)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[11px] text-muted-foreground",
													children: pmLabel(p.payment_method)
												})]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex items-center justify-between gap-2 border-t pt-2 text-[11px] text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Pago em ",
											formatDateBR(p.payment_date),
											" · Venc: ",
											effectiveDueDate(p)
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-0.5 rounded-md border border-border/60 bg-background/60 p-0.5",
											children: [
												p.status === "paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-10 w-10 rounded-sm text-blue-600 transition-colors duration-200 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50",
													onClick: () => handleGenerateReceipt(p),
													"aria-label": "Gerar recibo em PDF",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenewButton, {
													row: p,
													loading: renewingId === p.id,
													onClick: () => renewRow(p),
													size: "mobile"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "h-5 w-px bg-border/60",
													"aria-hidden": true
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-10 w-10 rounded-sm transition-colors duration-200 hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
													onClick: () => editRow(p),
													"aria-label": "Editar pagamento",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-10 w-10 rounded-sm transition-colors duration-200 hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
													onClick: () => remove(p),
													"aria-label": "Excluir pagamento",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
												})
											]
										})]
									})]
								}, `${p.kind}-${p.id}`);
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden overflow-x-auto md:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
								"data-testid": "table-payments",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									bulkEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "w-8",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: pageRows.length > 0 && pageRows.every((p) => selected.has(p.id)),
											onCheckedChange: (v) => {
												setSelected((prev) => {
													const n = new Set(prev);
													if (v) pageRows.forEach((p) => n.add(p.id));
													else pageRows.forEach((p) => n.delete(p.id));
													return n;
												});
											},
											"aria-label": "Selecionar todos"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Aluno" }),
									kind === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tipo" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Plano" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Mês ref." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Pagamento" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Vencimento" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Método" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "text-right",
										children: "Valor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: pageRows.map((p) => {
									const checked = selected.has(p.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
										"data-state": checked ? "selected" : void 0,
										children: [
											bulkEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
												checked,
												onCheckedChange: (v) => {
													setSelected((prev) => {
														const n = new Set(prev);
														if (v) n.add(p.id);
														else n.delete(p.id);
														return n;
													});
												},
												"aria-label": "Selecionar linha"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "font-medium",
												children: p.student_name
											}),
											kind === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindBadge, { kind: p.kind }) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanBadge, { name: p.plan_name }) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "text-xs uppercase font-mono",
												children: formatMonthLabel(p.reference_month)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "text-xs font-mono",
												children: formatDateBR(p.payment_date)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "text-xs font-mono",
												children: effectiveDueDate(p)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "text-xs",
												children: pmLabel(p.payment_method)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
												className: "text-numeric text-right font-semibold",
												children: formatBRL(p.amount)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentStatusBadge, { status: p.status }) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "ml-auto inline-flex items-center gap-0.5 rounded-md border border-border/60 bg-background/40 p-0.5",
												children: [
													p.status === "paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
														asChild: true,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															variant: "ghost",
															size: "icon",
															className: "h-8 w-8 rounded-sm text-blue-600 transition-colors duration-200 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 dark:text-blue-400 dark:hover:bg-blue-950/50",
															onClick: () => handleGenerateReceipt(p),
															"aria-label": "Gerar recibo em PDF",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Gerar Recibo em PDF" })] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenewButton, {
														row: p,
														loading: renewingId === p.id,
														onClick: () => renewRow(p)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "h-4 w-px bg-border/60",
														"aria-hidden": true
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
														asChild: true,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															variant: "ghost",
															size: "icon",
															className: "h-8 w-8 rounded-sm transition-colors duration-200 hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
															onClick: () => editRow(p),
															"aria-label": "Editar pagamento",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Editar" })] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
														asChild: true,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															variant: "ghost",
															size: "icon",
															className: "h-8 w-8 rounded-sm transition-colors duration-200 hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
															onClick: () => remove(p),
															"aria-label": "Excluir pagamento",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Excluir" })] })
												]
											}) })
										]
									}, `${p.kind}-${p.id}`);
								}) })]
							})
						})] }),
						rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground",
								children: [
									"Página ",
									page + 1,
									" de ",
									totalPages
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-11 sm:h-9",
									disabled: page === 0,
									onClick: () => setPage((p) => p - 1),
									children: "Anterior"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-11 sm:h-9",
									disabled: (page + 1) * PER_PAGE >= rows.length,
									onClick: () => setPage((p) => p + 1),
									children: "Próxima"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden",
							children: addMonths$1(month, 0)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentDialog, {
					open: studioOpen,
					onOpenChange: setStudioOpen,
					payment: editingStudio
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTPaymentDialog, {
					open: ptOpen,
					onOpenChange: setPtOpen,
					payment: editingPt
				}),
				bulkEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulkPaymentEditBar, {
					selectedIds: [...selected],
					onClear: () => setSelected(/* @__PURE__ */ new Set())
				})
			]
		})
	});
}
function RenewButton({ row, loading, onClick, size = "desktop" }) {
	const disabled = row.status !== "paid" || loading;
	const dim = size === "mobile" ? "h-10 w-10" : "h-8 w-8";
	const tip = row.status !== "paid" ? "Só é possível renovar pagamentos com status Pago" : "Renovar para o próximo mês";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "inline-flex",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				className: `${dim} rounded-sm text-primary transition-colors duration-200 hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:text-muted-foreground/60 disabled:hover:bg-transparent`,
				onClick,
				disabled,
				"aria-label": "Renovar pagamento",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-4 w-4" })
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: tip })] });
}
function effectiveDueDate(p) {
	if (p.due_date) return formatDateBR(p.due_date);
	const rm = p.reference_month;
	if (rm && /^\d{4}-\d{2}$/.test(rm)) {
		const [y, m] = rm.split("-").map(Number);
		const last = new Date(y, m, 0).getDate();
		return formatDateBR(`${rm}-${String(last).padStart(2, "0")}`);
	}
	if (p.payment_date) {
		const d = /* @__PURE__ */ new Date(p.payment_date + "T00:00:00");
		if (!isNaN(d.getTime())) {
			d.setDate(d.getDate() + 30);
			return formatDateBR(d.toISOString().slice(0, 10));
		}
	}
	return "—";
}
function KindBadge({ kind }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${kind === "pt" ? "bg-chart-6/15 text-chart-6" : "bg-primary/15 text-primary"}`,
		children: kind === "pt" ? "PT" : "Studio"
	});
}
//#endregion
export { PaymentsPage as component };
