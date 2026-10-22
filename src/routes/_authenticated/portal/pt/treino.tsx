import { useMemo, useState } from "react";
import { parseDayMeta, groupDaysByWeek } from "@/lib/training-weeks";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  User,
  Calendar,
  ClipboardList,
  Dumbbell,
  History,
  Target,
  ArrowRightLeft,
  TrendingUp,
  Timer,
  EyeOff,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatDateBR } from "@/lib/format";
import { SessionTimer, formatSeconds } from "@/components/pt/SessionTimer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWakeLock } from "@/hooks/use-wake-lock";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorkoutSummaryDialog } from "@/components/pt/WorkoutSummaryDialog";
import { WorkoutProgressionDialog } from "@/components/pt/WorkoutProgressionDialog";
import { RestCountdownTimer, parseSafeSeconds } from "@/components/pt/RestCountdownTimer";
import { FocusedDayView } from "@/components/pt/FocusedDayView";
import { ClinicalAlertBadge } from "@/components/pt/ClinicalAlertBadge";
import { getStudentAnamnesis, extractClinicalAlerts } from "@/lib/anamnesis";

function parseSetCount(setsReps?: string | null): number {
  if (!setsReps) return 3;
  const match = setsReps.match(/^(\d+)\s*[xX]/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (!isNaN(num) && num > 0 && num <= 10) return num;
  }
  return 3;
}

export const Route = createFileRoute("/_authenticated/portal/pt/treino")({
  head: () => ({ meta: [{ title: "Meu treino — Personal Trainer" }] }),
  component: PTTreinoPage,
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

type ExecNotes = {
  loads?: Record<string, string>;
  doneExercises?: string[];
  timerSeconds?: number;
  excludedExercises?: string[];
  completedSets?: Record<string, number[]>;
};

function parseNotes(raw: unknown): ExecNotes {
  if (!raw || typeof raw !== "string") return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as ExecNotes) : {};
  } catch {
    return {};
  }
}

function isSameDay(iso: string, ref: Date) {
  const d = new Date(iso);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

function PTTreinoPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  // Mantém a tela ligada enquanto o aluno estiver visualizando um treino específico
  useWakeLock(!!selectedDayId);

  const { data: student, isLoading: loadingStudent } = useQuery({
    queryKey: ["pt-portal-treino", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("pt_students")
        .select("id,name,training_plan,user_id")
        .eq("account_user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const { data: programs = [], isLoading: loadingPrograms } = useQuery({
    queryKey: ["pt-portal-programs", student?.id],
    enabled: !!student?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("pt_programs" as never)
        .select("*")
        .eq("pt_student_id", student!.id)
        .order("start_date", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const programIds = programs.map((p) => p.id);
  const { data: days = [] } = useQuery({
    queryKey: ["pt-portal-days", programIds.join(",")],
    enabled: programIds.length > 0,
    queryFn: async () => {
      const { data } = await supabase
        .from("pt_training_days" as never)
        .select("*")
        .in("program_id", programIds)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      return (data ?? []) as any[];
    },
  });

  const dayIds = days.map((d) => d.id);
  const { data: exercises = [] } = useQuery({
    queryKey: ["pt-portal-exercises", dayIds.join(",")],
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
    queryKey: ["pt-portal-executions", student?.id],
    enabled: !!student?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("pt_training_executions" as never)
        .select("id,training_day_id,executed_at,notes")
        .eq("pt_student_id", student!.id)
        .order("executed_at", { ascending: false })
        .limit(200);
      return (data ?? []) as Array<{
        id: string;
        training_day_id: string;
        executed_at: string;
        notes: string | null;
      }>;
    },
  });

  const isLoading = loadingStudent || loadingPrograms;
  const selectedDay = days.find((d) => d.id === selectedDayId) ?? null;
  const [progressionOpen, setProgressionOpen] = useState(false);
  const [selectedProgressEx, setSelectedProgressEx] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const selectedProgram = useMemo(
    () => programs.find((p) => p.id === selectedProgramId) ?? null,
    [programs, selectedProgramId]
  );

  const { data: anamnesis } = useQuery({
    queryKey: ["pt-portal-anamnesis", student?.id],
    enabled: !!student?.id,
    queryFn: () => getStudentAnamnesis(student!.id),
  });
  const clinicalAlerts = useMemo(() => extractClinicalAlerts(anamnesis), [anamnesis]);

  return (
    <div className="space-y-6">
      {clinicalAlerts.length > 0 && (
        <ClinicalAlertBadge
          alerts={clinicalAlerts}
          riskLevel={anamnesis?.risk_level}
        />
      )}

      {!selectedDay && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-title text-foreground">Treino Personal</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Rotinas montadas pelo seu Personal Trainer.
            </p>
          </div>
          {student && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shadow-sm"
              onClick={() => {
                setSelectedProgressEx(null);
                setProgressionOpen(true);
              }}
            >
              <TrendingUp className="h-4 w-4 text-primary" />
              Evolução de Cargas
            </Button>
          )}
        </div>
      )}

      {isLoading ? (
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Carregando…</p>
        </Card>
      ) : programs.length === 0 && !student?.training_plan ? (
        <Card className="p-6">
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <div className="font-semibold">Nenhuma rotina publicada ainda</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Assim que seu Personal Trainer publicar sua rotina, ela aparecerá aqui.
              </p>
            </div>
          </div>
        </Card>
      ) : selectedDay ? (
        <FocusedDayView
          day={selectedDay}
          exercises={exercises.filter((e) => e.training_day_id === selectedDay.id)}
          executions={executions.filter((x) => x.training_day_id === selectedDay.id)}
          allExecutions={executions}
          studentName={student?.name}
          onBack={() => setSelectedDayId(null)}
          onOpenProgression={(exName) => {
            setSelectedProgressEx(exName);
            setProgressionOpen(true);
          }}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["pt-portal-executions", student?.id] });
            setSelectedDayId(null);
          }}
          studentId={student!.id}
          userId={student!.user_id}
        />
      ) : (
        <div className="space-y-3">
          {programs.map((p) => {
            const programDays = days.filter((d) => d.program_id === p.id);
            const doneToday = programDays.some((d) =>
              executions.some(
                (x) => x.training_day_id === d.id && isSameDay(x.executed_at, new Date()),
              ),
            );
            const lastExec = executions.find((x) =>
              programDays.some((d) => d.id === x.training_day_id),
            );

            return (
              <Card
                key={p.id}
                onClick={() => setSelectedProgramId(p.id)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-card p-4 sm:p-5 shadow-xs transition-all duration-200 cursor-pointer",
                  "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md active:translate-y-0",
                  doneToday && "border-emerald-500/30 bg-emerald-500/5",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all",
                        doneToday
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-primary/10 text-primary group-hover:scale-105 group-hover:bg-primary/15",
                      )}
                    >
                      <Dumbbell className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base sm:text-lg font-bold text-foreground leading-tight truncate">
                          {p.name}
                        </h2>
                        {doneToday && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Feito hoje
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                          {formatDateBR(p.start_date)}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-foreground/80">
                          {programDays.length} {programDays.length === 1 ? "treino" : "treinos"}
                        </span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          {CATEGORY_LABELS[p.category] ?? p.category}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {LEVEL_LABELS[p.level] ?? p.level}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:inline-flex gap-1.5 rounded-xl font-semibold text-primary group-hover:bg-primary/10 transition-colors"
                    >
                      <span>Abrir rotina</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                    <div className="sm:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {student?.training_plan && (
            <Card className="p-4 sm:p-5">
              <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Orientações Gerais do Personal
              </h3>
              <pre className="whitespace-pre-wrap break-words font-sans text-xs sm:text-sm leading-relaxed text-foreground">
{student.training_plan}
              </pre>
            </Card>
          )}
        </div>
      )}

      {/* Janela modal para exibição completa da rotina e seleção do treino do dia */}
      <Dialog
        open={!!selectedProgram}
        onOpenChange={(open) => {
          if (!open) setSelectedProgramId(null);
        }}
      >
        <DialogContent className="max-w-lg w-[95vw] sm:w-full max-h-[85vh] overflow-y-auto rounded-2xl p-5 sm:p-6 space-y-4">
          {selectedProgram && (() => {
            const programDays = days.filter((d) => d.program_id === selectedProgram.id);
            return (
              <>
                <DialogHeader className="space-y-1.5 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                      {CATEGORY_LABELS[selectedProgram.category] ?? selectedProgram.category}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                      {LEVEL_LABELS[selectedProgram.level] ?? selectedProgram.level}
                    </span>
                  </div>
                  <DialogTitle className="text-xl font-bold leading-tight text-foreground">
                    {selectedProgram.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>
                      {formatDateBR(selectedProgram.start_date)}
                      {selectedProgram.end_date ? ` — ${formatDateBR(selectedProgram.end_date)}` : ""}
                    </span>
                    <span>•</span>
                    <span>{programDays.length} {programDays.length === 1 ? "sessão" : "sessões"} de treino</span>
                  </DialogDescription>
                </DialogHeader>

                {selectedProgram.goals && (
                  <div className="rounded-xl border border-border bg-muted/40 p-3.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <Target className="h-3.5 w-3.5 text-primary" /> Objetivos do Treino
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                      {selectedProgram.goals}
                    </p>
                  </div>
                )}

                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Selecione o treino de hoje:
                    </h3>
                    <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">
                      {programDays.length} {programDays.length === 1 ? "opção" : "opções"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {groupDaysByWeek(programDays).map(({ weekNumber, days: weekDays }) => (
                      <div
                        key={weekNumber}
                        className="rounded-2xl border border-border/80 bg-muted/20 p-3 sm:p-3.5 space-y-2.5 shadow-xs"
                      >
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-[10px] font-black">
                              {weekNumber}
                            </span>
                            <h4 className="text-xs sm:text-sm font-extrabold tracking-tight text-foreground uppercase">
                              Semana {weekNumber}
                            </h4>
                          </div>
                          <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">
                            {weekDays.length} {weekDays.length === 1 ? "sessão" : "sessões"}
                          </span>
                        </div>

                        <div className="grid gap-2">
                          {weekDays.map((d) => {
                            const count = exercises.filter((e) => e.training_day_id === d.id).length;
                            const doneToday = executions.some(
                              (x) => x.training_day_id === d.id && isSameDay(x.executed_at, new Date()),
                            );
                            const lastExec = executions.find((x) => x.training_day_id === d.id);
                            const meta = parseDayMeta(d, programDays.indexOf(d), programDays.length);

                            return (
                              <button
                                key={d.id}
                                type="button"
                                onClick={() => {
                                  setSelectedProgramId(null);
                                  setSelectedDayId(d.id);
                                }}
                                className={cn(
                                  "group relative flex flex-col gap-2 rounded-xl border p-3.5 sm:p-4 text-left shadow-xs transition-all duration-200",
                                  "hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0",
                                  meta.isWithCoach
                                    ? "border-amber-500/50 bg-gradient-to-r from-amber-500/[0.08] via-amber-500/[0.03] to-card hover:border-amber-500"
                                    : "border-border bg-card hover:border-primary/60",
                                  doneToday && "border-emerald-500/40 bg-emerald-500/10",
                                )}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span
                                      className={cn(
                                        "rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                                        meta.isWithCoach
                                          ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                                          : "bg-primary/10 text-primary",
                                      )}
                                    >
                                      {d.day_label}
                                    </span>

                                    {meta.isWithCoach ? (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide">
                                        <Sparkles className="h-3 w-3 fill-amber-500/30 text-amber-600 dark:text-amber-400" />
                                        Com o Coach
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-muted/80 text-muted-foreground px-2 py-0.5 text-[10px] font-medium">
                                        <User className="h-2.5 w-2.5 opacity-70" />
                                        Treino Sozinho
                                      </span>
                                    )}
                                  </div>

                                  {doneToday ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                      <CheckCircle2 className="h-3 w-3" /> Feito hoje
                                    </span>
                                  ) : lastExec ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                      <History className="h-3 w-3" />
                                      {formatDateBR(lastExec.executed_at)}
                                    </span>
                                  ) : null}
                                </div>

                                <div className="flex items-baseline justify-between gap-2">
                                  <span
                                    className={cn(
                                      "text-sm sm:text-base font-bold leading-tight transition-colors",
                                      meta.isWithCoach
                                        ? "text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400"
                                        : "group-hover:text-primary",
                                    )}
                                  >
                                    {d.name}
                                  </span>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 shrink-0" />
                                </div>

                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="tabular-nums">
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
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {student && (
        <WorkoutProgressionDialog
          open={progressionOpen}
          onOpenChange={setProgressionOpen}
          studentId={student.id}
          initialExerciseName={selectedProgressEx}
        />
      )}
    </div>
  );
}
