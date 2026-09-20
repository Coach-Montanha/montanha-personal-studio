import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfirmDialogHost } from "@/lib/confirm-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useApplyFontSize } from "@/hooks/use-font-size";
import { ThemeProvider } from "@/hooks/use-theme";
import { PwaInstallBanner } from "@/components/pwa/PwaInstallBanner";
import { setImpersonate } from "@/hooks/use-impersonate";



export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Montanha Personal Studio — Gestão Financeira & Inteligência Operacional para Studios e Personais" },
      {
        name: "description",
        content:
          "Gestão Financeira & Inteligência Operacional para Studios e Personais.",
      },
      { property: "og:title", content: "Montanha Personal Studio — Gestão Financeira & Inteligência Operacional para Studios e Personais" },
      { property: "og:description", content: "Gestão Financeira & Inteligência Operacional para Studios e Personais." },
      { name: "twitter:title", content: "Montanha Personal Studio — Gestão Financeira & Inteligência Operacional para Studios e Personais" },
      { name: "twitter:description", content: "Gestão Financeira & Inteligência Operacional para Studios e Personais." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a1e6323a-33d0-41ff-b98a-0744e285697c/id-preview-899e1b68--69e8a911-c73d-4b50-a7e4-fcc5a1be4536.lovable.app-1782521708855.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a1e6323a-33d0-41ff-b98a-0744e285697c/id-preview-899e1b68--69e8a911-c73d-4b50-a7e4-fcc5a1be4536.lovable.app-1782521708855.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#F8F9FE", media: "(prefers-color-scheme: light)" },
      { name: "theme-color", content: "#050a14", media: "(prefers-color-scheme: dark)" },

      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Montanha Personal Studio" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
      { rel: "shortcut icon", href: "/icon-192.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        fetchpriority: "high",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.cdnfonts.com/css/creato-display",
      },
    ],

    scripts: [
      {
        children: `try{var t=localStorage.getItem('edufinance.theme');var vt=localStorage.getItem('edufinance.visualTheme');if(!vt||!['padrao','pulse','midnight'].includes(vt)){vt='midnight';try{localStorage.setItem('edufinance.visualTheme','midnight')}catch(e){}}var isDark=t==='dark'||(!t&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(isDark){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}document.documentElement.setAttribute('data-tema',vt);var _w=typeof window!=='undefined'?window.innerWidth:1024;var _fs=localStorage.getItem('edufinance.fontSize');var _map=_w<640?{sm:14,md:15,lg:16,xl:17}:{sm:15,md:17,lg:19,xl:22};var _def=_w<640?'15px':'17px';if(_fs&&_map[_fs]){document.documentElement.style.fontSize=_map[_fs]+'px'}else{document.documentElement.style.fontSize=_def}}catch(e){}`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">Página não encontrada</p>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => {
    if (typeof window !== "undefined") {
       
      console.error("Root errorComponent:", error);
    }
    const recover = async () => {
      try {
        // Limpa modo suporte / impersonação
        localStorage.removeItem("edufinance.impersonate");
        // Limpa escopo de tenant (evita ficar preso vendo dados de outro)
        localStorage.removeItem("edufinance.tenantScope");
        localStorage.removeItem("edufinance.profileMode");
        // Encerra a sessão do Supabase (limpa todas as chaves sb-*-auth-token)
        Object.keys(localStorage)
          .filter((k) => k.startsWith("sb-") && k.endsWith("-auth-token"))
          .forEach((k) => localStorage.removeItem(k));
        try {
          await supabase.auth.signOut();
        } catch {
          /* ignore */
        }
      } finally {
        window.location.replace("/auth");
      }
    };
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">Algo deu errado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tente novamente em alguns instantes. Se você entrou como outro treinador
            e ficou preso nesta tela, use o botão abaixo para sair e voltar ao login.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              Tentar novamente
            </button>
            <button
              onClick={recover}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Sair e voltar ao login
            </button>
          </div>
        </div>
      </div>
    );
  },

});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" data-tema="midnight">
      <head>
        <HeadContent />
        <style
          dangerouslySetInnerHTML={{
            __html: `
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
            `,
          }}
        />
      </head>
      <body>
        <div id="app-preloader" aria-label="Carregando Montanha Personal Studio...">
          <div className="preloader-emblem-wrap">
            <div className="preloader-aura-ring"></div>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="preloader-title">Montanha <span>Personal Studio</span></div>
          <div className="preloader-subtitle">Gestão Financeira & Inteligência Operacional para Studios e Personais</div>
          <div className="preloader-spinner"></div>
          <div className="preloader-progress-track">
            <div className="preloader-progress-bar"></div>
          </div>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
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
            })();`,
          }}
        />

        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useApplyFontSize();

  // Kill-switch: /qualquer-rota?reset=1 limpa impersonação/tenant/sessão e volta ao login.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const impersonateParam = params.get("impersonate");
    if (impersonateParam && impersonateParam.trim()) {
      const email = impersonateParam.trim().toLowerCase();
      setImpersonate({
        targetEmail: email,
        targetUserId: `support_${email}`,
        superAdminEmail: "admin@montanha.app",
        startedAt: Date.now(),
      });
    }

    if (params.get("reset") !== "1") return;
    (async () => {
      try {
        localStorage.removeItem("edufinance.impersonate");
        localStorage.removeItem("edufinance.tenantScope");
        localStorage.removeItem("edufinance.profileMode");
        Object.keys(localStorage)
          .filter((k) => k.startsWith("sb-") && k.endsWith("-auth-token"))
          .forEach((k) => localStorage.removeItem(k));
        try { await supabase.auth.signOut(); } catch { /* ignore */ }
      } finally {
        window.location.replace("/auth");
      }
    })();
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        router.invalidate();
        if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  // Registra o Service Worker em produção de forma 100% silenciosa e automática
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    // URL fixa para o Service Worker (sem query params dinâmicos para evitar loop de recarregamento).
    // updateViaCache: "none" força o navegador a verificar o /sw.js no servidor ignorando cache HTTP.
    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then((reg) => {
        // Checagem periódica silenciosa em segundo plano a cada 15 minutos
        const intervalId = setInterval(() => {
          reg.update().catch(() => {});
        }, 15 * 60 * 1000);
        return () => clearInterval(intervalId);
      })
      .catch((err) => {
        console.warn("Falha ao registrar Service Worker:", err);
      });

    // Limpeza preventiva de caches antigos de versões anteriores no dispositivo do aluno
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name === "coach-montanha-pwa-v1" || name === "coach-montanha-pwa-v2") {
            caches.delete(name);
          }
        });
      }).catch(() => {});
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Outlet />
          <Toaster richColors position="top-right" />
          <ConfirmDialogHost />
          <PwaInstallBanner />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}


