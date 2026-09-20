import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { G as Plus, Tt as KeyRound, Zt as Copy, p as UserCog } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Badge } from "./badge-DB22ix_c.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DEnZ0u5J.mjs";
import { t as EmptyState } from "./EmptyState-DK3vCNbs.mjs";
import { a as formatDateBR } from "./format-BT-nao3-.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { t as Checkbox } from "./checkbox-kt6FvQcE.mjs";
import { t as IMPERSONATE_STORAGE_KEY } from "./use-impersonate-D1wFi3Sj.mjs";
import { a as setTenantModule, i as resetTrainerPassword, n as impersonateTrainer, r as listTenants, t as createTrainer } from "./tenants.functions-VB-HjL2R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenants-D_i4ebqh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MODULES = [
	{
		key: "studio",
		label: "Studio"
	},
	{
		key: "pt",
		label: "Personal Trainer"
	},
	{
		key: "financeiro",
		label: "Financeiro"
	},
	{
		key: "crm",
		label: "CRM"
	}
];
function TenantsPage() {
	const qc = useQueryClient();
	const listFn = useServerFn(listTenants);
	const createFn = useServerFn(createTrainer);
	const setModuleFn = useServerFn(setTenantModule);
	const resetFn = useServerFn(resetTrainerPassword);
	const impersonateFn = useServerFn(impersonateTrainer);
	useNavigate();
	const { data: tenants, isLoading } = useQuery({
		queryKey: ["admin-tenants"],
		queryFn: () => listFn()
	});
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [selMods, setSelMods] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [credentials, setCredentials] = (0, import_react.useState)(null);
	async function handleCreate() {
		if (!email.includes("@")) return toast.error("E-mail inválido");
		setCreating(true);
		try {
			const res = await createFn({ data: {
				email: email.trim(),
				modules: Array.from(selMods)
			} });
			setCredentials({
				email: res.email,
				tempPassword: res.tempPassword
			});
			setCreateOpen(false);
			setEmail("");
			setSelMods(/* @__PURE__ */ new Set());
			qc.invalidateQueries({ queryKey: ["admin-tenants"] });
			toast.success("Treinador criado");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Falha ao criar");
		} finally {
			setCreating(false);
		}
	}
	async function toggleModule(userId, module, active, expiresAt) {
		try {
			await setModuleFn({ data: {
				userId,
				module,
				active,
				expiresAt
			} });
			qc.invalidateQueries({ queryKey: ["admin-tenants"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Falha");
		}
	}
	async function handleReset(userId, email) {
		try {
			setCredentials({
				email,
				tempPassword: (await resetFn({ data: { userId } })).tempPassword
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Falha");
		}
	}
	async function handleImpersonate(userId, email) {
		try {
			const { data: sessionRes } = await supabase.auth.getSession();
			const superEmail = sessionRes.session?.user.email ?? "super admin";
			const { tokenHash, targetEmail } = await impersonateFn({ data: { userId } });
			const { error } = await supabase.auth.verifyOtp({
				token_hash: tokenHash,
				type: "magiclink"
			});
			if (error) throw error;
			localStorage.setItem(IMPERSONATE_STORAGE_KEY, JSON.stringify({
				targetEmail,
				targetUserId: userId,
				superAdminEmail: superEmail,
				startedAt: Date.now()
			}));
			await qc.cancelQueries();
			qc.clear();
			toast.success(`Você está visualizando como ${email}`);
			window.location.assign("/");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Falha ao entrar como treinador");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold",
					children: "Treinadores"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Gerencie contas de treinadores e módulos contratados."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setCreateOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Novo treinador"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "overflow-hidden",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-sm text-muted-foreground",
					children: "Carregando…"
				}) : !tenants || tenants.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Nenhum treinador",
					description: "Crie o primeiro treinador acima."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "E-mail" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Papel" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Criado" }),
						MODULES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-center",
							children: m.label
						}, m.key)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Ações"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: tenants.map((t) => {
						const isSuper = t.roles.includes("super_admin");
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-medium",
								children: t.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: isSuper ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "default",
								children: "super admin"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: "admin"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-xs text-muted-foreground",
								children: t.createdAt ? formatDateBR(t.createdAt) : "—"
							}),
							MODULES.map((m) => {
								const row = t.modules.find((x) => x.module === m.key);
								const active = !!row?.active;
								const expired = row?.expires_at ? new Date(row.expires_at).getTime() < Date.now() : false;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-center",
									children: isSuper ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: "todos"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: active && !expired,
											onCheckedChange: (v) => toggleModule(t.userId, m.key, v, row?.expires_at ?? null)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											className: "h-7 w-32 text-xs",
											value: row?.expires_at ? row.expires_at.slice(0, 10) : "",
											onChange: (e) => {
												const v = e.target.value ? (/* @__PURE__ */ new Date(e.target.value + "T23:59:59")).toISOString() : null;
												toggleModule(t.userId, m.key, active, v);
											},
											title: "Validade (opcional)"
										})]
									})
								}, m.key);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								children: !isSuper && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap justify-end gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => handleImpersonate(t.userId, t.email),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "mr-1 h-3 w-3" }), " Entrar como"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => handleReset(t.userId, t.email),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "mr-1 h-3 w-3" }), " Nova senha"]
									})]
								})
							})
						] }, t.userId);
					}) })] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Novo treinador" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "E-mail" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "treinador@exemplo.com"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Módulos contratados" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 grid grid-cols-2 gap-2",
							children: MODULES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 rounded-md border p-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: selMods.has(m.key),
									onCheckedChange: (v) => {
										const next = new Set(selMods);
										if (v) next.add(m.key);
										else next.delete(m.key);
										setSelMods(next);
									}
								}), m.label]
							}, m.key))
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setCreateOpen(false),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: handleCreate,
						disabled: creating,
						children: creating ? "Criando…" : "Criar"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!credentials,
				onOpenChange: (o) => !o && setCredentials(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Credenciais geradas" }) }),
					credentials && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Salve ou envie estas credenciais agora. Elas não serão mostradas novamente."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md bg-muted p-3 font-mono text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["E-mail: ", credentials.email] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Senha: ", credentials.tempPassword] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									navigator.clipboard.writeText(`E-mail: ${credentials.email}\nSenha: ${credentials.tempPassword}`);
									toast.success("Copiado");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-2 h-3 w-3" }), " Copiar"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setCredentials(null),
						children: "Fechar"
					}) })
				] })
			})
		]
	});
}
//#endregion
export { TenantsPage as component };
