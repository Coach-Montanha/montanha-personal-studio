import { supabase } from "@/integrations/supabase/client";

/**
 * Resolve a melhor URL de miniatura (thumbnail) para um exercício.
 * 1. Prioriza thumbnail_url explícita do banco de dados se válida.
 * 2. Se for link do YouTube, infere a miniatura oficial em alta resolução (hqdefault).
 * 3. Se for link do acervo MFIT (vd.mfitpersonal.com.br), calcula a URL da imagem de capa.
 * 4. Se a própria media_url for uma imagem (png, jpg, webp, avif, gif), retorna a própria URL.
 * 5. Caso contrário, retorna null para permitir fallback dinâmico para o frame do vídeo (#t=0.001).
 */
export function resolveExerciseThumbnail(
  mediaUrl?: string | null,
  thumbnailUrl?: string | null
): string | null {
  if (thumbnailUrl && thumbnailUrl.trim()) {
    return thumbnailUrl.trim();
  }
  if (!mediaUrl) return null;
  const u = mediaUrl.trim();

  // YouTube Shorts / Watch / Embed
  const ytMatch = u.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  if (ytMatch) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }

  // Acervo MFIT Personal
  const mfitMatch = u.match(/vd\.mfitpersonal\.com\.br\/(?:v2\/)?(\d+)\/mp4/);
  if (mfitMatch) {
    const id = mfitMatch[1];
    return u.includes("/v2/")
      ? `https://vd.mfitpersonal.com.br/v2/${id}/jpg/md/${id}_md.0000000.jpg`
      : `https://vd.mfitpersonal.com.br/${id}/jpg/md/${id}_md.0000000.jpg`;
  }

  // Imagens estáticas diretas
  if (/\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(u)) {
    return u;
  }

  return null;
}

/**
 * Captura um frame de vídeo no cliente via Canvas e retorna um Blob JPEG leve.
 * Funciona tanto com instâncias de File (upload local) quanto URLs públicas/assinadas.
 */
export async function captureVideoFrame(
  fileOrUrl: File | string,
  atTimeSec = 0.5
): Promise<Blob | null> {
  if (typeof window === "undefined") return null;

  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    let objectUrl: string | null = null;
    if (typeof fileOrUrl === "string") {
      video.src = fileOrUrl;
    } else {
      objectUrl = URL.createObjectURL(fileOrUrl);
      video.src = objectUrl;
    }

    let settled = false;
    const cleanup = () => {
      if (settled) return;
      settled = true;
      if (objectUrl) {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {}
      }
      try {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.remove();
      } catch {}
    };

    const timer = setTimeout(() => {
      cleanup();
      resolve(null);
    }, 5000);

    video.onloadedmetadata = () => {
      const duration = video.duration || 0;
      const targetTime = duration > 0 ? Math.min(atTimeSec, Math.max(0.1, duration / 2)) : atTimeSec;
      video.currentTime = targetTime;
    };

    video.onseeked = () => {
      try {
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 360;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          clearTimeout(timer);
          cleanup();
          resolve(null);
          return;
        }
        ctx.drawImage(video, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            clearTimeout(timer);
            cleanup();
            resolve(blob);
          },
          "image/jpeg",
          0.85
        );
      } catch (e) {
        clearTimeout(timer);
        cleanup();
        resolve(null);
      }
    };

    video.onerror = () => {
      clearTimeout(timer);
      cleanup();
      resolve(null);
    };
  });
}

/**
 * Captura um frame do vídeo e faz upload para o bucket Supabase 'exercise-media',
 * retornando a URL assinada de longa duração (~100 anos).
 */
export async function uploadVideoThumbnail(
  fileOrUrl: File | string,
  userId: string,
  atTimeSec = 0.5
): Promise<string | null> {
  try {
    const blob = await captureVideoFrame(fileOrUrl, atTimeSec);
    if (!blob) return null;

    const path = `${userId}/thumbnails/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("exercise-media")
      .upload(path, blob, { contentType: "image/jpeg", upsert: false });

    if (uploadError) {
      console.warn("Falha no upload do thumbnail do vídeo:", uploadError);
      return null;
    }

    const { data: signed, error: signErr } = await supabase.storage
      .from("exercise-media")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 100);

    if (signErr || !signed?.signedUrl) {
      console.warn("Falha ao assinar URL do thumbnail do vídeo:", signErr);
      return null;
    }

    return signed.signedUrl;
  } catch (err) {
    console.warn("Erro ao gerar miniatura de vídeo:", err);
    return null;
  }
}
