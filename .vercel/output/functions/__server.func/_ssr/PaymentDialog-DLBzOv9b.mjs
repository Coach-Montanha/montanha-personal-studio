import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { S as Ticket, Sn as CalendarClock, U as RefreshCw, W as Receipt, _t as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { s as format } from "../_libs/date-fns.mjs";
import { r as currentMonthKey } from "./format-BT-nao3-.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Textarea } from "./textarea-iwNaZIEJ.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { n as usePaymentMethods } from "./use-payment-methods-Ch_8GI_2.mjs";
import { n as FormSection, t as Field } from "./FormSection-CxKu2XVA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PaymentDialog-DLBzOv9b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PaymentDialog({ open, onOpenChange, payment, defaultStudentId }) {
	const qc = useQueryClient();
	const { methods: paymentMethods, labelFor: pmLabel } = usePaymentMethods({ activeOnly: true });
	const { data: students = [] } = useQuery({
		queryKey: ["students-all"],
		queryFn: async () => {
			const { data } = await supabase.from("students").select("id,name").order("name");
			return data ?? [];
		}
	});
	const { data: plans = [] } = useQuery({
		queryKey: ["plans-all-payment-dialog"],
		queryFn: async () => {
			const { data } = await supabase.from("plans").select("id,name,price,billing_cycle,auto_renew,max_renewals,checkin_quota_type,checkin_quota_amount,package_valid_days").order("name");
			return data ?? [];
		}
	});
	/** Plano do tipo "pacote com validade em dias"? */
	function packageDays(plan) {
		if (!plan) return null;
		const days = Number(plan.package_valid_days ?? 0);
		return plan.checkin_quota_type === "package" && days > 0 ? days : null;
	}
	function computeDueDate(paymentDate, plan) {
		if (!paymentDate) return null;
		const d = /* @__PURE__ */ new Date(paymentDate + "T00:00:00");
		if (isNaN(d.getTime())) return null;
		const days = packageDays(plan);
		if (days != null) {
			d.setDate(d.getDate() + days);
			return format(d, "yyyy-MM-dd");
		}
		switch (plan?.billing_cycle) {
			case "monthly":
				d.setDate(d.getDate() + 30);
				break;
			case "quarterly":
				d.setMonth(d.getMonth() + 3);
				break;
			case "semiannual":
			case "semi_annual":
			case "biannual":
				d.setMonth(d.getMonth() + 6);
				break;
			case "annual":
			case "yearly":
				d.setFullYear(d.getFullYear() + 1);
				break;
			default: d.setDate(d.getDate() + 30);
		}
		return format(d, "yyyy-MM-dd");
	}
	const [form, setForm] = (0, import_react.useState)({});
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open) setForm(payment ?? {
			student_id: defaultStudentId,
			payment_date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
			reference_month: currentMonthKey(),
			payment_method: "pix",
			status: "paid"
		});
	}, [
		open,
		payment,
		defaultStudentId
	]);
	const planMap = (0, import_react.useMemo)(() => Object.fromEntries(plans.map((p) => [p.id, p])), [plans]);
	const selectedPlan = form.plan_id ? planMap[form.plan_id] : null;
	const pkgDays = packageDays(selectedPlan);
	const suggestedDue = (0, import_react.useMemo)(() => selectedPlan ? computeDueDate(form.payment_date, selectedPlan) : null, [selectedPlan, form.payment_date]);
	const dueMismatch = Boolean(suggestedDue && form.due_date && form.due_date !== suggestedDue);
	const dueLabel = form.due_date ? format(/* @__PURE__ */ new Date(`${form.due_date}T00:00:00`), "dd/MM/yyyy") : null;
	async function save() {
		if (!form.student_id || !form.amount || !form.payment_date || !form.reference_month) {
			toast.error("Preencha os campos obrigatórios");
			return;
		}
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) return;
		const basePayload = {
			student_id: form.student_id,
			plan_id: form.plan_id || null,
			amount: Number(form.amount),
			payment_date: form.payment_date,
			due_date: form.due_date || null,
			reference_month: form.reference_month,
			payment_method: form.payment_method ?? "pix",
			status: form.status ?? "paid",
			notes: form.notes ?? null
		};
		let insertPayload = {
			...basePayload,
			user_id: userId
		};
		if (!form.id && form.plan_id) {
			const plan = planMap[form.plan_id];
			if (plan?.auto_renew) {
				insertPayload.auto_renew = true;
				if (plan.max_renewals != null) insertPayload.renewals_remaining = Number(plan.max_renewals);
			}
		}
		const res = form.id ? await supabase.from("payments").update(basePayload).eq("id", form.id).select("id") : await supabase.from("payments").insert(insertPayload).select("id");
		if (res.error) return toast.error(res.error.message);
		if (!res.data || res.data.length === 0) return toast.error("Nada foi salvo. Você não tem permissão para editar este pagamento.");
		toast.success(form.id ? "Pagamento atualizado" : "Pagamento registrado");
		qc.invalidateQueries();
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			"data-testid": "dialog-payment",
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: form.id ? "Editar pagamento" : "Novo pagamento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: form.id ? "Ajuste os dados deste lançamento." : "Registre um pagamento e vincule ao plano do aluno." })]
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
							title: "Aluno e plano",
							divided: false,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								full: true,
								label: "Aluno *",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.student_id,
									onValueChange: (v) => setForm((f) => ({
										...f,
										student_id: v
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										"data-testid": "select-payment-student",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: students.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s.id,
										children: s.name
									}, s.id)) })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
								full: true,
								label: "Plano",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.plan_id ?? "none",
									onValueChange: (v) => {
										const planId = v === "none" ? null : v;
										const plan = planId ? planMap[planId] : null;
										setForm((f) => ({
											...f,
											plan_id: planId,
											amount: f.amount ?? (plan ? Number(plan.price ?? 0) : f.amount),
											due_date: plan ? computeDueDate(f.payment_date, plan) : f.due_date
										}));
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										"data-testid": "select-payment-plan",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Sem plano" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "none",
										children: "Sem plano"
									}), plans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: p.id,
										children: p.name
									}, p.id))] })]
								}), pkgDays != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-1.5 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-caption font-medium text-primary ring-1 ring-inset ring-primary/15",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, {
												className: "h-3.5 w-3.5",
												"aria-hidden": true
											}),
											Number(selectedPlan?.checkin_quota_amount ?? 0),
											" check-ins"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-caption font-medium text-muted-foreground ring-1 ring-inset ring-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, {
												className: "h-3.5 w-3.5",
												"aria-hidden": true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tabular-nums",
												children: pkgDays
											}),
											" dias de validade"
										]
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
							title: "Valores e datas",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Valor (R$) *",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										"data-testid": "input-payment-amount",
										type: "number",
										step: "0.01",
										inputMode: "decimal",
										value: form.amount ?? "",
										onChange: (e) => setForm((f) => ({
											...f,
											amount: Number(e.target.value)
										}))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Mês de referência *",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										"data-testid": "input-payment-reference-month",
										type: "month",
										value: form.reference_month ?? "",
										onChange: (e) => setForm((f) => ({
											...f,
											reference_month: e.target.value
										}))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Data do pagamento *",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										"data-testid": "input-payment-date",
										type: "date",
										value: form.payment_date ?? "",
										onChange: (e) => setForm((f) => {
											const plan = f.plan_id ? planMap[f.plan_id] : null;
											return {
												...f,
												payment_date: e.target.value,
												due_date: plan ? computeDueDate(e.target.value, plan) : f.due_date
											};
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
									full: pkgDays != null,
									label: "Vencimento",
									hint: pkgDays != null ? `Pacote: validade de ${pkgDays} dias a partir do pagamento.` : "Calculado pelo ciclo do plano — pode ajustar.",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: form.due_date ?? "",
											onChange: (e) => setForm((f) => ({
												...f,
												due_date: e.target.value
											}))
										}),
										dueLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-1.5 pt-1 text-caption text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, {
												className: "h-3.5 w-3.5 shrink-0",
												"aria-hidden": true
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"Vence em ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium tabular-nums text-foreground",
													children: dueLabel
												}),
												pkgDays != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "tabular-nums",
													children: [
														" · ",
														pkgDays,
														" dias"
													]
												})
											] })]
										}),
										dueMismatch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex flex-col gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 sm:flex-row sm:items-center sm:justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-caption leading-relaxed text-foreground",
												children: [
													"Data diferente da sugerida pelo plano",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "tabular-nums",
														children: [
															" (",
															format(/* @__PURE__ */ new Date(`${suggestedDue}T00:00:00`), "dd/MM/yyyy"),
															")"
														]
													}),
													"."
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												size: "sm",
												variant: "outline",
												className: "w-full shrink-0 transition-colors duration-200 sm:w-auto",
												onClick: () => setForm((f) => ({
													...f,
													due_date: suggestedDue
												})),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
													className: "mr-1.5 h-3.5 w-3.5",
													"aria-hidden": true
												}), "Recalcular"]
											})]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
							title: "Situação",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Forma de pagamento",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.payment_method ?? "pix",
										onValueChange: (v) => setForm((f) => ({
											...f,
											payment_method: v
										})),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											"data-testid": "select-payment-method",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (paymentMethods.length > 0 ? paymentMethods.map((m) => ({
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
										}, m.key)) })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Status",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.status ?? "paid",
										onValueChange: (v) => setForm((f) => ({
											...f,
											status: v
										})),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											"data-testid": "select-payment-status",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
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
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									full: true,
									label: "Notas",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										"data-testid": "input-payment-notes",
										rows: 2,
										placeholder: "Observações internas (opcional)",
										value: form.notes ?? "",
										onChange: (e) => setForm((f) => ({
											...f,
											notes: e.target.value
										}))
									})
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					"data-testid": "button-cancel-payment",
					variant: "outline",
					onClick: () => onOpenChange(false),
					disabled: saving,
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					"data-testid": "button-save-payment",
					className: "transition-all active:scale-[0.98]",
					onClick: async () => {
						setSaving(true);
						try {
							await save();
						} finally {
							setSaving(false);
						}
					},
					disabled: saving,
					children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), saving ? "Salvando…" : "Salvar"]
				})] })
			]
		})
	});
}
//#endregion
export { PaymentDialog as t };
