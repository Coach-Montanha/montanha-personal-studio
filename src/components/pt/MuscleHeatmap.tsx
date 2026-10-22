import { useState, useMemo } from "react";
import { BODY_PATHS } from "./bodyPathsData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ExerciseItem {
  name: string;
  sets_reps?: string | null;
  target_muscle?: string | null;
  muscle_group?: string | null;
  primary_muscles?: string[] | null;
  secondary_muscles?: string[] | null;
}

interface MuscleHeatmapProps {
  exercises: ExerciseItem[];
  className?: string;
  showToggle?: boolean;
  defaultLayout?: "dual" | "single";
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

export const MUSCLE_LABELS_BR: Record<SvgMuscleKey, string> = {
  chest: "Peitoral",
  "upper-back": "Dorsais / Costas",
  "lower-back": "Lombar",
  deltoids: "Deltoides / Ombros",
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

interface MuscleMatchResult {
  primary: SvgMuscleKey[];
  secondary: SvgMuscleKey[];
}

/**
 * Mapeamento anatômico de alta fidelidade: separa motores primários de sinergistas/secundários.
 * Inspirado nas diretrizes ergonômicas de biomecânica dos aparelhos de musculação.
 */
export function matchMusclesForExercise(
  nameRaw: string,
  groupRaw?: string | null,
  targetRaw?: string | null,
): MuscleMatchResult {
  const text = `${nameRaw} ${groupRaw || ""} ${targetRaw || ""}`.toLowerCase();
  const primary = new Set<SvgMuscleKey>();
  const secondary = new Set<SvgMuscleKey>();

  // --- Peitoral (Supinos, Crucifixos, Paralelas) ---
  if (
    /supino|peito|crucifixo|peck|voador|cross\s*over|crossover|flex[aã]o\s*de\s*bra[cç]o|chest/.test(
      text,
    )
  ) {
    primary.add("chest");
    if (/supino|flex[aã]o/.test(text)) {
      secondary.add("triceps");
      secondary.add("deltoids");
    } else if (/crucifixo|crossover|voador/.test(text)) {
      secondary.add("deltoids");
      secondary.add("serratus");
    }
  }

  // --- Costas & Dorsais (Puxadas e Remadas) ---
  if (
    /puxada|pulldown|pull\s*down|remada|barra\s*fixa|chin\s*up|pull\s*up|serrote|cavalinho|dorsal|costas|latissimus|lat\b/.test(
      text,
    )
  ) {
    primary.add("upper-back");
    secondary.add("biceps");
    secondary.add("deltoids");

    if (/puxada|pulldown|barra\s*fixa/.test(text)) {
      secondary.add("trapezius");
      if (/alta/.test(text)) {
        secondary.add("chest"); // Peitoral menor destacado no sticker oficial
      }
    }
    if (/remada|serrote|cavalinho/.test(text)) {
      secondary.add("trapezius");
      secondary.add("forearm");
      secondary.add("lower-back");
    }
  }

  // --- Ombros / Deltoides ---
  if (
    /desenvolvimento|eleva[cç][aã]o\s*lateral|eleva[cç][aã]o\s*frontal|ombro|deltoide|arnold|militar|shoulder/.test(
      text,
    )
  ) {
    primary.add("deltoids");
    if (/desenvolvimento|militar|arnold/.test(text)) {
      secondary.add("triceps");
      secondary.add("trapezius");
    } else {
      secondary.add("trapezius");
      secondary.add("serratus");
    }
  }

  // --- Deltoide Posterior / Face Pull / Crucifixo Inverso ---
  if (/crucifixo\s*inverso|face\s*pull|posterior\s*de\s*ombro|deltoide\s*posterior/.test(text)) {
    primary.add("deltoids");
    secondary.add("trapezius");
    secondary.add("upper-back");
  }

  // --- Trapézio ---
  if (/encolhimento|trap[eé]zio|remada\s*alta|shrug/.test(text)) {
    primary.add("trapezius");
    secondary.add("deltoids");
    secondary.add("forearm");
  }

  // --- Bíceps ---
  if (/rosca|b[ií]ceps|scott|martelo|concentrada|biceps/.test(text)) {
    primary.add("biceps");
    secondary.add("forearm");
  }

  // --- Tríceps ---
  if (/tr[ií]ceps|testa|corda|coice|paralela|franc[eê]s|mergulho|pulley\s*tr[ií]ceps/.test(text)) {
    primary.add("triceps");
    if (/paralela|mergulho/.test(text)) {
      secondary.add("chest");
      secondary.add("deltoids");
    } else {
      secondary.add("forearm");
    }
  }

  // --- Antebraço / Punho ---
  if (/antebra[cç]o|punho|wrist|grip/.test(text)) {
    primary.add("forearm");
  }

  // --- Quadríceps & Coxa Anterior ---
  if (
    /agachamento|squat|leg\s*press|extensora|afundo|passada|avan[cç]o|b[uú]lgaro|hack|sissy|quadr[ií]ceps/.test(
      text,
    )
  ) {
    primary.add("quadriceps");
    if (/agachamento|leg\s*press|afundo|passada|b[uú]lgaro|hack/.test(text)) {
      secondary.add("gluteal");
      secondary.add("adductors");
      secondary.add("calves");
    }
  }

  // --- Posterior de Coxa & Isquiotibiais ---
  if (
    /flexora|mesa\s*flexora|cadeira\s*flexora|stiff|rdl|isquiotibiais|posterior\s*de\s*coxa|hamstring|bom\s*dia|good\s*morning/.test(
      text,
    )
  ) {
    primary.add("hamstring");
    secondary.add("gluteal");
    secondary.add("lower-back");
  }

  // --- Levantamento Terra / Deadlift ---
  if (/terra|deadlift/.test(text)) {
    primary.add("hamstring");
    primary.add("gluteal");
    primary.add("lower-back");
    secondary.add("upper-back");
    secondary.add("trapezius");
    secondary.add("quadriceps");
    secondary.add("forearm");
  }

  // --- Glúteos ---
  if (
    /eleva[cç][aã]o\s*p[eé]lvica|hip\s*thrust|gl[uú]teo|abdu[cç][aã]o|abdutora|coice\s*gl[uú]teo|glute/.test(
      text,
    )
  ) {
    primary.add("gluteal");
    secondary.add("hamstring");
    secondary.add("lower-back");
  }

  // --- Adutores ---
  if (/adutor|adu[cç][aã]o|adductor/.test(text)) {
    primary.add("adductors");
    secondary.add("quadriceps");
  }

  // --- Panturrilhas ---
  if (/panturrilha|g[eê]meos|solear|s[oó]leo|eleva[cç][aã]o\s*plantar|calves|calf/.test(text)) {
    primary.add("calves");
  }

  // --- Abdômen / Core Anterior ---
  if (
    /abdominal|prancha|infra|supra|crunch|sit\s*up|canivete|remador|core|dead\s*bug|escalador/.test(
      text,
    )
  ) {
    primary.add("abs");
    secondary.add("obliques");
    secondary.add("hip-flexors");
  }

  // --- Oblíquos ---
  if (/obl[ií]quo|rota[cç][aã]o|twist|lateral\s*core|pallof/.test(text)) {
    primary.add("obliques");
    secondary.add("abs");
  }

  // --- Lombar ---
  if (/lombar|hiperextens[aã]o|superman|perdigueiro|lower\s*back/.test(text)) {
    primary.add("lower-back");
    secondary.add("gluteal");
  }

  // --- Fallback por muscle_group da Biblioteca oficial do Studio ---
  if (primary.size === 0 && groupRaw) {
    const g = groupRaw.toLowerCase();
    if (g.includes("peito")) {
      primary.add("chest");
      secondary.add("triceps");
    } else if (g.includes("costa")) {
      primary.add("upper-back");
      secondary.add("biceps");
    } else if (g.includes("ombro")) {
      primary.add("deltoids");
      secondary.add("trapezius");
    } else if (g.includes("braço") || g.includes("braco")) {
      primary.add("biceps");
      primary.add("triceps");
    } else if (g.includes("perna")) {
      primary.add("quadriceps");
      secondary.add("hamstring");
      secondary.add("calves");
    } else if (g.includes("glúteo") || g.includes("gluteo")) {
      primary.add("gluteal");
    } else if (g.includes("core")) {
      primary.add("abs");
    }
  }

  // Garante que o músculo primário não apareça duplicado como secundário
  primary.forEach((m) => secondary.delete(m));

  return {
    primary: Array.from(primary),
    secondary: Array.from(secondary),
  };
}

interface BodyViewData {
  vb: string;
  p: Record<string, string[]>;
}

type BodyPathsType = Record<string, Record<string, BodyViewData>>;

export function MuscleHeatmap({
  exercises = [],
  className,
  showToggle = true,
  defaultLayout = "dual",
}: MuscleHeatmapProps) {
  const [layoutMode, setLayoutMode] = useState<"dual" | "front" | "back">(defaultLayout);
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

  // Computa a ativação ponderada primária e secundária
  const { primaryCounts, secondaryCounts } = useMemo(() => {
    const prim: Record<string, number> = {};
    const sec: Record<string, number> = {};

    for (const ex of exercises) {
      const match = matchMusclesForExercise(ex.name, ex.muscle_group, ex.target_muscle);
      for (const p of match.primary) {
        prim[p] = (prim[p] || 0) + 1;
      }
      for (const s of match.secondary) {
        // Se já for primário em outro exercício da mesma sessão, primário tem prioridade
        if (!prim[s]) {
          sec[s] = (sec[s] || 0) + 1;
        }
      }
    }

    // Limpa secundários que também foram promovidos a primários
    for (const key of Object.keys(prim)) {
      delete sec[key];
    }

    return { primaryCounts: prim, secondaryCounts: sec };
  }, [exercises]);

  const bodyData = BODY_PATHS as unknown as BodyPathsType;
  const frontData = bodyData?.male?.front;
  const backData = bodyData?.male?.back;

  const renderSilhouette = (viewType: "front" | "back", label: string) => {
    const data = viewType === "front" ? frontData : backData;
    const viewBox = data?.vb || "0 95 727 1280";
    const muscleGroups = data?.p || {};

    return (
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground/80 mb-1">
          {label}
        </span>
        <div className="relative w-full max-w-[155px] sm:max-w-[170px] aspect-[727/1280] flex items-center justify-center bg-slate-950/50 rounded-xl p-1.5 border border-slate-800/80 shadow-inner">
          <svg viewBox={viewBox} className="w-full h-full filter drop-shadow-sm transition-all">
            {Object.entries(muscleGroups).map(([muscleKey, paths]) => {
              const isPrimary = (primaryCounts[muscleKey] || 0) > 0;
              const isSecondary = (secondaryCounts[muscleKey] || 0) > 0;
              const isHovered = hoveredMuscle === muscleKey;

              // Paleta realista inspirada na foto do adesivo do aparelho de musculação:
              // - Primário: Vermelho/Coral vibrante (#ef4444)
              // - Secundário / Sinergista: Âmbar/Dourado de alta visibilidade (#f59e0b)
              // - Inativo: Grafite anatômico escuro com contornos cirúrgicos (#334155 / #1e293b)
              let fillColor = "#1e293b";
              let fillOpacity = 0.55;
              let strokeColor = "#475569";
              let strokeWidth = 0.9;
              let strokeOpacity = 0.4;
              let filter = "none";

              if (isPrimary) {
                fillColor = isHovered ? "#ff2a2a" : "#ef4444";
                fillOpacity = 0.95;
                strokeColor = "#ffffff";
                strokeWidth = 1.6;
                strokeOpacity = 0.95;
                filter = "drop-shadow(0 0 5px rgba(239, 68, 68, 0.75))";
              } else if (isSecondary) {
                fillColor = isHovered ? "#fbbf24" : "#f59e0b";
                fillOpacity = 0.88;
                strokeColor = "#fef08a";
                strokeWidth = 1.3;
                strokeOpacity = 0.85;
                filter = "drop-shadow(0 0 4px rgba(245, 158, 11, 0.6))";
              }

              return (
                <g
                  key={muscleKey}
                  onMouseEnter={() => setHoveredMuscle(muscleKey)}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  className={cn(
                    "transition-all duration-200 cursor-pointer",
                    (isPrimary || isSecondary) && "hover:brightness-125",
                  )}
                  style={{ filter }}
                >
                  {Array.isArray(paths) &&
                    paths.map((d: string, pIdx: number) => (
                      <path
                        key={pIdx}
                        d={d}
                        fill={fillColor}
                        fillOpacity={fillOpacity}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeOpacity={strokeOpacity}
                      />
                    ))}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const primaryEntries = Object.entries(primaryCounts).sort((a, b) => b[1] - a[1]);
  const secondaryEntries = Object.entries(secondaryCounts).sort((a, b) => b[1] - a[1]);
  const totalInvolved = primaryEntries.length + secondaryEntries.length;

  return (
    <div
      className={cn(
        "flex flex-col items-center select-none w-full bg-slate-950/30 rounded-2xl p-3 border border-border/40",
        className,
      )}
    >
      {/* Header com Legenda e Controles */}
      <div className="w-full flex items-center justify-between mb-2.5 pb-2 border-b border-border/30">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
            <span className="font-semibold text-red-400">Primário</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <span className="font-semibold text-amber-300">Secundário</span>
          </div>
        </div>

        {showToggle && (
          <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-border/40 text-[11px]">
            <Button
              type="button"
              size="sm"
              variant={layoutMode === "dual" ? "default" : "ghost"}
              className="h-6 text-[10px] px-2 py-0"
              onClick={() => setLayoutMode("dual")}
            >
              Duplo (2 em 1)
            </Button>
            <Button
              type="button"
              size="sm"
              variant={layoutMode === "front" ? "default" : "ghost"}
              className="h-6 text-[10px] px-2 py-0"
              onClick={() => setLayoutMode("front")}
            >
              Frente
            </Button>
            <Button
              type="button"
              size="sm"
              variant={layoutMode === "back" ? "default" : "ghost"}
              className="h-6 text-[10px] px-2 py-0"
              onClick={() => setLayoutMode("back")}
            >
              Costas
            </Button>
          </div>
        )}
      </div>

      {/* Silhuetas Anatômicas (Lado a Lado como no adesivo ou Alternadas) */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 w-full py-1">
        {layoutMode === "dual" ? (
          <>
            {renderSilhouette("front", "Vista Anterior (Frente)")}
            {renderSilhouette("back", "Vista Posterior (Costas)")}
          </>
        ) : layoutMode === "front" ? (
          renderSilhouette("front", "Vista Anterior (Frente)")
        ) : (
          renderSilhouette("back", "Vista Posterior (Costas)")
        )}
      </div>

      {/* Lista de Músculos Alvo da Sessão (Primários e Secundários) */}
      <div className="w-full mt-3 pt-2.5 border-t border-border/30 flex flex-col gap-2">
        {totalInvolved === 0 ? (
          <span className="text-xs text-center text-muted-foreground italic">
            Nenhum exercício com mapeamento anatômico cadastrado
          </span>
        ) : (
          <>
            {/* Primários */}
            {primaryEntries.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 mr-1">
                  Motores Principais:
                </span>
                {primaryEntries.map(([muscleKey, count]) => (
                  <Badge
                    key={muscleKey}
                    onMouseEnter={() => setHoveredMuscle(muscleKey)}
                    onMouseLeave={() => setHoveredMuscle(null)}
                    className={cn(
                      "text-[10px] px-2 py-0.5 border border-red-500/50 bg-red-500/15 text-red-300 font-medium transition-all cursor-pointer",
                      hoveredMuscle === muscleKey && "ring-1 ring-red-400 bg-red-500/30 text-white",
                    )}
                  >
                    {MUSCLE_LABELS_BR[muscleKey as SvgMuscleKey] || muscleKey} ({count}x)
                  </Badge>
                ))}
              </div>
            )}

            {/* Secundários / Sinergistas */}
            {secondaryEntries.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 mr-1">
                  Sinergistas / Auxiliares:
                </span>
                {secondaryEntries.map(([muscleKey, count]) => (
                  <Badge
                    key={muscleKey}
                    onMouseEnter={() => setHoveredMuscle(muscleKey)}
                    onMouseLeave={() => setHoveredMuscle(null)}
                    className={cn(
                      "text-[10px] px-2 py-0.5 border border-amber-500/50 bg-amber-500/15 text-amber-300 font-medium transition-all cursor-pointer",
                      hoveredMuscle === muscleKey &&
                        "ring-1 ring-amber-400 bg-amber-500/30 text-white",
                    )}
                  >
                    {MUSCLE_LABELS_BR[muscleKey as SvgMuscleKey] || muscleKey} ({count}x)
                  </Badge>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
