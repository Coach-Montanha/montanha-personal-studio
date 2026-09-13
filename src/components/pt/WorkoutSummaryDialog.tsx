import { useEffect, useState, useRef, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Camera,
  Image as ImageIcon,
  Trophy,
  TrendingUp,
  Download,
  Share2,
  X,
  ArrowLeft,
  MessageCircle,
  Sparkles,
  Calendar,
  CheckCircle2,
  Dumbbell
} from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface WorkoutSummaryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayName: string;
  duration: number; // in seconds
  exercises: any[];
  loads: Record<string, string>;
  feedback: string;
  executionId?: string;
  initialExcludedExercises?: string[];
  onExcludedExercisesChange?: (excludedIds: string[]) => void;
  completedSets?: Record<string, number[]>;
  doneExercises?: Record<string, boolean> | string[];
  previousExecutions?: Array<{ id: string; training_day_id?: string; executed_at: string; notes: string | null }>;
  studentName?: string;
}

function parseNumericLoad(s?: string | number | null): number | null {
  if (s === null || s === undefined) return null;
  if (typeof s === "number") return s;
  const cleaned = String(s).replace(",", ".").trim();
  const m = cleaned.match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
}

function parseReps(s?: string | number | null): number {
  if (typeof s === "number") return s;
  if (!s) return 10;
  const cleaned = String(s).toLowerCase();
  const matchReps = cleaned.match(/(?:x\s*)?(\d+)(?:\s*-\s*\d+)?/);
  if (matchReps && matchReps[1]) {
    const val = parseInt(matchReps[1], 10);
    return isNaN(val) || val <= 0 ? 10 : val;
  }
  return 10;
}

export function WorkoutSummaryDialog({
  open,
  onOpenChange,
  dayName,
  duration,
  exercises,
  loads,
  feedback,
  executionId,
  initialExcludedExercises,
  onExcludedExercisesChange,
  completedSets,
  doneExercises: doneProp,
  previousExecutions = [],
  studentName = "Aluno",
}: WorkoutSummaryProps) {
  const [viewMode, setViewMode] = useState<"summary" | "share">("summary");
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [excludedIds, setExcludedIds] = useState<string[]>(initialExcludedExercises || []);

  const storyCardRef = useRef<HTMLDivElement>(null);

  const candidateExercises = useMemo(() => {
    return exercises.filter((ex) => !ex.substitute_exercise_id);
  }, [exercises]);

  const isExercisePerformed = (ex: any) => {
    const isDone = Array.isArray(doneProp)
      ? doneProp.includes(ex.id)
      : !!doneProp?.[ex.id];
    const sets = completedSets?.[ex.id];
    const hasSets = Array.isArray(sets) && sets.length > 0;
    const hasLoad = !!(loads && loads[ex.id] && String(loads[ex.id]).trim());
    if (completedSets !== undefined || doneProp !== undefined) {
      return isDone || hasSets || hasLoad;
    }
    return true;
  };

  useEffect(() => {
    if (open) {
      setViewMode("summary");
      const unperformedIds = candidateExercises
        .filter((ex) => !isExercisePerformed(ex))
        .map((ex) => ex.id);
      const combined = Array.from(new Set([...(initialExcludedExercises || []), ...unperformedIds]));
      setExcludedIds(combined);
    }
  }, [open, initialExcludedExercises]);

  useEffect(() => {
    async function loadLogo() {
      const { data } = await supabase
        .from("studio_settings")
        .select("logo_pt_base64")
        .maybeSingle();
      
      if (data?.logo_pt_base64) {
        setLogoImage(data.logo_pt_base64);
      } else {
        const savedLogo = localStorage.getItem("coach.logo.pt");
        if (savedLogo) {
          setLogoImage(savedLogo);
        }
      }
    }
    
    if (open) {
      loadLogo();
    }
  }, [open]);

  const performedList = useMemo(() => {
    return candidateExercises.filter((ex) => !excludedIds.includes(ex.id));
  }, [candidateExercises, excludedIds]);

  // Cálculos precisos conforme Hevy / Hevy App e capturas do usuário:
  // 1. Duração humana
  const durationHours = Math.floor(duration / 3600);
  const durationMins = Math.floor((duration % 3600) / 60);
  const durationHuman = durationHours > 0
    ? `${durationHours}h${String(durationMins).padStart(2, "0")}`
    : `${Math.max(1, durationMins)}min`;

  // 2. Repetições totais realizadas
  const totalReps = useMemo(() => {
    return performedList.reduce((acc, ex) => {
      const sets = completedSets?.[ex.id];
      const count = Array.isArray(sets) && sets.length > 0 ? sets.length : (typeof ex.series === "number" && ex.series > 0 ? ex.series : 3);
      const reps = parseReps(ex.sets_reps);
      return acc + (count * reps);
    }, 0);
  }, [performedList, completedSets]);

  // 3. Tonelagem / Volume total (kg)
  const totalVolumeKg = useMemo(() => {
    return performedList.reduce((acc, ex) => {
      const sets = completedSets?.[ex.id];
      const count = Array.isArray(sets) && sets.length > 0 ? sets.length : (typeof ex.series === "number" && ex.series > 0 ? ex.series : 3);
      const reps = parseReps(ex.sets_reps);
      const loadVal = parseNumericLoad(loads[ex.id] || ex.load) || 0;
      return acc + (count * reps * loadVal);
    }, 0);
  }, [performedList, completedSets, loads]);

  const formattedVolume = `${Math.round(totalVolumeKg).toLocaleString("pt-BR")}kg`;

  // 4. Data de início e fim
  const now = new Date();
  const startDate = new Date(now.getTime() - Math.max(60, duration) * 1000);
  const formatDateTime = (d: Date) => {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${mins}`;
  };

  // 5. Recordes Pessoais (Melhor carga por exercício comparado com histórico)
  const personalRecords = useMemo(() => {
    const list: Array<{
      exerciseId: string;
      name: string;
      previousMax: number;
      newRecord: number;
    }> = [];

    performedList.forEach((ex) => {
      const currentLoad = parseNumericLoad(loads[ex.id] || ex.load);
      if (!currentLoad || currentLoad <= 0) return;

      let previousMax = 0;
      previousExecutions.forEach((exec) => {
        if (!exec.notes) return;
        try {
          const parsed = typeof exec.notes === "string" ? JSON.parse(exec.notes) : exec.notes;
          const prevLoads = parsed.loads || {};
          const rawVal = prevLoads[ex.id] || prevLoads[ex.name];
          const n = parseNumericLoad(rawVal);
          if (n && n > previousMax) {
            previousMax = n;
          }
        } catch { /* ignore */ }
      });

      if (currentLoad > previousMax) {
        list.push({
          exerciseId: ex.id,
          name: ex.name,
          previousMax,
          newRecord: currentLoad,
        });
      }
    });

    return list;
  }, [performedList, loads, previousExecutions]);

  // 6. Progressões em relação ao último treino realizado
  const progressions = useMemo(() => {
    const list: Array<{
      exerciseId: string;
      name: string;
      loadProgression?: { from: number; to: number };
      repsProgression?: { from: number; to: number };
    }> = [];

    performedList.forEach((ex) => {
      const currentLoad = parseNumericLoad(loads[ex.id] || ex.load) || 0;
      const currentSets = completedSets?.[ex.id];
      const currentSetsCount = Array.isArray(currentSets) && currentSets.length > 0 ? currentSets.length : (typeof ex.series === "number" && ex.series > 0 ? ex.series : 3);
      const currentRepsTotal = parseReps(ex.sets_reps) * currentSetsCount;

      let foundPrevLoad: number | null = null;
      let foundPrevReps: number | null = null;

      for (const exec of previousExecutions) {
        if (!exec.notes) continue;
        try {
          const parsed = typeof exec.notes === "string" ? JSON.parse(exec.notes) : exec.notes;
          const prevLoads = parsed.loads || {};
          const rawVal = prevLoads[ex.id] || prevLoads[ex.name];
          if (rawVal !== undefined) {
            foundPrevLoad = parseNumericLoad(rawVal) || 0;
            const pSets = parsed.completedSets?.[ex.id];
            const pCount = Array.isArray(pSets) && pSets.length > 0 ? pSets.length : 3;
            foundPrevReps = parseReps(ex.sets_reps) * pCount;
            break;
          }
        } catch { /* ignore */ }
      }

      if (foundPrevLoad !== null && foundPrevLoad !== undefined) {
        const loadChanged = currentLoad > foundPrevLoad;
        const repsChanged = foundPrevReps !== null && currentRepsTotal > foundPrevReps;

        if (loadChanged || repsChanged) {
          list.push({
            exerciseId: ex.id,
            name: ex.name,
            loadProgression: loadChanged ? { from: foundPrevLoad, to: currentLoad } : undefined,
            repsProgression: repsChanged && foundPrevReps ? { from: foundPrevReps, to: currentRepsTotal } : undefined,
          });
        }
      } else if (currentLoad > 0) {
        list.push({
          exerciseId: ex.id,
          name: ex.name,
          loadProgression: { from: 0, to: currentLoad },
        });
      }
    });

    return list;
  }, [performedList, loads, completedSets, previousExecutions]);

  // Manipulação de imagem do Story
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgImage(reader.result as string);
        setViewMode("share");
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    const node = storyCardRef.current;
    if (!node) return null;
    
    setGenerating(true);
    try {
      const dataUrl = await toPng(node, {
        quality: 0.98,
        cacheBust: true,
        pixelRatio: 3,
      });
      setGenerating(false);
      return dataUrl;
    } catch (err) {
      console.error(err);
      toast.error("Erro ao gerar imagem");
      setGenerating(false);
      return null;
    }
  };

  const handleShareWhatsApp = async () => {
    const dataUrl = await generateImage();
    if (!dataUrl) return;

    if (navigator.share && navigator.canShare) {
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], "treino.png", { type: "image/png" });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Meu Treino no Studio Coach Montanha",
            text: `Treino ${dayName} concluído em ${durationHuman}! Volume: ${formattedVolume}, Reps: ${totalReps}x 💪`,
          });
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    const prsText = personalRecords.map((pr) => `🏆 ${pr.name}: ${pr.previousMax}kg → *${pr.newRecord}kg*`).join("\n");
    const progsText = progressions.map((p) => {
      let text = `📈 ${p.name}: `;
      if (p.loadProgression) text += `${p.loadProgression.from}kg → *${p.loadProgression.to}kg*`;
      if (p.repsProgression) text += ` • ${p.repsProgression.from}x → *${p.repsProgression.to}x*`;
      return text;
    }).join("\n");

    const text = encodeURIComponent(
      `*Treino Concluído!* 💪\n\n*Rotina:* ${dayName}\n*Duração:* ${durationHuman}\n*Volume:* ${formattedVolume}\n*Reps Totais:* ${totalReps}x\n\n${
        prsText ? `*Recordes Pessoais:*\n${prsText}\n\n` : ""
      }${
        progsText ? `*Progressões:*\n${progsText}\n\n` : ""
      }Studio Coach Montanha ⚡`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleDownload = async (isInstagram = false) => {
    const dataUrl = await generateImage();
    if (!dataUrl) return;
    
    const link = document.createElement("a");
    link.download = `treino-${new Date().getTime()}.png`;
    link.href = dataUrl;
    link.click();
    
    if (isInstagram) {
      toast.success("Imagem salva! Agora abra o Instagram para postar no Story.");
      setTimeout(() => {
        window.location.href = "instagram://story-camera";
        setTimeout(() => {
          if (document.hasFocus()) {
            window.open("https://www.instagram.com", "_blank");
          }
        }, 1000);
      }, 500);
    } else {
      toast.success("Imagem salva com sucesso na galeria!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md bg-zinc-950 text-white border border-zinc-800 p-4 sm:p-6 rounded-3xl shadow-2xl overflow-y-auto max-h-[95vh]">
        {/* Hidden inputs para acionar câmera ou galeria */}
        <input
          type="file"
          id="camera-input"
          className="hidden"
          accept="image/*"
          capture="environment"
          onChange={handleImageFile}
        />
        <input
          type="file"
          id="gallery-input"
          className="hidden"
          accept="image/*"
          onChange={handleImageFile}
        />

        {viewMode === "summary" ? (
          /* ========================================================================= */
          /* MODO 1: TELA DE RESULTADO DO TREINO (Idêntico a media_1789263537778.jpg)  */
          /* ========================================================================= */
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Header com Treino concluído + X */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <DialogTitle className="text-xl font-bold tracking-tight text-white">
                  Treino concluído
                </DialogTitle>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Linha das 3 Estatísticas: DURAÇÃO, VOLUME, REPS/TEMPO */}
            <div className="grid grid-cols-3 gap-1 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 p-4 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight tabular-nums">
                  {durationHuman}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-1">
                  Duração
                </div>
              </div>

              <div className="border-x border-zinc-800/80">
                <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight tabular-nums">
                  • {formattedVolume}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-1">
                  Volume
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight tabular-nums">
                  • {totalReps}x
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-1">
                  Reps/Tempo
                </div>
              </div>
            </div>

            {/* Card 1: Recordes pessoais (Amarelo / Dourado) */}
            {personalRecords.length > 0 && (
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-4 space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <Trophy className="h-4 w-4 text-amber-400 fill-amber-400/20" />
                  <span>Recordes pessoais</span>
                </div>
                <div className="space-y-2">
                  {personalRecords.map((pr) => (
                    <div
                      key={pr.exerciseId}
                      className="flex items-center justify-between text-xs sm:text-sm py-1 border-b border-zinc-800/50 last:border-0"
                    >
                      <span className="font-semibold text-zinc-200 truncate pr-2">
                        {pr.name}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm tabular-nums shrink-0">
                        <span className="text-zinc-400">{pr.previousMax}kg</span>
                        <span className="text-zinc-500">→</span>
                        <span className="font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/30">
                          {pr.newRecord}kg
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card 2: Progressões (Verde Esmeralda) */}
            {progressions.length > 0 && (
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-4 space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span>Progressões</span>
                </div>
                <div className="space-y-2">
                  {progressions.map((prog) => (
                    <div
                      key={prog.exerciseId}
                      className="flex items-center justify-between text-xs sm:text-sm py-1 border-b border-zinc-800/50 last:border-0"
                    >
                      <span className="font-semibold text-zinc-200 truncate pr-2">
                        {prog.name}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm tabular-nums shrink-0">
                        {prog.loadProgression && (
                          <span className="text-zinc-300">
                            <span className="text-zinc-400">{prog.loadProgression.from}kg</span>
                            <span className="text-zinc-500 mx-1">→</span>
                            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              {prog.loadProgression.to}kg
                            </span>
                          </span>
                        )}
                        {prog.loadProgression && prog.repsProgression && (
                          <span className="text-zinc-600">•</span>
                        )}
                        {prog.repsProgression && (
                          <span className="text-zinc-300">
                            <span className="text-zinc-400">{prog.repsProgression.from}x</span>
                            <span className="text-zinc-500 mx-1">→</span>
                            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              {prog.repsProgression.to}x
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chamada para Compartilhar e Botões */}
            <div className="space-y-3 pt-2 text-center">
              <p className="text-xs sm:text-sm font-semibold text-zinc-300">
                Que tal compartilhar esse resultado?
              </p>
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={() => document.getElementById("camera-input")?.click()}
                  className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2 text-sm shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all"
                >
                  <Camera className="h-5 w-5" /> Tirar uma foto
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("gallery-input")?.click()}
                  className="w-full h-12 rounded-2xl border-orange-500/40 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 font-bold gap-2 text-sm active:scale-[0.98] transition-all"
                >
                  <ImageIcon className="h-5 w-5" /> Escolher da galeria
                </Button>

                <div className="flex items-center justify-center gap-4 pt-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("share")}
                    className="text-xs font-semibold text-primary hover:underline transition-colors py-1 cursor-pointer"
                  >
                    Ver card para Story sem foto
                  </button>
                  <span className="text-zinc-600">•</span>
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors py-1 cursor-pointer"
                  >
                    Pular
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* MODO 2: STORY OVERLAY GENERATOR (Idêntico a media_1789263537904.jpg)      */
          /* ========================================================================= */
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Header com voltar */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("summary")}
                className="gap-1.5 text-xs text-zinc-400 hover:text-white px-2 h-8 rounded-lg"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Story de Vitória
              </span>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* O CARD 9:16 (Que será exportado como imagem PNG) */}
            <div className="flex justify-center w-full overflow-hidden">
              <div
                ref={storyCardRef}
                className="relative w-full max-w-[340px] aspect-[9/16] min-h-[580px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-5 text-white select-none border border-white/10"
                style={{
                  background: bgImage
                    ? `url(${bgImage}) center/cover no-repeat`
                    : "linear-gradient(155deg, #09090b 0%, #18181b 45%, #050505 100%)",
                }}
              >
                {/* Overlay escuro elegante para máxima legibilidade sobre qualquer foto */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/85 backdrop-blur-[2px] pointer-events-none" />

                {/* Topo: Data de início e fim */}
                <div className="relative z-10 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-white/15 pb-2">
                    <div className="flex items-center gap-2">
                      {logoImage ? (
                        <img src={logoImage} className="h-7 max-w-[100px] object-contain rounded" alt="Logo" />
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
                          <Dumbbell className="h-3.5 w-3.5" /> Studio Coach Montanha
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-zinc-400">{dayName}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-black/40 border border-white/10 p-2.5 backdrop-blur-md">
                    <div>
                      <div className="text-[9px] uppercase font-bold text-zinc-400">Data de início</div>
                      <div className="text-[11px] font-mono font-bold text-zinc-200 mt-0.5">{formatDateTime(startDate)}</div>
                    </div>
                    <div className="border-l border-white/10 pl-2">
                      <div className="text-[9px] uppercase font-bold text-zinc-400">Data de fim</div>
                      <div className="text-[11px] font-mono font-bold text-zinc-200 mt-0.5">{formatDateTime(now)}</div>
                    </div>
                  </div>
                </div>

                {/* Meio: Caixa de Estatísticas + PRs + Progressões */}
                <div className="relative z-10 my-auto space-y-3">
                  {/* Caixa de Métricas */}
                  <div className="rounded-2xl bg-black/50 border border-white/15 p-3.5 backdrop-blur-md space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400 block">Duração</span>
                        <span className="text-base font-black font-mono text-white">{durationHuman}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 block">Reps</span>
                        <span className="text-base font-black font-mono text-white">{totalReps}x</span>
                      </div>
                    </div>
                    <div className="border-t border-white/10 pt-2">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block">Volume</span>
                      <span className="text-xl font-black font-mono text-orange-400">{formattedVolume}</span>
                    </div>
                  </div>

                  {/* Recordes Pessoais */}
                  {personalRecords.length > 0 && (
                    <div className="rounded-2xl bg-black/50 border border-amber-500/25 p-3 backdrop-blur-md space-y-1.5">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Trophy className="h-3.5 w-3.5" /> Recordes pessoais
                      </div>
                      <div className="space-y-1 max-h-24 overflow-hidden">
                        {personalRecords.slice(0, 3).map((pr) => (
                          <div key={pr.exerciseId} className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-200 font-semibold truncate pr-2">{pr.name}</span>
                            <span className="font-mono text-[11px] shrink-0">
                              <span className="text-zinc-400">{pr.previousMax}kg</span>
                              <span className="text-zinc-500 mx-1">→</span>
                              <strong className="text-amber-400">{pr.newRecord}kg</strong>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progressões */}
                  {progressions.length > 0 && (
                    <div className="rounded-2xl bg-black/50 border border-emerald-500/25 p-3 backdrop-blur-md space-y-1.5">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5" /> Progressões
                      </div>
                      <div className="space-y-1 max-h-24 overflow-hidden">
                        {progressions.slice(0, 3).map((prog) => (
                          <div key={prog.exerciseId} className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-200 font-semibold truncate pr-2">{prog.name}</span>
                            <span className="font-mono text-[11px] shrink-0 text-emerald-400 font-bold">
                              {prog.loadProgression && `${prog.loadProgression.from}kg → ${prog.loadProgression.to}kg`}
                              {prog.repsProgression && ` • ${prog.repsProgression.from}x → ${prog.repsProgression.to}x`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Rodapé: Aluno & Marca */}
                <div className="relative z-10 pt-2 border-t border-white/15 text-center">
                  <div className="text-[10px] font-bold text-zinc-400">Aluno em evolução:</div>
                  <div className="text-sm font-black text-white tracking-wide">{studentName}</div>
                  <div className="text-[9px] uppercase tracking-[0.25em] text-orange-400 font-extrabold mt-0.5">
                    Missão Cumprida
                  </div>
                </div>
              </div>
            </div>

            {/* Ações de Envio e Download */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("camera-input")?.click()}
                  className="h-10 rounded-xl border-zinc-800 text-xs font-semibold gap-1.5"
                >
                  <Camera className="h-4 w-4" /> {bgImage ? "Tirar Outra" : "Tirar Foto"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("gallery-input")?.click()}
                  className="h-10 rounded-xl border-zinc-800 text-xs font-semibold gap-1.5"
                >
                  <ImageIcon className="h-4 w-4" /> Galeria
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                  type="button"
                  className="h-11 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] hover:opacity-95 font-bold text-xs gap-1.5"
                  onClick={() => handleDownload(true)}
                  disabled={generating}
                >
                  <Sparkles className="h-4 w-4" /> Instagram Story
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 font-bold text-xs gap-1.5"
                  onClick={handleShareWhatsApp}
                  disabled={generating}
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl border-zinc-800 text-zinc-200 hover:bg-zinc-900 font-bold text-xs gap-1.5"
                  onClick={() => handleDownload(false)}
                  disabled={generating}
                >
                  <Download className="h-4 w-4" /> Baixar PNG
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}