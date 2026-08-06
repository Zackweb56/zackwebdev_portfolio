"use client";

import { useRef } from "react";
import { useGSAP } from "@/frontend/hooks/useGSAP";
import {
  revealFade,
  revealUp,
  revealClip,
  prefersReducedMotion,
  setVisible,
  createScrollTrigger,
  createTimeline,
} from "@/frontend/animations/utils";
import { durations } from "@/frontend/animations/durations";
import { distances } from "@/frontend/animations/distances";
import { eases } from "@/frontend/animations/eases";

export interface UseRevealOptions {
  /** Animation variant */
  variant?: "fade" | "up" | "clip";
  /** Trigger mode */
  trigger?: "scroll" | "mount";
  /** Duration in seconds */
  duration?: number;
  /** Delay in seconds */
  delay?: number;
  /** Vertical movement distance (for 'up' variant) */
  distance?: number;
  /** ScrollTrigger start string */
  start?: string;
  /** Clip direction (for 'clip' variant) */
  direction?: "up" | "down" | "left" | "right";
}

/**
 * useReveal
 *
 * Imperative hook to attach a reveal animation to an element ref.
 * Useful when an existing component cannot be wrapped in `<Reveal>`.
 *
 * Usage:
 *   const headingRef = useRef<HTMLHeadingElement>(null);
 *   useReveal(headingRef, { variant: "up", delay: 0.1 });
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  targetRef: React.RefObject<T | null>,
  options: UseRevealOptions = {}
): void {
  const {
    variant = "up",
    trigger = "scroll",
    duration,
    delay = 0,
    distance = distances.medium,
    start = "top 88%",
    direction = "up",
  } = options;

  useGSAP(
    () => {
      const el = targetRef.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        setVisible(el);
        return;
      }

      let tl = createTimeline({ paused: true });

      switch (variant) {
        case "fade":
          tl = revealFade(el, {
            duration: duration ?? durations.fast,
            delay,
            ease: eases.ui.enter,
            paused: true,
          });
          break;
        case "clip":
          tl = revealClip(el, {
            duration: duration ?? durations.slow,
            delay,
            direction,
            paused: true,
          });
          break;
        case "up":
        default:
          tl = revealUp(el, {
            duration: duration ?? durations.normal,
            delay,
            distance,
            paused: true,
          });
          break;
      }

      if (trigger === "mount") {
        tl.play();
      } else {
        createScrollTrigger({
          trigger: el,
          animation: tl,
          start,
          once: true,
          onEnter: () => tl.play(),
        });
      }
    },
    { scope: targetRef as React.RefObject<HTMLElement | null>, dependencies: [variant, trigger, delay] }
  );
}
