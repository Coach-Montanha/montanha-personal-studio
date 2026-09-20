import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { G as Plus, Z as Pencil, b as Trash2, wt as Layers } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { t as PageHeader } from "./PageHeader-CRue-aiN.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useScopeFilter } from "./use-scope-filter-q5Imal9c.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/programs-BmPKiqbf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PALETTE = [
	"var(--color-chart-1)",
	"var(--color-chart-4)",
	"var(--color-chart-3)",
	"var(--color-state-pending)",
	"var(--color-chart-2)",
	"var(--color-chart-7)",
	"var(--color-chart-5)",
	"var(--color-chart-6)",
	"var(--color-chart-8)"
];
function ProgramsPage() {
	const qc = useQueryClient();
	const { scopeId, scopeKey, ready } = useScopeFilter();
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const { data: programs = [] } = useQuery({
		queryKey: ["programs", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("programs").select("id, name, color, is_active").order("name");
			if (scopeId) q = q.eq("user_id", scopeId);
			const { data, error } = await q;
			if (error) throw error;
			return data ?? [];
		}
	});
	function openNew() {
		setEditing({
			name: "",
			color: PALETTE[0],
			is_active: true
		});
		setDialogOpen(true);
	}
	function openEdit(p) {
		setEditing(p);
		setDialogOpen(true);
	}
	async function save() {
		if (!editing?.name) return toast.error("Nome obrigatório");
		const { data: u } = await supabase.auth.getUser();
		if (!u.user) return;
		const payload = {
			user_id: scopeId ?? u.user.id,
			name: editing.name,
			color: editing.color ?? PALETTE[0],
			is_active: editing.is_active ?? true
		};
		const { error } = await (editing.id ? supabase.from("programs").update(payload).eq("id", editing.id) : supabase.from("programs").insert(payload));
		if (error) return toast.error(error.message);
		toast.success(editing.id ? "Programa atualizado" : "Programa criado");
		qc.invalidateQueries({ queryKey: ["programs", scopeKey] });
		setDialogOpen(false);
	}
	async function remove(id) {
		if (!await confirmDialog("Excluir este programa? As turmas vinculadas ficarão sem programa.")) return;
		const { error } = await supabase.from("programs").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Programa excluído");
		qc.invalidateQueries({ queryKey: ["programs", scopeKey] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				icon: Layers,
				eyebrow: "Studio",
				title: "Programas de Treino",
				description: "Agrupe suas turmas por modalidade (ex: Muay Thai, Funcional). Usado no controle de check-in por programa.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openNew,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Novo programa"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: programs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "col-span-full p-6 text-sm text-muted-foreground text-center",
					children: "Nenhum programa cadastrado ainda."
				}) : programs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-block h-5 w-5 rounded-full border",
							style: { backgroundColor: p.color ?? "var(--color-chart-1)" }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: p.is_active ? "Ativo" : "Inativo"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => openEdit(p),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => remove(p.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})]
					})]
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing?.id ? "Editar programa" : "Novo programa" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nome *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: editing?.name ?? "",
										onChange: (e) => setEditing((f) => ({
											...f,
											name: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: PALETTE.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setEditing((f) => ({
												...f,
												color: c
											})),
											className: `h-8 w-8 rounded-full border-2 ${editing?.color === c ? "border-foreground" : "border-transparent"}`,
											style: { backgroundColor: c },
											"aria-label": c
										}, c))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: editing?.is_active ?? true,
										onCheckedChange: (v) => setEditing((f) => ({
											...f,
											is_active: v
										}))
									}), "Ativo"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setDialogOpen(false),
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: save,
							children: "Salvar"
						})] })
					]
				})
			})
		]
	});
}
//#endregion
export { ProgramsPage as component };
