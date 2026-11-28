import { useRef, useState } from "react";
import { Share2, Trophy, X } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDecimalBR, formatVolumeKgBR } from "@/lib/workout-session-store";
import { formatShortDateBR, type DetectedPRItem } from "@/lib/workout-records";

interface HevyWorkoutSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firstName: string;
  workoutTitle: string;
  finishedAtIso: string;
  durationSeconds: number;
  totalVolumeKg: number;
  lastSameDayVolumeKg: number | null;
  dayNumberLabel?: string;
  completedSetsCount: number;
  prs: DetectedPRItem[];
  bestSets: Array<{ exerciseId: string; exerciseName: string; weightKg: number; reps: number }>;
  onSaveAndExit: () => void;
}

export function HevyWorkoutSummaryDialog({
  open,
  onOpenChange,
  firstName,
  workoutTitle,
  finishedAtIso,
  durationSeconds,
  totalVolumeKg,
  lastSameDayVolumeKg,
  dayNumberLabel,
  completedSetsCount,
  prs,
  bestSets,
  onSaveAndExit,
}: HevyWorkoutSummaryDialogProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const dateLabel = formatShortDateBR(finishedAtIso);
  const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));
  const durationDisplay =
    durationSeconds < 60 ? `${durationSeconds}s` : `${durationMinutes} min`;

  const volumeDiffPct =
    lastSameDayVolumeKg && lastSameDayVolumeKg > 0
      ? Math.round(((totalVolumeKg - lastSameDayVolumeKg) / lastSameDayVolumeKg) * 100)
      : null;

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const shareText = [
        `TREINO CONCLUÍDO · ${dateLabel}`,
        `${workoutTitle}`,
        `Duração: ${durationDisplay} | Volume: ${formatVolumeKgBR(totalVolumeKg)} | Séries: ${completedSetsCount}`,
        prs.length > 0 ? `Recordes: ${prs.length} PR${prs.length > 1 ? "s" : ""}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      if (cardRef.current) {
        const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `resumo-treino-${dateLabel.replace("/", "-")}.png`, {
          type: "image/png",
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: workoutTitle, text: shareText });
          return;
        }

        // Fallback desktop: baixa imagem PNG + copia texto
        const link = document.createElement("a");
        link.download = `resumo-treino-${dateLabel.replace("/", "-")}.png`;
        link.href = dataUrl;
        link.click();
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
      }
      toast.success("Resumo pronto para compartilhar!");
    } catch {
      toast.info("Resumo copiado!");
    } finally {
      setSharing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl border-border shadow-2xl">
        <div ref={cardRef} className="flex-1 overflow-y-auto bg-background">
          {/* Topo Escuro */}
          <div className="bg-zinc-950 px-5 pt-5 pb-6 text-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                TREINO CONCLUÍDO · {dateLabel}
              </span>
              <button
                type="button"
                onClick={onSaveAndExit}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                Bom treino, {firstName}!
              </h2>
              <p className="mt-0.5 text-xs text-zinc-400 truncate">{workoutTitle}</p>
            </div>

            {/* 4 Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-zinc-900/90 border border-white/10 p-3">
                <span className="block text-[11px] text-zinc-400">Duração</span>
                <span className="mt-0.5 block text-lg font-extrabold tabular-nums text-white">
                  {durationDisplay}
                </span>
              </div>

              <div className="rounded-xl bg-zinc-900/90 border border-white/10 p-3">
                <span className="block text-[11px] text-zinc-400">Volume</span>
                <span className="mt-0.5 block text-lg font-extrabold tabular-nums text-white">
                  {formatVolumeKgBR(totalVolumeKg)}
                </span>
                {volumeDiffPct !== null && (
                  <span
                    className={cn(
                      "mt-0.5 block text-[11px] font-semibold",
                      volumeDiffPct >= 0 ? "text-emerald-400" : "text-zinc-400"
                    )}
                  >
                    {volumeDiffPct >= 0 ? `+${volumeDiffPct}%` : `${volumeDiffPct}%`} vs. último{" "}
                    {dayNumberLabel || "treino"}
                  </span>
                )}
              </div>

              <div className="rounded-xl bg-zinc-900/90 border border-white/10 p-3">
                <span className="block text-[11px] text-zinc-400">Séries</span>
                <span className="mt-0.5 block text-lg font-extrabold tabular-nums text-white">
                  {completedSetsCount}
                </span>
              </div>

              <div className="rounded-xl bg-zinc-900/90 border border-white/10 p-3">
                <span className="block text-[11px] text-zinc-400">Recordes</span>
                <span className="mt-0.5 block text-lg font-extrabold tabular-nums text-orange-400">
                  {prs.length} {prs.length === 1 ? "PR" : "PRs"}
                </span>
              </div>
            </div>
          </div>

          {/* Corpo Claro */}
          <div className="p-5 space-y-5">
            {/* RECORDES PESSOAIS */}
            {prs.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Recordes Pessoais
                </h3>
                <div className="space-y-2">
                  {prs.map((pr, idx) => (
                    <div
                      key={`${pr.exerciseId}-${pr.kind}-${idx}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
                          <Trophy className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs sm:text-sm font-bold text-foreground">
                            {pr.exerciseName}
                          </p>
                          <p className="text-[11px] text-muted-foreground">{pr.kind}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="block text-xs sm:text-sm font-extrabold tabular-nums text-foreground">
                          {pr.kind === "Maior volume"
                            ? formatVolumeKgBR(pr.newValue)
                            : `${formatDecimalBR(pr.newValue)} kg`}
                        </span>
                        {pr.diffValue > 0 && (
                          <span className="block text-[11px] font-semibold text-emerald-600">
                            +{formatDecimalBR(pr.diffValue)} kg
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MELHOR SÉRIE POR EXERCÍCIO */}
            {bestSets.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Melhor Série por Exercício
                </h3>
                <div className="rounded-xl border border-border bg-card divide-y divide-border/70">
                  {bestSets.map((item) => (
                    <div
                      key={item.exerciseId}
                      className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs sm:text-sm"
                    >
                      <span className="truncate font-medium text-foreground">
                        {item.exerciseName}
                      </span>
                      <span className="shrink-0 font-bold tabular-nums text-foreground">
                        {formatDecimalBR(item.weightKg)} kg × {item.reps}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé Fixo com Compartilhar e Salvar treino */}
        <div className="flex items-center gap-2.5 border-t border-border bg-background p-4 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleShare}
            disabled={sharing}
            className="flex-1 h-11 rounded-xl font-bold gap-2"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
          <Button
            type="button"
            onClick={onSaveAndExit}
            className="flex-1 h-11 rounded-xl font-bold"
          >
            Salvar treino
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
