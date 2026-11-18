import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  BellRing,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  Dumbbell,
  CheckCircle2,
  Calendar,
  FileText,
  Sparkles,
  Clock,
  ArrowRight,
  ExternalLink,
  Smartphone,
  Volume2,
  RefreshCw,
  Building2,
  Users,
  MessageSquareQuote,
  Check,
  Zap,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  isNativeApp,
  triggerDeviceNotification,
  requestNotificationPermissions,
  checkNotificationPermissionStatus,
} from "@/lib/notifications.native";

export const Route = createFileRoute("/_authenticated/notificacoes")({
  head: () => ({
    meta: [{ title: "Central de Notificações — Montanha Personal Studio" }],
  }),
  component: NotificacoesPage,
});

function playChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
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

export function NotificacoesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [categoryTab, setCategoryTab] = useState<"all" | "training" | "checkin" | "classes" | "forms">("all");
  const [originFilter, setOriginFilter] = useState<"all" | "studio" | "pt">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "unread">("all");
  const [isClearing, setIsClearing] = useState(false);
  const [devicePermitted, setDevicePermitted] = useState<boolean | null>(null);

  // Checagem de permissão de notificação no celular
  useEffect(() => {
    checkNotificationPermissionStatus().then((status) => {
      setDevicePermitted(status === "granted");
    });
  }, []);

  // 1. Carrega todas as notificações
  const {
    data: notifications = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["notifications-full-page", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data: rawRows, error } = await supabase
        .from("pt_notifications" as any)
        .select("*")
        .eq("user_id", user!.id)
        .neq("type", "custom_form_definition")
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) {
        console.warn("[NotificacoesPage] Erro ao buscar notificações:", error);
        return [];
      }

      // Filtra notificações marcadas como limpas da central
      const activeRows = (rawRows ?? []).filter((n: any) => {
        if (n.metadata?.notification_cleared === true || n.metadata?.notification_cleared === "true") {
          return false;
        }
        return true;
      });

      // Mapeamento auxiliar de origens de alunos (Studio vs PT)
      const studentIds = Array.from(
        new Set(
          activeRows
            .map((r: any) => r.metadata?.student_id)
            .filter((id: any): id is string => typeof id === "string" && Boolean(id))
        )
      );

      const [studioRes, ptRes] = await Promise.all([
        studentIds.length > 0
          ? supabase.from("students").select("id").in("id", studentIds)
          : Promise.resolve({ data: [] }),
        studentIds.length > 0
          ? supabase.from("pt_students").select("id").in("id", studentIds)
          : Promise.resolve({ data: [] }),
      ]);

      const studioSet = new Set((studioRes.data || []).map((s: any) => s.id));
      const ptSet = new Set((ptRes.data || []).map((s: any) => s.id));

      return activeRows.map((notif: any) => {
        const meta = notif.metadata || {};
        const studentId = meta.student_id;

        // Determinação da origem do aluno:
        // 1. Pelo metadata explícito
        // 2. Pela presença na tabela students (Studio) vs pt_students (PT)
        // 3. Pelo tipo da notificação (check-in é Studio)
        let resolvedOrigin: "studio" | "pt" = "pt";
        if (meta.student_type === "studio" || notif.type === "checkin" || notif.type?.startsWith("class_")) {
          resolvedOrigin = "studio";
        } else if (studentId && studioSet.has(studentId) && !ptSet.has(studentId)) {
          resolvedOrigin = "studio";
        } else if (meta.student_type === "pt") {
          resolvedOrigin = "pt";
        }

        return {
          id: notif.id,
          title: notif.title || "Notificação",
          message: notif.message || "",
          type: notif.type || "generic",
          read: Boolean(notif.read),
          createdAt: notif.created_at,
          metadata: meta,
          origin: resolvedOrigin,
        };
      });
    },
    refetchInterval: 30000,
  });

  // 2. Realtime listener: sincroniza imediatamente novos treinos concluídos e check-ins
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`notificacoes_page_realtime:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pt_notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            playChime();
          }
          queryClient.invalidateQueries({ queryKey: ["notifications-full-page", user.id] });
          queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  // 3. Filtragem dinâmica
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Filtro de aba/categoria
      if (categoryTab === "training" && item.type !== "training_complete") return false;
      if (categoryTab === "checkin" && item.type !== "checkin") return false;
      if (categoryTab === "classes" && !item.type.startsWith("class_")) return false;
      if (categoryTab === "forms" && item.type !== "form_submission") return false;

      // Filtro de origem do aluno (Studio vs PT)
      if (originFilter !== "all" && item.origin !== originFilter) return false;

      // Filtro de lidas
      if (statusFilter === "unread" && item.read) return false;

      // Busca textual
      if (search.trim()) {
        const q = search.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(q);
        const msgMatch = item.message.toLowerCase().includes(q);
        const studentMatch = (item.metadata?.student_name || "").toLowerCase().includes(q);
        const dayMatch = (item.metadata?.day_name || "").toLowerCase().includes(q);
        if (!titleMatch && !msgMatch && !studentMatch && !dayMatch) return false;
      }

      return true;
    });
  }, [notifications, categoryTab, originFilter, statusFilter, search]);

  // Estatísticas rápidas de topo
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.read).length;

    const todayStr = new Date().toISOString().slice(0, 10);
    const treinosHoje = notifications.filter(
      (n) => n.type === "training_complete" && (n.createdAt || "").slice(0, 10) === todayStr
    ).length;

    const checkinsHoje = notifications.filter(
      (n) => n.type === "checkin" && (n.createdAt || "").slice(0, 10) === todayStr
    ).length;

    const treinosStudio = notifications.filter(
      (n) => n.type === "training_complete" && n.origin === "studio"
    ).length;

    const treinosPT = notifications.filter(
      (n) => n.type === "training_complete" && n.origin === "pt"
    ).length;

    return {
      total,
      unread,
      treinosHoje,
      checkinsHoje,
      treinosStudio,
      treinosPT,
    };
  }, [notifications]);

  // Ações
  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await supabase.from("pt_notifications" as any).update({ read: true }).eq("id", id);
      queryClient.setQueryData(["notifications-full-page", user?.id], (old: any[] = []) =>
        old.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    } catch {
      // ignore
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await supabase.from("pt_notifications" as any).update({ read: true }).eq("user_id", user.id).eq("read", false);
      queryClient.setQueryData(["notifications-full-page", user.id], (old: any[] = []) =>
        old.map((n) => ({ ...n, read: true }))
      );
      queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
      toast.success("Todas as notificações foram marcadas como lidas!");
    } catch (err: any) {
      toast.error("Erro ao marcar notificações como lidas: " + err.message);
    }
  };

  const handleDeleteNotification = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await supabase.from("pt_notifications" as any).delete().eq("id", id);
      queryClient.setQueryData(["notifications-full-page", user?.id], (old: any[] = []) =>
        old.filter((n) => n.id !== id)
      );
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
      toast.success("Notificação excluída.");
    } catch (err: any) {
      toast.error("Erro ao excluir: " + err.message);
    }
  };

  const handleClearAll = async () => {
    if (!user?.id || isClearing) return;
    setIsClearing(true);
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
        .neq("type", "custom_form_definition")
        .neq("type", "form_submission")
        .catch(() => null);

      queryClient.invalidateQueries({ queryKey: ["notifications-full-page", user.id] });
      queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
      toast.success("Histórico de notificações limpo!");
    } catch {
      toast.info("Notificações limpas.");
    } finally {
      setIsClearing(false);
    }
  };

  const handleTestDeviceAlert = async () => {
    playChime();
    await triggerDeviceNotification({
      title: "Studio Montanha 🚀",
      body: "Alerta de teste verificado com sucesso no seu dispositivo!",
      url: "/notificacoes",
    });
    toast.success("Alerta enviado!", {
      description: "Verifique a barra de status do seu celular ou notificações do sistema.",
    });
  };

  const handleEnablePush = async () => {
    const granted = await requestNotificationPermissions();
    setDevicePermitted(granted);
    if (granted) {
      toast.success("Avisos no celular ativados com sucesso!");
      await handleTestDeviceAlert();
    } else {
      toast.error("Permissão de notificação negada no aparelho.", {
        description: "Habilite as notificações nas configurações do navegador ou app.",
      });
    }
  };

  const handleNotificationClick = (item: (typeof notifications)[0]) => {
    handleMarkAsRead(item.id);
    if (item.type === "training_complete") {
      navigate({ to: "/personal-trainer/feedbacks" as any });
    } else if (item.type === "checkin" || item.type.startsWith("class_")) {
      navigate({ to: "/agenda" });
    } else if (item.type === "form_submission") {
      navigate({ to: "/formularios" });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "training_complete":
        return <Dumbbell className="h-5 w-5 text-amber-500" />;
      case "checkin":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "class_reminder_20m":
      case "class_reminder_19m30s":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "form_submission":
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho da Página */}
      <PageHeader
        title="Central de Notificações"
        description="Área dedicada para receber e auditar todas as notificações de treinos finalizados (Studio e Personal), check-ins presenciais e lembretes de turmas em tempo real."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestDeviceAlert}
              className="h-9 gap-1.5 text-xs font-semibold"
            >
              <Smartphone className="h-3.5 w-3.5 text-primary" />
              Testar Alerta no Celular
            </Button>

            {stats.unread > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="h-9 gap-1.5 text-xs font-semibold"
              >
                <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
                Marcar Todas como Lidas
              </Button>
            )}

            {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={isClearing}
                className="h-9 gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Limpar Notificações
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="h-9 w-9 shrink-0"
              title="Recarregar"
            >
              <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin text-primary")} />
            </Button>
          </div>
        }
      />

      {/* Banner de Status Push no Celular */}
      {!devicePermitted && (
        <Card className="border-amber-500/30 bg-amber-500/5 backdrop-blur-sm">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Receba avisos na tela de bloqueio do seu celular
                </p>
                <p className="text-xs text-muted-foreground">
                  Ative as notificações para ser avisado com som e banner sempre que um aluno do Studio ou Personal concluir um treino.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleEnablePush}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs h-8 shrink-0"
            >
              Ativar Alertas no Celular 📲
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Cards de Métricas em Tempo Real */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total de Avisos</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Não Lidas</p>
              <p className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                {stats.unread}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Treinos Hoje</p>
              <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {stats.treinosHoje}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Check-ins Hoje</p>
              <p className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                {stats.checkinsHoje}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Filtros, Categorias e Busca */}
      <div className="flex flex-col gap-3 bg-card p-3 rounded-2xl border border-border/60 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Busca Textual */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome do aluno, treino, turma ou mensagem..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-base md:text-sm bg-background/60"
            />
          </div>

          {/* Filtro de Origem do Aluno (Studio vs Personal) */}
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={originFilter}
              onValueChange={(v: "all" | "studio" | "pt") => setOriginFilter(v)}
            >
              <SelectTrigger className="w-[170px] h-9 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Alunos</SelectItem>
                <SelectItem value="studio">🏛️ Alunos Studio (Planilha)</SelectItem>
                <SelectItem value="pt">🏋️ Personal Trainer</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(v: "all" | "unread") => setStatusFilter(v)}
            >
              <SelectTrigger className="w-[130px] h-9 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="unread">Apenas Não Lidas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Abas de Categorias */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border/40">
          <Button
            size="sm"
            variant={categoryTab === "all" ? "default" : "ghost"}
            onClick={() => setCategoryTab("all")}
            className="h-8 text-xs font-semibold gap-1.5"
          >
            <Bell className="h-3.5 w-3.5" />
            Todas ({notifications.length})
          </Button>

          <Button
            size="sm"
            variant={categoryTab === "training" ? "default" : "ghost"}
            onClick={() => setCategoryTab("training")}
            className="h-8 text-xs font-semibold gap-1.5 text-amber-600 dark:text-amber-400"
          >
            <Dumbbell className="h-3.5 w-3.5" />
            Treinos Finalizados ({notifications.filter((n) => n.type === "training_complete").length})
          </Button>

          <Button
            size="sm"
            variant={categoryTab === "checkin" ? "default" : "ghost"}
            onClick={() => setCategoryTab("checkin")}
            className="h-8 text-xs font-semibold gap-1.5 text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Check-ins Studio ({notifications.filter((n) => n.type === "checkin").length})
          </Button>

          <Button
            size="sm"
            variant={categoryTab === "classes" ? "default" : "ghost"}
            onClick={() => setCategoryTab("classes")}
            className="h-8 text-xs font-semibold gap-1.5 text-blue-600 dark:text-blue-400"
          >
            <Calendar className="h-3.5 w-3.5" />
            Lembretes de Turmas ({notifications.filter((n) => n.type.startsWith("class_")).length})
          </Button>

          <Button
            size="sm"
            variant={categoryTab === "forms" ? "default" : "ghost"}
            onClick={() => setCategoryTab("forms")}
            className="h-8 text-xs font-semibold gap-1.5 text-purple-600 dark:text-purple-400"
          >
            <FileText className="h-3.5 w-3.5" />
            Formulários ({notifications.filter((n) => n.type === "form_submission").length})
          </Button>
        </div>
      </div>

      {/* Lista de Notificações */}
      {isLoading ? (
        <Card className="p-12 text-center text-sm text-muted-foreground">
          Carregando histórico de notificações...
        </Card>
      ) : filteredNotifications.length === 0 ? (
        <Card className="p-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-1">
            <Bell className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <p className="font-semibold text-foreground">Nenhuma notificação encontrada</p>
          <p className="text-xs text-muted-foreground max-w-sm">
            Não há notificações correspondentes aos filtros selecionados.
          </p>
          {(search || categoryTab !== "all" || originFilter !== "all" || statusFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setCategoryTab("all");
                setOriginFilter("all");
                setStatusFilter("all");
              }}
              className="mt-2 text-xs"
            >
              Limpar Filtros
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => {
            const isUnread = !item.read;
            const relativeTime = item.createdAt
              ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: ptBR })
              : "";
            const exactTime = item.createdAt ? format(new Date(item.createdAt), "dd/MM/yyyy 'às' HH:mm") : "";

            return (
              <Card
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={cn(
                  "overflow-hidden border transition-all cursor-pointer hover:border-primary/50 shadow-xs",
                  isUnread
                    ? "border-primary/40 bg-card/90 border-l-4 border-l-primary"
                    : "border-border/60 bg-card/40 opacity-90"
                )}
              >
                <CardContent className="p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Ícone e Corpo Principal */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          item.type === "training_complete"
                            ? "bg-amber-500/10"
                            : item.type === "checkin"
                            ? "bg-emerald-500/10"
                            : item.type.startsWith("class_")
                            ? "bg-blue-500/10"
                            : "bg-purple-500/10"
                        )}
                      >
                        {getNotificationIcon(item.type)}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={cn(
                              "text-sm font-bold leading-tight",
                              isUnread ? "text-foreground" : "text-foreground/80"
                            )}
                          >
                            {item.title}
                          </h3>

                          {/* Badge de Origem do Aluno */}
                          {item.origin === "studio" ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-semibold gap-1 py-0 px-1.5 h-5"
                              title="Aluno Studio (treina com planilha / aulas presenciais)"
                            >
                              <Building2 className="h-2.5 w-2.5" />
                              Studio (Planilha)
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] font-semibold gap-1 py-0 px-1.5 h-5"
                              title="Aluno Personal Trainer (consultoria individual)"
                            >
                              <Dumbbell className="h-2.5 w-2.5" />
                              Personal Trainer
                            </Badge>
                          )}

                          {isUnread && (
                            <span className="flex h-2 w-2 rounded-full bg-primary" title="Não lida" />
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                          {item.message}
                        </p>

                        {/* Detalhes específicos de Treino Concluído */}
                        {item.type === "training_complete" && item.metadata && (
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                            {item.metadata.duration_formatted && (
                              <Badge variant="outline" className="gap-1 text-[11px] font-mono">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                {item.metadata.duration_formatted}
                              </Badge>
                            )}
                            {item.metadata.loads_count !== undefined && (
                              <Badge variant="outline" className="gap-1 text-[11px] text-amber-600 dark:text-amber-400 border-amber-500/30">
                                ⚖️ {item.metadata.loads_count} cargas registradas
                              </Badge>
                            )}
                            {item.metadata.feedback && (
                              <div className="w-full rounded-lg bg-purple-500/10 border border-purple-500/20 p-2.5 text-xs text-purple-700 dark:text-purple-300 mt-1 italic">
                                "{item.metadata.feedback}"
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Lado Direito: Horário & Ações */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/40">
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-muted-foreground block">
                          {relativeTime}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60 hidden sm:block">
                          {exactTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isUnread ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleMarkAsRead(item.id, e)}
                            className="h-7 text-[11px] text-primary hover:text-primary hover:bg-primary/10 px-2"
                            title="Marcar como lida"
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Lida
                          </Button>
                        ) : null}

                        {item.type === "training_complete" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(item.id);
                              navigate({ to: "/personal-trainer/feedbacks" as any });
                            }}
                            className="h-7 text-[11px] font-bold text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10 px-2 gap-1"
                          >
                            Ver Feedbacks
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        )}

                        {item.type === "checkin" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(item.id);
                              navigate({ to: "/agenda" });
                            }}
                            className="h-7 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 px-2 gap-1"
                          >
                            Ver Agenda
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDeleteNotification(item.id, e)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          title="Excluir notificação"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
