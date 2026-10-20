import { useState, useMemo } from "react";
import { BODY_PATHS } from "./bodyPathsData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Activity, RotateCcw } from "lucide-react";

interface MuscleHeatmapProps {
  exercises: Array<{
    name: string;
    sets_reps?: string | null;
    target_muscle?: string | null;
    muscle_group?: string | null;
  }>;
  className?: string;
  showToggle?: boolean;
}

// Mapeador de palavras-chave do nome do exercício para chaves do SVG
const MUSCLE_KEYWORDS: Record<string, string[]> = {
  chest: ["supino", "peito", "crucifixo", "peck", "voador", "flexão", "crossover", "cross over", "chest"],
  lats: ["puxada", "remada", "barra fixa", "pulldown", "pull down", "dorsal", "costas", "serrote", "cavalinho", "lat"],
  deltoids: ["elevação lateral", "elevação frontal", "desenvolvimento", "ombro", "deltoide", "arnold", "militar", "shoulder"],
  traps: ["encolhimento", "trapézio", "face pull", "remada alta"],
  biceps: ["rosca", "bíceps", "biceps", "scott", "martelo", "concentrada"],
  triceps: ["tríceps", "triceps", "testa", "corda", "coice", "paralela", "francês", "mergulho"],
  abs: ["abdominal", "prancha", "infra", "supra", "core", "abs", "sit-up", "crunch"],
  obliques: ["oblíquo", "lateral", "rotação", "twist", "pallof"],
  quadriceps: ["agachamento", "leg press", "extensora", "afundo", "passada", "búlgaro", "squat", "quadríceps", "quadriceps", "sissy"],
  hamstrings: ["flexora", "stiff", "rdl", "posterior", "isquiotibiais", "deadlift", "terra", "bom dia"],
  glutes: ["elevação pélvica", "glúteo", "gluteo", "abdução", "abdutora", "coice", "pelvic"],
  calves: ["panturrilha", "panturrilhas", "gêmeos", "calves", "solear"],
  forearms: ["antebraço", "punho", "wrist"],
};

const MUSCLE_LABELS_BR: Record<string, string> = {
  chest: "Peitoral",
  lats: "Dorsais / Costas",
  deltoids: "Ombros / Deltoides",
  traps: "Trapézio",
  biceps: "Bíceps",
  triceps: "Tríceps",
  abs: "Abdômen / Core",
  obliques: "Oblíquos",
  quadriceps: "Quadríceps",
  hamstrings: "Posterior de Coxa",
  glutes: "Glúteos",
  calves: "Panturrilhas",
  forearms: "Antebraços",
};

export function MuscleHeatmap({
  exercises = [],
  className,
  showToggle = true,
}: MuscleHeatmapProps) {
  const [view, setView] = useState<"front" | "back">("front");

  // Identifica músculos ativos a partir dos exercícios do dia
  const activeMuscles = useMemo(() => {
    const scores: Record<string, number> = {};

    for (const ex of exercises) {
      const name = (ex.name || "").toLowerCase();
      const target = (ex.target_muscle || ex.muscle_group || "").toLowerCase();

      for (const [muscleKey, keywords] of Object.entries(MUSCLE_KEYWORDS)) {
        if (
          keywords.some((kw) => name.includes(kw)) ||
          keywords.some((kw) => target.includes(kw)) ||
          muscleKey === target
        ) {
          scores[muscleKey] = (scores[muscleKey] || 0) + 1;
        }
      }
    }

    return scores;
  }, [exercises]);

  const frontData = (BODY_PATHS as any)?.male?.front;
  const backData = (BODY_PATHS as any)?.male?.back;
  const currentData = view === "front" ? frontData : backData;
  const viewBox = currentData?.vb || "0 95 727 1280";
  const muscleGroups = currentData?.p || {};

  const activeEntries = Object.entries(activeMuscles).sort((a, b) => b[1] - a[1]);

  return (
    <div className={cn("flex flex-col items-center select-none", className)}>
      {/* Controles de Visão */}
      {showToggle && (
        <div className="flex items-center gap-1.5 mb-2 bg-muted/60 p-1 rounded-lg border border-border/50 text-xs">
          <Button
            type="button"
            size="sm"
            variant={view === "front" ? "default" : "ghost"}
            className="h-6 text-xs px-2.5 py-0"
            onClick={() => setView("front")}
          >
            Frente
          </Button>
          <Button
            type="button"
            size="sm"
            variant={view === "back" ? "default" : "ghost"}
            className="h-6 text-xs px-2.5 py-0"
            onClick={() => setView("back")}
          >
            Costas
          </Button>
        </div>
      )}

      {/* SVG Anatômico */}
      <div className="relative w-full max-w-[220px] aspect-[727/1280] flex items-center justify-center bg-slate-950/20 dark:bg-slate-950/40 rounded-xl p-2 border border-border/30">
        <svg
          viewBox={viewBox}
          className="w-full h-full filter drop-shadow-sm transition-all"
        >
          {Object.entries(muscleGroups).map(([muscleKey, paths]: [string, any]) => {
            const count = activeMuscles[muscleKey] || 0;
            const isActive = count > 0;

            // Cores dinâmicas de acordo com o calor muscular
            const fillColor = isActive
              ? count > 2
                ? "#8b5cf6" // Violeta intenso para grupos primários com muitas séries
                : "#6366f1" // Índigo vibrante
              : "currentColor";

            const fillOpacity = isActive ? 0.9 : 0.16;
            const strokeColor = isActive ? "#c4b5fd" : "currentColor";
            const strokeOpacity = isActive ? 0.8 : 0.25;

            return (
              <g
                key={muscleKey}
                className={cn(
                  "transition-all duration-300",
                  isActive
                    ? "cursor-pointer filter hover:brightness-125"
                    : "text-muted-foreground/40"
                )}
              >
                {Array.isArray(paths) &&
                  paths.map((d: string, pIdx: number) => (
                    <path
                      key={pIdx}
                      d={d}
                      fill={fillColor}
                      fillOpacity={fillOpacity}
                      stroke={strokeColor}
                      strokeWidth={isActive ? 2 : 1}
                      strokeOpacity={strokeOpacity}
                    />
                  ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Badges de Grupos Ativos */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 max-w-xs">
        {activeEntries.length === 0 ? (
          <span className="text-[11px] text-muted-foreground italic">
            Nenhum grupo mapeado neste treino
          </span>
        ) : (
          activeEntries.map(([muscleKey, count]) => (
            <Badge
              key={muscleKey}
              variant="outline"
              className="text-[10px] px-2 py-0.5 border-primary/40 bg-primary/10 text-primary font-medium"
            >
              {MUSCLE_LABELS_BR[muscleKey] || muscleKey} ({count}x)
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}
