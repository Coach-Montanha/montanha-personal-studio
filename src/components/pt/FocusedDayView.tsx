import { useMemo, useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ClipboardList,
  Dumbbell,
  History,
  Target,
  ArrowRightLeft,
  TrendingUp,
  Timer,
  EyeOff,
  RotateCcw,
  Activity,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatDateBR } from "@/lib/format";
import { SessionTimer } from "@/components/pt/SessionTimer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WorkoutSummaryDialog } from "@/components/pt/WorkoutSummaryDialog";
import { RestCountdownTimer, parseSafeSeconds } from "@/components/pt/RestCountdownTimer";
import { PlateCalculatorDialog } from "@/components/pt/PlateCalculatorDialog";
import { MuscleHeatmap } from "@/components/pt/MuscleHeatmap";
import { resolveExerciseThumbnail } from "@/lib/thumbnail-utils";

export { resolveExerciseThumbnail };

function parseSetCount(setsReps?: string | null): number {
  if (!setsReps) return 3;
  const match = setsReps.match(/^(\d+)\s*[xX]/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (!isNaN(num) && num > 0 && num <= 10) return num;
  }
  return 3;
}

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

export function FocusedDayView({
  day,
  exercises,
  executions = [],
  allExecutions = [],
  studentName,
  onBack,
  onSaved,
  onOpenProgression,
  studentId,
  userId,
}: {
  day: any;
  exercises: any[];
  executions?: Array<{ id: string; training_day_id: string; executed_at: string; notes: string | null }>;
  allExecutions?: Array<{ id: string; training_day_id?: string; executed_at: string; notes: string | null }>;
  studentName?: string;
  onBack?: () => void;
  onSaved?: () => void;
  onOpenProgression?: (exName: string) => void;
  studentId?: string;
  userId?: string;
}) {
  const [loads, setLoads] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeSubstitutes, setActiveSubstitutes] = useState<Record<string, string>>({});
  const [excludedExerciseIds, setExcludedExerciseIds] = useState<string[]>([]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [lastExecutionId, setLastExecutionId] = useState<string | undefined>(undefined);
  const [completedSets, setCompletedSets] = useState<Record<string, number[]>>({});
  const [heatmapOpen, setHeatmapOpen] = useState(false);
  const [quickMode, setQuickMode] = useState(false);
  const [plateCalcOpen, setPlateCalcOpen] = useState(false);
  const [plateCalcWeight, setPlateCalcWeight] = useState<number | string>(60);
  const [plateCalcExName, setPlateCalcExName] = useState<string>("");
  const [restTimer, setRestTimer] = useState<{
    active: boolean;
    seconds: number;
    exerciseName: string;
    currentSet?: number;
    totalSets?: number;
  }>({
    active: false,
    seconds: 60,
    exerciseName: "",
  });

  const timerStorageKey = `pt_session_timer_${day.id}_${studentId || "default"}`;
  const sessionStateKey = `pt_session_state_${day.id}_${studentId || "default"}`;
  const MAX_SESSION_SECONDS = 3 * 60 * 60; // 3h = 10.800s

  // Recupera timer e progresso de execução caso a tela tenha sido fechada ou recarregada
  useEffect(() => {
    try {
      const rawTimer = localStorage.getItem(timerStorageKey);
      if (rawTimer) {
        const data = JSON.parse(rawTimer);
        if (data && typeof data === "object") {
          let total = Number(data.accumulatedSeconds) || 0;
          if (data.running && data.startedAt) {
            const elapsed = Math.floor((Date.now() - Number(data.startedAt)) / 1000);
            total += Math.max(0, elapsed);
          }
          if (total >= MAX_SESSION_SECONDS) {
            setTimerSeconds(MAX_SESSION_SECONDS);
            setTimerRunning(false);
            localStorage.setItem(
              timerStorageKey,
              JSON.stringify({ accumulatedSeconds: MAX_SESSION_SECONDS, running: false, startedAt: null })
            );
          } else {
            setTimerSeconds(total);
            setTimerRunning(Boolean(data.running));
          }
        }
      }

      const rawState = localStorage.getItem(sessionStateKey);
      if (rawState) {
        const state = JSON.parse(rawState);
        if (state?.loads) setLoads((prev) => ({ ...state.loads, ...prev }));
        if (state?.done) setDone((prev) => ({ ...state.done, ...prev }));
        if (state?.completedSets) setCompletedSets((prev) => ({ ...state.completedSets, ...prev }));
      }
    } catch {
      // ignore
    }
  }, [timerStorageKey, sessionStateKey]);

  // Persiste estado do timer ativo
  useEffect(() => {
    try {
      if (timerRunning) {
        if (timerSeconds >= MAX_SESSION_SECONDS) {
          setTimerSeconds(MAX_SESSION_SECONDS);
          setTimerRunning(false);
          toast.info("Limite de 3 horas atingido. O cronômetro foi pausado automaticamente.");
          localStorage.setItem(
            timerStorageKey,
            JSON.stringify({ accumulatedSeconds: MAX_SESSION_SECONDS, running: false, startedAt: null })
          );
          return;
        }
        const startedAt = Date.now() - timerSeconds * 1000;
        localStorage.setItem(
          timerStorageKey,
          JSON.stringify({ accumulatedSeconds: 0, running: true, startedAt })
        );
      } else if (timerSeconds > 0) {
        localStorage.setItem(
          timerStorageKey,
          JSON.stringify({ accumulatedSeconds: timerSeconds, running: false, startedAt: null })
        );
      }
    } catch {
      // ignore
    }
  }, [timerRunning, timerSeconds, timerStorageKey]);

  // Persiste cargas e séries em andamento para evitar perda por clique acidental ou recarregamento
  useEffect(() => {
    try {
      if (Object.keys(loads).length > 0 || Object.keys(done).length > 0 || Object.keys(completedSets).length > 0) {
        localStorage.setItem(
          sessionStateKey,
          JSON.stringify({ loads, done, completedSets })
        );
      }
    } catch {
      // ignore
    }
  }, [loads, done, completedSets, sessionStateKey]);

  const toggleExcludeFromSession = (exerciseId: string) => {
    setExcludedExerciseIds((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const toggleSet = (ex: any, setNum: number, totalSets: number) => {
    const current = completedSets[ex.id] || [];
    const isAlreadyDone = current.includes(setNum);
    const updated = isAlreadyDone
      ? current.filter((s) => s !== setNum)
      : [...current, setNum].sort((a, b) => a - b);

    setCompletedSets((prev) => ({ ...prev, [ex.id]: updated }));

    if (!isAlreadyDone) {
      setRestTimer({
        active: true,
        seconds: parseSafeSeconds(ex.rest_seconds, 60),
        exerciseName: ex.name,
        currentSet: setNum,
        totalSets,
      });
    }

    if (updated.length === totalSets) {
      setDone((d) => ({ ...d, [ex.id]: true }));
    } else if (isAlreadyDone && done[ex.id]) {
      setDone((d) => ({ ...d, [ex.id]: false }));
    }
  };

  const lastByExercise = useMemo(() => {
    const map: Record<string, { load: string; date: string }> = {};
    for (const exec of executions) {
      const n = parseNotes(exec.notes);
      if (!n.loads) continue;
      for (const [exId, load] of Object.entries(n.loads)) {
        if (!map[exId] && load) map[exId] = { load, date: exec.executed_at };
      }
    }
    return map;
  }, [executions]);

  const candidateExercises = useMemo(
    () => exercises.filter((e) => !e.substitute_exercise_id),
    [exercises]
  );

  const activeExercises = useMemo(() => {
    let list = candidateExercises.filter((e) => !excludedExerciseIds.includes(e.id));
    if (quickMode && list.length > 4) {
      list = list.slice(0, 4);
    }
    return list;
  }, [candidateExercises, excludedExerciseIds, quickMode]);

  const displayExercises = useMemo(() => {
    let list = candidateExercises;
    if (quickMode && list.length > 4) {
      list = list.slice(0, 4);
    }
    return list;
  }, [candidateExercises, quickMode]);

  const plateauByExercise = useMemo(() => {
    const map: Record<string, { count: number; load: string }> = {};
    const relevantExecs = (allExecutions && allExecutions.length > 0 ? allExecutions : executions).slice(0, 4);

    for (const ex of candidateExercises) {
      const historicalLoads: string[] = [];
      for (const exec of relevantExecs) {
        const n = parseNotes(exec.notes);
        if (n.loads && n.loads[ex.id]) {
          historicalLoads.push(String(n.loads[ex.id]).trim().toLowerCase());
        }
      }

      if (historicalLoads.length >= 3) {
        const first = historicalLoads[0];
        const allSame = historicalLoads.slice(0, 3).every((l) => l === first);
        if (allSame && first) {
          map[ex.id] = { count: 3, load: first };
        }
      }
    }
    return map;
  }, [candidateExercises, allExecutions, executions]);

  const totalDone = useMemo(() => {
    return activeExercises.filter((parentEx) => {
      const substitute = exercises.find((s) => s.substitute_exercise_id === parentEx.id);
      const isActiveSub = substitute && activeSubstitutes[parentEx.id] === substitute.id;
      const ex = isActiveSub && substitute ? substitute : parentEx;
      return !!done[ex.id];
    }).length;
  }, [activeExercises, exercises, activeSubstitutes, done]);

  const progress = activeExercises.length > 0 ? Math.round((totalDone / activeExercises.length) * 100) : 0;

  async function handleComplete() {
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userId || userData.user?.id;
      if (!currentUserId) throw new Error("Usuário não autenticado");

      const performedExerciseIds = activeExercises
        .filter((parentEx) => {
          const substitute = exercises.find((s) => s.substitute_exercise_id === parentEx.id);
          const isActiveSub = substitute && activeSubstitutes[parentEx.id] === substitute.id;
          const ex = isActiveSub && substitute ? substitute : parentEx;
          const hasSets = (completedSets[ex.id] || []).length > 0;
          const isDone = !!done[ex.id];
          const hasLoad = !!(loads[ex.id] && loads[ex.id].trim());
          return hasSets || isDone || hasLoad;
        })
        .map((parentEx) => {
          const substitute = exercises.find((s) => s.substitute_exercise_id === parentEx.id);
          const isActiveSub = substitute && activeSubstitutes[parentEx.id] === substitute.id;
          const ex = isActiveSub && substitute ? substitute : parentEx;
          return ex.id;
        });

      const notes: ExecNotes = {
        loads: Object.fromEntries(Object.entries(loads).filter(([, v]) => v && v.trim())),
        doneExercises: performedExerciseIds,
        completedSets,
        timerSeconds,
        excludedExercises: excludedExerciseIds,
      };

      const payload: any = {
        training_day_id: day.id,
        user_id: currentUserId,
        notes: JSON.stringify(notes),
        feedback: feedback.trim() || null,
        executed_at: new Date().toISOString().slice(0, 10),
      };
      if (studentId) {
        payload.pt_student_id = studentId;
      }

      const { data: newExec, error } = await supabase
        .from("pt_training_executions" as any)
        .insert(payload)
        .select("id")
        .single();

      if (error) throw error;

      if (studentId) {
        const { data: studentData } = await supabase
          .from("pt_students")
          .select("user_id, name")
          .eq("id", studentId)
          .maybeSingle();

        if (studentData?.user_id) {
          await supabase.from("pt_notifications" as any).insert({
            user_id: studentData.user_id,
            title: "Novo treino concluído!",
            message: `${studentData.name || "Aluno"} finalizou o treino "${day.name}"`,
            type: "training_complete",
            metadata: {
              student_id: studentId,
              execution_id: (newExec as any)?.id,
              day_name: day.name,
            },
          });
        }
      }

      setLastExecutionId((newExec as any)?.id);
      try {
        localStorage.removeItem(timerStorageKey);
        localStorage.removeItem(sessionStateKey);
      } catch {
        // ignore
      }
      toast.success("Treino concluído com sucesso! 💪");
      setSummaryOpen(true);
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao salvar treino");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Sticky Header com Console do Treino e Cronômetro */}
      <div className="sticky top-0 z-30 -mx-3 sm:-mx-6 px-3 sm:px-6 pt-[calc(0.75rem+var(--safe-area-inset-top,0px))] pb-3 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/85 border-b border-border/80 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {onBack ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="-ml-1.5 h-8 gap-1.5 px-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setQuickMode((q) => {
                  const next = !q;
                  if (next) {
                    toast.info("Modo 30 min ativado: focado nos 4 exercícios essenciais 💪");
                  } else {
                    toast.info("Modo completo restaurado (todos os exercícios visíveis).");
                  }
                  return next;
                });
              }}
              className={cn(
                "h-7 gap-1 px-2.5 text-[11px] font-bold rounded-lg border transition-all active:scale-95",
                quickMode
                  ? "bg-amber-500 text-white border-amber-600 shadow-xs hover:bg-amber-600"
                  : "border-border/80 bg-background text-muted-foreground hover:text-foreground"
              )}
              title="Modo Rápido 30 Minutos (Foca nos 4 exercícios compostos essenciais)"
            >
              <Timer className="h-3.5 w-3.5" />
              <span>{quickMode ? "30 min ativo (4)" : "Sem Tempo?"}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setHeatmapOpen((h) => !h)}
              className={cn(
                "h-7 gap-1 px-2 text-[11px] font-semibold rounded-lg border transition-all",
                heatmapOpen
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary"
              )}
              title="Ver mapa anatômico muscular dos exercícios do dia"
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Mapa Muscular</span>
            </Button>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/20">
              {day.day_label}
            </span>
            <span className="rounded-full bg-muted/80 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground border border-border/60">
              {totalDone}/{activeExercises.length} ({progress}%)
              {excludedExerciseIds.length > 0 && ` · ${excludedExerciseIds.length} pulado${excludedExerciseIds.length > 1 ? "s" : ""}`}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug break-words">
            {day.name}
          </h2>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <SessionTimer
          variant="hero"
          seconds={timerSeconds}
          setSeconds={setTimerSeconds}
          running={timerRunning}
          setRunning={setTimerRunning}
          onReset={() => {
            setTimerSeconds(0);
            setTimerRunning(false);
            try {
              localStorage.removeItem(timerStorageKey);
            } catch {
              // ignore
            }
          }}
        />

        {heatmapOpen && (
          <div className="rounded-2xl border border-primary/25 bg-card/90 p-3 sm:p-4 shadow-sm animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
              <span className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <Activity className="h-4 w-4 text-primary" />
                Mapa Anatômico Muscular da Sessão
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHeatmapOpen(false)}
                className="h-6 text-[11px] px-2 text-muted-foreground hover:text-foreground"
              >
                Recolher
              </Button>
            </div>
            <MuscleHeatmap exercises={activeExercises} />
          </div>
        )}
      </div>

      {day.description && (
        <div className="pt-2">
          <p className="whitespace-pre-wrap rounded-2xl border border-border/70 bg-muted/30 p-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
            {day.description}
          </p>
        </div>
      )}

      {exercises.length === 0 ? (
        <Card className="p-8 text-center rounded-2xl">
          <p className="text-sm text-muted-foreground">Nenhum exercício neste treino ainda.</p>
        </Card>
      ) : (
        <div className="space-y-3.5 pt-1">
          {quickMode && candidateExercises.length > 4 && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 flex items-center justify-between gap-2 text-xs text-amber-700 dark:text-amber-300 animate-in fade-in-50 duration-150">
              <div className="flex items-center gap-2 min-w-0">
                <Timer className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="truncate">
                  <strong>Modo 30 min ativo:</strong> Exibindo os 4 exercícios principais (de {candidateExercises.length}).
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuickMode(false);
                  toast.info("Modo completo restaurado.");
                }}
                className="h-6 text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 px-2 shrink-0"
              >
                Ver todos ({candidateExercises.length})
              </Button>
            </div>
          )}

          {displayExercises.map((parentEx, idx) => {
              const substitute = exercises.find((s) => s.substitute_exercise_id === parentEx.id);
              const isActiveSub = substitute && activeSubstitutes[parentEx.id] === substitute.id;
              const ex = isActiveSub && substitute ? substitute : parentEx;

              const isDone = !!done[ex.id];
              const last = lastByExercise[ex.id];
              const isExcluded = excludedExerciseIds.includes(parentEx.id);
              const totalSetsCount = parseSetCount(ex.sets_reps);

              if (isExcluded) {
                return (
                  <div
                    key={parentEx.id}
                    className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-dashed border-border/80 bg-muted/25 px-4 py-3 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <EyeOff className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-semibold text-muted-foreground line-through block truncate">
                          {ex.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground/80 block">
                          Excluído desta sessão (falta de tempo / equipamento indisponível)
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-semibold gap-1.5 px-3 rounded-xl shrink-0 hover:bg-primary/10 hover:text-primary"
                      onClick={() => toggleExcludeFromSession(parentEx.id)}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restaurar
                    </Button>
                  </div>
                );
              }

              return (
                <div
                  key={ex.id}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border bg-card/95 p-4 sm:p-5 shadow-xs transition-all duration-200",
                    isDone
                      ? "border-emerald-500/40 bg-emerald-500/[0.03] ring-1 ring-emerald-500/20"
                      : "border-border/80 hover:border-primary/40",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => setDone((d) => ({ ...d, [ex.id]: !d[ex.id] }))}
                      aria-label={isDone ? "Marcar como não concluído" : "Marcar como concluído"}
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-200 active:scale-95",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        isDone
                          ? "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/25"
                          : "border-border bg-background hover:border-primary/60 text-transparent hover:text-muted-foreground/30",
                      )}
                    >
                      <Check className={cn("h-5 w-5 transition-transform", isDone ? "scale-100" : "scale-75 opacity-0")} strokeWidth={3} />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] font-bold text-muted-foreground">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <h4
                          className={cn(
                            "text-base sm:text-lg font-bold leading-snug tracking-tight transition-all break-words",
                            isDone && "text-muted-foreground line-through",
                          )}
                        >
                          {ex.name}
                        </h4>
                        {isActiveSub && (
                          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Substituto
                          </span>
                        )}
                        {isDone && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            Concluído
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {ex.series_type === "run" ? (
                          <>
                            {ex.load && (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                                <Target className="h-3.5 w-3.5 shrink-0" />
                                {ex.load}
                              </span>
                            )}
                            {ex.pace && (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                                Pace: {ex.pace}
                              </span>
                            )}
                          </>
                        ) : ex.series_type === "time_inclination" ? (
                          <>
                            {ex.time_seconds && (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                                <Timer className="h-3.5 w-3.5 shrink-0" />
                                {ex.time_seconds}s
                              </span>
                            )}
                            {ex.inclination && (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                                Inclinação: {ex.inclination}
                              </span>
                            )}
                          </>
                        ) : ex.series_type === "cadence" ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                            Cadência: {ex.cadence}
                          </span>
                        ) : (
                          <>
                            {ex.sets_reps && (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                                <Dumbbell className="h-3.5 w-3.5 shrink-0" />
                                {ex.sets_reps}
                              </span>
                            )}
                            {ex.load && (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                                <Target className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                Sugerido: {ex.load}
                              </span>
                            )}
                            {ex.time_seconds && (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                                <Timer className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                {ex.time_seconds}s
                              </span>
                            )}
                          </>
                        )}
                        {ex.rest_seconds && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                            <Timer className="h-3.5 w-3.5 shrink-0" />
                            Descanso: {parseSafeSeconds(ex.rest_seconds, 60)}s
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {substitute && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-8 shrink-0 gap-1 px-2 text-xs font-semibold rounded-lg transition-colors",
                            isActiveSub
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          onClick={() =>
                            setActiveSubstitutes((prev) => ({
                              ...prev,
                              [parentEx.id]: isActiveSub ? "" : substitute.id,
                            }))
                          }
                          title={isActiveSub ? "Voltar ao original" : "Trocar por substituto"}
                        >
                          <ArrowRightLeft className="h-3.5 w-3.5 shrink-0" />
                          <span className="hidden sm:inline">{isActiveSub ? "Original" : "Substituir"}</span>
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 shrink-0 gap-1 px-2 text-xs font-semibold rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={() => toggleExcludeFromSession(parentEx.id)}
                        title="Pular este exercício da sessão"
                      >
                        <EyeOff className="h-3.5 w-3.5 shrink-0" />
                        <span className="hidden sm:inline">Pular</span>
                      </Button>
                    </div>
                  </div>

                  {ex.series_type !== "run" && (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/30 border border-border/60 p-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
                          Séries:
                        </span>
                        {Array.from({ length: totalSetsCount }, (_, i) => i + 1).map((sNum) => {
                          const isSetDone = (completedSets[ex.id] || []).includes(sNum);
                          return (
                            <button
                              key={sNum}
                              type="button"
                              onClick={() => toggleSet(ex, sNum, totalSetsCount)}
                              className={cn(
                                "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all active:scale-95",
                                isSetDone
                                  ? "bg-emerald-500 text-white shadow-xs shadow-emerald-500/25"
                                  : "border border-border/80 bg-background hover:border-primary/60 text-foreground/80",
                              )}
                              title={
                                isSetDone
                                  ? `Série ${sNum} concluída`
                                  : `Concluir série ${sNum} e descansar ${parseSafeSeconds(ex.rest_seconds, 60)}s`
                              }
                            >
                              {isSetDone ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                              <span>S{sNum}</span>
                            </button>
                          );
                        })}
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setRestTimer({
                            active: true,
                            seconds: parseSafeSeconds(ex.rest_seconds, 60),
                            exerciseName: ex.name,
                            totalSets: totalSetsCount,
                          })
                        }
                        className="h-7 text-[11px] font-semibold gap-1 px-2 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 rounded-lg"
                      >
                        <Timer className="h-3.5 w-3.5" />
                        <span>Descansar ({parseSafeSeconds(ex.rest_seconds, 60)}s)</span>
                      </Button>
                    </div>
                  )}

                  {ex.media_url && (
                    <div className="mt-3.5 overflow-hidden rounded-xl border border-border bg-black/5">
                      {ex.media_type === "youtube" ? (
                        <iframe
                          src={ex.media_url}
                          className="aspect-video w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : ex.media_type === "video" || (ex.media_url && ex.media_url.includes(".mp4")) ? (
                        <video
                          src={ex.media_url.includes("#t=") ? ex.media_url : `${ex.media_url}#t=0.001`}
                          poster={resolveExerciseThumbnail(ex.media_url, ex.thumbnail_url) || undefined}
                          preload="metadata"
                          playsInline
                          controls
                          className="max-h-72 sm:max-h-80 w-full object-contain rounded-xl bg-black/40"
                        />
                      ) : (
                        <img
                          src={ex.media_url}
                          alt={ex.name}
                          loading="lazy"
                          className="max-h-72 sm:max-h-80 w-full object-contain rounded-xl bg-black/5"
                        />
                      )}
                    </div>
                  )}

                  <div className="mt-3.5 rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Carga realizada hoje
                      </label>
                      {onOpenProgression && (
                        <button
                          type="button"
                          onClick={() => onOpenProgression(ex.name)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <TrendingUp className="h-3.5 w-3.5" /> Ver evolução
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="ex: 22.5 kg"
                        value={loads[ex.id] ?? ""}
                        onChange={(e) => setLoads((l) => ({ ...l, [ex.id]: e.target.value }))}
                        className="h-11 flex-1 rounded-xl text-sm font-semibold tabular-nums bg-background border-border/80"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const currentVal = loads[ex.id] || ex.load || last?.load || 60;
                          setPlateCalcWeight(currentVal);
                          setPlateCalcExName(ex.name);
                          setPlateCalcOpen(true);
                        }}
                        title="Calculadora visual de anilhas na barra"
                        className="h-11 w-11 shrink-0 rounded-xl border-border/80 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all active:scale-95"
                      >
                        <Dumbbell className="h-4 w-4" />
                      </Button>
                      {last?.load && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setLoads((l) => ({ ...l, [ex.id]: last.load }))}
                          title={`Copiar última carga (${last.load})`}
                          className="h-11 shrink-0 gap-1.5 px-3 rounded-xl border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary font-semibold text-xs transition-all active:scale-95"
                        >
                          <ClipboardList className="h-3.5 w-3.5 shrink-0" />
                          <span className="hidden xs:inline">Usar última</span> ({last.load})
                        </Button>
                      )}
                    </div>

                    {last && (
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <History className="h-3 w-3 shrink-0" />
                        <span>
                          Última carga registrada: <strong className="text-foreground">{last.load}</strong> em {formatDateBR(last.date)}
                        </span>
                      </div>
                    )}

                    {plateauByExercise[ex.id] && (
                      <div className="mt-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                        <Zap className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                        <div className="space-y-0.5">
                          <span className="font-bold">Alerta de Platô ({plateauByExercise[ex.id].load} por 3 sessões):</span>
                          <p className="text-[11px] leading-tight opacity-90">
                            Carga inalterada recentemente. Experimente variar a pegada, usar halteres ou aplicar rest-pause para destravar a evolução.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {ex.observations && (
                    <div className="mt-3 rounded-xl border-l-4 border-primary/70 bg-primary/5 p-3 text-xs leading-relaxed text-foreground/90">
                      <span className="font-bold text-primary block mb-0.5">Orientações do Coach:</span>
                      <span className="whitespace-pre-wrap break-words">{ex.observations}</span>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {exercises.length > 0 && (
        <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-xs space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Feedback do treino (opcional)
          </Label>
          <Textarea
            placeholder="Como foi o treino? Algum desconforto, RPE ou observação para o treinador?"
            className="min-h-[80px] rounded-xl text-sm resize-y"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
      )}

      {activeExercises.length > 0 && (
        <div className="sticky bottom-0 z-20 -mx-3 sm:-mx-6 px-3 sm:px-6 pt-3 pb-[calc(0.875rem+var(--safe-area-inset-bottom,0px))] bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-t border-border/80 shadow-lg">
          <Button
            size="lg"
            onClick={handleComplete}
            disabled={saving}
            className={cn(
              "w-full h-12 gap-2 text-base font-bold rounded-xl shadow-md transition-all active:scale-[0.99]",
              totalDone === activeExercises.length && activeExercises.length > 0
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                : "shadow-primary/20",
            )}
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {saving
              ? "Salvando treino..."
              : totalDone === activeExercises.length
              ? `Finalizar treino completo (${totalDone}/${activeExercises.length})`
              : `Concluir treino (${totalDone}/${activeExercises.length} feitos)`}
          </Button>
        </div>
      )}

      <WorkoutSummaryDialog
        open={summaryOpen}
        onOpenChange={(open) => {
          setSummaryOpen(open);
          if (!open) {
            onSaved?.();
            setLastExecutionId(undefined);
          }
        }}
        dayName={day.name}
        duration={timerSeconds}
        exercises={exercises}
        loads={loads}
        feedback={feedback}
        executionId={lastExecutionId}
        initialExcludedExercises={excludedExerciseIds}
        onExcludedExercisesChange={setExcludedExerciseIds}
        completedSets={completedSets}
        doneExercises={done}
        previousExecutions={allExecutions || executions}
        studentName={studentName}
      />

      <RestCountdownTimer
        active={restTimer.active}
        initialSeconds={restTimer.seconds}
        exerciseName={restTimer.exerciseName}
        currentSet={restTimer.currentSet}
        totalSets={restTimer.totalSets}
        onDismiss={() => setRestTimer((t) => ({ ...t, active: false }))}
        onComplete={() => setRestTimer((t) => ({ ...t, active: false }))}
      />

      <PlateCalculatorDialog
        open={plateCalcOpen}
        onOpenChange={setPlateCalcOpen}
        initialWeight={plateCalcWeight}
        exerciseName={plateCalcExName}
      />
    </div>
  );
}
