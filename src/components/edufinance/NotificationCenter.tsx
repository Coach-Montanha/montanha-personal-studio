import { useEffect, useState } from "react";
import { Bell, BellDot, Trash2, Calendar, Dumbbell, CheckCircle2, Smartphone, Check, Sparkles, Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  isNativeApp,
  requestNotificationPermissions,
  triggerDeviceNotification,
  scheduleClassReminderNotification,
  setupNativeNotificationChannel,
  checkNotificationPermissionStatus,
} from "@/lib/notifications.native";

function hashStringToInt(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 2147483647);
}

function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  } catch {
    // Silencia restrições de autoplay
  }
}

export function NotificationCenter() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [isPermitted, setIsPermitted] = useState<boolean | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    // Checagem do status inicial de notificação
    checkNotificationPermissionStatus().then((status) => {
      setIsPermitted(status === "granted");
    });

    if (isNativeApp()) {
      import("@capacitor/local-notifications").then(({ LocalNotifications }) => {
        LocalNotifications.addListener("localNotificationActionPerformed", (action) => {
          const url = (action.notification.extra as any)?.url || "/agenda";
          navigate({ to: url });
        });
      }).catch(() => {});
    } else if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, [navigate]);

  async function handleTestNotification(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    playNotificationSound();
    await triggerDeviceNotification({
      title: "Studio Montanha 🚀",
      body: "Teste de alerta recebido com sucesso no seu celular!",
      url: "/agenda",
    });
    toast.success("Notificação enviada!", {
      description: "Verifique a barra de status do seu celular.",
    });
  }

  async function handleEnablePush(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      const granted = await requestNotificationPermissions();
      setIsPermitted(granted);
      if (granted) {
        toast.success("Avisos no celular e na tela de bloqueio ativados!");
        await handleTestNotification();
      } else {
        toast.error("Permissão de notificação negada nas configurações do aparelho.", {
          description: "Abra Configurações > Apps > Studio Montanha > Notificações para ativar.",
        });
      }
    } catch (err) {
      console.warn("Erro ao pedir permissão de notificação:", err);
    }
  }

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("pt_notifications" as any)
        .select("*")
        .eq("user_id", user!.id)
        .neq("type", "custom_form_definition")
        .order("created_at", { ascending: false })
        .limit(40);
      return (data ?? []) as any[];
    },
    refetchInterval: 30000,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  // 1. Escuta Realtime para novos check-ins e avisos imediatos
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`pt_notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "pt_notifications",
          filter: `user_id=eq.${user.id}`,
        },
        async (payload: any) => {
          qc.invalidateQueries({ queryKey: ["notifications", user.id] });
          playNotificationSound();

          const notif = payload.new;
          const title = notif.title || (notif.type === "checkin" ? "🔔 Novo Check-in!" : "⏰ Studio");
          const message = notif.message || "";

          // Disparo de notificação nativa no sistema operacional (Android APK e Web)
          await triggerDeviceNotification({
            id: hashStringToInt(notif.id || (title + message)),
            title,
            body: message,
            url: "/agenda",
          });

          if (notif.type === "checkin") {
            toast.success("🔔 Novo Check-in!", {
              description: notif.message,
              duration: 8000,
              action: {
                label: "Ver Agenda",
                onClick: () => navigate({ to: "/agenda" }),
              },
            });
          } else if (notif.type === "class_reminder_20m") {
            toast.info("⏰ Aula em 20 Minutos!", {
              description: notif.message,
              duration: 10000,
              action: {
                label: "Ver Turma",
                onClick: () => navigate({ to: "/agenda" }),
              },
            });
          } else {
            toast.info(notif.title, {
              description: notif.message,
              duration: 6000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, qc, navigate]);

  // 2. Alerta preventivo automático 19 minutos e 30 segundos antes de cada aula do dia
  useEffect(() => {
    if (!user?.id) return;

    const checkUpcomingClasses = async () => {
      try {
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

        const { data: sessions, error } = await supabase
          .from("class_sessions")
          .select(`
            id,
            session_date,
            start_time,
            classes:class_id ( name ),
            class_attendance (
              id,
              students:student_id ( name )
            )
          `)
          .eq("session_date", today)
          .eq("user_id", user.id);

        if (error || !sessions) return;

        const currentDaySeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

        for (const session of sessions) {
          if (!session.start_time) continue;
          const [h, m, s = 0] = session.start_time.split(":").map(Number);
          const sessionDaySeconds = h * 3600 + m * 60 + s;
          const diffSeconds = sessionDaySeconds - currentDaySeconds;

          const timeFormatted = session.start_time.slice(0, 5);
          const className = (session.classes as any)?.name || "Turma";
          const attendees = (session.class_attendance ?? [])
            .map((a: any) => a.students?.name)
            .filter(Boolean);
          const count = attendees.length;
          const body =
            count > 0
              ? `${count} aluno(s) com check-in: ${attendees.join(", ")}.`
              : "Nenhum aluno realizou check-in até o momento.";

          const notifId = hashStringToInt(`class_19m30s_${session.id}_${today}`);

          // Pré-agendamento nativo no sistema do celular para disparar mesmo com o app fechado:
          // triggerSeconds = horário da aula - 19m 30s (1170 segundos)
          const reminderTriggerSeconds = sessionDaySeconds - 1170;
          if (reminderTriggerSeconds > currentDaySeconds) {
            const triggerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, reminderTriggerSeconds);
            const scheduledKey = `scheduled_class_19m30s_${session.id}_${today}`;
            if (!localStorage.getItem(scheduledKey)) {
              localStorage.setItem(scheduledKey, "true");
              await scheduleClassReminderNotification({
                id: notifId,
                title: `📋 Turma em 19m 30s (${timeFormatted} - ${className})`,
                body,
                triggerAt: triggerDate,
                url: "/agenda",
              });
            }
          }

          // Se o app estiver aberto exatamente na janela (<= 1170s e >= 0s)
          if (diffSeconds <= 1170 && diffSeconds >= 0) {
            const storageKey = `notified_class_19m30s_${session.id}_${today}`;
            if (!localStorage.getItem(storageKey)) {
              localStorage.setItem(storageKey, "true");

              playNotificationSound();
              await triggerDeviceNotification({
                id: notifId,
                title: `📋 Turma em 19m 30s (${timeFormatted} - ${className})`,
                body,
                url: "/agenda",
              });

              toast.info(`📋 Turma em 19m 30s (${timeFormatted} - ${className})`, {
                description: body,
                duration: 12000,
                action: {
                  label: "Ver Agenda",
                  onClick: () => navigate({ to: "/agenda" }),
                },
              });

              await supabase.from("pt_notifications" as any).insert({
                user_id: user.id,
                title: `📋 Turma em 19m 30s (${timeFormatted} - ${className})`,
                message: body,
                type: "class_reminder_19m30s",
                metadata: {
                  session_id: session.id,
                  start_time: session.start_time,
                  class_name: className,
                  attendee_count: count,
                  attendees,
                },
              });
            }
          }
        }
      } catch (err) {
        console.warn("[checkUpcomingClasses] Erro ao monitorar turmas do dia:", err);
      }
    };

    checkUpcomingClasses();
    const interval = setInterval(checkUpcomingClasses, 30000);
    return () => clearInterval(interval);
  }, [user?.id, navigate]);

  async function markAsRead(id: string) {
    await supabase
      .from("pt_notifications" as any)
      .update({ read: true } as any)
      .eq("id", id);
    qc.invalidateQueries({ queryKey: ["notifications", user?.id] });
  }

  async function markAllAsRead(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!user) return;
    await supabase
      .from("pt_notifications" as any)
      .update({ read: true } as any)
      .eq("user_id", user.id)
      .eq("read", false);
    qc.invalidateQueries({ queryKey: ["notifications", user.id] });
  }

  async function clearAll(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!user?.id || isClearing) return;

    setIsClearing(true);
    // 1. Otimismo imediato na tela
    qc.setQueryData(["notifications", user.id], []);

    try {
      // 2. Chamar endpoint no backend que roda com service_role (ignora RLS)
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

      // 3. Fallback no Supabase client direto
      await supabase
        .from("pt_notifications" as any)
        .delete()
        .eq("user_id", user.id)
        .neq("type", "custom_form_definition")
        .neq("type", "form_submission")
        .catch(() => null);

      toast.success("Notificações apagadas com sucesso!");
    } catch {
      toast.info("Notificações limpas.");
    } finally {
      qc.invalidateQueries({ queryKey: ["notifications", user.id] });
      setIsClearing(false);
    }
  }

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.type === "form_submission") {
      navigate({ to: "/formularios" });
    } else if (notification.type === "training_complete" && notification.metadata?.student_id) {
      navigate({
        to: "/personal-trainer/students/$id",
        params: { id: notification.metadata.student_id },
      });
    } else if (notification.type === "checkin" || notification.type === "class_reminder_20m" || notification.type === "class_reminder_19m30s") {
      navigate({ to: "/agenda" });
    }
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "checkin":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />;
      case "class_reminder_20m":
      case "class_reminder_19m30s":
        return <Calendar className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />;
      case "training_complete":
        return <Dumbbell className="h-4 w-4 text-primary shrink-0 mt-0.5" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <>
              <BellDot className="h-5 w-5 text-primary animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            </>
          ) : (
            <Bell className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-88 p-0 shadow-2xl border-border/60 rounded-xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/20">
          <div>
            <h3 className="text-sm font-bold tracking-tight">Notificações do Studio</h3>
            <p className="text-[10px] text-muted-foreground">Check-ins e lembretes de aulas</p>
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-7 text-[10px] uppercase font-bold text-primary hover:text-primary hover:bg-primary/10 px-2"
              >
                Ler tudo
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearAll}
                disabled={isClearing}
                className="h-7 w-7 text-muted-foreground hover:text-destructive active:scale-90 transition-transform"
                title="Limpar todas as notificações"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Banner de Ativação / Teste de Notificações no Celular */}
        <div className="border-b px-3.5 py-2 bg-muted/40 flex items-center justify-between gap-2 text-xs">
          {isPermitted ? (
            <>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 truncate">
                  Avisos ativos no aparelho
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleTestNotification}
                className="h-6 text-[10px] px-2.5 font-bold border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 shrink-0"
              >
                Testar Alerta 📲
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 min-w-0">
                <Smartphone className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 truncate">
                  Receber alertas no celular
                </span>
              </div>
              <Button
                size="sm"
                onClick={handleEnablePush}
                className="h-6 text-[10px] px-2.5 font-bold bg-amber-500 hover:bg-amber-600 text-white shrink-0 shadow-sm"
              >
                Ativar Notificações 🔔
              </Button>
            </>
          )}
        </div>

        {/* Lista de Mensagens */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/40">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2.5">
                <Bell className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <p className="text-xs font-medium text-foreground">Caixa de entrada limpa</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[220px]">
                Novos check-ins de alunos e lembretes de turmas aparecerão aqui em tempo real.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={cn(
                  "relative flex cursor-pointer items-start gap-2.5 px-4 py-3 transition-colors hover:bg-muted/50",
                  !n.read && "bg-primary/[0.04]"
                )}
              >
                {getNotificationIcon(n.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        "text-xs font-semibold leading-tight line-clamp-1",
                        !n.read ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {n.title}
                    </span>
                    <span className="whitespace-nowrap text-[9px] text-muted-foreground uppercase font-medium">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-2 mt-0.5">
                    {n.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="bg-muted/30 px-4 py-2 text-center border-t flex items-center justify-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Alertas em Tempo Real
            </span>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
