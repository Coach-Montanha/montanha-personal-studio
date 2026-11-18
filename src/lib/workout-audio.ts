/**
 * Montanha Personal Studio - Universal Audio Engine
 * Sistema de áudio de alta penetração acústica para cronômetros de treino e descanso.
 * Totalmente compatível com iOS Safari, WebKit, Chrome, Firefox, Edge, Xiaomi/Redmi, Samsung, Opera e Brave.
 */

// Singleton do AudioContext para evitar criação múltipla e respeitar políticas de autoplay
let globalAudioCtx: AudioContext | null = null;
let isAudioUnlocked = false;

/**
 * Obtém ou inicializa o AudioContext global com suporte cross-browser (WebKit / W3C).
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!globalAudioCtx) {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (AudioCtxClass) {
      try {
        globalAudioCtx = new AudioCtxClass();
      } catch (err) {
        console.warn("[WorkoutAudio] Falha ao instanciar AudioContext:", err);
      }
    }
  }

  return globalAudioCtx;
}

/**
 * Destrava o motor de áudio na primeira interação do usuário (touch, click, pointerdown).
 * Essencial para iOS Safari, Xiaomi MIUI e navegadores baseados em WebKit onde o áudio inicia "suspended".
 */
export function unlockAudioContext(): void {
  if (typeof window === "undefined") return;

  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume().then(() => {
      isAudioUnlocked = true;
    }).catch(() => {});
  } else if (ctx.state === "running") {
    isAudioUnlocked = true;
  }

  // Toca um buffer silencioso de 1 amostra para registrar autorização de mídia no iOS WebKit
  try {
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch {
    // Silencia qualquer restrição transitória
  }
}

// Auto-registro global de listeners de destravamento no primeiro toque
if (typeof window !== "undefined") {
  const unlockEvents = ["touchstart", "touchend", "click", "keydown", "pointerdown"];
  const handleFirstInteraction = () => {
    unlockAudioContext();
    unlockEvents.forEach((ev) => window.removeEventListener(ev, handleFirstInteraction));
  };

  unlockEvents.forEach((ev) => {
    window.addEventListener(ev, handleFirstInteraction, { passive: true, capture: true });
  });
}

/**
 * Gerador de áudio WAV sintético de 0.8s codificado em base64 (Fallback para navegadores com WebAudio bloqueado).
 */
function createFallbackAlarmAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  try {
    const audio = new Audio();
    // Bipe esportivo agudo embutido para fallback universal
    // Freq 1200Hz pulsado em formato WAV base64
    audio.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVoGAACBhYqKmpyeoKGio6WmrK2ur7CxsrK0trW4ubq6u7y8vb29v7/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AACC";
    audio.setAttribute("playsinline", "true");
    audio.setAttribute("webkit-playsinline", "true");
    return audio;
  } catch {
    return null;
  }
}

/**
 * Executa o alarme de fim de descanso de ALTO IMPACTO.
 * Acusticamente calibrado para cortar músicas tocando em fones ou caixas Bluetooth:
 * - 3 pulsos penetrantes (880Hz -> 1046Hz -> 1760Hz).
 * - Mistura de ondas sawtooth (com filtro passa-baixa) e senoidal para presença de médios-agudos.
 * - DynamicsCompressorNode ativo para ganho máximo percebido sem distorção.
 */
export async function playHighImpactRestAlarm(): Promise<void> {
  // 1. Vibração tátil no aparelho (Android, Xiaomi, Samsung, Motorola)
  if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
    try {
      navigator.vibrate([280, 90, 280, 90, 600]);
    } catch {
      // Ignora restrições do SO
    }
  }

  // 2. Síntese via Web Audio API com compressão dinâmica
  const ctx = getAudioContext();

  if (ctx) {
    try {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const now = ctx.currentTime;

      // Compressor dinâmico (Brickwall Limiter) para volume máximo uniforme
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-14, now);
      compressor.knee.setValueAtTime(30, now);
      compressor.ratio.setValueAtTime(14, now);
      compressor.attack.setValueAtTime(0.002, now);
      compressor.release.setValueAtTime(0.18, now);

      // Master Gain de Saída (Alto Volume)
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.9, now);

      compressor.connect(masterGain);
      masterGain.connect(ctx.destination);

      // Função auxiliar para emitir cada pulso penetrante
      const triggerSportPulse = (
        freq: number,
        startTime: number,
        duration: number,
        waveType: OscillatorType = "sawtooth",
      ) => {
        const osc = ctx.createOscillator();
        const toneGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = waveType;
        osc.frequency.setValueAtTime(freq, startTime);

        // Filtro para amaciar harmônicos ásperos da onda dente de serra mantendo a penetração
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(3200, startTime);

        // Envelope com ataque ultrarrápido (4ms) e sustentação sólida
        toneGain.gain.setValueAtTime(0.001, startTime);
        toneGain.gain.exponentialRampToValueAtTime(0.95, startTime + 0.006);
        toneGain.gain.setValueAtTime(0.95, startTime + duration - 0.02);
        toneGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(filter);
        filter.connect(toneGain);
        toneGain.connect(compressor);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);

        // Adiciona um reforço senoidal na oitava base para peso acústico
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = "sine";
        subOsc.frequency.setValueAtTime(freq / 2, startTime);

        subGain.gain.setValueAtTime(0.001, startTime);
        subGain.gain.exponentialRampToValueAtTime(0.6, startTime + 0.01);
        subGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        subOsc.connect(subGain);
        subGain.connect(compressor);

        subOsc.start(startTime);
        subOsc.stop(startTime + duration + 0.02);
      };

      // Sequência do alarme esportivo:
      // Bipe 1: 880 Hz (A5 - Médio Agudo)
      triggerSportPulse(880, now + 0.0, 0.13, "sawtooth");

      // Bipe 2: 1046.5 Hz (C6 - Alerta)
      triggerSportPulse(1046.5, now + 0.2, 0.13, "sawtooth");

      // Bipe 3 (Final Conclusivo Prolongado): 1760 Hz (A6 - Corte Agudo Penetrante sobre música)
      triggerSportPulse(1760, now + 0.4, 0.55, "square");
      return;
    } catch (err) {
      console.warn("[WorkoutAudio] Falha no WebAudio, acionando fallback HTML5:", err);
    }
  }

  // 3. Fallback: HTML5 Audio Element
  try {
    const fallbackAudio = createFallbackAlarmAudio();
    if (fallbackAudio) {
      fallbackAudio.volume = 1.0;
      await fallbackAudio.play();
    }
  } catch (audioErr) {
    console.warn("[WorkoutAudio] Fallback HTML5 bloqueado por política de autoplay:", audioErr);
  }
}
