import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Kt as Dumbbell, _ as TriangleAlert, g as Trophy, s as Users, sn as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as Card } from "./card-BQ4bpKnp.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { a as formatDateBR } from "./format-BT-nao3-.mjs";
import { t as useAuth } from "./use-auth-ChcWg5G-.mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-BymSQoye.mjs";
import { c as getSessionAttendees, l as studentCancelCheckIn, o as getMyAttendanceStats, s as getMyQuotaUsage, u as studentCheckIn } from "./classes.functions-CBapcCd4.mjs";
import { t as AgendaView } from "./AgendaView-B1OE-VVR.mjs";
import { t as useWakeLock } from "./use-wake-lock-PVcvsvFx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal-Cl5uQk-f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PortalHome() {
	useWakeLock();
	const qc = useQueryClient();
	const checkIn = useServerFn(studentCheckIn);
	const cancel = useServerFn(studentCancelCheckIn);
	const fetchQuota = useServerFn(getMyQuotaUsage);
	const fetchStats = useServerFn(getMyAttendanceStats);
	const fetchAttendees = useServerFn(getSessionAttendees);
	const { data: quota } = useQuery({
		queryKey: ["portal-quota"],
		queryFn: () => fetchQuota(),
		staleTime: 6e4,
		gcTime: 5 * 6e4
	});
	const { data: stats } = useQuery({
		queryKey: ["portal-attendance-stats"],
		queryFn: () => fetchStats(),
		staleTime: 6e4,
		gcTime: 5 * 6e4
	});
	const [attendeesFor, setAttendeesFor] = (0, import_react.useState)(null);
	const { data: attendees = [], isFetching: attendeesLoading } = useQuery({
		queryKey: ["portal-attendees", attendeesFor?.id],
		enabled: !!attendeesFor?.id,
		queryFn: () => fetchAttendees({ data: { sessionId: attendeesFor.id } })
	});
	const { data: dueInfo } = useQuery({
		queryKey: ["portal-due-warning"],
		queryFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return null;
			const { data: st } = await supabase.from("students").select("id").eq("account_user_id", u.user.id).maybeSingle();
			if (!st?.id) return null;
			const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			const { data } = await supabase.from("payments").select("due_date, plans(name)").eq("student_id", st.id).eq("status", "paid").not("plan_id", "is", null).order("payment_date", { ascending: false }).limit(10);
			const current = (data ?? []).find((p) => !p.due_date || p.due_date >= today);
			if (!current?.due_date) return null;
			const due = /* @__PURE__ */ new Date(`${current.due_date}T12:00:00`);
			const now = /* @__PURE__ */ new Date();
			now.setHours(0, 0, 0, 0);
			const diffDays = Math.ceil((due.getTime() - now.getTime()) / 864e5);
			return {
				due_date: current.due_date,
				plan_name: current.plans?.name ?? null,
				diffDays
			};
		}
	});
	const [warnOpen, setWarnOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!dueInfo || dueInfo.diffDays > 3) return;
		const key = `portal-due-warn-${dueInfo.due_date}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`;
		if (sessionStorage.getItem(key)) return;
		setWarnOpen(true);
		sessionStorage.setItem(key, "1");
	}, [dueInfo]);
	const [pendingId, setPendingId] = (0, import_react.useState)(null);
	async function handleCheckIn(sessionId) {
		setPendingId(sessionId);
		try {
			await checkIn({ data: { sessionId } });
			toast.success("Check-in confirmado!");
			qc.invalidateQueries({ queryKey: ["agenda"] });
			qc.invalidateQueries({ queryKey: ["portal-quota"] });
			qc.invalidateQueries({ queryKey: ["portal-attendees", sessionId] });
		} catch (e) {
			toast.error(e.message);
		} finally {
			setPendingId(null);
		}
	}
	const [cancelId, setCancelId] = (0, import_react.useState)(null);
	async function handleCancel(sessionId) {
		try {
			await cancel({ data: { sessionId } });
			toast.success("Check-in cancelado");
			qc.invalidateQueries({ queryKey: ["agenda"] });
			qc.invalidateQueries({ queryKey: ["portal-quota"] });
			qc.invalidateQueries({ queryKey: ["portal-attendees", sessionId] });
		} catch (e) {
			toast.error(e.message);
		}
	}
	const [, setTick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setTick((t) => t + 1), 3e4);
		return () => clearInterval(id);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: warnOpen,
				onOpenChange: setWarnOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "border-state-pending/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mb-1 grid h-14 w-14 place-items-center rounded-2xl bg-state-pending-soft text-state-pending ring-1 ring-inset ring-state-pending/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-center",
							children: dueInfo && dueInfo.diffDays < 0 ? "Plano vencido" : dueInfo?.diffDays === 0 ? "Seu plano vence hoje" : "Vencimento do plano próximo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-center",
							children: [dueInfo?.plan_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-medium text-foreground",
								children: dueInfo.plan_name
							}), dueInfo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block",
								children: dueInfo.diffDays < 0 ? `Venceu em ${formatDateBR(dueInfo.due_date)}. Regularize com o studio para manter seu acesso.` : dueInfo.diffDays === 0 ? `Vence hoje (${formatDateBR(dueInfo.due_date)}). Combine a renovação com o studio.` : `Faltam ${dueInfo.diffDays} ${dueInfo.diffDays === 1 ? "dia" : "dias"} (${formatDateBR(dueInfo.due_date)}) para o vencimento. Combine a renovação com o studio.`
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "sm:justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setWarnOpen(false),
							children: "Entendi"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/portal/perfil",
								children: "Ver meu plano"
							})
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-overline mb-1.5 text-muted-foreground",
					children: "Studio"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-title text-foreground",
					children: "Check-ins"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-caption mt-2 max-w-prose text-muted-foreground",
					children: "Turmas liberadas pelo seu plano. Faça check-in dentro da janela definida pelo studio."
				})
			] }),
			(() => {
				const { user } = useAuth();
				const { data: userTypes } = useQuery({
					queryKey: ["portal-user-types", user?.id],
					enabled: !!user?.id,
					queryFn: async () => {
						const [studio, pt] = await Promise.all([supabase.from("students").select("id").eq("account_user_id", user.id).maybeSingle(), supabase.from("pt_students").select("id").eq("account_user_id", user.id).maybeSingle()]);
						return {
							studio: !!studio.data,
							pt: !!pt.data
						};
					}
				});
				if (!userTypes?.pt) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					className: "w-full gap-2 py-6 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/portal/pt/treino",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-5 w-5" }), "Acessar meu Treino Personal"]
					})
				});
			})(),
			quota && (quota.plan_name || quota.quota_type !== "none") && (() => {
				const hasQuota = quota.quota_type !== "none" && !!quota.quota_amount;
				const amount = quota.quota_amount ?? 0;
				const used = quota.used ?? 0;
				const deg = (hasQuota ? Math.min(100, Math.round(used / amount * 100)) : 100) / 100 * 360;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex items-center gap-4 p-4 sm:p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-14 w-14 shrink-0 rounded-full flex items-center justify-center",
						style: { background: `conic-gradient(var(--primary) ${deg}deg, var(--muted) ${deg}deg)` },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-[5px] rounded-full bg-card" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-numeric relative text-xs",
							children: hasQuota ? `${used}/${amount}` : "∞"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-overline text-muted-foreground",
								children: ["Plano atual", quota.plan_name ? ` — ${quota.plan_name}` : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-body mt-1",
								children: hasQuota ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
										className: "font-semibold",
										children: [
											used,
											"/",
											amount,
											" check-ins"
										]
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											quota.period_label,
											" — plano permite ",
											amount
										]
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Check-ins ilimitados neste plano"
								})
							}),
							quota.package_expires_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: ["Pacote expira em ", new Date(quota.package_expires_at).toLocaleDateString("pt-BR")]
							})
						]
					})]
				});
			})(),
			stats && (stats.total > 0 || stats.month > 0 || stats.year > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-center gap-4 p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-overline text-muted-foreground",
						children: "Aulas realizadas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1.5 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "text-numeric text-xl text-foreground",
									children: stats.total
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "no total"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "text-numeric text-foreground",
									children: stats.year
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "este ano"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "text-numeric text-foreground",
									children: stats.month
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "este mês"
								})
							] })
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramLegend, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgendaView, { renderCard: (s) => {
				const now = /* @__PURE__ */ new Date();
				const start = /* @__PURE__ */ new Date(`${s.session_date}T${String(s.start_time).slice(0, 5)}:00`);
				const opens = /* @__PURE__ */ new Date(start.getTime() - s.checkin_opens_minutes_before * 6e4);
				const closes = /* @__PURE__ */ new Date(start.getTime() - s.checkin_closes_minutes_before * 6e4);
				const withinWindow = now >= opens && now <= closes;
				const isClosed = now > closes;
				const isSoon = now < opens;
				const isFull = s.filled >= s.capacity;
				const spotsLeft = Math.max(0, s.capacity - s.filled);
				const isLastSpot = !isFull && spotsLeft === 1 && !isClosed && s.is_enrolled && !s.checked_in;
				const canCheckIn = s.is_enrolled && !s.checked_in && withinWindow && !isFull;
				const canCancel = s.checked_in && now <= closes;
				let tag;
				if (s.checked_in) tag = null;
				else if (!s.is_enrolled) tag = {
					label: "Sem acesso",
					cls: "bg-muted text-muted-foreground"
				};
				else if (isClosed) tag = {
					label: "Encerrado",
					cls: "bg-muted text-muted-foreground"
				};
				else if (isFull) tag = {
					label: "Sem vagas",
					cls: "bg-destructive/10 text-destructive"
				};
				else if (isLastSpot) tag = {
					label: "Última vaga",
					cls: "bg-state-pending-soft text-state-pending"
				};
				else if (isSoon) {
					const diffMin = Math.max(1, Math.round((opens.getTime() - now.getTime()) / 6e4));
					const sameDay = opens.toDateString() === now.toDateString();
					tag = {
						label: diffMin < 60 ? `Abre em ${diffMin} min` : sameDay ? `Abre às ${opens.toLocaleTimeString("pt-BR", {
							hour: "2-digit",
							minute: "2-digit"
						})}` : `Abre ${opens.toLocaleDateString("pt-BR", { weekday: "short" })} ${opens.toLocaleTimeString("pt-BR", {
							hour: "2-digit",
							minute: "2-digit"
						})}`,
						cls: "bg-state-pending-soft text-state-pending"
					};
				} else tag = null;
				const dim = isClosed || !s.is_enrolled && !s.checked_in;
				const [hh, mm] = String(s.start_time).slice(0, 5).split(":");
				const confirmedCls = s.checked_in ? "border-l-[6px] bg-state-paid-soft ring-1 ring-state-paid/40" : "border-l-4";
				const canOpenAttendees = s.filled > 0;
				const openAttendees = () => {
					if (canOpenAttendees) setAttendeesFor({
						id: s.id,
						label: `${s.class_name} · ${hh}:${mm}`
					});
				};
				const stop = (e) => e.stopPropagation();
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					role: canOpenAttendees ? "button" : void 0,
					tabIndex: canOpenAttendees ? 0 : void 0,
					"aria-label": canOpenAttendees ? `Ver quem fez check-in em ${s.class_name} às ${hh}:${mm}` : void 0,
					onClick: canOpenAttendees ? openAttendees : void 0,
					onKeyDown: canOpenAttendees ? (e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							openAttendees();
						}
					} : void 0,
					className: `transition-ui group relative flex overflow-hidden p-0 outline-none ${confirmedCls} ${dim ? "opacity-60" : ""} ${canOpenAttendees ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-float focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0" : ""}`,
					style: { borderLeftColor: s.program_color ?? "var(--muted-foreground)" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-16 shrink-0 flex-col items-center justify-center gap-0.5 border-r border-border bg-muted/30 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-numeric text-xl leading-none text-foreground",
							children: hh
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-numeric text-[11px] text-muted-foreground",
							children: [":", mm]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-1 flex-col gap-2 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold leading-tight text-foreground line-clamp-2 min-w-0 flex-1",
								children: s.class_name
							}), tag && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ${tag.cls}`,
								children: tag.label
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium shrink-0 ${isFull ? "bg-destructive/10 text-destructive" : isLastSpot ? "bg-state-pending-soft text-state-pending" : "bg-muted text-muted-foreground"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
										className: "text-numeric text-[11px]",
										children: [
											s.filled,
											"/",
											s.capacity
										]
									}),
									" vagas"
								]
							}), canCheckIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								loading: pendingId === s.id,
								className: "h-9 px-4 text-xs shrink-0",
								onClick: (e) => {
									stop(e);
									handleCheckIn(s.id);
								},
								children: "Check-in"
							}) : canCancel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "h-9 px-4 text-xs shrink-0",
								onClick: (e) => {
									stop(e);
									setCancelId(s.id);
								},
								children: "Cancelar"
							}) : s.checked_in ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 rounded-full bg-state-paid-soft px-2.5 py-1 text-[11px] font-semibold text-state-paid shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Confirmado"]
							}) : s.is_enrolled && isFull && !isClosed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								disabled: true,
								title: "Em breve: entre na fila para ser avisado se abrir vaga",
								className: "h-9 px-3 text-xs shrink-0",
								onClick: stop,
								children: "Lista de espera"
							}) : null]
						})]
					})]
				});
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!cancelId,
				onOpenChange: (o) => !o && setCancelId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Cancelar check-in?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sua vaga será liberada para outro aluno." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-state-paid",
								children: [
									"✅ Cancelar antes do encerramento da janela ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "não desconta" }),
									" da sua cota — a aula fica disponível para você reagendar em outra turma dentro do período."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "Depois que a janela de check-in fecha, o botão de cancelar some e a aula passa a contar como frequência normal."
							})
						]
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Manter check-in" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: () => {
						if (cancelId) handleCancel(cancelId);
						setCancelId(null);
					},
					children: "Sim, cancelar"
				})] })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!attendeesFor,
				onOpenChange: (o) => !o && setAttendeesFor(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), " Quem fez check-in"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: attendeesFor?.label })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-[50vh] overflow-y-auto",
						children: attendeesLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground text-center py-4",
							children: "Carregando…"
						}) : attendees.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground text-center py-4",
							children: "Ninguém ainda"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y",
							children: attendees.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: a.name
								}), a.is_me && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-state-paid-soft text-state-paid px-2 py-0.5 text-[10px] font-semibold",
									children: "você"
								})]
							}, a.student_id))
						})
					})]
				})
			})
		]
	});
}
function ProgramLegend() {
	const { data: programs = [] } = useQuery({
		queryKey: ["portal-program-legend"],
		queryFn: async () => {
			const { data } = await supabase.from("programs").select("id,name,color").order("name");
			return data ?? [];
		}
	});
	if (programs.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-2",
		children: programs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "h-2.5 w-2.5 rounded-full",
				style: { background: p.color ?? "var(--color-muted-foreground)" }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: p.name
			})]
		}, p.id))
	});
}
//#endregion
export { PortalHome as component };
