"use client";

/**
 * Sound Manager
 *
 * Provides instantaneous UI audio feedback for interactions (hover, click, open, close, switch).
 * Blends preloaded audio asset caching with a high-fidelity Web Audio API synthesizer fallback
 * to guarantee zero latency and 100% reliability across all environments.
 */

export type SoundType = "hover" | "click" | "open" | "close" | "switch" | "tab";

const SOUND_PATHS: Partial<Record<SoundType, string>> = {
  hover: "/assets/sounds/hover.mp3",
  click: "/assets/sounds/click.mp3",
  open: "/assets/sounds/open.mp3",
};

const audioCache: Partial<Record<SoundType, HTMLAudioElement>> = {};
let audioInitialized = false;
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Synthesize tactile sci-fi UI sounds using Web Audio API
 */
function playSynthesizedSound(type: SoundType): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  try {
    if (type === "open") {
      // Sci-fi dossier opening chirp + warm sub sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.22);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);

      // High cyber shimmer
      const shimmer = ctx.createOscillator();
      const sGain = ctx.createGain();
      shimmer.type = "triangle";
      shimmer.frequency.setValueAtTime(880, now);
      shimmer.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
      sGain.gain.setValueAtTime(0.04, now);
      sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      shimmer.connect(sGain);
      sGain.connect(ctx.destination);
      shimmer.start(now);
      shimmer.stop(now + 0.16);

    } else if (type === "close") {
      // Tactile latch close / descending shutter tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.14);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);

      // Short snap click
      const snap = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snap.type = "square";
      snap.frequency.setValueAtTime(600, now);
      snap.frequency.exponentialRampToValueAtTime(120, now + 0.04);
      snapGain.gain.setValueAtTime(0.08, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      snap.connect(snapGain);
      snapGain.connect(ctx.destination);
      snap.start(now);
      snap.stop(now + 0.06);

    } else if (type === "switch" || type === "tab") {
      // Dual crisp holographic navigation blip
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(540, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.05);

      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1080, now + 0.04);
      osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.09);

      gain2.gain.setValueAtTime(0.08, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.04);
      osc2.stop(now + 0.12);

    } else if (type === "hover") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.025);

    } else if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(780, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.055);
    }
  } catch {
    // Non-blocking Web Audio fallback safety
  }
}

/**
 * Preload audio files to ensure instant playback without network delays.
 */
export function initAudio(): void {
  if (typeof window === "undefined" || audioInitialized) return;
  audioInitialized = true;

  (Object.keys(SOUND_PATHS) as SoundType[]).forEach((type) => {
    const path = SOUND_PATHS[type];
    if (path) {
      try {
        const audio = new Audio(path);
        audio.preload = "auto";
        audioCache[type] = audio;
      } catch {
        // Ignore audio instantiation errors in unsupported environments
      }
    }
  });
}

/**
 * Instantly plays a sound effect.
 */
export function playSound(type: SoundType): void {
  if (typeof window === "undefined") return;

  if (!audioInitialized) {
    initAudio();
  }

  // Synthesize custom tech sounds for close & switch immediately
  if (type === "close" || type === "switch" || type === "tab") {
    playSynthesizedSound(type);
    return;
  }

  try {
    const cachedAudio = audioCache[type];
    if (cachedAudio) {
      const instance = cachedAudio.cloneNode(true) as HTMLAudioElement;
      instance.volume = type === "open" ? 0.45 : type === "click" ? 0.3 : 0.15;
      instance.play().catch(() => {
        // Fallback to Web Audio synthesis if HTMLAudioElement fails/blocked
        playSynthesizedSound(type);
      });
    } else {
      playSynthesizedSound(type);
    }
  } catch {
    playSynthesizedSound(type);
  }
}
