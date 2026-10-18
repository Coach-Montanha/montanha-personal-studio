import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  MoreVertical,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Pencil,
  Check,
  X,
  Loader2,
  Trash2,
  Timer,
  Plus,
  ArrowRight,
  ArrowLeft,
  ArrowLeftRight,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExerciseMediaUpload } from "./ExerciseMediaUpload";
import { IntervalTimer } from "./IntervalTimer";
import { SubstituteExerciseDialog } from "./SubstituteExerciseDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type MediaType = "image" | "video" | "youtube";

export interface TrainingExercise {
  id: string;
  training_day_id: string;
  name: string;
  media_url: string | null;
  media_type: string | null;
  sets_reps: string | null;
  load: string | null;
  rest_seconds: string | null;
  observations: string | null;
  sort_order: number;
  series_type?: string;
  time_seconds?: number;
  inclination?: string;
  pace?: string;
  cadence?: string;
  substitute_exercise_id?: string | null;
}

export function ExerciseCard({
  exercise,
  onDelete,
  onUpdate,
  onSelectSubstitute,
  allExercises,
  initialExpanded = true,
  dragHandle,
  isSubstitute = false,
  highlight = false,
  onNavigateTo,
}: {
  exercise: TrainingExercise;
  trainingDayId?: string;
  onDelete: (id: string) => void;
  onUpdate: () => void;
  onSelectSubstitute?: (exerciseId: string) => void;
  allExercises?: TrainingExercise[];
  initialExpanded?: boolean;
  dragHandle?: React.ReactNode;
  isSubstitute?: boolean;
  highlight?: boolean;
  onNavigateTo?: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(initialExpanded);
  
  useEffect(() => {
    setExpanded(initialExpanded);
  }, [initialExpanded]);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(exercise.name);
  const [savingName, setSavingName] = useState(false);
  const [substituteDialogOpen, setSubstituteDialogOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [showTimer, setShowTimer] = useState(false);

  const [form, setForm] = useState({
    sets_reps: exercise.sets_reps ?? "",
    load: exercise.load ?? "",
    rest_seconds: exercise.rest_seconds?.toString() ?? "",
    observations: exercise.observations ?? "",
    media_url: exercise.media_url ?? "",
    media_type: exercise.media_type ?? "image",
    series_type: exercise.series_type ?? "reps_load",
    time_seconds: exercise.time_seconds?.toString() ?? "",
    inclination: exercise.inclination ?? "",
    pace: exercise.pace ?? "",
    cadence: exercise.cadence ?? "",
  });

  useEffect(() => {
    if (editingName) {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }
  }, [editingName]);

  async function autoSave(patch: Record<string, string | number | null>) {
    const { error } = await supabase
      .from("pt_training_exercises" as never)
      .update(patch as never)
      .eq("id", exercise.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    onUpdate();
  }

  async function commitName() {
    const trimmed = nameDraft.trim();
    if (!trimmed || trimmed === exercise.name) {
      setNameDraft(exercise.name);
      setEditingName(false);
      return;
    }
    setSavingName(true);
    const { error } = await supabase
      .from("pt_training_exercises" as never)
      .update({ name: trimmed } as never)
      .eq("id", exercise.id);
    setSavingName(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Exercício renomeado");
    setEditingName(false);
    onUpdate();
  }

  function cancelName() {
    setNameDraft(exercise.name);
    setEditingName(false);
  }

  return (
    <div 
      id={`exercise-${exercise.id}`}
      className={cn(
        "group/card rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md",
        highlight && "ring-2 ring-primary ring-offset-2 ring-offset-background animate-pulse"
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/70 p-3">
        {dragHandle ?? (
          <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/60" aria-hidden />
        )}

        {editingName ? (
          <div className="flex flex-1 items-center gap-1.5">
            <Input
              ref={nameInputRef}
              value={nameDraft}
              disabled={savingName}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitName();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  cancelName();
                }
              }}
              aria-label="Nome do exercício"
              className="h-8 flex-1 text-sm font-semibold tracking-tight transition-colors duration-150"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={commitName}
              disabled={savingName}
              aria-label="Salvar nome"
              className="h-9 w-9 text-primary hover:bg-primary/10 hover:text-primary sm:h-8 sm:w-8"
            >
              {savingName ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={cancelName}
              disabled={savingName}
              aria-label="Cancelar edição"
              className="h-9 w-9 text-muted-foreground hover:bg-muted hover:text-foreground sm:h-8 sm:w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setSubstituteDialogOpen(true)}
              aria-label={`Substituir ${exercise.name}`}
              className="group/name flex flex-1 items-center gap-1.5 rounded-md text-left text-sm font-bold leading-tight tracking-tight text-foreground outline-none transition-colors duration-150 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card truncate"
              title="Clique para substituir por outro exercício da biblioteca"
            >
              <span className="truncate">{exercise.name}</span>
              <span className="hidden text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60 transition-opacity group-hover/name:inline">
                · {form.series_type === "reps_load" ? "Série/Rep" : 
                   form.series_type === "sets_time" ? "Série/Tempo" :
                   form.series_type === "reps_load_time" ? "Rep/Carga/Tempo" :
                   form.series_type === "reps_time" ? "Rep/Tempo" :
                   form.series_type === "time_inclination" ? "Tempo/Inclinação" :
                   form.series_type === "run" ? "Corrida" :
                   form.series_type === "cadence" ? "Cadência" : "Padrão"}
              </span>
            </button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSubstituteDialogOpen(true)}
              className="h-7 px-2 text-[11px] font-semibold gap-1.5 border-primary/30 text-primary hover:bg-primary/10 shrink-0"
              title="Substituir por outro da biblioteca de exercícios"
            >
              <ArrowLeftRight className="h-3 w-3" />
              <span className="hidden sm:inline">Substituir da Biblioteca</span>
              <span className="sm:hidden">Trocar</span>
            </Button>
          </div>
        )}

        {!editingName && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => setShowTimer(true)}
              aria-label="Cronômetro"
            >
              <Timer className="h-4 w-4" />
            </Button>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="rounded-md p-1 text-muted-foreground outline-none transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              aria-label={expanded ? "Recolher exercício" : "Expandir exercício"}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  aria-label="Mais opções"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setExpanded((v) => !v)}>
                  {expanded ? (
                    <ChevronUp className="mr-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="mr-2 h-4 w-4" />
                  )}
                  {expanded ? "Recolher" : "Expandir"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSubstituteDialogOpen(true)}>
                  <ArrowLeftRight className="mr-2 h-4 w-4 text-primary" />
                  Substituir da biblioteca
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setExpanded(true);
                    setEditingName(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Renomear texto manualmente
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {!isSubstitute && (
                  <DropdownMenuItem
                    onClick={() => onSelectSubstitute?.(exercise.id)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar substituto
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(exercise.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir {isSubstitute ? "substituto" : "exercício"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <Dialog open={showTimer} onOpenChange={setShowTimer}>
        <DialogContent className="sm:max-w-md p-6 bg-white border-none shadow-2xl">
          <DialogHeader className="hidden">
            <DialogTitle>Cronômetro de Exercício</DialogTitle>
          </DialogHeader>
          <IntervalTimer
            sets={parseInt(exercise.sets_reps?.split("x")[0] || "1")}
            workSeconds={exercise.series_type === "sets_time" || exercise.series_type === "reps_time" || exercise.series_type === "reps_load_time" || exercise.series_type === "time_inclination" ? (exercise.time_seconds || 0) : 0}
            restSeconds={parseInt(exercise.rest_seconds || "0")}
            onClose={() => setShowTimer(false)}
          />
        </DialogContent>
      </Dialog>

      {expanded && (
        <div className={cn("space-y-3 p-3", isSubstitute && "bg-muted/30")}>
          {isSubstitute && exercise.substitute_exercise_id && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-[10px] text-primary"
              onClick={() => onNavigateTo?.(exercise.substitute_exercise_id!)}
            >
              <ArrowLeft className="mr-1 h-3 w-3" /> Voltar para o original
            </Button>
          )}

          {!isSubstitute && allExercises?.some(e => e.substitute_exercise_id === exercise.id) && (
            <div className="flex flex-wrap gap-2">
              {allExercises
                .filter(e => e.substitute_exercise_id === exercise.id)
                .map(sub => (
                  <Button
                    key={sub.id}
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1.5 border-primary/30 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/5"
                    onClick={() => onNavigateTo?.(sub.id)}
                  >
                    <ArrowRight className="h-3 w-3" /> Ver Substituto: {sub.name}
                  </Button>
                ))}
            </div>
          )}

          {/* Layout responsivo com mídia compacta (~25% / 220px) e parâmetros de treino ao lado */}
          <div className="flex flex-col sm:flex-row gap-4 items-start pt-1">
            {/* Bloco de Vídeo / Mídia Compacto */}
            <div className="w-full sm:w-56 md:w-60 lg:w-64 shrink-0 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                <span>Vídeo / Demonstração</span>
                <button
                  type="button"
                  onClick={() => setSubstituteDialogOpen(true)}
                  className="text-primary hover:underline text-[10px] font-medium flex items-center gap-0.5"
                  title="Substituir por outro da biblioteca"
                >
                  <ArrowLeftRight className="h-2.5 w-2.5" /> Trocar
                </button>
              </div>
              <ExerciseMediaUpload
                mediaUrl={form.media_url}
                mediaType={form.media_type}
                onUpload={(url, type: MediaType) => {
                  setForm((f) => ({ ...f, media_url: url, media_type: type }));
                  autoSave({ media_url: url, media_type: type });
                }}
                onRemove={() => {
                  setForm((f) => ({ ...f, media_url: "", media_type: "image" }));
                  autoSave({ media_url: null, media_type: null });
                }}
              />
            </div>

            {/* Bloco de Parâmetros de Treino */}
            <div className="flex-1 min-w-0 space-y-3 w-full">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Tipo da série</Label>
                <Select
                  value={form.series_type}
                  onValueChange={(v) => {
                    setForm((f) => ({ ...f, series_type: v }));
                    autoSave({ series_type: v });
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reps_load">Repetições e carga</SelectItem>
                    <SelectItem value="sets_time">Séries e tempo</SelectItem>
                    <SelectItem value="reps_load_time">Repetições, carga e tempo</SelectItem>
                    <SelectItem value="reps_time">Repetições e tempo</SelectItem>
                    <SelectItem value="time_inclination">Tempo e inclinação</SelectItem>
                    <SelectItem value="run">Corrida</SelectItem>
                    <SelectItem value="cadence">Cadência</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(form.series_type === "reps_load" ||
                  form.series_type === "sets_time" ||
                  form.series_type === "reps_load_time" ||
                  form.series_type === "reps_time") && (
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground">Série/rep</Label>
                    <Input
                      value={form.sets_reps}
                      onChange={(e) => setForm((f) => ({ ...f, sets_reps: e.target.value }))}
                      onBlur={(e) => autoSave({ sets_reps: e.target.value || null })}
                      placeholder="4x12"
                      className="h-9"
                    />
                    <div className="flex flex-wrap gap-1 pt-1">
                      {["3x10-12", "4x8-10", "4x12-15", "3x Falha"].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setForm((f) => ({ ...f, sets_reps: preset }));
                            autoSave({ sets_reps: preset });
                          }}
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors",
                            form.sets_reps === preset
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {(form.series_type === "reps_load" || form.series_type === "reps_load_time") && (
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-primary">Carga (Sugerida)</Label>
                    <Input
                      value={form.load}
                      onChange={(e) => setForm((f) => ({ ...f, load: e.target.value }))}
                      onBlur={(e) => autoSave({ load: e.target.value || null })}
                      placeholder="ex: 20kg"
                      className="h-9 border-primary/30 focus-visible:ring-primary/50"
                    />
                  </div>
                )}
                {(form.series_type === "reps_load_time" ||
                  form.series_type === "reps_time" ||
                  form.series_type === "sets_time" ||
                  form.series_type === "time_inclination") && (
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground">Tempo (s)</Label>
                    <Input
                      type="number"
                      value={form.time_seconds}
                      onChange={(e) => setForm((f) => ({ ...f, time_seconds: e.target.value }))}
                      onBlur={(e) =>
                        autoSave({ time_seconds: e.target.value ? parseInt(e.target.value) : null })
                      }
                      placeholder="60"
                      className="h-9"
                    />
                  </div>
                )}
                {form.series_type === "time_inclination" && (
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground">Inclinação</Label>
                    <Input
                      value={form.inclination}
                      onChange={(e) => setForm((f) => ({ ...f, inclination: e.target.value }))}
                      onBlur={(e) => autoSave({ inclination: e.target.value || null })}
                      placeholder="2%"
                      className="h-9"
                    />
                  </div>
                )}
                {form.series_type === "run" && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">Distância</Label>
                      <Input
                        value={form.load}
                        onChange={(e) => setForm((f) => ({ ...f, load: e.target.value }))}
                        onBlur={(e) => autoSave({ load: e.target.value || null })}
                        placeholder="5km"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">Ritmo (Pace)</Label>
                      <Input
                        value={form.pace}
                        onChange={(e) => setForm((f) => ({ ...f, pace: e.target.value }))}
                        onBlur={(e) => autoSave({ pace: e.target.value || null })}
                        placeholder="5:00 min/km"
                        className="h-9"
                      />
                    </div>
                  </>
                )}
                {form.series_type === "cadence" && (
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground">Cadência</Label>
                    <Input
                      value={form.cadence}
                      onChange={(e) => setForm((f) => ({ ...f, cadence: e.target.value }))}
                      onBlur={(e) => autoSave({ cadence: e.target.value || null })}
                      placeholder="2010"
                      className="h-9"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">Intervalo (s)</Label>
                  <Input
                    type="number"
                    value={form.rest_seconds}
                    onChange={(e) => setForm((f) => ({ ...f, rest_seconds: e.target.value }))}
                    onBlur={(e) => autoSave({ rest_seconds: e.target.value || null })}
                    placeholder="60"
                    className="h-9"
                  />
                  <div className="flex flex-wrap gap-1 pt-1">
                    {["30", "45", "60", "90", "120"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setForm((f) => ({ ...f, rest_seconds: preset }));
                          autoSave({ rest_seconds: preset });
                        }}
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors",
                          form.rest_seconds === preset
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {preset}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Observações</Label>
                <Textarea
                  rows={2}
                  value={form.observations}
                  onChange={(e) => setForm((f) => ({ ...f, observations: e.target.value }))}
                  onBlur={(e) => autoSave({ observations: e.target.value || null })}
                  placeholder="Instruções específicas para este exercício…"
                />
              </div>

              <p className="pt-0.5 text-[11px] leading-tight text-muted-foreground/80">
                Toque em qualquer campo para editar — as alterações são salvas automaticamente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de Substituição de Exercício da Biblioteca Oficial */}
      <SubstituteExerciseDialog
        open={substituteDialogOpen}
        onOpenChange={setSubstituteDialogOpen}
        currentExerciseName={exercise.name}
        onSelect={async (newEx) => {
          const patch: Record<string, any> = {
            name: newEx.name,
            media_url: newEx.media_url,
            media_type: newEx.media_type,
            exercise_library_id: newEx.id.startsWith("local-") ? null : newEx.id,
          };
          const { error } = await supabase
            .from("pt_training_exercises" as never)
            .update(patch as never)
            .eq("id", exercise.id);

          if (error) {
            toast.error(`Falha ao substituir exercício: ${error.message}`);
            return;
          }

          setForm((prev) => ({
            ...prev,
            media_url: newEx.media_url ?? "",
            media_type: newEx.media_type ?? "video",
          }));
          setNameDraft(newEx.name);
          toast.success(`Exercício substituído por "${newEx.name}"!`);
          onUpdate();
        }}
      />
    </div>
  );
}
