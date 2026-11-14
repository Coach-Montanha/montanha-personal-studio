import { useMemo, useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Video, Dumbbell, Check, Loader2, ArrowLeftRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import localMfitCatalog from "@/data/mfit-exercises-normalized.json";
import { filterAndRankExercises } from "@/lib/search-exercises";
import { resolveExerciseThumbnail } from "@/lib/thumbnail-utils";
import type { LibraryExercise } from "./AddExerciseDialog";

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
  "Kettlebell",
  "Barbell",
  "Ginásticos",
  "Corpo inteiro",
];

interface SubstituteExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentExerciseName: string;
  onSelect: (exercise: LibraryExercise) => Promise<void>;
}

export function SubstituteExerciseDialog({
  open,
  onOpenChange,
  currentExerciseName,
  onSelect,
}: SubstituteExerciseDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("Todos");
  const [substituting, setSubstituting] = useState(false);
  const chipsScrollRef = useRef<HTMLDivElement>(null);

  const scrollChips = (direction: "left" | "right") => {
    if (chipsScrollRef.current) {
      const offset = direction === "left" ? -240 : 240;
      chipsScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (open) {
      setSearch(currentExerciseName || "");
    }
  }, [open, currentExerciseName]);

  const { data: library = [], isLoading } = useQuery({
    queryKey: ["exercise-library-full"],
    queryFn: async () => {
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

  async function handlePick(item: LibraryExercise) {
    try {
      setSubstituting(true);
      await onSelect(item);
      onOpenChange(false);
    } finally {
      setSubstituting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] w-[95vw] sm:max-w-4xl lg:max-w-5xl overflow-hidden p-0 rounded-2xl shadow-2xl">
        <div className="flex max-h-[92dvh] flex-col">
          {/* Header */}
          <DialogHeader className="border-b border-border/60 p-4 sm:p-5 pb-3 sm:pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <ArrowLeftRight className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-semibold">Substituir Exercício</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground pt-0.5">
                  Substituindo <span className="font-semibold text-foreground">"{currentExerciseName}"</span> por outro movimento do acervo oficial. O nome e o vídeo serão atualizados mantendo os parâmetros configurados.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Search & Muscle Filters */}
          <div className="space-y-3 border-b border-border/60 bg-muted/20 p-3.5 sm:p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar exercício substituto por nome ou grupo muscular…"
                autoFocus
                className="h-10 pl-9.5 pr-4 text-sm rounded-xl bg-background"
              />
            </div>

            {/* Muscle Filter Chips com navegação por setas e scroll suave */}
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={() => scrollChips("left")}
                aria-label="Rolar categorias para esquerda"
                className="absolute -left-1 z-10 hidden sm:flex h-7 w-7 items-center justify-center rounded-full bg-background/95 border border-border shadow-sm text-muted-foreground hover:text-foreground hover:bg-accent transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div
                ref={chipsScrollRef}
                className="flex gap-1.5 overflow-x-auto px-1 sm:px-7 pb-1.5 scrollbar-thin scrollbar-thumb-border/70 hover:scrollbar-thumb-primary/40 [touch-action:pan-x]"
              >
                {MUSCLE_FILTER_CHIPS.map((chip) => {
                  const active = selectedGroup === chip;
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setSelectedGroup(chip)}
                      className={cn(
                        "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150 select-none",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                          : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground border border-border/70 hover:border-border"
                      )}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => scrollChips("right")}
                aria-label="Rolar categorias para direita"
                className="absolute -right-1 z-10 hidden sm:flex h-7 w-7 items-center justify-center rounded-full bg-background/95 border border-border shadow-sm text-muted-foreground hover:text-foreground hover:bg-accent transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List of Library Exercises em Grid Responsivo de 2 Colunas no Desktop */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-5">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                <p className="mt-2 text-xs font-medium text-muted-foreground">Carregando acervo oficial de exercícios…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Dumbbell className="h-10 w-10 text-muted-foreground/40" />
                <p className="mt-3 text-sm font-semibold">Nenhum exercício encontrado</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">Tente buscar por outro termo ou selecione outra categoria nas abas acima.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {filtered.slice(0, 60).map((item) => {
                  const isCurrent = item.name.toLowerCase().trim() === currentExerciseName.toLowerCase().trim();
                  return (
                    <div
                      key={item.id}
                      onClick={() => !substituting && !isCurrent && handlePick(item)}
                      className={cn(
                        "flex items-center justify-between gap-3 p-3 rounded-xl transition-all cursor-pointer text-left border",
                        isCurrent
                          ? "bg-muted/60 opacity-60 cursor-not-allowed border-border/40"
                          : "bg-card hover:bg-primary/5 hover:border-primary/40 border-border/60 hover:shadow-sm active:scale-[0.99]"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Miniatura ou Ícone */}
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center border border-border/60">
                          {(() => {
                            const thumb = resolveExerciseThumbnail(item.media_url, item.thumbnail_url);
                            const isDirectVideo = !!item.media_url && (item.media_type === "video" || item.media_type === "upload" || /\.(mp4|webm|mov)(\?|$)/i.test(item.media_url));
                            if (thumb) {
                              return (
                                <img
                                  src={thumb}
                                  alt={item.name}
                                  loading="lazy"
                                  className="h-full w-full object-cover"
                                />
                              );
                            }
                            if (isDirectVideo) {
                              return (
                                <video
                                  src={`${item.media_url}#t=0.001`}
                                  preload="metadata"
                                  muted
                                  playsInline
                                  className="h-full w-full object-cover pointer-events-none"
                                />
                              );
                            }
                            if (item.media_url) {
                              return <Video className="h-5 w-5 text-primary" />;
                            }
                            return <Dumbbell className="h-5 w-5 text-muted-foreground/60" />;
                          })()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                          <div className="flex items-center gap-2 pt-1 flex-wrap">
                            {item.muscle_group && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal border-border/70">
                                {item.muscle_group}
                              </Badge>
                            )}
                            {item.media_url && (
                              <span className="flex items-center gap-0.5 text-[10px] text-primary font-medium">
                                <Video className="h-2.5 w-2.5" /> Possui vídeo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isCurrent ? (
                          <Badge variant="secondary" className="text-[10px]">Atual</Badge>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={substituting}
                            className="h-8 px-2.5 text-xs font-semibold gap-1 hover:bg-primary hover:text-primary-foreground border-border/80"
                          >
                            {substituting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                            <span>Escolher</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
