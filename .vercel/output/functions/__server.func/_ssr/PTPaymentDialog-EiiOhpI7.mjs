import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { W as Receipt, _t as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { i as DialogFooter, n as DialogContent, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { s as format } from "../_libs/date-fns.mjs";
import { r as currentMonthKey, u as paymentMethodLabel } from "./format-BT-nao3-.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-iwNaZIEJ.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { t as DialogHeadline } from "./DialogHeadline-BQ9h1Ac-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PTPaymentDialog-EiiOhpI7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PTPaymentDialog({ open, onOpenChange, payment, defaultStudentId }) {
	const qc = useQueryClient();
	const { data: students = [] } = useQuery({
		queryKey: ["pt-students-all"],
		queryFn: async () => (await supabase.from("pt_students").select("id,name").is("deleted_at", null).order("name")).data ?? []
	});
	const { data: plans = [] } = useQuery({
		queryKey: ["pt-plans-all"],
		queryFn: async () => (await supabase.from("pt_plans").select("id,name,price_per_month,price_per_session,package_price,package_sessions,sessions_per_month,billing_type").order("name")).data ?? []
	});
	const [form, setForm] = (0, import_react.useState)({});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [historicalSessions, setHistoricalSessions] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (open) {
			setForm(payment ?? {
				pt_student_id: defaultStudentId,
				payment_date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
				reference_month: currentMonthKey(),
				payment_method: "pix",
				status: "paid"
			});
			setHistoricalSessions("");
		}
	}, [
		open,
		payment,
		defaultStudentId
	]);
	const planMap = (0, import_react.useMemo)(() => Object.fromEntries(plans.map((p) => [p.id, p])), [plans]);
	const billingType = (form.pt_plan_id ? planMap[form.pt_plan_id] : null)?.billing_type ?? null;
	const isMonthly = billingType === "monthly";
	const isBySession = billingType === "per_session" || billingType === "package";
	function addDaysISO(iso, days) {
		const d = /* @__PURE__ */ new Date(`${iso}T12:00:00`);
		d.setDate(d.getDate() + days);
		return d.toISOString().slice(0, 10);
	}
	function applyPlan(planId) {
		if (!planId) return setForm((f) => ({
			...f,
			pt_plan_id: null
		}));
		const p = planMap[planId];
		if (!p) return;
		const amount = p.billing_type === "monthly" ? Number(p.price_per_month ?? 0) : p.billing_type === "package" ? Number(p.package_price ?? 0) : Number(p.price_per_session ?? 0);
		const sessions = p.billing_type === "monthly" ? p.sessions_per_month : p.billing_type === "package" ? p.package_sessions : 1;
		setForm((f) => {
			const nextDue = p.billing_type === "monthly" && f.payment_date ? addDaysISO(f.payment_date, 30) : null;
			return {
				...f,
				pt_plan_id: planId,
				amount: f.amount || amount,
				sessions_paid: f.sessions_paid ?? sessions,
				due_date: nextDue ?? f.due_date ?? null
			};
		});
	}
	(0, import_react.useEffect)(() => {
		if (!isMonthly || !form.payment_date) return;
		setForm((f) => ({
			...f,
			due_date: addDaysISO(f.payment_date, 30)
		}));
	}, [form.payment_date, isMonthly]);
	async function save() {
		if (!form.pt_student_id || !form.amount || !form.payment_date) return toast.error("Preencha aluno, valor e data");
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) return;
		setSaving(true);
		try {
			const payload = {
				user_id: userId,
				pt_student_id: form.pt_student_id,
				pt_plan_id: form.pt_plan_id || null,
				amount: Number(form.amount),
				payment_date: form.payment_date,
				due_date: isBySession ? null : form.due_date || null,
				reference_month: form.reference_month || null,
				payment_method: form.payment_method ?? "pix",
				status: form.status ?? "paid",
				sessions_paid: form.sessions_paid ?? null,
				notes: form.notes ?? null
			};
			const { data: opData, error } = await (form.id ? supabase.from("pt_payments").update(payload).eq("id", form.id) : supabase.from("pt_payments").insert(payload).select("id").single());
			if (error) throw error;
			const newPaymentId = !form.id ? opData?.id : null;
			const count = typeof historicalSessions === "number" ? historicalSessions : 0;
			if (newPaymentId && count > 0 && form.pt_student_id) {
				const baseDate = /* @__PURE__ */ new Date(`${form.payment_date}T12:00:00`);
				const sessionRows = Array.from({ length: count }).map((_, i) => {
					const d = new Date(baseDate);
					d.setDate(d.getDate() - i);
					return {
						user_id: userId,
						pt_student_id: form.pt_student_id,
						pt_payment_id: newPaymentId,
						session_date: d.toISOString().slice(0, 10),
						duration_minutes: 60,
						status: "completed",
						performance_notes: "Registro histórico (importado com o pagamento)"
					};
				});
				const { error: sErr } = await supabase.from("pt_sessions").insert(sessionRows);
				if (sErr) toast.error(`Pagamento salvo, mas falhou ao registrar aulas: ${sErr.message}`);
			}
			toast.success(form.id ? "Pagamento atualizado" : "Pagamento registrado");
			qc.invalidateQueries();
			onOpenChange(false);
		} catch (err) {
			toast.error(err.message || "Erro ao salvar pagamento");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeadline, {
					icon: Receipt,
					title: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: form.id ? "Editar pagamento PT" : "Registrar pagamento PT" }),
					description: "Lançamento financeiro vinculado ao plano do aluno PT."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Aluno *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.pt_student_id,
								onValueChange: (v) => setForm((f) => ({
									...f,
									pt_student_id: v
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: students.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s.id,
									children: s.name
								}, s.id)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Plano" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.pt_plan_id ?? "none",
									onValueChange: (v) => applyPlan(v === "none" ? null : v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Sem plano" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "none",
										children: "Sem plano (avulso)"
									}), plans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: p.id,
										children: p.name
									}, p.id))] })]
								}),
								!form.pt_plan_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "💡 Pagamento avulso — não vinculado a nenhum plano. Use para registros históricos ou aulas pontuais."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Valor (R$) *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.01",
								inputMode: "decimal",
								placeholder: "0,00",
								value: form.amount ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									amount: Number(e.target.value)
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Aulas cobertas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								inputMode: "numeric",
								min: 1,
								value: form.sessions_paid ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									sessions_paid: e.target.value ? Number(e.target.value) : null
								}))
							})]
						}),
						!form.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 space-y-1.5 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Aulas já realizadas (histórico)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									inputMode: "numeric",
									min: 0,
									placeholder: "Ex.: 8",
									value: historicalSessions,
									onChange: (e) => setHistoricalSessions(e.target.value ? Number(e.target.value) : "")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground",
									children: [
										"Ao salvar, serão criadas automaticamente N aulas com status ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Realizada" }),
										" vinculadas a este pagamento (datadas retroativamente a partir da data do pagamento). Use para migrar alunos antigos sem precisar registrar aula por aula."
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
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
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data do pagamento *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: form.payment_date ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									payment_date: e.target.value
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Forma de pagamento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.payment_method ?? "pix",
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
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.status ?? "paid",
								onValueChange: (v) => setForm((f) => ({
									...f,
									status: v
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
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
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Vencimento" }), isBySession ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 p-2 text-xs text-muted-foreground",
								children: "📦 Plano por aula/pacote — vence automaticamente quando as aulas contratadas se esgotarem."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: form.due_date ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									due_date: e.target.value || null
								}))
							}), isMonthly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Plano mensal — vencimento calculado como 30 dias após a data do pagamento."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
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
					disabled: saving,
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: save,
					disabled: saving,
					className: "transition-all active:scale-[0.98]",
					children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), saving ? "Salvando…" : "Salvar"]
				})] })
			]
		})
	});
}
//#endregion
export { PTPaymentDialog as t };
