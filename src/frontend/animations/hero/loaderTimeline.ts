/**
 * ─── Intro Loader Timeline ───────────────────────────────────────────────────
 *
 * Controls the system boot initialization sequence.
 *
 * Phases:
 *   1. System Header    — fade up technical boot metadata
 *   2. System Frame     — subtle scale & opacity entrance with glitch effect
 *   3. Boot Stages      — staggered line reveals with typing effect
 *   4. Progress Bar     — smooth 0% -> 100% width expansion + numeric counter
 *   5. System Ready     — climax status activation with pulse glow
 *   6. Exit Reveal      — smooth cinematic exit transition, unmasking the portfolio
 *
 * Called by: IntroLoader Client Component using useGSAP.
 */

import { gsap } from "@/frontend/animations/gsap";
import { createTimeline, prefersReducedMotion } from "@/frontend/animations/utils";
import { durations } from "@/frontend/animations/durations";
import { distances } from "@/frontend/animations/distances";
import { eases } from "@/frontend/animations/eases";
import type { GSAPTimeline } from "@/frontend/animations/types";

export interface LoaderRefs {
  container: HTMLElement | null;
  header: HTMLElement | null;
  frame: HTMLElement | null;
  stages: HTMLElement[];
  progressLine: HTMLElement | null;
  progressText: HTMLElement | null;
  statusReady: HTMLElement | null;
  // New refs for premium effects
  scanline?: HTMLElement | null;
  glitchOverlay?: HTMLElement | null;
}

export interface BuildLoaderOptions {
  onComplete?: () => void;
}

/**
 * buildLoaderTimeline
 *
 * Returns a ready-to-play timeline for the intro loader sequence.
 */
export function buildLoaderTimeline(
  refs: LoaderRefs,
  options: BuildLoaderOptions = {}
): GSAPTimeline | null {
  const { 
    container, 
    header, 
    frame, 
    stages, 
    progressLine, 
    progressText, 
    statusReady,
    scanline,
    glitchOverlay
  } = refs;

  if (!container) return null;

  const tl = createTimeline({
    paused: true,
    onComplete: () => {
      options.onComplete?.();
    },
  });

  // Reduced motion guard — immediate exit sequence
  if (prefersReducedMotion()) {
    if (progressLine) gsap.set(progressLine, { width: "100%" });
    if (progressText) progressText.textContent = "100%";
    if (statusReady) gsap.set(statusReady, { opacity: 1 });

    tl.to(container, {
      opacity: 0,
      duration: durations.fast,
      ease: eases.ui.exit,
    });
    return tl;
  }

  // ─── PRE-ANIMATION STATE SETUP ────────────────────────────────────────────
  
  // Header: start hidden, slightly up
  if (header) gsap.set(header, { 
    opacity: 0, 
    y: -distances.small,
    filter: "blur(4px)"
  });

  // Frame: start scaled down with subtle blur
  if (frame) gsap.set(frame, { 
    opacity: 0, 
    scale: 0.95,
    filter: "blur(6px)"
  });

  // Stages: start hidden with slight offset
  if (stages.length > 0) {
    gsap.set(stages, { 
      opacity: 0, 
      y: distances.micro,
      filter: "blur(2px)"
    });
  }

  // Progress: start at 0%
  if (progressLine) gsap.set(progressLine, { width: "0%" });
  
  // Status: start hidden with scale
  if (statusReady) gsap.set(statusReady, { 
    opacity: 0, 
    scale: 0.9,
    filter: "blur(3px)"
  });

  // Scanline: start hidden
  if (scanline) gsap.set(scanline, { opacity: 0, y: "-100%" });
  
  // Glitch overlay: start hidden
  if (glitchOverlay) gsap.set(glitchOverlay, { opacity: 0 });

  // Progress counter object
  const progressCounter = { value: 0 };

  // ─── PHASE 1: HEADER METADATA (0.6s) ─────────────────────────────────────
  if (header) {
    tl.to(header, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: durations.slow,
      ease: eases.ui.enter,
    });
  }

  // ─── PHASE 2: SCANLINE APPEARANCE (0.3s delay) ──────────────────────────
  if (scanline) {
    tl.to(scanline, {
      opacity: 0.08,
      duration: durations.fast,
      ease: eases.ui.enter,
    }, "+=0.2");
  }

  // ─── PHASE 3: SYSTEM FRAME ENTRANCE (0.8s) ──────────────────────────────
  if (frame) {
    tl.to(
      frame,
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: durations.slow,
        ease: eases.content.enter,
      },
      "-=0.3"
    );
  }

  // ─── PHASE 4: GLITCH FLASH (brief) ──────────────────────────────────────
  if (glitchOverlay) {
    tl.to(glitchOverlay, {
      opacity: 0.03,
      duration: 0.08,
      ease: "power1.out",
    }, "+=0.4");
    
    tl.to(glitchOverlay, {
      opacity: 0,
      duration: 0.15,
      ease: "power1.inOut",
    });
  }

  // ─── PHASE 5: STAGGERED BOOT STAGES (1.2s total) ──────────────────────
  if (stages.length > 0) {
    tl.to(
      stages,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.2,  // Increased from 0.1 for slower reveal
        duration: durations.normal,
        ease: eases.ui.enter,
      },
      "-=0.1"
    );
  }

  // ─── PHASE 6: PROGRESS BAR (2s) ──────────────────────────────────────────
  if (progressLine) {
    tl.to(
      progressLine,
      {
        width: "100%",
        duration: 1.8,  // Increased from 1.1 for slower progress
        ease: "power2.inOut",
      },
      "+=0.2"  // Small pause before progress starts
    );
  }

  if (progressText) {
    tl.to(
      progressCounter,
      {
        value: 100,
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: () => {
          if (progressText) {
            const val = Math.floor(progressCounter.value);
            progressText.textContent = `${val.toString().padStart(3, "0")}%`;
          }
        },
      },
      "<"  // Align with progress bar
    );
  }

  // ─── PHASE 7: SYSTEM READY CLIMAX (0.8s) ──────────────────────────────
  if (statusReady) {
    tl.to(statusReady, {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: durations.normal,
      ease: eases.ui.enter,
    }, "-=0.5");
    
    // Add pulse effect at climax
    tl.to(statusReady, {
      scale: 1.02,
      duration: 0.3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: 2,
    }, "+=0.1");
  }

  // ─── PHASE 8: SCANLINE RETREAT ──────────────────────────────────────────
  if (scanline) {
    tl.to(scanline, {
      y: "100%",
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    }, "-=0.2");
  }

  // ─── PHASE 9: PAUSE AT 100% (0.8s hold) ──────────────────────────────
  tl.to({}, { duration: 0.8 });

  // ─── PHASE 10: CINEMATIC EXIT (1s) ─────────────────────────────────────
  tl.to(container, {
    opacity: 0,
    y: -distances.medium,
    scale: 0.98,
    filter: "blur(8px)",
    duration: 1.0,  // Increased from 0.45 for smoother exit
    ease: "power4.inOut",
  });

  // Optional: Add subtle particle/dust effect during exit
  tl.to(container, {
    opacity: 0,
    duration: 0.2,
    ease: "power2.out",
  }, "-=0.3");

  return tl;
}