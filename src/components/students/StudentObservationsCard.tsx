import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Image as ImageIcon,
  Plus,
  Trash2,
  X,
  Maximize2,
  Calendar,
  Send,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDateBR } from "@/lib/format";

type ObservationItem = {
  id: string;
  student_id: string;
  content: string;
  image_url?: string | null;
  created_at: string;
};

// Client-side image compression to lightweight JPEG (~30-60KB) via canvas
function compressImage(file: File, maxDim = 800, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(e.target?.result as string);
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function StudentObservationsCard({
  studentId,
  initialNotes,
}: {
  studentId: string;
  initialNotes?: string | null;
}) {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch observations from student_observations table (with graceful fallback)
  const { data: observations = [], isLoading } = useQuery<ObservationItem[]>({
    queryKey: ["student-observations", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_observations" as any)
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false });

      if (error) {
        // If table doesn't exist yet, fallback to single legacy note if present
        if (initialNotes) {
          return [
            {
              id: "legacy",
              student_id: studentId,
              content: initialNotes,
              created_at: new Date().toISOString(),
            },
          ];
        }
        return [];
      }
      return (data ?? []) as ObservationItem[];
    },
  });

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    try {
      const compressed = await compressImage(file);
      setPreviewImage(compressed);
    } catch {
      toast.error("Erro ao processar imagem.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !previewImage) {
      toast.error("Digite uma observação ou anexe uma imagem.");
      return;
    }

    setSubmitting(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (!userId) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("student_observations" as any)
        .insert({
          user_id: userId,
          student_id: studentId,
          content: content.trim(),
          image_url: previewImage,
        });

      if (error) {
        // Fallback: update students.notes directly if table not yet migrated
        const nowStr = new Date().toLocaleDateString("pt-BR");
        const fallbackText = initialNotes
          ? `${initialNotes}\n\n[${nowStr}] ${content.trim()}`
          : `[${nowStr}] ${content.trim()}`;

        await supabase
          .from("students")
          .update({ notes: fallbackText })
          .eq("id", studentId);
      }

      toast.success("Observação registrada com sucesso!");
      setContent("");
      setPreviewImage(null);
      qc.invalidateQueries({ queryKey: ["student-observations", studentId] });
      qc.invalidateQueries({ queryKey: ["student", studentId] });
    } catch (err: any) {
      toast.error(`Erro ao salvar observação: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteObservation = async (obsId: string) => {
    if (obsId === "legacy") {
      // Clear notes on students table
      await supabase.from("students").update({ notes: null }).eq("id", studentId);
      qc.invalidateQueries({ queryKey: ["student-observations", studentId] });
      qc.invalidateQueries({ queryKey: ["student", studentId] });
      toast.success("Observação removida");
      return;
    }

    const { error } = await supabase
      .from("student_observations" as any)
      .delete()
      .eq("id", obsId);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Observação excluída");
    qc.invalidateQueries({ queryKey: ["student-observations", studentId] });
  };

  return (
    <Card className="p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between gap-2 border-b pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold tracking-tight">Registro de Observações</h2>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {observations.length}
          </span>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Histórico clínico, evoluções e anotações técnicas
        </span>
      </div>

      {/* Input area */}
      <form onSubmit={handleAddObservation} className="space-y-3">
        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Digite uma observação sobre o aluno (ex: evolução postural, ajustes de treino, restrições médicas, metas)..."
            className="min-h-[85px] resize-y text-sm leading-relaxed pr-24"
          />

          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => fileInputRef.current?.click()}
              title="Anexar imagem pequena"
            >
              <ImageIcon className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">Imagem</span>
            </Button>
          </div>
        </div>

        {/* Thumbnail preview of selected image */}
        {previewImage && (
          <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-2.5">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-background">
              <img
                src={previewImage}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute right-0.5 top-0.5 rounded-full bg-destructive text-white p-0.5 shadow-xs hover:bg-destructive/90"
                title="Remover imagem"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="min-w-0 flex-1 text-xs">
              <span className="font-semibold text-foreground">Imagem anexada</span>
              <p className="text-muted-foreground truncate">Pronta para ser salva com a observação</p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={submitting || (!content.trim() && !previewImage)}
            size="sm"
            className="gap-1.5 font-semibold transition-all duration-200 active:scale-[0.98]"
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Salvar Observação
          </Button>
        </div>
      </form>

      {/* Observations list */}
      <div className="mt-6 space-y-3">
        {isLoading ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            Carregando observações…
          </div>
        ) : observations.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground bg-muted/20">
            Nenhuma observação registrada ainda. Use o campo acima para adicionar textos e anexar imagens.
          </div>
        ) : (
          observations.map((obs) => (
            <div
              key={obs.id}
              className="group relative flex flex-col sm:flex-row gap-3 rounded-xl border bg-card/60 p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-xs"
            >
              {obs.image_url && (
                <div
                  className="relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-muted transition-transform hover:scale-105"
                  onClick={() => setZoomedImage(obs.image_url!)}
                  title="Clique para ampliar"
                >
                  <img
                    src={obs.image_url}
                    alt="Anexo de observação"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100">
                    <Maximize2 className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                    <Calendar className="h-3 w-3 text-primary" />
                    <span>
                      {formatDateBR(obs.created_at)} às{" "}
                      {new Date(obs.created_at).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={() => handleDeleteObservation(obs.id)}
                    title="Excluir observação"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {obs.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Image zoom preview modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl border border-white/20 bg-background p-2">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/90 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={zoomedImage}
              alt="Ampliada"
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </Card>
  );
}
