import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Ht as Eye, In as ArrowRightLeft, Kt as Dumbbell, Tt as KeyRound, U as RefreshCw, Ut as EyeOff, Zt as Copy, hn as Check, s as Users, u as UserRound, yn as Calendar } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { i as DialogFooter, n as DialogContent, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { s as format } from "../_libs/date-fns.mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BBA-r8Xh.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as confirmDialog } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-iwNaZIEJ.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { i as syncDuoPartners, n as buildStudentPartnerNotes, r as parseStudentPartner, t as addSessionToCalendar } from "./pt-duo-Dbaj7St1.mjs";
import { t as DialogHeadline } from "./DialogHeadline-BQ9h1Ac-.mjs";
import { t as MigrateStudentsDialog } from "./MigrateStudentsDialog-BYKLL37l.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PTSessionDialog-z5VbvOau.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Admin cria (ou redefine) a conta de login para um aluno de Personal Trainer.
* Retorna a senha temporária gerada.
*/
var createPTStudentAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.studentId) throw new Error("studentId requerido");
	if (!input.email || !input.email.includes("@")) throw new Error("email inválido");
	return input;
}).handler(createSsrRpc("a6d2248b5dfb3cafdb231315238bcf5277959b56cb4315797f33bb9e78cbc53c"));
function PTStudentDialog({ open, onOpenChange, student }) {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({});
	const [migrateOpen, setMigrateOpen] = (0, import_react.useState)(false);
	const [partnerId, setPartnerId] = (0, import_react.useState)(null);
	const [initialPartnerId, setInitialPartnerId] = (0, import_react.useState)(null);
	const { data: allStudents = [] } = useQuery({
		queryKey: ["pt-students-partner-options"],
		enabled: open,
		queryFn: async () => {
			const { data } = await supabase.from("pt_students").select("id,name,status").is("deleted_at", null).order("name");
			return data ?? [];
		}
	});
	(0, import_react.useEffect)(() => {
		if (open) {
			const parsed = parseStudentPartner(student?.notes);
			setForm(student ? {
				...student,
				notes: parsed.cleanNotes
			} : { status: "active" });
			setPartnerId(parsed.partnerId);
			setInitialPartnerId(parsed.partnerId);
		}
	}, [open, student]);
	async function save() {
		if (!form.name) return toast.error("Nome obrigatório");
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) return;
		const finalNotes = buildStudentPartnerNotes(form.notes, partnerId);
		const payload = {
			user_id: userId,
			name: form.name,
			email: form.email ?? null,
			phone: form.phone ?? null,
			birth_date: form.birth_date || null,
			goal: form.goal ?? null,
			health_notes: form.health_notes ?? null,
			status: form.status ?? "active",
			start_date: form.start_date || null,
			notes: finalNotes || null
		};
		const { data: savedData, error } = await (form.id ? supabase.from("pt_students").update(payload).eq("id", form.id).select("id").single() : supabase.from("pt_students").insert(payload).select("id").single());
		if (error) return toast.error(error.message);
		const savedId = form.id || savedData?.id;
		if (savedId) await syncDuoPartners(savedId, initialPartnerId, partnerId);
		toast.success(form.id ? "Aluno atualizado" : "Aluno PT criado");
		qc.invalidateQueries();
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeadline, {
				icon: UserRound,
				title: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: form.id ? "Editar aluno PT" : "Novo aluno PT" }),
				description: "Dados pessoais, contato e vínculo com o plano PT."
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
						className: "col-span-2 space-y-1.5 sm:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: form.email ?? "",
							onChange: (e) => setForm((f) => ({
								...f,
								email: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5 sm:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Telefone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.phone ?? "",
							onChange: (e) => setForm((f) => ({
								...f,
								phone: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5 sm:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data de nascimento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: form.birth_date ?? "",
							onChange: (e) => setForm((f) => ({
								...f,
								birth_date: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5 sm:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data de início" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: form.start_date ?? "",
							onChange: (e) => setForm((f) => ({
								...f,
								start_date: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5 sm:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.status ?? "active",
							onValueChange: (v) => setForm((f) => ({
								...f,
								status: v
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "active",
									children: "Ativo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "paused",
									children: "Pausado"
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
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Objetivo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: form.goal ?? "",
							onChange: (e) => setForm((f) => ({
								...f,
								goal: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações de saúde / restrições" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: form.health_notes ?? "",
							onChange: (e) => setForm((f) => ({
								...f,
								health_notes: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5 rounded-lg border border-primary/20 bg-primary/5 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "font-semibold text-primary",
									children: "Treino em Dupla / Plano Compartilhado"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Selecione o parceiro(a) de treino. Ambos compartilharão o saldo do pacote e poderão registrar presença conjunta debitando apenas 1 aula."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: partnerId ?? "none",
									onValueChange: (val) => setPartnerId(val === "none" ? null : val),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Nenhum (treina individualmente)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "none",
										children: "Nenhum (treina individualmente)"
									}), allStudents.filter((s) => s.id !== form.id).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s.id,
										children: s.name
									}, s.id))] })]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notas internas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: form.notes ?? "",
							onChange: (e) => setForm((f) => ({
								...f,
								notes: e.target.value
							}))
						})]
					}),
					form.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-2 border-t pt-3 mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PTStudentAccessSection, {
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
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "h-4 w-4" }), "Migrar para Studio"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: save,
						children: "Salvar"
					})]
				})]
			})
		] }), form.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MigrateStudentsDialog, {
			open: migrateOpen,
			onOpenChange: setMigrateOpen,
			ids: [form.id],
			direction: "pt_to_studio",
			onDone: () => onOpenChange(false)
		})]
	});
}
function PTStudentAccessSection({ studentId, accountUserId, defaultEmail }) {
	const [email, setEmail] = (0, import_react.useState)(defaultEmail);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [revealing, setRevealing] = (0, import_react.useState)(false);
	const [creds, setCreds] = (0, import_react.useState)(null);
	const [reveal, setReveal] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const createAccount = useServerFn(createPTStudentAccount);
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

No portal você verá suas informações pessoais e o seu plano de treino do Personal. Qualquer dúvida, me chama por aqui! 💪`;
	}
	async function loadCreds() {
		setRevealing(true);
		try {
			const { data, error } = await supabase.rpc("get_pt_student_credentials", { _student_id: studentId }).maybeSingle();
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
	async function handle() {
		if (!email.includes("@")) return toast.error("Email inválido");
		if (accountUserId && !await confirmDialog("Gerar nova senha temporária? A senha atual será substituída.")) return;
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
	async function copy(kind, value) {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(kind);
			setTimeout(() => setCopied(null), 1500);
		} catch {
			toast.error("Não foi possível copiar");
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
					placeholder: "email@aluno.com"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handle,
					disabled: loading,
					variant: isReset ? "outline" : "default",
					className: "gap-2",
					children: [isReset ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }) : null, loading ? isReset ? "Redefinindo…" : "Criando…" : isReset ? "Redefinir senha" : "Gerar acesso"]
				})]
			}),
			isReset && !creds && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "ghost",
				size: "sm",
				onClick: loadCreds,
				disabled: revealing,
				className: "h-9 gap-2 px-2 text-xs text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), revealing ? "Carregando…" : "Ver senha atual"]
			}),
			creds && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border p-3 space-y-2 bg-muted/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Credenciais"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: () => setReveal((v) => !v),
							children: [reveal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), reveal ? " Ocultar" : " Mostrar"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CredRow, {
						label: "Email",
						value: creds.email,
						masked: false,
						onCopy: () => copy("email", creds.email),
						copied: copied === "email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CredRow, {
						label: "Senha",
						value: creds.tempPassword,
						masked: !reveal,
						mono: true,
						onCopy: () => copy("password", creds.tempPassword),
						copied: copied === "password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-md border border-border/60 bg-background/60 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Instruções para o aluno"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								onClick: () => copy("message", buildMessage(creds.email, creds.tempPassword)),
								className: "h-8 gap-1.5 px-2 text-xs",
								children: [copied === "message" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), copied === "message" ? "Copiadas" : "Copiar instruções de acesso"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "max-h-48 overflow-auto whitespace-pre-wrap break-words font-sans text-[11px] leading-relaxed text-foreground",
							children: buildMessage(creds.email, creds.tempPassword)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted-foreground",
						children: [
							"O aluno acessa em ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "https://studiocoachmontanha.lovable.app" }),
							" e verá as abas",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: " Minhas informações" }),
							" e ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Meu treino" }),
							"."
						]
					})
				]
			})
		]
	});
}
function CredRow({ label, value, masked, mono, onCopy, copied }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 rounded-md border bg-background px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-wider text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `truncate text-sm ${mono ? "font-mono" : ""}`,
				children: masked ? "••••••••" : value || "—"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "ghost",
			size: "icon",
			onClick: onCopy,
			disabled: masked || !value,
			"aria-label": `Copiar ${label}`,
			children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })
		})]
	});
}
function PTSessionDialog({ open, onOpenChange, session, defaultStudentId, defaultDate }) {
	const qc = useQueryClient();
	const { data: students = [] } = useQuery({
		queryKey: ["pt-students-all"],
		queryFn: async () => (await supabase.from("pt_students").select("id,name").is("deleted_at", null).order("name")).data ?? []
	});
	const [form, setForm] = (0, import_react.useState)({});
	const [addingToCalendar, setAddingToCalendar] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open) setForm(session ?? {
			pt_student_id: defaultStudentId,
			session_date: defaultDate ?? format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
			session_time: "08:00",
			duration_minutes: 60,
			status: "completed"
		});
	}, [
		open,
		session,
		defaultStudentId,
		defaultDate
	]);
	const { data: payments = [] } = useQuery({
		queryKey: ["pt-student-payments-select", form.pt_student_id],
		queryFn: async () => {
			if (!form.pt_student_id) return [];
			const { data: pays } = await supabase.from("pt_payments").select("id,reference_month,payment_date,amount,sessions_paid,status,pt_plans(name,sessions_per_month,package_sessions,billing_type)").eq("pt_student_id", form.pt_student_id).eq("status", "paid").is("deleted_at", null).order("payment_date", { ascending: true });
			if (!pays?.length) return [];
			const { data: sessions } = await supabase.from("pt_sessions").select("id,pt_payment_id,status").eq("pt_student_id", form.pt_student_id).eq("status", "completed").not("pt_payment_id", "is", null);
			const sessionsByPayment = /* @__PURE__ */ new Map();
			for (const s of sessions ?? []) {
				if (!s.pt_payment_id) continue;
				sessionsByPayment.set(s.pt_payment_id, (sessionsByPayment.get(s.pt_payment_id) ?? 0) + 1);
			}
			return pays.map((p) => {
				const contracted = p.sessions_paid ?? p.pt_plans?.sessions_per_month ?? p.pt_plans?.package_sessions ?? null;
				const used = sessionsByPayment.get(p.id) ?? 0;
				const remaining = contracted !== null ? contracted - used : null;
				const isFull = remaining !== null && remaining <= 0;
				return {
					...p,
					contracted,
					used,
					remaining,
					isFull
				};
			});
		},
		enabled: !!form.pt_student_id
	});
	const selectedPayment = payments.find((p) => p.id === form.pt_payment_id);
	const selectedBalance = selectedPayment ? {
		contracted: selectedPayment.contracted,
		used: selectedPayment.used,
		remaining: selectedPayment.remaining,
		isFull: selectedPayment.isFull
	} : null;
	async function save() {
		if (!form.pt_student_id || !form.session_date) return toast.error("Aluno e data obrigatórios");
		const { data: userData } = await supabase.auth.getUser();
		const userId = userData.user?.id;
		if (!userId) return;
		const payload = {
			user_id: userId,
			pt_student_id: form.pt_student_id,
			pt_payment_id: form.pt_payment_id || null,
			session_date: form.session_date,
			session_time: form.session_time || null,
			duration_minutes: form.duration_minutes ?? 60,
			status: form.status ?? "completed",
			exercises: form.exercises ?? null,
			performance_notes: form.performance_notes ?? null,
			next_session_plan: form.next_session_plan ?? null
		};
		const { error } = await (form.id ? supabase.from("pt_sessions").update(payload).eq("id", form.id) : supabase.from("pt_sessions").insert(payload));
		if (error) return toast.error(error.message);
		toast.success(form.id ? "Aula atualizada" : "Aula registrada");
		qc.invalidateQueries();
		onOpenChange(false);
	}
	async function saveAndAddToCalendar() {
		await save();
		if (!form.session_date || !form.session_time || !form.pt_student_id) return;
		const student = students.find((s) => s.id === form.pt_student_id);
		if (!student) return;
		setAddingToCalendar(true);
		const ok = await addSessionToCalendar({
			studentName: student.name,
			sessionDate: form.session_date,
			sessionTime: form.session_time,
			durationMinutes: form.duration_minutes ?? 60
		});
		setAddingToCalendar(false);
		if (ok) toast.success("Aula adicionada ao Google Calendar!");
		else toast.error("Erro ao adicionar ao Calendar. Verifique as configurações.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeadline, {
					icon: Dumbbell,
					title: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: form.id ? "Editar aula" : "Registrar nova aula" }),
					description: "Data, duração e observações da aula."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 max-h-[65vh] overflow-y-auto pr-1",
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
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: form.session_date ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									session_date: e.target.value
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Horário" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "time",
								value: form.session_time ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									session_time: e.target.value
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Duração" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: String(form.duration_minutes ?? 60),
								onValueChange: (v) => setForm((f) => ({
									...f,
									duration_minutes: Number(v)
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "45",
										children: "45 min"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "60",
										children: "60 min"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "90",
										children: "90 min"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.status ?? "completed",
								onValueChange: (v) => setForm((f) => ({
									...f,
									status: v
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "completed",
										children: "✅ Realizada"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "cancelled_student",
										children: "❌ Cancelada pelo aluno"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "cancelled_trainer",
										children: "❌ Cancelada pelo professor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "no_show",
										children: "🚫 Falta sem aviso"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Vincular pagamento" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.pt_payment_id ?? "none",
									onValueChange: (v) => setForm((f) => ({
										...f,
										pt_payment_id: v === "none" ? null : v
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Nenhum" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "none",
										children: "Nenhum"
									}), payments.map((p) => {
										const dateLabel = p.payment_date ? (/* @__PURE__ */ new Date(p.payment_date + "T12:00")).toLocaleDateString("pt-BR") : "—";
										const balanceLabel = p.contracted !== null ? ` · ${p.used}/${p.contracted} aulas${p.isFull ? " 🔴 ESGOTADO" : ` · ${p.remaining} restantes`}` : "";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: p.id,
											children: [
												dateLabel,
												" · R$ ",
												Number(p.amount).toFixed(2),
												balanceLabel
											]
										}, p.id);
									})] })]
								}),
								selectedBalance && selectedBalance.contracted !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `mt-2 rounded-lg border p-3 text-xs ${selectedBalance.isFull ? "border-destructive/40 bg-destructive/10" : "border-state-paid/30 bg-state-paid-soft"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: selectedBalance.isFull ? "⚠️ Limite de sessões atingido" : "✅ Saldo do pagamento"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono",
												children: [
													selectedBalance.used,
													"/",
													selectedBalance.contracted,
													" aulas"
												]
											})]
										}),
										!selectedBalance.isFull && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-1.5 w-full overflow-hidden rounded-full bg-muted",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-full bg-state-paid transition-all",
													style: { width: `${Math.min(100, selectedBalance.used / selectedBalance.contracted * 100)}%` }
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 text-muted-foreground",
												children: [selectedBalance.remaining, " aula(s) restante(s) neste pagamento"]
											})]
										}),
										selectedBalance.isFull && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-destructive",
											children: "Esta sessão será registrada além do limite contratado. Vincule a um novo pagamento ou registre sem vínculo."
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Exercícios realizados" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: form.exercises ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									exercises: e.target.value
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações de performance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: form.performance_notes ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									performance_notes: e.target.value
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Plano para próxima aula" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: form.next_session_plan ?? "",
								onChange: (e) => setForm((f) => ({
									...f,
									next_session_plan: e.target.value
								}))
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Cancelar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: saveAndAddToCalendar,
						disabled: addingToCalendar,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mr-2 h-4 w-4" }), addingToCalendar ? "Adicionando…" : "Salvar + Google Calendar"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: save,
						children: "Salvar"
					})
				] })
			]
		})
	});
}
//#endregion
export { PTStudentDialog as n, PTSessionDialog as t };
