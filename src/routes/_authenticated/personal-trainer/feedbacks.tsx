import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dumbbell,
  Search,
  MessageCircle,
  MessageSquare,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  Star,
  CheckCircle2,
  TrendingUp,
  Filter,
  User,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Building2,
  Inbox,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useScopeFilter } from "@/hooks/use-scope-filter";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/personal-trainer/feedbacks")({
  head: () => ({
    meta: [{ title: "Feedbacks & Resultados de Treino — Montanha Personal Studio" }],
  }),
  component: FeedbacksPage,
});

interface ParsedExecutionNotes {
  loads?: Record<string, string>;
  exerciseNames?: Record<string, string>;
  timerSeconds?: number;
  doneExercises?: string[];
  completedSets?: Record<string, number[]>;
  feedback?: string;
}

export function FeedbacksPage() {
  const queryClient = useQueryClient();
  const { scopeId, scopeKey, ready } = useScopeFilter();

  const [search, setSearch] = useState("");
  const [filterPeriod, setFilterPeriod] = useState<"all" | "today" | "week" | "month">("all");
  const [filterOrigin, setFilterOrigin] = useState<"all" | "studio" | "pt">("all");
  const [filterOnlyWithFeedback, setFilterOnlyWithFeedback] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 1. Carrega todas as execuções de treinos registradas
  const { data: executions = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ["pt-feedbacks-executions", scopeKey],
    enabled: ready,
    queryFn: async () => {
      let q = supabase
        .from("pt_training_executions" as any)
        .select(`
          id,
          pt_student_id,
          training_day_id,
          executed_at,
          created_at,
          rating,
          feedback,
          notes,
          user_id
        `)
        .order("created_at", { ascending: false })
        .limit(120);

      if (scopeId) {
        q = q.eq("user_id", scopeId);
      }

      const { data: execRows, error: execErr } = await q;
      if (execErr) {
        console.warn("[FeedbacksPage] Erro ao carregar execuções:", execErr);
        return [];
      }

      const studentIds = Array.from(new Set((execRows || []).map((r: any) => r.pt_student_id).filter(Boolean)));
      const dayIds = Array.from(new Set((execRows || []).map((r: any) => r.training_day_id).filter(Boolean)));

      const [ptStudentsRes, studioStudentsRes, daysRes] = await Promise.all([
        studentIds.length > 0
          ? supabase.from("pt_students").select("id, name, email, phone").in("id", studentIds)
          : Promise.resolve({ data: [] }),
        studentIds.length > 0
          ? supabase.from("students").select("id, name, email, phone").in("id", studentIds)
          : Promise.resolve({ data: [] }),
        dayIds.length > 0
          ? supabase.from("pt_training_days" as any).select("id, name, program_id").in("id", dayIds)
          : Promise.resolve({ data: [] }),
      ]);

      const studentMap = new Map<
        string,
        { name: string; phone?: string | null; email?: string | null; origin: "studio" | "pt" }
      >();
      (studioStudentsRes.data || []).forEach((s: any) => {
        if (s?.id) studentMap.set(s.id, { name: s.name, phone: s.phone, email: s.email, origin: "studio" });
      });
      (ptStudentsRes.data || []).forEach((s: any) => {
        if (s?.id) studentMap.set(s.id, { name: s.name, phone: s.phone, email: s.email, origin: "pt" });
      });

      const dayMap = new Map<string, { name: string; program_id?: string }>();
      (daysRes.data || []).forEach((d: any) => {
        if (d?.id) dayMap.set(d.id, { name: d.name, program_id: d.program_id });
      });

      return (execRows || []).map((row: any) => {
        let parsedNotes: ParsedExecutionNotes = {};
        if (typeof row.notes === "string" && row.notes.trim()) {
          try {
            parsedNotes = JSON.parse(row.notes);
          } catch {
            parsedNotes = {};
          }
        } else if (typeof row.notes === "object" && row.notes) {
          parsedNotes = row.notes;
        }

        const student = studentMap.get(row.pt_student_id) || { name: "Aluno sem nome", phone: null, origin: "pt" as const };
        const day = dayMap.get(row.training_day_id) || { name: "Treino do dia" };

        const directFeedback = row.feedback?.trim() || parsedNotes.feedback?.trim() || null;
        const loads = parsedNotes.loads || {};
        const exerciseNames = parsedNotes.exerciseNames || {};
        const timerSeconds = parsedNotes.timerSeconds || 0;
        const doneExercises = parsedNotes.doneExercises || [];

        return {
          id: row.id,
          studentId: row.pt_student_id,
          studentName: student.name,
          studentPhone: student.phone,
          studentOrigin: student.origin || "pt",
          dayId: row.training_day_id,
          dayName: day.name,
          executedAt: row.executed_at,
          createdAt: row.created_at || row.executed_at,
          rating: row.rating,
          feedback: directFeedback,
          timerSeconds,
          loads,
          exerciseNames,
          loadsCount: Object.keys(loads).length,
          doneCount: doneExercises.length || Object.keys(loads).length || 0,
        };
      });
    },
    refetchInterval: 30000,
  });

  // 2. Filtragem
  const filteredExecutions = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    return executions.filter((item) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const studentMatch = item.studentName.toLowerCase().includes(q);
        const dayMatch = item.dayName.toLowerCase().includes(q);
        const feedbackMatch = (item.feedback || "").toLowerCase().includes(q);
        if (!studentMatch && !dayMatch && !feedbackMatch) return false;
      }

      if (filterOnlyWithFeedback && !item.feedback) {
        return false;
      }

      if (filterOrigin !== "all" && item.studentOrigin !== filterOrigin) {
        return false;
      }

      if (filterPeriod === "today") {
        return (item.executedAt || "").slice(0, 10) === todayStr;
      }

      if (filterPeriod === "week") {
        const itemDate = new Date(item.createdAt || item.executedAt);
        const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
      }

      if (filterPeriod === "month") {
        const itemMonth = (item.executedAt || "").slice(0, 7);
        const currentMonth = todayStr.slice(0, 7);
        if (itemMonth !== currentMonth) return false;
      }

      return true;
    });
  }, [executions, search, filterPeriod, filterOrigin, filterOnlyWithFeedback]);

  // Estatísticas rápidas
  const stats = useMemo(() => {
    const totalTreinos = executions.length;
    const comFeedback = executions.filter((e) => e.feedback).length;
    const totalCargasAnotadas = executions.reduce((acc, e) => acc + e.loadsCount, 0);

    return {
      totalTreinos,
      comFeedback,
      totalCargasAnotadas,
    };
  }, [executions]);

  const handleOpenWhatsApp = (item: (typeof executions)[0]) => {
    const cleanPhone = (item.studentPhone || "").replace(/\D/g, "");
    if (!cleanPhone) {
      toast.error(`O aluno ${item.studentName} não possui telefone cadastrado.`);
      return;
    }

    const duracaoTexto =
      item.timerSeconds > 0
        ? ` em ${Math.floor(item.timerSeconds / 60)} min`
        : "";

    const msg = encodeURIComponent(
      `Olá, ${item.studentName}! Vi aqui que você concluiu o treino "${item.dayName}"${duracaoTexto}. Parabéns pela dedicação! Como você se sentiu?`
    );

    const fullPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
    window.open(`https://wa.me/${fullPhone}?text=${msg}`, "_blank");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho da Página com actions corretas */}
      <PageHeader
        title="Feedbacks & Resultados de Treino"
        description="Acompanhe em tempo real a conclusão dos treinos dos seus alunos (Studio com planilhas e Personal Trainer), notas e evolução de cargas."
        icon={MessageSquareQuote}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 px-3 gap-1.5 text-xs font-semibold rounded-xl border-border/70 active:scale-[0.98] transition-all"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin text-primary")} />
            <span>Atualizar Feed</span>
          </Button>
        }
      />

      {/* Cards de Métricas (Apple Bento Grid) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-xs hover:border-primary/40 transition-all">
          <CardContent className="flex items-center gap-3.5 p-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                Treinos Registrados
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                {stats.totalTreinos}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-xs hover:border-purple-500/40 transition-all">
          <CardContent className="flex items-center gap-3.5 p-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 ring-1 ring-purple-500/20">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                Com Comentário / Feedback
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-purple-600 dark:text-purple-400 font-mono">
                {stats.comFeedback}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-xs hover:border-amber-500/40 transition-all">
          <CardContent className="flex items-center gap-3.5 p-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                Cargas Anotadas
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-500 font-mono">
                {stats.totalCargasAnotadas}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Painel Unificado de Filtros e Busca */}
      <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Busca Textual */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por aluno, nome do treino ou palavras no feedback..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 text-base md:text-sm rounded-xl bg-background/80 border-border/60 focus-visible:ring-primary/20"
            />
          </div>

          {/* Seletores & Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={filterOrigin}
              onValueChange={(v: "all" | "studio" | "pt") => setFilterOrigin(v)}
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
              value={filterPeriod}
              onValueChange={(v: "all" | "today" | "week" | "month") => setFilterPeriod(v)}
            >
              <SelectTrigger className="w-[145px] h-10 text-xs font-semibold rounded-xl bg-background/80 border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Todo Período</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Últimos 7 dias</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={filterOnlyWithFeedback ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterOnlyWithFeedback(!filterOnlyWithFeedback)}
              className={cn(
                "h-10 px-3.5 gap-1.5 text-xs font-semibold rounded-xl active:scale-[0.98] transition-all",
                filterOnlyWithFeedback
                  ? "bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                  : "border-border/60 hover:bg-muted/60"
              )}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Com Feedback</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de Feedbacks e Resultados de Treino */}
      {isLoading ? (
        <Card className="rounded-2xl border border-border/60 p-12 text-center text-sm text-muted-foreground">
          <div className="flex flex-col items-center justify-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <p className="font-semibold text-foreground">Carregando resultados dos treinos...</p>
          </div>
        </Card>
      ) : filteredExecutions.length === 0 ? (
        <Card className="rounded-2xl border border-border/60 bg-card/60 p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground/60 ring-1 ring-border/50">
            <Inbox className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-foreground">Nenhum resultado de treino encontrado</p>
            <p className="text-xs text-muted-foreground max-w-sm">
              Não foram encontradas execuções de treino para os filtros selecionados.
            </p>
          </div>
          {(search || filterPeriod !== "all" || filterOrigin !== "all" || filterOnlyWithFeedback) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setFilterPeriod("all");
                setFilterOrigin("all");
                setFilterOnlyWithFeedback(false);
              }}
              className="mt-1 h-9 px-4 rounded-xl text-xs font-semibold active:scale-[0.98] transition-all"
            >
              Limpar Filtros
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3.5">
          {filteredExecutions.map((item) => {
            const isExpanded = expandedId === item.id;
            const hasLoads = item.loadsCount > 0;
            const relativeTime = item.createdAt
              ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: ptBR })
              : "";
            const exactTime = item.createdAt ? format(new Date(item.createdAt), "dd/MM/yyyy 'às' HH:mm") : "";

            return (
              <Card
                key={item.id}
                className={cn(
                  "rounded-2xl overflow-hidden border border-border/60 bg-card/70 backdrop-blur-md transition-all hover:border-primary/40 shadow-xs",
                  item.feedback && "border-l-[5px] border-l-purple-500"
                )}
              >
                <CardContent className="p-4 sm:p-5 space-y-3.5">
                  {/* Topo do Card: Aluno, Origem, Estrelas e Badges de Desempenho */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Avatar Squircle */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-sm ring-1 ring-primary/20">
                        {initials(item.studentName)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-base text-foreground leading-tight truncate">
                            {item.studentName}
                          </h3>

                          {/* Badge de Origem */}
                          {item.studentOrigin === "studio" ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-semibold gap-1 py-0 px-2 h-5 rounded-full"
                              title="Aluno Studio (treina com planilha / aulas)"
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
                              Personal
                            </Badge>
                          )}

                          {/* Avaliação em Estrelas */}
                          {item.rating && (
                            <div className="flex items-center gap-0.5 text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full ring-1 ring-amber-500/20">
                              {Array.from({ length: item.rating }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-amber-500" />
                              ))}
                            </div>
                          )}
                        </div>

                        <p className="text-xs font-medium text-muted-foreground flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-foreground/90 font-semibold">{item.dayName}</span>
                          <span>•</span>
                          <span>{relativeTime}</span>
                          <span className="text-muted-foreground/60 hidden sm:inline">({exactTime})</span>
                        </p>
                      </div>
                    </div>

                    {/* Duração & Métricas Rápidas */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:self-center">
                      {item.timerSeconds > 0 && (
                        <Badge variant="outline" className="gap-1 text-xs font-mono font-bold rounded-lg h-7 px-2.5 border-border/70">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {Math.floor(item.timerSeconds / 60)}m {item.timerSeconds % 60}s
                        </Badge>
                      )}

                      <Badge variant="secondary" className="gap-1 text-xs font-semibold rounded-lg h-7 px-2.5">
                        <Dumbbell className="h-3 w-3 text-primary" />
                        {item.doneCount} exerc.
                      </Badge>

                      {hasLoads && (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 text-xs font-bold rounded-lg h-7 px-2.5">
                          ⚖️ {item.loadsCount} cargas
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Feedback do Aluno em Destaque */}
                  {item.feedback && (
                    <div className="rounded-xl bg-purple-500/10 border-l-4 border-l-purple-500 p-3.5 text-sm space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Feedback do Aluno
                      </div>
                      <p className="text-sm font-medium italic text-foreground leading-relaxed">
                        "{item.feedback}"
                      </p>
                    </div>
                  )}

                  {/* Detalhes de Cargas (Painel Expansível) */}
                  {isExpanded && hasLoads && (
                    <div className="rounded-xl bg-muted/40 p-4 border border-border/50 space-y-2.5 mt-2 animate-in fade-in-50 duration-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Cargas Registradas na Sessão
                        </h4>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {item.loadsCount} exercícios com peso
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {Object.entries(item.loads).map(([exId, loadVal]) => {
                          const exName = item.exerciseNames[exId] || "Exercício";
                          return (
                            <div
                              key={exId}
                              className="flex items-center justify-between rounded-xl bg-background p-2.5 border border-border/50 text-xs shadow-2xs"
                            >
                              <span className="font-medium text-foreground truncate max-w-[170px]" title={exName}>
                                {exName}
                              </span>
                              <span className="font-bold font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md text-xs">
                                {String(loadVal)} kg
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Rodapé de Ações Estruturado (Sem sobreposição ou corte de botões) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40 text-xs">
                    <div>
                      {hasLoads ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="h-9 px-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium rounded-xl active:scale-[0.98] transition-all"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-3.5 w-3.5" />
                              <span>Ocultar detalhes de cargas</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3.5 w-3.5" />
                              <span>Ver {item.loadsCount} cargas anotadas</span>
                            </>
                          )}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground/70">
                          Sem cargas individuais anotadas nesta sessão.
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {item.studentPhone && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenWhatsApp(item)}
                          className="h-9 px-3.5 gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 rounded-xl shadow-2xs active:scale-[0.98] transition-all"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>Responder no WhatsApp</span>
                        </Button>
                      )}

                      {item.studentId && (
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                          className="h-9 px-3 gap-1.5 text-xs font-bold text-primary hover:bg-primary/10 rounded-xl active:scale-[0.98] transition-all"
                        >
                          <a href={`/personal-trainer/students/${item.studentId}`} title="Ver ficha completa do aluno">
                            <span>Ficha Completa</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
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
