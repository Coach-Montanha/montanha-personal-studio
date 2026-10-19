import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Sparkles, Loader2, ArrowRight, Check, Dumbbell, History, RefreshCw } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { reprogramDayWithAi, type ReprogramDayResult } from "@/lib/pt-ai.functions";

type TrainingDay = {
  id: string;
  name: string;
  day_label: string;
  description: string | null;
  sort_order: number;
};

type TrainingExercise = {
  id: string;
  name: string;
  series_type?: string | null;
  sets_reps?: string | null;
  load?: string | null;
  time_seconds?: number | null;
  inclination?: string | null;
  pace?: string | null;
  cadence?: string | null;
  rest_seconds?: number | null;
  observations?: string | null;
  video_url?: string | null;
};

const QUICK_PROMPTS = [
  "Aumentar progressão de cargas (+5% a 10%) e foco em força hipertrófica",
  "Variar estímulo mantendo os mesmos grupos musculares com novas angulações",
  "Aumentar intensidade: séries de 6 a 8 reps com maior descanso",
  "Fase de definição/metabólica: reduzir descanso (45s) e elevar reps para 12-15",
  "Semana regenerativa / Deload: reduzir volume e cargas em 30% a 40%",
];

export function ReprogramDayAiDialog({
  open,
  onOpenChange,
  programId,
  day,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  programId: string;
  day: TrainingDay | null;
}) {
  const qc = useQueryClient();
  const reprogramFn = useServerFn(reprogramDayWithAi);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [mode, setMode] = useState<"replace" | "new_phase">("replace");
  const [result, setResult] = useState<ReprogramDayResult | null>(null);

  if (!day) return null;

  async function handleGenerate() {
    if (!prompt.trim()) {
      return toast.error("Informe a diretriz de reajuste ou escolha um atalho.");
    }
    setLoading(true);
    setResult(null);

    try {
      // Carregar os exercícios atuais da sessão
      const { data: exercises } = await supabase
        .from("pt_training_exercises" as never)
        .select("name,series_type,sets_reps,load,rest_seconds,observations")
        .eq("training_day_id", day.id)
        .order("sort_order", { ascending: true });

      const res = await reprogramFn({
        data: {
          programId,
          dayId: day.id,
          prompt: prompt.trim(),
          currentExercises: (exercises ?? []) as any[],
        },
      });

      setResult(res);
      toast.success("Reprogramação gerada pela IA!");
    } catch (e: any) {
      toast.error(e?.message ?? "Falha ao reprogramar treino");
    } finally {
      setLoading(false);
    }
  }

  async function handleApply() {
    if (!result?.day?.exercises?.length) return;
    setApplying(true);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      setApplying(false);
      return;
    }

    try {
      let targetDayId = day.id;

      if (mode === "new_phase") {
        // Criar como nova fase/bloco
        const newName = `${day.name} (Fase 2)`;
        const { data: newDay, error: dayErr } = await supabase
          .from("pt_training_days" as never)
          .insert({
            user_id: userId,
            program_id: programId,
            name: newName,
            day_label: day.day_label,
            description: result.day.description ?? "Reprogramação via IA",
            sort_order: day.sort_order + 1,
          } as never)
          .select("id")
          .single();

        if (dayErr || !newDay) throw new Error(dayErr?.message ?? "Erro ao criar novo dia");
        targetDayId = (newDay as any).id;
      } else {
        // Substituir o dia atual: atualiza descrição e remove exercícios antigos
        await supabase
          .from("pt_training_days" as never)
          .update({
            description: result.day.description ?? day.description,
          } as never)
          .eq("id", day.id);

        await supabase
          .from("pt_training_exercises" as never)
          .delete()
          .eq("training_day_id", day.id);
      }

      // Inserir os novos exercícios reprogramados
      const rows = result.day.exercises.map((ex, idx) => ({
        user_id: userId,
        training_day_id: targetDayId,
        name: ex.name,
        series_type: ex.series_type ?? "reps_load",
        sets_reps: ex.sets_reps ?? null,
        load: ex.load ?? null,
        time_seconds: ex.time_seconds ?? null,
        rest_seconds: ex.rest_seconds ?? null,
        observations: ex.observations ?? null,
        sort_order: idx,
      }));

      const { error: insErr } = await supabase
        .from("pt_training_exercises" as never)
        .insert(rows as never);

      if (insErr) throw new Error(insErr.message);

      toast.success(
        mode === "new_phase"
          ? "Novo bloco de treino criado com sucesso!"
          : "Sessão de treino reprogramada com sucesso!"
      );

      qc.invalidateQueries({ queryKey: ["pt-training-days", programId] });
      qc.invalidateQueries({ queryKey: ["pt-day-exercises", targetDayId] });
      qc.invalidateQueries({ queryKey: ["pt-programs"] });
      onOpenChange(false);
      setResult(null);
      setPrompt("");
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao aplicar reprogramação");
    } finally {
      setApplying(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Reprogramar com IA — {day.name} ({day.day_label})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-xs text-muted-foreground">
            A IA analisará a ficha original do aluno, os exercícios atuais desta sessão e recalibrará séries,
            repetições, cargas e variações conforme a nova meta.
          </p>

          {/* Atalhos rápidos de prompt */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Atalhos de Periodização / Progressão
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((qp) => (
                <button
                  key={qp}
                  type="button"
                  onClick={() => setPrompt(qp)}
                  className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt customizado */}
          <div className="space-y-2">
            <Label htmlFor="reprogram-prompt" className="text-xs font-semibold">
              Instrução do Treinador para o Reajuste
            </Label>
            <Textarea
              id="reprogram-prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: O aluno estagnou no supino e quer aumentar cargas no peitoral superior. Adicionar variações e aumentar descanso..."
              className="text-xs"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="gap-2"
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Reprogramando com IA...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Gerar Proposta de Reajuste
                </>
              )}
            </Button>
          </div>

          {/* Resultado / Preview */}
          {result && (
            <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4 animate-in fade-in-50">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">
                    {result.day.name} ({result.day.day_label})
                  </span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {result.day.exercises.length} exercícios propostos
                </span>
              </div>

              {result.rationale && (
                <div className="rounded-lg bg-background/80 p-2.5 text-xs text-foreground/90 border">
                  <span className="font-semibold text-primary">Fundamento do Reajuste: </span>
                  {result.rationale}
                </div>
              )}

              {/* Lista dos exercícios reprogramados */}
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {result.day.exercises.map((ex, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md border bg-background p-2 text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold truncate">
                        {i + 1}. {ex.name}
                      </p>
                      {ex.observations && (
                        <p className="text-[11px] text-muted-foreground truncate">
                          {ex.observations}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-right">
                      {ex.sets_reps && (
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium">
                          {ex.sets_reps}
                        </span>
                      )}
                      {ex.load && (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary">
                          {ex.load}
                        </span>
                      )}
                      {ex.rest_seconds && (
                        <span className="text-[10px] text-muted-foreground">
                          {ex.rest_seconds}s
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Opção de Aplicação */}
              <div className="pt-2 border-t space-y-2">
                <Label className="text-xs font-semibold">Como deseja aplicar este treino?</Label>
                <RadioGroup
                  value={mode}
                  onValueChange={(v: "replace" | "new_phase") => setMode(v)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs"
                >
                  <label className="flex items-center gap-2 p-2 rounded-lg border bg-background cursor-pointer hover:border-primary/50">
                    <RadioGroupItem value="replace" id="r-replace" />
                    <div>
                      <p className="font-medium">Substituir este dia</p>
                      <p className="text-[11px] text-muted-foreground">Atualiza os exercícios do {day.name}</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg border bg-background cursor-pointer hover:border-primary/50">
                    <RadioGroupItem value="new_phase" id="r-new" />
                    <div>
                      <p className="font-medium">Criar novo bloco / Fase 2</p>
                      <p className="text-[11px] text-muted-foreground">Preserva o original e cria {day.name} (Fase 2)</p>
                    </div>
                  </label>
                </RadioGroup>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={applying}
          >
            Cancelar
          </Button>
          {result && (
            <Button
              type="button"
              size="sm"
              onClick={handleApply}
              disabled={applying}
              className="gap-1.5"
            >
              {applying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Aplicando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Aplicar Reprogramação
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
