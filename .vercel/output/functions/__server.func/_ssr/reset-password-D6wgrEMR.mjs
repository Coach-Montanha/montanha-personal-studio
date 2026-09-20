import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Ht as Eye, Nt as GraduationCap, Ut as EyeOff, _t as LoaderCircle, sn as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-D6wgrEMR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPasswordPage() {
	const navigate = useNavigate();
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [showPwd, setShowPwd] = (0, import_react.useState)(false);
	const [showConfirm, setShowConfirm] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [success, setSuccess] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
		});
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) setReady(true);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	async function submit(e) {
		e.preventDefault();
		setError(null);
		if (password.length < 8) {
			setError("A senha deve ter no mínimo 8 caracteres.");
			return;
		}
		if (password !== confirm) {
			setError("As senhas não coincidem.");
			return;
		}
		setLoading(true);
		const { error: err } = await supabase.auth.updateUser({ password });
		setLoading(false);
		if (err) {
			setError(err.message);
			return;
		}
		setSuccess(true);
		await supabase.auth.signOut();
		setTimeout(() => navigate({ to: "/auth" }), 2e3);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen flex-col overflow-hidden bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-0 -z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-primary/25 blur-[120px] dark:bg-primary/40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-40 -right-32 h-[560px] w-[560px] rounded-full bg-primary/15 blur-[140px] dark:bg-primary/30" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[160px] dark:bg-accent/25" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 opacity-40",
						style: {
							backgroundImage: "radial-gradient(color-mix(in oklab, var(--foreground) 5%, transparent) 1px, transparent 1px)",
							backgroundSize: "3px 3px"
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "relative z-10 w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center gap-2.5 px-4 py-4 sm:px-6 sm:py-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm ring-1 ring-primary/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-5 w-5 text-primary-foreground" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-base font-bold tracking-tight text-foreground",
						children: "EduFinance"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "w-full max-w-sm border-border/60 bg-card/85 p-6 shadow-xl shadow-primary/20 ring-1 ring-foreground/5 backdrop-blur-xl sm:max-w-md sm:p-8 dark:shadow-primary/30",
					children: success ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto grid h-14 w-14 place-items-center rounded-full bg-state-paid-soft ring-1 ring-state-paid/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-7 w-7 text-state-paid" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-section text-foreground",
								children: "Senha alterada com sucesso!"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-caption text-muted-foreground",
								children: "Redirecionando para o login…"
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-section text-foreground",
								children: "Criar nova senha"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-caption text-muted-foreground",
								children: "Defina sua nova senha de acesso."
							})]
						}),
						!ready && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-caption mt-4 rounded-lg border border-border bg-surface-sunken px-3 py-2.5 text-muted-foreground",
							children: "Validando link de recuperação…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: submit,
							className: "mt-6 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "pwd",
											children: "Nova senha"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "pwd",
												type: showPwd ? "text" : "password",
												required: true,
												minLength: 8,
												value: password,
												onChange: (e) => setPassword(e.target.value),
												"aria-invalid": Boolean(error),
												className: "h-10 pr-11"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setShowPwd((v) => !v),
												className: "focus-ring absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-ui hover:bg-muted hover:text-foreground",
												"aria-label": showPwd ? "Ocultar senha" : "Mostrar senha",
												children: showPwd ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-caption text-muted-foreground",
											children: "Mínimo 8 caracteres."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "confirm",
										children: "Confirmar nova senha"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "confirm",
											type: showConfirm ? "text" : "password",
											required: true,
											minLength: 8,
											value: confirm,
											onChange: (e) => setConfirm(e.target.value),
											"aria-invalid": Boolean(error),
											className: "h-10 pr-11"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setShowConfirm((v) => !v),
											className: "focus-ring absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-ui hover:bg-muted hover:text-foreground",
											"aria-label": showConfirm ? "Ocultar senha" : "Mostrar senha",
											children: showConfirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										})]
									})]
								}),
								error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									role: "alert",
									className: "text-caption rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 text-destructive",
									children: error
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									className: "h-10 w-full font-medium transition-ui active:scale-[0.99]",
									disabled: loading || !ready,
									children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Salvar nova senha"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									className: "focus-ring block rounded-md py-1 text-center text-sm text-muted-foreground transition-ui hover:text-foreground",
									children: "← Voltar para o login"
								})
							]
						})
					] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "relative z-10 w-full border-t border-border/40 bg-background/50 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-4 text-center text-xs font-medium text-muted-foreground sm:px-6 sm:py-6",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" EduFinance"
					]
				})
			})
		]
	});
}
//#endregion
export { ResetPasswordPage as component };
