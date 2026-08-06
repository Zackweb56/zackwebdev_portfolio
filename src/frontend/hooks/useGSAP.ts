"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/frontend/animations/gsap";

/**
 * useGSAP
 *
 * Safe wrapper for GSAP animations inside React components.
 *
 * ─── Why this exists ──────────────────────────────────────────────────────────
 * GSAP animations create tweens and ScrollTriggers that persist independently
 * of React's lifecycle. Without explicit cleanup:
 *   - Animations continue after components unmount (memory leak)
 *   - React Strict Mode runs effects twice → duplicate animations
 *   - Route changes orphan ScrollTriggers that fire on wrong pages
 *
 * ─── How it works ─────────────────────────────────────────────────────────────
 * Uses gsap.context() which:
 *   1. Scopes all selectors to the provided element ref
 *   2. Tracks every tween/timeline/ScrollTrigger created inside the callback
 *   3. Kills all of them in one call on cleanup
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *   const containerRef = useRef<HTMLDivElement>(null);
 *
 *   useGSAP(
 *     (ctx) => {
 *       ctx.gsap.from(".text", { opacity: 0, y: 20 });
 *     },
 *     { scope: containerRef, dependencies: [] }
 *   );
 *
 * ─── Strict Mode safety ───────────────────────────────────────────────────────
 * In development, React 18+ runs effects twice (mount → unmount → remount).
 * gsap.context().revert() cleanly kills the first run before the second.
 * This means animations will appear to "replay once" in development — this
 * is expected and correct behaviour.
 *
 * ─── @gsap/react note ────────────────────────────────────────────────────────
 * This hook mirrors the official @gsap/react useGSAP API without the extra
 * dependency. If the team decides to add @gsap/react, this file should be
 * deleted and the official hook imported instead — the call signature is
 * intentionally compatible.
 */

interface GSAPCallbackContext {
  /** The configured gsap instance (plugins already registered) */
  gsap: typeof gsap;
}

type GSAPCallback = (ctx: GSAPCallbackContext) => void;

interface UseGSAPOptions {
  /**
   * Scope all GSAP class-name selectors (".element") to this element's subtree.
   * Strongly recommended — avoids accidental global DOM matches.
   */
  scope?: React.RefObject<HTMLElement | null>;

  /**
   * Re-run the animation callback when these values change.
   * Follows the same rules as useEffect dependencies.
   * Pass [] to run once on mount.
   */
  dependencies?: React.DependencyList;
}

// Use useLayoutEffect in browser, useEffect on server (SSR compatibility)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useGSAP(
  callback: GSAPCallback,
  options: UseGSAPOptions = {}
): void {
  const { scope, dependencies = [] } = options;

  // Store the latest callback ref — stable across renders, no re-trigger
  const callbackRef = useRef<GSAPCallback>(callback);
  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  });

  useIsomorphicLayoutEffect(() => {
    const scopeEl = scope?.current ?? undefined;

    // Create a GSAP context scoped to the container element.
    // All tweens, timelines, and ScrollTriggers created inside are tracked.
    const ctx = gsap.context(() => {
      callbackRef.current({ gsap });
    }, scopeEl);

    // Cleanup: revert kills all tracked animations and restores original styles
    return () => {
      ctx.revert();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
