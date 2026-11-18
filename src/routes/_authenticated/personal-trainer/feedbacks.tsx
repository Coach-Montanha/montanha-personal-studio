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
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useScopeFilter } from "@/hooks/use-scope-filter";
import { matchesSearchTerms } from "@/lib/search-utils";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { initials, formatDateBR } from "@/lib/format";

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
  const [filterOnlyWithFeedback, setFilterOnlyWithFeedback] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 1. Carrega todas as execuções de treinos registradas
  const { data: executions = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ["pt-feedbacks-executions", scopeKey],
    enabled: ready,
    queryFn: async () => {
      // 1. Busca execuções com dados do aluno e dia
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
        .limit(100);

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

      // 2. Busca dados complementares de alunos (PT e Studio)
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

      const studentMap = new Map<string, { name: string; phone?: string | null; email?: string | null }>();
      (studioStudentsRes.data || []).forEach((s: any) => {
        if (s?.id) studentMap.set(s.id, { name: s.name, phone: s.phone, email: s.email });
      });
      (ptStudentsRes.data || []).forEach((s: any) => {
        if (s?.id) studentMap.set(s.id, { name: s.name, phone: s.phone, email: s.email });
      });

      const dayMap = new Map<string, { name: string; program_id?: string }>();
      (daysRes.data || []).forEach((d: any) => {
        if (d?.id) dayMap.set(d.id, { name: d.name, program_id: d.program_id });
      });

      // 3. Monta o payload enriquecido
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

        const student = studentMap.get(row.pt_student_id) || { name: "Aluno sem nome", phone: null };
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
          dayId: row.training_day_id,
          dayName: day.name,
          executedAt: row.executed_at,
          createdAt: row.created_at || row.executed_at,
          rating: row.rating,
          feedback: directFeedback,
          timerSeconds,
          loads,
          exerciseNames,
          doneCount: doneExercises.length || Object.keys(loads).length,
          loadsCount: Object.keys(loads).length,
        };
      });
    },
    refetchInterval: 20000, // Atualização automática em tempo real a cada 20s
  });

  // Filtros em memória
  const filteredExecutions = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    return executions.filter((item) => {
      // Filtro de busca
      if (search.trim()) {
        const matches =
          matchesSearchTerms(item.studentName, search) ||
          matchesSearchTerms(item.dayName, search) ||
          (item.feedback && matchesSearchTerms(item.feedback, search));
        if (!matches) return false;
      }

      // Filtro por feedback escrito
      if (filterOnlyWithFeedback && !item.feedback) {
        return false;
      }

      // Filtro por período
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
        return itemMonth === currentMonth;
      }

      return true;
    });
  }, [executions, search, filterPeriod, filterOnlyWithFeedback]);

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

  // Função para abrir conversa com o aluno no WhatsApp
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

    let texto = `Fala ${item.studentName}, tudo bem? 💪🔥%0A%0A`;
    texto += `Vi aqui que você concluiu o treino "${item.dayName}"${duracaoTexto} com ${item.loadsCount} cargas registradas! `;

    if (item.feedback) {
      texto += `%0A%0ASobre o seu feedback: "${item.feedback}"... `;
    }

    texto += `%0A%0AParabéns pela constância e dedicação!`;

    window.open(`https://wa.me/55${cleanPhone}?text=${texto}`, "_blank");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header com Ações */}
      <PageHeader
        title="Feedbacks & Resultados de Treino"
        subtitle="Monitore cada treino concluído, tempo de sessão, cargas anotadas e comentários dos seus alunos em tempo real."
        icon={Dumbbell}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
            Atualizar Feed
          </Button>
        </div>
      </PageHeader>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Treinos Registrados</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">{stats.totalTreinos}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Com Comentário / Feedback</p>
              <p className="text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
                {stats.comFeedback}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Cargas Anotadas</p>
              <p className="text-2xl font-bold tracking-tight text-amber-500">
                {stats.totalCargasAnotadas}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-card p-3 rounded-2xl border border-border/60 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por aluno, nome do treino ou palavras no feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-base md:text-sm bg-background/60"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filterPeriod}
            onValueChange={(v: "all" | "today" | "week" | "month") => setFilterPeriod(v)}
          >
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
            className="h-9 gap-1.5 text-xs font-semibold"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Com Feedback</span>
          </Button>
        </div>
      </div>

      {/* Lista de Feedbacks e Resultados de Treino */}
      {isLoading ? (
        <Card className="p-12 text-center text-sm text-muted-foreground">
          Carregando resultados dos treinos...
        </Card>
      ) : filteredExecutions.length === 0 ? (
        <Card className="p-12 text-center text-sm text-muted-foreground">
          Nenhum resultado de treino encontrado para os filtros selecionados.
        </Card>
      ) : (
        <div className="space-y-3.5">
          {filteredExecutions.map((item) => {
            const isExpanded = expandedId === item.id;
            const hasLoads = item.loadsCount > 0;
            const relativeTime = item.createdAt
              ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: ptBR })
              : "";

            return (
              <Card
                key={item.id}
                className={cn(
                  "overflow-hidden border border-border/70 bg-card transition-all hover:border-primary/50 shadow-xs",
                  item.feedback && "border-l-4 border-l-purple-500",
                )}
              >
                <CardContent className="p-4 sm:p-5 space-y-3">
                  {/* Topo: Aluno, Treino e Tempo */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-sm">
                        {initials(item.studentName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-base text-foreground leading-tight truncate">
                            {item.studentName}
                          </h3>
                          {item.rating && (
                            <div className="flex items-center gap-0.5 text-amber-500">
                              {Array.from({ length: item.rating }).map((_, i) => (
                                <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-medium text-muted-foreground flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className="text-foreground/90 font-semibold">{item.dayName}</span>
                          <span>•</span>
                          <span>{relativeTime}</span>
                        </p>
                      </div>
                    </div>

                    {/* Duração & Métricas Rápidas */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:self-center">
                      {item.timerSeconds > 0 && (
                        <Badge variant="outline" className="gap-1 text-xs font-mono font-bold">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {Math.floor(item.timerSeconds / 60)}m {item.timerSeconds % 60}s
                        </Badge>
                      )}

                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Dumbbell className="h-3 w-3 text-primary" />
                        {item.doneCount} exerc.
                      </Badge>

                      {hasLoads && (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs">
                          {item.loadsCount} cargas
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Feedback Descritivo em Destaque */}
                  {item.feedback && (
                    <div className="rounded-xl bg-purple-500/10 border border-purple-500/25 p-3.5 text-sm space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Feedback do Aluno
                      </div>
                      <p className="text-sm font-medium italic text-foreground leading-relaxed">
                        "{item.feedback}"
                      </p>
                    </div>
                  )}

                  {/* Detalhes de Cargas (Expansível) */}
                  {isExpanded && hasLoads && (
                    <div className="rounded-xl bg-muted/40 p-3.5 border border-border/50 space-y-2 mt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Cargas Registradas na Sessão
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {Object.entries(item.loads).map(([exId, loadVal]) => {
                          const exName = item.exerciseNames[exId] || "Exercício";
                          return (
                            <div
                              key={exId}
                              className="flex items-center justify-between rounded-lg bg-background p-2 border border-border/40 text-xs"
                            >
                              <span className="font-medium text-foreground truncate max-w-[170px]" title={exName}>
                                {exName}
                              </span>
                              <span className="font-bold font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                {String(loadVal)} kg
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Rodapé de Ações */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/40 text-xs">
                    <div>
                      {hasLoads ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground p-0"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-3.5 w-3.5" /> Ocultar cargas
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3.5 w-3.5" /> Ver {item.loadsCount} cargas anotadas
                            </>
                          )}
                        </Button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground/70">
                          Sem cargas individuais anotadas nesta sessão.
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto">
                      {item.studentPhone && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenWhatsApp(item)}
                          className="h-8 gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 font-semibold"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          Responder no WhatsApp
                        </Button>
                      )}

                      {item.studentId && (
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                          className="h-8 gap-1 text-xs text-primary"
                        >
                          <a href={`/personal-trainer/students/${item.studentId}`} title="Ver ficha completa do aluno">
                            <span>Ficha</span>
                            <ArrowRight className="h-3 w-3" />
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
