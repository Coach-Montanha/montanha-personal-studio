import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  BellRing,
  CheckCheck,
  Trash2,
  Search,
  Dumbbell,
  CheckCircle2,
  Calendar,
  FileText,
  Clock,
  ArrowRight,
  Smartphone,
  RefreshCw,
  Building2,
  Check,
  Sparkles,
  Inbox,
  Filter,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
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

      const activeRows = (rawRows ?? []).filter((n: any) => {
        if (n.metadata?.notification_cleared === true || n.metadata?.notification_cleared === "true") {
          return false;
        }
        return true;
      });

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

  // 2. Realtime listener
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
      if (categoryTab === "training" && item.type !== "training_complete") return false;
      if (categoryTab === "checkin" && item.type !== "checkin") return false;
      if (categoryTab === "classes" && !item.type.startsWith("class_")) return false;
      if (categoryTab === "forms" && item.type !== "form_submission") return false;

      if (originFilter !== "all" && item.origin !== originFilter) return false;
      if (statusFilter === "unread" && item.read) return false;

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

    return {
      total,
      unread,
      treinosHoje,
      checkinsHoje,
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
    toast.success("Alerta enviado com sucesso!", {
      description: "Verifique a barra de notificações do seu aparelho.",
    });
  };

  const handleEnablePush = async () => {
    const granted = await requestNotificationPermissions();
    setDevicePermitted(granted);
    if (granted) {
      toast.success("Avisos no celular ativados!");
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
      {/* Cabeçalho da Página com Actions devidamente mapeadas */}
      <PageHeader
        title="Central de Notificações"
        description="Painel unificado para monitorar check-ins de alunos, treinos finalizados por planilha ou consultoria, e avisos em tempo real."
        icon={Bell}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestDeviceAlert}
              className="h-9 px-3 gap-1.5 text-xs font-semibold rounded-xl border-border/70 hover:bg-muted/60 active:scale-[0.98] transition-all"
            >
              <Smartphone className="h-3.5 w-3.5 text-primary" />
              <span>Testar no Celular</span>
            </Button>

            {stats.unread > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="h-9 px-3 gap-1.5 text-xs font-semibold rounded-xl border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 active:scale-[0.98] transition-all"
              >
                <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Marcar Todas Lidas</span>
              </Button>
            )}

            {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={isClearing}
                className="h-9 px-3 gap-1.5 text-xs font-semibold rounded-xl border-border/70 text-muted-foreground hover:text-destructive hover:border-destructive/30 active:scale-[0.98] transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Limpar</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="h-9 w-9 shrink-0 rounded-xl border-border/70 active:scale-[0.98] transition-all"
              title="Recarregar notificações"
            >
              <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin text-primary")} />
            </Button>
          </div>
        }
      />

      {/* Banner de Status Push no Celular */}
      {!devicePermitted && (
        <Card className="rounded-2xl border-amber-500/30 bg-amber-500/5 backdrop-blur-sm shadow-xs">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
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
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs h-9 px-4 rounded-xl shrink-0 shadow-xs active:scale-[0.98] transition-all"
            >
              Ativar Alertas no Celular 📲
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Cards de Métricas em Tempo Real (Apple Bento Grid) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-xs hover:border-primary/40 transition-all">
          <CardContent className="flex items-center gap-3.5 p-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Bell className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">Total de Avisos</p>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-xs hover:border-amber-500/40 transition-all">
          <CardContent className="flex items-center gap-3.5 p-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">
              <BellRing className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">Não Lidas</p>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400 font-mono">
                {stats.unread}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-xs hover:border-emerald-500/40 transition-all">
          <CardContent className="flex items-center gap-3.5 p-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">Treinos Hoje</p>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
                {stats.treinosHoje}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-xs hover:border-blue-500/40 transition-all">
          <CardContent className="flex items-center gap-3.5 p-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">Check-ins Hoje</p>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400 font-mono">
                {stats.checkinsHoje}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Painel Unificado de Filtros, Categorias e Busca */}
      <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md p-3.5 sm:p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Busca Textual */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome do aluno, treino, turma ou mensagem..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 text-base md:text-sm rounded-xl bg-background/80 border-border/60 focus-visible:ring-primary/20"
            />
          </div>

          {/* Seletores de Filtros */}
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={originFilter}
              onValueChange={(v: "all" | "studio" | "pt") => setOriginFilter(v)}
            >
              <SelectTrigger className="w-[180px] h-10 text-xs font-semibold rounded-xl bg-background/80 border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Todos os Alunos</SelectItem>
                <SelectItem value="studio">🏛️ Alunos Studio (Planilha)</SelectItem>
                <SelectItem value="pt">🏋️ Personal Trainer</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(v: "all" | "unread") => setStatusFilter(v)}
            >
              <SelectTrigger className="w-[145px] h-10 text-xs font-semibold rounded-xl bg-background/80 border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="unread">Apenas Não Lidas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Abas Segmentadas Apple-Style */}
        <div className="bg-muted/40 p-1 rounded-xl flex flex-wrap gap-1 border border-border/40">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCategoryTab("all")}
            className={cn(
              "h-8 px-3 text-xs font-semibold rounded-lg transition-all active:scale-[0.98]",
              categoryTab === "all"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            )}
          >
            <Bell className="h-3.5 w-3.5 mr-1.5" />
            Todas
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-muted-foreground/15 text-foreground">
              {notifications.length}
            </span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCategoryTab("training")}
            className={cn(
              "h-8 px-3 text-xs font-semibold rounded-lg transition-all active:scale-[0.98]",
              categoryTab === "training"
                ? "bg-background text-amber-600 dark:text-amber-400 shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            )}
          >
            <Dumbbell className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
            Treinos Finalizados
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500/15 text-amber-600 dark:text-amber-400">
              {notifications.filter((n) => n.type === "training_complete").length}
            </span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCategoryTab("checkin")}
            className={cn(
              "h-8 px-3 text-xs font-semibold rounded-lg transition-all active:scale-[0.98]",
              categoryTab === "checkin"
                ? "bg-background text-emerald-600 dark:text-emerald-400 shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
            Check-ins Studio
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              {notifications.filter((n) => n.type === "checkin").length}
            </span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCategoryTab("classes")}
            className={cn(
              "h-8 px-3 text-xs font-semibold rounded-lg transition-all active:scale-[0.98]",
              categoryTab === "classes"
                ? "bg-background text-blue-600 dark:text-blue-400 shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            )}
          >
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
            Lembretes de Turmas
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-500/15 text-blue-600 dark:text-blue-400">
              {notifications.filter((n) => n.type.startsWith("class_")).length}
            </span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCategoryTab("forms")}
            className={cn(
              "h-8 px-3 text-xs font-semibold rounded-lg transition-all active:scale-[0.98]",
              categoryTab === "forms"
                ? "bg-background text-purple-600 dark:text-purple-400 shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            )}
          >
            <FileText className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
            Formulários
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-purple-500/15 text-purple-600 dark:text-purple-400">
              {notifications.filter((n) => n.type === "form_submission").length}
            </span>
          </Button>
        </div>
      </div>

      {/* Lista de Notificações */}
      {isLoading ? (
        <Card className="rounded-2xl border border-border/60 p-12 text-center text-sm text-muted-foreground">
          <div className="flex flex-col items-center justify-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <p className="font-semibold text-foreground">Carregando histórico de notificações...</p>
          </div>
        </Card>
      ) : filteredNotifications.length === 0 ? (
        <Card className="rounded-2xl border border-border/60 bg-card/60 p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground/60 ring-1 ring-border/50">
            <Inbox className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-foreground">Nenhuma notificação encontrada</p>
            <p className="text-xs text-muted-foreground max-w-sm">
              Não há avisos correspondentes aos filtros selecionados no momento.
            </p>
          </div>
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
              className="mt-1 h-9 px-4 rounded-xl text-xs font-semibold active:scale-[0.98] transition-all"
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
                  "rounded-2xl overflow-hidden border transition-all cursor-pointer shadow-xs",
                  isUnread
                    ? "border-primary/50 bg-card border-l-[5px] border-l-primary hover:border-primary/70"
                    : "border-border/60 bg-card/60 hover:bg-card hover:border-border/80 opacity-95"
                )}
              >
                <CardContent className="p-4 sm:p-5 space-y-3.5">
                  {/* Topo do Card: Ícone, Título, Badges e Timestamp */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      {/* Squircle Icon Container */}
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
                          item.type === "training_complete"
                            ? "bg-amber-500/10 text-amber-500 ring-amber-500/20"
                            : item.type === "checkin"
                            ? "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20"
                            : item.type.startsWith("class_")
                            ? "bg-blue-500/10 text-blue-500 ring-blue-500/20"
                            : "bg-purple-500/10 text-purple-500 ring-purple-500/20"
                        )}
                      >
                        {getNotificationIcon(item.type)}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={cn(
                              "text-sm sm:text-base font-bold leading-tight",
                              isUnread ? "text-foreground" : "text-foreground/80"
                            )}
                          >
                            {item.title}
                          </h3>

                          {/* Badge de Origem do Aluno */}
                          {item.origin === "studio" ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-semibold gap-1 py-0 px-2 h-5 rounded-full"
                              title="Aluno Studio (treina com planilha / aulas presenciais)"
                            >
                              <Building2 className="h-2.5 w-2.5" />
                              Studio (Planilha)
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] font-semibold gap-1 py-0 px-2 h-5 rounded-full"
                              title="Aluno Personal Trainer (consultoria individual)"
                            >
                              <Dumbbell className="h-2.5 w-2.5" />
                              Personal Trainer
                            </Badge>
                          )}

                          {isUnread && (
                            <span className="flex h-2 w-2 rounded-full bg-primary ring-2 ring-primary/20 animate-pulse" title="Não lida" />
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {item.message}
                        </p>

                        {/* Metadados detalhados de Treino Concluído */}
                        {item.type === "training_complete" && item.metadata && (
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                            {item.metadata.duration_formatted && (
                              <Badge variant="outline" className="gap-1 text-[11px] font-mono rounded-lg border-border/70">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                {item.metadata.duration_formatted}
                              </Badge>
                            )}
                            {item.metadata.loads_count !== undefined && (
                              <Badge variant="outline" className="gap-1 text-[11px] text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/5 rounded-lg">
                                ⚖️ {item.metadata.loads_count} cargas anotadas
                              </Badge>
                            )}
                            {item.metadata.performed_count !== undefined && (
                              <Badge variant="secondary" className="gap-1 text-[11px] rounded-lg">
                                💪 {item.metadata.performed_count} exercícios
                              </Badge>
                            )}
                            {item.metadata.feedback && (
                              <div className="w-full rounded-xl bg-purple-500/10 border border-purple-500/25 p-3 text-xs text-foreground italic mt-1.5">
                                "{item.metadata.feedback}"
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Lado Direito: Horário */}
                    <div className="text-left sm:text-right shrink-0 pt-0.5 sm:pt-0">
                      <span className="text-[11px] font-semibold text-muted-foreground block">
                        {relativeTime}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 hidden sm:block">
                        {exactTime}
                      </span>
                    </div>
                  </div>

                  {/* Rodapé de Ações Estruturadas (Hit Target Seguro >= 44px) */}
                  <div className="pt-2.5 border-t border-border/40 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                    <span className="text-[11px] text-muted-foreground/80 sm:hidden">
                      {exactTime}
                    </span>

                    <div className="flex items-center gap-2 ml-auto">
                      {isUnread && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleMarkAsRead(item.id, e)}
                          className="h-8 px-2.5 rounded-lg text-xs font-semibold text-primary hover:text-primary hover:bg-primary/10 active:scale-[0.98] transition-all"
                          title="Marcar notificação como lida"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Marcar Lida
                        </Button>
                      )}

                      {item.type === "training_complete" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(item.id);
                            navigate({ to: "/personal-trainer/feedbacks" as any });
                          }}
                          className="h-8 px-3 rounded-lg text-xs font-bold text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10 active:scale-[0.98] transition-all gap-1.5 shadow-2xs"
                        >
                          <span>Ver Feedbacks</span>
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
                          className="h-8 px-3 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 active:scale-[0.98] transition-all gap-1.5 shadow-2xs"
                        >
                          <span>Ver Agenda</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDeleteNotification(item.id, e)}
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 active:scale-[0.98] transition-all"
                        title="Excluir notificação"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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
