import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  MoreVertical,
  Plus,
  StickyNote,
  ArrowRightLeft,
  ArrowUpDown,
  Trash2,
  Sun,
  Moon,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useWakeLock } from "@/hooks/use-wake-lock";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  computeSessionMetrics,
  deleteSetLog,
  fetchPreviousSetsForExercises,
  flushOfflineQueue,
  formatDecimalBR,
  formatDurationMMSS,
  formatVolumeKgBR,
  loadLocalRestState,
  loadLocalSessionSnapshot,
  parseDecimalBR,
  parsePlannedSets,
  persistExerciseNote,
  persistSessionProgress,
  persistSetLog,
  saveLocalRestState,
  saveLocalSessionSnapshot,
  type PreviousSetMap,
  type RestState,
  type SetLogRow,
  type SetType,
  type WorkoutSessionRow,
} from "@/lib/workout-session-store";

import {
  computeSessionSummaryData,
  fetchUserExerciseBaselines,
  isSetPersonalRecord,
  type DetectedPRItem,
  type ExerciseHistoricalBaseline,
} from "@/lib/workout-records";
import { HevyWorkoutSummaryDialog } from "@/components/pt/HevyWorkoutSummaryDialog";

interface HevyWorkoutSessionViewProps {
  session: WorkoutSessionRow;
  day: any;
  exercises: any[];
  userId: string;
  studentId?: string;
  studentName?: string;
  onBack: () => void;
  onFinished: () => void;
  onOpenExerciseEvolution?: (exercise: any) => void;
}

const SET_TYPE_OPTIONS: Array<{ value: SetType; label: string; short: string; badgeClass: string }> = [
  { value: "aquecimento", label: "Aquecimento", short: "W", badgeClass: "text-orange-500 font-extrabold" },
  { value: "normal", label: "Normal", short: "1", badgeClass: "text-foreground font-bold" },
  { value: "drop", label: "Drop-set", short: "D", badgeClass: "text-purple-600 font-extrabold" },
  { value: "falha", label: "Até a falha", short: "F", badgeClass: "text-rose-600 font-extrabold" },
];

export function HevyWorkoutSessionView({
  session: initialSession,
  day,
  exercises: initialExercises,
  userId,
  studentId,
  studentName,
  onBack,
  onFinished,
  onOpenExerciseEvolution,
}: HevyWorkoutSessionViewProps) {
  const [session, setSession] = useState<WorkoutSessionRow>(initialSession);
  const [orderedExercises, setOrderedExercises] = useState<any[]>(initialExercises);
  const [sets, setSets] = useState<SetLogRow[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [previousMap, setPreviousMap] = useState<PreviousSetMap>({});
  const [focusOpen, setFocusOpen] = useState(false);
  const [wakeLockEnabled, setWakeLockEnabled] = useState(true);
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );

  // Cronômetro baseado em started_at (nunca em contador em memória)
  const [nowMs, setNowMs] = useState(() => Date.now());

  // Descanso automático baseado em restEndsAt
  const [restState, setRestState] = useState<RestState | null>(() =>
    loadLocalRestState(initialSession.id)
  );
  const [restRemaining, setRestRemaining] = useState(0);

  // Modais leves de UX (Tipo de série, Nota, Substituir)
  const [setTypePickerTarget, setSetTypePickerTarget] = useState<SetLogRow | null>(null);
  const [noteModalEx, setNoteModalEx] = useState<any | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [completing, setCompleting] = useState(false);

  // Etapa 2: Baselines de PR + diálogo de confirmação + resumo do treino
  const [baselines, setBaselines] = useState<Record<string, ExerciseHistoricalBaseline>>({});
  const [lastSameDayVolumeKg, setLastSameDayVolumeKg] = useState<number | null>(null);
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryPayload, setSummaryPayload] = useState<{
    finishedAtIso: string;
    durationSeconds: number;
    totalVolumeKg: number;
    completedSetsCount: number;
    prs: DetectedPRItem[];
    bestSets: Array<{ exerciseId: string; exerciseName: string; weightKg: number; reps: number }>;
  } | null>(null);

  // Swipe left para remover série
  const touchStartXRef = useRef<Record<string, number>>({});

  useWakeLock(wakeLockEnabled);

  // Atualiza lista de exercícios se prop mudar
  useEffect(() => {
    setOrderedExercises((prev) => (prev.length > 0 ? prev : initialExercises));
  }, [initialExercises]);

  // Monitor de conectividade + flush automático da fila offline
  useEffect(() => {
    const onOnline = async () => {
      setIsOffline(false);
      await flushOfflineQueue(userId);
    };
    const onOffline = () => setIsOffline(true);
    const onVisible = async () => {
      if (document.visibilityState === "visible") {
        setNowMs(Date.now());
        if (navigator.onLine) {
          await flushOfflineQueue(userId);
        }
      }
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [userId]);

  // Carrega séries e notas (priorizando snapshot local mais recente + sincronização do Supabase)
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const local = loadLocalSessionSnapshot(initialSession.id);
      if (local && !cancelled) {
        setSession(local.session);
        setSets(local.sets);
        setNotes(local.notes || {});
      }

      // Flush de pendências antes de puxar do servidor
      await flushOfflineQueue(userId);

      const [{ data: dbSets }, { data: dbNotes }, prevData, baselineData] = await Promise.all([
        supabase
          .from("set_logs" as never)
          .select("*")
          .eq("session_id", initialSession.id)
          .order("set_order", { ascending: true }),
        supabase
          .from("session_exercise_notes" as never)
          .select("exercise_id, note")
          .eq("session_id", initialSession.id),
        fetchPreviousSetsForExercises(
          userId,
          initialExercises.map((e) => e.id),
          initialSession.id
        ),
        fetchUserExerciseBaselines(userId, day.id, initialSession.id),
      ]);

      if (cancelled) return;
      setPreviousMap(prevData);
      setBaselines(baselineData.baselines);
      setLastSameDayVolumeKg(baselineData.lastSameDayVolumeKg);

      const remoteSets = (dbSets || []) as SetLogRow[];
      if (remoteSets.length > 0 && (!local || local.sets.length === 0)) {
        const hydrated = remoteSets.map((s) => ({
          ...s,
          weight_kg: s.weight_kg !== null ? Number(s.weight_kg) : null,
          reps: s.reps !== null ? Number(s.reps) : null,
          weightInput: s.weight_kg !== null ? formatDecimalBR(Number(s.weight_kg)) : "",
          repsInput: s.reps !== null ? String(s.reps) : "",
        }));
        setSets(hydrated);
      } else if (remoteSets.length === 0 && (!local || local.sets.length === 0)) {
        // Fallback: gera séries da prescrição caso ainda não existam
        const generated: SetLogRow[] = [];
        for (const ex of initialExercises) {
          const planned = parsePlannedSets(ex.sets_reps, ex.load);
          for (const item of planned) {
            generated.push({
              id: crypto.randomUUID(),
              session_id: initialSession.id,
              exercise_id: ex.id,
              set_order: item.setOrder,
              set_type: "normal",
              weight_kg: null,
              reps: null,
              completed: false,
              completed_at: null,
              weightInput: "",
              repsInput: "",
            });
          }
        }
        setSets(generated);
      }

      if (dbNotes && Array.isArray(dbNotes) && dbNotes.length > 0) {
        const noteMap: Record<string, string> = {};
        for (const row of dbNotes as Array<{ exercise_id: string; note: string }>) {
          noteMap[row.exercise_id] = row.note;
        }
        setNotes((prev) => ({ ...noteMap, ...prev }));
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [initialSession.id, userId, initialExercises]);

  // Tick de 1s para duração baseada em started_at
  useEffect(() => {
    if (!session.started_at) return;
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, [session.started_at]);

  // Tick de descanso automático ancorado em restState.endsAt
  useEffect(() => {
    if (!restState?.active) {
      setRestRemaining(0);
      return;
    }

    const updateRest = () => {
      const diff = Math.max(0, Math.ceil((restState.endsAt - Date.now()) / 1000));
      setRestRemaining(diff);
      if (diff <= 0) {
        if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
          navigator.vibrate([220, 100, 220]);
        }
        setRestState(null);
        saveLocalRestState(session.id, null);
      }
    };

    updateRest();
    const id = setInterval(updateRest, 250);
    return () => clearInterval(id);
  }, [restState, session.id]);

  // Persistência contínua do snapshot local sempre que houver mudança
  useEffect(() => {
    if (sets.length === 0) return;
    const metrics = computeSessionMetrics(sets);
    saveLocalSessionSnapshot({
      session: {
        ...session,
        total_volume_kg: metrics.totalVolumeKg,
      },
      sets,
      notes,
      updatedAt: Date.now(),
    });
  }, [session, sets, notes]);

  const metrics = useMemo(() => computeSessionMetrics(sets), [sets]);

  const durationSeconds = useMemo(() => {
    if (!session.started_at) return 0;
    const startMs = new Date(session.started_at).getTime();
    return Math.max(0, Math.floor((nowMs - startMs) / 1000));
  }, [session.started_at, nowMs]);

  const progressPct =
    metrics.totalNonWarmup > 0
      ? Math.min(100, Math.round((metrics.completedNonWarmup / metrics.totalNonWarmup) * 100))
      : 0;

  const dayNumberMatch = String(day?.day_label || day?.name || "1").match(/\d+/);
  const dayHeaderLabel = dayNumberMatch ? `DIA ${dayNumberMatch[0]} · EM ANDAMENTO` : "TREINO · EM ANDAMENTO";

  // Helper para obter placeholder de uma série
  const getPlaceholders = (ex: any, setRow: SetLogRow) => {
    const prev = previousMap[`${ex.id}::${setRow.set_order}`];
    const plannedList = parsePlannedSets(ex.sets_reps, ex.load);
    const planned = plannedList[setRow.set_order - 1] ?? plannedList[0];
    return {
      weight:
        prev?.weight_kg !== null && prev?.weight_kg !== undefined
          ? formatDecimalBR(prev.weight_kg)
          : planned?.plannedWeight || "0",
      reps:
        prev?.reps !== null && prev?.reps !== undefined
          ? String(prev.reps)
          : planned?.plannedReps || "10",
    };
  };

  // Inicia o cronômetro automaticamente ao marcar a primeira série
  const ensureSessionStarted = (currentSession: WorkoutSessionRow): WorkoutSessionRow => {
    if (currentSession.started_at) return currentSession;
    const updated: WorkoutSessionRow = {
      ...currentSession,
      started_at: new Date().toISOString(),
    };
    setSession(updated);
    persistSessionProgress(userId, updated);
    return updated;
  };

  const handleFieldChange = (setId: string, field: "weightInput" | "repsInput", value: string) => {
    setSets((prev) =>
      prev.map((s) => {
        if (s.id !== setId) return s;
        const next: SetLogRow = { ...s, [field]: value };
        if (field === "weightInput") {
          next.weight_kg = parseDecimalBR(value);
        } else {
          const parsedReps = parseInt(value.replace(/\D/g, ""), 10);
          next.reps = Number.isFinite(parsedReps) ? parsedReps : null;
        }
        if (next.completed) {
          persistSetLog(userId, next);
        }
        return next;
      })
    );
  };

  const handleCopyPrevious = (ex: any, setRow: SetLogRow) => {
    const prev = previousMap[`${ex.id}::${setRow.set_order}`];
    if (!prev) return;
    const wStr = prev.weight_kg !== null ? formatDecimalBR(prev.weight_kg) : "";
    const rStr = prev.reps !== null ? String(prev.reps) : "";
    setSets((prevSets) =>
      prevSets.map((s) =>
        s.id === setRow.id
          ? {
              ...s,
              weightInput: wStr,
              repsInput: rStr,
              weight_kg: prev.weight_kg,
              reps: prev.reps,
            }
          : s
      )
    );
    toast.success("Carga e repetições anteriores copiadas");
  };

  const handleToggleComplete = (ex: any, setRow: SetLogRow) => {
    const nextCompleted = !setRow.completed;
    const placeholders = getPlaceholders(ex, setRow);

    const resolvedWeightInput =
      setRow.weightInput && setRow.weightInput.trim() !== ""
        ? setRow.weightInput
        : placeholders.weight;
    const resolvedRepsInput =
      setRow.repsInput && setRow.repsInput.trim() !== ""
        ? setRow.repsInput
        : placeholders.reps;

    const resolvedWeight = parseDecimalBR(resolvedWeightInput);
    const resolvedReps = parseInt(resolvedRepsInput.replace(/\D/g, ""), 10) || 0;

    const updatedSet: SetLogRow = {
      ...setRow,
      weightInput: resolvedWeightInput,
      repsInput: resolvedRepsInput,
      weight_kg: resolvedWeight,
      reps: resolvedReps,
      completed: nextCompleted,
      completed_at: nextCompleted ? new Date().toISOString() : null,
    };

    const nextSets = sets.map((s) => (s.id === setRow.id ? updatedSet : s));
    setSets(nextSets);

    // Inicia cronômetro se for a primeira série marcada
    const activeSession = nextCompleted ? ensureSessionStarted(session) : session;
    const nextMetrics = computeSessionMetrics(nextSets);

    persistSetLog(userId, updatedSet);
    persistSessionProgress(userId, {
      ...activeSession,
      total_volume_kg: nextMetrics.totalVolumeKg,
      duration_seconds: activeSession.started_at
        ? Math.max(0, Math.floor((Date.now() - new Date(activeSession.started_at).getTime()) / 1000))
        : 0,
    });

    // Inicia descanso automático ao marcar ✓
    if (nextCompleted) {
      const restSec = Number(ex.rest_seconds) > 0 ? Number(ex.rest_seconds) : 60;
      const nextRest: RestState = {
        active: true,
        endsAt: Date.now() + restSec * 1000,
        totalSeconds: restSec,
        exerciseName: ex.name,
      };
      setRestState(nextRest);
      saveLocalRestState(session.id, nextRest);
    }
  };

  const handleChangeSetType = (setRow: SetLogRow, newType: SetType) => {
    const updated = { ...setRow, set_type: newType };
    setSets((prev) => prev.map((s) => (s.id === setRow.id ? updated : s)));
    setSetTypePickerTarget(null);
    persistSetLog(userId, updated);
  };

  const handleAddSet = (ex: any) => {
    const exSets = sets.filter((s) => s.exercise_id === ex.id);
    const lastSet = exSets[exSets.length - 1];
    const nextOrder = exSets.length + 1;
    const newSet: SetLogRow = {
      id: crypto.randomUUID(),
      session_id: session.id,
      exercise_id: ex.id,
      set_order: nextOrder,
      set_type: "normal",
      weight_kg: lastSet?.weight_kg ?? null,
      reps: lastSet?.reps ?? null,
      completed: false,
      completed_at: null,
      weightInput: lastSet?.weightInput ?? "",
      repsInput: lastSet?.repsInput ?? "",
    };
    setSets((prev) => [...prev, newSet]);
    persistSetLog(userId, newSet);
  };

  const handleRemoveSet = (setRow: SetLogRow) => {
    const exSets = sets.filter((s) => s.exercise_id === setRow.exercise_id);
    if (exSets.length <= 1) {
      toast.info("Mantenha pelo menos 1 série no exercício.");
      return;
    }
    const remaining = sets
      .filter((s) => s.id !== setRow.id)
      .map((s) => {
        if (s.exercise_id !== setRow.exercise_id || s.set_order < setRow.set_order) return s;
        const reordered = { ...s, set_order: s.set_order - 1 };
        persistSetLog(userId, reordered);
        return reordered;
      });
    setSets(remaining);
    deleteSetLog(userId, setRow.id, session.id);
    toast.success("Série removida");
  };

  const handleAdjustRest = (deltaSeconds: number) => {
    if (!restState) return;
    const nextEndsAt = Math.max(Date.now() + 1000, restState.endsAt + deltaSeconds * 1000);
    const nextTotal = Math.max(restState.totalSeconds, Math.ceil((nextEndsAt - Date.now()) / 1000));
    const nextRest: RestState = {
      ...restState,
      endsAt: nextEndsAt,
      totalSeconds: nextTotal,
    };
    setRestState(nextRest);
    saveLocalRestState(session.id, nextRest);
  };

  const handleSkipRest = () => {
    setRestState(null);
    saveLocalRestState(session.id, null);
  };

  const handleMoveExercise = (exId: string, direction: -1 | 1) => {
    setOrderedExercises((prev) => {
      const idx = prev.findIndex((e) => e.id === exId);
      const target = idx + direction;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(target, 0, item);
      return copy;
    });
  };

  const handleSaveNote = async () => {
    if (!noteModalEx) return;
    const clean = noteDraft.trim();
    setNotes((prev) => ({ ...prev, [noteModalEx.id]: clean }));
    await persistExerciseNote(userId, session.id, noteModalEx.id, clean);
    setNoteModalEx(null);
    toast.success("Nota salva");
  };

  const handleRequestFinish = () => {
    const hasUncompleted = sets.some((s) => !s.completed);
    if (hasUncompleted) {
      setDiscardDialogOpen(true);
      return;
    }
    handleFinishSession();
  };

  const handleFinishSession = async () => {
    if (completing) return;
    setDiscardDialogOpen(false);
    setCompleting(true);
    try {
      const finishedAt = new Date().toISOString();
      const finalDuration = session.started_at
        ? Math.max(0, Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000))
        : 0;
      const completedSetsOnly = sets.filter((s) => s.completed);
      const finalMetrics = computeSessionMetrics(completedSetsOnly);

      const finalSession: WorkoutSessionRow = {
        ...session,
        started_at: session.started_at || finishedAt,
        finished_at: finishedAt,
        duration_seconds: finalDuration,
        total_volume_kg: finalMetrics.totalVolumeKg,
        status: "concluido",
      };

      setSession(finalSession);
      saveLocalSessionSnapshot({
        session: finalSession,
        sets: completedSetsOnly,
        notes,
        updatedAt: Date.now(),
      });
      saveLocalRestState(session.id, null);

      await persistSessionProgress(userId, finalSession);
      await flushOfflineQueue(userId);

      // Mantém compatibilidade com histórico legado (pt_training_executions) sem apagar nada
      if (studentId) {
        const loadsMap: Record<string, string> = {};
        const completedMap: Record<string, number[]> = {};
        for (const s of completedSetsOnly) {
          if (s.set_type === "aquecimento") continue;
          loadsMap[s.exercise_id] = s.weightInput || formatDecimalBR(s.weight_kg);
          completedMap[s.exercise_id] = [...(completedMap[s.exercise_id] || []), s.set_order];
        }
        await supabase.from("pt_training_executions" as never).insert({
          pt_student_id: studentId,
          training_day_id: day.id,
          user_id: userId,
          executed_at: finishedAt,
          notes: JSON.stringify({
            loads: loadsMap,
            completedSets: completedMap,
            timerSeconds: finalDuration,
            totalVolumeKg: finalMetrics.totalVolumeKg,
            workoutSessionId: session.id,
          }),
        } as never);
      }

      const summary = computeSessionSummaryData({
        sets: completedSetsOnly,
        exercises: orderedExercises,
        baselines,
      });

      setSummaryPayload({
        finishedAtIso: finishedAt,
        durationSeconds: finalDuration,
        totalVolumeKg: finalMetrics.totalVolumeKg,
        completedSetsCount: finalMetrics.completedNonWarmup,
        prs: summary.prs,
        bestSets: summary.bestSets,
      });
      setSummaryOpen(true);
    } catch {
      toast.error("Não foi possível finalizar agora, mas seus dados estão salvos localmente.");
    } finally {
      setCompleting(false);
    }
  };

  // Numeração de séries normais/drop/falha por exercício (aquecimento usa "W")
  const getSetDisplayBadge = (exSets: SetLogRow[], setRow: SetLogRow) => {
    if (setRow.set_type === "aquecimento") {
      return { text: "W", cls: "text-orange-500 font-extrabold" };
    }
    if (setRow.set_type === "drop") {
      return { text: "D", cls: "text-purple-600 font-extrabold" };
    }
    if (setRow.set_type === "falha") {
      return { text: "F", cls: "text-rose-600 font-extrabold" };
    }
    const nonWarmupIndex =
      exSets.filter((s) => s.set_type !== "aquecimento" && s.set_order <= setRow.set_order).length;
    return { text: String(nonWarmupIndex), cls: "text-foreground font-bold" };
  };

  const restPct =
    restState && restState.totalSeconds > 0
      ? Math.min(100, Math.max(0, (restRemaining / restState.totalSeconds) * 100))
      : 0;

  return (
    <div className="min-h-screen bg-muted/20 pb-28">
      {/* 1.2 Cabeçalho Fixo e Compacto */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-3.5 pt-3 pb-2.5 space-y-2.5">
          {/* Linha 1: Voltar · Rótulo · Nome · Concluir */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-foreground hover:bg-muted transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                <span>{dayHeaderLabel}</span>
                {isOffline && (
                  <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] text-amber-600">
                    <WifiOff className="h-2.5 w-2.5" /> Offline
                  </span>
                )}
              </div>
              <h1 className="truncate text-sm sm:text-base font-extrabold text-foreground leading-tight">
                {day?.name || "Treino"}
              </h1>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setWakeLockEnabled((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground"
                title={wakeLockEnabled ? "Tela mantida acesa (toque para desligar)" : "Manter tela acesa"}
              >
                {wakeLockEnabled ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
              </button>

              <Button
                size="sm"
                onClick={handleRequestFinish}
                disabled={completing}
                className="h-9 rounded-xl px-4 font-bold shadow-xs"
              >
                {completing ? "Salvando..." : "Concluir"}
              </Button>
            </div>
          </div>

          {/* Linha 2: 3 Indicadores — Duração, Volume, Séries */}
          <div className="grid grid-cols-3 gap-2 pt-0.5">
            <div>
              <span className="block text-[10px] font-medium text-muted-foreground">Duração</span>
              <span className="text-sm sm:text-base font-extrabold tabular-nums text-primary">
                {formatDurationMMSS(durationSeconds)}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-medium text-muted-foreground">Volume</span>
              <span className="text-sm sm:text-base font-extrabold tabular-nums text-foreground">
                {formatVolumeKgBR(metrics.totalVolumeKg)}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-medium text-muted-foreground">Séries</span>
              <span className="text-sm sm:text-base font-extrabold tabular-nums text-foreground">
                {metrics.completedNonWarmup} / {metrics.totalNonWarmup}
              </span>
            </div>
          </div>

          {/* Linha 3: Barra de progresso fina */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Foco do treino recolhível (fechado por padrão) */}
          {day?.description && (
            <div>
              <button
                type="button"
                onClick={() => setFocusOpen((o) => !o)}
                className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
              >
                {focusOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                Foco do treino
              </button>
              {focusOpen && (
                <p className="mt-1 rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground">
                  {day.description}
                </p>
              )}
            </div>
          )}
        </div>
      </header>

      {/* 1.3 Lista de Cards de Exercício */}
      <main className="mx-auto max-w-2xl space-y-3.5 px-3 py-4">
        {orderedExercises.map((ex, exIndex) => {
          const exSets = sets
            .filter((s) => s.exercise_id === ex.id)
            .sort((a, b) => a.set_order - b.set_order);
          const restSec = Number(ex.rest_seconds) > 0 ? Number(ex.rest_seconds) : 60;
          const noteText = notes[ex.id] || ex.observations || "";

          return (
            <section
              key={ex.id}
              className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-xs space-y-3"
            >
              {/* Cabeçalho do Card */}
              <div className="flex items-start justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenExerciseEvolution?.(ex)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm sm:text-base font-bold text-primary leading-tight">
                      {ex.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {ex.sets_reps || "3×10"} · Descanso {restSec}s
                    </p>
                  </div>
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Opções do exercício"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => {
                        setNoteDraft(notes[ex.id] || "");
                        setNoteModalEx(ex);
                      }}
                    >
                      <StickyNote className="mr-2 h-4 w-4" /> Adicionar nota
                    </DropdownMenuItem>
                    {exIndex > 0 && (
                      <DropdownMenuItem onClick={() => handleMoveExercise(ex.id, -1)}>
                        <ArrowUpDown className="mr-2 h-4 w-4" /> Mover para cima
                      </DropdownMenuItem>
                    )}
                    {exIndex < orderedExercises.length - 1 && (
                      <DropdownMenuItem onClick={() => handleMoveExercise(ex.id, 1)}>
                        <ArrowUpDown className="mr-2 h-4 w-4" /> Mover para baixo
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() =>
                        toast.info("Substituição rápida disponível nas opções do personal.")
                      }
                    >
                      <ArrowRightLeft className="mr-2 h-4 w-4" /> Substituir exercício
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() =>
                        setOrderedExercises((prev) => prev.filter((item) => item.id !== ex.id))
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Nota do exercício em faixa cinza */}
              {noteText && (
                <div className="rounded-lg bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
                  {noteText}
                </div>
              )}

              {/* Tabela SÉRIE | ANTERIOR | KG | REPS | ✓ */}
              <div className="space-y-1.5">
                <div className="grid grid-cols-[42px_1fr_68px_64px_42px] items-center gap-1.5 px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span className="text-center">Série</span>
                  <span>Anterior</span>
                  <span className="text-center">Kg</span>
                  <span className="text-center">Reps</span>
                  <span className="text-center">✓</span>
                </div>

                {exSets.map((setRow) => {
                  const badge = getSetDisplayBadge(exSets, setRow);
                  const prev = previousMap[`${ex.id}::${setRow.set_order}`];
                  const prevLabel =
                    prev && (prev.weight_kg !== null || prev.reps !== null)
                      ? `${prev.weight_kg !== null ? formatDecimalBR(prev.weight_kg) : "0"} kg × ${prev.reps ?? "0"}`
                      : "—";
                  const placeholders = getPlaceholders(ex, setRow);
                  const hitPR = isSetPersonalRecord(setRow, baselines[ex.id]);

                  return (
                    <div
                      key={setRow.id}
                      onTouchStart={(e) => {
                        touchStartXRef.current[setRow.id] = e.touches[0].clientX;
                      }}
                      onTouchEnd={(e) => {
                        const startX = touchStartXRef.current[setRow.id];
                        if (startX !== undefined) {
                          const delta = startX - e.changedTouches[0].clientX;
                          if (delta > 80) {
                            handleRemoveSet(setRow);
                          }
                          delete touchStartXRef.current[setRow.id];
                        }
                      }}
                      className={cn(
                        "grid grid-cols-[42px_1fr_68px_64px_42px] items-center gap-1.5 rounded-xl px-1 py-1.5 transition-colors",
                        setRow.completed ? "bg-emerald-500/12" : "bg-transparent"
                      )}
                    >
                      {/* Coluna SÉRIE */}
                      <button
                        type="button"
                        onClick={() => setSetTypePickerTarget(setRow)}
                        className={cn(
                          "flex h-9 w-9 mx-auto items-center justify-center rounded-lg bg-muted/60 text-xs hover:bg-muted transition-colors",
                          badge.cls
                        )}
                        title="Toque para mudar o tipo da série"
                      >
                        {badge.text}
                      </button>

                      {/* Coluna ANTERIOR + Selo PR laranja */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleCopyPrevious(ex, setRow)}
                          disabled={!prev}
                          className="truncate text-left text-xs font-medium text-muted-foreground hover:text-foreground disabled:pointer-events-none"
                        >
                          {prevLabel}
                        </button>
                        {hitPR && (
                          <span className="shrink-0 rounded bg-orange-500/15 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-orange-600">
                            PR
                          </span>
                        )}
                      </div>

                      {/* Coluna KG */}
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={setRow.weightInput ?? ""}
                        onChange={(e) => handleFieldChange(setRow.id, "weightInput", e.target.value)}
                        placeholder={placeholders.weight}
                        className="h-9 px-1.5 text-center text-base sm:text-sm font-bold tabular-nums bg-background/80"
                      />

                      {/* Coluna REPS */}
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={setRow.repsInput ?? ""}
                        onChange={(e) => handleFieldChange(setRow.id, "repsInput", e.target.value)}
                        placeholder={placeholders.reps}
                        className="h-9 px-1.5 text-center text-base sm:text-sm font-bold tabular-nums bg-background/80"
                      />

                      {/* Coluna ✓ */}
                      <button
                        type="button"
                        onClick={() => handleToggleComplete(ex, setRow)}
                        aria-label="Concluir série"
                        className={cn(
                          "flex h-9 w-9 mx-auto items-center justify-center rounded-xl transition-all active:scale-95",
                          setRow.completed
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-muted/70 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <Check className="h-4 w-4 stroke-[2.5]" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Botão + Adicionar série */}
              <button
                type="button"
                onClick={() => handleAddSet(ex)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-muted/50 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Adicionar série
              </button>
            </section>
          );
        })}
      </main>

      {/* 1.4 Barra Escura Flutuante de Descanso */}
      {restState?.active && (
        <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100vw-1.5rem)] max-w-lg -translate-x-1/2">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 text-white shadow-2xl">
            <div className="flex items-center justify-between gap-2 px-4 py-3">
              <div className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Descanso
                </span>
                <span className="text-xl font-extrabold tabular-nums text-white">
                  {Math.floor(restRemaining / 60)}:{String(restRemaining % 60).padStart(2, "0")}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleAdjustRest(-15)}
                  className="h-9 rounded-xl bg-zinc-800 px-3 text-xs font-bold text-zinc-100 hover:bg-zinc-700 active:scale-95"
                >
                  −15
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustRest(15)}
                  className="h-9 rounded-xl bg-zinc-800 px-3 text-xs font-bold text-zinc-100 hover:bg-zinc-700 active:scale-95"
                >
                  +15
                </button>
                <button
                  type="button"
                  onClick={handleSkipRest}
                  className="h-9 rounded-xl bg-amber-500 px-3.5 text-xs font-extrabold text-zinc-950 hover:bg-amber-400 active:scale-95"
                >
                  Pular
                </button>
              </div>
            </div>

            <div className="h-1.5 w-full bg-zinc-800">
              <div
                className="h-full bg-amber-500 transition-all duration-200"
                style={{ width: `${restPct}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Picker do Tipo de Série (Aquecimento, Normal, Drop, Falha) */}
      <Dialog
        open={!!setTypePickerTarget}
        onOpenChange={(open) => {
          if (!open) setSetTypePickerTarget(null);
        }}
      >
        <DialogContent className="max-w-xs rounded-2xl p-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Tipo de série</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5 pt-2">
            {SET_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTypePickerTarget && handleChangeSetType(setTypePickerTarget, opt.value)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-muted transition-colors",
                  setTypePickerTarget?.set_type === opt.value && "bg-primary/10 text-primary"
                )}
              >
                <span>{opt.label}</span>
                <span className={cn("text-xs", opt.badgeClass)}>{opt.short}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Adicionar Nota ao Exercício */}
      <Dialog
        open={!!noteModalEx}
        onOpenChange={(open) => {
          if (!open) setNoteModalEx(null);
        }}
      >
        <DialogContent className="max-w-sm rounded-2xl p-4 space-y-3">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Nota — {noteModalEx?.name}
            </DialogTitle>
          </DialogHeader>
          <Input
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Ex: Banco no furo 3 · pegada 1,5x ombros"
            className="text-base sm:text-sm"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setNoteModalEx(null)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSaveNote}>
              Salvar nota
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo: Descartar séries não feitas? */}
      <Dialog open={discardDialogOpen} onOpenChange={setDiscardDialogOpen}>
        <DialogContent className="max-w-xs rounded-2xl p-5 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Descartar séries não feitas?
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            Existem séries não marcadas neste treino. Deseja concluir descartando as séries não feitas ou voltar ao treino?
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={handleFinishSession} className="w-full font-bold">
              Descartar
            </Button>
            <Button
              variant="outline"
              onClick={() => setDiscardDialogOpen(false)}
              className="w-full font-semibold"
            >
              Voltar ao treino
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tela 2: Resumo do Treino */}
      {summaryPayload && (
        <HevyWorkoutSummaryDialog
          open={summaryOpen}
          onOpenChange={(open) => {
            setSummaryOpen(open);
            if (!open) onFinished();
          }}
          firstName={(studentName || "Atleta").trim().split(/\s+/)[0]}
          workoutTitle={`${day?.day_label ? `${day.day_label} · ` : ""}${day?.name || "Treino"}`}
          finishedAtIso={summaryPayload.finishedAtIso}
          durationSeconds={summaryPayload.durationSeconds}
          totalVolumeKg={summaryPayload.totalVolumeKg}
          lastSameDayVolumeKg={lastSameDayVolumeKg}
          dayNumberLabel={day?.day_label || "Dia"}
          completedSetsCount={summaryPayload.completedSetsCount}
          prs={summaryPayload.prs}
          bestSets={summaryPayload.bestSets}
          onSaveAndExit={() => {
            setSummaryOpen(false);
            onFinished();
          }}
        />
      )}
    </div>
  );
}
