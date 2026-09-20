import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { G as Plus, Z as Pencil, b as Trash2, rt as Package, s as Users, wt as Layers } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { t as PageHeader } from "./PageHeader-CRue-aiN.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { t as EmptyState } from "./EmptyState-DK3vCNbs.mjs";
import { i as formatBRL, n as billingCycleLabel } from "./format-BT-nao3-.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useScopeFilter } from "./use-scope-filter-q5Imal9c.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-iwNaZIEJ.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plans-17DuaxKt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PlanDialog({ open, onOpenChange, plan }) {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({});
	const [selectedPrograms, setSelectedPrograms] = (0, import_react.useState)([]);
	const { data: programs = [] } = useQuery({
		queryKey: ["plan-dialog-programs"],
		queryFn: async () => {
			const { data } = await supabase.from("programs").select("id,name,color").eq("is_active", true).order("name");
			return data ?? [];
		}
	});
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setForm(plan ?? {
			billing_cycle: "monthly",
			is_active: true,
			checkin_quota_type: "none"
		});
		if (plan?.id) supabase.from("plan_programs").select("program_id").eq("plan_id", plan.id).then(({ data }) => {
			setSelectedPrograms((data ?? []).map((r) => r.program_id));
		});
		else setSelectedPrograms([]);
	}, [open, plan]);
	function toggleProgram(id) {
		setSelectedPrograms((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
	}
	async function save() {
		if (!form.name || !form.price) return toast.error("Nome e preço são obrigatórios");
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) return;
		const quotaType = form.checkin_quota_type ?? "none";
		if (quotaType !== "none" && (!form.checkin_quota_amount || form.checkin_quota_amount <= 0)) return toast.error("Informe a quantidade de check-ins do plano");
		if (quotaType === "package" && (!form.package_valid_days || form.package_valid_days <= 0)) return toast.error("Informe a validade do pacote em dias");
		const payload = {
			user_id: userId,
			name: form.name,
			price: Number(form.price),
			billing_cycle: form.billing_cycle ?? "monthly",
			description: form.description ?? null,
			is_active: form.is_active ?? true,
			checkin_quota_type: quotaType,
			checkin_quota_amount: quotaType === "none" ? null : Number(form.checkin_quota_amount),
			package_valid_days: quotaType === "package" ? Number(form.package_valid_days) : null,
			max_freeze_days: form.max_freeze_days === null || form.max_freeze_days === void 0 || Number(form.max_freeze_days) <= 0 ? null : Number(form.max_freeze_days),
			auto_renew: form.auto_renew ?? false,
			max_renewals: form.max_renewals === null || form.max_renewals === void 0 || Number(form.max_renewals) <= 0 ? null : Number(form.max_renewals)
		};
		let planId = form.id;
		if (planId) {
			const { error } = await supabase.from("plans").update(payload).eq("id", planId);
			if (error) return toast.error(error.message);
		} else {
			const { data: inserted, error } = await supabase.from("plans").insert(payload).select("id").single();
			if (error) return toast.error(error.message);
			planId = inserted.id;
		}
		if (planId) {
			await supabase.from("plan_programs").delete().eq("plan_id", planId);
			if (selectedPrograms.length > 0) {
				const rows = selectedPrograms.map((pid) => ({
					plan_id: planId,
					program_id: pid,
					user_id: userId
				}));
				const { error: linkErr } = await supabase.from("plan_programs").insert(rows);
				if (linkErr) return toast.error(linkErr.message);
			}
		}
		toast.success(form.id ? "Plano atualizado" : "Plano criado");
		qc.invalidateQueries();
		onOpenChange(false);
	}
	const quotaType = form.checkin_quota_type ?? "none";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: form.id ? "Editar plano" : "Novo plano" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Cotas, trancamento, renovação e modalidades liberadas." })]
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nome *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.name ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									name: e.target.value
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Preço (R$) *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.01",
									value: form.price ?? "",
									onChange: (e) => setForm((f) => ({
										...f,
										price: Number(e.target.value)
									}))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Ciclo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.billing_cycle ?? "monthly",
									onValueChange: (v) => setForm((f) => ({
										...f,
										billing_cycle: v
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
										"monthly",
										"quarterly",
										"semiannual",
										"annual"
									].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c,
										children: billingCycleLabel(c)
									}, c)) })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 border-t space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-overline text-muted-foreground",
									children: "Cota de check-ins"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tipo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: quotaType,
										onValueChange: (v) => setForm((f) => ({
											...f,
											checkin_quota_type: v,
											checkin_quota_amount: v === "none" ? null : f.checkin_quota_amount,
											package_valid_days: v === "package" ? f.package_valid_days ?? 30 : null
										})),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "none",
												children: "Sem limite"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "weekly",
												children: "Semanal (reinicia às segundas)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "monthly",
												children: "Mensal (reinicia dia 1º)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "package",
												children: "Pacote com validade em dias"
											})
										] })]
									})]
								}),
								quotaType !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nº de check-ins" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											min: 1,
											value: form.checkin_quota_amount ?? "",
											onChange: (e) => setForm((f) => ({
												...f,
												checkin_quota_amount: Number(e.target.value)
											})),
											placeholder: quotaType === "weekly" ? "Ex: 2" : quotaType === "monthly" ? "Ex: 8" : "Ex: 10"
										})]
									}), quotaType === "package" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Validade (dias)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											min: 1,
											value: form.package_valid_days ?? 30,
											onChange: (e) => setForm((f) => ({
												...f,
												package_valid_days: Number(e.target.value)
											}))
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 border-t space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-overline text-muted-foreground",
									children: "Trancamento"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Limite máximo de dias que o aluno pode trancar por pagamento. Deixe em branco (ou 0) para não permitir trancamento."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Máx. de dias por trancamento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										value: form.max_freeze_days ?? "",
										onChange: (e) => setForm((f) => ({
											...f,
											max_freeze_days: e.target.value === "" ? null : Number(e.target.value)
										})),
										placeholder: "Ex.: 30"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-start gap-2 rounded-md border p-3 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										className: "mt-0.5 h-4 w-4",
										checked: !!form.auto_renew,
										onChange: (e) => setForm((f) => ({
											...f,
											auto_renew: e.target.checked
										}))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: "Plano renovável automaticamente"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground",
											children: "Novos pagamentos deste plano nascem marcados como renováveis. Você poderá renovar cada pagamento com um clique."
										})]
									})]
								}),
								form.auto_renew && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nº máximo de renovações automáticas" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											min: 1,
											value: form.max_renewals ?? "",
											onChange: (e) => setForm((f) => ({
												...f,
												max_renewals: e.target.value === "" ? null : Number(e.target.value)
											})),
											placeholder: "Deixe em branco para ilimitado (ex.: 3, 6, 12)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "Após esse número de renovações, o pagamento deixa de renovar automaticamente."
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 border-t space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-overline text-muted-foreground",
									children: "Programas liberados"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"Selecione as modalidades que este plano libera. Se nenhuma for marcada, o plano libera ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "todas" }),
										"."
									]
								}),
								programs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground italic",
									children: "Nenhum programa cadastrado ainda."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: programs.map((p) => {
										const selected = selectedPrograms.includes(p.id);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => toggleProgram(p.id),
											className: `focus-ring rounded-full border-2 px-3 py-1.5 text-xs transition-ui active:scale-[0.98] ${selected ? "font-medium text-primary-foreground" : "bg-background text-foreground hover:bg-muted"}`,
											style: {
												borderColor: p.color ?? "var(--color-muted-foreground)",
												backgroundColor: selected ? p.color ?? "var(--color-muted-foreground)" : void 0
											},
											children: p.name
										}, p.id);
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Descrição" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: form.description ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									description: e.target.value
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
function PlansPage() {
	const qc = useQueryClient();
	const { scopeId, scopeKey, ready } = useScopeFilter();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const { data: plans = [], isLoading } = useQuery({
		queryKey: ["plans-list", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("plans").select("id,name,price,billing_cycle,description,is_active,checkin_quota_type,checkin_quota_amount,package_valid_days,max_freeze_days,auto_renew,max_renewals,payments(amount),student_plan_history(is_current,student_id)").order("name", { ascending: true });
			if (scopeId) q = q.eq("user_id", scopeId);
			const { data, error } = await q;
			if (error) throw error;
			return data ?? [];
		}
	});
	async function remove(id) {
		if (!await confirmDialog("Excluir este plano?")) return;
		const { error } = await supabase.from("plans").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Plano excluído");
		qc.invalidateQueries({ queryKey: ["plans-list", scopeKey] });
	}
	async function toggleActive(p) {
		await supabase.from("plans").update({ is_active: !p.is_active }).eq("id", p.id);
		qc.invalidateQueries({ queryKey: ["plans-list", scopeKey] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				icon: Package,
				eyebrow: "Studio",
				title: "Planos",
				description: "Gerencie os planos do seu negócio",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setEditing(null);
						setOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Novo plano"]
				})
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-muted-foreground",
				children: "Carregando…"
			}) : plans.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Nenhum plano",
				description: "Crie seu primeiro plano para começar"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: plans.map((p) => {
					const activeStudents = p.student_plan_history.filter((h) => h.is_current).length;
					const revenue = p.payments.reduce((s, x) => s + Number(x.amount), 0);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-semibold",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
									children: billingCycleLabel(p.billing_cycle)
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-2 py-0.5 text-xs ${p.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`,
									children: p.is_active ? "Ativo" : "Inativo"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 font-mono text-2xl font-bold",
								children: formatBRL(p.price)
							}),
							p.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: p.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }), " Alunos"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono font-semibold",
									children: activeStudents
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Receita total"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono font-semibold",
									children: formatBRL(revenue)
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "flex-1",
										onClick: () => {
											setEditing(p);
											setOpen(true);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" }), " Editar"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => toggleActive(p),
										children: p.is_active ? "Desativar" : "Ativar"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										onClick: () => remove(p.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
									})
								]
							})
						]
					}, p.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanDialog, {
				open,
				onOpenChange: setOpen,
				plan: editing
			})
		]
	});
}
//#endregion
export { PlansPage as component };
