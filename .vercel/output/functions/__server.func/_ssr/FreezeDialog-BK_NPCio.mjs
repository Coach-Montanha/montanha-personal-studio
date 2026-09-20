import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { m as addDays, s as format } from "../_libs/date-fns.mjs";
import { a as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-iwNaZIEJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FreezeDialog-BK_NPCio.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FreezeDialog({ open, onOpenChange, studentId, paymentId, maxDays, planName, freeze, onUnfreeze }) {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({});
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setForm(freeze ?? {
			start_date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
			freeze_days: 7,
			notes: ""
		});
	}, [open, freeze]);
	const days = Number(form.freeze_days ?? 0);
	const computedEnd = form.start_date && days > 0 ? format(addDays(/* @__PURE__ */ new Date(form.start_date + "T00:00"), days), "yyyy-MM-dd") : "";
	async function save() {
		if (!form.start_date) return toast.error("Informe a data de início do trancamento");
		if (!days || days <= 0) return toast.error("Informe a quantidade de dias");
		if (maxDays && days > maxDays) return toast.error(`Este plano permite no máximo ${maxDays} dias de trancamento.`);
		setSaving(true);
		try {
			const { data: userData } = await supabase.auth.getUser();
			const userId = userData.user?.id;
			if (!userId) return;
			const { data: isPt } = await supabase.from("pt_students").select("id").eq("id", studentId).maybeSingle();
			if (isPt) await supabase.from("pt_students").update({ status: "paused" }).eq("id", studentId);
			else await supabase.from("students").update({ status: "paused" }).eq("id", studentId);
			const payload = {
				user_id: userId,
				student_id: studentId,
				payment_id: paymentId ?? null,
				freeze_days: days,
				start_date: form.start_date,
				end_date: computedEnd,
				notes: form.notes ?? null
			};
			if (form.id) {
				const { error } = await supabase.from("payment_freezes").update(payload).eq("id", form.id);
				if (error) return toast.error(error.message);
			} else {
				const { error } = await supabase.from("payment_freezes").insert(payload);
				if (error) return toast.error(error.message);
			}
			toast.success(form.id ? "Trancamento atualizado com sucesso!" : "Trancamento registrado com sucesso!");
			qc.invalidateQueries();
			onOpenChange(false);
		} catch (err) {
			toast.error(`Erro: ${err.message}`);
		} finally {
			setSaving(false);
		}
	}
	async function handleUnfreezeClick() {
		setSaving(true);
		try {
			const { data: isPt } = await supabase.from("pt_students").select("id").eq("id", studentId).maybeSingle();
			if (isPt) await supabase.from("pt_students").update({ status: "active" }).eq("id", studentId);
			else await supabase.from("students").update({ status: "active" }).eq("id", studentId);
			toast.success("Plano destrancado e aluno reativado!");
			if (onUnfreeze) onUnfreeze();
			qc.invalidateQueries();
			onOpenChange(false);
		} catch (err) {
			toast.error(`Erro ao destrancar: ${err.message}`);
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: form.id ? "Editar trancamento ativo" : "Trancar plano" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [planName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Plano: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: planName }),
					". "
				] }) : null, maxDays ? `Limite deste plano: ${maxDays} dias.` : "Ajuste o período do trancamento. O vencimento do plano será estendido proporcionalmente aos dias congelados."] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Início do trancamento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: form.start_date ?? "",
									onChange: (e) => setForm((f) => ({
										...f,
										start_date: e.target.value
									}))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Dias de trancamento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									max: maxDays ?? void 0,
									value: form.freeze_days ?? "",
									onChange: (e) => setForm((f) => ({
										...f,
										freeze_days: Number(e.target.value)
									}))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border bg-muted/40 p-3 text-xs",
							children: [
								"Prazo final do trancamento:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: computedEnd ? (/* @__PURE__ */ new Date(computedEnd + "T00:00")).toLocaleDateString("pt-BR") : "—" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: form.notes ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									notes: e.target.value
								})),
								placeholder: "Motivo do trancamento (opcional)"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "flex flex-col sm:flex-row justify-between gap-2",
					children: [form.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						className: "border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 mr-auto",
						onClick: handleUnfreezeClick,
						disabled: saving,
						children: "Destrancar Plano"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 justify-end ml-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => onOpenChange(false),
							disabled: saving,
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: save,
							disabled: saving,
							children: saving ? "Salvando..." : form.id ? "Salvar Alterações" : "Trancar Plano"
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { FreezeDialog as t };
