import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Timer, 
  RotateCcw, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Plus, 
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TimerMode = "EMOM" | "AMRAP" | "Tabata" | "Livre";

interface TrainingTimerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: TimerMode;
}

function playSound(freq: number, duration: number = 0.15, type: OscillatorType = "sine") {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.01);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);

    setTimeout(() => {
      try { ctx.close(); } catch { /* ignore */ }
    }, (duration + 0.5) * 1000);
  } catch {
    // Audio context might be restricted before user interaction
  }
}

export function TrainingTimerDialog({
  open,
  onOpenChange,
  defaultMode = "EMOM",
}: TrainingTimerDialogProps) {
  const [mode, setMode] = useState<TimerMode>(defaultMode);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // EMOM / E2MOM Settings
  const [emomIntervalMinutes, setEmomIntervalMinutes] = useState(1); // 1 = EMOM, 2 = E2MOM, 3 = E3MOM, etc.
  const [totalMinutes, setTotalMinutes] = useState(10); // for EMOM & AMRAP
  const [currentBlock, setCurrentBlock] = useState(1);

  // Tabata Settings
  const [tabataRounds, setTabataRounds] = useState(8); // 8 rounds = 4 min
  const [tabataWorkSec, setTabataWorkSec] = useState(20);
  const [tabataRestSec, setTabataRestSec] = useState(10);

  // Running state
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60); // current countdown
  const [amrapRounds, setAmrapRounds] = useState(0);

  // Tabata specific
  const [currentTabataRound, setCurrentTabataRound] = useState(1);
  const [isTabataWork, setIsTabataWork] = useState(true);

  // Livre specific (stopwatch count up)
  const [livreSeconds, setLivreSeconds] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Computed total blocks for EMOM
  const totalBlocks = Math.max(1, Math.ceil(totalMinutes / emomIntervalMinutes));

  // Audio helper
  const triggerBeep = (freq: number, dur = 0.15) => {
    if (soundEnabled) {
      playSound(freq, dur);
    }
  };

  const resetTimer = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (mode === "EMOM") {
      setSecondsLeft(emomIntervalMinutes * 60);
      setCurrentBlock(1);
    } else if (mode === "AMRAP") {
      setSecondsLeft(Math.max(1, totalMinutes) * 60);
      setAmrapRounds(0);
    } else if (mode === "Tabata") {
      setIsTabataWork(true);
      setCurrentTabataRound(1);
      setSecondsLeft(tabataWorkSec);
    } else if (mode === "Livre") {
      setLivreSeconds(0);
    }
  };

  // Reset when mode changes or settings change
  useEffect(() => {
    resetTimer();
  }, [mode, totalMinutes, emomIntervalMinutes, tabataRounds, tabataWorkSec, tabataRestSec]);

  // Main Timer tick
  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (mode === "Livre") {
        setLivreSeconds((prev) => prev + 1);
        return;
      }

      setSecondsLeft((prev) => {
        // Countdown beeps at 3, 2, 1
        if (prev <= 4 && prev > 1) {
          triggerBeep(600, 0.1);
        }

        if (prev <= 1) {
          // Transition logic
          if (mode === "EMOM") {
            if (currentBlock >= totalBlocks) {
              // EMOM Finished!
              triggerBeep(1200, 0.5);
              setRunning(false);
              return 0;
            }
            // Next block
            triggerBeep(950, 0.35);
            setCurrentBlock((b) => b + 1);
            return emomIntervalMinutes * 60;
          }

          if (mode === "AMRAP") {
            // AMRAP Finished!
            triggerBeep(1200, 0.6);
            setRunning(false);
            return 0;
          }

          if (mode === "Tabata") {
            if (isTabataWork) {
              // Switch to rest
              triggerBeep(800, 0.3);
              setIsTabataWork(false);
              return tabataRestSec;
            } else {
              // Rest ended, check if last round
              if (currentTabataRound >= tabataRounds) {
                triggerBeep(1200, 0.6);
                setRunning(false);
                return 0;
              }
              // Next round work
              triggerBeep(1000, 0.35);
              setIsTabataWork(true);
              setCurrentTabataRound((r) => r + 1);
              return tabataWorkSec;
            }
          }
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode, currentBlock, totalBlocks, emomIntervalMinutes, isTabataWork, currentTabataRound, tabataRounds, tabataWorkSec, tabataRestSec, soundEnabled]);

  // Format MM : SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`;
  };

  const displayTime = mode === "Livre" ? formatTime(livreSeconds) : formatTime(secondsLeft);
  const emomModeLabel = emomIntervalMinutes === 1 ? "EMOM" : `E${emomIntervalMinutes}MOM`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[95vw] max-w-md rounded-2xl bg-zinc-950 text-white border border-zinc-800/90 p-5 sm:p-6 shadow-2xl overflow-hidden"
      >
        {/* Header - note: DialogContent already renders the single X close button at top-right */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/25 text-orange-500 shadow-sm">
              <Timer className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight text-orange-500">
                Timer de Treino
              </DialogTitle>
              <div className="text-[11px] text-zinc-400 font-medium">
                {mode === "EMOM" ? `${emomModeLabel} • Bloco ${currentBlock}/${totalBlocks}` : mode}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pr-8">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Som ativado" : "Som desativado"}
              aria-label={soundEnabled ? "Som ativado" : "Som desativado"}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5 text-zinc-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mt-4 grid grid-cols-4 gap-1 rounded-xl bg-zinc-900/80 p-1 border border-zinc-800/80">
          {(["EMOM", "AMRAP", "Tabata", "Livre"] as TimerMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                resetTimer();
              }}
              className={cn(
                "h-9 rounded-lg text-xs font-semibold transition-all select-none",
                mode === m
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Big Counter Card */}
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-7 relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Badge indicator */}
          <div className="mb-2">
            {mode === "EMOM" && (
              <span className="rounded-full bg-zinc-800/90 border border-zinc-700/60 px-3.5 py-1 text-xs font-medium text-zinc-300">
                {emomIntervalMinutes === 1 ? `Minuto ${currentBlock} de ${totalBlocks}` : `Bloco ${currentBlock} de ${totalBlocks} (${emomModeLabel})`}
              </span>
            )}
            {mode === "AMRAP" && (
              <span className="rounded-full bg-zinc-800/90 border border-zinc-700/60 px-3.5 py-1 text-xs font-medium text-zinc-300">
                Tempo Restante • {amrapRounds} {amrapRounds === 1 ? "round" : "rounds"}
              </span>
            )}
            {mode === "Tabata" && (
              <span className={cn(
                "rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors",
                isTabataWork
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              )}>
                Round {currentTabataRound} de {tabataRounds} • {isTabataWork ? "WORK" : "REST"}
              </span>
            )}
            {mode === "Livre" && (
              <span className="rounded-full bg-zinc-800/90 border border-zinc-700/60 px-3.5 py-1 text-xs font-medium text-zinc-300">
                Cronômetro Livre
              </span>
            )}
          </div>

          {/* Giant Numbers Display */}
          <div className="text-5xl sm:text-6xl font-mono font-black tracking-tight text-white select-none my-1 tabular-nums">
            {displayTime}
          </div>

          {/* AMRAP Round Counter button if running AMRAP */}
          {mode === "AMRAP" && (
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAmrapRounds((r) => Math.max(0, r - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                {amrapRounds} Rounds
              </span>
              <button
                type="button"
                onClick={() => {
                  setAmrapRounds((r) => r + 1);
                  triggerBeep(880, 0.1);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500/40 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Inputs Configuration Row */}
        {mode === "EMOM" && (
          <div className="mt-4 space-y-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 p-3.5">
            {/* Interval selection chips: 1m (EMOM), 2m (E2MOM), 3m (E3MOM), etc. */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-zinc-300 mb-1.5">
                <span>Intervalo por Bloco:</span>
                <span className="font-mono font-bold text-orange-400">{emomModeLabel} ({emomIntervalMinutes} min)</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((m) => (
                  <button
                    key={m}
                    type="button"
                    disabled={running}
                    onClick={() => {
                      setEmomIntervalMinutes(m);
                      if (totalMinutes < m) {
                        setTotalMinutes(m * 5);
                      }
                    }}
                    className={cn(
                      "h-8 rounded-lg text-xs font-bold transition-all select-none",
                      emomIntervalMinutes === m
                        ? "bg-orange-500 text-white shadow-sm"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    )}
                  >
                    {m === 1 ? "1m" : `E${m}M`}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Duration & Blocks row */}
            <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2.5">
              <div>
                <span className="text-xs font-medium text-zinc-300 block">Duração total:</span>
                <span className="text-[11px] text-zinc-500">
                  {totalBlocks} {totalBlocks === 1 ? "bloco" : "blocos"} de {emomIntervalMinutes} min
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min={emomIntervalMinutes}
                  max={180}
                  step={emomIntervalMinutes}
                  value={totalMinutes}
                  disabled={running}
                  onChange={(e) => {
                    const val = Math.max(1, Number(e.target.value) || 1);
                    setTotalMinutes(val);
                  }}
                  className="h-8 w-20 text-center font-mono font-bold bg-zinc-900 border-zinc-700 text-white rounded-lg focus:ring-orange-500 text-xs"
                />
                <span className="text-xs text-zinc-400 font-medium">min</span>
              </div>
            </div>
          </div>
        )}

        {mode === "AMRAP" && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-zinc-900/50 border border-zinc-800/80 px-4 py-3">
            <span className="text-xs font-medium text-zinc-300">
              Duração total (minutos):
            </span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={120}
                value={totalMinutes}
                disabled={running}
                onChange={(e) => setTotalMinutes(Math.max(1, Number(e.target.value) || 1))}
                className="h-9 w-20 text-center font-mono font-bold bg-zinc-900 border-zinc-700 text-white rounded-lg focus:ring-orange-500"
              />
              <span className="text-xs text-zinc-400 font-medium">min</span>
            </div>
          </div>
        )}

        {mode === "Tabata" && (
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-zinc-900/50 border border-zinc-800/80 p-3 text-center">
            <div>
              <div className="text-[10px] text-zinc-400 uppercase font-bold">Rounds</div>
              <Input
                type="number"
                min={1}
                max={50}
                value={tabataRounds}
                disabled={running}
                onChange={(e) => setTabataRounds(Math.max(1, Number(e.target.value) || 1))}
                className="h-8 mt-1 text-center font-mono font-bold bg-zinc-900 border-zinc-700 text-white rounded-lg text-xs"
              />
            </div>
            <div>
              <div className="text-[10px] text-emerald-400 uppercase font-bold">Work (s)</div>
              <Input
                type="number"
                min={5}
                max={300}
                value={tabataWorkSec}
                disabled={running}
                onChange={(e) => setTabataWorkSec(Math.max(1, Number(e.target.value) || 1))}
                className="h-8 mt-1 text-center font-mono font-bold bg-zinc-900 border-zinc-700 text-emerald-400 rounded-lg text-xs"
              />
            </div>
            <div>
              <div className="text-[10px] text-amber-400 uppercase font-bold">Rest (s)</div>
              <Input
                type="number"
                min={0}
                max={180}
                value={tabataRestSec}
                disabled={running}
                onChange={(e) => setTabataRestSec(Math.max(0, Number(e.target.value) || 0))}
                className="h-8 mt-1 text-center font-mono font-bold bg-zinc-900 border-zinc-700 text-amber-400 rounded-lg text-xs"
              />
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={resetTimer}
            className="h-12 rounded-xl border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 font-semibold gap-2 transition-all active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4 text-zinc-400" />
            Reiniciar
          </Button>

          <Button
            type="button"
            onClick={() => {
              if (!running) {
                triggerBeep(900, 0.2);
              }
              setRunning(!running);
            }}
            className={cn(
              "h-12 rounded-xl text-white font-bold gap-2 transition-all active:scale-[0.98] shadow-lg",
              running
                ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/25"
            )}
          >
            {running ? (
              <>
                <Pause className="h-4 w-4 fill-current" /> Pausar
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" /> Iniciar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
