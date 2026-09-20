import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { G as Plus, Z as Pencil, b as Trash2, rt as Package, wt as Layers } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { t as PageHeader } from "./PageHeader-CRue-aiN.mjs";
import { i as DialogFooter, n as DialogContent, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { t as EmptyState } from "./EmptyState-DK3vCNbs.mjs";
import { i as formatBRL } from "./format-BT-nao3-.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useScopeFilter } from "./use-scope-filter-q5Imal9c.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-iwNaZIEJ.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { n as PTBillingBadge } from "./PTBadges-CcuDhA9u.mjs";
import { t as DialogHeadline } from "./DialogHeadline-BQ9h1Ac-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plans-X6Od9NJk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PTPlanDialog({ open, onOpenChange, plan }) {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (open) setForm(plan ?? {
			billing_type: "monthly",
			is_active: true
		});
	}, [open, plan]);
	async function save() {
		if (!form.name) return toast.error("Nome obrigatório");
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) return;
		const payload = {
			user_id: userId,
			name: form.name,
			billing_type: form.billing_type ?? "monthly",
			sessions_per_month: form.sessions_per_month ?? null,
			price_per_month: form.price_per_month ?? null,
			price_per_session: form.price_per_session ?? null,
			package_sessions: form.package_sessions ?? null,
			package_price: form.package_price ?? null,
			description: form.description ?? null,
			is_active: form.is_active ?? true
		};
		const { error } = await (form.id ? supabase.from("pt_plans").update(payload).eq("id", form.id) : supabase.from("pt_plans").insert(payload));
		if (error) return toast.error(error.message);
		toast.success(form.id ? "Plano atualizado" : "Plano criado");
		qc.invalidateQueries();
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeadline, {
					icon: Layers,
					title: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: form.id ? "Editar plano PT" : "Novo plano PT" }),
					description: "Defina valor, número de aulas e validade do plano PT."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nome *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.name ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									name: e.target.value
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tipo de cobrança" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.billing_type ?? "monthly",
								onValueChange: (v) => setForm((f) => ({
									...f,
									billing_type: v
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "monthly",
										children: "Mensal"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "per_session",
										children: "Por sessão"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "package",
										children: "Pacote"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Aulas/mês" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: form.sessions_per_month ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									sessions_per_month: e.target.value ? Number(e.target.value) : null
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Preço mensal (R$)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.01",
								value: form.price_per_month ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									price_per_month: e.target.value ? Number(e.target.value) : null
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Preço por sessão (R$)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.01",
								value: form.price_per_session ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									price_per_session: e.target.value ? Number(e.target.value) : null
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Aulas no pacote" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: form.package_sessions ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									package_sessions: e.target.value ? Number(e.target.value) : null
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Preço do pacote (R$)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.01",
								value: form.package_price ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									package_price: e.target.value ? Number(e.target.value) : null
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Descrição" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: form.description ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									description: e.target.value
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 flex items-center justify-between rounded-lg border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: "Ativo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: "Planos inativos não aparecem em novas vendas"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: form.is_active ?? true,
								onCheckedChange: (v) => setForm((f) => ({
									...f,
									is_active: v
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
function PTPlansPage() {
	const qc = useQueryClient();
	const { scopeId, scopeKey, ready } = useScopeFilter();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const { data: plans = [] } = useQuery({
		queryKey: ["pt-plans-list", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("pt_plans").select("*").order("name", { ascending: true });
			if (scopeId) q = q.eq("user_id", scopeId);
			return (await q).data ?? [];
		}
	});
	const { data: payments = [] } = useQuery({
		queryKey: ["pt-payments-by-plan", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("pt_payments").select("pt_plan_id,amount,status,pt_student_id").eq("status", "paid").is("deleted_at", null);
			if (scopeId) q = q.eq("user_id", scopeId);
			return (await q).data ?? [];
		}
	});
	const stats = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const p of payments) {
			if (!p.pt_plan_id) continue;
			if (!m.has(p.pt_plan_id)) m.set(p.pt_plan_id, {
				revenue: 0,
				students: /* @__PURE__ */ new Set()
			});
			const s = m.get(p.pt_plan_id);
			s.revenue += Number(p.amount);
			s.students.add(p.pt_student_id);
		}
		return m;
	}, [payments]);
	async function toggleActive(plan) {
		const { error } = await supabase.from("pt_plans").update({ is_active: !plan.is_active }).eq("id", plan.id);
		if (error) return toast.error(error.message);
		toast.success(plan.is_active ? "Plano desativado" : "Plano ativado");
		qc.invalidateQueries({ queryKey: ["pt-plans-list", scopeKey] });
	}
	function priceDisplay(p) {
		if (p.billing_type === "monthly") return formatBRL(p.price_per_month ?? 0) + " / mês";
		if (p.billing_type === "package") return formatBRL(p.package_price ?? 0) + " · " + (p.package_sessions ?? 0) + " aulas";
		return formatBRL(p.price_per_session ?? 0) + " / aula";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				icon: Package,
				eyebrow: "Personal Trainer",
				title: "Planos PT",
				description: "Pacotes de aulas e valores dos seus alunos de personal",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setEditing(null);
						setOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Novo plano"]
				})
			}),
			plans.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Nenhum plano PT",
					description: "Crie pacotes e planos de personal trainer"
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: plans.map((p) => {
					const s = stats.get(p.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: `p-5 ${!p.is_active ? "opacity-60" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-semibold",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTBillingBadge, { type: p.billing_type })
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										onClick: () => {
											setEditing(p);
											setOpen(true);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										onClick: () => toggleActive(p),
										title: p.is_active ? "Desativar" : "Ativar",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 font-mono text-lg font-bold",
								children: priceDisplay(p)
							}),
							p.sessions_per_month && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [p.sessions_per_month, " aulas/mês"]
							}),
							p.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: p.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-2 gap-2 border-t pt-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground",
									children: "Alunos"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: s?.students.size ?? 0
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground",
									children: "Receita"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold font-mono",
									children: formatBRL(s?.revenue ?? 0)
								})] })]
							})
						]
					}, p.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTPlanDialog, {
				open,
				onOpenChange: setOpen,
				plan: editing
			})
		]
	});
}
//#endregion
export { PTPlansPage as component };
