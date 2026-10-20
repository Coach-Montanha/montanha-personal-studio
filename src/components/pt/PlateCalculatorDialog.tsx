import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dumbbell, Plus, Minus, RotateCcw, Check, Sparkles } from "lucide-react";

interface PlateCalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialWeight?: number | string | null;
  exerciseName?: string | null;
}

const BARS = [
  { id: "olympic_male", name: "Barra Olímpica (20 kg)", weight: 20 },
  { id: "olympic_female", name: "Barra Olímpica Feminina (15 kg)", weight: 15 },
  { id: "bar_studio", name: "Barra Reta Studio (12 kg)", weight: 12 },
  { id: "bar_w", name: "Barra W / Curta (10 kg)", weight: 10 },
  { id: "smith", name: "Barra Guiada / Smith (15 kg)", weight: 15 },
  { id: "smith_light", name: "Barra Smith Leve (10 kg)", weight: 10 },
  { id: "no_bar", name: "Sem Barra / Livre (0 kg)", weight: 0 },
];

const AVAILABLE_PLATES = [
  { weight: 25, color: "#ef4444", border: "#b91c1c", height: 88, text: "#ffffff", label: "25kg" },
  { weight: 20, color: "#3b82f6", border: "#1d4ed8", height: 84, text: "#ffffff", label: "20kg" },
  { weight: 15, color: "#eab308", border: "#a16207", height: 76, text: "#000000", label: "15kg" },
  { weight: 10, color: "#22c55e", border: "#15803d", height: 68, text: "#ffffff", label: "10kg" },
  { weight: 5, color: "#f8fafc", border: "#94a3b8", height: 56, text: "#0f172a", label: "5kg" },
  { weight: 2.5, color: "#1e293b", border: "#475569", height: 46, text: "#ffffff", label: "2.5kg" },
  { weight: 1.25, color: "#64748b", border: "#475569", height: 38, text: "#ffffff", label: "1.25kg" },
];

export function PlateCalculatorDialog({
  open,
  onOpenChange,
  initialWeight,
  exerciseName,
}: PlateCalculatorDialogProps) {
  const parsedInitial = useMemo(() => {
    if (!initialWeight) return 60;
    if (typeof initialWeight === "number") return initialWeight;
    const match = String(initialWeight).match(/(\d+(?:[.,]\d+)?)/);
    return match ? Number(match[1].replace(",", ".")) : 60;
  }, [initialWeight]);

  const [totalWeight, setTotalWeight] = useState<number>(parsedInitial);
  const [selectedBar, setSelectedBar] = useState<string>("olympic_male");

  useEffect(() => {
    if (open) {
      setTotalWeight(parsedInitial);
    }
  }, [open, parsedInitial]);

  const bar = BARS.find((b) => b.id === selectedBar) || BARS[0];

  const calculation = useMemo(() => {
    const safeTarget = Math.max(bar.weight, totalWeight);
    const weightPerSide = Math.max(0, (safeTarget - bar.weight) / 2);

    let remaining = weightPerSide;
    const platesUsed: Array<{ weight: number; color: string; border: string; height: number; text: string; label: string; count: number }> = [];

    for (const plate of AVAILABLE_PLATES) {
      if (remaining >= plate.weight - 0.001) {
        const count = Math.floor(remaining / plate.weight);
        if (count > 0) {
          platesUsed.push({ ...plate, count });
          remaining = Number((remaining - count * plate.weight).toFixed(2));
        }
      }
    }

    const achievedPerSide = platesUsed.reduce((sum, p) => sum + p.weight * p.count, 0);
    const achievedTotal = bar.weight + achievedPerSide * 2;
    const remainder = Number((weightPerSide - achievedPerSide).toFixed(2));

    return {
      weightPerSide,
      achievedPerSide,
      achievedTotal,
      platesUsed,
      remainder,
    };
  }, [totalWeight, bar]);

  const adjustWeight = (delta: number) => {
    setTotalWeight((prev) => Math.max(bar.weight, Number((prev + delta).toFixed(1))));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg">Calculadora de Anilhas</DialogTitle>
              <DialogDescription className="text-xs">
                {exerciseName ? `Montagem para: ${exerciseName}` : "Distribuição visual de anilhas em cada lado da barra"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Seletor de Carga Alvo */}
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Carga Total Alvo
              </Label>
              <div className="flex items-center gap-1">
                {[-10, -2, 2, 10].map((delta) => (
                  <Button
                    key={delta}
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs px-2 font-mono"
                    onClick={() => adjustWeight(delta)}
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="number"
                  step="0.5"
                  min={bar.weight}
                  value={totalWeight || ""}
                  onChange={(e) => setTotalWeight(Math.max(0, Number(e.target.value)))}
                  className="text-lg font-bold font-mono h-11 pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                  kg
                </span>
              </div>
            </div>

            {/* Barra Selecionada */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/40">
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Tipo de Barra</Label>
                <Select value={selectedBar} onValueChange={setSelectedBar}>
                  <SelectTrigger className="h-8 text-xs font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BARS.map((b) => (
                      <SelectItem key={b.id} value={b.id} className="text-xs">
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Peso por Lado</Label>
                <div className="h-8 flex items-center px-3 rounded-md bg-background border border-border text-xs font-mono font-bold text-primary">
                  {calculation.weightPerSide} kg / lado
                </div>
              </div>
            </div>
          </div>

          {/* Representação Visual da Barra e Anilhas */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col items-center justify-center">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Visualização da Manga (Cada Lado)
            </div>

            {/* Ilustração de uma manga da barra com as anilhas montadas */}
            <div className="w-full flex items-center justify-center overflow-x-auto py-3 min-h-[120px]">
              <div className="flex items-center gap-1.5">
                {/* Manga da barra (base) */}
                <div className="w-4 h-14 bg-slate-500 rounded-l-md border-r-2 border-slate-700 shadow-sm flex items-center justify-center">
                  <div className="w-1.5 h-full bg-slate-400" />
                </div>

                {/* Anilhas enfileiradas */}
                {calculation.platesUsed.length === 0 ? (
                  <div className="text-xs text-muted-foreground italic px-4 py-2 border border-dashed border-border rounded-lg">
                    Apenas a barra ({bar.weight} kg) — sem anilhas
                  </div>
                ) : (
                  calculation.platesUsed.flatMap((plate, idx) =>
                    Array.from({ length: plate.count }).map((_, cIdx) => (
                      <div
                        key={`${plate.weight}-${idx}-${cIdx}`}
                        style={{
                          height: `${plate.height}px`,
                          backgroundColor: plate.color,
                          borderColor: plate.border,
                          color: plate.text,
                        }}
                        className="w-7 rounded-sm border-2 flex flex-col items-center justify-center font-bold text-[9px] shadow-sm select-none transition-all hover:scale-105"
                        title={`${plate.label} (${plate.weight}kg)`}
                      >
                        <span className="-rotate-90 whitespace-nowrap tracking-tighter">
                          {plate.label}
                        </span>
                      </div>
                    ))
                  )
                )}

                {/* Presilha / Colarinho */}
                {calculation.platesUsed.length > 0 && (
                  <div
                    className="w-3.5 h-7 rounded-sm bg-zinc-800 border border-zinc-600 shadow-inner flex items-center justify-center"
                    title="Presilha de segurança"
                  >
                    <div className="w-1 h-3 bg-zinc-400 rounded-full" />
                  </div>
                )}
              </div>
            </div>

            {/* Resumo escrito das anilhas */}
            <div className="w-full pt-3 border-t border-primary/10 mt-2 text-center">
              <div className="text-xs font-medium text-foreground">
                Coloque em <strong>cada lado</strong>:
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                {calculation.platesUsed.length === 0 ? (
                  <Badge variant="outline" className="text-xs bg-background">
                    Nenhuma anilha necessária
                  </Badge>
                ) : (
                  calculation.platesUsed.map((p) => (
                    <Badge
                      key={p.weight}
                      variant="outline"
                      className="text-xs font-mono font-semibold"
                      style={{
                        borderColor: p.border,
                        backgroundColor: `${p.color}15`,
                        color: p.color === "#f8fafc" ? "#334155" : p.color,
                      }}
                    >
                      {p.count}x {p.label}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto text-xs">
              <Check className="h-4 w-4 mr-1.5" /> Concluído
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
