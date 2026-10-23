import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Smartphone, CheckCircle2, AlertTriangle, Volume2, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  isNativeApp,
  requestNotificationPermissions,
  triggerDeviceNotification,
  checkNotificationPermissionStatus,
  setupNativeNotificationChannel,
} from "@/lib/notifications.native";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function MobileNotificationsCard() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [status, setStatus] = useState<"granted" | "denied" | "prompt" | null>(null);
  const [testing, setTesting] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    checkNotificationPermissionStatus().then(setStatus);
  }, []);

  async function handleRequestAndTest() {
    setTesting(true);
    try {
      const granted = await requestNotificationPermissions();
      setStatus(granted ? "granted" : "denied");

      if (granted) {
        await setupNativeNotificationChannel();
        await triggerDeviceNotification({
          title: "Studio Montanha 🚀",
          body: "Avisos de turmas e check-ins configurados com sucesso neste celular!",
          url: "/agenda",
        });
        toast.success("Notificação enviada com sucesso!", {
          description: "Confira a barra de status do seu celular.",
        });
      } else {
        toast.error("Permissão não concedida.", {
          description:
            "Acesse Configurações > Aplicativos > Studio Montanha > Notificações e ative manualmente.",
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao acionar notificações");
    } finally {
      setTesting(false);
    }
  }

  async function handleClearAll() {
    if (!user?.id) return;
    setClearing(true);
    qc.setQueryData(["notifications", user.id], []);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      await fetch("/api/notifications/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ user_id: user.id }),
      }).catch(() => null);

      await supabase
        .from("pt_notifications" as any)
        .delete()
        .eq("user_id", user.id)
        .catch(() => null);

      toast.success("Todas as notificações antigas foram limpas!");
    } catch {
      toast.info("Notificações limpas.");
    } finally {
      qc.invalidateQueries({ queryKey: ["notifications", user.id] });
      setClearing(false);
    }
  }

  const isGranted = status === "granted";

  return (
    <Card className="p-5 space-y-4 border-primary/20 bg-gradient-to-br from-card to-primary/[0.02]">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Notificações e Avisos no Celular</h2>
            <p className="text-xs text-muted-foreground">
              Alertas sonoros e visuais de novos check-ins e avisos de turmas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isGranted ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Ativo no Aparelho
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <AlertTriangle className="h-3.5 w-3.5" />
              {status === "denied" ? "Bloqueado no Sistema" : "Pendente de Ativação"}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button
          onClick={handleRequestAndTest}
          disabled={testing}
          className="gap-2 font-semibold shadow-sm"
          variant={isGranted ? "outline" : "default"}
        >
          {isGranted ? <Volume2 className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
          {testing
            ? "Disparando..."
            : isGranted
              ? "Testar Alerta no Meu Celular"
              : "Ativar Notificações no Celular Agora"}
        </Button>

        <Button
          variant="ghost"
          onClick={handleClearAll}
          disabled={clearing}
          className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
          {clearing ? "Limpando..." : "Limpar Mensagens Acumuladas"}
        </Button>
      </div>

      {/* Dica para aparelhos Xiaomi / MIUI / HyperOS / Samsung */}
      <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Importante para aparelhos Xiaomi, Redmi e Poco:</span>
        </div>
        <p className="text-muted-foreground leading-relaxed pl-5">
          Para que o alerta toque com a tela desligada no HyperOS / MIUI:
          <br />
          1. Segure o dedo no ícone do aplicativo na tela inicial &gt; <strong>Informações do app</strong>.
          <br />
          2. Em <strong>Notificações</strong>, ative <em>Notificações flutuantes</em> e <em>Tela de bloqueio</em>.
          <br />
          3. Em <strong>Economia de bateria</strong>, selecione <em>Sem restrições</em>.
        </p>
      </div>
    </Card>
  );
}
