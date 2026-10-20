import { useState, useMemo, useEffect } from "react";
import { BODY_PATHS } from "./bodyPathsData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

// Chaves exatas do SVG em BODY_PATHS
export type SvgMuscleKey =
  | "chest"
  | "upper-back"
  | "lower-back"
  | "deltoids"
  | "trapezius"
  | "biceps"
  | "triceps"
  | "forearm"
  | "abs"
  | "obliques"
  | "quadriceps"
  | "hamstring"
  | "gluteal"
  | "calves"
  | "adductors"
  | "serratus"
  | "hip-flexors";

const MUSCLE_LABELS_BR: Record<SvgMuscleKey, string> = {
  chest: "Peitoral",
  "upper-back": "Dorsais / Costas",
  "lower-back": "Lombar",
  deltoids: "Ombros / Deltoides",
  trapezius: "Trapézio",
  biceps: "Bíceps",
  triceps: "Tríceps",
  forearm: "Antebraços",
  abs: "Abdômen / Core",
  obliques: "Oblíquos",
  quadriceps: "Quadríceps",
  hamstring: "Posterior de Coxa",
  gluteal: "Glúteos",
  calves: "Panturrilhas",
  adductors: "Adutores",
  serratus: "Serrátil",
  "hip-flexors": "Flexores do Quadril",
};

// Regras de correlação entre os exercícios da biblioteca (nomes e muscle_group) e os pontos exatos do mapa SVG
function matchMusclesForExercise(nameRaw: string, groupRaw?: string | null, targetRaw?: string | null): SvgMuscleKey[] {
  const text = `${nameRaw} ${groupRaw || ""} ${targetRaw || ""}`.toLowerCase();
  const matched = new Set<SvgMuscleKey>();

  // --- Peitoral ---
  if (
    /supino|peito|crucifixo|peck|voador|cross\s*over|crossover|flex[aã]o\s*de\s*bra[cç]o|chest/.test(text)
  ) {
    matched.add("chest");
    if (/supino|flex[aã]o|paralela/.test(text)) {
      matched.add("triceps");
      matched.add("deltoids");
    }
  }

  // --- Costas & Dorsais ---
  if (
    /puxada|pulldown|pull\s*down|remada|barra\s*fixa|chin\s*up|pull\s*up|serrote|cavalinho|dorsal|costas|latissimus|lat\b/.test(text)
  ) {
    matched.add("upper-back");
    matched.add("biceps");
  }

  // --- Trapézio ---
  if (/encolhimento|trap[eé]zio|face\s*pull|remada\s*alta|shrug/.test(text)) {
    matched.add("trapezius");
    matched.add("deltoids");
  }

  // --- Ombros / Deltoides ---
  if (
    /desenvolvimento|eleva[cç][aã]o\s*lateral|eleva[cç][aã]o\s*frontal|ombro|deltoide|arnold|militar|shoulder|crucifixo\s*inverso/.test(text)
  ) {
    matched.add("deltoids");
    if (/desenvolvimento|militar|arnold/.test(text)) {
      matched.add("triceps");
    }
  }

  // --- Bíceps ---
  if (/rosca|b[ií]ceps|scott|martelo|concentrada|biceps/.test(text)) {
    matched.add("biceps");
    matched.add("forearm");
  }

  // --- Tríceps ---
  if (/tr[ií]ceps|testa|corda|coice|paralela|franc[eê]s|mergulho|pulley\s*tr[ií]ceps/.test(text)) {
    matched.add("triceps");
  }

  // --- Antebraço / Punho ---
  if (/antebra[cç]o|punho|wrist|grip/.test(text)) {
    matched.add("forearm");
  }

  // --- Quadríceps & Coxa Anterior ---
  if (
    /agachamento|squat|leg\s*press|extensora|afundo|passada|avan[cç]o|b[uú]lgaro|hack|sissy|quadr[ií]ceps/.test(text)
  ) {
    matched.add("quadriceps");
    matched.add("gluteal");
  }

  // --- Posterior de Coxa & Isquiotibiais ---
  if (
    /flexora|mesa\s*flexora|cadeira\s*flexora|stiff|rdl|isquiotibiais|posterior\s*de\s*coxa|hamstring|bom\s*dia|good\s*morning/.test(text)
  ) {
    matched.add("hamstring");
    matched.add("gluteal");
  }

  // --- Levantamento Terra / Deadlift ---
  if (/terra|deadlift/.test(text)) {
    matched.add("hamstring");
    matched.add("gluteal");
    matched.add("lower-back");
    matched.add("trapezius");
  }

  // --- Glúteos ---
  if (
    /eleva[cç][aã]o\s*p[eé]lvica|hip\s*thrust|gl[uú]teo|abdu[cç][aã]o|abdutora|coice\s*gl[uú]teo|glute/.test(text)
  ) {
    matched.add("gluteal");
  }

  // --- Adutores ---
  if (/adutor|adu[cç][aã]o|adductor/.test(text)) {
    matched.add("adductors");
  }

  // --- Panturrilhas ---
  if (/panturrilha|g[eê]meos|solear|s[oó]leo|eleva[cç][aã]o\s*plantar|calves|calf/.test(text)) {
    matched.add("calves");
  }

  // --- Abdômen / Core Anterior ---
  if (
    /abdominal|prancha|infra|supra|crunch|sit\s*up|canivete|remador|core|dead\s*bug|escalador/.test(text)
  ) {
    matched.add("abs");
  }

  // --- Oblíquos ---
  if (/obl[ií]quo|rota[cç][aã]o|twist|lateral\s*core|pallof/.test(text)) {
    matched.add("obliques");
  }

  // --- Lombar ---
  if (/lombar|hiperextens[aã]o|superman|perdigueiro|lower\s*back/.test(text)) {
    matched.add("lower-back");
  }

  // --- Fallback por muscle_group da Biblioteca oficial do Studio ---
  if (matched.size === 0 && groupRaw) {
    const g = groupRaw.toLowerCase();
    if (g.includes("peito")) matched.add("chest");
    else if (g.includes("costa")) {
      matched.add("upper-back");
      matched.add("trapezius");
    } else if (g.includes("ombro")) matched.add("deltoids");
    else if (g.includes("braço") || g.includes("braco")) {
      matched.add("biceps");
      matched.add("triceps");
    } else if (g.includes("perna")) {
      matched.add("quadriceps");
      matched.add("hamstring");
      matched.add("calves");
    } else if (g.includes("glúteo") || g.includes("gluteo")) matched.add("gluteal");
    else if (g.includes("core")) matched.add("abs");
  }

  return Array.from(matched);
}

export function MuscleHeatmap({
  exercises = [],
  className,
  showToggle = true,
}: MuscleHeatmapProps) {
  const [view, setView] = useState<"front" | "back">("front");

  // Identifica músculos ativos com correlação precisa aos caminhos do SVG
  const activeMuscles = useMemo(() => {
    const scores: Record<string, number> = {};

    for (const ex of exercises) {
      const matchedKeys = matchMusclesForExercise(ex.name, ex.muscle_group, ex.target_muscle);
      for (const key of matchedKeys) {
        scores[key] = (scores[key] || 0) + 1;
      }
    }

    return scores;
  }, [exercises]);

  // Escolhe automaticamente a vista predominante (Costas se posterior for dominante)
  useEffect(() => {
    const backCount =
      (activeMuscles["upper-back"] || 0) +
      (activeMuscles["lower-back"] || 0) +
      (activeMuscles["gluteal"] || 0) +
      (activeMuscles["hamstring"] || 0);
    const frontCount =
      (activeMuscles["chest"] || 0) +
      (activeMuscles["abs"] || 0) +
      (activeMuscles["quadriceps"] || 0) +
      (activeMuscles["biceps"] || 0);

    if (backCount > frontCount && backCount > 0) {
      setView("back");
    } else if (frontCount > 0) {
      setView("front");
    }
  }, [activeMuscles]);

  const frontData = (BODY_PATHS as any)?.male?.front;
  const backData = (BODY_PATHS as any)?.male?.back;
  const currentData = view === "front" ? frontData : backData;
  const viewBox = currentData?.vb || "0 95 727 1280";
  const muscleGroups = currentData?.p || {};

  const activeEntries = Object.entries(activeMuscles)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

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

            // Calor dinâmico: mais estímulo = cor mais viva e luminosa
            const fillColor = isActive
              ? count >= 3
                ? "#ec4899" // Rosa/Rubi vibrante para alto volume
                : count === 2
                ? "#8b5cf6" // Violeta
                : "#6366f1" // Índigo
              : "currentColor";

            const fillOpacity = isActive ? 0.92 : 0.14;
            const strokeColor = isActive ? "#ffffff" : "currentColor";
            const strokeOpacity = isActive ? 0.9 : 0.22;

            return (
              <g
                key={muscleKey}
                className={cn(
                  "transition-all duration-300",
                  isActive
                    ? "cursor-pointer filter hover:brightness-125"
                    : "text-muted-foreground/35"
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
                      strokeWidth={isActive ? 1.8 : 0.8}
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
              {(MUSCLE_LABELS_BR as any)[muscleKey] || muscleKey} ({count}x)
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}
