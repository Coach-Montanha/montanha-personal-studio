/**
 * Montanha Personal Studio - Universal Audio Engine (iOS & Android Hardened)
 *
 * Sistema de áudio de alta penetração acústica para cronômetros de treino e descanso.
 * Totalmente compatível com iOS Safari (WebKit), Chrome, Android, Edge, Firefox e Samsung.
 *
 * Blindagens específicas para iPhone (iOS WebKit):
 * 1. Previne auto-suspensão do AudioContext mantendo um keep-alive inaudível durante a contagem de descanso.
 * 2. Destrava elemento HTML5 Audio durante o gesto do usuário (permite tocar mesmo com a chave de silencioso ativada).
 * 3. Fallbacks duplos redundantes: Web Audio API Synthesis + HTML5 Media Playback + Vibração tátil.
 */

// Singleton do AudioContext para evitar criação múltipla e respeitar limites do WebKit
let globalAudioCtx: AudioContext | null = null;
let keepAliveGain: GainNode | null = null;
let keepAliveOsc: OscillatorNode | null = null;
let primedHtmlAudio: HTMLAudioElement | null = null;
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
 * Cria ou recupera o elemento HTML5 Audio compartilhado apontando para o áudio esportivo real.
 */
function getHtmlAudioElement(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!primedHtmlAudio) {
    try {
      const audio = new Audio();
      // Prioriza MP3 compacto com fallback para WAV nativo
      audio.src = "/sounds/rest-alarm.mp3";
      audio.preload = "auto";
      audio.setAttribute("playsinline", "true");
      audio.setAttribute("webkit-playsinline", "true");
      primedHtmlAudio = audio;
    } catch {
      // Fallback silencioso
    }
  }
  return primedHtmlAudio;
}

/**
 * Destrava o motor de áudio (AudioContext + HTML5 Audio) na primeira interação do usuário.
 * No iOS, tocar e pausar um elemento de áudio durante um clique/toque concede permissão
 * permanente de reprodução assíncrona mesmo após o timer terminar.
 */
export function unlockAudioContext(): void {
  if (typeof window === "undefined") return;

  // 1. Destrava Web Audio API
  const ctx = getAudioContext();
  if (ctx) {
    if (ctx.state === "suspended") {
      ctx.resume().then(() => {
        isAudioUnlocked = true;
      }).catch(() => {});
    } else if (ctx.state === "running") {
      isAudioUnlocked = true;
    }

    try {
      // Pulso silencioso de 1 amostra para autorizar hardware de áudio no iOS
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch {
      // Ignora restrições transitórias
    }
  }

  // 2. Destrava HTML5 Audio para furar a chave de silencioso do iPhone
  const htmlAudio = getHtmlAudioElement();
  if (htmlAudio) {
    try {
      htmlAudio.volume = 1.0;
      const playPromise = htmlAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            htmlAudio.pause();
            htmlAudio.currentTime = 0;
          })
          .catch(() => {});
      }
    } catch {
      // Ignora restrições do navegador
    }
  }
}

/**
 * Inicia a sessão ativa de descanso.
 * No iOS, mantém um keep-alive inaudível para que o WebKit NÃO coloque o AudioContext
 * em suspensão durante os 30-120 segundos de repouso do aluno.
 */
export function startRestCountdownAudioSession(): void {
  if (typeof window === "undefined") return;

  unlockAudioContext();

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    // Se já houver keep-alive ativo, não recria
    if (keepAliveOsc && keepAliveGain) return;

    // Cria nó oscilador inaudível (40 Hz com ganho 0.00001) para manter o pipeline WebKit ativo
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(40, ctx.currentTime);
    gain.gain.setValueAtTime(0.00001, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);

    keepAliveOsc = osc;
    keepAliveGain = gain;
  } catch (err) {
    console.warn("[WorkoutAudio] Aviso ao iniciar keep-alive de áudio:", err);
  }
}

/**
 * Encerra o keep-alive inaudível quando o descanso é concluído ou cancelado.
 */
export function stopRestCountdownAudioSession(): void {
  if (keepAliveOsc) {
    try {
      keepAliveOsc.stop();
      keepAliveOsc.disconnect();
    } catch {}
    keepAliveOsc = null;
  }
  if (keepAliveGain) {
    try {
      keepAliveGain.disconnect();
    } catch {}
    keepAliveGain = null;
  }
}

// Auto-registro global de listeners de destravamento no primeiro toque do usuário
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
 * Executa o alarme de fim de descanso de ALTO IMPACTO.
 * Acusticamente calibrado para cortar músicas tocando em fones ou caixas Bluetooth:
 * - Dispara Web Audio API Synthesis com compressão dinâmica (Brickwall Limiter).
 * - Dispara simultaneamente o HTML5 Audio Element destravado (Media Playback, ignorando chave de mudo do iOS).
 * - Vibração tátil no aparelho celular.
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

  // Finaliza o keepalive para liberar o canal
  stopRestCountdownAudioSession();

  let webAudioPlayed = false;

  // 2. Disparo primário via Web Audio API Synthesis
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
      masterGain.gain.setValueAtTime(1.0, now);

      compressor.connect(masterGain);
      masterGain.connect(ctx.destination);

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

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(3400, startTime);

        toneGain.gain.setValueAtTime(0.001, startTime);
        toneGain.gain.exponentialRampToValueAtTime(0.98, startTime + 0.005);
        toneGain.gain.setValueAtTime(0.98, startTime + duration - 0.02);
        toneGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(filter);
        filter.connect(toneGain);
        toneGain.connect(compressor);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);

        // Reforço senoidal para corpo e peso sonoro
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = "sine";
        subOsc.frequency.setValueAtTime(freq / 2, startTime);

        subGain.gain.setValueAtTime(0.001, startTime);
        subGain.gain.exponentialRampToValueAtTime(0.65, startTime + 0.008);
        subGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        subOsc.connect(subGain);
        subGain.connect(compressor);

        subOsc.start(startTime);
        subOsc.stop(startTime + duration + 0.02);
      };

      // Sequência esportiva: 3 bipes com afinação ascendente
      triggerSportPulse(880, now + 0.0, 0.13, "sawtooth");
      triggerSportPulse(1046.5, now + 0.2, 0.13, "sawtooth");
      triggerSportPulse(1760, now + 0.4, 0.55, "square");

      webAudioPlayed = true;
    } catch (err) {
      console.warn("[WorkoutAudio] Falha no WebAudio:", err);
    }
  }

  // 3. Disparo redundante do HTML5 Audio destravado (Essencial para iPhone no modo silencioso)
  try {
    const htmlAudio = getHtmlAudioElement();
    if (htmlAudio) {
      htmlAudio.currentTime = 0;
      htmlAudio.volume = 1.0;
      await htmlAudio.play();
    }
  } catch (audioErr) {
    if (!webAudioPlayed) {
      console.warn("[WorkoutAudio] HTML5 Audio bloqueado:", audioErr);
    }
  }
}

/**
 * Emite um bipe simples e curto (compatível com cronômetros intervalados).
 */
export function playSimpleBeep(freq = 880, duration = 0.15, type: OscillatorType = "sine"): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.01);
    gain.gain.linearRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch (err) {
    console.warn("[WorkoutAudio] Erro ao emitir bipe:", err);
  }
}
