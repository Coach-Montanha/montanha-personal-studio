import { supabase } from "@/integrations/supabase/client";

export type SetType = "aquecimento" | "normal" | "drop" | "falha";

export interface WorkoutSessionRow {
  id: string;
  user_id: string;
  routine_day_id: string;
  started_at: string | null;
  finished_at: string | null;
  duration_seconds: number;
  total_volume_kg: number;
  status: "em_andamento" | "concluido";
}

export interface SetLogRow {
  id: string;
  session_id: string;
  exercise_id: string;
  set_order: number;
  set_type: SetType;
  weight_kg: number | null;
  reps: number | null;
  completed: boolean;
  completed_at: string | null;
  // Campos locais auxiliares (UI)
  weightInput?: string;
  repsInput?: string;
}

export interface SessionExerciseNoteRow {
  id?: string;
  session_id: string;
  exercise_id: string;
  note: string;
}

export interface PreviousSetMap {
  // key: `${exerciseId}::${setOrder}`
  [key: string]: {
    weight_kg: number | null;
    reps: number | null;
  };
}

export interface RestState {
  active: boolean;
  endsAt: number; // epoch ms
  totalSeconds: number;
  exerciseName: string;
}

type OfflineOp =
  | { kind: "upsert_session"; payload: Partial<WorkoutSessionRow> & { id: string } }
  | { kind: "upsert_set"; payload: Omit<SetLogRow, "weightInput" | "repsInput"> }
  | { kind: "delete_set"; id: string; session_id: string }
  | { kind: "upsert_note"; payload: SessionExerciseNoteRow };

// ==================== FORMATAÇÃO BRASILEIRA ====================

export function parseDecimalBR(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  // Remove separador de milhar se houver ponto + vírgula (ex: "1.200,5")
  const normalized = trimmed.includes(",")
    ? trimmed.replace(/\./g, "").replace(",", ".")
    : trimmed;
  const num = Number(normalized);
  return Number.isFinite(num) && num >= 0 ? Math.round(num * 100) / 100 : null;
}

export function formatDecimalBR(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "";
  return Number.isInteger(value)
    ? String(value)
    : value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
}

export function formatVolumeKgBR(kg: number): string {
  const rounded = Math.round(kg);
  return `${rounded.toLocaleString("pt-BR")} kg`;
}

export function formatDurationMMSS(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function parsePlannedSets(
  setsReps?: string | null,
  plannedLoad?: string | null
): Array<{ setOrder: number; plannedWeight: string; plannedReps: string }> {
  const defaultWeight = (() => {
    if (!plannedLoad) return "";
    const m = String(plannedLoad).match(/(\d+(?:[.,]\d+)?)/);
    return m ? m[1].replace(".", ",") : "";
  })();

  if (!setsReps || !setsReps.trim()) {
    return [1, 2, 3].map((n) => ({ setOrder: n, plannedWeight: defaultWeight, plannedReps: "10" }));
  }

  const raw = setsReps.trim();
  const match = raw.match(/^(\d+)\s*[xX]\s*(\d+)/);
  if (match) {
    const count = Math.min(12, Math.max(1, parseInt(match[1], 10) || 3));
    const reps = match[2];
    return Array.from({ length: count }, (_, i) => ({
      setOrder: i + 1,
      plannedWeight: defaultWeight,
      plannedReps: reps,
    }));
  }

  const countOnly = raw.match(/^(\d+)\s*[xX]/);
  const count = countOnly ? Math.min(12, Math.max(1, parseInt(countOnly[1], 10) || 3)) : 3;
  return Array.from({ length: count }, (_, i) => ({
    setOrder: i + 1,
    plannedWeight: defaultWeight,
    plannedReps: "10",
  }));
}

// ==================== REGRAS DE CÁLCULO (SEM AQUECIMENTO) ====================

export function computeSessionMetrics(sets: SetLogRow[]): {
  totalVolumeKg: number;
  completedNonWarmup: number;
  totalNonWarmup: number;
} {
  let totalVolumeKg = 0;
  let completedNonWarmup = 0;
  let totalNonWarmup = 0;

  for (const s of sets) {
    if (s.set_type === "aquecimento") continue;
    totalNonWarmup += 1;
    if (s.completed) {
      completedNonWarmup += 1;
      const w = s.weight_kg ?? parseDecimalBR(s.weightInput) ?? 0;
      const r = s.reps ?? (s.repsInput ? parseInt(s.repsInput, 10) || 0 : 0);
      if (w > 0 && r > 0) {
        totalVolumeKg += w * r;
      }
    }
  }

  return {
    totalVolumeKg: Math.round(totalVolumeKg * 100) / 100,
    completedNonWarmup,
    totalNonWarmup,
  };
}

// ==================== STORAGE LOCAL & FILA OFFLINE ====================

const sessionKey = (sessionId: string) => `pt_hevy_session_${sessionId}`;
const activeSessionKey = (userId: string) => `pt_hevy_active_session_${userId}`;
const restKey = (sessionId: string) => `pt_hevy_rest_${sessionId}`;
const queueKey = (userId: string) => `pt_hevy_offline_queue_${userId}`;

export interface LocalSessionSnapshot {
  session: WorkoutSessionRow;
  sets: SetLogRow[];
  notes: Record<string, string>;
  updatedAt: number;
}

export function saveLocalSessionSnapshot(snapshot: LocalSessionSnapshot) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(sessionKey(snapshot.session.id), JSON.stringify(snapshot));
    if (snapshot.session.status === "em_andamento") {
      localStorage.setItem(activeSessionKey(snapshot.session.user_id), snapshot.session.id);
    } else if (localStorage.getItem(activeSessionKey(snapshot.session.user_id)) === snapshot.session.id) {
      localStorage.removeItem(activeSessionKey(snapshot.session.user_id));
    }
  } catch {
    // ignore storage quota
  }
}

export function loadLocalSessionSnapshot(sessionId: string): LocalSessionSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(sessionKey(sessionId));
    return raw ? (JSON.parse(raw) as LocalSessionSnapshot) : null;
  } catch {
    return null;
  }
}

export function getActiveLocalSessionId(userId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(activeSessionKey(userId));
  } catch {
    return null;
  }
}

export function saveLocalRestState(sessionId: string, state: RestState | null) {
  if (typeof window === "undefined") return;
  try {
    if (!state || !state.active) {
      localStorage.removeItem(restKey(sessionId));
    } else {
      localStorage.setItem(restKey(sessionId), JSON.stringify(state));
    }
  } catch {
    // ignore
  }
}

export function loadLocalRestState(sessionId: string): RestState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(restKey(sessionId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RestState;
    if (!parsed.active || parsed.endsAt <= Date.now()) {
      localStorage.removeItem(restKey(sessionId));
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function enqueueOfflineOp(userId: string, op: OfflineOp) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(queueKey(userId));
    const list: OfflineOp[] = raw ? JSON.parse(raw) : [];
    list.push(op);
    localStorage.setItem(queueKey(userId), JSON.stringify(list));
  } catch {
    // ignore
  }
}

export async function flushOfflineQueue(userId: string): Promise<number> {
  if (typeof window === "undefined") return 0;
  if (typeof navigator !== "undefined" && !navigator.onLine) return 0;

  let list: OfflineOp[] = [];
  try {
    const raw = localStorage.getItem(queueKey(userId));
    if (!raw) return 0;
    list = JSON.parse(raw);
  } catch {
    return 0;
  }
  if (!list.length) return 0;

  const remaining: OfflineOp[] = [];
  let flushed = 0;

  for (let i = 0; i < list.length; i++) {
    const op = list[i];
    try {
      if (op.kind === "upsert_session") {
        const { error } = await supabase
          .from("workout_sessions" as never)
          .upsert(op.payload as never, { onConflict: "id" } as never);
        if (error) throw error;
      } else if (op.kind === "upsert_set") {
        const { error } = await supabase
          .from("set_logs" as never)
          .upsert(op.payload as never, { onConflict: "id" } as never);
        if (error) throw error;
      } else if (op.kind === "delete_set") {
        const { error } = await supabase
          .from("set_logs" as never)
          .delete()
          .eq("id", op.id);
        if (error) throw error;
      } else if (op.kind === "upsert_note") {
        const { error } = await supabase
          .from("session_exercise_notes" as never)
          .upsert(op.payload as never, { onConflict: "session_id,exercise_id" } as never);
        if (error) throw error;
      }
      flushed += 1;
    } catch {
      // Mantém esta e as próximas operações na fila para tentar novamente depois
      remaining.push(...list.slice(i));
      break;
    }
  }

  try {
    if (remaining.length === 0) {
      localStorage.removeItem(queueKey(userId));
    } else {
      localStorage.setItem(queueKey(userId), JSON.stringify(remaining));
    }
  } catch {
    // ignore
  }

  return flushed;
}

// ==================== OPERAÇÕES SUPABASE RESILIENTES ====================

export async function startOrResumeWorkoutSession(params: {
  userId: string;
  routineDayId: string;
  exercises: Array<{ id: string; sets_reps?: string | null; load?: string | null }>;
}): Promise<WorkoutSessionRow> {
  const { userId, routineDayId, exercises } = params;

  // 1. Verifica se já existe sessão 'em_andamento' para este dia (ou local)
  const { data: existing } = await supabase
    .from("workout_sessions" as never)
    .select("*")
    .eq("user_id", userId)
    .eq("routine_day_id", routineDayId)
    .eq("status", "em_andamento")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    return existing as WorkoutSessionRow;
  }

  const newSessionId = crypto.randomUUID();
  const newSession: WorkoutSessionRow = {
    id: newSessionId,
    user_id: userId,
    routine_day_id: routineDayId,
    started_at: null, // Inicia automaticamente ao marcar a primeira série
    finished_at: null,
    duration_seconds: 0,
    total_volume_kg: 0,
    status: "em_andamento",
  };

  // Gera as séries iniciais a partir da prescrição do personal
  const initialSets: SetLogRow[] = [];
  for (const ex of exercises) {
    const planned = parsePlannedSets(ex.sets_reps, ex.load);
    for (const item of planned) {
      initialSets.push({
        id: crypto.randomUUID(),
        session_id: newSessionId,
        exercise_id: ex.id,
        set_order: item.setOrder,
        set_type: "normal",
        weight_kg: null,
        reps: null,
        completed: false,
        completed_at: null,
      });
    }
  }

  // Salva snapshot local primeiro
  saveLocalSessionSnapshot({
    session: newSession,
    sets: initialSets,
    notes: {},
    updatedAt: Date.now(),
  });

  // Persiste no Supabase (ou enfileira se offline)
  const { error: sessErr } = await supabase
    .from("workout_sessions" as never)
    .insert(newSession as never);

  if (sessErr) {
    enqueueOfflineOp(userId, { kind: "upsert_session", payload: newSession });
    initialSets.forEach((s) => enqueueOfflineOp(userId, { kind: "upsert_set", payload: s }));
    return newSession;
  }

  if (initialSets.length > 0) {
    const { error: setsErr } = await supabase
      .from("set_logs" as never)
      .insert(initialSets as never);
    if (setsErr) {
      initialSets.forEach((s) => enqueueOfflineOp(userId, { kind: "upsert_set", payload: s }));
    }
  }

  return newSession;
}

export async function fetchPreviousSetsForExercises(
  userId: string,
  exerciseIds: string[],
  currentSessionId: string
): Promise<PreviousSetMap> {
  if (!exerciseIds.length) return {};
  try {
    // Busca as últimas sessões concluídas do usuário
    const { data: sessions } = await supabase
      .from("workout_sessions" as never)
      .select("id, finished_at")
      .eq("user_id", userId)
      .eq("status", "concluido")
      .neq("id", currentSessionId)
      .order("finished_at", { ascending: false })
      .limit(30);

    const sessionList = (sessions || []) as Array<{ id: string; finished_at: string }>;
    if (!sessionList.length) return {};

    const sessionOrder = new Map<string, number>();
    sessionList.forEach((s, idx) => sessionOrder.set(s.id, idx));

    const { data: logs } = await supabase
      .from("set_logs" as never)
      .select("session_id, exercise_id, set_order, weight_kg, reps, completed")
      .in("session_id", sessionList.map((s) => s.id))
      .in("exercise_id", exerciseIds)
      .eq("completed", true);

    const map: PreviousSetMap = {};
    const bestSessionRank: Record<string, number> = {};

    for (const row of (logs || []) as Array<{
      session_id: string;
      exercise_id: string;
      set_order: number;
      weight_kg: number | null;
      reps: number | null;
    }>) {
      const rank = sessionOrder.get(row.session_id) ?? 9999;
      const key = `${row.exercise_id}::${row.set_order}`;
      if (bestSessionRank[key] === undefined || rank < bestSessionRank[key]) {
        bestSessionRank[key] = rank;
        map[key] = {
          weight_kg: row.weight_kg !== null ? Number(row.weight_kg) : null,
          reps: row.reps !== null ? Number(row.reps) : null,
        };
      }
    }

    return map;
  } catch {
    return {};
  }
}

export async function persistSetLog(userId: string, setRow: SetLogRow) {
  const payload: Omit<SetLogRow, "weightInput" | "repsInput"> = {
    id: setRow.id,
    session_id: setRow.session_id,
    exercise_id: setRow.exercise_id,
    set_order: setRow.set_order,
    set_type: setRow.set_type,
    weight_kg: setRow.weight_kg,
    reps: setRow.reps,
    completed: setRow.completed,
    completed_at: setRow.completed_at,
  };

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    enqueueOfflineOp(userId, { kind: "upsert_set", payload });
    return;
  }

  const { error } = await supabase
    .from("set_logs" as never)
    .upsert(payload as never, { onConflict: "id" } as never);

  if (error) {
    enqueueOfflineOp(userId, { kind: "upsert_set", payload });
  }
}

export async function deleteSetLog(userId: string, setId: string, sessionId: string) {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    enqueueOfflineOp(userId, { kind: "delete_set", id: setId, session_id: sessionId });
    return;
  }
  const { error } = await supabase.from("set_logs" as never).delete().eq("id", setId);
  if (error) {
    enqueueOfflineOp(userId, { kind: "delete_set", id: setId, session_id: sessionId });
  }
}

export async function persistSessionProgress(
  userId: string,
  session: WorkoutSessionRow
) {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    enqueueOfflineOp(userId, { kind: "upsert_session", payload: session });
    return;
  }
  const { error } = await supabase
    .from("workout_sessions" as never)
    .upsert(session as never, { onConflict: "id" } as never);
  if (error) {
    enqueueOfflineOp(userId, { kind: "upsert_session", payload: session });
  }
}

export async function persistExerciseNote(
  userId: string,
  sessionId: string,
  exerciseId: string,
  note: string
) {
  const payload: SessionExerciseNoteRow = {
    session_id: sessionId,
    exercise_id: exerciseId,
    note,
  };
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    enqueueOfflineOp(userId, { kind: "upsert_note", payload });
    return;
  }
  const { error } = await supabase
    .from("session_exercise_notes" as never)
    .upsert(payload as never, { onConflict: "session_id,exercise_id" } as never);
  if (error) {
    enqueueOfflineOp(userId, { kind: "upsert_note", payload });
  }
}
