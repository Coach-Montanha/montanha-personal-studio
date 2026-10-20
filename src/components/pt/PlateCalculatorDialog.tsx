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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dumbbell, Check, Flame, Layers } from "lucide-react";

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

function calculatePlates(targetTotal: number, barWeight: number) {
  const safeTarget = Math.max(barWeight, targetTotal);
  const weightPerSide = Math.max(0, (safeTarget - barWeight) / 2);

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
  const achievedTotal = barWeight + achievedPerSide * 2;
  const remainder = Number((weightPerSide - achievedPerSide).toFixed(2));

  return {
    weightPerSide,
    achievedPerSide,
    achievedTotal,
    platesUsed,
    remainder,
  };
}

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
  const [activeTab, setActiveTab] = useState<string>("plates");

  useEffect(() => {
    if (open) {
      setTotalWeight(parsedInitial);
    }
  }, [open, parsedInitial]);

  const bar = BARS.find((b) => b.id === selectedBar) || BARS[0];

  const calculation = useMemo(() => {
    return calculatePlates(totalWeight, bar.weight);
  }, [totalWeight, bar.weight]);

  const adjustWeight = (delta: number) => {
    setTotalWeight((prev) => Math.max(bar.weight, Number((prev + delta).toFixed(1))));
  };

  // Rampa de aquecimento progressiva
  const warmupRamp = useMemo(() => {
    const target = Math.max(bar.weight, totalWeight);
    if (target <= bar.weight) return [];

    const steps: Array<{
      stepNumber: number;
      name: string;
      pct: number;
      total: number;
      perSide: number;
      reps: string;
      desc: string;
      badgeColor: string;
    }> = [];

    // Passo 1: Barra vazia (se houver barra com peso)
    if (bar.weight > 0) {
      steps.push({
        stepNumber: 1,
        name: "Mobilidade & Barra Vazia",
        pct: Math.round((bar.weight / target) * 100),
        total: bar.weight,
        perSide: 0,
        reps: "8-10 reps",
        desc: "Aquecimento articular e ritmo de execução.",
        badgeColor: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300",
      });
    }

    // Passo 2: ~45-50%
    const step2Weight = Math.round((bar.weight + (target - bar.weight) * 0.45) / 2.5) * 2.5;
    if (step2Weight > bar.weight && step2Weight < target - 5) {
      steps.push({
        stepNumber: steps.length + 1,
        name: "Ativação Motora",
        pct: Math.round((step2Weight / target) * 100),
        total: step2Weight,
        perSide: Math.max(0, (step2Weight - bar.weight) / 2),
        reps: "5-6 reps",
        desc: "Ativação neuromuscular sem fadiga.",
        badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
      });
    }

    // Passo 3: ~75-80%
    const step3Weight = Math.round((bar.weight + (target - bar.weight) * 0.75) / 2.5) * 2.5;
    if (step3Weight > (steps[1]?.total || bar.weight) && step3Weight < target) {
      steps.push({
        stepNumber: steps.length + 1,
        name: "Aproximação Pesada",
        pct: Math.round((step3Weight / target) * 100),
        total: step3Weight,
        perSide: Math.max(0, (step3Weight - bar.weight) / 2),
        reps: "2-3 reps",
        desc: "Adaptação de peso sem gerar ácido lático.",
        badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      });
    }

    // Passo 4: Carga de Trabalho (100%)
    steps.push({
      stepNumber: steps.length + 1,
      name: "Séries de Trabalho",
      pct: 100,
      total: target,
      perSide: Math.max(0, (target - bar.weight) / 2),
      reps: "Meta do treino",
      desc: "Séries efetivas para força e hipertrofia.",
      badgeColor: "border-primary/40 bg-primary/10 text-primary font-bold",
    });

    return steps;
  }, [totalWeight, bar.weight]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg">Calculadora de Anilhas & Aquecimento</DialogTitle>
              <DialogDescription className="text-xs">
                {exerciseName ? `Carga para: ${exerciseName}` : "Distribuição visual de anilhas e rampa progressiva"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3.5 pt-1">
          {/* Carga Alvo e Barra */}
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-2.5">
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
                    className="h-6 text-xs px-2 font-mono"
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
                  className="text-lg font-bold font-mono h-10 pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                  kg
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-border/40">
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

          {/* Abas: Montagem vs Rampa de Aquecimento */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-9 p-1">
              <TabsTrigger value="plates" className="text-xs gap-1.5 font-semibold">
                <Layers className="h-3.5 w-3.5" />
                <span>Montagem da Barra</span>
              </TabsTrigger>
              <TabsTrigger value="warmup" className="text-xs gap-1.5 font-semibold">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                <span>Rampa de Aquecimento</span>
              </TabsTrigger>
            </TabsList>

            {/* ABA 1: MONTAGEM DA BARRA */}
            <TabsContent value="plates" className="mt-2.5 space-y-2.5">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex flex-col items-center justify-center">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Visualização da Manga (Cada Lado)
                </div>

                <div className="w-full flex items-center justify-center overflow-x-auto py-2 min-h-[100px]">
                  <div className="flex items-center gap-1.5">
                    {/* Manga da barra */}
                    <div className="w-4 h-12 bg-slate-500 rounded-l-md border-r-2 border-slate-700 shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-full bg-slate-400" />
                    </div>

                    {/* Anilhas */}
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
                              height: `${Math.round(plate.height * 0.9)}px`,
                              backgroundColor: plate.color,
                              borderColor: plate.border,
                              color: plate.text,
                            }}
                            className="w-6 rounded-sm border-2 flex flex-col items-center justify-center font-bold text-[8.5px] shadow-sm select-none transition-all hover:scale-105"
                            title={`${plate.label} (${plate.weight}kg)`}
                          >
                            <span className="-rotate-90 whitespace-nowrap tracking-tighter">
                              {plate.label}
                            </span>
                          </div>
                        ))
                      )
                    )}

                    {calculation.platesUsed.length > 0 && (
                      <div
                        className="w-3.5 h-6 rounded-sm bg-zinc-800 border border-zinc-600 shadow-inner flex items-center justify-center"
                        title="Presilha de segurança"
                      >
                        <div className="w-1 h-2.5 bg-zinc-400 rounded-full" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full pt-2.5 border-t border-primary/10 mt-1 text-center">
                  <div className="text-xs font-medium text-foreground">
                    Coloque em <strong>cada lado</strong>:
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1.5">
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
            </TabsContent>

            {/* ABA 2: RAMPA DE AQUECIMENTO */}
            <TabsContent value="warmup" className="mt-2.5 space-y-2">
              <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2">
                <div className="text-xs text-muted-foreground leading-relaxed">
                  Sequência científica de aproximação para preparar músculos e articulações sem acumular fadiga:
                </div>

                <div className="space-y-2 pt-1">
                  {warmupRamp.map((step) => {
                    const stepCalc = calculatePlates(step.total, bar.weight);
                    return (
                      <div
                        key={step.stepNumber}
                        className="rounded-lg border border-border/60 bg-muted/20 p-2.5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={step.badgeColor}>
                              {step.name} ({step.pct}%)
                            </Badge>
                            <span className="font-semibold text-foreground text-xs">
                              {step.reps}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">{step.desc}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-sm text-foreground">
                            {step.total} kg
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {step.perSide > 0 ? `${step.perSide}kg/lado` : "Só barra"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-1">
            <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto text-xs">
              <Check className="h-4 w-4 mr-1.5" /> Concluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
