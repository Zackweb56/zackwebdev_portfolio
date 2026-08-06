"use client";

/**
 * Sound Manager
 *
 * Provides instantaneous UI audio feedback for cursor interactions (hover, click, open).
 * Uses pre-instantiated audio element caching and cloning for zero-latency playback.
 */

export type SoundType = "hover" | "click" | "open";

const SOUND_PATHS: Record<SoundType, string> = {
  hover: "/assets/sounds/hover.mp3",
  click: "/assets/sounds/click.mp3",
  open: "/assets/sounds/open.mp3",
};

const audioCache: Partial<Record<SoundType, HTMLAudioElement>> = {};
let audioInitialized = false;

/**
 * Preload audio files to ensure instant playback without network delays.
 */
export function initAudio(): void {
  if (typeof window === "undefined" || audioInitialized) return;
  audioInitialized = true;

  (Object.keys(SOUND_PATHS) as SoundType[]).forEach((type) => {
    try {
      const audio = new Audio(SOUND_PATHS[type]);
      audio.preload = "auto";
      audioCache[type] = audio;
    } catch {
      // Ignore audio instantiation errors in unsupported environments
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

  try {
    const cachedAudio = audioCache[type];
    if (cachedAudio) {
      // Clone node for zero-delay overlapping sound triggers
      const instance = cachedAudio.cloneNode(true) as HTMLAudioElement;
      instance.volume = type === "open" ? 0.5 : type === "click" ? 0.35 : 0.2;
      instance.play().catch(() => {
        // Autoplay policy prevented playback before initial user gesture
      });
    }
  } catch {
    // Suppress audio runtime errors
  }
}
