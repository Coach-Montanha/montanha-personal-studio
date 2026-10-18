import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Search,
  Plus,
  Video,
  Dumbbell,
  Library,
  ExternalLink,
  Check,
  CheckSquare,
  Square,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import localMfitCatalog from "@/data/mfit-exercises-normalized.json";
import { filterAndRankExercises } from "@/lib/search-exercises";

export type LibraryExercise = {
  id: string;
  name: string;
  muscle_group: string | null;
  media_url: string | null;
  media_type: string | null;
  thumbnail_url: string | null;
};

const MUSCLE_FILTER_CHIPS = [
  "Todos",
  "Peito",
  "Costas",
  "Pernas",
  "Ombros",
  "Braços",
  "Core",
  "Cardio",
  "Mobilidade",
  "Funcional",
];

export function AddExerciseDialog({
  open,
  onOpenChange,
  trainingDayId,
  currentCount,
  substituteForId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  trainingDayId: string;
  currentCount: number;
  substituteForId?: string | null;
}) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("Todos");
  const [selectedExercises, setSelectedExercises] = useState<Map<string, LibraryExercise>>(new Map());
  const [customName, setCustomName] = useState("");
  const [adding, setAdding] = useState(false);

  const { data: library = [] } = useQuery({
    queryKey: ["exercise-library-full"],
    queryFn: async () => {
      // 1. Tenta carregar do Supabase com chunking para contornar o limite de 1000
      let allDbExercises: LibraryExercise[] = [];
      let from = 0;
      const step = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from("pt_exercises_library" as never)
          .select("id,name,muscle_group,media_url,media_type,thumbnail_url")
          .order("name")
          .range(from, from + step - 1);

        if (error || !data || data.length === 0) {
          hasMore = false;
        } else {
          allDbExercises.push(...(data as unknown as LibraryExercise[]));
          if (data.length < step) hasMore = false;
          else from += step;
        }
      }

      // 2. Se banco tiver exercícios, mescla com o catálogo local para garantir 100% de cobertura
      const knownNames = new Set(allDbExercises.map((e) => e.name.toLowerCase().trim()));
      const localAdditions: LibraryExercise[] = (localMfitCatalog as any[])
        .filter((item) => !knownNames.has(item.name.toLowerCase().trim()))
        .map((item, idx) => ({
          id: `local-${idx}-${item.name.replace(/\s+/g, "-")}`,
          name: item.name,
          muscle_group: item.muscle_group ?? null,
          media_url: item.media_url ?? null,
          media_type: item.media_type ?? "video",
          thumbnail_url: item.thumbnail_url ?? null,
        }));

      return [...allDbExercises, ...localAdditions];
    },
  });

  const filtered = useMemo(() => {
    return filterAndRankExercises(library, search, selectedGroup);
  }, [library, search, selectedGroup]);

  const toggleSelect = (item: LibraryExercise) => {
    setSelectedExercises((prev) => {
      const next = new Map(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.set(item.id, item);
      }
      return next;
    });
  };

  async function addBatch(itemsToAdd: LibraryExercise[]) {
    if (itemsToAdd.length === 0) return;
    setAdding(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      setAdding(false);
      return;
    }

    const rows = itemsToAdd.map((item, idx) => ({
      user_id: userId,
      training_day_id: trainingDayId,
      exercise_library_id: item.id.startsWith("local-") ? null : item.id,
      name: item.name,
      media_url: item.media_url ?? null,
      media_type: item.media_type ?? null,
      sort_order: currentCount + idx,
      series_type: "reps_load",
      substitute_exercise_id: substituteForId ?? null,
    }));

    const { error } = await supabase.from("pt_training_exercises" as never).insert(rows as never);
    setAdding(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        itemsToAdd.length === 1
          ? `"${itemsToAdd[0].name}" adicionado`
          : `${itemsToAdd.length} exercícios adicionados com sucesso!`
      );
      qc.invalidateQueries({ queryKey: ["pt-day-exercises", trainingDayId] });
      setSelectedExercises(new Map());
      onOpenChange(false);
    }
  }

  async function addCustomExercise() {
    if (!customName.trim()) {
      toast.error("Digite o nome do exercício.");
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    setAdding(true);
    const { data: newExercise } = await supabase
      .from("pt_exercises_library" as never)
      .insert({ user_id: userId, name: customName.trim() } as never)
      .select("id,name,muscle_group,media_url,media_type,thumbnail_url")
      .single();

    const created = (newExercise as unknown as LibraryExercise) ?? {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      muscle_group: null,
      media_url: null,
      media_type: null,
      thumbnail_url: null,
    };

    await addBatch([created]);
    setCustomName("");
    qc.invalidateQueries({ queryKey: ["exercise-library-full"] });
    qc.invalidateQueries({ queryKey: ["pt-library"] });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] max-w-2xl overflow-hidden p-0">
        <div className="flex max-h-[92dvh] flex-col">
          {/* Header */}
          <DialogHeader className="border-b border-border/60 p-4 pb-3">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">Adicionar Exercícios</DialogTitle>
              {selectedExercises.size > 0 && (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-primary">
                  {selectedExercises.size} selecionado{selectedExercises.size > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Selecione um ou mais movimentos do acervo oficial (1.135 exercícios) para prescrever em lote.
            </DialogDescription>
          </DialogHeader>

          {/* Search & Muscle Filters */}
          <div className="space-y-2.5 border-b border-border/60 bg-muted/20 p-3.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome ou grupo muscular…"
                autoFocus
                className="h-10 pl-9 text-sm"
              />
            </div>

            {/* Muscle Filter Chips */}
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {MUSCLE_FILTER_CHIPS.map((chip) => {
                const active = selectedGroup === chip;
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setSelectedGroup(chip)}
                    className={cn(
                      "whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3">
            {filtered.length > 0 ? (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {filtered.slice(0, 60).map((exercise) => {
                  const isSelected = selectedExercises.has(exercise.id);
                  const thumb =
                    exercise.thumbnail_url ??
                    (exercise.media_url && /(?:youtube\.com|youtu\.be)/.test(exercise.media_url)
                      ? `https://img.youtube.com/vi/${
                          exercise.media_url.match(
                            /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/
                          )?.[1]
                        }/hqdefault.jpg`
                      : null);

                  return (
                    <li key={exercise.id}>
                      <div
                        onClick={() => toggleSelect(exercise)}
                        className={cn(
                          "group flex cursor-pointer items-center gap-2.5 rounded-lg border p-2 text-left transition-all duration-150",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/40"
                            : "border-border/60 bg-card/60 hover:border-border hover:bg-accent/60"
                        )}
                      >
                        {/* Checkbox indicator */}
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-primary" />
                          ) : (
                            <Square className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground" />
                          )}
                        </div>

                        {/* Thumbnail */}
                        <div className="relative h-11 w-14 flex-shrink-0 overflow-hidden rounded bg-muted">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Dumbbell className="h-4 w-4 text-muted-foreground/40" strokeWidth={1.5} />
                            </div>
                          )}
                          {exercise.media_url && (
                            <span className="absolute bottom-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background/90 text-foreground shadow-xs">
                              <Video className="h-2 w-2" />
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-semibold leading-tight text-foreground">
                            {exercise.name}
                          </div>
                          {exercise.muscle_group && (
                            <Badge
                              variant="secondary"
                              className="mt-1 h-3.5 px-1 text-[9px] font-normal"
                            >
                              {exercise.muscle_group}
                            </Badge>
                          )}
                        </div>

                        {/* Quick 1-click single add */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={adding}
                          onClick={(e) => {
                            e.stopPropagation();
                            addBatch([exercise]);
                          }}
                          title="Adicionar apenas este exercício"
                          className="h-7 w-7 shrink-0 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                <Library className="mb-3 h-8 w-8 text-muted-foreground/50" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">
                  {search
                    ? `Nenhum resultado para "${search}"`
                    : "Nenhum movimento encontrado para o filtro."}
                </p>
                <Link
                  to="/personal-trainer/biblioteca"
                  className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Gerenciar biblioteca completa
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Sticky Multi-Add Bar (quando há itens selecionados) */}
          {selectedExercises.size > 0 && (
            <div className="flex items-center justify-between border-t border-primary/20 bg-primary/10 p-3 px-4">
              <div className="text-xs font-medium text-foreground">
                <span className="font-bold tabular-nums text-primary">{selectedExercises.size}</span>{" "}
                exercício{selectedExercises.size > 1 ? "s" : ""} selecionado{selectedExercises.size > 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setSelectedExercises(new Map())}
                >
                  Limpar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={adding}
                  onClick={() => addBatch(Array.from(selectedExercises.values()))}
                  className="h-8 gap-1.5 px-3 text-xs font-medium shadow-sm"
                >
                  {adding ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  Adicionar ao treino
                </Button>
              </div>
            </div>
          )}

          {/* Quick Custom Add Footer */}
          <div className="border-t border-border/60 bg-muted/30 p-3 px-4">
            <div className="flex gap-2">
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Criar movimento personalizado rápido…"
                className="h-9 text-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomExercise();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addCustomExercise}
                disabled={adding || !customName.trim()}
                size="sm"
                className="h-9 gap-1 text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Criar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
