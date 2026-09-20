import { o as __toESM } from "./_runtime.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { i as require_react } from "./_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "./_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { An as BellRing, C as TicketX, Ct as LayoutDashboard, Fn as ArrowRight, Ht as Eye, Jt as DollarSign, L as Send, Sn as CalendarClock, Tn as Cake, Wn as Activity, _t as LoaderCircle, cn as CircleAlert, ct as MessageCircle, en as Clock, l as UserX, n as X, s as Users, y as TrendingDown } from "./_libs/lucide-react.mjs";
import { t as Button } from "./_ssr/button-C0L5fFXX.mjs";
import { t as Card } from "./_ssr/card-BQ4bpKnp.mjs";
import { t as supabase } from "./_ssr/client-CCQALzHq.mjs";
import { _ as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as PointerSensor, g as CSS, h as useSensors, i as KeyboardSensor, m as useSensor, o as closestCenter, t as DndContext } from "./_libs/@dnd-kit/core+[...].mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { t as Badge } from "./_ssr/badge-DB22ix_c.mjs";
import { t as PageHeader } from "./_ssr/PageHeader-CRue-aiN.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./_ssr/dialog-C26xL9O3.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./_ssr/table-DEnZ0u5J.mjs";
import { t as EmptyState } from "./_ssr/EmptyState-DK3vCNbs.mjs";
import { a as formatDateBR, i as formatBRL, o as formatMonthLabel, r as currentMonthKey, t as addMonths$1, u as paymentMethodLabel } from "./_ssr/format-BT-nao3-.mjs";
import { t as sendInAppNotification } from "./_ssr/notifications.functions-DzfytByp.mjs";
import { n as PlanBadge, t as PaymentStatusBadge } from "./_ssr/Badges-BwuNwA-M.mjs";
import { r as useQuery } from "./_libs/tanstack__react-query.mjs";
import { n as useRole, r as useScopeFilter } from "./_ssr/use-scope-filter-q5Imal9c.mjs";
import { t as chartTooltip } from "./_ssr/chart-theme-DG2ASWF8.mjs";
import { t as KPICard } from "./_ssr/KPICard-CS1xEcGG.mjs";
import { t as MonthYearPicker } from "./_ssr/MonthYearPicker-BRYGdsSp.mjs";
import { t as Skeleton } from "./_ssr/skeleton-D9W9wFsj.mjs";
import { a as useSortable, i as sortableKeyboardCoordinates, n as arrayMove, o as verticalListSortingStrategy, r as rectSortingStrategy, t as SortableContext } from "./_libs/dnd-kit__sortable.mjs";
import { n as SortableChartCard, r as useLocalStorage, t as HiddenChartChips } from "./_ssr/SortableChartCard-C38x-lr8.mjs";
import { n as LANDING_STORAGE_KEY, t as LANDING_REDIRECT_FLAG } from "./_ssr/use-landing-page-CK5BT-cY.mjs";
import { t as SectionCard } from "./_ssr/SectionCard-Dhxnzc2Q.mjs";
import { t as allocateCheckins } from "./_ssr/checkins-DJxtlh1V.mjs";
import { t as usePortalMode } from "./_ssr/use-portal-mode-OB6P155i.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { a as YAxis, c as Line, d as Pie, f as Cell, i as LineChart, l as CartesianGrid, m as Tooltip, n as PieChart, o as XAxis, p as ResponsiveContainer, r as BarChart, u as Bar } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_authenticated-D6rCaGvM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Limiares dos alertas — ajuste aqui se a régua do studio mudar. */
var EXPIRING_IN_DAYS = 7;
var LOW_CHECKINS = 2;
function todayISO() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function daysBetween(fromISO, toISO) {
	const a = (/* @__PURE__ */ new Date(`${fromISO}T00:00:00`)).getTime();
	const b = (/* @__PURE__ */ new Date(`${toISO}T00:00:00`)).getTime();
	return Math.round((b - a) / 864e5);
}
var tiles = {
	expiring: {
		tone: "border-state-pending/25 bg-state-pending-soft text-state-pending hover:border-state-pending/50",
		capsule: "bg-state-pending-soft text-state-pending ring-state-pending/20",
		icon: CalendarClock,
		label: "Pacotes vencendo",
		hint: `validade em até ${EXPIRING_IN_DAYS} dias`,
		title: "Pacotes vencendo em breve",
		empty: "Nenhum pacote perto do vencimento"
	},
	low: {
		tone: "border-state-late/25 bg-state-late-soft text-state-late hover:border-state-late/50",
		capsule: "bg-state-late-soft text-state-late ring-state-late/20",
		icon: TicketX,
		label: "Check-ins acabando",
		hint: `${LOW_CHECKINS} ou menos restantes`,
		title: "Check-ins acabando",
		empty: "Todos os pacotes com saldo confortável"
	}
};
function AlertTile({ tone, icon: Icon, count, label, hint, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		disabled: count === 0,
		className: cn("focus-ring group flex items-center gap-3 rounded-xl border p-3.5 text-left transition-ui", tone, count === 0 ? "cursor-default opacity-45" : "hover:-translate-y-0.5 hover:shadow-card active:translate-y-0"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-card/70",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-numeric block text-xl leading-none",
						children: count
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-caption mt-1 block truncate font-semibold",
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-caption block truncate opacity-70",
						children: hint
					})
				]
			}),
			count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
				"aria-hidden": true,
				className: "h-4 w-4 shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-70"
			})
		]
	});
}
/** Mensagem automática enviada ao aluno, por tipo de alerta. */
function buildMessage(view, row) {
	if (view === "expiring") {
		const when = row.daysLeft === 0 ? "vence hoje" : row.daysLeft === 1 ? "vence amanhã" : `vence em ${row.daysLeft} dias`;
		return {
			title: "Seu pacote está vencendo",
			body: `Olá, ${row.name}! Seu pacote ${when}` + (row.validUntil ? ` (${formatDateBR(row.validUntil)})` : "") + (row.remaining > 0 ? ` e você ainda tem ${row.remaining} check-in${row.remaining > 1 ? "s" : ""} para usar.` : ".") + " Aproveite para agendar ou renovar com o studio."
		};
	}
	return {
		title: "Seus check-ins estão acabando",
		body: `Olá, ${row.name}! ` + (row.remaining <= 0 ? "Seu pacote de check-ins acabou." : `Restam ${row.remaining} check-in${row.remaining > 1 ? "s" : ""} no seu pacote.`) + " Fale com o studio para renovar e não ficar sem treinar."
	};
}
function PackageAlerts() {
	const navigate = useNavigate();
	const { scopeId, scopeKey, ready } = useScopeFilter();
	const [view, setView] = (0, import_react.useState)(null);
	const [sending, setSending] = (0, import_react.useState)(false);
	const [notified, setNotified] = (0, import_react.useState)({});
	const notify = useServerFn(sendInAppNotification);
	const { data: students = [] } = useQuery({
		queryKey: ["package-alert-students", scopeKey],
		enabled: ready,
		staleTime: 300 * 1e3,
		queryFn: async () => {
			let q = supabase.from("students").select("id,name,account_user_id,payments(id,status,payment_date,checkin_quota_override,plans(name,checkin_quota_type,checkin_quota_amount,package_valid_days))").is("deleted_at", null).eq("status", "active").order("name");
			if (scopeId) q = q.eq("user_id", scopeId);
			const { data, error } = await q;
			if (error) throw error;
			return data ?? [];
		}
	});
	const packageStudentIds = (0, import_react.useMemo)(() => students.filter((s) => (s.payments ?? []).some((p) => p.status === "paid" && p.plans?.checkin_quota_type === "package")).map((s) => s.id), [students]);
	const { data: extra } = useQuery({
		queryKey: ["package-alert-usage", packageStudentIds.join(",")],
		enabled: packageStudentIds.length > 0,
		staleTime: 300 * 1e3,
		queryFn: async () => {
			const [att, frz] = await Promise.all([supabase.from("class_attendance").select("student_id, class_sessions:session_id (session_date)").in("student_id", packageStudentIds), supabase.from("payment_freezes").select("student_id, payment_id, freeze_days").in("student_id", packageStudentIds)]);
			const dates = {};
			for (const r of att.data ?? []) {
				const d = r.class_sessions?.session_date;
				if (!d || !r.student_id) continue;
				(dates[r.student_id] ??= []).push(d);
			}
			const freezes = {};
			for (const f of frz.data ?? []) (freezes[f.student_id] ??= []).push({
				payment_id: f.payment_id,
				freeze_days: f.freeze_days
			});
			return {
				dates,
				freezes
			};
		}
	});
	const groups = (0, import_react.useMemo)(() => {
		const today = todayISO();
		const expiring = [];
		const low = [];
		for (const s of students) {
			const pays = (s.payments ?? []).filter((p) => p.status === "paid" && p.plans?.checkin_quota_type === "package");
			if (!pays.length) continue;
			const alloc = allocateCheckins(pays, extra?.dates[s.id] ?? [], extra?.freezes[s.id] ?? []);
			const active = pays.map((p) => ({
				p,
				pkg: alloc.get(p.id)
			})).filter((x) => x.pkg && (!x.pkg.validUntil || x.pkg.validUntil >= today)).sort((a, b) => a.p.payment_date < b.p.payment_date ? -1 : 1);
			if (!active.length) continue;
			const remainingTotal = active.reduce((acc, x) => acc + Math.max(0, x.pkg.quota - x.pkg.used.length), 0);
			const withValidity = active.filter((x) => x.pkg.validUntil);
			const validUntil = (withValidity.length ? withValidity.reduce((a, b) => a.pkg.validUntil <= b.pkg.validUntil ? a : b) : null)?.pkg.validUntil ?? null;
			const daysLeft = validUntil ? daysBetween(today, validUntil) : null;
			const base = {
				studentId: s.id,
				name: s.name,
				plan: active[active.length - 1].p.plans?.name ?? null,
				remaining: remainingTotal,
				quota: active.reduce((acc, x) => acc + x.pkg.quota, 0),
				validUntil,
				daysLeft,
				hasAccount: Boolean(s.account_user_id)
			};
			if (daysLeft !== null && daysLeft >= 0 && daysLeft <= EXPIRING_IN_DAYS && remainingTotal > 0) expiring.push(base);
			if (remainingTotal <= LOW_CHECKINS) low.push(base);
		}
		expiring.sort((a, b) => (a.daysLeft ?? 99) - (b.daysLeft ?? 99));
		low.sort((a, b) => a.remaining - b.remaining);
		return {
			expiring,
			low
		};
	}, [students, extra]);
	const rows = view ? groups[view] : [];
	const cfg = view ? tiles[view] : null;
	const targets = rows.filter((r) => r.hasAccount);
	const any = groups.expiring.length > 0 || groups.low.length > 0;
	async function notifyAll() {
		if (!view || !targets.length) return;
		setSending(true);
		try {
			let sent = 0;
			for (const row of targets) {
				const msg = buildMessage(view, row);
				const res = await notify({ data: {
					studentIds: [row.studentId],
					...msg
				} });
				sent += res?.sent ?? 0;
			}
			setNotified((n) => ({
				...n,
				[view]: true
			}));
			const skipped = rows.length - targets.length;
			toast.success(`${sent} aluno${sent === 1 ? "" : "s"} avisado${sent === 1 ? "" : "s"}` + (skipped > 0 ? ` · ${skipped} sem acesso ao app` : ""));
		} catch (e) {
			toast.error(e?.message ?? "Não foi possível enviar os avisos");
		} finally {
			setSending(false);
		}
	}
	if (!any) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
		title: "Pacotes e check-ins",
		description: "Renovações que precisam de contato",
		icon: CalendarClock,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			size: "sm",
			className: "transition-ui",
			onClick: () => navigate({ to: "/students" }),
			children: ["Ver alunos", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-4 w-4" })]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTile, {
				tone: tiles.expiring.tone,
				icon: tiles.expiring.icon,
				count: groups.expiring.length,
				label: tiles.expiring.label,
				hint: tiles.expiring.hint,
				onClick: () => setView("expiring")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTile, {
				tone: tiles.low.tone,
				icon: tiles.low.icon,
				count: groups.low.length,
				label: tiles.low.label,
				hint: tiles.low.hint,
				onClick: () => setView("low")
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!view,
		onOpenChange: (o) => !o && setView(null),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-h-[88vh] gap-0 overflow-y-auto sm:max-w-2xl",
			children: cfg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset", cfg.capsule),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(cfg.icon, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base leading-tight",
							children: cfg.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "mt-1",
							children: [
								rows.length,
								" aluno",
								rows.length === 1 ? "" : "s",
								" · ",
								targets.length,
								" com acesso ao app"
							]
						})]
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border",
					children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setView(null);
							navigate({
								to: "/students/$id",
								params: { id: row.studentId }
							});
						},
						className: "focus-ring group flex min-h-11 w-full items-center gap-3 px-3.5 py-3 text-left transition-colors duration-200 hover:bg-muted/60 active:bg-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": true,
								className: cn("grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold uppercase ring-1 ring-inset", cfg.capsule),
								children: row.name.slice(0, 2)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm font-semibold text-foreground",
									children: row.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-caption mt-0.5 block truncate text-muted-foreground",
									children: [
										row.plan ? `${row.plan} · ` : "",
										row.validUntil ? `válido até ${formatDateBR(row.validUntil)}` : "sem validade definida",
										row.hasAccount ? "" : " · sem acesso ao app"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("text-numeric shrink-0 rounded-full px-2 py-0.5 text-xs ring-1 ring-inset", cfg.capsule),
								children: [
									row.remaining,
									"/",
									row.quota
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" })
						]
					}) }, row.studentId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setView(null),
						className: "transition-ui",
						children: "Fechar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: notifyAll,
						disabled: sending || targets.length === 0,
						className: "transition-ui",
						children: [sending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-4 w-4 animate-spin" }) : notified[view] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "mr-1.5 h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1.5 h-4 w-4" }), sending ? "Enviando…" : notified[view] ? "Avisar novamente" : `Avisar ${targets.length} aluno${targets.length === 1 ? "" : "s"}`]
					})]
				})
			] })
		})
	})] });
}
function BirthdayBanner({ students }) {
	const [isVisible, setIsVisible] = (0, import_react.useState)(true);
	if (!isVisible || students.length === 0) return null;
	const handleWhatsApp = (phone, name) => {
		const cleanPhone = phone.replace(/\D/g, "");
		const message = encodeURIComponent(`Olá ${name}, parabéns pelo seu aniversário! Desejamos muita saúde, treinos e conquistas! 🎉💪`);
		window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
	};
	const sorted = [...students].sort((a, b) => {
		return (/* @__PURE__ */ new Date(a.birth_date + "T12:00")).getDate() - (/* @__PURE__ */ new Date(b.birth_date + "T12:00")).getDate();
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative mb-6 min-w-0 max-w-full overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-3.5 sm:p-4 shadow-sm transition-all animate-in fade-in slide-in-from-top-4 duration-500",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cake, { className: "h-5 w-5 animate-bounce text-state-pending" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold uppercase tracking-wider",
						children: "Aniversariantes do Mês"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-w-0 flex-wrap gap-2",
					children: sorted.map((student) => {
						const day = (/* @__PURE__ */ new Date(student.birth_date + "T12:00")).getDate();
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 max-w-full items-center gap-2 rounded-lg bg-card/50 px-2.5 py-1.5 ring-1 ring-inset ring-primary/10 transition-ui hover:bg-card sm:px-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "max-w-[120px] truncate text-sm font-medium text-foreground sm:max-w-none",
										children: student.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: cn("h-4 px-1 text-[10px] font-bold uppercase", student.type === "pt" ? "border-amber-500/30 text-amber-600 bg-amber-50" : "border-blue-500/30 text-blue-600 bg-blue-50"),
										children: student.type
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-muted-foreground",
									children: ["Dia ", day]
								})]
							}), student.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "h-8 w-8 rounded-full text-green-600 hover:bg-green-50 hover:text-green-700",
								onClick: () => handleWhatsApp(student.phone, student.name),
								title: `Enviar parabéns para ${student.name}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" })
							})]
						}, `${student.type}-${student.id}`);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				className: "h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground",
				onClick: () => setIsVisible(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
			})]
		})
	});
}
var HISTORY_MONTHS = 24;
var VISIBLE_MONTHS = 6;
/** Tile clicável do bloco "Precisa da sua atenção". Tons via tokens de estado. */
var attentionTones = {
	late: "border-state-late/25 bg-state-late-soft text-state-late hover:border-state-late/50",
	pending: "border-state-pending/25 bg-state-pending-soft text-state-pending hover:border-state-pending/50",
	frozen: "border-state-frozen/25 bg-state-frozen-soft text-state-frozen hover:border-state-frozen/50"
};
function AttentionTile({ tone, icon: Icon, count, label, hint, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		disabled: count === 0,
		className: cn("focus-ring group flex items-center gap-3 rounded-xl border p-3.5 text-left transition-ui", attentionTones[tone], count === 0 ? "cursor-default opacity-45" : "hover:-translate-y-0.5 hover:shadow-card active:translate-y-0"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: "grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-button,9999px)] bg-card/70",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-numeric block text-xl leading-none",
						children: count
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-caption mt-1 block truncate font-semibold",
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-caption block truncate opacity-70",
						children: hint
					})
				]
			}),
			count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
				"aria-hidden": true,
				className: "h-4 w-4 shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-70"
			})
		]
	});
}
var attentionViews = {
	late: {
		title: "Alunos em atraso",
		icon: CircleAlert,
		capsule: "bg-state-late-soft text-state-late ring-state-late/20",
		accent: "text-state-late",
		empty: "Nenhum pagamento em atraso neste mês",
		seeAll: {
			label: "Ver em Pagamentos",
			to: "/payments"
		}
	},
	pending: {
		title: "Aguardando pagamento",
		icon: Clock,
		capsule: "bg-state-pending-soft text-state-pending ring-state-pending/20",
		accent: "text-state-pending",
		empty: "Nenhum pagamento pendente neste mês",
		seeAll: {
			label: "Ver em Pagamentos",
			to: "/payments"
		}
	},
	missing: {
		title: "Sem registro no mês",
		icon: UserX,
		capsule: "bg-state-frozen-soft text-state-frozen ring-state-frozen/20",
		accent: "text-state-frozen",
		empty: "Todos os alunos ativos têm lançamento neste mês",
		seeAll: {
			label: "Ver em Alunos",
			to: "/students"
		}
	}
};
/** Lista exclusiva dos alunos por situação, com atalho para cada perfil. */
function AttentionListDialog({ view, monthLabel, data, onClose, onGo, onSeeAll }) {
	const cfg = view ? attentionViews[view] : null;
	const rows = !view ? [] : view === "late" ? data.overdue.rows : view === "pending" ? data.pending.rows : data.missingList;
	const total = view === "late" ? data.overdue.total : view === "pending" ? data.pending.total : null;
	const Icon = cfg?.icon ?? CircleAlert;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!view,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-h-[88vh] gap-0 overflow-y-auto sm:max-w-2xl",
			children: cfg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					className: cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset", cfg.capsule),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-base leading-tight",
						children: cfg.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "mt-1",
						children: ["Mês de referência: ", monthLabel]
					})]
				})]
			}) }), rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("grid gap-3", total !== null ? "grid-cols-2" : "grid-cols-1"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-muted/40 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-overline text-muted-foreground",
								children: "Alunos"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-numeric mt-1 text-xl text-foreground",
								children: rows.length
							})]
						}), total !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-muted/40 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-overline text-muted-foreground",
								children: "Valor total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("text-numeric mt-1 text-xl", cfg.accent),
								children: formatBRL(total)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border overflow-hidden rounded-xl border border-border",
						children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onGo(row.studentId),
							className: "focus-ring group flex min-h-11 w-full items-center gap-3 px-3.5 py-3 text-left transition-colors duration-200 hover:bg-muted/60 active:bg-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": true,
									className: cn("grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold uppercase ring-1 ring-inset", cfg.capsule),
									children: row.name.slice(0, 2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-sm font-semibold text-foreground",
										children: row.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-caption mt-0.5 block truncate text-muted-foreground",
										children: row.date ? `${row.plan ? `${row.plan} · ` : ""}${formatDateBR(row.date)}` : "sem lançamento neste mês"
									})]
								}),
								row.amount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-numeric shrink-0 text-sm text-foreground",
									children: formatBRL(row.amount)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" })
							]
						}) }, row.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							className: "transition-ui",
							onClick: () => onSeeAll(cfg.seeAll.to),
							children: [cfg.seeAll.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-4 w-4" })]
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Tudo em dia",
					description: cfg.empty
				})
			})] })
		})
	});
}
function SortableKPICard({ id, onHide, ...props }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: setNodeRef,
		style: {
			transform: CSS.Translate.toString(transform),
			transition,
			zIndex: isDragging ? 50 : void 0,
			opacity: isDragging ? .5 : 1
		},
		className: "min-w-0 max-w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPICard, {
			...props,
			onHide,
			dragHandleProps: {
				...attributes,
				...listeners
			}
		})
	});
}
function Dashboard() {
	const navigate = useNavigate();
	const { scopeId, scopeKey, ready } = useScopeFilter();
	(0, import_react.useEffect)(() => {
		if (sessionStorage.getItem("edufinance.landingRedirected")) return;
		sessionStorage.setItem(LANDING_REDIRECT_FLAG, "1");
		const target = localStorage.getItem(LANDING_STORAGE_KEY);
		if (target && target !== "/") navigate({
			to: target,
			replace: true
		});
	}, [navigate]);
	const [month, setMonth] = (0, import_react.useState)(currentMonthKey());
	const { isSuperAdmin } = useRole();
	const [allMonths, setAllMonths] = (0, import_react.useState)(false);
	const [useRange, setUseRange] = (0, import_react.useState)(false);
	const [rangeStart, setRangeStart] = (0, import_react.useState)("");
	const [rangeEnd, setRangeEnd] = (0, import_react.useState)("");
	const prevMonth = addMonths$1(month, -1);
	const [chartOffset, setChartOffset] = (0, import_react.useState)(0);
	const maxChartOffset = Math.max(0, HISTORY_MONTHS - VISIBLE_MONTHS);
	const [kpiOrder, setKpiOrder] = useLocalStorage("dashboard.kpiOrder", [
		"revenue",
		"students",
		"late",
		"pending",
		"ticket",
		"churn"
	]);
	const [hiddenKpis, setHiddenKpis] = useLocalStorage("dashboard.hiddenKpis", []);
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
	function handleDragEnd(event) {
		const { active, over } = event;
		if (over && active.id !== over.id) setKpiOrder((items) => {
			return arrayMove(items, items.indexOf(active.id), items.indexOf(over.id));
		});
	}
	function toggleKpi(id) {
		setHiddenKpis((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
	}
	const [chartOrder, setChartOrder] = useLocalStorage("dashboard.chartOrder", [
		"revenue-chart",
		"students-chart",
		"plan-chart",
		"method-chart"
	]);
	const [hiddenCharts, setHiddenCharts] = useLocalStorage("dashboard.hiddenCharts", []);
	function handleChartDragEnd(event) {
		const { active, over } = event;
		if (over && active.id !== over.id) setChartOrder((items) => {
			const oldIndex = items.indexOf(active.id);
			const newIndex = items.indexOf(over.id);
			if (oldIndex < 0 || newIndex < 0) return items;
			return arrayMove(items, oldIndex, newIndex);
		});
	}
	function toggleChart(id) {
		setHiddenCharts((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
	}
	const { data: payments = [], isLoading } = useQuery({
		queryKey: ["payments-with-rels", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let allRows = [];
			let from = 0;
			const PAGE = 1e3;
			let pages = 0;
			while (pages < 20) {
				pages++;
				let q = supabase.from("payments").select("id,amount,payment_date,reference_month,payment_method,status,student_id,plan_id,students(name),plans(name)").is("deleted_at", null).order("payment_date", { ascending: false }).range(from, from + PAGE - 1);
				if (scopeId) q = q.eq("user_id", scopeId);
				const { data, error } = await q;
				if (error) throw error;
				allRows = allRows.concat(data ?? []);
				if (!data || data.length < PAGE) break;
				from += PAGE;
			}
			return allRows;
		}
	});
	const { data: activeStudents = [] } = useQuery({
		queryKey: ["students-active-light", scopeKey],
		enabled: ready,
		queryFn: async () => {
			let q = supabase.from("students").select("id,name").is("deleted_at", null).eq("status", "active").order("name");
			if (scopeId) q = q.eq("user_id", scopeId);
			const { data, error } = await q;
			if (error) throw error;
			return data ?? [];
		}
	});
	const studentCount = activeStudents.length;
	const { data: birthdayStudents = [] } = useQuery({
		queryKey: ["birthday-students-combined", scopeKey],
		enabled: ready,
		queryFn: async () => {
			const currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
			let qStudio = supabase.from("students").select("id,name,phone,birth_date,account_user_id").is("deleted_at", null).not("birth_date", "is", null);
			if (scopeId) qStudio = qStudio.eq("user_id", scopeId);
			let qPt = supabase.from("pt_students").select("id,name,phone,birth_date,account_user_id").is("deleted_at", null).not("birth_date", "is", null);
			if (scopeId) qPt = qPt.eq("user_id", scopeId);
			const [resStudio, resPt] = await Promise.all([qStudio, qPt]);
			const studioList = (resStudio.data ?? []).map((s) => ({
				...s,
				type: "studio"
			}));
			const ptList = (resPt.data ?? []).map((s) => ({
				...s,
				type: "pt"
			}));
			return [...studioList, ...ptList].filter((s) => {
				if (!s.birth_date) return false;
				return (/* @__PURE__ */ new Date(s.birth_date + "T12:00")).getMonth() + 1 === currentMonth;
			});
		}
	});
	const { mode, loading: portalLoading } = usePortalMode();
	const filteredBirthdays = (0, import_react.useMemo)(() => {
		if (portalLoading) return [];
		if (!isSuperAdmin && mode !== null) return birthdayStudents.filter((student) => {
			if (mode === "both") return true;
			return student.type === mode;
		});
		return birthdayStudents;
	}, [
		birthdayStudents,
		mode,
		portalLoading,
		isSuperAdmin
	]);
	const k = (0, import_react.useMemo)(() => {
		const paidThis = useRange ? payments.filter((p) => {
			if (p.status !== "paid") return false;
			if (rangeStart && p.payment_date < rangeStart) return false;
			if (rangeEnd && p.payment_date > rangeEnd) return false;
			return true;
		}) : allMonths ? payments.filter((p) => p.status === "paid") : payments.filter((p) => p.reference_month === month && p.status === "paid");
		const paidPrev = useRange || allMonths ? [] : payments.filter((p) => p.reference_month === prevMonth && p.status === "paid");
		const sum = (arr) => arr.reduce((s, p) => s + Number(p.amount), 0);
		const revThis = sum(paidThis);
		const revPrev = sum(paidPrev);
		const ticket = paidThis.length ? revThis / paidThis.length : 0;
		const ticketPrev = paidPrev.length ? revPrev / paidPrev.length : 0;
		const studentsThis = new Set(paidThis.map((p) => p.student_id));
		const studentsPrev = new Set(paidPrev.map((p) => p.student_id));
		const churnedList = allMonths || useRange ? [] : [...studentsPrev].filter((s) => !studentsThis.has(s)).map((studentId) => {
			const rows = paidPrev.filter((p) => p.student_id === studentId);
			const last = rows.reduce((a, b) => a.payment_date >= b.payment_date ? a : b);
			return {
				studentId,
				name: last.students?.name ?? "Aluno",
				plan: last.plans?.name ?? null,
				amount: rows.reduce((s, p) => s + Number(p.amount), 0),
				date: last.payment_date
			};
		}).sort((a, b) => b.amount - a.amount);
		const churned = churnedList.length;
		return {
			revThis,
			revTrend: allMonths || useRange ? 0 : revPrev ? (revThis - revPrev) / revPrev * 100 : 0,
			ticket,
			ticketTrend: allMonths || useRange ? 0 : ticketPrev ? (ticket - ticketPrev) / ticketPrev * 100 : 0,
			churned,
			churnedList,
			paidThis
		};
	}, [
		payments,
		month,
		prevMonth,
		allMonths,
		useRange,
		rangeStart,
		rangeEnd
	]);
	const [churnOpen, setChurnOpen] = (0, import_react.useState)(false);
	const [attentionView, setAttentionView] = (0, import_react.useState)(null);
	const churnLost = (0, import_react.useMemo)(() => k.churnedList.reduce((s, r) => s + r.amount, 0), [k.churnedList]);
	const monthlySeries = (0, import_react.useMemo)(() => {
		const series = [];
		for (let i = HISTORY_MONTHS - 1; i >= 0; i--) {
			const m = addMonths$1(month, -i);
			const total = payments.filter((p) => p.reference_month === m && p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
			series.push({
				month: m,
				label: formatMonthLabel(m),
				total
			});
		}
		return series;
	}, [payments, month]);
	const studentsSeries = (0, import_react.useMemo)(() => {
		const series = [];
		for (let i = HISTORY_MONTHS - 1; i >= 0; i--) {
			const m = addMonths$1(month, -i);
			const set = new Set(payments.filter((p) => p.reference_month === m && p.status === "paid").map((p) => p.student_id));
			series.push({
				label: formatMonthLabel(m),
				active: set.size
			});
		}
		return series;
	}, [payments, month]);
	const byPlan = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of k.paidThis) {
			const name = p.plans?.name ?? "Sem plano";
			map.set(name, (map.get(name) ?? 0) + Number(p.amount));
		}
		const rows = [...map].map(([name, value]) => ({
			name,
			value
		}));
		const total = rows.reduce((s, r) => s + r.value, 0);
		return rows.map((r) => ({
			...r,
			pct: total > 0 ? r.value / total * 100 : 0
		})).sort((a, b) => b.value - a.value);
	}, [k.paidThis]);
	const byPlanTotal = (0, import_react.useMemo)(() => byPlan.reduce((s, r) => s + r.value, 0), [byPlan]);
	const byMethod = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of k.paidThis) {
			const key = paymentMethodLabel(p.payment_method);
			map.set(key, (map.get(key) ?? 0) + Number(p.amount));
		}
		return [...map].map(([name, value]) => ({
			name,
			value
		}));
	}, [k.paidThis]);
	const colors = [
		"var(--color-chart-1)",
		"var(--color-chart-2)",
		"var(--color-chart-3)",
		"var(--color-chart-4)",
		"var(--color-chart-5)"
	];
	const recent = (0, import_react.useMemo)(() => {
		const cutoff = /* @__PURE__ */ new Date();
		cutoff.setDate(cutoff.getDate() - 30);
		const cutoffStr = cutoff.toISOString().slice(0, 10);
		return payments.filter((p) => p.payment_date >= cutoffStr).sort((a, b) => a.payment_date < b.payment_date ? 1 : -1);
	}, [payments]);
	/**
	* "Precisa da sua atenção": deriva do mesmo array de pagamentos já carregado —
	* zero query nova. Mostra só o que exige ação humana hoje.
	*/
	const attention = (0, import_react.useMemo)(() => {
		const thisMonth = currentMonthKey();
		const ofMonth = payments.filter((p) => p.reference_month === thisMonth);
		const overdue = ofMonth.filter((p) => p.status === "overdue");
		const pending = ofMonth.filter((p) => p.status === "pending");
		const sum = (arr) => arr.reduce((s, p) => s + Number(p.amount), 0);
		const toRows = (arr) => arr.map((p) => ({
			id: p.id,
			studentId: p.student_id,
			name: p.students?.name ?? "Aluno",
			plan: p.plans?.name ?? null,
			amount: Number(p.amount),
			date: p.payment_date
		})).sort((a, b) => b.amount - a.amount);
		const touched = new Set(ofMonth.map((p) => p.student_id));
		const missingList = activeStudents.filter((s) => !touched.has(s.id)).map((s) => ({
			id: s.id,
			studentId: s.id,
			name: s.name,
			plan: null,
			amount: 0,
			date: null
		}));
		return {
			overdue: {
				count: overdue.length,
				total: sum(overdue),
				rows: toRows(overdue)
			},
			pending: {
				count: pending.length,
				total: sum(pending),
				rows: toRows(pending)
			},
			missing: missingList.length,
			missingList,
			month: thisMonth,
			any: overdue.length > 0 || pending.length > 0 || missingList.length > 0
		};
	}, [payments, activeStudents]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 max-w-full space-y-6 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BirthdayBanner, { students: filteredBirthdays }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				icon: LayoutDashboard,
				eyebrow: "Visão geral",
				title: "Dashboard",
				description: useRange ? rangeStart && rangeEnd ? `Período: ${(/* @__PURE__ */ new Date(rangeStart + "T00:00")).toLocaleDateString("pt-BR")} até ${(/* @__PURE__ */ new Date(rangeEnd + "T00:00")).toLocaleDateString("pt-BR")}` : "Selecione o período" : allMonths ? "Visão geral financeira de todos os períodos" : "Visão geral financeira do mês selecionado",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full min-w-0 sm:w-auto items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										setAllMonths(false);
										setUseRange(false);
									},
									className: cn("flex-1 sm:flex-initial h-9 text-xs sm:text-sm", !allMonths && !useRange ? "border-primary text-primary" : ""),
									children: "Mês"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										setAllMonths(true);
										setUseRange(false);
									},
									className: cn("flex-1 sm:flex-initial h-9 text-xs sm:text-sm", allMonths ? "border-primary text-primary" : ""),
									children: "Todos os meses"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										setAllMonths(false);
										setUseRange(true);
									},
									className: cn("flex-1 sm:flex-initial h-9 text-xs sm:text-sm", useRange ? "border-primary text-primary" : ""),
									children: "Período"
								})
							]
						}),
						hiddenKpis.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-2 sm:border-l sm:border-t-0 sm:pl-2 sm:pt-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-muted-foreground",
								children: "Ocultos:"
							}), hiddenKpis.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								size: "sm",
								className: "h-7 gap-1 px-2 text-[10px]",
								onClick: () => toggleKpi(id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" }), id === "revenue" ? "Receita" : id === "students" ? "Alunos" : id === "late" ? "Atrasos" : id === "pending" ? "Pendentes" : id === "ticket" ? "Ticket" : "Churn"]
							}, id))]
						}),
						!allMonths && !useRange && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full sm:w-auto min-w-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthYearPicker, {
								value: month,
								onChange: setMonth
							})
						}),
						useRange && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full sm:w-auto min-w-0 flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: rangeStart,
									onChange: (e) => setRangeStart(e.target.value),
									className: "h-9 rounded-md border border-input bg-background px-2 text-sm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "até"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: rangeEnd,
									onChange: (e) => setRangeEnd(e.target.value),
									className: "h-9 rounded-md border border-input bg-background px-2 text-sm"
								})
							]
						})
					]
				})
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-6 min-w-0 max-w-full",
				children: [
					1,
					2,
					3,
					4,
					5,
					6
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/70 bg-card p-3 sm:p-4 shadow-card min-w-0 max-w-full overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-16 sm:w-20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-7 w-7 sm:h-8 sm:w-8 rounded-lg" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-3 h-6 sm:h-7 w-20 sm:w-28" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-2 h-3 w-14 sm:w-16" })
					]
				}, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndContext, {
				sensors,
				collisionDetection: closestCenter,
				onDragEnd: handleDragEnd,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
					items: kpiOrder,
					strategy: verticalListSortingStrategy,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-6 min-w-0 max-w-full",
						children: kpiOrder.map((id) => {
							if (hiddenKpis.includes(id)) return null;
							if (id === "revenue") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableKPICard, {
								id,
								label: allMonths ? "Receita total" : useRange ? "Receita do período" : "Receita do mês",
								value: formatBRL(k.revThis),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-5 w-5" }),
								trend: allMonths || useRange ? void 0 : { value: k.revTrend },
								hint: allMonths || useRange ? void 0 : "vs mês anterior",
								onHide: () => toggleKpi(id)
							}, id);
							if (id === "students") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableKPICard, {
								id,
								label: "Alunos ativos",
								value: studentCount,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" }),
								hint: "status ativo",
								onHide: () => toggleKpi(id)
							}, id);
							if (id === "late") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableKPICard, {
								id,
								label: "Em atraso",
								value: attention.overdue.count,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5" }),
								hint: formatBRL(attention.overdue.total),
								onClick: () => setAttentionView("late"),
								onHide: () => toggleKpi(id)
							}, id);
							if (id === "pending") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableKPICard, {
								id,
								label: "Pendentes",
								value: attention.pending.count,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5" }),
								hint: formatBRL(attention.pending.total),
								onClick: () => setAttentionView("pending"),
								onHide: () => toggleKpi(id)
							}, id);
							if (id === "ticket") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableKPICard, {
								id,
								label: "Ticket médio",
								value: formatBRL(k.ticket),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5" }),
								trend: allMonths || useRange ? void 0 : { value: k.ticketTrend },
								onHide: () => toggleKpi(id)
							}, id);
							if (id === "churn") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableKPICard, {
								id,
								label: allMonths || useRange ? "Churn (N/A)" : "Churn do mês",
								value: allMonths || useRange ? "—" : k.churned,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-5 w-5" }),
								hint: "vs mês anterior",
								onClick: () => setChurnOpen(true),
								disabled: allMonths || useRange || k.churned === 0,
								onHide: () => toggleKpi(id)
							}, id);
							return null;
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: churnOpen,
				onOpenChange: setChurnOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[88vh] gap-0 overflow-y-auto sm:max-w-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-state-late-soft text-state-late ring-1 ring-inset ring-state-late/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-base leading-tight",
								children: "Churn do mês"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
								className: "mt-1",
								children: [
									"Alunos que pagaram em ",
									formatMonthLabel(prevMonth),
									" e ainda não têm pagamento em",
									" ",
									formatMonthLabel(month),
									"."
								]
							})]
						})]
					}) }), k.churnedList.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-muted/40 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-overline text-muted-foreground",
									children: "Alunos"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-numeric mt-1 text-xl text-foreground",
									children: k.churnedList.length
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-state-late/25 bg-state-late-soft p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-overline text-state-late/80",
									children: "Receita em risco"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-numeric mt-1 text-xl text-state-late",
									children: formatBRL(churnLost)
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border overflow-hidden rounded-xl border border-border",
							children: k.churnedList.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setChurnOpen(false);
									navigate({
										to: "/students/$id",
										params: { id: row.studentId }
									});
								},
								className: "focus-ring flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors duration-200 hover:bg-muted/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-sm font-semibold text-foreground",
											children: row.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-caption mt-0.5 block truncate text-muted-foreground",
											children: [
												row.plan ? `${row.plan} · ` : "",
												"último em ",
												formatDateBR(row.date)
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-numeric shrink-0 text-sm text-foreground",
										children: formatBRL(row.amount)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })
								]
							}) }, row.studentId))
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "Nenhum churn",
							description: "Nenhum aluno deixou de pagar neste mês"
						})
					})]
				})
			}),
			attention.any && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
				title: "Precisa da sua atenção",
				description: "Situação do mês corrente",
				icon: CircleAlert,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					className: "transition-ui",
					onClick: () => navigate({ to: "/payments" }),
					children: ["Ver pagamentos", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-4 w-4" })]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttentionTile, {
							tone: "late",
							icon: CircleAlert,
							count: attention.overdue.count,
							label: "Em atraso",
							hint: formatBRL(attention.overdue.total),
							onClick: () => setAttentionView("late")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttentionTile, {
							tone: "pending",
							icon: Clock,
							count: attention.pending.count,
							label: "Aguardando pagamento",
							hint: formatBRL(attention.pending.total),
							onClick: () => setAttentionView("pending")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttentionTile, {
							tone: "frozen",
							icon: UserX,
							count: attention.missing,
							label: "Sem registro no mês",
							hint: "alunos ativos sem lançamento",
							onClick: () => setAttentionView("missing")
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageAlerts, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttentionListDialog, {
				view: attentionView,
				monthLabel: formatMonthLabel(attention.month),
				data: attention,
				onClose: () => setAttentionView(null),
				onGo: (id) => {
					setAttentionView(null);
					navigate({
						to: "/students/$id",
						params: { id }
					});
				},
				onSeeAll: (to) => {
					setAttentionView(null);
					navigate({ to });
				}
			}),
			(() => {
				const end = monthlySeries.length - chartOffset;
				const start = Math.max(0, end - VISIBLE_MONTHS);
				const monthlyWindow = monthlySeries.slice(start, end);
				const studentsWindow = studentsSeries.slice(start, end);
				const rangeLabel = monthlyWindow.length ? `${monthlyWindow[0].label} — ${monthlyWindow[monthlyWindow.length - 1].label}` : "";
				const NavButtons = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							className: "h-7 w-7",
							disabled: !(chartOffset < maxChartOffset),
							onClick: () => setChartOffset((o) => Math.min(maxChartOffset, o + VISIBLE_MONTHS)),
							title: "Período anterior",
							children: "‹"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-[8rem] text-center text-[11px] font-medium text-muted-foreground",
							children: rangeLabel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							className: "h-7 w-7",
							disabled: !(chartOffset > 0),
							onClick: () => setChartOffset((o) => Math.max(0, o - VISIBLE_MONTHS)),
							title: "Período seguinte",
							children: "›"
						})
					]
				});
				const chartLabels = {
					"revenue-chart": "Receita mensal",
					"students-chart": "Alunos pagantes",
					"plan-chart": "Por plano",
					"method-chart": "Formas de pagamento"
				};
				const renderChart = (id) => {
					if (id === "revenue-chart") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableChartCard, {
						id,
						title: `Receita mensal (${VISIBLE_MONTHS} meses)`,
						actions: NavButtons,
						onHide: () => toggleChart(id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: monthlyWindow,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
											id: "revenueBarGradient",
											x1: "0",
											y1: "0",
											x2: "0",
											y2: "1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "0%",
												stopColor: "var(--color-chart-1)",
												stopOpacity: .95
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "100%",
												stopColor: "var(--color-chart-1)",
												stopOpacity: .45
											})]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "var(--color-border)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "label",
											tick: { fontSize: 11 },
											interval: 0
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											tick: { fontSize: 11 },
											tickFormatter: (v) => `R$${(v / 1e3).toFixed(0)}k`,
											width: 50
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											...chartTooltip,
											formatter: (v) => formatBRL(v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "total",
											fill: "url(#revenueBarGradient)",
											radius: [
												6,
												6,
												0,
												0
											]
										})
									]
								})
							})
						})
					}, id);
					if (id === "students-chart") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableChartCard, {
						id,
						title: "Evolução de alunos pagantes",
						actions: NavButtons,
						onHide: () => toggleChart(id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
									data: studentsWindow,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "var(--color-border)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "label",
											tick: { fontSize: 11 },
											interval: 0
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											tick: { fontSize: 11 },
											allowDecimals: false,
											width: 40
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...chartTooltip }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "active",
											stroke: "var(--color-chart-2)",
											strokeWidth: 3,
											dot: {
												r: 4,
												strokeWidth: 2,
												fill: "var(--color-card)"
											},
											activeDot: { r: 6 }
										})
									]
								})
							})
						})
					}, id);
					if (id === "plan-chart") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableChartCard, {
						id,
						title: "Distribuição por plano (mês)",
						actions: byPlan.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground tabular-nums",
							children: [byPlan.length, " planos"]
						}) : void 0,
						onHide: () => toggleChart(id),
						children: byPlan.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-5 sm:flex-row sm:items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-56 w-full sm:h-52 sm:w-52 sm:shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
										data: byPlan,
										dataKey: "value",
										nameKey: "name",
										innerRadius: 58,
										outerRadius: 90,
										paddingAngle: 2,
										stroke: "none",
										children: byPlan.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: colors[i % colors.length] }, i))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										...chartTooltip,
										formatter: (v, _n, item) => `${formatBRL(v)} · ${(item?.payload?.pct ?? 0).toFixed(1).replace(".", ",")}%`
									})] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base font-semibold leading-none tabular-nums text-foreground",
										children: formatBRL(byPlanTotal)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 text-[11px] uppercase tracking-wide text-muted-foreground",
										children: "total do mês"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "flex w-full min-w-0 flex-col gap-1",
								children: byPlan.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-md px-2 py-1.5 transition-colors duration-200 hover:bg-muted/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "size-2.5 shrink-0 rounded-full",
												style: { background: colors[i % colors.length] },
												"aria-hidden": true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "min-w-0 flex-1 truncate text-sm text-foreground",
												children: row.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-sm font-semibold tabular-nums text-foreground",
												children: [row.pct.toFixed(1).replace(".", ","), "%"]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex items-center gap-2 pl-[18px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-1 flex-1 overflow-hidden rounded-full bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full rounded-full transition-[width] duration-300",
												style: {
													width: `${row.pct}%`,
													background: colors[i % colors.length]
												}
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs tabular-nums text-muted-foreground",
											children: formatBRL(row.value)
										})]
									})]
								}, row.name))
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								title: "Sem dados",
								description: "Nenhum pagamento neste mês"
							})
						})
					}, id);
					if (id === "method-chart") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableChartCard, {
						id,
						title: "Formas de pagamento (mês)",
						onHide: () => toggleChart(id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64",
							children: byMethod.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: byMethod,
									layout: "vertical",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "var(--color-border)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											type: "number",
											tick: { fontSize: 11 },
											tickFormatter: (v) => `R$${(v / 1e3).toFixed(0)}k`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											type: "category",
											dataKey: "name",
											tick: { fontSize: 11 },
											width: 120
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											...chartTooltip,
											formatter: (v) => formatBRL(v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "value",
											fill: "var(--color-chart-2)",
											radius: [
												0,
												4,
												4,
												0
											]
										})
									]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								title: "Sem dados",
								description: "Nenhum pagamento neste mês"
							})
						})
					}, id);
					return null;
				};
				if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
					children: [
						1,
						2,
						3,
						4
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-44" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-24 rounded" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex h-64 items-end gap-3 pb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 flex-1 rounded-t" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-44 flex-1 rounded-t" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 flex-1 rounded-t" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-56 flex-1 rounded-t" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-36 flex-1 rounded-t" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 flex-1 rounded-t" })
							]
						})]
					}, i))
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HiddenChartChips, {
						hidden: hiddenCharts,
						labels: chartLabels,
						onRestore: toggleChart
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndContext, {
						sensors,
						collisionDetection: closestCenter,
						onDragEnd: handleChartDragEnd,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
							items: chartOrder,
							strategy: rectSortingStrategy,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
								children: chartOrder.filter((id) => !hiddenCharts.includes(id)).map(renderChart)
							})
						})
					})]
				});
			})(),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-3.5 sm:p-5 min-w-0 max-w-full overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-sm font-semibold",
					children: "Pagamentos recentes (últimos 30 dias)"
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b bg-muted/30 px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-24" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-16" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-20" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-20" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-16" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-20" })
							]
						}), [
							1,
							2,
							3,
							4,
							5
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b px-4 py-3 last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-32" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-20" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-20 rounded-full" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-16" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-24" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-16 rounded-full" })
							]
						}, i))]
					})
				}) : recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Nenhum pagamento registrado",
					description: "Nenhum pagamento nos últimos 30 dias"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full max-w-full overflow-x-auto [touch-action:pan-x]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Aluno" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Plano" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Método" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Valor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: recent.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium",
							children: p.students?.name ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanBadge, { name: p.plans?.name }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-mono text-xs",
							children: formatDateBR(p.payment_date)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs",
							children: paymentMethodLabel(p.payment_method)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right font-mono font-medium",
							children: formatBRL(p.amount)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentStatusBadge, { status: p.status }) })
					] }, p.id)) })] })
				})]
			})
		]
	});
}
//#endregion
export { Dashboard as component };
