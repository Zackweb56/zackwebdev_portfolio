"use client";

import { useEffect, useState } from "react";

/**
 * useReducedMotion
 *
 * Reads the `prefers-reduced-motion` media query and reactively updates.
 * All GSAP animations and CSS transitions must check this before running.
 *
 * Usage:
 *   const reducedMotion = useReducedMotion();
 *   if (reducedMotion) return; // skip animation
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    // Server-side default: assume motion is OK (hydration will correct)
    false
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set the initial value
    setPrefersReducedMotion(mq.matches);

    // Listen for changes (user changes OS preference)
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}
