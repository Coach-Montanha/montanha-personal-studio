import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowLeft, Dumbbell, Loader2 } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { formatDecimalBR, formatVolumeKgBR } from "@/lib/workout-session-store";
import {
  fetchExerciseEvolutionHistory,
  formatHistorySessionDate,
  type ExerciseSessionHistoryEntry,
} from "@/lib/workout-records";

type EvolutionTab = "e1rm" | "weight" | "volume";
type PeriodFilter = "3M" | "6M" | "1A";

interface HevyExerciseEvolutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  initialExerciseName?: string | null;
  initialExerciseId?: string | null;
}

export function HevyExerciseEvolutionDialog({
  open,
  onOpenChange,
  studentId,
  initialExerciseName,
  initialExerciseId,
}: HevyExerciseEvolutionDialogProps) {
  const { user } = useAuth();
  const [selectedName, setSelectedName] = useState<string>(initialExerciseName || "");
  const [activeTab, setActiveTab] = useState<EvolutionTab>("e1rm");
  const [period, setPeriod] = useState<PeriodFilter>("3M");

  useEffect(() => {
    if (open && initialExerciseName) {
      setSelectedName(initialExerciseName);
    }
  }, [open, initialExerciseName]);

  // Busca todos os exercícios dos programas do aluno para mapear nomes, IDs e metadados
  const { data: exerciseCatalog = [] } = useQuery({
    queryKey: ["evolution-exercise-catalog", studentId],
    enabled: open && !!studentId,
    queryFn: async () => {
      const { data: progs } = await supabase
        .from("pt_programs" as never)
        .select("id")
        .eq("pt_student_id", studentId);
      const progIds = ((progs || []) as Array<{ id: string }>).map((p) => p.id);
      if (progIds.length === 0) return [];

      const { data: days } = await supabase
        .from("pt_training_days" as never)
        .select("id")
        .in("program_id", progIds);
      const dayIds = ((days || []) as Array<{ id: string }>).map((d) => d.id);
      if (dayIds.length === 0) return [];

      const { data: exs } = await supabase
        .from("pt_training_exercises" as never)
        .select("id, name, exercise_library_id")
        .in("training_day_id", dayIds);

      return (exs || []) as Array<{
        id: string;
        name: string;
        exercise_library_id: string | null;
      }>;
    },
  });

  const exerciseNames = useMemo(() => {
    const set = new Set<string>();
    exerciseCatalog.forEach((e) => {
      if (e.name) set.add(e.name.trim());
    });
    if (initialExerciseName) set.add(initialExerciseName.trim());
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [exerciseCatalog, initialExerciseName]);

  useEffect(() => {
    if (open && !selectedName && exerciseNames.length > 0) {
      setSelectedName(exerciseNames[0]);
    }
  }, [open, selectedName, exerciseNames]);

  const matchingExerciseIds = useMemo(() => {
    const ids = new Set<string>();
    if (initialExerciseId && selectedName === initialExerciseName) {
      ids.add(initialExerciseId);
    }
    const target = selectedName.trim().toLowerCase();
    for (const ex of exerciseCatalog) {
      if (ex.name.trim().toLowerCase() === target) {
        ids.add(ex.id);
      }
    }
    return Array.from(ids);
  }, [exerciseCatalog, selectedName, initialExerciseId, initialExerciseName]);

  // Busca metadados (grupo muscular + equipamento) da biblioteca quando vinculados
  const libraryId = useMemo(() => {
    const target = selectedName.trim().toLowerCase();
    return exerciseCatalog.find((e) => e.name.trim().toLowerCase() === target)?.exercise_library_id || null;
  }, [exerciseCatalog, selectedName]);

  const { data: libraryMeta } = useQuery({
    queryKey: ["evolution-exercise-meta", libraryId],
    enabled: open && !!libraryId,
    queryFn: async () => {
      const { data } = await supabase
        .from("exercise_library" as never)
        .select("muscle_group, equipment")
        .eq("id", libraryId!)
        .maybeSingle();
      return data as { muscle_group?: string | null; equipment?: string | null } | null;
    },
  });

  // Busca histórico real das sessões concluídas (set_logs + workout_sessions)
  const { data: historyEntries = [], isLoading: loadingHistory } = useQuery({
    queryKey: ["evolution-history", user?.id, matchingExerciseIds.join(",")],
    enabled: open && !!user?.id && matchingExerciseIds.length > 0,
    queryFn: () =>
      fetchExerciseEvolutionHistory({
        userId: user!.id,
        exerciseIds: matchingExerciseIds,
      }),
  });

  // Filtra pelo período (3M / 6M / 1A)
  const filteredEntries = useMemo(() => {
    if (historyEntries.length === 0) return [];
    const now = new Date();
    const months = period === "3M" ? 3 : period === "6M" ? 6 : 12;
    const cutoff = new Date(now.getFullYear(), now.getMonth() - months, now.getDate()).getTime();
    const inPeriod = historyEntries.filter((e) => new Date(e.dateIso).getTime() >= cutoff);
    return inPeriod.length > 0 ? inPeriod : historyEntries;
  }, [historyEntries, period]);

  const chartData = useMemo(() => {
    return filteredEntries.map((entry, idx) => {
      const val =
        activeTab === "e1rm"
          ? entry.best1RM
          : activeTab === "weight"
            ? entry.maxWeightKg
            : entry.sessionVolumeKg;
      return {
        dateLabel: entry.dateLabel,
        value: val,
        isLast: idx === filteredEntries.length - 1,
      };
    });
  }, [filteredEntries, activeTab]);

  const currentMetricVal = chartData.length > 0 ? chartData[chartData.length - 1].value : 0;
  const firstMetricVal = chartData.length > 0 ? chartData[0].value : 0;
  const diffVal = Math.round((currentMetricVal - firstMetricVal) * 10) / 10;
  const diffPct = firstMetricVal > 0 ? Math.round(((currentMetricVal - firstMetricVal) / firstMetricVal) * 100) : 0;

  const overallStats = useMemo(() => {
    let maxWeight = 0;
    let maxVolume = 0;
    let bestSet: { w: number; r: number } | null = null;
    for (const e of historyEntries) {
      if (e.maxWeightKg > maxWeight) maxWeight = e.maxWeightKg;
      if (e.sessionVolumeKg > maxVolume) maxVolume = e.sessionVolumeKg;
      if (
        !bestSet ||
        e.bestSetWeightKg > bestSet.w ||
        (e.bestSetWeightKg === bestSet.w && e.bestSetReps > bestSet.r)
      ) {
        bestSet = { w: e.bestSetWeightKg, r: e.bestSetReps };
      }
    }
    return { maxWeight, maxVolume, bestSet };
  }, [historyEntries]);

  const subtitleParts = [
    libraryMeta?.muscle_group || "Força",
    libraryMeta?.equipment || "Equipamento",
    `${historyEntries.length} ${historyEntries.length === 1 ? "sessão" : "sessões"}`,
  ];

  const periodLabel = period === "3M" ? "3 meses" : period === "6M" ? "6 meses" : "1 ano";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl border-border shadow-2xl">
        {/* Cabeçalho */}
        <div className="border-b border-border bg-card px-4 py-3.5 shrink-0 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-foreground hover:bg-muted"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-extrabold text-foreground leading-tight">
                {selectedName || "Evolução de Cargas"}
              </h2>
              <p className="truncate text-xs text-muted-foreground">
                {subtitleParts.join(" · ")}
              </p>
            </div>
          </div>

          {!initialExerciseName && exerciseNames.length > 1 && (
            <Select value={selectedName} onValueChange={setSelectedName}>
              <SelectTrigger className="h-9 text-xs font-semibold">
                <SelectValue placeholder="Selecione um exercício" />
              </SelectTrigger>
              <SelectContent>
                {exerciseNames.map((name) => (
                  <SelectItem key={name} value={name} className="text-xs">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Abas: 1RM estimado | Maior carga | Volume */}
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted/60 p-1">
            {(
              [
                { id: "e1rm", label: "1RM estimado" },
                { id: "weight", label: "Maior carga" },
                { id: "volume", label: "Volume" },
              ] as Array<{ id: EvolutionTab; label: string }>
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-lg py-1.5 text-xs font-bold transition-all",
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo Scrollável */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/15">
          {loadingHistory ? (
            <div className="flex items-center justify-center py-12 gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Carregando evolução…
            </div>
          ) : historyEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center space-y-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Dumbbell className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Nenhuma carga registrada…
              </p>
              <p className="text-xs text-muted-foreground">
                Conclua sessões com este exercício para acompanhar seu gráfico de evolução e recordes.
              </p>
            </div>
          ) : (
            <>
              {/* Card com Valor Atual + Variação + Filtros 3M/6M/1A + Gráfico */}
              <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="block text-2xl font-extrabold tabular-nums text-foreground">
                      {activeTab === "volume"
                        ? formatVolumeKgBR(currentMetricVal)
                        : `${formatDecimalBR(currentMetricVal)} kg`}
                    </span>
                    {chartData.length > 1 && (
                      <span
                        className={cn(
                          "mt-0.5 block text-xs font-bold",
                          diffVal >= 0 ? "text-emerald-600" : "text-muted-foreground"
                        )}
                      >
                        {diffVal >= 0 ? "+" : ""}
                        {formatDecimalBR(diffVal)} kg ({diffPct >= 0 ? `+${diffPct}%` : `${diffPct}%`}) em{" "}
                        {periodLabel}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 rounded-lg bg-muted/60 p-0.5">
                    {(["3M", "6M", "1A"] as PeriodFilter[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPeriod(p)}
                        className={cn(
                          "rounded-md px-2 py-1 text-[11px] font-bold transition-colors",
                          period === p
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="dateLabel"
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                        domain={["auto", "auto"]}
                      />
                      <Tooltip
                        formatter={(val: any) =>
                          activeTab === "volume"
                            ? [formatVolumeKgBR(Number(val)), "Volume"]
                            : [`${formatDecimalBR(Number(val))} kg`, activeTab === "e1rm" ? "1RM est." : "Carga"]
                        }
                        contentStyle={{
                          borderRadius: "12px",
                          fontSize: "12px",
                          borderColor: "hsl(var(--border))",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2.5}
                        dot={(props: any) => {
                          const { cx, cy, payload, index } = props;
                          if (cx === undefined || cy === undefined) return <g key={index} />;
                          return (
                            <circle
                              key={index}
                              cx={cx}
                              cy={cy}
                              r={payload.isLast ? 5 : 3.5}
                              fill={payload.isLast ? "#f97316" : "hsl(var(--primary))"}
                              stroke="#ffffff"
                              strokeWidth={1.5}
                            />
                          );
                        }}
                        activeDot={{ r: 6, fill: "#f97316" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 3 Mini Cards: Maior carga, Melhor série, Volume máximo */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-border bg-card p-3">
                  <span className="block text-[10px] font-semibold text-muted-foreground">
                    Maior carga
                  </span>
                  <span className="mt-0.5 block text-sm font-extrabold tabular-nums text-foreground">
                    {formatDecimalBR(overallStats.maxWeight)} kg
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-card p-3">
                  <span className="block text-[10px] font-semibold text-muted-foreground">
                    Melhor série
                  </span>
                  <span className="mt-0.5 block text-sm font-extrabold tabular-nums text-foreground">
                    {overallStats.bestSet
                      ? `${formatDecimalBR(overallStats.bestSet.w)} × ${overallStats.bestSet.r}`
                      : "—"}
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-card p-3">
                  <span className="block text-[10px] font-semibold text-muted-foreground">
                    Volume máx.
                  </span>
                  <span className="mt-0.5 block text-sm font-extrabold tabular-nums text-foreground">
                    {formatVolumeKgBR(overallStats.maxVolume)}
                  </span>
                </div>
              </div>

              {/* HISTÓRICO */}
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Histórico
                </h3>
                <div className="space-y-2">
                  {[...historyEntries].reverse().map((entry: ExerciseSessionHistoryEntry) => (
                    <div
                      key={entry.sessionId}
                      className="rounded-xl border border-border bg-card p-3.5 shadow-xs space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-foreground">
                          {formatHistorySessionDate(entry.dateIso)}
                        </span>
                        {entry.hasPR && (
                          <span className="rounded bg-orange-500/15 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-orange-600">
                            PR
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {entry.setsSummary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
