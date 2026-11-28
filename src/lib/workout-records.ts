import { supabase } from "@/integrations/supabase/client";
import { formatDecimalBR, type SetLogRow } from "@/lib/workout-session-store";

export type PRKind = "Maior carga" | "1RM estimado" | "Maior volume";

export interface ExerciseHistoricalBaseline {
  bestWeightKg: number;
  best1RM: number;
  bestSessionVolumeKg: number;
}

export interface DetectedPRItem {
  exerciseId: string;
  exerciseName: string;
  kind: PRKind;
  newValue: number;
  diffValue: number;
}

export interface ExerciseSessionHistoryEntry {
  sessionId: string;
  dateIso: string;
  dateLabel: string;
  maxWeightKg: number;
  best1RM: number;
  sessionVolumeKg: number;
  bestSetWeightKg: number;
  bestSetReps: number;
  setsSummary: string;
  hasPR: boolean;
}

/**
 * Fórmula de Epley arredondada a 0,1: weight_kg * (1 + reps / 30)
 */
export function calcEpley1RM(weightKg: number, reps: number): number {
  if (!Number.isFinite(weightKg) || !Number.isFinite(reps) || weightKg <= 0 || reps <= 0) {
    return 0;
  }
  const raw = weightKg * (1 + reps / 30);
  return Math.round(raw * 10) / 10;
}

/**
 * Formata data no padrão brasileiro curto: dd/mm (ex: 27/11)
 */
export function formatShortDateBR(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (isNaN(d.getTime())) return "--/--";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

/**
 * Formata rótulo de histórico da Tela 3 (ex: "Hoje · 27/11", "Sex · 20/11")
 */
export function formatHistorySessionDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "--/--";
  const now = new Date();
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const ddmm = formatShortDateBR(d);
  if (isToday) return `Hoje · ${ddmm}`;
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return `${weekdays[d.getDay()]} · ${ddmm}`;
}

/**
 * Busca o baseline histórico (Maior carga, 1RM estimado, Maior volume) por exercício
 * e o volume da última sessão concluída do mesmo dia de treino (para variação %).
 */
export async function fetchUserExerciseBaselines(
  userId: string,
  routineDayId: string,
  currentSessionId: string
): Promise<{
  baselines: Record<string, ExerciseHistoricalBaseline>;
  lastSameDayVolumeKg: number | null;
}> {
  try {
    const { data: sessions } = await supabase
      .from("workout_sessions" as never)
      .select("id, routine_day_id, total_volume_kg, finished_at")
      .eq("user_id", userId)
      .eq("status", "concluido")
      .neq("id", currentSessionId)
      .order("finished_at", { ascending: false })
      .limit(200);

    const sessionList = (sessions || []) as Array<{
      id: string;
      routine_day_id: string;
      total_volume_kg: number;
      finished_at: string;
    }>;

    const lastSameDay = sessionList.find((s) => s.routine_day_id === routineDayId);
    const lastSameDayVolumeKg = lastSameDay ? Number(lastSameDay.total_volume_kg) : null;

    if (sessionList.length === 0) {
      return { baselines: {}, lastSameDayVolumeKg };
    }

    const { data: logs } = await supabase
      .from("set_logs" as never)
      .select("session_id, exercise_id, set_type, weight_kg, reps, completed")
      .in("session_id", sessionList.map((s) => s.id))
      .eq("completed", true);

    const baselines: Record<string, ExerciseHistoricalBaseline> = {};
    // Agrupa volume por (session_id + exercise_id)
    const volPerSessionEx: Record<string, number> = {};

    for (const row of (logs || []) as Array<{
      session_id: string;
      exercise_id: string;
      set_type: string;
      weight_kg: number | null;
      reps: number | null;
    }>) {
      if (row.set_type === "aquecimento") continue;
      const w = Number(row.weight_kg || 0);
      const r = Number(row.reps || 0);
      if (w <= 0 || r <= 0) continue;

      if (!baselines[row.exercise_id]) {
        baselines[row.exercise_id] = {
          bestWeightKg: 0,
          best1RM: 0,
          bestSessionVolumeKg: 0,
        };
      }

      const b = baselines[row.exercise_id];
      if (w > b.bestWeightKg) b.bestWeightKg = w;
      const est1rm = calcEpley1RM(w, r);
      if (est1rm > b.best1RM) b.best1RM = est1rm;

      const volKey = `${row.session_id}::${row.exercise_id}`;
      volPerSessionEx[volKey] = (volPerSessionEx[volKey] || 0) + w * r;
    }

    for (const [volKey, vol] of Object.entries(volPerSessionEx)) {
      const exId = volKey.split("::")[1];
      if (baselines[exId] && vol > baselines[exId].bestSessionVolumeKg) {
        baselines[exId].bestSessionVolumeKg = Math.round(vol * 100) / 100;
      }
    }

    return { baselines, lastSameDayVolumeKg };
  } catch {
    return { baselines: {}, lastSameDayVolumeKg: null };
  }
}

/**
 * Verifica se uma série específica (ao ser marcada) bate algum recorde contra o histórico.
 */
export function isSetPersonalRecord(
  setRow: SetLogRow,
  baseline: ExerciseHistoricalBaseline | undefined
): boolean {
  if (!setRow.completed || setRow.set_type === "aquecimento") return false;
  const w = Number(setRow.weight_kg || 0);
  const r = Number(setRow.reps || 0);
  if (w <= 0 || r <= 0) return false;
  if (!baseline || baseline.bestWeightKg === 0) return true; // Primeiro registro concluído

  const est1rm = calcEpley1RM(w, r);
  return w > baseline.bestWeightKg || est1rm > baseline.best1RM;
}

/**
 * Detecta todos os PRs batidos na sessão concluída e calcula a melhor série por exercício.
 */
export function computeSessionSummaryData(params: {
  sets: SetLogRow[];
  exercises: Array<{ id: string; name: string }>;
  baselines: Record<string, ExerciseHistoricalBaseline>;
}): {
  prs: DetectedPRItem[];
  bestSets: Array<{ exerciseId: string; exerciseName: string; weightKg: number; reps: number }>;
  prSetIds: Set<string>;
} {
  const { sets, exercises, baselines } = params;
  const prs: DetectedPRItem[] = [];
  const bestSets: Array<{ exerciseId: string; exerciseName: string; weightKg: number; reps: number }> = [];
  const prSetIds = new Set<string>();

  for (const ex of exercises) {
    const exSets = sets.filter(
      (s) => s.exercise_id === ex.id && s.completed && s.set_type !== "aquecimento"
    );
    if (exSets.length === 0) continue;

    const base = baselines[ex.id] || {
      bestWeightKg: 0,
      best1RM: 0,
      bestSessionVolumeKg: 0,
    };

    let sessionMaxWeight = 0;
    let sessionBest1RM = 0;
    let sessionVolume = 0;
    let bestSetForEx: { weightKg: number; reps: number } | null = null;

    for (const s of exSets) {
      const w = Number(s.weight_kg || 0);
      const r = Number(s.reps || 0);
      if (w <= 0 || r <= 0) continue;

      const est1rm = calcEpley1RM(w, r);
      sessionVolume += w * r;

      if (w > sessionMaxWeight) sessionMaxWeight = w;
      if (est1rm > sessionBest1RM) sessionBest1RM = est1rm;

      if (
        !bestSetForEx ||
        w > bestSetForEx.weightKg ||
        (w === bestSetForEx.weightKg && r > bestSetForEx.reps)
      ) {
        bestSetForEx = { weightKg: w, reps: r };
      }

      if (base.bestWeightKg > 0 && (w > base.bestWeightKg || est1rm > base.best1RM)) {
        prSetIds.add(s.id);
      } else if (base.bestWeightKg === 0 && s === exSets[0]) {
        prSetIds.add(s.id);
      }
    }

    if (bestSetForEx) {
      bestSets.push({
        exerciseId: ex.id,
        exerciseName: ex.name,
        weightKg: bestSetForEx.weightKg,
        reps: bestSetForEx.reps,
      });
    }

    if (sessionMaxWeight > base.bestWeightKg) {
      prs.push({
        exerciseId: ex.id,
        exerciseName: ex.name,
        kind: "Maior carga",
        newValue: sessionMaxWeight,
        diffValue: Math.round((sessionMaxWeight - base.bestWeightKg) * 10) / 10,
      });
    }

    if (sessionBest1RM > base.best1RM) {
      prs.push({
        exerciseId: ex.id,
        exerciseName: ex.name,
        kind: "1RM estimado",
        newValue: sessionBest1RM,
        diffValue: Math.round((sessionBest1RM - base.best1RM) * 10) / 10,
      });
    }

    const roundedVol = Math.round(sessionVolume);
    if (roundedVol > base.bestSessionVolumeKg) {
      prs.push({
        exerciseId: ex.id,
        exerciseName: ex.name,
        kind: "Maior volume",
        newValue: roundedVol,
        diffValue: Math.round(roundedVol - base.bestSessionVolumeKg),
      });
    }
  }

  return { prs, bestSets, prSetIds };
}

/**
 * Busca histórico completo de um exercício (por IDs ou nome) para a Tela 3 (Evolução do Exercício).
 */
export async function fetchExerciseEvolutionHistory(params: {
  userId: string;
  exerciseIds: string[];
}): Promise<ExerciseSessionHistoryEntry[]> {
  const { userId, exerciseIds } = params;
  if (!userId || exerciseIds.length === 0) return [];

  const { data: sessions } = await supabase
    .from("workout_sessions" as never)
    .select("id, finished_at, started_at")
    .eq("user_id", userId)
    .eq("status", "concluido")
    .order("finished_at", { ascending: true })
    .limit(250);

  const sessionList = (sessions || []) as Array<{
    id: string;
    finished_at: string | null;
    started_at: string | null;
  }>;
  if (sessionList.length === 0) return [];

  const { data: logs } = await supabase
    .from("set_logs" as never)
    .select("session_id, set_order, set_type, weight_kg, reps, completed")
    .in("session_id", sessionList.map((s) => s.id))
    .in("exercise_id", exerciseIds)
    .eq("completed", true)
    .order("set_order", { ascending: true });

  const logsBySession = new Map<string, Array<{ weightKg: number; reps: number; setType: string }>>();
  for (const row of (logs || []) as Array<{
    session_id: string;
    set_type: string;
    weight_kg: number | null;
    reps: number | null;
  }>) {
    if (row.set_type === "aquecimento") continue;
    const w = Number(row.weight_kg || 0);
    const r = Number(row.reps || 0);
    if (w <= 0 || r <= 0) continue;
    const arr = logsBySession.get(row.session_id) || [];
    arr.push({ weightKg: w, reps: r, setType: row.set_type });
    logsBySession.set(row.session_id, arr);
  }

  let runningMaxWeight = 0;
  let runningBest1RM = 0;
  let runningMaxVol = 0;

  const entries: ExerciseSessionHistoryEntry[] = [];

  for (const sess of sessionList) {
    const setsArr = logsBySession.get(sess.id);
    if (!setsArr || setsArr.length === 0) continue;

    const dateIso = sess.finished_at || sess.started_at || new Date().toISOString();
    let maxWeightKg = 0;
    let best1RM = 0;
    let sessionVolumeKg = 0;
    let bestSetWeightKg = 0;
    let bestSetReps = 0;

    for (const s of setsArr) {
      if (s.weightKg > maxWeightKg) maxWeightKg = s.weightKg;
      const e1rm = calcEpley1RM(s.weightKg, s.reps);
      if (e1rm > best1RM) best1RM = e1rm;
      sessionVolumeKg += s.weightKg * s.reps;
      if (
        s.weightKg > bestSetWeightKg ||
        (s.weightKg === bestSetWeightKg && s.reps > bestSetReps)
      ) {
        bestSetWeightKg = s.weightKg;
        bestSetReps = s.reps;
      }
    }

    const roundedVol = Math.round(sessionVolumeKg);
    const hasPR =
      maxWeightKg > runningMaxWeight ||
      best1RM > runningBest1RM ||
      roundedVol > runningMaxVol;

    if (maxWeightKg > runningMaxWeight) runningMaxWeight = maxWeightKg;
    if (best1RM > runningBest1RM) runningBest1RM = best1RM;
    if (roundedVol > runningMaxVol) runningMaxVol = roundedVol;

    entries.push({
      sessionId: sess.id,
      dateIso,
      dateLabel: formatShortDateBR(dateIso),
      maxWeightKg,
      best1RM,
      sessionVolumeKg: roundedVol,
      bestSetWeightKg,
      bestSetReps,
      setsSummary: setsArr.map((s) => `${formatDecimalBR(s.weightKg)}×${s.reps}`).join(" · "),
      hasPR,
    });
  }

  return entries;
}
