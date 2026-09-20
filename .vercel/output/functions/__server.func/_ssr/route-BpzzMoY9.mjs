import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as Shield, Ct as LayoutDashboard, En as Building2, F as Settings, Ht as Eye, J as PinOff, Kt as Dumbbell, Nt as GraduationCap, R as Search, T as Sun, U as RefreshCw, Xt as CreditCard, an as CircleUserRound, at as Moon, b as Trash2, bt as Library, c as User, g as Trophy, gn as CheckCheck, jn as BellDot, kn as Bell, lt as Menu, mt as LogOut, n as X, nn as ClipboardList, nt as PanelLeftClose, q as Pin, r as Wallet, s as Users, t as Zap, tt as PanelLeftOpen, ut as Megaphone, x as Timer, yn as Calendar } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { o as formatDistanceToNow, t as ptBR } from "../_libs/date-fns.mjs";
import { t as useAuth } from "./use-auth-ChcWg5G-.mjs";
import { a as useQueryClient, n as useIsFetching, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as useTenantScope, n as useRole, r as useScopeFilter, t as useProfileMode } from "./use-scope-filter-q5Imal9c.mjs";
import { t as useModules } from "./use-modules-DlxYE7n1.mjs";
import { t as usePortalMode } from "./use-portal-mode-OB6P155i.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectLabel, i as SelectItem, n as SelectContent, o as SelectTrigger, r as SelectGroup, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { n as getActiveAnnouncementsForPortal, r as getSignedAnnouncementImageUrl } from "./announcements.functions-Dh4YH7L1.mjs";
import { n as PopoverContent, r as PopoverTrigger, t as Popover } from "./popover-Cmlz_mk1.mjs";
import { t as TrainingTimerDialog } from "./TrainingTimerDialog-D0y9wxVP.mjs";
import { n as useTheme } from "./use-theme-FNNvhyxv.mjs";
import { i as useImpersonate } from "./use-impersonate-D1wFi3Sj.mjs";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, t as DropdownMenu } from "./dropdown-menu-BosDdXX7.mjs";
import { r as listTenants } from "./tenants.functions-VB-HjL2R.mjs";
import { a as CommandInput, c as CommandSeparator, i as CommandGroup, n as CommandDialog, o as CommandItem, r as CommandEmpty, s as CommandList } from "./command-CfJ4Rdty.mjs";
import { t as createSyncStoragePersister } from "../_libs/@tanstack/query-sync-storage-persister+[...].mjs";
import { t as persistQueryClient } from "../_libs/@tanstack/query-persist-client-core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-BpzzMoY9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Sidebar control that lets the super_admin choose which tenant's data to
* show. Hierarchy: Super_Admin (self) → Treinadores (individual accounts) →
* Todos os treinadores. Selecting a specific trainer scopes ALL data as if
* the super admin were logged into that account.
*/
function TenantScopeSelector() {
	const qc = useQueryClient();
	const { user } = useAuth();
	const { scope, setScope } = useTenantScope();
	const fetchTenants = useServerFn(listTenants);
	const { data: tenants = [] } = useQuery({
		queryKey: ["tenants-list-scope"],
		queryFn: () => fetchTenants(),
		staleTime: 6e4
	});
	const trainers = tenants.filter((t) => t.userId !== user?.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-sidebar-foreground/70",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3 w-3" }), "Escopo dos dados"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
			value: scope,
			onValueChange: (v) => {
				setScope(v);
				qc.invalidateQueries();
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
				className: "h-8 text-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "own",
					children: "Super_Admin"
				}),
				trainers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel, {
					className: "text-[10px] uppercase tracking-wide",
					children: "Treinadores"
				}), trainers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
					value: t.userId,
					className: "pl-6",
					children: ["› ", t.email]
				}, t.userId))] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "all",
					children: "Todos os treinadores"
				})
			] })]
		})]
	});
}
/**
* Paleta de comandos global (⌘K / Ctrl+K).
* Navega entre páginas e vai direto à ficha de um aluno (Studio ou PT).
* A lista de alunos só é buscada quando o diálogo abre — nada de custo no load.
*/
function GlobalSearch({ items }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((v) => !v);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	const { data: people = [] } = useQuery({
		queryKey: ["global-search-people"],
		enabled: open,
		staleTime: 300 * 1e3,
		queryFn: async () => {
			const [studio, pt] = await Promise.all([supabase.from("students").select("id,name").is("deleted_at", null).limit(400), supabase.from("pt_students").select("id,name").limit(400)]);
			return [...(studio.data ?? []).map((s) => ({
				...s,
				kind: "studio"
			})), ...(pt.data ?? []).map((s) => ({
				...s,
				kind: "pt"
			}))];
		}
	});
	const groups = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const it of items) {
			const key = it.section ?? "Navegação";
			map.set(key, [...map.get(key) ?? [], it]);
		}
		return [...map.entries()];
	}, [items]);
	const go = (to) => {
		setOpen(false);
		navigate({ to });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: cn("focus-ring group flex h-9 items-center gap-2 rounded-lg border border-border bg-muted/40 px-2.5 text-muted-foreground transition-ui", "hover:border-primary/30 hover:bg-muted hover:text-foreground"),
		"aria-label": "Buscar",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 shrink-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden text-sm sm:inline",
				children: "Buscar…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
				className: "hidden shrink-0 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[0.625rem] font-medium sm:inline",
				children: "⌘K"
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandDialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, { placeholder: "Buscar páginas ou alunos…" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, { children: "Nada encontrado." }),
			groups.map(([section, list]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
				heading: section,
				children: list.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandItem, {
					value: `${section} ${it.label}`,
					onSelect: () => go(it.to),
					children: it.label
				}, it.to))
			}, section)),
			people.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandSeparator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
				heading: "Alunos",
				children: people.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
					value: `${p.name} ${p.kind}`,
					onSelect: () => go(p.kind === "studio" ? `/students/${p.id}` : `/personal-trainer/students/${p.id}`),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: p.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-caption ml-auto shrink-0 rounded bg-muted px-1.5 py-0.5 text-muted-foreground",
						children: p.kind === "studio" ? "Studio" : "PT"
					})]
				}, `${p.kind}-${p.id}`))
			})] })
		] })]
	})] });
}
function NotificationCenter() {
	const { user } = useAuth();
	const qc = useQueryClient();
	const navigate = useNavigate();
	const { data: notifications = [], refetch } = useQuery({
		queryKey: ["notifications", user?.id],
		enabled: !!user?.id,
		queryFn: async () => {
			const { data } = await supabase.from("pt_notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
			return data ?? [];
		},
		refetchInterval: 3e4
	});
	const unreadCount = notifications.filter((n) => !n.read).length;
	async function markAsRead(id) {
		await supabase.from("pt_notifications").update({ read: true }).eq("id", id);
		qc.invalidateQueries({ queryKey: ["notifications"] });
	}
	async function markAllAsRead() {
		if (!user) return;
		await supabase.from("pt_notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
		qc.invalidateQueries({ queryKey: ["notifications"] });
	}
	async function clearAll() {
		if (!user) return;
		await supabase.from("pt_notifications").delete().eq("user_id", user.id);
		qc.invalidateQueries({ queryKey: ["notifications"] });
	}
	const handleNotificationClick = (notification) => {
		markAsRead(notification.id);
		if (notification.type === "training_complete" && notification.metadata?.student_id) navigate({
			to: "/personal-trainer/students/$id",
			params: { id: notification.metadata.student_id }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			size: "icon",
			className: "relative",
			children: unreadCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellDot, { className: "h-5 w-5 text-primary animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white",
				children: unreadCount
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5 text-muted-foreground" })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		className: "w-80 p-0 shadow-xl border-border/50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold",
					children: "Notificações"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: markAllAsRead,
						className: "h-7 text-[10px] uppercase font-bold text-primary hover:text-primary hover:bg-primary/10",
						children: "Ler tudo"
					}), notifications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: clearAll,
						className: "h-7 w-7 text-muted-foreground hover:text-destructive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[350px] overflow-y-auto",
				children: notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-8 px-4 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-8 w-8 text-muted-foreground/20 mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Nenhuma notificação por aqui."
					})]
				}) : notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => handleNotificationClick(n),
					className: cn("relative flex cursor-pointer flex-col gap-1 border-b px-4 py-3 transition-colors hover:bg-muted/50", !n.read && "bg-primary/[0.03]"),
					children: [
						!n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1 top-4 h-1.5 w-1.5 rounded-full bg-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("text-xs font-bold leading-tight", !n.read ? "text-foreground" : "text-muted-foreground"),
								children: n.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "whitespace-nowrap text-[9px] text-muted-foreground uppercase font-medium",
								children: formatDistanceToNow(new Date(n.created_at), {
									addSuffix: true,
									locale: ptBR
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] leading-relaxed text-muted-foreground line-clamp-2",
							children: n.message
						})
					]
				}, n.id))
			}),
			notifications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-muted/30 px-4 py-2 text-center border-t",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
					children: "Apenas notificações recentes"
				})
			})
		]
	})] });
}
var nav = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/students",
		label: "Alunos",
		icon: Users,
		section: "Studio",
		module: "studio"
	},
	{
		to: "/payments",
		label: "Pagamentos",
		icon: CreditCard,
		section: "Studio",
		module: "studio"
	},
	{
		to: "/plans",
		label: "Planos",
		icon: ClipboardList,
		section: "Studio",
		module: "studio"
	},
	{
		to: "/agenda",
		label: "Turmas & Agenda",
		icon: Calendar,
		section: "Aulas",
		module: "studio"
	},
	{
		to: "/programs",
		label: "Programas",
		icon: ClipboardList,
		section: "Aulas",
		module: "studio"
	},
	{
		to: "/personal-trainer",
		label: "Personal Trainer",
		icon: Dumbbell,
		exact: true,
		section: "Personal Trainer",
		module: "pt"
	},
	{
		to: "/personal-trainer/checkin",
		label: "⚡ Check-in Rápido",
		icon: Zap,
		section: "Personal Trainer",
		module: "pt"
	},
	{
		to: "/personal-trainer/biblioteca",
		label: "Biblioteca",
		icon: Library,
		section: "Personal Trainer",
		module: "pt"
	},
	{
		to: "/financeiro",
		label: "Financeiro",
		icon: Wallet,
		section: "Gestão",
		module: "financeiro"
	},
	{
		to: "/crm",
		label: "CRM",
		icon: Megaphone,
		section: "Gestão",
		module: "crm"
	},
	{
		to: "/desafios",
		label: "Desafios",
		icon: Trophy,
		section: "Gestão"
	}
];
var LS_COLLAPSED$1 = "edufinance:sidebar-collapsed";
var LS_HOVER = "edufinance:sidebar-hover-expand";
function AppShell({ children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [collapsed, setCollapsedState] = (0, import_react.useState)(false);
	const [hoverExpand, setHoverExpandState] = (0, import_react.useState)(false);
	const [hovering, setHovering] = (0, import_react.useState)(false);
	const [timerOpen, setTimerOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			setCollapsedState(localStorage.getItem(LS_COLLAPSED$1) === "1");
			setHoverExpandState(localStorage.getItem(LS_HOVER) === "1");
		} catch {}
	}, []);
	const setCollapsed = (v) => {
		setCollapsedState(v);
		try {
			localStorage.setItem(LS_COLLAPSED$1, v ? "1" : "0");
		} catch {}
	};
	const setHoverExpand = (v) => {
		setHoverExpandState(v);
		try {
			localStorage.setItem(LS_HOVER, v ? "1" : "0");
		} catch {}
	};
	const iconOnly = collapsed && !(hoverExpand && hovering);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const spotlightNavRef = (0, import_react.useRef)(null);
	const spotlightBarRef = (0, import_react.useRef)(null);
	(0, import_react.useRef)({});
	(0, import_react.useEffect)(() => {
		const nav = spotlightNavRef.current;
		const bar = spotlightBarRef.current;
		if (!nav || !bar) return;
		const activeItem = nav.querySelector("[data-sidebar-active='true']");
		if (!activeItem) return;
		const navRect = nav.getBoundingClientRect();
		const itemRect = activeItem.getBoundingClientRect();
		bar.style.top = `${itemRect.top - navRect.top + 2}px`;
		bar.style.height = `${itemRect.height - 4}px`;
	}, [
		pathname,
		collapsed,
		hovering
	]);
	const navigate = useNavigate();
	const { user } = useAuth();
	const qc = useQueryClient();
	const { theme, toggleTheme } = useTheme();
	const { hasModule, isSuperAdmin: isSuperAdminReal, loading: modulesLoading } = useModules();
	const { mode: profileMode } = useProfileMode();
	const isSuperAdmin = isSuperAdminReal && profileMode === "super_admin";
	const { scope } = useTenantScope();
	const { scopeId } = useScopeFilter();
	const viewingOtherTenant = isSuperAdmin && scope !== "own" && scopeId !== user?.id;
	useImpersonate();
	const fetchTenants = useServerFn(listTenants);
	const { data: tenantsList = [] } = useQuery({
		queryKey: ["tenants-list-scope"],
		queryFn: () => fetchTenants(),
		staleTime: 6e4,
		enabled: isSuperAdminReal
	});
	const activeProfileLabel = (() => {
		if (!isSuperAdmin) return null;
		if (scope === "all") return "Todos os treinadores";
		if (scope === "own" || scopeId === user?.id) return null;
		return tenantsList.find((x) => x.userId === scope)?.email ?? "Treinador";
	})();
	const visibleNav = nav.filter((it) => !it.module || hasModule(it.module));
	const isActive = (to, exact) => exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");
	(0, import_react.useEffect)(() => {
		if (modulesLoading) return;
		const match = nav.find((n) => n.module && isActive(n.to, n.exact));
		if (match && match.module && !hasModule(match.module)) navigate({
			to: "/",
			replace: true
		});
	}, [
		pathname,
		modulesLoading,
		hasModule,
		navigate
	]);
	async function signOut() {
		await qc.cancelQueries();
		qc.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	}
	const asideWidth = iconOnly ? "md:w-16" : "md:w-60";
	const mainPad = collapsed ? "md:pl-16" : "md:pl-60";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full max-w-full overflow-x-clip bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				onMouseEnter: () => setHovering(true),
				onMouseLeave: () => setHovering(false),
				className: cn("fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-sidebar text-sidebar-foreground transition-[width,transform] duration-200 md:translate-x-0", asideWidth, open ? "translate-x-0" : "-translate-x-full md:translate-x-0", collapsed && hoverExpand && hovering && "md:shadow-2xl"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex h-16 items-center gap-2 border-b border-sidebar-border", iconOnly ? "justify-center px-2" : "px-5"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-5 w-5 text-primary-foreground" })
						}), !iconOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-base font-bold leading-none",
								children: "Montanha Personal Studio"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-sidebar-foreground/60",
								children: "Gestão Financeira & Inteligência Operacional para Studios e Personais"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						ref: spotlightNavRef,
						className: cn("relative flex-1 space-y-1 overflow-y-auto py-4", iconOnly ? "px-2" : "px-3"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								ref: spotlightBarRef,
								className: "pointer-events-none absolute left-1 w-1 rounded-sm bg-primary shadow-[2px_0_5px_rgba(249,115,22,.8),4px_0_11px_rgba(249,115,22,.45)] transition-[top,height] duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
							}),
							activeProfileLabel && !iconOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-primary-foreground shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleUserRound, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] font-semibold uppercase tracking-wider opacity-80",
										children: "Perfil acessado"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-xs font-semibold",
										children: activeProfileLabel
									})]
								})]
							}),
							activeProfileLabel && iconOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 flex justify-center rounded-lg bg-primary p-2 text-primary-foreground",
								title: `Perfil: ${activeProfileLabel}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleUserRound, { className: "h-4 w-4" })
							}),
							(() => {
								let lastSection;
								return visibleNav.map((item) => {
									const Icon = item.icon;
									const active = isActive(item.to, item.exact);
									const showHeader = item.section && item.section !== lastSection;
									lastSection = item.section;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										showHeader && !iconOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 mb-1 px-3 text-[10px] uppercase tracking-wider text-sidebar-foreground/50",
											children: item.section
										}),
										showHeader && iconOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-2 my-2 border-t border-sidebar-border/60" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: item.to,
											"data-sidebar-active": active,
											"data-testid": `sidebar-nav-${item.to.replace(/^\//, "").replace(/\//g, "-") || "dashboard"}`,
											onClick: () => setOpen(false),
											title: iconOnly ? item.label : void 0,
											className: cn("flex items-center rounded-lg text-sm font-medium transition-colors", iconOnly ? "justify-center px-2 py-2" : "gap-3 px-3 py-2", active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }), !iconOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: item.label
											})]
										})
									] }, item.to);
								});
							})(),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setOpen(false);
										setTimerOpen(true);
									},
									title: iconOnly ? "Timer de Treino" : void 0,
									className: cn("flex w-full items-center rounded-lg text-sm font-semibold transition-colors text-orange-500 hover:bg-orange-500/10 border border-orange-500/20", iconOnly ? "justify-center px-2 py-2" : "gap-3 px-3 py-2"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-4 w-4 shrink-0 text-orange-500" }), !iconOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: "Timer de Treino"
									})]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("border-t border-sidebar-border", iconOnly ? "p-2" : "p-3"),
						children: [
							isSuperAdmin && !iconOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TenantScopeSelector, {}),
							isSuperAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin/tenants",
								"data-testid": "sidebar-nav-admin-tenants",
								onClick: () => setOpen(false),
								title: iconOnly ? "Treinadores" : void 0,
								className: cn("flex items-center rounded-lg text-sm font-medium transition-colors", iconOnly ? "justify-center px-2 py-2" : "gap-3 px-3 py-2", pathname.startsWith("/admin") ? "bg-primary text-primary-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 shrink-0" }), !iconOnly && "Treinadores"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/settings",
								"data-testid": "sidebar-nav-settings",
								onClick: () => setOpen(false),
								title: iconOnly ? "Configurações" : void 0,
								className: cn("flex items-center rounded-lg text-sm font-medium transition-colors", iconOnly ? "justify-center px-2 py-2" : "gap-3 px-3 py-2", pathname === "/settings" ? "bg-primary text-primary-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4 shrink-0" }), !iconOnly && "Configurações"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setHoverExpand(!hoverExpand),
								title: hoverExpand ? "Fixar barra lateral" : "Expandir ao passar o mouse",
								className: cn("mt-2 hidden md:flex w-full items-center rounded-lg text-xs text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent", iconOnly ? "justify-center px-2 py-2" : "gap-2 px-3 py-2"),
								children: [hoverExpand ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinOff, { className: "h-3.5 w-3.5" }), !iconOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: hoverExpand ? "Expandir ao passar mouse" : "Barra fixa" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("mt-2 flex items-center gap-2 rounded-lg bg-sidebar-accent", iconOnly ? "justify-center p-2" : "justify-between px-3 py-2"),
								children: [!iconOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										"data-testid": "user-email-display",
										className: "truncate text-xs font-medium",
										children: user?.email ?? "Usuário"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-sidebar-foreground/60",
										children: "Conectado"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: signOut,
									"data-testid": "button-logout",
									title: "Sair",
									className: "rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-sidebar/40 hover:text-sidebar-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
								})]
							})
						]
					})
				]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-30 bg-overlay backdrop-blur-[2px] md:hidden",
				onClick: () => setOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex min-h-screen flex-1 min-w-0 max-w-full flex-col overflow-x-clip transition-[padding] duration-200", mainPad),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-20 flex h-14 w-full max-w-full min-w-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur md:px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "md:hidden",
								onClick: () => setOpen((v) => !v),
								"aria-label": open ? "Fechar menu" : "Abrir menu",
								children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "hidden md:inline-flex",
								onClick: () => setCollapsed(!collapsed),
								title: collapsed ? "Expandir barra lateral" : "Recolher barra lateral",
								"aria-label": collapsed ? "Expandir barra lateral" : "Recolher barra lateral",
								children: collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "truncate text-sm font-semibold text-foreground",
								children: nav.find((n) => isActive(n.to, n.exact))?.label ?? (pathname === "/settings" ? "Configurações" : "Montanha Personal Studio")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalSearch, { items: visibleNav.map((n) => ({
										to: n.to,
										label: n.label,
										section: n.section
									})) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationCenter, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: toggleTheme,
										className: "focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-transparent transition-ui hover:border-border hover:bg-accent",
										title: theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro",
										"aria-label": "Alternar tema",
										children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-[18px] w-[18px] text-state-pending" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-[18px] w-[18px] text-muted-foreground" })
									})
								]
							})
						]
					}),
					viewingOtherTenant && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 border-b border-primary/30 bg-primary/10 px-4 py-2 text-xs text-primary md:px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: "Modo suporte (Super_Admin):"
							}),
							" você está agindo sobre os dados de",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: scope === "all" ? "TODOS os treinadores" : scope.slice(0, 8) + "…"
							}),
							". Edições e exclusões são aplicadas nesta conta — volte para \"Super_Admin\" para gerir seus próprios registros."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1 min-w-0 max-w-full p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-clip",
						children
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainingTimerDialog, {
				open: timerOpen,
				onOpenChange: setTimerOpen
			})
		]
	});
}
function formatWhen(iso) {
	const d = new Date(iso);
	const diff = (Date.now() - d.getTime()) / 1e3;
	if (diff < 60) return "agora";
	if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
	if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
	return d.toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short"
	});
}
function NotificationsBell() {
	const { user } = useAuth();
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [popup, setPopup] = (0, import_react.useState)(null);
	const seenIds = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const hydrated = (0, import_react.useRef)(false);
	const { data: items = [] } = useQuery({
		queryKey: ["notifications", user?.id],
		enabled: !!user?.id,
		queryFn: async () => {
			const { data } = await supabase.from("notifications").select("id,title,body,read_at,created_at").eq("recipient_user_id", user.id).order("created_at", { ascending: false }).limit(30);
			return data ?? [];
		},
		refetchInterval: 6e4
	});
	const unread = (0, import_react.useMemo)(() => items.filter((n) => !n.read_at), [items]);
	(0, import_react.useEffect)(() => {
		if (!hydrated.current) {
			items.forEach((n) => seenIds.current.add(n.id));
			hydrated.current = true;
			return;
		}
		const fresh = items.filter((n) => !seenIds.current.has(n.id));
		fresh.forEach((n) => seenIds.current.add(n.id));
		const freshUnread = fresh.filter((n) => !n.read_at);
		if (freshUnread.length > 0) {
			const newest = freshUnread[0];
			toast.info(newest.title, { description: newest.body });
			setPopup(newest);
		}
	}, [items]);
	(0, import_react.useEffect)(() => {
		if (!user?.id) return;
		const channel = supabase.channel(`notif:${user.id}`).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "notifications",
			filter: `recipient_user_id=eq.${user.id}`
		}, () => qc.invalidateQueries({ queryKey: ["notifications", user.id] })).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [user?.id, qc]);
	async function markAllRead() {
		if (unread.length === 0) return;
		const ids = unread.map((n) => n.id);
		await supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).in("id", ids);
		qc.invalidateQueries({ queryKey: ["notifications", user?.id] });
	}
	async function markRead(id) {
		await supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
		qc.invalidateQueries({ queryKey: ["notifications", user?.id] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "icon",
				"aria-label": `Notificações${unread.length ? ` (${unread.length} não lidas)` : ""}`,
				className: "relative h-9 w-9 rounded-full text-sidebar-foreground/80 transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), unread.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground shadow ring-2 ring-sidebar",
					children: unread.length > 9 ? "9+" : unread.length
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
			align: "end",
			sideOffset: 8,
			className: "w-[min(22rem,calc(100vw-1.5rem))] p-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold",
					children: "Notificações"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] text-muted-foreground",
					children: unread.length > 0 ? `${unread.length} não lida${unread.length > 1 ? "s" : ""}` : "Tudo em dia"
				})] }), unread.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: markAllRead,
					className: "h-8 gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-3.5 w-3.5" }), "Marcar todas"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-96 overflow-y-auto",
				children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-2 px-4 py-10 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4 text-muted-foreground" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: "Sem notificações"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Você receberá avisos do seu studio por aqui."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: items.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => !n.read_at && markRead(n.id),
						className: cn("group flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-150", "hover:bg-accent focus-visible:bg-accent focus-visible:outline-none", !n.read_at && "bg-primary/[0.04]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("mt-1.5 h-2 w-2 shrink-0 rounded-full transition-colors", n.read_at ? "bg-muted-foreground/30" : "bg-primary"),
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("truncate text-sm", n.read_at ? "font-medium text-foreground/80" : "font-semibold text-foreground"),
									children: n.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-[10px] text-muted-foreground",
									children: formatWhen(n.created_at)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "line-clamp-2 text-xs leading-relaxed text-muted-foreground",
								children: n.body
							})]
						})]
					}) }, n.id))
				})
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!popup,
		onOpenChange: (o) => {
			if (!o && popup) {
				markRead(popup.id);
				setPopup(null);
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-center",
					children: popup?.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "whitespace-pre-wrap text-center leading-relaxed",
					children: popup?.body
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						if (popup) markRead(popup.id);
						setPopup(null);
					},
					className: "min-w-32 transition-all duration-200",
					children: "Entendi"
				})
			})]
		})
	})] });
}
function PortalAnnouncementPopup() {
	const fetchList = useServerFn(getActiveAnnouncementsForPortal);
	const signFn = useServerFn(getSignedAnnouncementImageUrl);
	const { data: rows = [] } = useQuery({
		queryKey: ["portal-announcements"],
		queryFn: () => fetchList(),
		staleTime: 300 * 1e3
	});
	const [current, setCurrent] = (0, import_react.useState)(null);
	const [imgUrl, setImgUrl] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!rows.length) return;
		const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		const pick = rows.find((r) => {
			const key = `ann-seen-${r.id}-${today}`;
			return !sessionStorage.getItem(key) && !localStorage.getItem(key);
		});
		if (pick) setCurrent(pick);
	}, [rows]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setImgUrl(null);
		if (!current?.image_url) return;
		signFn({ data: { path: current.image_url } }).then((r) => {
			if (!cancelled) setImgUrl(r.url);
		}).catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [current, signFn]);
	const close = () => {
		if (current) {
			const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			localStorage.setItem(`ann-seen-${current.id}-${today}`, "1");
		}
		setCurrent(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!current,
		onOpenChange: (o) => !o && close(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-center",
						children: current?.title || "Aviso do studio"
					}),
					current?.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "whitespace-pre-line text-center",
						children: current.body
					})
				] }),
				imgUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: imgUrl,
					alt: current?.title ?? "Aviso",
					className: "max-h-80 w-full rounded-md object-contain bg-muted"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
					className: "sm:justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: close,
						children: "Entendi"
					})
				})
			]
		})
	});
}
/**
* Persistência stale-while-revalidate do cache do portal do aluno.
*
* - Escopo: só as queries usadas nas rotas /portal/* (prefixos abaixo).
* - Storage: localStorage, chave namespaced por usuário — evita vazar
*   dados entre logins no mesmo device.
* - Buster: amarrado à versão do build. Deploy novo = cache descartado.
* - Sem service worker, sem alteração do manifest PWA.
*/
var PORTAL_KEY_PREFIXES = [
	"portal-",
	"perfil-",
	"pt-portal-",
	"agenda",
	"portal-mode"
];
var BUSTER = "v3";
function portalCacheKey(userId) {
	return `ef-portal-cache:${userId}`;
}
function clearPortalCache(userId) {
	if (typeof window === "undefined") return;
	try {
		if (userId) {
			window.localStorage.removeItem(portalCacheKey(userId));
			return;
		}
		const toRemove = [];
		for (let i = 0; i < window.localStorage.length; i++) {
			const k = window.localStorage.key(i);
			if (k && k.startsWith("ef-portal-cache:")) toRemove.push(k);
		}
		toRemove.forEach((k) => window.localStorage.removeItem(k));
	} catch {}
}
function PortalPersistGate() {
	const qc = useQueryClient();
	const { user } = useAuth();
	const userId = user?.id;
	(0, import_react.useEffect)(() => {
		if (!userId || typeof window === "undefined") return;
		let unsubscribe;
		try {
			const [unsub] = persistQueryClient({
				queryClient: qc,
				persister: createSyncStoragePersister({
					storage: window.localStorage,
					key: portalCacheKey(userId),
					throttleTime: 1e3
				}),
				maxAge: 1440 * 60 * 1e3,
				buster: BUSTER,
				dehydrateOptions: { shouldDehydrateQuery: (query) => {
					if (query.state.status !== "success") return false;
					const first = query.queryKey?.[0];
					if (typeof first !== "string") return false;
					return PORTAL_KEY_PREFIXES.some((p) => first === p || first.startsWith(p));
				} }
			});
			unsubscribe = unsub;
		} catch {}
		return () => {
			try {
				unsubscribe?.();
			} catch {}
		};
	}, [qc, userId]);
	return null;
}
var studioNav = [{
	to: "/portal",
	label: "Check-ins Studio",
	icon: Calendar,
	exact: true
}, {
	to: "/portal/perfil",
	label: "Meus dados",
	icon: User
}];
var ptNav = [{
	to: "/portal/pt",
	label: "Dados Personal",
	icon: User,
	exact: true
}, {
	to: "/portal/pt/treino",
	label: "Meu treino",
	icon: ClipboardList
}];
var bothNav = [
	{
		to: "/portal",
		label: "Check-ins Studio",
		icon: Calendar,
		exact: true
	},
	{
		to: "/portal/pt/treino",
		label: "Treino Personal",
		icon: ClipboardList
	},
	{
		to: "/portal/perfil",
		label: "Meus dados",
		icon: User
	}
];
var LS_COLLAPSED = "portal:sidebar-collapsed";
function PortalShell({ children }) {
	const { user } = useAuth();
	const { data: userTypes, isLoading: loadingTypes } = useQuery({
		queryKey: ["portal-user-types", user?.id],
		enabled: !!user?.id,
		queryFn: async () => {
			const [studio, pt] = await Promise.all([supabase.from("students").select("id").eq("account_user_id", user.id).maybeSingle(), supabase.from("pt_students").select("id").eq("account_user_id", user.id).maybeSingle()]);
			return {
				studio: !!studio.data,
				pt: !!pt.data
			};
		},
		staleTime: 6e4
	});
	const mode = loadingTypes || !userTypes ? "studio" : userTypes.studio && userTypes.pt ? "both" : userTypes.pt ? "pt" : "studio";
	const nav = mode === "both" ? bothNav : mode === "pt" ? ptNav : studioNav;
	const areaLabel = mode === "both" ? "Portal Híbrido" : mode === "pt" ? "Personal Trainer" : "Área do aluno";
	const [collapsed, setCollapsedState] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return false;
		try {
			const saved = localStorage.getItem(LS_COLLAPSED);
			if (saved === "1") return true;
			if (saved === "0") return false;
			return window.matchMedia("(max-width: 767px)").matches;
		} catch {
			return false;
		}
	});
	const setCollapsed = (v) => {
		setCollapsedState(v);
		try {
			localStorage.setItem(LS_COLLAPSED, v ? "1" : "0");
		} catch {}
	};
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const qc = useQueryClient();
	const { theme, toggleTheme } = useTheme();
	const [timerOpen, setTimerOpen] = (0, import_react.useState)(false);
	const isActive = (to, exact) => exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");
	async function signOut() {
		await qc.cancelQueries();
		qc.clear();
		clearPortalCache(user?.id);
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	}
	const isFetching = useIsFetching();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh w-full max-w-full overflow-x-clip bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalPersistGate, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				"aria-label": "Navegação principal",
				className: cn("sticky top-0 z-30 flex h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out", collapsed ? "w-14" : "w-60"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex h-16 items-center gap-2 border-b border-sidebar-border transition-[padding] duration-200", collapsed ? "justify-center px-2" : "px-5"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary shadow-card ring-1 ring-inset ring-primary-foreground/15",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-5 w-5 text-primary-foreground" })
						}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-[0.9375rem] font-bold leading-none tracking-tight",
								children: "Meu Studio"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-overline mt-1.5 text-sidebar-foreground/55",
								children: areaLabel
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: cn("flex-1 space-y-1 overflow-y-auto py-4", collapsed ? "px-2" : "px-3"),
						children: [nav.map((item) => {
							const Icon = item.icon;
							const active = isActive(item.to, item.exact);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								preload: "intent",
								title: collapsed ? item.label : void 0,
								className: cn("group relative flex items-center rounded-xl text-sm font-semibold outline-hidden transition-ui focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar active:scale-[0.99]", collapsed ? "h-11 justify-center px-2" : "min-h-11 gap-3 px-3 py-2.5", active ? "bg-primary/12 text-primary" : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"),
								children: [
									active && !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": true,
										className: "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-[1.125rem] w-[1.125rem] shrink-0 transition-ui", active ? "text-primary" : "text-sidebar-foreground/55 group-hover:text-sidebar-foreground") }),
									!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: item.label
									}),
									collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sr-only",
										children: item.label
									})
								]
							}, item.to);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setTimerOpen(true),
								title: "Timer de Treino",
								className: cn("group relative flex w-full items-center rounded-xl text-sm font-bold outline-hidden transition-all duration-200 active:scale-[0.98]", "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 border border-orange-400/40", collapsed ? "h-11 justify-center px-2" : "min-h-11 gap-3 px-3 py-2.5"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-[1.125rem] w-[1.125rem] shrink-0 group-hover:rotate-12 transition-transform" }),
									!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: "Timer de Treino"
									}),
									collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sr-only",
										children: "Timer de Treino"
									})
								]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("border-t border-sidebar-border", collapsed ? "p-2" : "p-3"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex items-center gap-2 rounded-lg bg-sidebar-accent transition-[padding] duration-200", collapsed ? "justify-center p-2" : "justify-between px-3 py-2"),
							children: [!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-xs font-semibold",
									children: user?.email ?? "Aluno"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 flex items-center gap-1.5 text-[10px] text-sidebar-foreground/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": true,
										className: "h-1.5 w-1.5 rounded-full bg-state-paid"
									}), "Conectado"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: signOut,
								title: "Sair",
								"aria-label": "Sair",
								className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sidebar-foreground/70 outline-hidden transition-ui hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 max-w-full flex-1 flex-col overflow-x-clip",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex h-16 w-full max-w-full min-w-0 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur-md md:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCollapsed(!collapsed),
							title: collapsed ? "Expandir barra lateral" : "Recolher barra lateral",
							"aria-label": collapsed ? "Expandir barra lateral" : "Recolher barra lateral",
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl text-muted-foreground outline-hidden transition-ui hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95",
							children: collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "min-w-0 truncate text-[0.9375rem] font-bold tracking-tight text-foreground",
							children: nav.find((n) => isActive(n.to, n.exact))?.label ?? "Portal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									"aria-live": "polite",
									"aria-hidden": isFetching === 0,
									className: cn("hidden items-center gap-1.5 rounded-full border border-border bg-muted/70 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-opacity duration-200 sm:inline-flex", isFetching > 0 ? "opacity-100" : "pointer-events-none opacity-0"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
										className: "h-3 w-3 animate-spin",
										"aria-hidden": true
									}), "Atualizando"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsBell, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: toggleTheme,
									className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl text-muted-foreground outline-hidden transition-ui hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 sm:h-10 sm:w-10",
									title: theme === "dark" ? "Modo claro" : "Modo escuro",
									"aria-label": "Alternar tema",
									children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-5 w-5 text-state-pending" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-5 w-5" })
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-w-0 max-w-full flex-1 p-3 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-6 lg:p-8 overflow-x-clip",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainingTimerDialog, {
				open: timerOpen,
				onOpenChange: setTimerOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalAnnouncementPopup, {})
		]
	});
}
function AuthenticatedLayout() {
	const { isAdmin, isStudent, loading } = useRole();
	const { mode, loading: modeLoading } = usePortalMode();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const isPortalPath = pathname === "/portal" || pathname.startsWith("/portal/");
	const isPTPortalPath = pathname === "/portal/pt" || pathname.startsWith("/portal/pt/");
	(0, import_react.useEffect)(() => {
		if (loading || modeLoading) return;
		if (isStudent) {
			if (mode === "both") {
				if (!isPortalPath) navigate({
					to: "/portal",
					replace: true
				});
			} else if (mode === "pt" && !isPTPortalPath) navigate({
				to: "/portal/pt",
				replace: true
			});
			else if (mode === "studio" && (isPTPortalPath || !isPortalPath)) navigate({
				to: "/portal",
				replace: true
			});
			else if (mode === null && !isPortalPath) navigate({
				to: "/portal",
				replace: true
			});
		}
		if (isAdmin && isPortalPath) navigate({
			to: "/",
			replace: true
		});
	}, [
		loading,
		modeLoading,
		isStudent,
		isAdmin,
		mode,
		isPortalPath,
		isPTPortalPath,
		navigate
	]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 text-muted-foreground animate-in fade-in duration-200",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: "h-6 w-6 rounded-full border-2 border-border border-t-primary animate-spin"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed",
				children: "Carregando seu ambiente…"
			})]
		})
	});
	if (isStudent || isPortalPath) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { AuthenticatedLayout as component };
