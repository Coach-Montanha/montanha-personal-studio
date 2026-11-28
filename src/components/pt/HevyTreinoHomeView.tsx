import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Play, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDurationMMSS, type WorkoutSessionRow } from "@/lib/workout-session-store";
import { formatShortDateBR } from "@/lib/workout-records";

interface HevyTreinoHomeViewProps {
  studentName?: string | null;
  programs: any[];
  days: any[];
  exercises: any[];
  completedSessions: Array<{
    id: string;
    routine_day_id: string;
    started_at: string | null;
    finished_at: string | null;
    duration_seconds: number;
  }>;
  legacyExecutions: Array<{
    id: string;
    training_day_id: string;
    executed_at: string;
    notes: string | null;
  }>;
  inProgressSession: WorkoutSessionRow | null;
  startingDayId: string | null;
  onStartDay: (day: any) => void;
  onContinueSession: (sessionId: string) => void;
  onOpenEvolution: () => void;
  onSelectOtherProgram?: (programId: string) => void;
}

const WEEKDAY_INITIALS = ["S", "T", "Q", "Q", "S", "S", "D"];

function formatLongDatePtBr(date: Date): string {
  const raw = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  // Ex: "sexta-feira, 27 de novembro" -> "Sexta, 27 de novembro"
  const clean = raw.replace("-feira", "");
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function getDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function HevyTreinoHomeView({
  studentName,
  programs,
  days,
  exercises,
  completedSessions,
  legacyExecutions,
  inProgressSession,
  startingDayId,
  onStartDay,
  onContinueSession,
  onOpenEvolution,
  onSelectOtherProgram,
}: HevyTreinoHomeViewProps) {
  const [activeProgramId, setActiveProgramId] = useState<string>(programs[0]?.id || "");
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (programs.length > 0 && !programs.some((p) => p.id === activeProgramId)) {
      setActiveProgramId(programs[0].id);
    }
  }, [programs, activeProgramId]);

  useEffect(() => {
    if (!inProgressSession?.started_at) return;
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, [inProgressSession?.started_at]);

  const firstName = (studentName || "Atleta").trim().split(/\s+/)[0];
  const today = useMemo(() => new Date(), []);
  const todayKey = getDateKey(today);

  const activeProgram = programs.find((p) => p.id === activeProgramId) || programs[0] || null;

  const programDays = useMemo(() => {
    if (!activeProgram) return [];
    return days.filter((d) => d.program_id === activeProgram.id);
  }, [days, activeProgram]);

  // Mapa unificado de datas concluídas (YYYY-MM-DD) + última execução por dayId
  const { completedDateKeys, lastDoneByDay, avgMinutes } = useMemo(() => {
    const dateSet = new Set<string>();
    const lastByDay = new Map<string, string>();
    const durations: number[] = [];

    for (const s of completedSessions) {
      const iso = s.finished_at || s.started_at;
      if (!iso) continue;
      const d = new Date(iso);
      if (!isNaN(d.getTime())) {
        dateSet.add(getDateKey(d));
        const prev = lastByDay.get(s.routine_day_id);
        if (!prev || new Date(iso).getTime() > new Date(prev).getTime()) {
          lastByDay.set(s.routine_day_id, iso);
        }
      }
      if (s.duration_seconds > 60) {
        durations.push(Math.round(s.duration_seconds / 60));
      }
    }

    for (const ex of legacyExecutions) {
      const d = new Date(ex.executed_at);
      if (!isNaN(d.getTime())) {
        dateSet.add(getDateKey(d));
        const prev = lastByDay.get(ex.training_day_id);
        if (!prev || new Date(ex.executed_at).getTime() > new Date(prev).getTime()) {
          lastByDay.set(ex.training_day_id, ex.executed_at);
        }
      }
      if (ex.notes) {
        try {
          const parsed = JSON.parse(ex.notes);
          if (parsed?.timerSeconds && Number(parsed.timerSeconds) > 60) {
            durations.push(Math.round(Number(parsed.timerSeconds) / 60));
          }
        } catch {
          // ignore
        }
      }
    }

    const avg =
      durations.length > 0
        ? Math.round(durations.reduce((acc, v) => acc + v, 0) / durations.length)
        : 50;

    return { completedDateKeys: dateSet, lastDoneByDay: lastByDay, avgMinutes: avg };
  }, [completedSessions, legacyExecutions]);

  // 7 dias da semana atual (Segunda -> Domingo)
  const weekDays = useMemo(() => {
    const dayOfWeek = today.getDay(); // 0 = Dom, 1 = Seg...
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + diffToMonday);

    return Array.from({ length: 7 }, (_, idx) => {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + idx);
      const key = getDateKey(d);
      return {
        initial: WEEKDAY_INITIALS[idx],
        dayNumber: d.getDate(),
        key,
        isToday: key === todayKey,
        isCompleted: completedDateKeys.has(key),
      };
    });
  }, [today, todayKey, completedDateKeys]);

  const workoutsThisWeekCount = weekDays.filter((w) => w.isCompleted).length;
  const totalProgramDays = programDays.length || 1;

  // Próximo treino cíclico (D1 -> D2 -> D3 -> D1) com base no último concluído
  const nextDay = useMemo(() => {
    if (programDays.length === 0) return null;

    let latestDayId: string | null = null;
    let latestTime = 0;

    for (const d of programDays) {
      const iso = lastDoneByDay.get(d.id);
      if (iso) {
        const t = new Date(iso).getTime();
        if (t > latestTime) {
          latestTime = t;
          latestDayId = d.id;
        }
      }
    }

    if (!latestDayId) return programDays[0];
    const lastIdx = programDays.findIndex((d) => d.id === latestDayId);
    if (lastIdx < 0) return programDays[0];
    return programDays[(lastIdx + 1) % programDays.length];
  }, [programDays, lastDoneByDay]);

  const inProgressElapsedSec = useMemo(() => {
    if (!inProgressSession?.started_at) return 0;
    return Math.max(
      0,
      Math.floor((nowMs - new Date(inProgressSession.started_at).getTime()) / 1000)
    );
  }, [inProgressSession?.started_at, nowMs]);

  const inProgressDay = inProgressSession
    ? days.find((d) => d.id === inProgressSession.routine_day_id)
    : null;

  const nextDayExercisesCount = nextDay
    ? exercises.filter((e) => e.training_day_id === nextDay.id).length
    : 0;
  const nextDayLastDoneIso = nextDay ? lastDoneByDay.get(nextDay.id) : undefined;
  const nextDayIndex = nextDay ? programDays.findIndex((d) => d.id === nextDay.id) : 0;

  return (
    <div className="mx-auto max-w-xl space-y-5 pb-8">
      {/* 1. Saudação com data por extenso */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {formatLongDatePtBr(today)}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Olá, {firstName}
          </h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenEvolution}
          className="h-9 rounded-xl gap-1.5 text-xs font-semibold shadow-xs shrink-0"
        >
          <TrendingUp className="h-3.5 w-3.5 text-violet-600" />
          Evolução
        </Button>
      </div>

      {/* 2. Card "Esta semana" */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Esta semana</h2>
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            {workoutsThisWeekCount} de {totalProgramDays}{" "}
            {totalProgramDays === 1 ? "treino" : "treinos"}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weekDays.map((wd) => (
            <div key={wd.key} className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground">
                {wd.initial}
              </span>
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold tabular-nums transition-colors",
                  wd.isCompleted
                    ? "bg-violet-600 text-white shadow-xs"
                    : wd.isToday
                      ? "border-2 border-violet-600 text-violet-600 bg-background"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {wd.dayNumber}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 / 5. Card Escuro: Treino em andamento OU Próximo Treino */}
      {inProgressSession ? (
        <div className="rounded-2xl bg-zinc-950 p-5 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/20 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
              Treino em andamento · {formatDurationMMSS(inProgressElapsedSec)}
            </span>
          </div>

          <div className="space-y-1">
            {inProgressDay?.day_label && (
              <span className="block text-xs text-zinc-400">{inProgressDay.day_label}</span>
            )}
            <h2 className="text-xl font-extrabold leading-tight text-white">
              {inProgressDay?.name || "Sessão em andamento"}
            </h2>
          </div>

          <Button
            type="button"
            onClick={() => onContinueSession(inProgressSession.id)}
            className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-sm gap-2 shadow-sm"
          >
            <Play className="h-4 w-4 fill-zinc-950" />
            Continuar
          </Button>
        </div>
      ) : nextDay ? (
        <div className="rounded-2xl bg-zinc-950 p-5 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-md bg-violet-500/20 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-violet-300">
              PRÓXIMO TREINO
            </span>
            <span className="text-xs font-medium text-zinc-400 tabular-nums">
              ≈ {avgMinutes} min
            </span>
          </div>

          <div className="space-y-1">
            <span className="block text-xs text-zinc-400">
              Dia {nextDayIndex + 1}
            </span>
            <h2 className="text-xl font-extrabold leading-tight text-white">
              {nextDay.name}
            </h2>
            <p className="text-xs text-zinc-400">
              {nextDayExercisesCount}{" "}
              {nextDayExercisesCount === 1 ? "exercício" : "exercícios"}
              {nextDayLastDoneIso ? ` · último feito em ${formatShortDateBR(nextDayLastDoneIso)}` : ""}
            </p>
          </div>

          <Button
            type="button"
            disabled={startingDayId === nextDay.id}
            onClick={() => onStartDay(nextDay)}
            className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-sm gap-2 shadow-sm"
          >
            <Play className="h-4 w-4 fill-zinc-950" />
            {startingDayId === nextDay.id ? "Iniciando..." : "Iniciar treino"}
          </Button>
        </div>
      ) : null}

      {/* 4. Lista do Programa com título completo quebrando linha */}
      {activeProgram && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground break-words leading-snug">
              {activeProgram.name}
            </h3>
            {programs.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  const idx = programs.findIndex((p) => p.id === activeProgram.id);
                  const nextProg = programs[(idx + 1) % programs.length];
                  setActiveProgramId(nextProg.id);
                }}
                className="shrink-0 text-[11px] font-bold text-violet-600 hover:underline"
              >
                Trocar programa ({programs.length})
              </button>
            )}
          </div>

          <div className="space-y-2">
            {programDays.map((dayItem, idx) => {
              const exCount = exercises.filter((e) => e.training_day_id === dayItem.id).length;
              const lastIso = lastDoneByDay.get(dayItem.id);
              const isNext = nextDay?.id === dayItem.id;
              const badgeText = `D${idx + 1}`;

              return (
                <button
                  key={dayItem.id}
                  type="button"
                  disabled={startingDayId === dayItem.id}
                  onClick={() => onStartDay(dayItem)}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3.5 text-left shadow-xs hover:border-violet-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold",
                        isNext
                          ? "bg-violet-600/15 text-violet-600"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {badgeText}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground">
                        {dayItem.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {exCount} {exCount === 1 ? "exercício" : "exercícios"} ·{" "}
                        {isNext
                          ? "próximo"
                          : lastIso
                            ? `feito ${formatShortDateBR(lastIso)}`
                            : "pendente"}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {programs.length > 1 && onSelectOtherProgram && (
        <div className="pt-1">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Todos os programas ({programs.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {programs.map((prog) => (
              <button
                key={prog.id}
                type="button"
                onClick={() => setActiveProgramId(prog.id)}
                className={cn(
                  "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors",
                  prog.id === activeProgram?.id
                    ? "border-violet-600 bg-violet-600/10 text-violet-700 dark:text-violet-300"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                {prog.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
