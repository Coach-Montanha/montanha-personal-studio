import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Kt as Dumbbell, Wn as Activity, c as User, r as Wallet, v as TrendingUp, w as Target, wt as Layers, xn as CalendarDays } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as formatDateBR, i as formatBRL } from "./format-BT-nao3-.mjs";
import { t as useAuth } from "./use-auth-ChcWg5G-.mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as WorkoutProgressionDialog } from "./WorkoutProgressionDialog-DDwALhVZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pt-gRTShjKU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PTPortalHome() {
	const { user } = useAuth();
	const [progressionOpen, setProgressionOpen] = (0, import_react.useState)(false);
	const { data: student } = useQuery({
		queryKey: ["pt-portal-me", user?.id],
		enabled: !!user?.id,
		queryFn: async () => {
			const { data } = await supabase.from("pt_students").select("id,name,email,phone,birth_date,start_date,goal,health_notes,status").eq("account_user_id", user.id).maybeSingle();
			return data;
		}
	});
	const { data: payments = [] } = useQuery({
		queryKey: ["pt-portal-me-payments", student?.id],
		enabled: !!student?.id,
		queryFn: async () => {
			const { data } = await supabase.from("pt_payments").select("id,amount,payment_date,due_date,status,sessions_paid,pt_plans(name,billing_type,sessions_per_month,package_sessions)").eq("pt_student_id", student.id).order("payment_date", { ascending: false });
			return data ?? [];
		}
	});
	const { data: sessions = [] } = useQuery({
		queryKey: ["pt-portal-me-sessions", student?.id],
		enabled: !!student?.id,
		queryFn: async () => {
			const { data } = await supabase.from("pt_sessions").select("id,session_date,status,pt_payment_id").eq("pt_student_id", student.id).order("session_date", { ascending: false });
			return data ?? [];
		}
	});
	if (!student) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm text-muted-foreground",
		children: "Carregando…"
	});
	const latestPaid = payments.find((p) => p.status === "paid");
	const plan = latestPaid?.pt_plans;
	const billingType = plan?.billing_type;
	const contracted = latestPaid?.sessions_paid ?? plan?.sessions_per_month ?? plan?.package_sessions ?? null;
	const usedInCurrent = latestPaid ? sessions.filter((s) => s.status === "completed" && s.pt_payment_id === latestPaid.id).length : 0;
	const remaining = contracted !== null && contracted !== void 0 ? Math.max(0, contracted - usedInCurrent) : null;
	const totalCompleted = sessions.filter((s) => s.status === "completed").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: [
						"Olá, ",
						student.name.split(" ")[0],
						" 👋"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Suas informações e progresso com o Personal Trainer."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "gap-1.5",
						onClick: () => setProgressionOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-primary" }), "Evolução de Cargas"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						className: "gap-1.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/portal/pt/treino",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-4 w-4" }), "Ver Treinos"]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-primary" }), " Meus dados"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Nome",
							value: student.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Email",
							value: student.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Telefone",
							value: student.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Nascimento",
							value: student.birth_date ? formatDateBR(student.birth_date) : null
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
							label: "Início",
							value: student.start_date ? formatDateBR(student.start_date) : null
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4 text-primary" }), " Objetivo"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: student.goal || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Não informado"
							})
						}),
						student.health_notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-2",
							children: "Saúde"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: student.health_notes
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground font-semibold",
								children: ["Plano atual ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-lg font-bold",
								children: plan?.name ?? "—"
							}),
							latestPaid?.due_date && billingType === "monthly" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground mt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "inline h-3 w-3 mr-1" }),
									"Vence em ",
									formatDateBR(latestPaid.due_date)
								]
							}),
							latestPaid && (billingType === "per_session" || billingType === "package") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Vence ao esgotar as aulas"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground font-semibold",
								children: ["Aulas restantes ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-lg font-bold font-mono",
								children: remaining !== null && contracted !== null ? `${remaining} de ${contracted}` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mt-1",
								children: contracted !== null ? `${usedInCurrent} realizadas neste ciclo` : "Sem cota definida"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground font-semibold",
								children: ["Total de aulas ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-lg font-bold font-mono",
								children: totalCompleted
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Realizadas no histórico"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 text-sm font-semibold",
					children: "Últimos pagamentos"
				}), payments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Nenhum pagamento registrado."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: payments.slice(0, 6).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: p.pt_plans?.name ?? "Avulso"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: formatDateBR(p.payment_date)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono font-semibold",
								children: formatBRL(Number(p.amount))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: p.status
							})]
						})]
					}, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkoutProgressionDialog, {
				open: progressionOpen,
				onOpenChange: setProgressionOpen,
				studentId: student.id
			})
		]
	});
}
function InfoRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium text-right",
			children: value || "—"
		})]
	});
}
//#endregion
export { PTPortalHome as component };
