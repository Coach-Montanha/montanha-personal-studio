import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { In as ArrowRightLeft, _t as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BBA-r8Xh.mjs";
import { a as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as RadioGroupItem, t as RadioGroup } from "./radio-group-BJ3sdkEm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MigrateStudentsDialog-BYKLL37l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Migra alunos entre os módulos Studio e Personal Trainer.
* - copy: cria cópia no destino, mantém original ativo.
* - move: cria cópia no destino e apaga o original (o cascade remove pagamentos/contratos do origem).
* Sempre copia: perfil básico + account_user_id (mesmo login) + histórico de pagamentos + contratos.
*/
var migrateStudents = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input || !Array.isArray(input.ids) || input.ids.length === 0) throw new Error("Selecione ao menos 1 aluno");
	if (input.direction !== "studio_to_pt" && input.direction !== "pt_to_studio") throw new Error("Direção inválida");
	if (input.mode !== "move" && input.mode !== "copy") throw new Error("Modo inválido");
	return input;
}).handler(createSsrRpc("f9cdea59a0b6aafd3f0599a57347028affeb1fe16f7d159bdf963096a391dcb9"));
function MigrateStudentsDialog({ open, onOpenChange, ids, direction, onDone }) {
	const [mode, setMode] = (0, import_react.useState)("copy");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const migrate = useServerFn(migrateStudents);
	const qc = useQueryClient();
	const label = direction === "studio_to_pt" ? {
		from: "Studio",
		to: "Personal Trainer"
	} : {
		from: "Personal Trainer",
		to: "Studio"
	};
	const count = ids.length;
	async function submit() {
		setLoading(true);
		try {
			const res = await migrate({ data: {
				ids,
				direction,
				mode
			} });
			const okCount = res.results.length;
			const errCount = res.errors.length;
			if (okCount > 0) toast.success(mode === "move" ? `${okCount} aluno(s) movido(s) para ${label.to}` : `${okCount} aluno(s) copiado(s) para ${label.to}`);
			if (errCount > 0) toast.error(`${errCount} falha(s): ${res.errors[0].error}`);
			qc.invalidateQueries();
			onOpenChange(false);
			onDone?.();
		} catch (e) {
			toast.error(e?.message ?? "Erro ao migrar");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => loading ? null : onOpenChange(v),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "h-5 w-5" }),
					"Migrar ",
					count,
					" aluno(s) — ",
					label.from,
					" → ",
					label.to
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Serão copiados: perfil básico, acesso de login (mesma senha), histórico de pagamentos e contratos." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioGroup, {
				value: mode,
				onValueChange: (v) => setMode(v),
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-muted/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
						value: "copy",
						id: "mig-copy",
						className: "mt-0.5"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: "Copiar (duplicar)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								"Cria cadastro em ",
								label.to,
								" mantendo o original ativo em ",
								label.from,
								". Pagamentos aparecerão nos dois módulos."
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-muted/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
						value: "move",
						id: "mig-move",
						className: "mt-0.5"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: "Mover (converter)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								"Cria cadastro em ",
								label.to,
								" e remove do ",
								label.from,
								". Não pode ser desfeito."
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => onOpenChange(false),
				disabled: loading,
				children: "Cancelar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: submit,
				disabled: loading,
				children: [
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
					mode === "move" ? "Mover" : "Copiar",
					" ",
					count,
					" aluno(s)"
				]
			})] })
		] })
	});
}
//#endregion
export { MigrateStudentsDialog as t };
