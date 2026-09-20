import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Image, r as Root, t as Fallback } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { $ as PenLine, A as Shield, Fn as ArrowRight, G as Plus, Gt as EllipsisVertical, It as Flame, Jt as DollarSign, Ln as ArrowLeft, Lt as FileText, M as ShieldAlert, Mn as Award, N as Share2, O as Sparkles, P as Share, Pt as Globe, R as Search, Vt as FileCheck, Wt as ExternalLink, Xt as CreditCard, Yt as Database, b as Trash2, ct as MessageCircle, d as UserPlus, dt as Medal, en as Clock, g as Trophy, j as ShieldCheck, k as Smartphone, m as UserCheck, mt as LogOut, n as X, qt as Download, s as Users, st as MessageSquare, t as Zap, v as TrendingUp, wt as Layers } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-BQ4bpKnp.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { O as isRedirect, _ as useNavigate, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$34 } from "../_._lovable.oauth.consent-AYP6ZP_0.mjs";
import { t as Badge } from "./badge-DB22ix_c.mjs";
import { t as PageHeader } from "./PageHeader-CRue-aiN.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { r as TooltipProvider } from "./tooltip-CJZST3UV.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { i as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as ConfirmDialogHost } from "./confirm-dialog-loCJ8q2f.mjs";
import { t as Input } from "./input-9fokkwDC.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { s as getMyQuotaUsage } from "./classes.functions-CBapcCd4.mjs";
import { t as Textarea } from "./textarea-iwNaZIEJ.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-CLfamRsg.mjs";
import { t as Route$35 } from "./auth-DMIFi4A8.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DT1SSYuq.mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
import { t as Route$36 } from "./biblioteca-BsFtuVWj.mjs";
import { a as createTanStackListToolsHandler, c as _enum, d as number, i as createTanStackInvokeToolHandler, n as defineMcp, o as createTanStackMcpHandler, p as string, r as defineTool, s as createTanStackOAuthProtectedResourceMetadataHandler, t as auth } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
import { t as Route$37 } from "./financeiro-NOyznWvM.mjs";
import { t as ThemeProvider } from "./use-theme-FNNvhyxv.mjs";
import { i as useImpersonate, n as clearImpersonation, r as setImpersonate } from "./use-impersonate-D1wFi3Sj.mjs";
import { a as DropdownMenuSeparator, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BosDdXX7.mjs";
import { a as useApplyFontSize, r as Route$38 } from "./settings-C07t28M0.mjs";
import { t as Route$39 } from "./students._id-Ds3vfVTS.mjs";
import { t as Route$40 } from "./students._id-D3SNXYF6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BVdmo8PO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-Daepak_Q.css";
/**
* Toasts alinhados ao design system: superfície de popover, elevação flutuante
* e tons de estado vindos de tokens (nada chumbado, dark mode de graça).
*/
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:rounded-xl group-[.toaster]:shadow-float group-[.toaster]:gap-3",
			title: "group-[.toast]:text-section",
			description: "group-[.toast]:text-caption group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg group-[.toast]:transition-ui",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg group-[.toast]:transition-ui",
			closeButton: "group-[.toast]:bg-popover group-[.toast]:border-border group-[.toast]:text-muted-foreground",
			success: "group-[.toaster]:border-state-paid/30 group-[.toaster]:[&_svg]:text-state-paid",
			warning: "group-[.toaster]:border-state-pending/30 group-[.toaster]:[&_svg]:text-state-pending",
			error: "group-[.toaster]:border-destructive/30 group-[.toaster]:[&_svg]:text-destructive",
			info: "group-[.toaster]:border-primary/30 group-[.toaster]:[&_svg]:text-primary"
		} },
		...props
	});
};
function PwaInstallBanner() {
	const [deferredPrompt, setDeferredPrompt] = (0, import_react.useState)(null);
	const [isIos, setIsIos] = (0, import_react.useState)(false);
	const [showIosGuide, setShowIosGuide] = (0, import_react.useState)(false);
	const [dismissed, setDismissed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) return;
		if (sessionStorage.getItem("eduflow_pwa_dismissed")) {
			setDismissed(true);
			return;
		}
		const ua = window.navigator.userAgent;
		const isIosDevice = /iphone|ipad|ipod/i.test(ua);
		const isSafari = /safari/i.test(ua) && !/chrome|crios|crmo/i.test(ua);
		if (isIosDevice && isSafari) setIsIos(true);
		const handleBeforeInstallPrompt = (e) => {
			e.preventDefault();
			setDeferredPrompt(e);
		};
		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		};
	}, []);
	const handleInstallClick = async () => {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			if (outcome === "accepted") setDeferredPrompt(null);
		} else if (isIos) setShowIosGuide(true);
	};
	const handleDismiss = () => {
		setDismissed(true);
		sessionStorage.setItem("eduflow_pwa_dismissed", "true");
	};
	if (dismissed || !deferredPrompt && !isIos) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		"aria-label": "Instalação do Aplicativo",
		className: "fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-5 duration-300",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-card/95 p-3.5 shadow-2xl backdrop-blur-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-xs font-bold text-foreground truncate",
						children: "Instalar App Coach Montanha"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground truncate",
						children: "Acesso rápido e direto da tela inicial"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: handleInstallClick,
					className: "h-8 px-3 text-xs font-semibold shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 mr-1" }), " Instalar"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					onClick: handleDismiss,
					className: "h-7 w-7 rounded-full text-muted-foreground hover:text-foreground",
					title: "Fechar aviso",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
				})]
			})]
		}), showIosGuide && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 rounded-xl border border-border bg-card p-3 shadow-xl text-xs text-foreground space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between font-bold text-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share, { className: "h-3.5 w-3.5" }), " Como instalar no iPhone:"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setShowIosGuide(false),
					className: "text-muted-foreground hover:text-foreground text-xs",
					children: "✕"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "list-decimal list-inside space-y-1 text-muted-foreground text-[11px] leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Toque no botão de ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Compartilhar" }),
						" na barra do Safari (ícone de quadrado com seta para cima)."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Role para baixo e selecione ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\"Adicionar à Tela de Início\"" }),
						"."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Toque em ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\"Adicionar\"" }),
						" no canto superior direito."
					] })
				]
			})]
		})]
	});
}
var ImpersonationBanner = () => {
	const impersonate = useImpersonate();
	if (!impersonate) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		"aria-label": "Aviso de Modo Suporte Técnico",
		className: "sticky top-0 z-[9999] w-full bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 border-b border-amber-500/40 backdrop-blur-xl px-4 py-2 text-xs text-amber-200 shadow-lg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "p-1 rounded-lg bg-amber-500/30 text-amber-300",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-4 h-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-extrabold uppercase tracking-wider text-[11px] text-amber-300",
							children: "Modo Suporte Técnico:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Você está operando como" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded border border-amber-500/30",
							children: impersonate.targetEmail
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-slate-400 hidden sm:inline",
							children: "(Seus privilégios de SuperAdmin permanecem ativos)"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-3 h-3" }), " Sessão Ativa"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => clearImpersonation(),
					className: "inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/50 font-bold transition text-xs cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-3 h-3" }), " Sair do modo suporte"]
				})]
			})]
		})
	});
};
var Route$33 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: "Montanha Personal Studio — Gestão Financeira & Inteligência Operacional para Studios e Personais" },
			{
				name: "description",
				content: "Gestão Financeira & Inteligência Operacional para Studios e Personais."
			},
			{
				property: "og:title",
				content: "Montanha Personal Studio — Gestão Financeira & Inteligência Operacional para Studios e Personais"
			},
			{
				property: "og:description",
				content: "Gestão Financeira & Inteligência Operacional para Studios e Personais."
			},
			{
				name: "twitter:title",
				content: "Montanha Personal Studio — Gestão Financeira & Inteligência Operacional para Studios e Personais"
			},
			{
				name: "twitter:description",
				content: "Gestão Financeira & Inteligência Operacional para Studios e Personais."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a1e6323a-33d0-41ff-b98a-0744e285697c/id-preview-899e1b68--69e8a911-c73d-4b50-a7e4-fcc5a1be4536.lovable.app-1782521708855.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a1e6323a-33d0-41ff-b98a-0744e285697c/id-preview-899e1b68--69e8a911-c73d-4b50-a7e4-fcc5a1be4536.lovable.app-1782521708855.png"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "theme-color",
				content: "#F8F9FE",
				media: "(prefers-color-scheme: light)"
			},
			{
				name: "theme-color",
				content: "#050a14",
				media: "(prefers-color-scheme: dark)"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "Montanha Personal Studio"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png"
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "192x192",
				href: "/icon-192.png"
			},
			{
				rel: "shortcut icon",
				href: "/icon-192.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
				fetchpriority: "high"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.cdnfonts.com/css/creato-display"
			}
		],
		scripts: [{ children: `try{var t=localStorage.getItem('edufinance.theme');var vt=localStorage.getItem('edufinance.visualTheme');if(!vt||!['padrao','pulse','midnight'].includes(vt)){vt='midnight';try{localStorage.setItem('edufinance.visualTheme','midnight')}catch(e){}}var isDark=t==='dark'||(!t&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(isDark){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}document.documentElement.setAttribute('data-tema',vt);var _w=typeof window!=='undefined'?window.innerWidth:1024;var _fs=localStorage.getItem('edufinance.fontSize');var _map=_w<640?{sm:14,md:15,lg:16,xl:17}:{sm:15,md:17,lg:19,xl:22};var _def=_w<640?'15px':'17px';if(_fs&&_map[_fs]){document.documentElement.style.fontSize=_map[_fs]+'px'}else{document.documentElement.style.fontSize=_def}}catch(e){}` }]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-bold",
				children: "404"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground",
				children: "Página não encontrada"
			})]
		})
	}),
	errorComponent: ({ error }) => {
		if (typeof window !== "undefined") console.error("Root errorComponent:", error);
		const recover = async () => {
			try {
				localStorage.removeItem("edufinance.impersonate");
				localStorage.removeItem("edufinance.tenantScope");
				localStorage.removeItem("edufinance.profileMode");
				Object.keys(localStorage).filter((k) => k.startsWith("sb-") && k.endsWith("-auth-token")).forEach((k) => localStorage.removeItem(k));
				try {
					await supabase.auth.signOut();
				} catch {}
			} finally {
				window.location.replace("/auth");
			}
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-h-screen items-center justify-center p-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-semibold",
						children: "Algo deu errado"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Tente novamente em alguns instantes. Se você entrou como outro treinador e ficou preso nesta tela, use o botão abaixo para sair e voltar ao login."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => window.location.reload(),
							className: "rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent",
							children: "Tentar novamente"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: recover,
							className: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
							children: "Sair e voltar ao login"
						})]
					})
				]
			})
		});
	}
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		"data-tema": "midnight",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
              #app-preloader {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                z-index: 999999;
                background-color: #050a14;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                transition: opacity 0.4s ease, visibility 0.4s ease;
              }
              #app-preloader.preloader-hidden {
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
                display: none !important;
              }
              .preloader-emblem-wrap {
                position: relative;
                width: 96px;
                height: 96px;
                border-radius: 28px;
                background: linear-gradient(135deg, #064e3b 0%, #022c22 100%);
                border: 2px solid rgba(16, 185, 129, 0.4);
                box-shadow: 0 0 35px rgba(16, 185, 129, 0.3), inset 0 0 15px rgba(16, 185, 129, 0.15);
                display: flex;
                align-items: center;
                justify-content: center;
                animation: preloaderPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
              }
              .preloader-aura-ring {
                position: absolute;
                inset: -6px;
                border-radius: 34px;
                border: 1.5px solid rgba(16, 185, 129, 0.25);
                animation: auraExpand 2.5s linear infinite;
              }
              .preloader-title {
                margin-top: 22px;
                font-size: 22px;
                font-weight: 900;
                letter-spacing: -0.02em;
                color: #f8fafc;
                text-align: center;
              }
              .preloader-title span {
                color: #10b981;
              }
              .preloader-subtitle {
                margin-top: 6px;
                font-size: 13px;
                font-weight: 500;
                color: #94a3b8;
                text-align: center;
                max-width: 340px;
                padding: 0 16px;
              }
              .preloader-spinner {
                margin-top: 24px;
                width: 26px;
                height: 26px;
                border: 3px solid rgba(16, 185, 129, 0.15);
                border-top-color: #10b981;
                border-radius: 50%;
                animation: preloaderSpin 0.75s linear infinite;
              }
              .preloader-progress-track {
                margin-top: 20px;
                width: 160px;
                height: 4px;
                background: rgba(255, 255, 255, 0.08);
                border-radius: 99px;
                overflow: hidden;
              }
              .preloader-progress-bar {
                height: 100%;
                width: 60%;
                background: linear-gradient(90deg, #10b981, #34d399);
                border-radius: 99px;
                animation: progressMove 1.5s ease-in-out infinite alternate;
              }
              @keyframes preloaderPulse {
                0%, 100% { transform: scale(1); box-shadow: 0 0 35px rgba(16, 185, 129, 0.3); }
                50% { transform: scale(1.05); box-shadow: 0 0 50px rgba(16, 185, 129, 0.5); }
              }
              @keyframes auraExpand {
                0% { opacity: 0.8; transform: scale(0.95); }
                100% { opacity: 0; transform: scale(1.2); }
              }
              @keyframes preloaderSpin {
                to { transform: rotate(360deg); }
              }
              @keyframes progressMove {
                0% { transform: translateX(-40%); }
                100% { transform: translateX(100%); }
              }
            ` } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "app-preloader",
				"aria-label": "Carregando Montanha Personal Studio...",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "preloader-emblem-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "preloader-aura-ring" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							width: "48",
							height: "48",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "#10b981",
							strokeWidth: "2.2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M22 12h-4l-3 9L9 3l-3 9H2" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "preloader-title",
						children: ["Montanha ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Personal Studio" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "preloader-subtitle",
						children: "Gestão Financeira & Inteligência Operacional para Studios e Personais"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "preloader-spinner" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "preloader-progress-track",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "preloader-progress-bar" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: `(function(){
              function dismiss(){
                var p = document.getElementById('app-preloader');
                if(p){
                  p.classList.add('preloader-hidden');
                  p.style.display = 'none';
                }
              }
              if (document.readyState === 'complete') {
                setTimeout(dismiss, 50);
              } else {
                window.addEventListener('load', function(){ setTimeout(dismiss, 50); });
                setTimeout(dismiss, 500);
              }
            })();` } }),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$33.useRouteContext();
	const router = useRouter();
	const currentSearch = useRouterState({ select: (s) => s.location.search });
	useApplyFontSize();
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const params = new URLSearchParams(window.location.search);
		const impersonateParam = params.get("impersonate");
		if (impersonateParam && impersonateParam.trim()) {
			const email = impersonateParam.trim().toLowerCase();
			setImpersonate({
				targetEmail: email,
				targetUserId: `support_${email}`,
				superAdminEmail: "admin@montanha.app",
				startedAt: Date.now()
			});
		}
		if (params.get("reset") !== "1") return;
		(async () => {
			try {
				localStorage.removeItem("edufinance.impersonate");
				localStorage.removeItem("edufinance.tenantScope");
				localStorage.removeItem("edufinance.profileMode");
				Object.keys(localStorage).filter((k) => k.startsWith("sb-") && k.endsWith("-auth-token")).forEach((k) => localStorage.removeItem(k));
				try {
					await supabase.auth.signOut();
				} catch {}
			} finally {
				window.location.replace("/auth");
			}
		})();
	}, [currentSearch]);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
				router.invalidate();
				if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
			}
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
		navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).then((reg) => {
			const intervalId = setInterval(() => {
				reg.update().catch(() => {});
			}, 900 * 1e3);
			return () => clearInterval(intervalId);
		}).catch((err) => {
			console.warn("Falha ao registrar Service Worker:", err);
		});
		if ("caches" in window) caches.keys().then((names) => {
			names.forEach((name) => {
				if (name === "coach-montanha-pwa-v1" || name === "coach-montanha-pwa-v2") caches.delete(name);
			});
		}).catch(() => {});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImpersonationBanner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				richColors: true,
				position: "top-right"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialogHost, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwaInstallBanner, {})
		] }) })
	});
}
var $$splitComponentImporter$19 = () => import("./reset-password-D6wgrEMR.mjs");
var Route$32 = createFileRoute("/reset-password")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var list_students_default = defineTool({
	name: "list_students",
	title: "Listar alunos do Studio",
	description: "Lista os alunos do Studio (academia) do usuário autenticado. Suporta filtro por status (active, inactive, churned) e busca por nome/email.",
	inputSchema: {
		status: _enum([
			"active",
			"inactive",
			"churned"
		]).optional(),
		search: string().trim().optional().describe("Busca no nome ou email"),
		limit: number().int().min(1).max(200).default(50)
	},
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async ({ status, search, limit }, ctx) => {
		if (!ctx.isAuthenticated()) return {
			content: [{
				type: "text",
				text: "Não autenticado"
			}],
			isError: true
		};
		let q = getMcpSupabaseClient(ctx).from("students").select("id,name,email,phone,status,start_date,created_at").is("deleted_at", null).order("name").limit(limit);
		if (status) q = q.eq("status", status);
		if (search) q = q.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
		const { data, error } = await q;
		if (error) return {
			content: [{
				type: "text",
				text: error.message
			}],
			isError: true
		};
		return {
			content: [{
				type: "text",
				text: JSON.stringify(data ?? [])
			}],
			structuredContent: { students: data ?? [] }
		};
	}
});
var list_pt_students_default = defineTool({
	name: "list_pt_students",
	title: "Listar alunos de Personal Trainer",
	description: "Lista os alunos de Personal Trainer (PT) do usuário autenticado. Suporta filtro por status e busca por nome/email.",
	inputSchema: {
		status: _enum([
			"active",
			"inactive",
			"churned"
		]).optional(),
		search: string().trim().optional().describe("Busca no nome ou email"),
		limit: number().int().min(1).max(200).default(50)
	},
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async ({ status, search, limit }, ctx) => {
		if (!ctx.isAuthenticated()) return {
			content: [{
				type: "text",
				text: "Não autenticado"
			}],
			isError: true
		};
		let q = getMcpSupabaseClient(ctx).from("pt_students").select("id,name,email,phone,status,goal,start_date,created_at").is("deleted_at", null).order("name").limit(limit);
		if (status) q = q.eq("status", status);
		if (search) q = q.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
		const { data, error } = await q;
		if (error) return {
			content: [{
				type: "text",
				text: error.message
			}],
			isError: true
		};
		return {
			content: [{
				type: "text",
				text: JSON.stringify(data ?? [])
			}],
			structuredContent: { students: data ?? [] }
		};
	}
});
var list_recent_payments_default = defineTool({
	name: "list_recent_payments",
	title: "Listar pagamentos recentes",
	description: "Lista pagamentos recentes do módulo Studio ou PT do usuário autenticado. Suporta filtro por status (paid, pending, overdue).",
	inputSchema: {
		module: _enum(["studio", "pt"]).default("studio"),
		status: _enum([
			"paid",
			"pending",
			"overdue"
		]).optional(),
		limit: number().int().min(1).max(200).default(50)
	},
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async ({ module, status, limit }, ctx) => {
		if (!ctx.isAuthenticated()) return {
			content: [{
				type: "text",
				text: "Não autenticado"
			}],
			isError: true
		};
		const sb = getMcpSupabaseClient(ctx);
		const table = module === "pt" ? "pt_payments" : "payments";
		let q = sb.from(table).select("id,amount,status,payment_date,due_date,reference_month,payment_method").is("deleted_at", null).order("payment_date", {
			ascending: false,
			nullsFirst: false
		}).order("due_date", {
			ascending: false,
			nullsFirst: false
		}).limit(limit);
		if (status) q = q.eq("status", status);
		const { data, error } = await q;
		if (error) return {
			content: [{
				type: "text",
				text: error.message
			}],
			isError: true
		};
		return {
			content: [{
				type: "text",
				text: JSON.stringify(data ?? [])
			}],
			structuredContent: { payments: data ?? [] }
		};
	}
});
var financial_overview_default = defineTool({
	name: "financial_overview",
	title: "Resumo financeiro",
	description: "Retorna um resumo financeiro do usuário autenticado: total de alunos ativos (Studio e PT), pagamentos pendentes/atrasados e receita paga do mês corrente.",
	inputSchema: {},
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async (_input, ctx) => {
		if (!ctx.isAuthenticated()) return {
			content: [{
				type: "text",
				text: "Não autenticado"
			}],
			isError: true
		};
		const sb = getMcpSupabaseClient(ctx);
		const now = /* @__PURE__ */ new Date();
		const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
		const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
		const [studioActive, ptActive, studioPend, ptPend, studioPaid, ptPaid] = await Promise.all([
			sb.from("students").select("id", {
				count: "exact",
				head: true
			}).is("deleted_at", null).eq("status", "active"),
			sb.from("pt_students").select("id", {
				count: "exact",
				head: true
			}).is("deleted_at", null).eq("status", "active"),
			sb.from("payments").select("amount,status").is("deleted_at", null).in("status", ["pending", "overdue"]),
			sb.from("pt_payments").select("amount,status").is("deleted_at", null).in("status", ["pending", "overdue"]),
			sb.from("payments").select("amount").is("deleted_at", null).eq("status", "paid").gte("payment_date", monthStart).lte("payment_date", monthEnd),
			sb.from("pt_payments").select("amount").is("deleted_at", null).eq("status", "paid").gte("payment_date", monthStart).lte("payment_date", monthEnd)
		]);
		const sum = (rows) => (rows ?? []).reduce((a, r) => a + (Number(r.amount) || 0), 0);
		const overview = {
			month: monthStart.slice(0, 7),
			studio: {
				active_students: studioActive.count ?? 0,
				pending_amount: sum((studioPend.data ?? []).filter((r) => r.status === "pending")),
				overdue_amount: sum((studioPend.data ?? []).filter((r) => r.status === "overdue")),
				month_paid: sum(studioPaid.data)
			},
			pt: {
				active_students: ptActive.count ?? 0,
				pending_amount: sum((ptPend.data ?? []).filter((r) => r.status === "pending")),
				overdue_amount: sum((ptPend.data ?? []).filter((r) => r.status === "overdue")),
				month_paid: sum(ptPaid.data)
			}
		};
		return {
			content: [{
				type: "text",
				text: JSON.stringify(overview)
			}],
			structuredContent: overview
		};
	}
});
function getMcpSupabaseClient(ctx) {
	return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
		global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});
}
var mcp_default = defineMcp({
	name: "studio-coach-montanha-mcp",
	title: "Studio Coach Montanha",
	version: "0.1.0",
	instructions: "Ferramentas para consultar alunos (Studio e Personal Trainer), pagamentos e um resumo financeiro do usuário autenticado. Todas as leituras respeitam RLS — cada usuário só vê os próprios dados.",
	auth: auth.oauth.issuer({
		issuer: `https://xhxlzawgrzmtgilrzout.supabase.co/auth/v1`,
		acceptedAudiences: "authenticated"
	}),
	tools: [
		list_students_default,
		list_pt_students_default,
		list_recent_payments_default,
		financial_overview_default
	]
});
var Route$31 = createFileRoute("/mcp")({ server: { handlers: { ANY: createTanStackMcpHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var $$splitComponentImporter$18 = () => import("./master-admin-DoozlAQj.mjs");
var Route$30 = createFileRoute("/master-admin")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var Route$29 = createFileRoute("/eco")({ component: EcoPage });
var ECOSYSTEM_APPS = [
	{
		id: "eduflow-finance",
		name: "Montanha Personal Studio",
		tag: "Plataforma Atual",
		category: "Finanças & Gestão de Studio",
		color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
		icon: DollarSign,
		url: "/",
		isLocal: true,
		description: "Gestão financeira para personal trainers, controle de alunos, cobrança recorrente, contratos e relatórios."
	},
	{
		id: "sistema-hibrido",
		name: "Montanha Hybrid Training",
		tag: "Treinamento & Periodização",
		category: "Alta Performance & Endurance",
		color: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
		icon: Flame,
		url: "http://localhost:5176/eco",
		isLocal: false,
		description: "Periodização avançada com IA, prescrição de treinos híbridos, endurance, musculação e LPO."
	},
	{
		id: "smart-language",
		name: "Montanha Language AI",
		tag: "Smart Language",
		category: "Idiomas & Imersão com IA",
		color: "border-indigo-500/40 bg-indigo-500/10 text-indigo-300",
		icon: Globe,
		url: "http://localhost:5174/eco",
		isLocal: false,
		description: "Tutor de idiomas inteligente com IA, microtreinos de 5 minutos e fluência acelerada."
	},
	{
		id: "construtor-pdf",
		name: "Montanha PDF Studio",
		tag: "Editorial & PDFs",
		category: "Diagramação Editorial",
		color: "border-amber-500/40 bg-amber-500/10 text-amber-300",
		icon: FileText,
		url: "http://localhost:5175/eco",
		isLocal: false,
		description: "Gerador e diagramador de relatórios financeiros, contratos e fichas com padrão editorial suíço."
	},
	{
		id: "whatsapp-lovable",
		name: "Montanha WhatsApp Automation",
		tag: "SaaS WhatsApp",
		category: "Automação & CRM",
		color: "border-purple-500/40 bg-purple-500/10 text-purple-300",
		icon: MessageSquare,
		url: "http://localhost:3000/#/eco",
		isLocal: false,
		description: "Cobrança inteligente via WhatsApp, lembretes de renovação e mensagens de engajamento para alunos."
	}
];
function EcoPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground p-4 md:p-8 space-y-8 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 p-6 md:p-10 shadow-2xl backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 mr-1.5 text-emerald-400" }), "Ecossistema Montanha Hub"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "border-purple-500/50 bg-purple-500/10 text-purple-300 text-xs font-bold uppercase tracking-wider px-3 py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-3.5 h-3.5 mr-1.5 text-purple-400" }), "Ruflo Eco Engine v2.5"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-3xl md:text-5xl font-black tracking-tight text-white",
							children: ["Hub do Ecossistema ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-emerald-400",
								children: "Montanha"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm md:text-base text-muted-foreground max-w-3xl leading-relaxed",
							children: "Painel unificado dos 5 aplicativos do Ecossistema Montanha. Conecte sua gestão financeira com treinamentos, comunicação via WhatsApp, diagramação de relatórios em PDF e tutoria por IA."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3 pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									className: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold shadow-lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/create",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 mr-2" }), "Criação Rápida de Planos"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "outline",
									className: "border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-300 font-bold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/boost",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 mr-2" }), "Aceleração Financeira"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "outline",
									className: "border-purple-500/40 hover:bg-purple-500/10 text-purple-300 font-bold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/master-admin",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 mr-2" }), "Painel Master SuperAdmin"]
									})
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5 border-emerald-500/20 bg-card/60 backdrop-blur-md space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold uppercase tracking-wider",
									children: "Economia de Tokens"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-4 h-4 text-emerald-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-black text-emerald-400",
								children: "84.7%"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Redução de custos em relatórios com Ruflo /eco"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5 border-purple-500/20 bg-card/60 backdrop-blur-md space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold uppercase tracking-wider",
									children: "Cache de Contratos"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "w-4 h-4 text-purple-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-black text-purple-400",
								children: "0 Tokens"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Reutilização de minutas contratuais em cache"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5 border-cyan-500/20 bg-card/60 backdrop-blur-md space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold uppercase tracking-wider",
									children: "Compressão Financeira"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4 text-cyan-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-black text-cyan-400",
								children: "Ativa"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Sumarização ultrarrápida de fluxo de caixa"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5 border-amber-500/20 bg-card/60 backdrop-blur-md space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold uppercase tracking-wider",
									children: "Trava Anti-Abuso"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-amber-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-black text-amber-400",
								children: "100% Blindada"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Proteção de licenças e acesso multi-tenant"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-2xl font-black tracking-tight text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-6 h-6 text-emerald-400" }), "Aplicativos do Ecossistema Montanha"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Integração nativa entre as 5 ferramentas para gestão integral do seu negócio."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
					children: ECOSYSTEM_APPS.map((app) => {
						const Icon = app.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: `p-6 border transition-all duration-200 hover:shadow-xl hover:border-emerald-500/50 bg-card/70 backdrop-blur-md flex flex-col justify-between space-y-4 ${app.isLocal ? "ring-2 ring-emerald-500/30" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-3 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-6 h-6" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-end gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${app.color}`,
												children: app.tag
											}), app.isLocal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold text-emerald-400",
												children: "App Local"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-extrabold text-base text-white",
										children: app.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-muted-foreground",
										children: app.category
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-300 leading-relaxed",
										children: app.description
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-2",
								children: app.isLocal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									className: "w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: app.url,
										children: ["Acessar Aplicativo ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 ml-1.5" })]
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "outline",
									className: "w-full border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 font-bold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: app.url,
										target: "_blank",
										rel: "noopener noreferrer",
										children: ["Abrir Módulo ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-4 h-4 ml-1.5" })]
									})
								})
							})]
						}, app.id);
					})
				})]
			})
		]
	});
}
var Route$28 = createFileRoute("/create")({ component: CreateStudioPage });
function CreateStudioPage() {
	useNavigate();
	const [alunoNome, setAlunoNome] = (0, import_react.useState)("");
	const [alunoEmail, setAlunoEmail] = (0, import_react.useState)("");
	const [alunoTelefone, setAlunoTelefone] = (0, import_react.useState)("");
	const [planoNome, setPlanoNome] = (0, import_react.useState)("Plano VIP Mensal");
	const [planoValor, setPlanoValor] = (0, import_react.useState)("350");
	const [planoCiclo, setPlanoCiclo] = (0, import_react.useState)("mensal");
	const [contratoTipo, setContratoTipo] = (0, import_react.useState)("personal");
	const handleSalvarAlunoRapido = (e) => {
		e.preventDefault();
		if (!alunoNome || !alunoEmail) {
			toast.error("Informe ao menos nome e e-mail do aluno.");
			return;
		}
		toast.success(`Aluno ${alunoNome} pré-cadastrado com sucesso!`);
		setAlunoNome("");
		setAlunoEmail("");
		setAlunoTelefone("");
	};
	const handleSalvarPlanoRapido = (e) => {
		e.preventDefault();
		if (!planoNome || !planoValor) {
			toast.error("Informe nome e valor do plano.");
			return;
		}
		toast.success(`Plano "${planoNome}" (R$ ${planoValor}/${planoCiclo}) criado!`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground p-4 md:p-8 space-y-8 max-w-7xl mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 p-6 md:p-10 shadow-2xl backdrop-blur-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 mr-1.5 text-emerald-400" }), "Estúdio de Criação Rápida"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "border-cyan-500/50 bg-cyan-500/10 text-cyan-300 text-xs font-bold uppercase tracking-wider px-3 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-3.5 h-3.5 mr-1.5 text-cyan-400" }), "Planos, Contratos & Alunos"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-3xl md:text-5xl font-black tracking-tight text-white",
						children: ["Criação Rápida ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-emerald-400",
							children: "Studio & Finanças"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed mt-1",
						children: "Cadastre novos alunos, crie planos de assinatura recorrente e gere minutas de contratos digitais em instantes."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-xs font-bold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/eco",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-3.5 h-3.5 mr-1.5" }), "Hub Ecossistema"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-300 text-xs font-bold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/boost",
									children: "Aceleração VIP"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/students",
									children: ["Ver Todos os Alunos ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3.5 h-3.5 ml-1.5" })]
								})
							})
						]
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6 border-slate-800 bg-card/70 backdrop-blur-md space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-slate-800 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-5 h-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-extrabold text-base text-white",
								children: "1. Novo Aluno"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Adicione um novo cliente à sua carteira do studio"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[10px] border-emerald-500/40 text-emerald-300",
							children: "Rápido"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSalvarAlunoRapido,
						className: "space-y-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "alunoNome",
									className: "text-xs font-bold",
									children: "Nome Completo"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "alunoNome",
									placeholder: "Ex: Carlos Eduardo Silveira",
									value: alunoNome,
									onChange: (e) => setAlunoNome(e.target.value),
									className: "bg-slate-900 border-slate-800",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "alunoEmail",
										className: "text-xs font-bold",
										children: "E-mail"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "alunoEmail",
										type: "email",
										placeholder: "aluno@email.com",
										value: alunoEmail,
										onChange: (e) => setAlunoEmail(e.target.value),
										className: "bg-slate-900 border-slate-800",
										required: true
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "alunoTelefone",
										className: "text-xs font-bold",
										children: "WhatsApp / Telefone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "alunoTelefone",
										placeholder: "(11) 99999-9999",
										value: alunoTelefone,
										onChange: (e) => setAlunoTelefone(e.target.value),
										className: "bg-slate-900 border-slate-800 font-mono"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								className: "w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-1.5" }), " Cadastrar Aluno"]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6 border-slate-800 bg-card/70 backdrop-blur-md space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-slate-800 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "w-5 h-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-extrabold text-base text-white",
								children: "2. Novo Plano & Assinatura"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Defina valores, recorrência e modalidade de treino"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[10px] border-cyan-500/40 text-cyan-300",
							children: "Financeiro"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSalvarPlanoRapido,
						className: "space-y-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "planoNome",
									className: "text-xs font-bold",
									children: "Nome do Plano"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "planoNome",
									placeholder: "Ex: Consultoria Híbrida VIP",
									value: planoNome,
									onChange: (e) => setPlanoNome(e.target.value),
									className: "bg-slate-900 border-slate-800",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "planoValor",
										className: "text-xs font-bold",
										children: "Valor (R$)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "planoValor",
										type: "number",
										placeholder: "350",
										value: planoValor,
										onChange: (e) => setPlanoValor(e.target.value),
										className: "bg-slate-900 border-slate-800 font-mono font-bold",
										required: true
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "planoCiclo",
										className: "text-xs font-bold",
										children: "Periodicidade"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										id: "planoCiclo",
										value: planoCiclo,
										onChange: (e) => setPlanoCiclo(e.target.value),
										className: "w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-500 font-bold",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "mensal",
												children: "Mensal (Recorrente)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "trimestral",
												children: "Trimestral (3 Meses)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "semestral",
												children: "Semestral (6 Meses)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "anual",
												children: "Anual (12 Meses)"
											})
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								className: "w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-1.5" }), " Criar Plano"]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6 border-slate-800 bg-card/70 backdrop-blur-md space-y-4 lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-slate-800 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "w-5 h-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-extrabold text-base text-white",
									children: "3. Contrato Digital de Prestação de Serviços com IA"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Gere termos de compromisso com assinatura digital válida"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[10px] border-purple-500/40 text-purple-300",
								children: "Jurídico & Proteção"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => setContratoTipo("personal"),
									className: `p-4 rounded-xl border cursor-pointer transition ${contratoTipo === "personal" ? "bg-purple-600/15 border-purple-500 text-white" : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold block text-sm mb-1",
										children: "🏋️ Personal Trainer Presencial"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Cláusulas de cancelamento com 24h de antecedência e reposição de aulas."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => setContratoTipo("online"),
									className: `p-4 rounded-xl border cursor-pointer transition ${contratoTipo === "online" ? "bg-purple-600/15 border-purple-500 text-white" : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold block text-sm mb-1",
										children: "💻 Consultoria Online / Híbrida"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Acesso ao aplicativo Montanha, atualizações de planilhas e suporte WhatsApp."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => setContratoTipo("studio"),
									className: `p-4 rounded-xl border cursor-pointer transition ${contratoTipo === "studio" ? "bg-purple-600/15 border-purple-500 text-white" : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold block text-sm mb-1",
										children: "🏢 Matrícula Studio & Turmas"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Contrato de adesão com recorrência automática no cartão e termos de saúde PAR-Q."
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row justify-between items-center gap-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-slate-400",
								children: "Termos alinhados com o Código de Defesa do Consumidor e CREF/CONFEF."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => toast.success("Minuta de contrato gerada! Você pode compartilhá-la pelo WhatsApp."),
								className: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 mr-1.5" }), " Gerar Minuta de Contrato"]
							})]
						})
					]
				})
			]
		})]
	});
}
var Route$27 = createFileRoute("/boost")({ component: BoostPage });
function BoostPage() {
	const [ticketMedio, setTicketMedio] = (0, import_react.useState)(350);
	const [qtdAlunos, setQtdAlunos] = (0, import_react.useState)(25);
	const mrrAtual = ticketMedio * qtdAlunos;
	const mrrComUpsell15 = Math.round(mrrAtual * 1.15);
	const mrrAnualizado = mrrAtual * 12;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground p-4 md:p-8 space-y-8 max-w-7xl mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 p-6 md:p-10 shadow-2xl backdrop-blur-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-3.5 h-3.5 mr-1.5 text-emerald-400" }), "Aceleração Financeira & VIP"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "border-purple-500/50 bg-purple-500/10 text-purple-300 text-xs font-bold uppercase tracking-wider px-3 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5 mr-1.5 text-purple-400" }), "Diagnóstico de Receita & Retenção"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-3xl md:text-5xl font-black tracking-tight text-white",
						children: ["Módulos VIP & ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-emerald-400",
							children: "Aceleração"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed mt-1",
						children: "Escale o faturamento do seu studio com simulação de MRR, estratégias anti-inadimplência e retenção preditiva de alunos."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-xs font-bold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/eco",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-3.5 h-3.5 mr-1.5" }), "Hub Ecossistema"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/create",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 mr-1.5" }), "Criar Novo Plano VIP"]
							})
						})]
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6 border-slate-800 bg-card/70 backdrop-blur-md space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 border-b border-slate-800 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-5 h-5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-extrabold text-base text-white",
							children: "Simulador de MRR & Escala"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Projete sua receita mensal recorrente"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ticket",
									className: "text-xs font-bold",
									children: "Ticket Médio por Aluno (R$)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ticket",
									type: "number",
									value: ticketMedio,
									onChange: (e) => setTicketMedio(Number(e.target.value)),
									className: "bg-slate-900 border-slate-800 font-mono font-bold"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "alunos",
									className: "text-xs font-bold",
									children: "Quantidade de Alunos Ativos"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "alunos",
									type: "number",
									value: qtdAlunos,
									onChange: (e) => setQtdAlunos(Number(e.target.value)),
									className: "bg-slate-900 border-slate-800 font-mono font-bold"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-slate-950/80 p-3 rounded-xl border border-emerald-500/30",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground uppercase tracking-wider block font-bold",
												children: "MRR Atual"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-2xl font-black text-emerald-400 font-mono",
												children: ["R$ ", mrrAtual.toLocaleString("pt-BR")]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-400 block mt-0.5",
												children: "Faturamento mensal bruto"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-slate-950/80 p-3 rounded-xl border border-purple-500/30",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground uppercase tracking-wider block font-bold",
												children: "Com Upsell VIP (+15%)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-2xl font-black text-purple-400 font-mono",
												children: ["R$ ", mrrComUpsell15.toLocaleString("pt-BR")]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] text-slate-400 block mt-0.5",
												children: [
													"+R$ ",
													(mrrComUpsell15 - mrrAtual).toLocaleString("pt-BR"),
													" a mais por mês"
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-slate-950/80 p-3 rounded-xl border border-cyan-500/30",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground uppercase tracking-wider block font-bold",
											children: "Projeção Anual (ARR)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xl font-black text-cyan-400 font-mono",
											children: ["R$ ", mrrAnualizado.toLocaleString("pt-BR")]
										})]
									})
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6 border-slate-800 bg-card/70 backdrop-blur-md space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 border-b border-slate-800 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-5 h-5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-extrabold text-base text-white",
								children: "Trava Anti-Inadimplência"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Régua de cobrança automática via WhatsApp"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-200",
											children: "1. Aviso Preventivo (D-3)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] border-emerald-500/40 text-emerald-300",
											children: "Ativo"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Lembrete cordial com link Pix 3 dias antes da fatura vencer."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-200",
											children: "2. Notificação no Vencimento (D-0)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] border-cyan-500/40 text-cyan-300",
											children: "Ativo"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Mensagem matinal confirmando o vencimento do plano."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-200",
											children: "3. Trava de Acesso ao App (D+3)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] border-amber-500/40 text-amber-300",
											children: "Automático"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Suspensão suave das planilhas de treino até regularização."
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "w-full text-xs font-bold border-slate-700 hover:border-amber-500/50 hover:bg-amber-500/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/diagnostics",
									children: ["Ver Diagnósticos Completos ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3.5 h-3.5 ml-1.5" })]
								})
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6 border-slate-800 bg-card/70 backdrop-blur-md space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 border-b border-slate-800 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-5 h-5 text-purple-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-extrabold text-base text-white",
							children: "Módulos VIP de Alta Margem"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Novos serviços para adicionar à sua carteira"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-purple-200 block",
										children: "💎 Consultoria Híbrida Premium"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-slate-300",
										children: "1 aula presencial semanal + planilhas diárias no app Montanha Hybrid + suporte via WhatsApp."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-purple-300 block pt-1 font-mono",
										children: "Sugestão: R$ 600 - R$ 900/mês"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-cyan-200 block",
										children: "⚡ Avaliação Física & Bioimpedância"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-slate-300",
										children: "Relatório impresso em PDF gerado pelo Montanha PDF Studio a cada 60 dias."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-cyan-300 block pt-1 font-mono",
										children: "Sugestão: R$ 150 avulso"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-emerald-200 block",
										children: "🚀 Desafio 30 Dias para Grupos"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-slate-300",
										children: "Turma fechada de 10 a 20 alunos com ranking semanal de assiduidade e premiação."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-emerald-300 block pt-1 font-mono",
										children: "Sugestão: R$ 197 por participante"
									})
								]
							})
						]
					})]
				})
			]
		})]
	});
}
var $$splitComponentImporter$17 = () => import("./route-BpzzMoY9.mjs");
var Route$26 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		try {
			const { data, error } = await supabase.auth.getSession();
			if (error || !data.session?.user) throw redirect({ to: "/auth" });
			return { user: data.session.user };
		} catch (err) {
			if (isRedirect(err)) throw err;
			throw redirect({ to: "/auth" });
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("../_authenticated-D6rCaGvM.mjs");
var Route$25 = createFileRoute("/_authenticated/")({
	head: () => ({ meta: [{ title: "Dashboard — EduFinance" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var Route$24 = createFileRoute("/_authenticated/trash")({ beforeLoad: () => {
	throw redirect({
		to: "/settings",
		search: { tab: "lixeira" }
	});
} });
var $$splitComponentImporter$15 = () => import("./storage-DB8ifl2n.mjs");
var Route$23 = createFileRoute("/_authenticated/storage")({
	head: () => ({ meta: [{ title: "Armazenamento — EduFinance" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./programs-BmPKiqbf.mjs");
var Route$22 = createFileRoute("/_authenticated/programs")({
	head: () => ({ meta: [{ title: "Programas — Studio" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./plans-17DuaxKt.mjs");
var Route$21 = createFileRoute("/_authenticated/plans")({
	head: () => ({ meta: [{ title: "Planos — EduFinance" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./payments-BCOE_bLA.mjs");
var Route$20 = createFileRoute("/_authenticated/payments")({
	head: () => ({ meta: [{ title: "Pagamentos — EduFinance" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var Route$19 = createFileRoute("/_authenticated/import-export")({ beforeLoad: () => {
	throw redirect({
		to: "/settings",
		search: { tab: "dados" }
	});
} });
var $$splitComponentImporter$11 = () => import("./diagnostics-HcauE54p.mjs");
var Route$18 = createFileRoute("/_authenticated/diagnostics")({
	head: () => ({ meta: [{ title: "Diagnóstico & Segurança — EduFinance" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./crm-KaDKb_Wu.mjs");
var Route$17 = createFileRoute("/_authenticated/crm")({
	head: () => ({ meta: [{ title: "CRM — EduFinance" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var Route$16 = createFileRoute("/_authenticated/analytics")({ beforeLoad: () => {
	throw redirect({
		to: "/financeiro",
		search: { tab: "studio" }
	});
} });
var $$splitComponentImporter$9 = () => import("./agenda-nd20Q23x.mjs");
var Route$15 = createFileRoute("/_authenticated/agenda")({
	head: () => ({ meta: [{ title: "Turmas & Agenda — Studio" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var Route$14 = createFileRoute("/.well-known/oauth-protected-resource")({ server: { handlers: { ANY: createTanStackOAuthProtectedResourceMetadataHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var Route$13 = createFileRoute("/.mcp/list-tools")({ server: { handlers: { ANY: createTanStackListToolsHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var $$splitComponentImporter$8 = () => import("./students.index-9fLoR2zs.mjs");
var Route$12 = createFileRoute("/_authenticated/students/")({
	head: () => ({ meta: [{ title: "Alunos — EduFinance" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
/** Chip compacto de check-ins restantes do pacote vigente. */
var $$splitComponentImporter$7 = () => import("./portal-Cl5uQk-f.mjs");
var Route$11 = createFileRoute("/_authenticated/portal/")({
	head: () => ({ meta: [{ title: "Agendamento de check-ins — Portal do aluno" }] }),
	loader: ({ context }) => {
		const qc = context.queryClient;
		if (qc) qc.prefetchQuery({
			queryKey: ["portal-quota"],
			queryFn: () => getMyQuotaUsage(),
			staleTime: 6e4
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./personal-trainer-CrQLVeoh.mjs");
var Route$10 = createFileRoute("/_authenticated/personal-trainer/")({
	head: () => ({ meta: [{ title: "Personal Trainer — EduFinance" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "avatar-container shrink-0",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		ref,
		className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-transparent", className),
		...props
	})
}));
Avatar.displayName = Root.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = Image.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fallback, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = Fallback.displayName;
var Route$9 = createFileRoute("/_authenticated/desafios/")({ component: DesafiosPage });
var STORAGE_KEY = "eduflow_challenges_v2";
var DEFAULT_CHALLENGES = [{
	id: "ch-1",
	title: "Desafio Projeto Verão 30 Dias",
	description: "Acumule pelo menos 20 presenças/treinos nos próximos 30 dias para concorrer a prêmios e superar seus limites!",
	audience: "all",
	goalType: "checkins",
	goalTarget: 20,
	startDate: "2026-09-01",
	endDate: "2026-09-30",
	prize: "🏆 1 Mês Grátis de Mensalidade + Kit Exclusivo Studio",
	maxParticipants: 30,
	status: "active",
	createdAt: (/* @__PURE__ */ new Date()).toISOString(),
	participants: [
		{
			id: "p-1",
			name: "Carlos Silva",
			type: "studio",
			score: 18,
			checkins: 18,
			lastActivity: "Hoje"
		},
		{
			id: "p-2",
			name: "Mariana Oliveira",
			type: "pt",
			score: 16,
			checkins: 16,
			lastActivity: "Hoje"
		},
		{
			id: "p-3",
			name: "Felipe Santos",
			type: "studio",
			score: 15,
			checkins: 15,
			lastActivity: "Ontem"
		},
		{
			id: "p-4",
			name: "Ana Beatriz",
			type: "pt",
			score: 12,
			checkins: 12,
			lastActivity: "Há 2 dias"
		},
		{
			id: "p-5",
			name: "Rodrigo Costa",
			type: "lead",
			score: 9,
			checkins: 9,
			lastActivity: "Há 3 dias"
		}
	]
}, {
	id: "ch-2",
	title: "Desafio Tonelagem Kettlebell",
	description: "Exclusivo para alunos de Personal e Kettlebell Fitness. Qual aluno vai levantar a maior tonelagem acumulada este mês?",
	audience: "studio",
	goalType: "tonnage",
	goalTarget: 5e4,
	startDate: "2026-09-10",
	endDate: "2026-10-10",
	prize: "🥇 Troféu Kettlebell Master + Blusão Personalizado",
	maxParticipants: 15,
	status: "active",
	createdAt: (/* @__PURE__ */ new Date()).toISOString(),
	participants: [
		{
			id: "p-6",
			name: "Lucas Mendes",
			type: "studio",
			score: 34500,
			checkins: 10,
			lastActivity: "Hoje"
		},
		{
			id: "p-7",
			name: "Camila Fernandes",
			type: "studio",
			score: 28900,
			checkins: 8,
			lastActivity: "Ontem"
		},
		{
			id: "p-8",
			name: "Bruno Souza",
			type: "pt",
			score: 21e3,
			checkins: 6,
			lastActivity: "Há 2 dias"
		}
	]
}];
function DesafiosPage() {
	const [challenges, setChallenges] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) return JSON.parse(saved);
		} catch {}
		return DEFAULT_CHALLENGES;
	});
	const [createDialogOpen, setCreateDialogOpen] = (0, import_react.useState)(false);
	const [editDialogOpen, setEditDialogOpen] = (0, import_react.useState)(false);
	const [leaderboardDialogOpen, setLeaderboardDialogOpen] = (0, import_react.useState)(false);
	const [selectedChallenge, setSelectedChallenge] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		title: "",
		description: "",
		audience: "all",
		goalType: "checkins",
		goalTarget: 20,
		startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		endDate: new Date(Date.now() + 720 * 60 * 60 * 1e3).toISOString().split("T")[0],
		prize: "",
		maxParticipants: 30
	});
	const [newParticipantName, setNewParticipantName] = (0, import_react.useState)("");
	const [newParticipantType, setNewParticipantType] = (0, import_react.useState)("studio");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
		} catch {}
	}, [challenges]);
	const handleCreateChallenge = (e) => {
		e.preventDefault();
		if (!formData.title.trim()) {
			toast.error("O título do desafio é obrigatório!");
			return;
		}
		setChallenges([{
			id: `ch-${Date.now()}`,
			title: formData.title,
			description: formData.description,
			audience: formData.audience,
			goalType: formData.goalType,
			goalTarget: Number(formData.goalTarget) || 20,
			startDate: formData.startDate,
			endDate: formData.endDate,
			prize: formData.prize || "Premiação a definir",
			maxParticipants: Number(formData.maxParticipants) || 0,
			status: "active",
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			participants: []
		}, ...challenges]);
		setCreateDialogOpen(false);
		resetForm();
		toast.success("Grupo de Desafio criado com sucesso! 🎉");
	};
	const handleEditChallenge = (e) => {
		e.preventDefault();
		if (!selectedChallenge || !formData.title.trim()) return;
		setChallenges(challenges.map((ch) => ch.id === selectedChallenge.id ? {
			...ch,
			title: formData.title,
			description: formData.description,
			audience: formData.audience,
			goalType: formData.goalType,
			goalTarget: Number(formData.goalTarget) || 20,
			startDate: formData.startDate,
			endDate: formData.endDate,
			prize: formData.prize,
			maxParticipants: Number(formData.maxParticipants) || 0
		} : ch));
		setEditDialogOpen(false);
		setSelectedChallenge(null);
		toast.success("Desafio atualizado com sucesso!");
	};
	const handleDeleteChallenge = (id) => {
		if (confirm("Tem certeza que deseja excluir este desafio?")) {
			setChallenges(challenges.filter((ch) => ch.id !== id));
			toast.success("Desafio removido.");
		}
	};
	const handleAddParticipant = (e) => {
		e.preventDefault();
		if (!selectedChallenge || !newParticipantName.trim()) return;
		const newP = {
			id: `p-${Date.now()}`,
			name: newParticipantName.trim(),
			type: newParticipantType,
			score: 0,
			checkins: 0,
			lastActivity: "Recém adicionado"
		};
		setChallenges(challenges.map((ch) => ch.id === selectedChallenge.id ? {
			...ch,
			participants: [newP, ...ch.participants]
		} : ch));
		setSelectedChallenge((prev) => prev ? {
			...prev,
			participants: [newP, ...prev.participants]
		} : null);
		setNewParticipantName("");
		toast.success(`${newP.name} adicionado ao desafio!`);
	};
	const handleIncrementScore = (participantId, delta) => {
		if (!selectedChallenge) return;
		const updatedParticipants = selectedChallenge.participants.map((p) => p.id === participantId ? {
			...p,
			score: Math.max(0, p.score + delta),
			checkins: Math.max(0, p.checkins + (delta > 0 ? 1 : -1)),
			lastActivity: "Agora mesmo"
		} : p);
		setChallenges(challenges.map((ch) => ch.id === selectedChallenge.id ? {
			...ch,
			participants: updatedParticipants
		} : ch));
		setSelectedChallenge((prev) => prev ? {
			...prev,
			participants: updatedParticipants
		} : null);
	};
	const handleShareWhatsApp = (challenge) => {
		const text = `🔥 *${challenge.title}*\n\n${challenge.description}\n\n🏆 *Prêmio:* ${challenge.prize}\n📅 *Período:* ${new Date(challenge.startDate).toLocaleDateString("pt-BR")} até ${new Date(challenge.endDate).toLocaleDateString("pt-BR")}\n\nGaranta sua vaga e participe no nosso app!`;
		const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
		window.open(url, "_blank");
	};
	const openEditModal = (ch) => {
		setSelectedChallenge(ch);
		setFormData({
			title: ch.title,
			description: ch.description,
			audience: ch.audience,
			goalType: ch.goalType,
			goalTarget: ch.goalTarget,
			startDate: ch.startDate,
			endDate: ch.endDate,
			prize: ch.prize,
			maxParticipants: ch.maxParticipants || 30
		});
		setEditDialogOpen(true);
	};
	const openLeaderboardModal = (ch) => {
		setSelectedChallenge(ch);
		setLeaderboardDialogOpen(true);
	};
	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			audience: "all",
			goalType: "checkins",
			goalTarget: 20,
			startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			endDate: new Date(Date.now() + 720 * 60 * 60 * 1e3).toISOString().split("T")[0],
			prize: "",
			maxParticipants: 30
		});
	};
	const activeChallenges = challenges.filter((c) => c.status === "active");
	const totalParticipants = challenges.reduce((acc, curr) => acc + curr.participants.length, 0);
	const filterChallenges = (statusFilter) => {
		return challenges.filter((ch) => {
			const matchesStatus = !statusFilter || statusFilter === "all" || ch.status === statusFilter;
			const matchesSearch = ch.title.toLowerCase().includes(searchQuery.toLowerCase()) || ch.description.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesStatus && matchesSearch;
		});
	};
	const getAudienceLabel = (aud) => {
		switch (aud) {
			case "all": return "Híbrido (Studio & PT)";
			case "studio": return "Alunos Studio";
			case "pt": return "Alunos Personal";
			case "leads": return "Público & Novos Alunos";
		}
	};
	const getGoalTypeLabel = (gt) => {
		switch (gt) {
			case "checkins": return "Presenças / Check-ins";
			case "workouts": return "Treinos Concluídos";
			case "tonnage": return "Tonelagem Total (kg)";
			case "points": return "Pontuação Acumulada";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				icon: Trophy,
				eyebrow: "Gestão & Engajamento",
				title: "Grupos de Desafio",
				description: "Crie e gerencie grupos de desafio interativos para motivar seus alunos do Studio e Personal Trainer.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						resetForm();
						setCreateDialogOpen(true);
					},
					className: "bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Criar novo desafio"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border/60 bg-card/60 backdrop-blur-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
								children: "Desafios Ativos"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 text-orange-500" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold",
							children: activeChallenges.length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Em andamento neste mês"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border/60 bg-card/60 backdrop-blur-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
								children: "Alunos Participantes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-primary" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold",
							children: totalParticipants
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Engajados em desafios"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border/60 bg-card/60 backdrop-blur-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
								children: "Premiações Ativas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-amber-500" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold",
							children: challenges.filter((c) => c.prize).length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Prêmios em disputa"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border/60 bg-card/60 backdrop-blur-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
								children: "Taxa de Conclusão"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-emerald-500" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold",
							children: "84%"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Média de presenças nos desafios"
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "active",
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "bg-muted/60 p-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "active",
									className: "text-xs font-semibold",
									children: [
										"Ativos (",
										activeChallenges.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "all",
									className: "text-xs font-semibold",
									children: [
										"Todos (",
										challenges.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "completed",
									className: "text-xs font-semibold",
									children: [
										"Concluídos (",
										challenges.filter((c) => c.status === "completed").length,
										")"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full sm:w-64",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Buscar desafio...",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								className: "pl-9 text-xs"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "active",
						className: "space-y-4",
						children: filterChallenges("active").length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-8 text-center border-dashed",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "mx-auto h-12 w-12 text-muted-foreground/40 mb-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-semibold",
									children: "Nenhum desafio ativo no momento"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-4",
									children: "Crie um novo desafio para engajar seus alunos do Studio e Personal Trainer com metas, troféus e rankings."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setCreateDialogOpen(true),
									size: "sm",
									className: "bg-primary hover:bg-primary/90",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), " Criar Novo Desafio"]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-6 md:grid-cols-2",
							children: filterChallenges("active").map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChallengeCard, {
								challenge: ch,
								onOpenLeaderboard: () => openLeaderboardModal(ch),
								onOpenEdit: () => openEditModal(ch),
								onDelete: () => handleDeleteChallenge(ch.id),
								onShare: () => handleShareWhatsApp(ch),
								getAudienceLabel,
								getGoalTypeLabel
							}, ch.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "all",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-6 md:grid-cols-2",
							children: filterChallenges("all").map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChallengeCard, {
								challenge: ch,
								onOpenLeaderboard: () => openLeaderboardModal(ch),
								onOpenEdit: () => openEditModal(ch),
								onDelete: () => handleDeleteChallenge(ch.id),
								onShare: () => handleShareWhatsApp(ch),
								getAudienceLabel,
								getGoalTypeLabel
							}, ch.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "completed",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-6 md:grid-cols-2",
							children: filterChallenges("completed").map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChallengeCard, {
								challenge: ch,
								onOpenLeaderboard: () => openLeaderboardModal(ch),
								onOpenEdit: () => openEditModal(ch),
								onDelete: () => handleDeleteChallenge(ch.id),
								onShare: () => handleShareWhatsApp(ch),
								getAudienceLabel,
								getGoalTypeLabel
							}, ch.id))
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: createDialogOpen,
				onOpenChange: setCreateDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-xl max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-5 w-5 text-amber-500" }), " Criar Novo Grupo de Desafio"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Defina os parâmetros do desafio. Alunos poderão acompanhar suas colocações em tempo real." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateChallenge,
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "title",
									children: "Título do Desafio *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "title",
									placeholder: "Ex: Desafio Projeto Verão 30 Dias",
									value: formData.title,
									onChange: (e) => setFormData({
										...formData,
										title: e.target.value
									}),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "description",
									children: "Descrição & Regras do Desafio"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "description",
									rows: 3,
									placeholder: "Descreva as regras, como acumular pontos e as orientações para os alunos...",
									value: formData.description,
									onChange: (e) => setFormData({
										...formData,
										description: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Público Alvo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: formData.audience,
										onValueChange: (val) => setFormData({
											...formData,
											audience: val
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione..." }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "Híbrido (Studio & Personal)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "studio",
												children: "Alunos do Studio"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "pt",
												children: "Alunos de Personal"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "leads",
												children: "Aberto ao Público (Novos Leads)"
											})
										] })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tipo de Meta" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: formData.goalType,
										onValueChange: (val) => setFormData({
											...formData,
											goalType: val
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione..." }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "checkins",
												children: "Total de Check-ins / Presenças"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "workouts",
												children: "Treinos Concluídos"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "tonnage",
												children: "Tonelagem Total Acumulada (kg)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "points",
												children: "Pontuação por Desempenho"
											})
										] })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "goalTarget",
											children: "Meta Alvo"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "goalTarget",
											type: "number",
											placeholder: "20",
											value: formData.goalTarget,
											onChange: (e) => setFormData({
												...formData,
												goalTarget: Number(e.target.value)
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "startDate",
											children: "Data de Início"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "startDate",
											type: "date",
											value: formData.startDate,
											onChange: (e) => setFormData({
												...formData,
												startDate: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "endDate",
											children: "Data de Término"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "endDate",
											type: "date",
											value: formData.endDate,
											onChange: (e) => setFormData({
												...formData,
												endDate: e.target.value
											})
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "prize",
									children: "Premiação / Recompensa"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "prize",
									placeholder: "Ex: 🏆 1 Mês Grátis de Mensalidade + Camiseta",
									value: formData.prize,
									onChange: (e) => setFormData({
										...formData,
										prize: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "maxParticipants",
									children: "Limite Máximo de Vagas"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "maxParticipants",
									type: "number",
									placeholder: "30 (ou 0 para sem limite)",
									value: formData.maxParticipants,
									onChange: (e) => setFormData({
										...formData,
										maxParticipants: Number(e.target.value)
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setCreateDialogOpen(false),
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "bg-primary hover:bg-primary/90 font-semibold",
									children: "Criar Desafio"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: editDialogOpen,
				onOpenChange: setEditDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-xl max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Editar Desafio" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleEditChallenge,
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-title",
									children: "Título do Desafio"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "edit-title",
									value: formData.title,
									onChange: (e) => setFormData({
										...formData,
										title: e.target.value
									}),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-desc",
									children: "Descrição & Regras"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "edit-desc",
									rows: 3,
									value: formData.description,
									onChange: (e) => setFormData({
										...formData,
										description: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Público Alvo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: formData.audience,
										onValueChange: (val) => setFormData({
											...formData,
											audience: val
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "Híbrido (Studio & Personal)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "studio",
												children: "Alunos do Studio"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "pt",
												children: "Alunos de Personal"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "leads",
												children: "Aberto ao Público (Novos Leads)"
											})
										] })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Premiação" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formData.prize,
										onChange: (e) => setFormData({
											...formData,
											prize: e.target.value
										})
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setEditDialogOpen(false),
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "bg-primary hover:bg-primary/90 font-semibold",
									children: "Salvar Alterações"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: leaderboardDialogOpen,
				onOpenChange: setLeaderboardDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "sm:max-w-2xl max-h-[90vh] overflow-y-auto",
					children: selectedChallenge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "text-amber-500 border-amber-500/30 bg-amber-500/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "mr-1 h-3.5 w-3.5" }), " Ranking do Desafio"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => handleShareWhatsApp(selectedChallenge),
								className: "gap-1.5 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-3.5 w-3.5" }), " Convidar via WhatsApp"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-xl mt-2",
							children: selectedChallenge.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: selectedChallenge.description
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleAddParticipant,
							className: "p-3 bg-muted/40 rounded-xl border border-border/50 flex flex-col sm:flex-row gap-2 items-end",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 space-y-1 w-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Increver Novo Aluno"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Nome do aluno...",
										value: newParticipantName,
										onChange: (e) => setNewParticipantName(e.target.value),
										className: "text-xs h-9"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-full sm:w-36 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Tipo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: newParticipantType,
										onValueChange: (v) => setNewParticipantType(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "text-xs h-9",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "studio",
												children: "Studio"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "pt",
												children: "Personal"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "lead",
												children: "Novo Lead"
											})
										] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									size: "sm",
									className: "h-9 gap-1 font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3.5 w-3.5" }), " Adicionar"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medal, { className: "h-4 w-4 text-amber-500" }),
									" Tabela de Classificação (",
									selectedChallenge.participants.length,
									")"
								]
							}), selectedChallenge.participants.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-center p-6 bg-muted/20 rounded-lg text-xs text-muted-foreground",
								children: "Nenhum aluno inscrito ainda neste desafio. Adicione acima para iniciar o ranking!"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: selectedChallenge.participants.sort((a, b) => b.score - a.score).map((p, index) => {
									const medalColor = index === 0 ? "text-amber-500 bg-amber-500/10 border-amber-500/30" : index === 1 ? "text-slate-400 bg-slate-400/10 border-slate-400/30" : index === 2 ? "text-amber-700 bg-amber-700/10 border-amber-700/30" : "text-muted-foreground bg-muted border-border/50";
									const pct = Math.min(100, Math.round(p.score / (selectedChallenge.goalTarget || 1) * 100));
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card hover:bg-accent/40 transition-colors gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 min-w-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: `grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-bold ${medalColor}`,
													children: index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
													className: "h-8 w-8 shrink-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
														className: "text-xs font-bold bg-primary/10 text-primary",
														children: p.name.substring(0, 2).toUpperCase()
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "truncate text-xs font-bold flex items-center gap-1.5",
														children: [p.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															className: "text-[9px] px-1.5 py-0",
															children: p.type === "studio" ? "Studio" : p.type === "pt" ? "Personal" : "Lead"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 mt-1 w-36 sm:w-48",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
															value: pct,
															className: "h-1.5"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[10px] text-muted-foreground shrink-0",
															children: [pct, "%"]
														})]
													})]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-xs font-bold",
													children: [
														p.score,
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] font-normal text-muted-foreground",
															children: "pts"
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[10px] text-muted-foreground",
													children: [p.checkins, " presenças"]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "outline",
													className: "h-7 w-7 text-xs",
													onClick: () => handleIncrementScore(p.id, 1),
													title: "Adicionar ponto/presença",
													children: "+1"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													className: "h-7 w-7 text-xs text-muted-foreground hover:text-destructive",
													onClick: () => handleIncrementScore(p.id, -1),
													title: "Remover ponto",
													children: "-1"
												})]
											})]
										})]
									}, p.id);
								})
							})]
						})]
					})] })
				})
			})
		]
	});
}
function ChallengeCard({ challenge, onOpenLeaderboard, onOpenEdit, onDelete, onShare, getAudienceLabel, getGoalTypeLabel }) {
	challenge.status;
	const daysLeft = Math.max(0, Math.ceil((new Date(challenge.endDate).getTime() - (/* @__PURE__ */ new Date()).getTime()) / (1e3 * 60 * 60 * 24)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "relative overflow-hidden border-border/70 shadow-sm hover:shadow-md transition-shadow",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-primary to-orange-500" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "text-[10px] font-bold",
								children: getAudienceLabel(challenge.audience)
							}), daysLeft > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "text-[10px] text-amber-600 border-amber-500/30 bg-amber-500/10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mr-1 h-3 w-3" }),
									" Faltam ",
									daysLeft,
									" dias"
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[10px] text-muted-foreground",
								children: "Encerrado"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base font-bold leading-tight",
							children: challenge.title
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "h-8 w-8 text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: onOpenEdit,
								className: "gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3.5 w-3.5" }), " Editar Desafio"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: onShare,
								className: "gap-2 text-xs text-emerald-600",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-3.5 w-3.5" }), " Compartilhar Convite"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: onDelete,
								className: "gap-2 text-xs text-destructive",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Excluir Desafio"]
							})
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
					className: "text-xs line-clamp-2 mt-1",
					children: challenge.description
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4 text-xs pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 p-2.5 rounded-lg bg-muted/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-muted-foreground uppercase font-bold block",
						children: "Meta / Tipo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold text-foreground truncate block",
						children: [
							challenge.goalTarget,
							" ",
							getGoalTypeLabel(challenge.goalType)
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-muted-foreground uppercase font-bold block",
						children: "Participantes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold text-foreground flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3 text-primary" }),
							" ",
							challenge.participants.length,
							" ",
							challenge.maxParticipants ? `/ ${challenge.maxParticipants}` : ""
						]
					})] })]
				}), challenge.prize && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 p-2 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4 text-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-xs truncate",
						children: challenge.prize
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border/50 p-3 bg-muted/20 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: onShare,
					className: "gap-1.5 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-3.5 w-3.5" }), " Convidar"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: onOpenLeaderboard,
					className: "gap-1.5 text-xs bg-primary hover:bg-primary/90 font-bold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-3.5 w-3.5" }),
						" Ver Ranking (",
						challenge.participants.length,
						")"
					]
				})]
			})
		]
	});
}
var $$splitComponentImporter$5 = () => import("./perfil-BIeHfyz4.mjs");
var Route$8 = createFileRoute("/_authenticated/portal/perfil")({
	head: () => ({ meta: [{ title: "Meus dados" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./plans-X6Od9NJk.mjs");
var Route$7 = createFileRoute("/_authenticated/personal-trainer/plans")({
	head: () => ({ meta: [{ title: "Planos PT — EduFinance" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var Route$6 = createFileRoute("/_authenticated/personal-trainer/importar-treino")({ beforeLoad: () => {
	throw redirect({
		to: "/personal-trainer/biblioteca",
		search: { tab: "importar" }
	});
} });
var $$splitComponentImporter$3 = () => import("./checkin-ksUjmTu5.mjs");
var Route$5 = createFileRoute("/_authenticated/personal-trainer/checkin")({
	head: () => ({ meta: [{ title: "Check-in Rápido PT — EduFinance" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var Route$4 = createFileRoute("/_authenticated/personal-trainer/analytics")({ beforeLoad: () => {
	throw redirect({
		to: "/financeiro",
		search: { tab: "pt" }
	});
} });
var $$splitComponentImporter$2 = () => import("./tenants-D_i4ebqh.mjs");
var Route$3 = createFileRoute("/_authenticated/admin/tenants")({
	head: () => ({ meta: [{ title: "Treinadores — Admin" }] }),
	beforeLoad: async () => {
		const { data: userRes } = await supabase.auth.getUser();
		if (!userRes.user) throw redirect({ to: "/auth" });
		const { data: isSuper } = await supabase.rpc("is_super_admin", { _user_id: userRes.user.id });
		if (!isSuper) throw redirect({ to: "/" });
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var Route$2 = createFileRoute("/.mcp/invoke-tool/$tool")({ server: { handlers: { ANY: createTanStackInvokeToolHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var $$splitComponentImporter$1 = () => import("./pt-gRTShjKU.mjs");
var Route$1 = createFileRoute("/_authenticated/portal/pt/")({
	head: () => ({ meta: [{ title: "Minhas informações — Personal Trainer" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./treino-8uRNXAnM.mjs");
var Route = createFileRoute("/_authenticated/portal/pt/treino")({
	head: () => ({ meta: [{ title: "Meu treino — Personal Trainer" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var ResetPasswordRoute = Route$32.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$33
});
var McpRoute = Route$31.update({
	id: "/mcp",
	path: "/mcp",
	getParentRoute: () => Route$33
});
var MasterAdminRoute = Route$30.update({
	id: "/master-admin",
	path: "/master-admin",
	getParentRoute: () => Route$33
});
var EcoRoute = Route$29.update({
	id: "/eco",
	path: "/eco",
	getParentRoute: () => Route$33
});
var CreateRoute = Route$28.update({
	id: "/create",
	path: "/create",
	getParentRoute: () => Route$33
});
var BoostRoute = Route$27.update({
	id: "/boost",
	path: "/boost",
	getParentRoute: () => Route$33
});
var AuthRoute = Route$35.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$33
});
var AuthenticatedRouteRoute = Route$26.update({
	id: "/_authenticated",
	getParentRoute: () => Route$33
});
var AuthenticatedIndexRoute = Route$25.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedTrashRoute = Route$24.update({
	id: "/trash",
	path: "/trash",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedStorageRoute = Route$23.update({
	id: "/storage",
	path: "/storage",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSettingsRoute = Route$38.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedProgramsRoute = Route$22.update({
	id: "/programs",
	path: "/programs",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPlansRoute = Route$21.update({
	id: "/plans",
	path: "/plans",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPaymentsRoute = Route$20.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedImportExportRoute = Route$19.update({
	id: "/import-export",
	path: "/import-export",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedFinanceiroRoute = Route$37.update({
	id: "/financeiro",
	path: "/financeiro",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDiagnosticsRoute = Route$18.update({
	id: "/diagnostics",
	path: "/diagnostics",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCrmRoute = Route$17.update({
	id: "/crm",
	path: "/crm",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAnalyticsRoute = Route$16.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAgendaRoute = Route$15.update({
	id: "/agenda",
	path: "/agenda",
	getParentRoute: () => AuthenticatedRouteRoute
});
var Char91DotwellKnownChar93OauthProtectedResourceRoute = Route$14.update({
	id: "/.well-known/oauth-protected-resource",
	path: "/.well-known/oauth-protected-resource",
	getParentRoute: () => Route$33
});
var Char91DotmcpChar93ListToolsRoute = Route$13.update({
	id: "/.mcp/list-tools",
	path: "/.mcp/list-tools",
	getParentRoute: () => Route$33
});
var AuthenticatedStudentsIndexRoute = Route$12.update({
	id: "/students/",
	path: "/students/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalIndexRoute = Route$11.update({
	id: "/portal/",
	path: "/portal/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPersonalTrainerIndexRoute = Route$10.update({
	id: "/personal-trainer/",
	path: "/personal-trainer/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDesafiosIndexRoute = Route$9.update({
	id: "/desafios/",
	path: "/desafios/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedStudentsIdRoute = Route$39.update({
	id: "/students/$id",
	path: "/students/$id",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalPerfilRoute = Route$8.update({
	id: "/portal/perfil",
	path: "/portal/perfil",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPersonalTrainerPlansRoute = Route$7.update({
	id: "/personal-trainer/plans",
	path: "/personal-trainer/plans",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPersonalTrainerImportarTreinoRoute = Route$6.update({
	id: "/personal-trainer/importar-treino",
	path: "/personal-trainer/importar-treino",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPersonalTrainerCheckinRoute = Route$5.update({
	id: "/personal-trainer/checkin",
	path: "/personal-trainer/checkin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPersonalTrainerBibliotecaRoute = Route$36.update({
	id: "/personal-trainer/biblioteca",
	path: "/personal-trainer/biblioteca",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPersonalTrainerAnalyticsRoute = Route$4.update({
	id: "/personal-trainer/analytics",
	path: "/personal-trainer/analytics",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminTenantsRoute = Route$3.update({
	id: "/admin/tenants",
	path: "/admin/tenants",
	getParentRoute: () => AuthenticatedRouteRoute
});
var Char91DotmcpChar93InvokeToolToolRoute = Route$2.update({
	id: "/.mcp/invoke-tool/$tool",
	path: "/.mcp/invoke-tool/$tool",
	getParentRoute: () => Route$33
});
var DotlovableOauthConsentRoute = Route$34.update({
	id: "/.lovable/oauth/consent",
	path: "/.lovable/oauth/consent",
	getParentRoute: () => Route$33
});
var AuthenticatedPortalPtIndexRoute = Route$1.update({
	id: "/portal/pt/",
	path: "/portal/pt/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalPtTreinoRoute = Route.update({
	id: "/portal/pt/treino",
	path: "/portal/pt/treino",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAgendaRoute,
	AuthenticatedAnalyticsRoute,
	AuthenticatedCrmRoute,
	AuthenticatedDiagnosticsRoute,
	AuthenticatedFinanceiroRoute,
	AuthenticatedImportExportRoute,
	AuthenticatedPaymentsRoute,
	AuthenticatedPlansRoute,
	AuthenticatedProgramsRoute,
	AuthenticatedSettingsRoute,
	AuthenticatedStorageRoute,
	AuthenticatedTrashRoute,
	AuthenticatedIndexRoute,
	AuthenticatedAdminTenantsRoute,
	AuthenticatedPersonalTrainerAnalyticsRoute,
	AuthenticatedPersonalTrainerBibliotecaRoute,
	AuthenticatedPersonalTrainerCheckinRoute,
	AuthenticatedPersonalTrainerImportarTreinoRoute,
	AuthenticatedPersonalTrainerPlansRoute,
	AuthenticatedPortalPerfilRoute,
	AuthenticatedStudentsIdRoute,
	AuthenticatedDesafiosIndexRoute,
	AuthenticatedPersonalTrainerIndexRoute,
	AuthenticatedPortalIndexRoute,
	AuthenticatedStudentsIndexRoute,
	AuthenticatedPersonalTrainerStudentsIdRoute: Route$40.update({
		id: "/personal-trainer/students/$id",
		path: "/personal-trainer/students/$id",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedPortalPtTreinoRoute,
	AuthenticatedPortalPtIndexRoute
};
var rootRouteChildren = {
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	BoostRoute,
	CreateRoute,
	EcoRoute,
	MasterAdminRoute,
	McpRoute,
	ResetPasswordRoute,
	Char91DotmcpChar93ListToolsRoute,
	Char91DotwellKnownChar93OauthProtectedResourceRoute,
	DotlovableOauthConsentRoute,
	Char91DotmcpChar93InvokeToolToolRoute
};
var routeTree = Route$33._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient({ defaultOptions: { queries: {
			staleTime: 3e4,
			gcTime: 5 * 6e4,
			refetchOnWindowFocus: false,
			retry: 1
		} } }) },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
