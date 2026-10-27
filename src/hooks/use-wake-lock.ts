import { useEffect, useRef } from "react";

export function useWakeLock(enabled: boolean = true) {
  const wakeLockRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    // 1. Tenta Screen Wake Lock API nativa
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
          wakeLockRef.current.addEventListener("release", () => {
            wakeLockRef.current = null;
          });
        }
      } catch {
        // Silencioso se negado pelo sistema ou economia de bateria
      }
    };

    // 2. Fallback de áudio inaudível (Web Audio API) para manter o navegador e a tela ativos no mobile
    const startKeepAliveAudio = () => {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;

        if (!audioContextRef.current || audioContextRef.current.state === "closed") {
          audioContextRef.current = new AudioCtx();
        }

        if (audioContextRef.current.state === "suspended") {
          audioContextRef.current.resume().catch(() => {});
        }

        // Toca um buffer silencioso de 0.1s a cada 25s para impedir que o iOS/Android suspenda o renderizador
        if (!audioTimerRef.current) {
          audioTimerRef.current = setInterval(() => {
            try {
              if (audioContextRef.current && audioContextRef.current.state === "running") {
                const buffer = audioContextRef.current.createBuffer(1, 1, 22050);
                const source = audioContextRef.current.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContextRef.current.destination);
                source.start(0);
              }
            } catch {
              // ignore
            }
          }, 25000);
        }
      } catch {
        // ignore
      }
    };

    requestWakeLock();
    startKeepAliveAudio();

    // Reativa imediatamente se o usuário mudar de aba e retornar
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        await requestWakeLock();
        if (audioContextRef.current && audioContextRef.current.state === "suspended") {
          audioContextRef.current.resume().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLockRef.current) {
        try {
          wakeLockRef.current.release();
        } catch {}
        wakeLockRef.current = null;
      }
      if (audioTimerRef.current) {
        clearInterval(audioTimerRef.current);
        audioTimerRef.current = null;
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {}
        audioContextRef.current = null;
      }
    };
  }, [enabled]);
}
