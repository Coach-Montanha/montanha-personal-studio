import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { G as Plus, Ht as Eye, Jt as DollarSign, Kt as Dumbbell, Wn as Activity, X as Percent, Xt as CreditCard, Z as Pencil, b as Trash2, bn as CalendarPlus, s as Users, v as TrendingUp } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PageHeader } from "./PageHeader-CRue-aiN.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DEnZ0u5J.mjs";
import { t as EmptyState } from "./EmptyState-DK3vCNbs.mjs";
import { a as isSameMonth, c as startOfMonth, d as addWeeks, f as startOfWeek, l as endOfMonth, m as addDays, p as addMonths, r as subMonths, s as format, t as ptBR, u as isSameDay } from "../_libs/date-fns.mjs";
import { a as formatDateBR, i as formatBRL } from "./format-BT-nao3-.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useScopeFilter } from "./use-scope-filter-q5Imal9c.mjs";
import { t as KPICard } from "./KPICard-CS1xEcGG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DT1SSYuq.mjs";
import { i as PTStudentStatusBadge, r as PTSessionStatusBadge, t as PTBadge } from "./PTBadges-CcuDhA9u.mjs";
import { r as parseStudentPartner } from "./pt-duo-Dbaj7St1.mjs";
import { t as PTPaymentDialog } from "./PTPaymentDialog-EiiOhpI7.mjs";
import { t as TrainingTimerDialog } from "./TrainingTimerDialog-D0y9wxVP.mjs";
import { t as MigrateStudentsDialog } from "./MigrateStudentsDialog-BYKLL37l.mjs";
import { n as PTStudentDialog, t as PTSessionDialog } from "./PTSessionDialog-z5VbvOau.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/personal-trainer-CrQLVeoh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PTOverview() {
	const { scopeId, scopeKey, ready } = useScopeFilter();
	const [studentOpen, setStudentOpen] = (0, import_react.useState)(false);
	const [sessionOpen, setSessionOpen] = (0, import_react.useState)(false);
	const [paymentOpen, setPaymentOpen] = (0, import_react.useState)(false);
	const [presetStudentId, setPresetStudentId] = (0, import_react.useState)();
	const [presetDate, setPresetDate] = (0, import_react.useState)();
	const qc = useQueryClient();
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [bulkOpen, setBulkOpen] = (0, import_react.useState)(false);
	const [bulkStatus, setBulkStatus] = (0, import_react.useState)("");
	const [migrateOpen, setMigrateOpen] = (0, import_react.useState)(false);
	const [ptSortBy, setPtSortBy] = (0, import_react.useState)("status");
	const [dayDetailOpen, setDayDetailOpen] = (0, import_react.useState)(false);
	const [selectedDay, setSelectedDay] = (0, import_react.useState)("");
	const [editingSession, setEditingSession] = (0, import_react.useState)(null);
	const [sessionOpenEdit, setSessionOpenEdit] = (0, import_react.useState)(false);
	const [calendarMonth, setCalendarMonth] = (0, import_react.useState)(startOfMonth(/* @__PURE__ */ new Date()));
	const [revenueMode, setRevenueMode] = (0, import_react.useState)("month");
	const [rangeStart, setRangeStart] = (0, import_react.useState)("");
	const [rangeEnd, setRangeEnd] = (0, import_react.useState)("");
	const [revenueOpen, setRevenueOpen] = (0, import_react.useState)(false);
	const [timerOpen, setTimerOpen] = (0, import_react.useState)(false);
	const calendarMonthKey = format(calendarMonth, "yyyy-MM");
	const monthStart = startOfMonth(calendarMonth);
	const monthEnd = endOfMonth(calendarMonth);
	const { data: students = [] } = useQuery({
		queryKey: ["pt-students-overview", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("pt_students").select("id,name,status,notes,pt_payments!pt_payments_pt_student_id_fkey(id,amount,payment_date,status,pt_plan_id,sessions_paid,reference_month,pt_plans(name,sessions_per_month,package_sessions,billing_type))").is("deleted_at", null).order("name");
			if (scopeId) q = q.eq("user_id", scopeId);
			return (await q).data ?? [];
		},
		staleTime: 3e4,
		refetchInterval: 300 * 1e3
	});
	const { data: monthSessions = [] } = useQuery({
		queryKey: [
			"pt-month-sessions",
			calendarMonthKey,
			scopeKey
		],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("pt_sessions").select("id,pt_student_id,session_date,session_time,duration_minutes,status,exercises,performance_notes,next_session_plan,pt_students(name)").gte("session_date", format(monthStart, "yyyy-MM-dd")).lte("session_date", format(monthEnd, "yyyy-MM-dd")).order("session_date");
			if (scopeId) q = q.eq("user_id", scopeId);
			return (await q).data ?? [];
		}
	});
	const { data: packageUsage = /* @__PURE__ */ new Map() } = useQuery({
		queryKey: ["pt-package-usage", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("pt_sessions").select("pt_payment_id").eq("status", "completed").not("pt_payment_id", "is", null);
			if (scopeId) q = q.eq("user_id", scopeId);
			const { data } = await q;
			const map = /* @__PURE__ */ new Map();
			for (const r of data ?? []) {
				if (!r.pt_payment_id) continue;
				map.set(r.pt_payment_id, (map.get(r.pt_payment_id) ?? 0) + 1);
			}
			return map;
		},
		staleTime: 3e4
	});
	const sortedStudents = (0, import_react.useMemo)(() => {
		const statusRank = {
			active: 0,
			inactive: 1,
			paused: 2,
			churned: 3
		};
		const studentById = new Map(students.map((st) => [st.id, st]));
		const getLastDate = (s) => {
			return (s.pt_payments ?? []).filter((p) => p.status === "paid").reduce((max, p) => p.payment_date > max ? p.payment_date : max, "");
		};
		const getPkgRemaining = (s) => {
			let lastPkg = [...s.pt_payments ?? []].filter((p) => p.status === "paid").sort((a, b) => a.payment_date < b.payment_date ? 1 : -1).find((p) => (p.sessions_paid ?? 0) > 0 || p.pt_plans?.billing_type === "package");
			if (!lastPkg && s.notes) {
				const { partnerId } = parseStudentPartner(s.notes);
				if (partnerId) lastPkg = [...studentById.get(partnerId)?.pt_payments ?? []].filter((p) => p.status === "paid").sort((a, b) => a.payment_date < b.payment_date ? 1 : -1).find((p) => (p.sessions_paid ?? 0) > 0 || p.pt_plans?.billing_type === "package");
			}
			if (!lastPkg) return null;
			const contracted = lastPkg.sessions_paid ?? lastPkg.pt_plans?.package_sessions ?? 0;
			if (!contracted) return null;
			return contracted - (packageUsage.get(lastPkg.id) ?? 0);
		};
		const arr = [...students];
		arr.sort((a, b) => {
			switch (ptSortBy) {
				case "name_desc": return b.name.localeCompare(a.name, "pt-BR");
				case "status": return (statusRank[a.status ?? ""] ?? 9) - (statusRank[b.status ?? ""] ?? 9) || a.name.localeCompare(b.name, "pt-BR");
				case "last_recent": return getLastDate(b).localeCompare(getLastDate(a));
				case "last_old": return (getLastDate(a) || "9999").localeCompare(getLastDate(b) || "9999");
				case "pkg_desc": {
					const ra = getPkgRemaining(a);
					const rb = getPkgRemaining(b);
					if (ra === null && rb === null) return a.name.localeCompare(b.name, "pt-BR");
					if (ra === null) return 1;
					if (rb === null) return -1;
					return rb - ra;
				}
				case "pkg_asc": {
					const ra = getPkgRemaining(a);
					const rb = getPkgRemaining(b);
					if (ra === null && rb === null) return a.name.localeCompare(b.name, "pt-BR");
					if (ra === null) return 1;
					if (rb === null) return -1;
					return ra - rb;
				}
				default: return a.name.localeCompare(b.name, "pt-BR");
			}
		});
		return arr;
	}, [
		students,
		ptSortBy,
		packageUsage
	]);
	const { data: monthPayments = [] } = useQuery({
		queryKey: [
			"pt-month-payments",
			calendarMonthKey,
			scopeKey
		],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("pt_payments").select("id,amount,status,payment_date,reference_month,pt_student_id,pt_students!pt_payments_pt_student_id_fkey(name),pt_plans(name)").eq("status", "paid").is("deleted_at", null).gte("payment_date", format(monthStart, "yyyy-MM-dd")).lte("payment_date", format(monthEnd, "yyyy-MM-dd"));
			if (scopeId) q = q.eq("user_id", scopeId);
			return (await q).data ?? [];
		}
	});
	const { data: allPtPayments = [] } = useQuery({
		queryKey: ["pt-all-payments-revenue", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let all = [];
			let from = 0;
			const PAGE = 1e3;
			while (true) {
				let q = supabase.from("pt_payments").select("id,amount,payment_date,reference_month,status,pt_student_id,pt_students!pt_payments_pt_student_id_fkey(name),pt_plans(name)").eq("status", "paid").is("deleted_at", null).order("payment_date", { ascending: false }).range(from, from + PAGE - 1);
				if (scopeId) q = q.eq("user_id", scopeId);
				const { data, error } = await q;
				if (error) break;
				all = all.concat(data ?? []);
				if (!data || data.length < PAGE) break;
				from += PAGE;
			}
			return all;
		}
	});
	const filteredRevenue = (0, import_react.useMemo)(() => {
		if (revenueMode === "month") return monthPayments;
		if (revenueMode === "all") return allPtPayments;
		return allPtPayments.filter((p) => {
			if (rangeStart && p.payment_date < rangeStart) return false;
			if (rangeEnd && p.payment_date > rangeEnd) return false;
			return true;
		});
	}, [
		revenueMode,
		monthPayments,
		allPtPayments,
		rangeStart,
		rangeEnd
	]);
	(0, import_react.useMemo)(() => filteredRevenue.reduce((s, p) => s + Number(p.amount), 0), [filteredRevenue]);
	const kpis = (0, import_react.useMemo)(() => {
		const active = students.filter((s) => s.status === "active").length;
		const revenue = monthPayments.reduce((s, p) => s + Number(p.amount), 0);
		const completed = monthSessions.filter((s) => s.status === "completed").length;
		const attended = completed;
		const scheduled = monthSessions.length;
		const attendanceRate = scheduled ? attended / scheduled * 100 : 0;
		const paidCount = monthPayments.length;
		const avg = paidCount ? revenue / paidCount : 0;
		const completedTrend = [
			0,
			0,
			0,
			0
		];
		const revenueTrend = [
			0,
			0,
			0,
			0
		];
		for (const s of monthSessions) if (s.status === "completed" && s.session_date) {
			const day = (/* @__PURE__ */ new Date(s.session_date + "T12:00")).getDate();
			const weekIdx = Math.min(Math.floor((day - 1) / 7), 3);
			completedTrend[weekIdx]++;
		}
		for (const p of monthPayments) if (p.payment_date) {
			const day = (/* @__PURE__ */ new Date(p.payment_date + "T12:00")).getDate();
			const weekIdx = Math.min(Math.floor((day - 1) / 7), 3);
			revenueTrend[weekIdx] += Number(p.amount) || 0;
		}
		return {
			active,
			revenue,
			completed,
			attendanceRate,
			avg,
			completedTrend: completedTrend.some((v) => v > 0) ? completedTrend : void 0,
			revenueTrend: revenueTrend.some((v) => v > 0) ? revenueTrend : void 0
		};
	}, [
		students,
		monthSessions,
		monthPayments
	]);
	async function handleBulkUpdate() {
		const ids = [...selected];
		let okCount = 0;
		for (const studentId of ids) {
			if (!bulkStatus) break;
			const { error } = await supabase.from("pt_students").update({ status: bulkStatus }).eq("id", studentId);
			if (!error) okCount++;
		}
		setBulkOpen(false);
		setSelected(/* @__PURE__ */ new Set());
		setBulkStatus("");
		qc.invalidateQueries();
		toast.success(`${okCount} aluno(s) PT atualizado(s)`);
	}
	async function deleteStudent(id) {
		if (!await confirmDialog("Excluir este aluno PT? Todos os pagamentos e treinos vinculados serão movidos para a Lixeira.")) return;
		const { error } = await supabase.from("pt_students").update({ deleted_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Aluno PT movido para a Lixeira");
		qc.invalidateQueries();
	}
	async function deleteSession(id) {
		if (!await confirmDialog("Excluir esta aula?")) return;
		const { error } = await supabase.from("pt_sessions").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Aula excluída");
		qc.invalidateQueries();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				icon: Dumbbell,
				eyebrow: "Personal Trainer",
				title: "Alunos PT",
				description: "Acompanhe planos, aulas e evolução de cada aluno",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/personal-trainer/plans",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						children: "Planos PT"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setPresetStudentId(void 0);
						setStudentOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Novo aluno PT"]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTBadge, {}) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						label: "👥 Alunos PT Ativos",
						value: kpis.active,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cursor-pointer transition-transform hover:scale-[1.01]",
						onClick: () => setRevenueOpen(true),
						title: "Clique para ver detalhes da receita",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
							label: `💰 Receita PT — ${format(calendarMonth, "MMM/yyyy", { locale: ptBR })}`,
							value: formatBRL(kpis.revenue),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-5 w-5" }),
							trendData: kpis.revenueTrend,
							hint: "Clique para filtrar"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						label: "🏃 Aulas realizadas",
						value: kpis.completed,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5" }),
						trendData: kpis.completedTrend,
						hint: `em ${format(calendarMonth, "MMMM/yyyy", { locale: ptBR })}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						label: "📊 Ticket Médio PT",
						value: formatBRL(kpis.avg),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
						label: "⚡ Taxa de presença",
						value: `${kpis.attendanceRate.toFixed(1).replace(".", ",")}%`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "students",
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "students",
						children: "Alunos"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "calendar",
						children: "Aulas do Mês"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "students",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [students.length, " aluno(s) PT"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: ptSortBy,
										onValueChange: (v) => setPtSortBy(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-9 w-full sm:w-[240px]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "name_asc",
												children: "Nome (A-Z)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "name_desc",
												children: "Nome (Z-A)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "status",
												children: "Status (ativos primeiro)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "last_recent",
												children: "Último pagto (recente)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "last_old",
												children: "Último pagto (antigo)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "pkg_desc",
												children: "Saldo pacote (maior)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "pkg_asc",
												children: "Saldo pacote (menor)"
											})
										] })]
									})]
								}),
								selected.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-sm font-medium",
											children: [selected.size, " aluno(s) selecionado(s)"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											onClick: () => setBulkOpen(true),
											children: "Editar em massa"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => setMigrateOpen(true),
											children: "Migrar para Studio"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => setSelected(/* @__PURE__ */ new Set()),
											children: "Limpar seleção"
										})
									]
								}),
								students.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
									title: "Nenhum aluno PT",
									description: "Cadastre seu primeiro aluno de personal trainer"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-2 md:hidden",
									children: sortedStudents.map((s) => {
										const paidPayments = [...s.pt_payments ?? []].filter((p) => p.status === "paid").sort((a, b) => a.payment_date < b.payment_date ? 1 : -1);
										const latestPayment = paidPayments[0];
										const planName = latestPayment?.pt_plans?.name;
										const lastPkg = paidPayments.find((p) => (p.sessions_paid ?? 0) > 0 || p.pt_plans?.billing_type === "package");
										const checked = selected.has(s.id);
										let pkgLabel = null;
										let pkgFull = false;
										if (lastPkg) {
											const contractedPkg = lastPkg.sessions_paid ?? lastPkg.pt_plans?.package_sessions ?? 0;
											if (contractedPkg) {
												const usedPkg = packageUsage.get(lastPkg.id) ?? 0;
												pkgFull = usedPkg >= contractedPkg;
												pkgLabel = `${usedPkg}/${contractedPkg}`;
											}
										}
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: cn("rounded-lg border p-3 transition-colors", checked && "ring-1 ring-primary", s.status === "active" ? "bg-accent/10 border-accent/20 text-foreground" : s.status === "inactive" ? "bg-state-pending-soft/40 border-state-pending/10 text-state-pending" : s.status === "paused" ? "bg-state-frozen-soft/40 border-state-frozen/10 text-state-frozen" : s.status === "churned" ? "bg-state-late-soft/40 border-state-late/10 text-state-late" : "bg-card border-border"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													className: "mt-1",
													checked,
													onChange: (e) => {
														setSelected((prev) => {
															const next = new Set(prev);
															if (e.target.checked) next.add(s.id);
															else next.delete(s.id);
															return next;
														});
													},
													"aria-label": "Selecionar aluno"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0 flex-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
															to: "/personal-trainer/students/$id",
															params: { id: s.id },
															className: "block truncate font-semibold hover:underline",
															children: s.name
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "mt-1 flex flex-wrap items-center gap-1.5 text-[11px]",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTStudentStatusBadge, { status: s.status }),
																planName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "rounded bg-muted px-1.5 py-0.5 text-muted-foreground",
																	children: planName
																}),
																pkgLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: cn("rounded bg-muted px-1.5 py-0.5 font-mono", pkgFull && "bg-destructive/10 text-destructive font-semibold"),
																	children: pkgLabel
																})
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "mt-1 text-[11px] text-muted-foreground",
															children: ["Último pagto: ", latestPayment ? formatDateBR(latestPayment.payment_date) : "—"]
														})
													]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 flex justify-end gap-1 border-t pt-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
														to: "/personal-trainer/students/$id",
														params: { id: s.id },
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "icon",
															variant: "ghost",
															className: "h-11 w-11",
															title: "Ver detalhes",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														className: "h-11 w-11",
														title: "Registrar aula",
														onClick: () => {
															setPresetStudentId(s.id);
															setSessionOpen(true);
														},
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "h-4 w-4" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														className: "h-11 w-11",
														title: "Registrar pagamento",
														onClick: () => {
															setPresetStudentId(s.id);
															setPaymentOpen(true);
														},
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														className: "h-11 w-11 text-destructive hover:bg-destructive/10",
														title: "Excluir aluno",
														onClick: () => deleteStudent(s.id),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
													})
												]
											})]
										}, s.id);
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "hidden overflow-x-auto md:block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "w-10",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: students.length > 0 && selected.size === students.length,
												onChange: (e) => setSelected(e.target.checked ? new Set(students.map((s) => s.id)) : /* @__PURE__ */ new Set())
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Nome" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Plano" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Último pagamento" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right",
											children: "Saldo do pacote"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
											className: "text-right",
											children: "Ações"
										})
									] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: sortedStudents.map((s) => {
										const paidPayments = [...s.pt_payments ?? []].filter((p) => p.status === "paid").sort((a, b) => a.payment_date < b.payment_date ? 1 : -1);
										const latestPayment = paidPayments[0];
										const planName = latestPayment?.pt_plans?.name;
										const lastPkg = paidPayments.find((p) => (p.sessions_paid ?? 0) > 0 || p.pt_plans?.billing_type === "package");
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
											className: cn(s.status === "active" ? "bg-accent/5 text-foreground" : s.status === "inactive" ? "bg-state-pending-soft/20 text-state-pending/90" : s.status === "paused" ? "bg-state-frozen-soft/20 text-state-frozen/90" : s.status === "churned" ? "bg-state-late-soft/20 text-state-late/90" : ""),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: selected.has(s.id),
													onChange: (e) => {
														setSelected((prev) => {
															const next = new Set(prev);
															if (e.target.checked) next.add(s.id);
															else next.delete(s.id);
															return next;
														});
													}
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/personal-trainer/students/$id",
													params: { id: s.id },
													className: "font-medium hover:underline",
													children: s.name
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-xs",
													children: planName ?? "—"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTStudentStatusBadge, { status: s.status }) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-xs font-mono",
													children: latestPayment ? formatDateBR(latestPayment.payment_date) : "—"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-right font-mono text-xs",
													children: (() => {
														if (!lastPkg) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground",
															children: "—"
														});
														const contractedPkg = lastPkg.sessions_paid ?? lastPkg.pt_plans?.package_sessions ?? 0;
														if (!contractedPkg) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground",
															children: "—"
														});
														const usedPkg = packageUsage.get(lastPkg.id) ?? 0;
														return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: cn(usedPkg >= contractedPkg && "text-destructive font-semibold"),
															children: [
																usedPkg,
																"/",
																contractedPkg
															]
														});
													})()
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-right",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-end gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
																to: "/personal-trainer/students/$id",
																params: { id: s.id },
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																	size: "icon",
																	variant: "ghost",
																	title: "Ver detalhes",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																size: "icon",
																variant: "ghost",
																title: "Registrar aula",
																onClick: () => {
																	setPresetStudentId(s.id);
																	setSessionOpen(true);
																},
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "h-4 w-4" })
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																size: "icon",
																variant: "ghost",
																title: "Registrar pagamento",
																onClick: () => {
																	setPresetStudentId(s.id);
																	setPaymentOpen(true);
																},
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" })
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																size: "icon",
																variant: "ghost",
																title: "Excluir aluno",
																className: "text-destructive hover:bg-destructive/10",
																onClick: () => deleteStudent(s.id),
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
															})
														]
													})
												})
											]
										}, s.id);
									}) })] })
								})] })
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "calendar",
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => setCalendarMonth((d) => startOfMonth(subMonths(d, 1))),
										children: "← Mês anterior"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "min-w-[160px] text-center text-sm font-semibold capitalize",
										children: format(calendarMonth, "MMMM yyyy", { locale: ptBR })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => setCalendarMonth((d) => startOfMonth(addMonths(d, 1))),
										children: "Próximo mês →"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => setCalendarMonth(startOfMonth(/* @__PURE__ */ new Date())),
								children: "Voltar ao mês atual"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthCalendar, {
							sessions: monthSessions,
							monthStart,
							currentMonth: calendarMonth,
							onDayClick: (d) => {
								setSelectedDay(d);
								setDayDetailOpen(true);
							}
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTStudentDialog, {
				open: studentOpen,
				onOpenChange: setStudentOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTSessionDialog, {
				open: sessionOpen,
				onOpenChange: setSessionOpen,
				defaultStudentId: presetStudentId,
				defaultDate: presetDate
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTSessionDialog, {
				open: sessionOpenEdit,
				onOpenChange: setSessionOpenEdit,
				session: editingSession
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTPaymentDialog, {
				open: paymentOpen,
				onOpenChange: setPaymentOpen,
				defaultStudentId: presetStudentId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DaySessionsDialog, {
				open: dayDetailOpen,
				onOpenChange: setDayDetailOpen,
				date: selectedDay,
				sessions: monthSessions,
				onEdit: (s) => {
					setEditingSession(s);
					setSessionOpenEdit(true);
					setDayDetailOpen(false);
				},
				onAdd: () => {
					setPresetDate(selectedDay);
					setPresetStudentId(void 0);
					setDayDetailOpen(false);
					setSessionOpen(true);
				},
				onDelete: deleteSession
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RevenueDialog, {
				open: revenueOpen,
				onOpenChange: setRevenueOpen,
				mode: revenueMode,
				setMode: setRevenueMode,
				rangeStart,
				setRangeStart,
				rangeEnd,
				setRangeEnd,
				payments: filteredRevenue
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MigrateStudentsDialog, {
				open: migrateOpen,
				onOpenChange: setMigrateOpen,
				ids: [...selected],
				direction: "pt_to_studio",
				onDone: () => setSelected(/* @__PURE__ */ new Set())
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: bulkOpen,
				onOpenChange: setBulkOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
						"Editar ",
						selected.size,
						" aluno(s) PT em massa"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Deixe em branco os campos que não deseja alterar."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4 py-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium",
								children: "Alterar status para"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: bulkStatus,
								onValueChange: setBulkStatus,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Não alterar" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "active",
										children: "Ativo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "inactive",
										children: "Inativo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "churned",
										children: "Desligado"
									})
								] })]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							setBulkStatus("");
							setBulkOpen(false);
						},
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: handleBulkUpdate,
						disabled: !bulkStatus,
						children: [
							"Aplicar a ",
							selected.size,
							" aluno(s)"
						]
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainingTimerDialog, {
				open: timerOpen,
				onOpenChange: setTimerOpen
			})
		]
	});
}
function MonthCalendar({ sessions, monthStart, currentMonth, onDayClick }) {
	const weeks = (0, import_react.useMemo)(() => {
		const start = startOfWeek(monthStart, { weekStartsOn: 0 });
		const arr = [];
		for (let w = 0; w < 6; w++) {
			const wk = [];
			for (let d = 0; d < 7; d++) wk.push(addDays(addWeeks(start, w), d));
			arr.push(wk);
		}
		return arr;
	}, [monthStart]);
	const sessionsByDate = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const s of sessions) {
			const k = s.session_date;
			if (!map.has(k)) map.set(k, []);
			map.get(k).push(s);
		}
		for (const list of map.values()) list.sort((a, b) => (a.session_time ?? "").localeCompare(b.session_time ?? ""));
		return map;
	}, [sessions]);
	const pillClass = (status) => cn("block w-full truncate rounded px-1 py-0.5 text-[10px] leading-tight font-medium cursor-pointer", status === "completed" && "bg-success/15 text-success", status === "no_show" && "bg-warning/20 text-warning-foreground", (status === "cancelled_student" || status === "cancelled_trainer") && "bg-destructive/15 text-destructive");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-sm font-semibold capitalize",
				children: format(currentMonth, "MMMM yyyy", { locale: ptBR })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground",
				children: [
					"Dom",
					"Seg",
					"Ter",
					"Qua",
					"Qui",
					"Sex",
					"Sáb"
				].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-1",
					children: d
				}, d))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-7 gap-1",
				children: weeks.flat().map((day) => {
					const key = format(day, "yyyy-MM-dd");
					const items = sessionsByDate.get(key) ?? [];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onDayClick(key),
						className: cn("min-h-[88px] cursor-pointer rounded-lg border p-1 text-left transition-colors hover:bg-accent/50", !isSameMonth(day, currentMonth) && "opacity-40", isSameDay(day, /* @__PURE__ */ new Date()) && "ring-2 ring-primary"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-medium text-muted-foreground",
							children: format(day, "d")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 space-y-0.5",
							children: [items.slice(0, 3).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: pillClass(s.status),
								title: s.pt_students?.name,
								children: [s.session_time ? s.session_time.slice(0, 5) + " · " : "", s.pt_students?.name]
							}, s.id)), items.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground",
								children: ["+", items.length - 3]
							})]
						})]
					}, key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
						className: "bg-success",
						label: "Realizada"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
						className: "bg-warning",
						label: "Falta"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
						className: "bg-destructive",
						label: "Cancelada"
					})
				]
			})
		]
	});
}
function Legend({ className, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-3 w-3 rounded-sm", className) }), label]
	});
}
function DaySessionsDialog({ open, onOpenChange, date, sessions, onEdit, onAdd, onDelete }) {
	const daySessions = sessions.filter((s) => s.session_date === date).slice().sort((a, b) => (a.session_time ?? "").localeCompare(b.session_time ?? ""));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "capitalize",
				children: date ? (/* @__PURE__ */ new Date(date + "T12:00")).toLocaleDateString("pt-BR", {
					weekday: "long",
					day: "2-digit",
					month: "long",
					year: "numeric"
				}) : ""
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 max-h-[60vh] overflow-y-auto pr-1",
				children: [daySessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground",
					children: "Nenhuma aula registrada neste dia."
				}) : daySessions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border p-3 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: s.pt_students?.name ?? "—"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTSessionStatusBadge, { status: s.status })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => onEdit(s),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => onDelete(s.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3 text-xs text-muted-foreground",
							children: [s.session_time && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["🕐 ", s.session_time.slice(0, 5)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"⏱ ",
								s.duration_minutes,
								"min"
							] })]
						}),
						s.exercises && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: "Exercícios:"
								}),
								" ",
								s.exercises
							]
						}),
						s.performance_notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: "Performance:"
								}),
								" ",
								s.performance_notes
							]
						}),
						s.next_session_plan && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: "Próxima aula:"
								}),
								" ",
								s.next_session_plan
							]
						})
					]
				}, s.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					onClick: onAdd,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Registrar nova aula neste dia"]
				})]
			})]
		})
	});
}
function RevenueDialog({ open, onOpenChange, mode, setMode, rangeStart, setRangeStart, rangeEnd, setRangeEnd, payments }) {
	const total = payments.reduce((s, p) => s + Number(p.amount), 0);
	const avg = payments.length ? total / payments.length : 0;
	const byMonth = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of payments) {
			const k = p.reference_month ?? p.payment_date.slice(0, 7);
			map.set(k, (map.get(k) ?? 0) + Number(p.amount));
		}
		return [...map.entries()].sort(([a], [b]) => a < b ? 1 : -1).map(([month, total]) => ({
			month,
			total
		}));
	}, [payments]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Receita PT — Detalhamento" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 max-h-[70vh] overflow-y-auto pr-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							"month",
							"all",
							"range"
						].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: mode === m ? "default" : "outline",
							onClick: () => setMode(m),
							children: m === "month" ? "Mês atual" : m === "all" ? "Todos os meses" : "Período"
						}, m))
					}),
					mode === "range" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: rangeStart,
								onChange: (e) => setRangeStart(e.target.value),
								className: "w-auto"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: "até"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: rangeEnd,
								onChange: (e) => setRangeEnd(e.target.value),
								className: "w-auto"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Total"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-lg font-bold font-mono",
									children: formatBRL(total)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Pagamentos"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-lg font-bold font-mono",
									children: payments.length
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Ticket médio"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-lg font-bold font-mono",
									children: formatBRL(avg)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Mês" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Receita"
					})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [byMonth.map(({ month, total }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "capitalize",
						children: (/* @__PURE__ */ new Date(month + "-01")).toLocaleDateString("pt-BR", {
							month: "long",
							year: "numeric"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right font-mono",
						children: formatBRL(total)
					})] }, month)), byMonth.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 2,
						className: "text-center text-sm text-muted-foreground",
						children: "Nenhum pagamento encontrado"
					}) })] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Mostrando apenas pagamentos com status \"Pago\""
					})
				]
			})]
		})
	});
}
//#endregion
export { PTOverview as component };
