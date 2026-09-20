import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { G as Plus, R as Search, S as Ticket, b as Trash2, fn as ChevronRight, s as Users } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PageHeader } from "./PageHeader-CRue-aiN.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DEnZ0u5J.mjs";
import { t as EmptyState } from "./EmptyState-DK3vCNbs.mjs";
import { a as formatDateBR, i as formatBRL, l as initials } from "./format-BT-nao3-.mjs";
import { n as PlanBadge, r as StudentStatusBadge } from "./Badges-BwuNwA-M.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useScopeFilter } from "./use-scope-filter-q5Imal9c.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { n as checkinChipClass, r as checkinTone, t as allocateCheckins } from "./checkins-DJxtlh1V.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-BymSQoye.mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { t as TrainingTimerDialog } from "./TrainingTimerDialog-D0y9wxVP.mjs";
import { t as MigrateStudentsDialog } from "./MigrateStudentsDialog-BYKLL37l.mjs";
import { t as StudentDialog } from "./StudentDialog-CxHruDEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students.index-9fLoR2zs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FIELDS = [
	{
		key: "phone",
		label: "Telefone",
		type: "tel"
	},
	{
		key: "email",
		label: "Email",
		type: "email"
	},
	{
		key: "status",
		label: "Status",
		type: "status"
	},
	{
		key: "birth_date",
		label: "Data de nascimento",
		type: "date"
	},
	{
		key: "start_date",
		label: "Data de início",
		type: "date"
	},
	{
		key: "cpf",
		label: "CPF",
		type: "text"
	},
	{
		key: "rg",
		label: "RG",
		type: "text"
	},
	{
		key: "address",
		label: "Endereço",
		type: "text"
	},
	{
		key: "postal_code",
		label: "CEP",
		type: "text"
	},
	{
		key: "neighborhood",
		label: "Bairro",
		type: "text"
	},
	{
		key: "city",
		label: "Cidade",
		type: "text"
	},
	{
		key: "state",
		label: "Estado",
		type: "text"
	},
	{
		key: "country",
		label: "País",
		type: "text"
	}
];
function BulkStudentEditDialog({ open, onOpenChange, selectedIds, onDone }) {
	const qc = useQueryClient();
	const [field, setField] = (0, import_react.useState)("phone");
	const [value, setValue] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const cfg = FIELDS.find((f) => f.key === field);
	async function apply() {
		if (selectedIds.length === 0) return;
		setBusy(true);
		const patch = { [field]: value === "" ? null : value };
		const { error } = await supabase.from("students").update(patch).in("id", selectedIds);
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success(`${selectedIds.length} aluno(s) atualizado(s)`);
		qc.invalidateQueries();
		setValue("");
		onDone();
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Editar em massa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"O campo escolhido será substituído em ",
					selectedIds.length,
					" aluno(s) selecionado(s). Deixe em branco para limpar o campo."
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Campo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: field,
							onValueChange: (v) => {
								setField(v);
								setValue("");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: FIELDS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: f.key,
								children: f.label
							}, f.key)) })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Novo valor" }), cfg.type === "status" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value,
							onValueChange: setValue,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione…" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
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
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: cfg.type === "date" ? "date" : cfg.type === "email" ? "email" : cfg.type === "tel" ? "tel" : "text",
							value,
							onChange: (e) => setValue(e.target.value),
							placeholder: cfg.type === "date" ? "" : "Deixe em branco para limpar"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					disabled: busy,
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: apply,
					disabled: busy || cfg.type === "status" && !value,
					children: busy ? "Aplicando…" : `Aplicar a ${selectedIds.length}`
				})] })
			]
		})
	});
}
function StudentsPage() {
	const qc = useQueryClient();
	const { scopeId, scopeKey, ready } = useScopeFilter();
	const [search, setSearch] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("active");
	const [sortBy, setSortBy] = (0, import_react.useState)("name_asc");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [bulkPlanId, setBulkPlanId] = (0, import_react.useState)("");
	const [bulkOpen, setBulkOpen] = (0, import_react.useState)(false);
	const [bulkEditOpen, setBulkEditOpen] = (0, import_react.useState)(false);
	const [migrateOpen, setMigrateOpen] = (0, import_react.useState)(false);
	const [timerOpen, setTimerOpen] = (0, import_react.useState)(false);
	const { data: students = [], isLoading } = useQuery({
		queryKey: ["students-list", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("students").select("id,name,email,phone,notes,status,created_at,birth_date,account_user_id,attendance_offset,payments(id,amount,payment_date,status,checkin_quota_override,plans(checkin_quota_type,checkin_quota_amount,package_valid_days)),student_plan_history(is_current,plans(name))").is("deleted_at", null).order("name");
			if (scopeId) q = q.eq("user_id", scopeId);
			const { data, error } = await q;
			if (error) throw error;
			return data ?? [];
		},
		staleTime: 3e4,
		refetchInterval: 300 * 1e3
	});
	const packageStudentIds = (0, import_react.useMemo)(() => students.filter((s) => (s.payments ?? []).some((p) => p.status === "paid" && p.plans?.checkin_quota_type === "package")).map((s) => s.id), [students]);
	const { data: checkinDates = {} } = useQuery({
		queryKey: ["students-package-attendance", packageStudentIds.join(",")],
		enabled: packageStudentIds.length > 0,
		staleTime: 300 * 1e3,
		queryFn: async () => {
			const { data } = await supabase.from("class_attendance").select("student_id, class_sessions:session_id (session_date)").in("student_id", packageStudentIds);
			const map = {};
			for (const r of data ?? []) {
				const d = r.class_sessions?.session_date;
				if (!d || !r.student_id) continue;
				(map[r.student_id] ??= []).push(d);
			}
			return map;
		}
	});
	const checkinByStudent = (0, import_react.useMemo)(() => {
		const out = /* @__PURE__ */ new Map();
		for (const id of packageStudentIds) {
			const s = students.find((x) => x.id === id);
			if (!s) continue;
			const alloc = allocateCheckins(s.payments ?? [], checkinDates[id] ?? []);
			const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			const entries = [...alloc.entries()].map(([pid, pkg]) => ({
				pid,
				pkg
			})).sort((a, b) => (a.pkg.validUntil ?? "9999") < (b.pkg.validUntil ?? "9999") ? -1 : 1);
			const active = entries.find((e) => e.pkg.quota - e.pkg.used.length > 0 && (!e.pkg.validUntil || e.pkg.validUntil >= today)) ?? entries[entries.length - 1];
			if (active) out.set(id, {
				remaining: Math.max(0, active.pkg.quota - active.pkg.used.length),
				quota: active.pkg.quota
			});
		}
		return out;
	}, [
		students,
		packageStudentIds,
		checkinDates
	]);
	const { data: plans = [] } = useQuery({
		queryKey: ["plans-active"],
		queryFn: async () => {
			const { data } = await supabase.from("plans").select("id,name,price").eq("is_active", true).order("name");
			return data ?? [];
		}
	});
	const { data: birthdayStudents = [] } = useQuery({
		queryKey: ["birthday-students-page", scopeKey],
		enabled: ready,
		queryFn: async () => {
			const currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
			let q = supabase.from("students").select("id,name,email,phone,birth_date,status").is("deleted_at", null).not("birth_date", "is", null).order("birth_date");
			if (scopeId) q = q.eq("user_id", scopeId);
			const { data, error } = await q;
			if (error) throw error;
			return (data ?? []).filter((s) => {
				if (!s.birth_date) return false;
				return (/* @__PURE__ */ new Date(s.birth_date + "T12:00")).getMonth() + 1 === currentMonth;
			});
		}
	});
	const rows = (0, import_react.useMemo)(() => {
		const norm = (s) => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
		const q = norm(search);
		return students.filter((s) => status === "all" ? true : s.status === status).filter((s) => !q || norm(s.name).includes(q) || norm(s.email ?? "").includes(q)).map((s) => {
			const paid = s.payments.filter((p) => p.amount);
			const total = paid.reduce((a, p) => a + Number(p.amount), 0);
			const dates = paid.map((p) => p.payment_date).sort();
			const current = s.student_plan_history.find((h) => h.is_current);
			return {
				...s,
				total,
				count: paid.length,
				first: dates[0],
				last: dates[dates.length - 1],
				avg: paid.length ? total / paid.length : 0,
				plan: current?.plans?.name ?? null
			};
		}).sort((a, b) => {
			const statusRank = {
				active: 0,
				inactive: 1,
				churned: 2
			};
			switch (sortBy) {
				case "name_desc": return b.name.localeCompare(a.name, "pt-BR");
				case "status": return (statusRank[a.status] ?? 9) - (statusRank[b.status] ?? 9) || a.name.localeCompare(b.name, "pt-BR");
				case "last_recent": return (b.last ?? "").localeCompare(a.last ?? "");
				case "last_old": return (a.last ?? "9999").localeCompare(b.last ?? "9999");
				case "ltv_desc": return b.total - a.total;
				case "ltv_asc": return a.total - b.total;
				default: return a.name.localeCompare(b.name, "pt-BR");
			}
		});
	}, [
		students,
		search,
		status,
		sortBy
	]);
	async function remove(id) {
		if (!await confirmDialog(`Excluir "${students.find((x) => x.id === id)?.name ?? "este aluno"}"? O aluno vai para a Lixeira e pode ser restaurado depois.`)) return;
		const { error, count } = await supabase.from("students").update({ deleted_at: (/* @__PURE__ */ new Date()).toISOString() }, { count: "exact" }).eq("id", id).is("deleted_at", null);
		if (error) return toast.error(error.message);
		if (!count) return toast.error("Nada foi excluído (permissão negada).");
		toast.success("Aluno movido para a Lixeira");
		qc.invalidateQueries({ queryKey: ["students-list", scopeKey] });
	}
	async function handleBulkPlanChange() {
		if (!bulkPlanId) return;
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) return;
		const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		const ids = [...selected];
		let okCount = 0;
		const errs = [];
		for (const studentId of ids) {
			await supabase.from("student_plan_history").update({
				end_date: today,
				is_current: false
			}).eq("student_id", studentId).eq("is_current", true);
			const { error } = await supabase.from("student_plan_history").insert({
				user_id: userId,
				student_id: studentId,
				plan_id: bulkPlanId,
				start_date: today,
				is_current: true
			});
			if (error) errs.push(error.message);
			else okCount++;
		}
		setBulkOpen(false);
		setSelected(/* @__PURE__ */ new Set());
		setBulkPlanId("");
		qc.invalidateQueries({ queryKey: ["students-list", scopeKey] });
		if (okCount) toast.success(`Plano atualizado para ${okCount} aluno(s)`);
		if (errs.length) toast.error(`${errs.length} erro(s) ao atualizar plano`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				icon: Users,
				eyebrow: "Studio",
				title: "Alunos",
				description: `${rows.length} aluno(s) cadastrado(s)`,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					"data-testid": "button-new-student",
					className: "w-full sm:w-auto",
					onClick: () => {
						setEditing(null);
						setOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Novo aluno"]
				})
			}),
			birthdayStudents.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "relative overflow-hidden border-accent/30 bg-gradient-to-br from-accent/10 via-card to-primary/10 p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/20 blur-2xl",
						"aria-hidden": true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-8 w-8 place-items-center rounded-full bg-accent/20 text-base",
							children: "🎂"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm font-semibold leading-tight text-foreground",
								children: [birthdayStudents.length, " aniversariante(s) este mês"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground",
								children: "Envie uma mensagem rápida"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: birthdayStudents.map((s) => {
							const day = (/* @__PURE__ */ new Date(s.birth_date + "T12:00")).getDate();
							const isToday = day === (/* @__PURE__ */ new Date()).getDate();
							const msg = encodeURIComponent(`Feliz aniversário, ${s.name}! 🎂 Desejamos um dia incrível!`);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-2.5 py-1.5 text-xs shadow-sm backdrop-blur transition-colors duration-200 hover:border-accent/50 hover:bg-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": true,
										children: isToday ? "🎉" : "🎂"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: s.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: ["dia ", day]
									}),
									s.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `https://wa.me/55${s.phone.replace(/\D/g, "")}?text=${msg}`,
										target: "_blank",
										rel: "noopener noreferrer",
										"aria-label": `WhatsApp ${s.name}`,
										className: "ml-1 grid h-7 w-7 place-items-center rounded-full bg-success/15 text-success outline-none transition-all duration-200 hover:bg-success/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background active:scale-95",
										children: "💬"
									}),
									s.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `mailto:${s.email}?subject=Feliz%20Anivers%C3%A1rio!&body=${msg}`,
										"aria-label": `Email ${s.name}`,
										className: "grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary outline-none transition-all duration-200 hover:bg-primary/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background active:scale-95",
										children: "📧"
									})
								]
							}, s.id);
						})
					})
				]
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
									"data-testid": "input-search-students",
									type: "search",
									inputMode: "search",
									placeholder: "Buscar por nome ou email...",
									className: "h-11 pl-9 text-base sm:h-10 sm:text-sm",
									value: search,
									onChange: (e) => setSearch(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: status,
								onValueChange: setStatus,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									"data-testid": "select-status-filter",
									className: "h-11 w-full sm:h-10 sm:w-[160px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "Todos status"
									}),
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
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: sortBy,
								onValueChange: (v) => setSortBy(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-11 w-full sm:h-10 sm:w-[220px]",
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
										children: "Status"
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
										value: "ltv_desc",
										children: "LTV (maior)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "ltv_asc",
										children: "LTV (menor)"
									})
								] })]
							})
						]
					}),
					selected.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium",
								children: [selected.size, " aluno(s) selecionado(s)"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => setBulkOpen(true),
								children: "Alterar plano em massa"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => setBulkEditOpen(true),
								children: "Editar informações em massa"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => setMigrateOpen(true),
								children: "Migrar para PT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => setSelected(/* @__PURE__ */ new Set()),
								children: "Limpar seleção"
							})
						]
					}),
					isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 md:hidden",
							children: [
								1,
								2,
								3,
								4,
								5
							].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/60 bg-card p-3.5 shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-10 rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-32" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-44" })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-16 rounded-full" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-20 rounded-full" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "ml-auto h-4 w-16" })
									]
								})]
							}, i))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden md:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b bg-muted/30 px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-20" })]
								}), [
									1,
									2,
									3,
									4,
									5
								].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b px-4 py-3 last:border-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-8 rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-32" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-24" })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-20 rounded-full" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-16 rounded-full" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-16" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-20" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-8 rounded" })
									]
								}, i))]
							})
						})]
					}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "Nenhum aluno encontrado",
						description: "Adicione seu primeiro aluno para começar",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => {
								setEditing(null);
								setOpen(true);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Novo aluno"]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 md:hidden",
						children: rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cn("rounded-xl border p-3.5 shadow-card transition-ui hover:shadow-float", s.status === "active" ? "bg-accent/10 border-accent/20 text-foreground hover:border-accent/30" : s.status === "inactive" ? "bg-state-pending-soft/40 border-state-pending/10 text-state-pending hover:border-state-pending/25" : s.status === "churned" ? "bg-state-late-soft/40 border-state-late/10 text-state-late hover:border-state-late/25" : s.status === "paused" ? "bg-state-frozen-soft/40 border-state-frozen/10 text-state-frozen hover:border-state-frozen/25" : "bg-card border-border hover:border-primary/25"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "flex min-h-[44px] min-w-[44px] -m-1.5 p-1.5 items-center justify-center cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											"aria-label": `Selecionar ${s.name}`,
											className: "h-4 w-4 shrink-0 rounded border-input text-primary focus:ring-2 focus:ring-ring",
											checked: selected.has(s.id),
											onChange: (e) => {
												setSelected((prev) => {
													const next = new Set(prev);
													if (e.target.checked) next.add(s.id);
													else next.delete(s.id);
													return next;
												});
											}
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/students/$id",
										params: { id: s.id },
										search: { tab: "overview" },
										className: "flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary",
											children: initials(s.name)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate font-semibold text-primary",
												children: s.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-xs text-muted-foreground",
												children: s.email ?? "—"
											})]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap items-center gap-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentStatusBadge, { status: s.status }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanBadge, { name: s.plan }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckinChip, { data: checkinByStudent.get(s.id) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-numeric ml-auto font-semibold",
											children: formatBRL(s.total)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-muted-foreground",
										children: ["Último: ", s.last ? formatDateBR(s.last) : "—"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										"aria-label": `Excluir ${s.name}`,
										className: "h-11 w-11 transition-all duration-200 active:scale-[0.95]",
										onClick: () => remove(s.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
									})]
								})
							]
						}, s.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
							"data-testid": "table-students",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "w-10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "flex min-h-[36px] min-w-[36px] items-center justify-center cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											"aria-label": "Selecionar todos os alunos",
											className: "h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring",
											checked: rows.length > 0 && selected.size === rows.length,
											onChange: (e) => setSelected(e.target.checked ? new Set(rows.map((r) => r.id)) : /* @__PURE__ */ new Set())
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Nome" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Plano" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "LTV"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Último" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
								"data-testid": `student-row-${s.id}`,
								className: cn("group/row transition-colors duration-200 hover:bg-muted/40", s.status === "active" ? "bg-accent/5 text-foreground" : s.status === "inactive" ? "bg-state-pending-soft/20 text-state-pending/90" : s.status === "churned" ? "bg-state-late-soft/20 text-state-late/90" : s.status === "paused" ? "bg-state-frozen-soft/20 text-state-frozen/90" : ""),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "w-10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "flex min-h-[36px] min-w-[36px] items-center justify-center cursor-pointer",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												"aria-label": `Selecionar ${s.name}`,
												className: "h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring",
												checked: selected.has(s.id),
												onChange: (e) => {
													setSelected((prev) => {
														const next = new Set(prev);
														if (e.target.checked) next.add(s.id);
														else next.delete(s.id);
														return next;
													});
												}
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/students/$id",
										params: { id: s.id },
										search: { tab: "overview" },
										className: "group flex items-center gap-3 rounded-lg text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary transition-colors duration-200 group-hover:bg-primary/15",
											children: initials(s.name)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-primary group-hover:underline",
											children: s.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: s.email ?? "—"
										})] })]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanBadge, { name: s.plan }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckinChip, { data: checkinByStudent.get(s.id) })]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentStatusBadge, { status: s.status }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-numeric text-right",
										children: formatBRL(s.total)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "font-mono text-xs",
										children: s.last ? formatDateBR(s.last) : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/students/$id",
												params: { id: s.id },
												search: { tab: "overview" },
												"aria-label": `Abrir perfil de ${s.name}`,
												className: "rounded-md p-2 text-muted-foreground opacity-0 transition-all duration-200 hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover/row:opacity-100",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												"aria-label": `Excluir ${s.name}`,
												className: "transition-all duration-200 active:scale-[0.95]",
												onClick: () => remove(s.id),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
											})]
										})
									})
								]
							}, s.id)) })]
						})
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentDialog, {
				open,
				onOpenChange: setOpen,
				student: editing
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulkStudentEditDialog, {
				open: bulkEditOpen,
				onOpenChange: setBulkEditOpen,
				selectedIds: [...selected],
				onDone: () => setSelected(/* @__PURE__ */ new Set())
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MigrateStudentsDialog, {
				open: migrateOpen,
				onOpenChange: setMigrateOpen,
				ids: [...selected],
				direction: "studio_to_pt",
				onDone: () => setSelected(/* @__PURE__ */ new Set())
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: bulkOpen,
				onOpenChange: setBulkOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Alterar plano em massa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
						"Isso encerrará o plano atual de ",
						selected.size,
						" aluno(s) selecionado(s) e iniciará o novo plano a partir de hoje."
					] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: bulkPlanId,
							onValueChange: setBulkPlanId,
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogAction, {
						onClick: handleBulkPlanChange,
						disabled: !bulkPlanId,
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
/** Chip compacto de check-ins restantes do pacote vigente. */
function CheckinChip({ data }) {
	if (!data || data.quota <= 0) return null;
	const tone = checkinTone(data.remaining, data.quota);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		title: `${data.remaining} de ${data.quota} check-ins restantes`,
		className: cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5", "text-[11px] font-semibold leading-none tabular-nums", checkinChipClass(tone)),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "h-3 w-3" }),
			data.remaining,
			"/",
			data.quota
		]
	});
}
//#endregion
export { StudentsPage as component };
