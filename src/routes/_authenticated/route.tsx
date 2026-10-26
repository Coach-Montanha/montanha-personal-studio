import { createFileRoute, Outlet, redirect, useRouterState, useNavigate, isRedirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/edufinance/AppShell";
import { PortalShell } from "@/components/portal/PortalShell";
import { useRole } from "@/hooks/use-role";
import { usePortalMode } from "@/hooks/use-portal-mode";
import { getImpersonateUser } from "@/lib/impersonate-helper";
import { TrainingTimerDialog } from "@/components/pt/TrainingTimerDialog";
import { useTrainingTimer } from "@/hooks/use-training-timer";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    try {
      const impersonated = getImpersonateUser();
      if (impersonated) {
        return { user: impersonated as any };
      }

      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user) throw redirect({ to: "/auth" });
      return { user: data.session.user };
    } catch (err) {
      if (isRedirect(err)) throw err;
      // Storage corrompido / JSON inválido → volta ao login em vez de travar o match.
      throw redirect({ to: "/auth" });
    }
  },
  component: AuthenticatedLayout,
});


function AuthenticatedLayout() {
  const { isAdmin, isStudent, loading } = useRole();
  const { mode, loading: modeLoading } = usePortalMode();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const isPortalPath = pathname === "/portal" || pathname.startsWith("/portal/") || pathname.startsWith("/f/");
  const isPTPortalPath = pathname === "/portal/pt" || pathname.startsWith("/portal/pt/");
  const { isOpen: timerOpen, defaultMode: timerMode, setOpen: setTimerOpen } = useTrainingTimer();

  useEffect(() => {
    if (loading) return;
    if (isStudent) {
      if (!isPortalPath && !isPTPortalPath) {
        if (mode === "pt") {
          navigate({ to: "/portal/pt", replace: true });
        } else {
          navigate({ to: "/portal", replace: true });
        }
      } else if (mode === "pt" && !isPTPortalPath && !modeLoading) {
        navigate({ to: "/portal/pt", replace: true });
      } else if (mode === "studio" && isPTPortalPath && !modeLoading) {
        navigate({ to: "/portal", replace: true });
      }
    }
    if (isAdmin && isPortalPath) {
      navigate({ to: "/", replace: true });
    }
  }, [loading, modeLoading, isStudent, isAdmin, mode, isPortalPath, isPTPortalPath, navigate]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6">
        <div className="flex flex-col items-center gap-3 text-muted-foreground animate-in fade-in duration-200">
          <span
            aria-hidden
            className="h-6 w-6 rounded-full border-2 border-border border-t-primary animate-spin"
          />
          <p className="text-sm leading-relaxed">Carregando seu ambiente…</p>
        </div>
      </div>
    );
  }

  // Alunos tentando acessar rotas administrativas (como /, /students, etc.) são bloqueados imediatamente
  if (isStudent && !isPortalPath && !isPTPortalPath) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6">
        <div className="flex flex-col items-center gap-3 text-muted-foreground animate-in fade-in duration-200">
          <span
            aria-hidden
            className="h-6 w-6 rounded-full border-2 border-border border-t-primary animate-spin"
          />
          <p className="text-sm leading-relaxed">Redirecionando para a área do aluno…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isStudent || isPortalPath ? (
        <PortalShell>
          <Outlet />
        </PortalShell>
      ) : (
        <AppShell>
          <Outlet />
        </AppShell>
      )}
      <TrainingTimerDialog
        open={timerOpen}
        onOpenChange={setTimerOpen}
        defaultMode={timerMode}
      />
    </>
  );
}
