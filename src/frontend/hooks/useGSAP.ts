"use client";

import { useEffect, useRef } from "react";
import type { gsap as GSAPType } from "gsap";

/**
 * useGSAP
 *
 * A safe wrapper for GSAP animations inside React components.
 *
 * Responsibilities:
 *  - Creates a GSAP context scoped to the provided ref element
 *  - Automatically cleans up (reverts) the context on unmount
 *  - Prevents memory leaks from orphaned ScrollTriggers
 *
 * Pattern (mirrors the official @gsap/react hook behaviour without the dependency):
 *
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   useGSAP(
 *     (gsap) => {
 *       gsap.from(".text", { opacity: 0, y: 20 });
 *     },
 *     { scope: containerRef, dependencies: [] }
 *   );
 *
 * NOTE: This hook is a lightweight custom implementation.
 * If the team decides to add @gsap/react in the future, this hook
 * should be replaced with the official version.
 */

type GSAPCallback = (gsap: typeof GSAPType) => void;

interface UseGSAPOptions {
  /** Scope all GSAP selectors to this element */
  scope?: React.RefObject<HTMLElement | null>;
  /** Re-run when these values change (same as useEffect deps) */
  dependencies?: React.DependencyList;
}

export function useGSAP(
  callback: GSAPCallback,
  options: UseGSAPOptions = {}
): void {
  const { scope, dependencies = [] } = options;
  const savedCallback = useRef<GSAPCallback>(callback);

  // Keep the ref current without re-triggering the effect
  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    // Lazily import GSAP — it is a client-only library
    let ctx: { revert: () => void } | undefined;

    import("gsap").then(({ gsap }) => {
      const scopeEl = scope?.current ?? undefined;
      ctx = gsap.context(() => {
        savedCallback.current(gsap);
      }, scopeEl);
    });

    return () => {
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
