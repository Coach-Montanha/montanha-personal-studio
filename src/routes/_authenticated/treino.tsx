import { useState, useEffect } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  CalendarDays,
  ChevronRight,
  Dumbbell,
  History,
  Target,
  Timer,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  User,
} from "lucide-react";
import { formatDateBR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { FocusedDayView } from "@/components/pt/FocusedDayView";
import { formatSeconds } from "@/components/pt/SessionTimer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type TreinoSearch = {
  programId?: string;
  dayId?: string;
  studentId?: string;
  studioStudentId?: string;
  studentName?: string;
};

export const Route = createFileRoute("/_authenticated/treino")({
  validateSearch: (search: Record<string, unknown>): TreinoSearch => ({
    programId: typeof search.programId === "string" ? search.programId : undefined,
    dayId: typeof search.dayId === "string" ? search.dayId : undefined,
    studentId: typeof search.studentId === "string" ? search.studentId : undefined,
    studioStudentId: typeof search.studioStudentId === "string" ? search.studioStudentId : undefined,
    studentName: typeof search.studentName === "string" ? search.studentName : undefined,
  }),
  head: () => ({ meta: [{ title: "Execução do Treino — Visão Aluno" }] }),
  beforeLoad: ({ search }) => {
    if (!search?.programId && !search?.dayId) {
      throw redirect({ to: "/portal/pt/treino" });
    }
  },
  component: TreinoAlunoStandalonePage,
});

const CATEGORY_LABELS: Record<string, string> = {
  hypertrophy: "Hipertrofia",
  conditioning: "Condicionamento físico",
  strength: "Força",
  cardio: "Cardio",
  general: "Geral",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

function parseNotes(raw: unknown): { timerSeconds?: number } {
  if (!raw || typeof raw !== "string") return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function TreinoAlunoStandalonePage() {
  const search = Route.useSearch();
  const [selectedDayId, setSelectedDayId] = useState<string | null>(search.dayId || null);

  useEffect(() => {
    if (search.dayId) {
      setSelectedDayId(search.dayId);
    }
  }, [search.dayId]);

  // Se passou apenas dayId, busca o program_id correspondente
  const { data: dayInitialData } = useQuery({
    queryKey: ["pt-day-initial", search.dayId],
    enabled: !!search.dayId && !search.programId,
    queryFn: async () => {
      const { data } = await supabase
        .from("pt_training_days" as never)
        .select("program_id")
        .eq("id", search.dayId!)
        .maybeSingle();
      return data as { program_id?: string } | null;
    },
  });

  const effectiveProgramId = search.programId || dayInitialData?.program_id || null;

  // Carrega nome do aluno se não veio nos search params
  const { data: studentInfo } = useQuery({
    queryKey: ["pt-student-name", search.studentId, search.studioStudentId],
    enabled: (!search.studentName && !!(search.studentId || search.studioStudentId)),
    queryFn: async () => {
      if (search.studentId) {
        const { data } = await supabase
          .from("pt_students")
          .select("name")
          .eq("id", search.studentId)
          .maybeSingle();
        if (data?.name) return data.name;
      }
      if (search.studioStudentId) {
        const { data } = await supabase
          .from("studio_students")
          .select("name")
          .eq("id", search.studioStudentId)
          .maybeSingle();
        if (data?.name) return data.name;
      }
      return null;
    },
  });

  const studentDisplayName = search.studentName || studentInfo || "Aluno";

  const { data: program, isLoading: loadingProgram } = useQuery({
    queryKey: ["pt-standalone-program", effectiveProgramId],
    enabled: !!effectiveProgramId,
    queryFn: async () => {
      const { data } = await supabase
        .from("pt_programs" as never)
        .select("*")
        .eq("id", effectiveProgramId!)
        .maybeSingle();
      return data as any;
    },
  });

  const { data: days = [], isLoading: loadingDays } = useQuery({
    queryKey: ["pt-standalone-days", effectiveProgramId],
    enabled: !!effectiveProgramId,
    queryFn: async () => {
      const { data } = await supabase
        .from("pt_training_days" as never)
        .select("*")
        .eq("program_id", effectiveProgramId!)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      return (data ?? []) as any[];
    },
  });

  const dayIds = days.map((d) => d.id);

  const { data: exercises = [], isLoading: loadingExercises } = useQuery({
    queryKey: ["pt-standalone-ex", dayIds.join(",")],
    enabled: dayIds.length > 0,
    queryFn: async () => {
      const { data } = await supabase
        .from("pt_training_exercises" as never)
        .select("*")
        .in("training_day_id", dayIds)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      return (data ?? []) as any[];
    },
  });

  const { data: executions = [] } = useQuery({
    queryKey: ["pt-standalone-execs", dayIds.join(","), search.studentId],
    enabled: dayIds.length > 0,
    queryFn: async () => {
      let query = supabase
        .from("pt_training_executions" as never)
        .select("id, training_day_id, executed_at, notes")
        .in("training_day_id", dayIds)
        .order("executed_at", { ascending: false });

      if (search.studentId) {
        query = query.eq("pt_student_id", search.studentId);
      }

      const { data } = await query;
      return (data ?? []) as any[];
    },
  });

  const activeDay = selectedDayId ? days.find((d) => d.id === selectedDayId) : null;
  const activeDayExercises = activeDay
    ? exercises.filter((e) => e.training_day_id === activeDay.id)
    : [];
  const activeDayExecutions = activeDay
    ? executions.filter((x) => x.training_day_id === activeDay.id)
    : [];

  const isLoading = loadingProgram || loadingDays || loadingExercises;

  return (
    <div className="min-h-screen bg-background pb-[calc(3rem+var(--safe-area-inset-bottom,0px))]">
      {/* Banner Superior Fixo da Visão do Aluno para o Treinador */}
      <div className="bg-primary/10 border-b border-primary/20 px-4 pt-[calc(0.625rem+var(--safe-area-inset-top,0px))] pb-2.5 text-xs text-foreground flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/40 bg-primary/20 text-primary font-bold px-2 py-0.5 text-[11px]">
            Visão do Aluno
          </Badge>
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-primary" /> {studentDisplayName}
          </span>
          <span className="hidden sm:inline text-muted-foreground">•</span>
          <span className="hidden sm:inline text-muted-foreground text-[11px]">
            Janela Independente (Protegida contra cliques acidentais fora)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {activeDay && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDayId(null)}
              className="h-7 text-xs gap-1 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Outros treinos da rotina
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {isLoading ? (
          <Card className="p-8 text-center text-sm text-muted-foreground animate-pulse">
            Carregando rotina e treinos…
          </Card>
        ) : activeDay ? (
          <div className="space-y-4">
            <FocusedDayView
              day={activeDay}
              exercises={activeDayExercises}
              executions={activeDayExecutions}
              allExecutions={executions}
              studentName={studentDisplayName}
              onBack={() => setSelectedDayId(null)}
              studentId={search.studentId}
            />
          </div>
        ) : program ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                  {CATEGORY_LABELS[program.category] ?? program.category}
                </span>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  {LEVEL_LABELS[program.level] ?? program.level}
                </span>
                {!program.show_to_student && (
                  <span className="rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold">
                    Oculto ao aluno
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {program.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDateBR(program.start_date)}
                  {program.end_date ? ` — ${formatDateBR(program.end_date)}` : ""}
                </span>
                <span>•</span>
                <span>
                  {days.length} {days.length === 1 ? "sessão" : "sessões"} de treino
                </span>
              </div>
            </div>

            {program.goals && (
              <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Target className="h-3.5 w-3.5 text-primary" /> Objetivos da Rotina
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                  {program.goals}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Selecione a sessão para treinar / visualizar:
                </h2>
                <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                  {days.length} {days.length === 1 ? "sessão" : "sessões"}
                </span>
              </div>

              {days.length === 0 ? (
                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  Nenhum treino adicionado nesta rotina.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {days.map((d) => {
                    const count = exercises.filter((e) => e.training_day_id === d.id).length;
                    const dayExecs = executions.filter((x) => x.training_day_id === d.id);
                    const lastExec = dayExecs[0];

                    return (
                      <Card
                        key={d.id}
                        onClick={() => setSelectedDayId(d.id)}
                        className={cn(
                          "group relative flex flex-col justify-between gap-3 p-4 sm:p-5 rounded-2xl border bg-card shadow-xs cursor-pointer transition-all duration-200",
                          "hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md active:translate-y-0"
                        )}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
                              {d.day_label}
                            </span>
                            {lastExec ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                <History className="h-3 w-3" />
                                {formatDateBR(lastExec.executed_at)}
                              </span>
                            ) : (
                              <span className="text-[11px] text-muted-foreground">
                                Sem execuções
                              </span>
                            )}
                          </div>

                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-base sm:text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                              {d.name}
                            </span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary shrink-0" />
                          </div>

                          {d.description && (
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {d.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
                          <span className="tabular-nums font-medium">
                            {count} {count === 1 ? "exercício" : "exercícios"}
                          </span>
                          {lastExec?.notes && parseNotes(lastExec.notes).timerSeconds ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-primary/80 font-mono">
                              <Timer className="h-3 w-3" />
                              {formatSeconds(parseNotes(lastExec.notes).timerSeconds!)}
                            </span>
                          ) : null}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <p className="text-sm text-muted-foreground">Rotina de treino não encontrada.</p>
            <Button variant="outline" size="sm" onClick={() => window.close()}>
              Fechar janela
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
