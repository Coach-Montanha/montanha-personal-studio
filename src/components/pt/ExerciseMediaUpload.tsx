import { useState } from "react";
import { Upload, Play, VideoOff, X, Loader2, Search, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { uploadVideoThumbnail } from "@/lib/thumbnail-utils";
import { Button } from "@/components/ui/button";

type MediaType = "image" | "video" | "youtube";

interface ExerciseMediaUploadProps {
  mediaUrl?: string | null;
  mediaType?: string | null;
  thumbnailUrl?: string | null;
  onUpload: (url: string, type: MediaType, thumbnailUrl?: string | null) => void;
  onRemove: () => void;
  onOpenLibrary?: () => void;
}

export function ExerciseMediaUpload({
  mediaUrl,
  mediaType,
  thumbnailUrl,
  onUpload,
  onRemove,
  onOpenLibrary,
}: ExerciseMediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [showYoutube, setShowYoutube] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  async function handleFileUpload(file: File) {
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Arquivo maior que 100MB.");
      return;
    }
    setUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Não autenticado");

      const ext = file.name.split(".").pop();
      const isVideo = file.type.startsWith("video/");
      const filePath = `${userId}/${Date.now()}.${ext}`;

      // Inicia a geração de miniatura se for vídeo
      const thumbPromise = isVideo ? uploadVideoThumbnail(file, userId) : Promise.resolve(null);

      const [{ error: uploadError }, generatedThumb] = await Promise.all([
        supabase.storage
          .from("exercise-media")
          .upload(filePath, file, { contentType: file.type }),
        thumbPromise,
      ]);

      if (uploadError) throw uploadError;

      // Bucket privado — URL assinada com validade máxima (~100 anos) para uso perene.
      const { data: signed, error: signErr } = await supabase.storage
        .from("exercise-media")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 100);
      if (signErr || !signed?.signedUrl) throw signErr ?? new Error("Falha ao gerar URL");

      setMediaError(false);
      onUpload(signed.signedUrl, isVideo ? "video" : "image", generatedThumb);
      toast.success(isVideo ? "Vídeo e miniatura enviados com sucesso!" : "Mídia enviada com sucesso!");
    } catch (err: any) {
      toast.error(`Erro: ${err.message ?? err}`);
    }
    setUploading(false);
  }

  function handleYoutubeAdd() {
    if (!youtubeUrl.trim()) return;
    const match = youtubeUrl.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/,
    );
    if (!match) {
      toast.error("URL do YouTube inválida.");
      return;
    }
    const videoId = match[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const ytThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    setMediaError(false);
    onUpload(embedUrl, "youtube", ytThumb);
    setYoutubeUrl("");
    setShowYoutube(false);
  }

  const inputId = `exercise-media-input-${Math.random().toString(36).slice(2, 8)}`;

  // Detecção inteligente do formato de mídia
  const isYoutube =
    mediaType === "youtube" ||
    /youtube\.com|youtu\.be/i.test(mediaUrl || "");

  const isVideo =
    !isYoutube &&
    (mediaType === "video" ||
      mediaType === "upload" ||
      /\.(mp4|webm|mov|m4v)(\?|$)/i.test(mediaUrl || "") ||
      (mediaUrl || "").includes("vd.mfitpersonal.com.br") ||
      ((mediaUrl || "").includes("/storage/v1/") && !/\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/i.test(mediaUrl || "")));

  if (mediaUrl) {
    if (mediaError) {
      return (
        <div className="group/media relative flex flex-col items-center justify-center p-3 text-center rounded-lg border border-amber-500/30 bg-amber-500/5 w-full aspect-video shadow-xs">
          <AlertCircle className="h-6 w-6 text-amber-500 mb-1" />
          <p className="text-xs font-semibold text-foreground">Demonstração indisponível</p>
          <p className="text-[10px] text-muted-foreground mb-2">O arquivo não respondeu ou o link expirou.</p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {onOpenLibrary && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onOpenLibrary}
                className="h-7 text-xs px-2.5 border-primary/30 text-primary hover:bg-primary/5"
              >
                <Search className="h-3 w-3 mr-1" /> Trocar da Biblioteca
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onRemove}
              className="h-7 text-xs px-2 text-destructive hover:bg-destructive/10"
            >
              Remover
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="group/media relative overflow-hidden rounded-lg border border-border/80 bg-black/95 w-full aspect-video shadow-xs">
        {isYoutube ? (
          <iframe
            src={mediaUrl}
            className="h-full w-full object-cover"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : isVideo ? (
          <video
            src={mediaUrl}
            poster={thumbnailUrl || `${mediaUrl}#t=0.001`}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            onError={() => setMediaError(true)}
          />
        ) : (
          <img
            src={mediaUrl}
            alt="Demonstração do Exercício"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            onError={() => setMediaError(true)}
          />
        )}
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-destructive/90 text-destructive-foreground shadow-xs transition-opacity opacity-80 hover:opacity-100 hover:bg-destructive z-10"
          aria-label="Remover mídia"
          title="Remover vídeo/foto"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  // Estado quando o movimento NÃO TEM VÍDEO
  return (
    <div className="space-y-2 rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 p-3 text-center">
      <div className="flex flex-col items-center justify-center gap-1">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <VideoOff className="h-3.5 w-3.5" />
        </span>
        <p className="text-xs font-semibold text-foreground">Movimento sem vídeo</p>
        <p className="text-[10px] text-muted-foreground">O aluno executará sem demonstração visual.</p>
      </div>

      <div className="pt-1 flex flex-col gap-1.5">
        {onOpenLibrary && (
          <Button
            type="button"
            size="sm"
            variant="default"
            onClick={onOpenLibrary}
            className="h-7 text-xs font-medium w-full gap-1.5 shadow-xs"
          >
            <Search className="h-3.5 w-3.5" /> Vincular da Biblioteca
          </Button>
        )}

        <div className="flex items-center justify-center gap-2 pt-0.5 text-[11px]">
          <button
            type="button"
            onClick={() => document.getElementById(inputId)?.click()}
            disabled={uploading}
            className="text-primary hover:underline font-medium flex items-center gap-1"
          >
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
            {uploading ? "Enviando..." : "Enviar arquivo"}
          </button>
          <span className="text-muted-foreground/40">•</span>
          <button
            type="button"
            onClick={() => setShowYoutube(true)}
            className="text-primary hover:underline font-medium flex items-center gap-1"
          >
            <Play className="h-3 w-3" /> YouTube
          </button>
        </div>
      </div>

      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />

      {showYoutube && (
        <div className="flex gap-1.5 pt-1.5">
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="flex-1 rounded-md border bg-background px-2.5 py-1 text-xs"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleYoutubeAdd}
            className="h-7 px-2.5 text-xs"
          >
            OK
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setShowYoutube(false)}
            className="h-7 px-1.5"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
