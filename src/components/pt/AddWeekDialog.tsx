import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarPlus,
  Copy,
  Sparkles,
  TrendingUp,
  Dumbbell,
  Loader2,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  groupDaysByWeek,
  parseDayMeta,
  buildDayDescription,
  applyLoadVariation,
} from "@/lib/training-weeks";

interface AddWeekDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programId: string;
  trainingDays: Array<{
    id: string;
    program_id: string;
    name: string;
    day_label: string;
    description: string | null;
    sort_order: number;
  }>;
  onSuccess?: () => void;
  onOpenAi?: () => void;
}

export function AddWeekDialog({
  open,
  onOpenChange,
  programId,
  trainingDays,
  onSuccess,
  onOpenAi,
}: AddWeekDialogProps) {
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Semanas existentes
  const weeklyGroups = groupDaysByWeek(trainingDays);
  const maxWeek = weeklyGroups.length > 0
    ? Math.max(...weeklyGroups.map((g) => g.weekNumber))
    : 1;
  const nextWeekNumber = maxWeek + 1;

  // Estados do formulário
  const [modo, setModo] = useState<"duplicar" | "ia" | "vazio">("duplicar");
  const [semanaBase, setSemanaBase] = useState<number>(maxWeek);
  const [variacaoCarga, setVariacaoCarga] = useState<"none" | "add_2kg" | "add_5pct" | "deload_15pct">("add_2kg");

  async function handleConfirmar() {
    if (modo === "ia") {
      onOpenChange(false);
      onOpenAi?.();
      return;
    }

    setLoading(true);
    const toastId = toast.loading(`Criando Semana ${nextWeekNumber}...`);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Usuário não autenticado");

      // Descobre a maior sort_order atual para não colidir
      const maxSortOrder = trainingDays.reduce((max, d) => Math.max(max, d.sort_order ?? 0), 0);
      let nextSortOrder = maxSortOrder + 1;

      if (modo === "vazio") {
        // Cria um treino inicial vazio para a nova semana
        const newDayName = `Treino 1 (Sem. ${nextWeekNumber})`;
        const newDayLabel = `S${nextWeekNumber}D1`;
        const newDesc = buildDayDescription({ weekNumber: nextWeekNumber });

        const { error: insErr } = await supabase
          .from("pt_training_days" as never)
          .insert({
            user_id: userId,
            program_id: programId,
            name: newDayName,
            day_label: newDayLabel,
            description: newDesc,
            sort_order: nextSortOrder,
          } as never);

        if (insErr) throw insErr;

        toast.success(`Semana ${nextWeekNumber} criada com 1 sessão inicial vazia!`, { id: toastId });
      } else {
        // Modo Duplicar: Clona todos os treinos da semanaBase
        const targetGroup = weeklyGroups.find((g) => g.weekNumber === semanaBase) || weeklyGroups[weeklyGroups.length - 1];
        if (!targetGroup || targetGroup.days.length === 0) {
          throw new Error("Não há treinos na semana selecionada para duplicar.");
        }

        const baseDays = targetGroup.days;

        for (let i = 0; i < baseDays.length; i++) {
          const originalDay = baseDays[i];
          const originalMeta = parseDayMeta(originalDay, i, baseDays.length);

          const cleanBaseName = (originalDay.name || `Treino ${i + 1}`)
            .replace(/\s*\(Sem\.\s*\d+\)/gi, "")
            .replace(/\s*-\s*Semana\s*\d+/gi, "")
            .trim();

          const newDayName = `${cleanBaseName} (Sem. ${nextWeekNumber})`;
          const newDayLabel = `S${nextWeekNumber}D${i + 1}`;
          const newDesc = buildDayDescription({
            description: originalMeta.cleanDescription,
            isWithCoach: originalMeta.isWithCoach,
            weekNumber: nextWeekNumber,
          });

          // 1. Criar novo dia
          const { data: newDay, error: dayErr } = await supabase
            .from("pt_training_days" as never)
            .insert({
              user_id: userId,
              program_id: programId,
              name: newDayName,
              day_label: newDayLabel,
              description: newDesc,
              sort_order: nextSortOrder++,
            } as never)
            .select("id")
            .single();

          if (dayErr || !newDay) throw dayErr ?? new Error("Falha ao criar sessão da nova semana");
          const newDayId = (newDay as any).id;

          // 2. Buscar exercícios do dia original
          const { data: originalExercises = [] } = await supabase
            .from("pt_training_exercises" as never)
            .select("*")
            .eq("training_day_id", originalDay.id)
            .order("sort_order", { ascending: true });

          // 3. Clonar exercícios aplicando a progressão de carga selecionada
          if (originalExercises && (originalExercises as any[]).length > 0) {
            const clonedRows = (originalExercises as any[]).map((ex) => ({
              user_id: userId,
              training_day_id: newDayId,
              name: ex.name,
              series_type: ex.series_type ?? "reps_load",
              sets_reps: ex.sets_reps ?? null,
              load: applyLoadVariation(ex.load, variacaoCarga),
              time_seconds: ex.time_seconds ?? null,
              inclination: ex.inclination ?? null,
              pace: ex.pace ?? null,
              cadence: ex.cadence ?? null,
              rest_seconds: ex.rest_seconds ?? null,
              observations: ex.observations ?? null,
              media_url: ex.media_url ?? null,
              media_type: ex.media_type ?? null,
              thumbnail_url: ex.thumbnail_url ?? null,
              exercise_library_id: ex.exercise_library_id ?? null,
              sort_order: ex.sort_order ?? 0,
            }));

            const { error: exErr } = await supabase
              .from("pt_training_exercises" as never)
              .insert(clonedRows as never);

            if (exErr) throw exErr;
          }
        }

        toast.success(
          `Semana ${nextWeekNumber} criada com sucesso (${baseDays.length} treinos clonados com variação)!`,
          { id: toastId }
        );
      }

      qc.invalidateQueries({ queryKey: ["pt-training-days", programId] });
      qc.invalidateQueries({ queryKey: ["pt-programs"] });
      onSuccess?.();
      onOpenChange(false);
    } catch (e: any) {
      console.error("[handleConfirmar] Erro ao adicionar semana:", e);
      toast.error(e?.message ?? "Falha ao criar nova semana", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <CalendarPlus className="h-5 w-5 text-primary" />
            Adicionar Semana ao Programa
          </DialogTitle>
          <DialogDescription className="text-xs">
            Atualmente o programa possui {weeklyGroups.length} semana(s). Você criará a{" "}
            <strong className="text-foreground font-bold">Semana {nextWeekNumber}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Seletor de Modo */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setModo("duplicar")}
              className={`p-3 text-left rounded-xl border text-xs transition-all ${
                modo === "duplicar"
                  ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30"
                  : "border-border/70 bg-muted/20 text-muted-foreground hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold flex items-center gap-1">
                  <Copy className="h-3.5 w-3.5" /> Duplicar
                </span>
                {modo === "duplicar" && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
              </div>
              <p className="text-[10px] leading-relaxed text-muted-foreground font-normal">
                Copia os treinos da semana anterior com variação de carga.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setModo("ia")}
              className={`p-3 text-left rounded-xl border text-xs transition-all ${
                modo === "ia"
                  ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30"
                  : "border-border/70 bg-muted/20 text-muted-foreground hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Com IA
                </span>
                {modo === "ia" && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
              </div>
              <p className="text-[10px] leading-relaxed text-muted-foreground font-normal">
                Gera a próxima semana com periodização ondulatória.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setModo("vazio")}
              className={`p-3 text-left rounded-xl border text-xs transition-all ${
                modo === "vazio"
                  ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30"
                  : "border-border/70 bg-muted/20 text-muted-foreground hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" /> Em Branco
                </span>
                {modo === "vazio" && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
              </div>
              <p className="text-[10px] leading-relaxed text-muted-foreground font-normal">
                Cria a Semana {nextWeekNumber} vazia para montar manualmente.
              </p>
            </button>
          </div>

          {/* Configurações do Modo Duplicar */}
          {modo === "duplicar" && (
            <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-3 animate-in fade-in duration-150">
              {weeklyGroups.length > 1 && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Semana base para clonar:</Label>
                  <Select
                    value={String(semanaBase)}
                    onValueChange={(v) => setSemanaBase(Number(v))}
                  >
                    <SelectTrigger className="h-9 bg-background text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {weeklyGroups.map((g) => (
                        <SelectItem key={g.weekNumber} value={String(g.weekNumber)}>
                          Semana {g.weekNumber} ({g.days.length} sessões)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  Regra de Variação de Carga para a Semana {nextWeekNumber}:
                </Label>
                <Select
                  value={variacaoCarga}
                  onValueChange={(v: any) => setVariacaoCarga(v)}
                >
                  <SelectTrigger className="h-9 bg-background text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add_2kg">
                      📈 Aumentar +2 kg (Sobrecarga progressiva linear)
                    </SelectItem>
                    <SelectItem value="add_5pct">
                      ⚡ Aumentar +5% (Sobrecarga percentual)
                    </SelectItem>
                    <SelectItem value="none">
                      🔒 Manter cargas idênticas (Mesmo volume)
                    </SelectItem>
                    <SelectItem value="deload_15pct">
                      📉 Reduzir -15% (Semana de Deload / Regenerativa)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {variacaoCarga === "add_2kg" && "Adiciona 2kg nas cargas numéricas de todos os exercícios clonados."}
                  {variacaoCarga === "add_5pct" && "Aplica aumento de 5% nas cargas com arredondamento inteligente."}
                  {variacaoCarga === "none" && "Mantém todos os pesos e repetições exatamente como na semana anterior."}
                  {variacaoCarga === "deload_15pct" && "Aplica alívio de 15% na intensidade para supercompensação do aluno."}
                </p>
              </div>
            </div>
          )}

          {modo === "ia" && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-4 w-4" /> Prescrição com IA
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Você será direcionado para o painel de IA com esta rotina selecionada para projetar a continuação com novas semanas e exercícios personalizados.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirmar}
            disabled={loading}
            className="gap-1.5 font-semibold"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {modo === "ia"
              ? "Abrir Prescrição com IA"
              : `Criar Semana ${nextWeekNumber}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
