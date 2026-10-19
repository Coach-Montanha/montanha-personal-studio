import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CalendarDays,
  ChevronRight,
  Dumbbell,
  History,
  Target,
  Timer,
  CheckCircle2,
} from "lucide-react";
import { formatDateBR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { FocusedDayView } from "@/components/pt/FocusedDayView";
import { formatSeconds } from "@/components/pt/SessionTimer";

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

export function StudentViewDialog({
  open,
  onOpenChange,
  programId,
  initialDayId = null,
  studentId,
  studentName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  programId: string | null;
  initialDayId?: string | null;
  studentId?: string;
  studentName?: string;
}) {
  const [selectedDayId, setSelectedDayId] = useState<string | null>(initialDayId);

  useEffect(() => {
    if (open) {
      setSelectedDayId(initialDayId || null);
    }
  }, [open, initialDayId]);

  const { data: program } = useQuery({
    queryKey: ["pt-program-preview", programId],
    enabled: !!programId && open,
    queryFn: async () => {
      const { data } = await supabase
        .from("pt_programs" as never)
        .select("*")
        .eq("id", programId!)
        .maybeSingle();
      return data as any;
    },
  });

  const { data: days = [] } = useQuery({
    queryKey: ["pt-program-preview-days", programId],
    enabled: !!programId && open,
    queryFn: async () => {
      const { data } = await supabase
        .from("pt_training_days" as never)
        .select("*")
        .eq("program_id", programId!)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      return (data ?? []) as any[];
    },
  });

  const dayIds = days.map((d) => d.id);
  const { data: exercises = [] } = useQuery({
    queryKey: ["pt-program-preview-ex", dayIds.join(",")],
    enabled: dayIds.length > 0 && open,
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
    queryKey: ["pt-program-preview-execs", dayIds.join(","), studentId],
    enabled: dayIds.length > 0 && open,
    queryFn: async () => {
      let query = supabase
        .from("pt_training_executions" as never)
        .select("id, training_day_id, executed_at, notes")
        .in("training_day_id", dayIds)
        .order("executed_at", { ascending: false });

      if (studentId) {
        query = query.eq("pt_student_id", studentId);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-[96vw] max-h-[92vh] overflow-y-auto p-4 sm:p-6 transition-all",
          activeDay ? "max-w-3xl" : "max-w-xl"
        )}
      >
        {!program ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Carregando rotina…
          </div>
        ) : activeDay ? (
          <div className="space-y-4">
            <FocusedDayView
              day={activeDay}
              exercises={activeDayExercises}
              executions={activeDayExecutions}
              allExecutions={executions}
              studentName={studentName}
              onBack={() => setSelectedDayId(null)}
              studentId={studentId}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <DialogHeader className="text-left space-y-1.5">
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
              <DialogTitle className="text-xl font-bold leading-tight">
                {program.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>
                  {formatDateBR(program.start_date)}
                  {program.end_date ? ` — ${formatDateBR(program.end_date)}` : ""}
                </span>
                <span>•</span>
                <span>
                  {days.length} {days.length === 1 ? "sessão" : "sessões"} de treino
                </span>
              </DialogDescription>
            </DialogHeader>

            {program.goals && (
              <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <Target className="h-3.5 w-3.5 text-primary" /> Objetivos da Rotina
                </div>
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                  {program.goals}
                </p>
              </div>
            )}

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Selecione o treino para testar/visualizar:
                </h3>
                <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">
                  {days.length} {days.length === 1 ? "opção" : "opções"}
                </span>
              </div>

              {days.length === 0 ? (
                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Nenhum treino adicionado nesta rotina.
                </div>
              ) : (
                <div className="grid gap-2.5">
                  {days.map((d) => {
                    const count = exercises.filter((e) => e.training_day_id === d.id).length;
                    const dayExecs = executions.filter((x) => x.training_day_id === d.id);
                    const lastExec = dayExecs[0];

                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDayId(d.id)}
                        className={cn(
                          "group relative flex flex-col gap-2 rounded-xl border bg-card p-3.5 sm:p-4 text-left shadow-xs transition-all duration-200",
                          "hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-sm active:translate-y-0"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                            {d.day_label}
                          </span>
                          {lastExec ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              <History className="h-3 w-3" />
                              Último: {formatDateBR(lastExec.executed_at)}
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">
                              Sem execuções
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-sm sm:text-base font-bold leading-tight group-hover:text-primary transition-colors">
                            {d.name}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary shrink-0" />
                        </div>

                        {d.description && (
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {d.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="tabular-nums font-medium">
                            {count} {count === 1 ? "exercício" : "exercícios"}
                          </span>
                          {lastExec?.notes && parseNotes(lastExec.notes).timerSeconds ? (
                            <span className="inline-flex items-center gap-1 text-[11px] opacity-75">
                              <Timer className="h-3 w-3" />
                              {formatSeconds(parseNotes(lastExec.notes).timerSeconds!)}
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
