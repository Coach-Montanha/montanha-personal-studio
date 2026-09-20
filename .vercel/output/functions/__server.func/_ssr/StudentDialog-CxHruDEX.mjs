import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Dt as Info, Ht as Eye, In as ArrowRightLeft, Tt as KeyRound, U as RefreshCw, Ut as EyeOff, W as Receipt, Zt as Copy, _t as LoaderCircle, hn as Check, mn as ChevronDown } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { a as formatDateBR, c as formatPhoneBR, i as formatBRL, o as formatMonthLabel } from "./format-BT-nao3-.mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BBA-r8Xh.mjs";
import { t as PaymentStatusBadge } from "./Badges-BwuNwA-M.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-iwNaZIEJ.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { n as FormSection, t as Field } from "./FormSection-CxKu2XVA.mjs";
import { t as MigrateStudentsDialog } from "./MigrateStudentsDialog-BYKLL37l.mjs";
import { n as CollapsibleTrigger$1, r as Root, t as CollapsibleContent$1 } from "../_libs/radix-ui__react-collapsible.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StudentDialog-CxHruDEX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Admin cria a conta de login para um aluno já cadastrado.
* Retorna a senha temporária gerada.
*/
var createStudentAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.studentId) throw new Error("studentId requerido");
	if (!input.email || !input.email.includes("@")) throw new Error("email inválido");
	return input;
}).handler(createSsrRpc("71728a3b2f750513f96be6b8fb8ebca8e18d608e9ec31b3f6bc953a89f523242"));
var Collapsible = Root;
var CollapsibleTrigger = CollapsibleTrigger$1;
var CollapsibleContent = CollapsibleContent$1;
var OPTIONAL_KEYS = [
	"cpf",
	"rg",
	"start_date",
	"address",
	"postal_code",
	"neighborhood",
	"city",
	"state",
	"country",
	"notes"
];
function StudentDialog({ open, onOpenChange, student }) {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [migrateOpen, setMigrateOpen] = (0, import_react.useState)(false);
	const [showMore, setShowMore] = (0, import_react.useState)(false);
	const optionalFilled = OPTIONAL_KEYS.filter((k) => {
		const v = form[k];
		return typeof v === "string" ? v.trim().length > 0 : v != null;
	}).length;
	(0, import_react.useEffect)(() => {
		if (open) {
			const next = student ?? { status: "active" };
			setForm(next);
			setShowMore(OPTIONAL_KEYS.some((k) => {
				const v = next[k];
				return typeof v === "string" ? v.trim().length > 0 : v != null;
			}));
		}
	}, [open, student]);
	async function save() {
		if (!form.name?.trim()) return toast.error("Nome obrigatório");
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) return;
		setSaving(true);
		try {
			const payload = {
				user_id: userId,
				name: form.name.trim(),
				email: form.email?.trim() || null,
				phone: form.phone?.trim() || null,
				status: form.status ?? "active",
				notes: form.notes?.trim() || null,
				birth_date: form.birth_date ?? null,
				attendance_offset: Math.max(0, Math.floor(Number(form.attendance_offset ?? 0) || 0)),
				cpf: form.cpf?.trim() || null,
				rg: form.rg?.trim() || null,
				start_date: form.start_date ?? null,
				address: form.address?.trim() || null,
				postal_code: form.postal_code?.trim() || null,
				neighborhood: form.neighborhood?.trim() || null,
				city: form.city?.trim() || null,
				state: form.state?.trim() || null,
				country: form.country?.trim() || null
			};
			form.id;
			if (form.id) {
				const { error } = await supabase.from("students").update(payload).eq("id", form.id);
				if (error) throw error;
			} else {
				const { data, error } = await supabase.from("students").insert(payload).select("id").single();
				if (error) throw error;
				data.id;
			}
			toast.success(form.id ? "Aluno atualizado" : "Aluno criado");
			qc.invalidateQueries();
			onOpenChange(false);
		} catch (err) {
			toast.error(err.message || "Erro ao salvar aluno");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			"data-testid": "dialog-student",
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: form.id ? "Editar aluno" : "Novo aluno" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: form.id ? "Atualize os dados cadastrais e o acesso do aluno." : "Preencha os dados básicos. O restante pode ser completado depois." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
							divided: false,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Nome *",
									full: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										"data-testid": "input-student-name",
										value: form.name ?? "",
										onChange: (e) => setForm((f) => ({
											...f,
											name: e.target.value
										}))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Email",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										"data-testid": "input-student-email",
										type: "email",
										value: form.email ?? "",
										onChange: (e) => setForm((f) => ({
											...f,
											email: e.target.value
										}))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Telefone",
									hint: "DDD + número. Aceita fixo ou celular.",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										"data-testid": "input-student-phone",
										type: "tel",
										inputMode: "tel",
										autoComplete: "tel",
										placeholder: "(11) 98765-4321",
										value: form.phone ?? "",
										onChange: (e) => setForm((f) => ({
											...f,
											phone: formatPhoneBR(e.target.value)
										}))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Data de nascimento",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										"data-testid": "input-student-birthdate",
										type: "date",
										value: form.birth_date ?? "",
										onChange: (e) => setForm((f) => ({
											...f,
											birth_date: e.target.value
										}))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Status",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.status ?? "active",
										onValueChange: (v) => setForm((f) => ({
											...f,
											status: v
										})),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											"data-testid": "select-student-status",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
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
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									full: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-caption flex gap-2.5 rounded-lg border border-dashed border-border bg-surface-sunken p-3 text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"O plano do aluno é definido automaticamente a partir dos pagamentos registrados. Para vincular ou alterar o plano, registre um pagamento na aba ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "font-semibold text-foreground",
												children: "Pagamentos"
											}),
											"."
										] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Aulas já realizadas (histórico anterior)",
									hint: "Use para importar contagens de aulas feitas em outro sistema. Esse valor é somado às aulas registradas aqui.",
									full: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										inputMode: "numeric",
										min: 0,
										step: 1,
										value: form.attendance_offset ?? 0,
										onChange: (e) => setForm((f) => ({
											...f,
											attendance_offset: e.target.value === "" ? 0 : Math.max(0, Math.floor(Number(e.target.value)))
										}))
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Collapsible, {
							open: showMore,
							onOpenChange: setShowMore,
							className: "border-t border-dashed border-border pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "group flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" }), showMore ? "Menos informações" : "Mais informações"]
									}), optionalFilled > 0 && !showMore && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary",
										children: [
											optionalFilled,
											" preenchido",
											optionalFilled > 1 ? "s" : ""
										]
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CollapsibleContent, {
								className: "space-y-5 overflow-hidden pt-2 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
									title: "Informações pessoais (opcional)",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "CPF",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												inputMode: "numeric",
												placeholder: "000.000.000-00",
												value: form.cpf ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													cpf: e.target.value
												}))
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "RG",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: form.rg ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													rg: e.target.value
												}))
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Data de início",
											full: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "date",
												value: form.start_date ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													start_date: e.target.value
												}))
											})
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormSection, {
									title: "Endereço (opcional)",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Endereço",
											full: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Rua, número, complemento",
												value: form.address ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													address: e.target.value
												}))
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "CEP",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												inputMode: "numeric",
												placeholder: "00000-000",
												value: form.postal_code ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													postal_code: e.target.value
												}))
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Bairro",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: form.neighborhood ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													neighborhood: e.target.value
												}))
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Cidade",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: form.city ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													city: e.target.value
												}))
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Estado",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "UF",
												maxLength: 2,
												value: form.state ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													state: e.target.value.toUpperCase()
												}))
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "País",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: form.country ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													country: e.target.value
												}))
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Observações gerais",
											full: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												rows: 2,
												placeholder: "Ex: restrições médicas, objetivos, observações",
												value: form.notes ?? "",
												onChange: (e) => setForm((f) => ({
													...f,
													notes: e.target.value
												}))
											})
										})
									]
								})]
							})]
						}),
						form.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t border-border pt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentPaymentsSection, { studentId: form.id })
						}),
						form.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t border-border pt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAccessSection, {
								studentId: form.id,
								accountUserId: form.account_user_id ?? null,
								defaultEmail: form.email ?? ""
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2 sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: form.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => setMigrateOpen(true),
						disabled: saving,
						className: "w-full gap-2 sm:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "h-4 w-4" }), "Migrar para PT"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col-reverse gap-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							"data-testid": "button-cancel-student",
							variant: "outline",
							onClick: () => onOpenChange(false),
							disabled: saving,
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							"data-testid": "button-save-student",
							onClick: save,
							disabled: saving,
							className: "transition-all active:scale-[0.98]",
							children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), saving ? "Salvando…" : "Salvar"]
						})]
					})]
				})
			]
		}), form.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MigrateStudentsDialog, {
			open: migrateOpen,
			onOpenChange: setMigrateOpen,
			ids: [form.id],
			direction: "studio_to_pt",
			onDone: () => onOpenChange(false)
		})]
	});
}
function StudentAccessSection({ studentId, accountUserId, defaultEmail }) {
	const [email, setEmail] = (0, import_react.useState)(defaultEmail);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [creds, setCreds] = (0, import_react.useState)(null);
	const [revealing, setRevealing] = (0, import_react.useState)(false);
	const [reveal, setReveal] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const createAccount = useServerFn(createStudentAccount);
	const qc = useQueryClient();
	function buildMessage(email, tempPassword) {
		return `✅ Acesso criado — envie ao aluno:
Email: ${email}
Senha temporária: ${tempPassword}
Não troque a senha ainda

📱 Acesse o Studio Coach Montanha como um app no seu celular
Assim você abre direto pelo ícone, em tela cheia, sem precisar procurar o link toda vez.
🔗 https://studiocoachmontanha.lovable.app

No Android (Chrome)
Abra o link no Chrome
Toque no menu ⋮ (canto superior direito)
Toque em Instalar app (ou "Adicionar à tela inicial")
Confirme — pronto! 🎉

No iPhone / iPad (precisa ser pelo Safari)
Abra o link no Safari
Toque no botão Compartilhar (quadrado com uma seta ↑)
Role e toque em Adicionar à Tela de Início
Toque em Adicionar — pronto! 🎉

Depois é só usar seu e-mail e senha para entrar. Qualquer dúvida, me chama por aqui! 💪`;
	}
	async function loadCreds() {
		setRevealing(true);
		try {
			const { data, error } = await supabase.rpc("get_student_credentials", { _student_id: studentId }).maybeSingle();
			if (error) throw error;
			if (!data?.temp_password) {
				toast.error("Senha temporária indisponível para este aluno");
				return;
			}
			setCreds({
				email: data.email ?? "",
				tempPassword: data.temp_password
			});
			setReveal(true);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setRevealing(false);
		}
	}
	async function copy(kind, value) {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(kind);
			setTimeout(() => setCopied(null), 1500);
		} catch {
			toast.error("Não foi possível copiar");
		}
	}
	async function handle() {
		if (!email.includes("@")) return toast.error("Email inválido");
		if (accountUserId && !await confirmDialog("Gerar uma nova senha temporária? A senha atual do aluno será substituída.")) return;
		setLoading(true);
		try {
			const res = await createAccount({ data: {
				studentId,
				email
			} });
			setCreds({
				email: res.email,
				tempPassword: res.tempPassword
			});
			setReveal(true);
			qc.invalidateQueries();
			toast.success(res.reset ? "Senha redefinida!" : "Acesso criado!");
		} catch (e) {
			toast.error(e.message);
		} finally {
			setLoading(false);
		}
	}
	const isReset = !!accountUserId;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-sm font-medium",
						children: isReset ? "Acesso do aluno" : "Criar acesso do aluno"
					}),
					isReset && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success",
						children: "Ativo"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "email",
					value: email,
					onChange: (e) => setEmail(e.target.value),
					placeholder: "email@aluno.com",
					className: "h-11 sm:h-10"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handle,
					disabled: loading,
					variant: isReset ? "outline" : "default",
					className: "h-11 gap-2 transition-all duration-200 sm:h-10",
					children: [isReset ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }) : null, loading ? isReset ? "Redefinindo…" : "Criando…" : isReset ? "Redefinir senha" : "Gerar acesso"]
				})]
			}),
			isReset && !creds && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "ghost",
				size: "sm",
				onClick: loadCreds,
				disabled: revealing,
				className: "h-9 gap-2 px-2 text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), revealing ? "Carregando…" : "Ver senha atual"]
			}),
			creds && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border/60 bg-gradient-to-br from-card via-card to-muted/30 p-4 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Credenciais do aluno"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: () => setReveal((v) => !v),
							className: "h-8 gap-1.5 px-2 text-xs transition-colors duration-200",
							children: [reveal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), reveal ? "Ocultar" : "Mostrar"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CredRow, {
							label: "Email",
							value: creds.email,
							masked: false,
							onCopy: () => copy("email", creds.email),
							copied: copied === "email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CredRow, {
							label: "Senha temporária",
							value: creds.tempPassword,
							masked: !reveal,
							mono: true,
							onCopy: () => copy("password", creds.tempPassword),
							copied: copied === "password"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-md border border-border/60 bg-background/60 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Mensagem para o aluno"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								onClick: () => copy("message", buildMessage(creds.email, creds.tempPassword)),
								className: "h-8 gap-1.5 px-2 text-xs",
								children: [copied === "message" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), copied === "message" ? "Copiada" : "Copiar mensagem"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "max-h-48 overflow-auto whitespace-pre-wrap break-words font-sans text-[11px] leading-relaxed text-foreground",
							children: buildMessage(creds.email, creds.tempPassword)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[11px] leading-relaxed text-muted-foreground",
						children: "O aluno pode alterar a senha após entrar. Esta senha fica armazenada aqui como referência até uma próxima redefinição."
					})
				]
			}),
			!isReset && !creds && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Gera login e senha temporária para o aluno acessar o portal."
			})
		]
	});
}
function CredRow({ label, value, masked, mono, onCopy, copied }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group flex items-center gap-2 rounded-md border border-border/50 bg-background/60 px-3 py-2 transition-colors duration-200 hover:border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `truncate text-sm text-foreground ${mono ? "font-mono tracking-wider" : ""}`,
				children: masked ? "••••••••" : value || "—"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "ghost",
			size: "icon",
			onClick: onCopy,
			disabled: masked || !value,
			"aria-label": `Copiar ${label}`,
			className: "h-9 w-9 shrink-0 transition-all duration-200 hover:bg-primary/10 hover:text-primary disabled:opacity-40",
			children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })
		})]
	});
}
function StudentPaymentsSection({ studentId }) {
	const { data: payments = [], isLoading } = useQuery({
		queryKey: ["student-dialog-payments", studentId],
		queryFn: async () => {
			const { data, error } = await supabase.from("payments").select("id,amount,payment_date,reference_month,status,plans(name)").eq("student_id", studentId).order("payment_date", { ascending: false }).limit(50);
			if (error) throw error;
			return data ?? [];
		}
	});
	const total = payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-sm font-medium",
					children: "Pagamentos anteriores"
				})]
			}), payments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted-foreground",
				children: [
					payments.length,
					" registro",
					payments.length === 1 ? "" : "s",
					" · Total pago:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono font-medium text-foreground",
						children: formatBRL(total)
					})
				]
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "Carregando…"
		}) : payments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "Nenhum pagamento registrado."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-h-56 overflow-y-auto rounded-md border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "sticky top-0 bg-muted/60 text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 text-left font-medium",
							children: "Data"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 text-left font-medium",
							children: "Referência"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 text-left font-medium",
							children: "Plano"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 text-right font-medium",
							children: "Valor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 text-left font-medium",
							children: "Status"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-1.5 font-mono",
							children: formatDateBR(p.payment_date)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-1.5",
							children: p.reference_month ? formatMonthLabel(p.reference_month) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-1.5",
							children: p.plans?.name ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-1.5 text-right font-mono",
							children: formatBRL(p.amount)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentStatusBadge, { status: p.status })
						})
					]
				}, p.id)) })]
			})
		})]
	});
}
//#endregion
export { StudentDialog as t };
