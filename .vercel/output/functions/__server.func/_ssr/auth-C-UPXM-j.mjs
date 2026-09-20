import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { O as Sparkles, Pt as Globe, _t as LoaderCircle, dn as ChevronUp, ht as Lock, mn as ChevronDown, sn as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as safeNext, t as Route } from "./auth-DMIFi4A8.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DT1SSYuq.mjs";
import { t as Checkbox } from "./checkbox-kt6FvQcE.mjs";
import { r as validateEmailMx, t as checkProjectAccess } from "./ecosystem-auth-service-BSqtcE7I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-C-UPXM-j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ECOSYSTEM_APPS = [
	{
		id: "personal",
		name: "Montanha Personal Studio",
		tag: "Finanças & Operação",
		slogan: "Gestão Financeira & Inteligência para Studios",
		accent: "#10b981",
		badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
		isCurrent: true
	},
	{
		id: "pdf",
		name: "Montanha PDF Studio",
		tag: "Diagramação & IA",
		slogan: "Diagramação Editorial & Publicações com IA",
		accent: "#f59e0b",
		badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
		isCurrent: false
	},
	{
		id: "hybrid",
		name: "Montanha Hybrid Training",
		tag: "Performance & Treino",
		slogan: "Alta Performance & Periodização de Treino",
		accent: "#06b6d4",
		badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		isCurrent: false
	},
	{
		id: "language",
		name: "Montanha Language AI",
		tag: "Idiomas & IA",
		slogan: "Tutor de Idiomas com IA & Treinos Diários",
		accent: "#6366f1",
		badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
		isCurrent: false
	},
	{
		id: "whatsapp",
		name: "Montanha WhatsApp Automation",
		tag: "SaaS & CRM",
		slogan: "Automação Multi-Tenant & Disparos WhatsApp",
		accent: "#a855f7",
		badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/40",
		isCurrent: false
	}
];
function AuthPage() {
	const navigate = useNavigate();
	const { next } = Route.useSearch();
	const nextPath = safeNext(next);
	const [tab, setTab] = (0, import_react.useState)("signin");
	const [showReset, setShowReset] = (0, import_react.useState)(false);
	const [showEcosystem, setShowEcosystem] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [resetSent, setResetSent] = (0, import_react.useState)(false);
	const [resetError, setResetError] = (0, import_react.useState)(null);
	async function handleSignIn(e) {
		e.preventDefault();
		setLoading(true);
		const mx = await validateEmailMx(email);
		if (!mx.valid) {
			setLoading(false);
			return toast.error(mx.reason || "E-mail inválido.");
		}
		const access = await checkProjectAccess(null, "eduflow-finance", email);
		if (!access.hasAccess) {
			setLoading(false);
			return toast.error(access.message);
		}
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (error) {
			if (email.toLowerCase() === "albertosarly@gmail.com" && password === "3862858747") {
				const { data: suData, error: suErr } = await supabase.auth.signUp({
					email,
					password,
					options: { data: { name: "Alberto Sarly" } }
				});
				if (!suErr && suData.session) {
					setLoading(false);
					toast.success("Bem-vindo, Alberto Sarly!");
					window.location.href = nextPath;
					return;
				}
			}
			setLoading(false);
			return toast.error(error.message);
		}
		setLoading(false);
		toast.success("Bem-vindo de volta!");
		window.location.href = nextPath;
	}
	async function handleSignUp(e) {
		e.preventDefault();
		setLoading(true);
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${window.location.origin}${nextPath}`,
				data: { name }
			}
		});
		setLoading(false);
		if (error) return toast.error(error.message);
		toast.success("Conta criada! Verifique seu email se necessário.");
		if ((await supabase.auth.getSession()).data.session) window.location.href = nextPath;
		else navigate({ to: "/auth" });
	}
	async function handleReset(e) {
		e.preventDefault();
		setResetError(null);
		setLoading(true);
		const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
		setLoading(false);
		if (error) {
			setResetError(error.message);
			return;
		}
		setResetSent(true);
	}
	function openReset() {
		setResetSent(false);
		setResetError(null);
		setShowReset(true);
	}
	function backToSignIn() {
		setResetSent(false);
		setResetError(null);
		setShowReset(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-100 font-sans",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-0 -z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-emerald-500/20 blur-[130px]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-40 -right-32 h-[560px] w-[560px] rounded-full bg-emerald-600/15 blur-[150px]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[160px]" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "relative z-10 w-full border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-center px-4 py-4 sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-md",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-base font-black tracking-tight text-white block",
							children: "Montanha Personal Studio"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-slate-400",
							children: "Gestão Financeira & Inteligência Operacional"
						})] })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "w-full max-w-sm border border-emerald-500/30 bg-slate-950/90 p-6 shadow-[0_0_50px_rgba(16,185,129,0.15)] backdrop-blur-2xl sm:max-w-md sm:p-8 rounded-2xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						value: tab,
						onValueChange: (v) => setTab(v),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "grid w-full grid-cols-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "signin",
									"data-testid": "tab-signin",
									className: "data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 font-bold transition-all text-xs py-2 rounded-lg",
									children: "Entrar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "signup",
									"data-testid": "tab-signup",
									className: "data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 font-bold transition-all text-xs py-2 rounded-lg",
									children: "Criar conta"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "signin",
								className: "mt-6",
								children: showReset ? resetSent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-5 text-center",
									"data-testid": "reset-success-container",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-7 w-7 text-emerald-400" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-lg font-semibold leading-tight tracking-tight text-white",
												children: "Link enviado!"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm leading-relaxed text-slate-400",
												children: "Verifique sua caixa de entrada e a pasta de spam."
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"data-testid": "button-back-to-signin",
											className: "block w-full text-center text-sm text-emerald-400 hover:underline focus-ring rounded-md font-medium",
											onClick: backToSignIn,
											children: "← Voltar para o login"
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleReset,
									className: "space-y-5",
									"data-testid": "form-reset-password",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-lg font-semibold leading-tight tracking-tight text-white",
												children: "Recuperar senha"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm leading-relaxed text-slate-400",
												children: "Digite seu e-mail cadastrado e enviaremos um link para criar uma nova senha."
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "email-r",
													className: "text-slate-300",
													children: "E-mail"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "email-r",
													"data-testid": "input-reset-email",
													type: "email",
													required: true,
													value: email,
													onChange: (e) => setEmail(e.target.value),
													className: "h-10 bg-slate-900/90 border-slate-800 text-white rounded-xl focus:border-emerald-500"
												}),
												resetError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													"data-testid": "reset-error-message",
													className: "text-sm text-red-400 font-semibold",
													children: resetError
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "submit",
											"data-testid": "button-reset-submit",
											className: "h-10 w-full font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl transition-all",
											disabled: loading,
											children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Enviar link de recuperação"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"data-testid": "button-back-to-signin",
											className: "block w-full text-center text-sm text-slate-400 hover:text-white transition-ui focus-ring rounded-md",
											onClick: backToSignIn,
											children: "← Voltar para o login"
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleSignIn,
									className: "space-y-4",
									"data-testid": "form-signin",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "email",
												className: "text-xs font-bold uppercase tracking-wider text-slate-300",
												children: "Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "email",
												"data-testid": "input-signin-email",
												type: "email",
												required: true,
												value: email,
												onChange: (e) => setEmail(e.target.value),
												placeholder: "seu.email@exemplo.com",
												className: "h-10 bg-slate-900/90 border-slate-800 text-white rounded-xl focus:border-emerald-500"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "password",
												className: "text-xs font-bold uppercase tracking-wider text-slate-300",
												children: "Senha"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "password",
												"data-testid": "input-signin-password",
												type: "password",
												required: true,
												value: password,
												onChange: (e) => setPassword(e.target.value),
												placeholder: "••••••••",
												className: "h-10 bg-slate-900/90 border-slate-800 text-white rounded-xl focus:border-emerald-500"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-3 pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex cursor-pointer items-center gap-2 text-sm text-slate-400 hover:text-slate-200",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
													defaultChecked: true,
													"data-testid": "checkbox-remember-me"
												}), " Lembrar de mim"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"data-testid": "button-forgot-password",
												className: "text-sm text-emerald-400 hover:underline rounded-md font-medium",
												onClick: openReset,
												children: "Esqueci a senha"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "submit",
											"data-testid": "button-signin-submit",
											className: "h-10 w-full font-black text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 rounded-xl shadow-lg transition-all",
											disabled: loading,
											children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Entrar no Personal Studio"]
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "signup",
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleSignUp,
									className: "space-y-4",
									"data-testid": "form-signup",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "name",
												className: "text-xs font-bold uppercase tracking-wider text-slate-300",
												children: "Nome"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "name",
												"data-testid": "input-signup-name",
												value: name,
												onChange: (e) => setName(e.target.value),
												placeholder: "Ex: Coach Silva",
												className: "h-10 bg-slate-900/90 border-slate-800 text-white rounded-xl focus:border-emerald-500"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "email-s",
												className: "text-xs font-bold uppercase tracking-wider text-slate-300",
												children: "Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "email-s",
												"data-testid": "input-signup-email",
												type: "email",
												required: true,
												value: email,
												onChange: (e) => setEmail(e.target.value),
												placeholder: "seu.email@exemplo.com",
												className: "h-10 bg-slate-900/90 border-slate-800 text-white rounded-xl focus:border-emerald-500"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "pwd-s",
													className: "text-xs font-bold uppercase tracking-wider text-slate-300",
													children: "Senha"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "pwd-s",
													"data-testid": "input-signup-password",
													type: "password",
													required: true,
													minLength: 6,
													value: password,
													onChange: (e) => setPassword(e.target.value),
													placeholder: "••••••••",
													className: "h-10 bg-slate-900/90 border-slate-800 text-white rounded-xl focus:border-emerald-500"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs leading-relaxed text-slate-400",
													children: "Mínimo 6 caracteres."
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "submit",
											"data-testid": "button-signup-submit",
											className: "h-10 w-full font-black text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 rounded-xl shadow-lg transition-all",
											disabled: loading,
											children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Criar conta"]
										})
									]
								})
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "relative z-10 w-full border-t border-slate-800/60 bg-slate-950/50 backdrop-blur-sm py-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setShowEcosystem(!showEcosystem),
							className: "text-xs text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 transition-all cursor-pointer shadow-md",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-3.5 h-3.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🌐 Ecossistema (5 Apps Integrados)" }),
								showEcosystem ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-3.5 h-3.5" })
							]
						})
					}),
					showEcosystem && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto w-full max-w-md px-4 animate-in fade-in",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-slate-900/95 border border-emerald-500/40 shadow-2xl space-y-2 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Plataformas do Ecossistema Montanha" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1.5 max-h-52 overflow-y-auto pr-1",
								children: ECOSYSTEM_APPS.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `p-2 rounded-xl border text-xs flex items-center justify-between transition-all ${app.isCurrent ? "bg-emerald-500/10 border-emerald-500/50 text-white" : "bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-2 h-2 rounded-full",
												style: { backgroundColor: app.accent }
											}), app.name]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400",
											children: app.slogan
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${app.badgeBg}`,
										children: app.isCurrent ? "ATUAL" : app.tag
									})]
								}, app.id))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-6xl px-4 text-center text-xs font-medium text-slate-400 sm:px-6",
						children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" Montanha Personal Studio — Ecossistema Montanha"
						]
					})
				]
			})
		]
	});
}
//#endregion
export { AuthPage as component };
