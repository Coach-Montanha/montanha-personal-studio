import { useEffect, useState } from "react";
import { Bell, BellDot, Trash2, Calendar, Dumbbell, CheckCircle2, Smartphone, Check } from "lucide-react";
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

// Dispara notificação nativa do sistema operacional (Android, iOS 16.4+, Windows)
function showNativePushNotification(title: string, body: string, url: string = "/agenda") {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    if ("serviceWorker" in navigator && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: "/icon-192.png",
          badge: "/favicon.svg",
          vibrate: [200, 100, 200],
          tag: "studio-alert-" + Date.now(),
          renotify: true,
          data: { url },
        } as any);
      });
    } else {
      new Notification(title, {
        body,
        icon: "/icon-192.png",
      });
    }
  } catch (err) {
    console.warn("[NativePush] Erro ao disparar notificação nativa:", err);
  }
}

export function NotificationCenter() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [pushStatus, setPushStatus] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushStatus(Notification.permission);
      // Registra o Service Worker
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").catch((err) => {
          console.warn("[SW] Registro falhou:", err);
        });
      }
    } else {
      setPushStatus("unsupported");
    }
  }, []);

  async function handleEnablePush() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Notificações não são suportadas neste navegador.");
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setPushStatus(perm);
      if (perm === "granted") {
        toast.success("Avisos no celular e na tela de bloqueio ativados com sucesso!");
        showNativePushNotification(
          "Studio Montanha Conectado! 🚀",
          "Você receberá alertas de novos check-ins e turmas diretamente no seu celular."
        );
      } else if (perm === "denied") {
        toast.error("Permissão de notificação negada nas configurações do navegador.");
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
        .order("created_at", { ascending: false })
        .limit(30);
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
        (payload: any) => {
          qc.invalidateQueries({ queryKey: ["notifications", user.id] });
          playNotificationSound();

          const notif = payload.new;
          const title = notif.title || (notif.type === "checkin" ? "🔔 Novo Check-in!" : "⏰ Studio");
          const message = notif.message || "";

          // Disparo de notificação nativa no sistema operacional
          showNativePushNotification(title, message, "/agenda");

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

  // 2. Alerta preventivo automático 20 minutos antes de cada aula do dia
  useEffect(() => {
    if (!user?.id) return;

    const checkUpcomingClasses = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
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

        const now = new Date();

        for (const session of sessions) {
          if (!session.start_time) continue;
          const [h, m] = session.start_time.split(":").map(Number);
          const sessionTime = new Date();
          sessionTime.setHours(h, m, 0, 0);

          const diffMinutes = Math.floor((sessionTime.getTime() - now.getTime()) / 60000);

          // Dispara quando faltarem entre 0 e 20 minutos para a aula
          if (diffMinutes <= 20 && diffMinutes >= 0) {
            const storageKey = `notified_class_20m_${session.id}_${today}`;
            if (!localStorage.getItem(storageKey)) {
              localStorage.setItem(storageKey, "true");

              const attendees = (session.class_attendance ?? [])
                .map((a: any) => a.students?.name)
                .filter(Boolean);

              const timeFormatted = session.start_time.slice(0, 5);
              const className = (session.classes as any)?.name || "Turma";
              const count = attendees.length;
              const body =
                count > 0
                  ? `${count} aluno(s) com check-in: ${attendees.join(", ")}.`
                  : "Nenhum aluno realizou check-in até o momento.";

              playNotificationSound();
              showNativePushNotification(
                `⏰ Aula em 20 min (${timeFormatted} - ${className})`,
                body,
                "/agenda"
              );

              toast.info(`⏰ Aula em 20 min (${timeFormatted} - ${className})`, {
                description: body,
                duration: 12000,
                action: {
                  label: "Ver Agenda",
                  onClick: () => navigate({ to: "/agenda" }),
                },
              });

              await supabase.from("pt_notifications" as any).insert({
                user_id: user.id,
                title: `⏰ Aula em 20 min (${timeFormatted} - ${className})`,
                message: body,
                type: "class_reminder_20m",
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
    const interval = setInterval(checkUpcomingClasses, 45000);
    return () => clearInterval(interval);
  }, [user?.id, navigate]);

  async function markAsRead(id: string) {
    await supabase
      .from("pt_notifications" as any)
      .update({ read: true } as any)
      .eq("id", id);
    qc.invalidateQueries({ queryKey: ["notifications"] });
  }

  async function markAllAsRead() {
    if (!user) return;
    await supabase
      .from("pt_notifications" as any)
      .update({ read: true } as any)
      .eq("user_id", user.id)
      .eq("read", false);
    qc.invalidateQueries({ queryKey: ["notifications"] });
  }

  async function clearAll() {
    if (!user) return;
    await supabase
      .from("pt_notifications" as any)
      .delete()
      .eq("user_id", user.id);
    qc.invalidateQueries({ queryKey: ["notifications"] });
  }

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.type === "training_complete" && notification.metadata?.student_id) {
      navigate({
        to: "/personal-trainer/students/$id",
        params: { id: notification.metadata.student_id },
      });
    } else if (notification.type === "checkin" || notification.type === "class_reminder_20m") {
      navigate({ to: "/agenda" });
    }
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "checkin":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />;
      case "class_reminder_20m":
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
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            </>
          ) : (
            <Bell className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-88 p-0 shadow-xl border-border/50">
        <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/20">
          <div>
            <h3 className="text-sm font-bold">Notificações do Studio</h3>
            <p className="text-[10px] text-muted-foreground">Check-ins e lembretes de aulas</p>
          </div>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-7 text-[10px] uppercase font-bold text-primary hover:text-primary hover:bg-primary/10"
              >
                Ler tudo
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearAll}
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                title="Limpar todas as notificações"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Banner de Ativação de Push Nativo no Celular */}
        {pushStatus !== "granted" && pushStatus !== "unsupported" ? (
          <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary shrink-0" />
              <span className="text-[11px] text-foreground font-medium">
                Ativar avisos na tela do celular
              </span>
            </div>
            <Button
              size="sm"
              variant="default"
              onClick={handleEnablePush}
              className="h-6 text-[10px] px-2 font-bold"
            >
              Ativar
            </Button>
          </div>
        ) : pushStatus === "granted" ? (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-1.5 flex items-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <Check className="h-3 w-3" />
            <span>Notificações ativas na tela do celular e bloqueio</span>
          </div>
        ) : null}

        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/40">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/20 mb-2" />
              <p className="text-xs text-muted-foreground">Nenhuma notificação por enquanto.</p>
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
          <div className="bg-muted/30 px-4 py-2 text-center border-t">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Central de Alertas em Tempo Real
            </span>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
