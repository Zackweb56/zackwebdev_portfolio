"use client";

import { useEffect } from "react";

/**
 * GsapProvider
 *
 * A zero-render client component that initializes the GSAP animation
 * architecture once when the application mounts on the client.
 *
 * Responsibilities:
 *   1. Imports the GSAP entry point (registers plugins, sets globals)
 *   2. Sets up the responsive matchMedia context for animations
 *   3. Refreshes ScrollTrigger after fonts load (prevents position drift)
 *   4. Handles ScrollTrigger cleanup on unmount
 *
 * Architecture note:
 *   This component renders null — it exists solely for its side effects.
 *   Mount it high in the client tree (inside PublicLayoutShell) so it
 *   initializes before any animated children mount.
 *
 * SSR:
 *   The "use client" directive ensures this never runs on the server.
 *   layout.tsx stays a Server Component.
 */
export function GsapProvider() {
  useEffect(() => {
    // Import is synchronous after bundling — GSAP is already in the client bundle.
    // This pattern defers the side-effect (plugin registration, defaults) to
    // the first client render, ensuring no SSR/hydration contamination.
    import("@/frontend/animations/gsap").then(({ ScrollTrigger }) => {
      // Refresh ScrollTrigger after the initial paint.
      // Fonts and images affect layout dimensions — this prevents
      // ScrollTrigger start/end points from being calculated on a collapsed layout.
      const onLoad = () => ScrollTrigger.refresh();

      if (document.readyState === "complete") {
        // Already loaded — refresh after a short frame gap
        requestAnimationFrame(() => ScrollTrigger.refresh());
      } else {
        window.addEventListener("load", onLoad, { once: true });
      }

      return () => {
        // On route unmount (or dev hot reload), kill all ScrollTriggers
        // to prevent orphaned triggers on the new page.
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    });
  }, []);

  // This component renders nothing
  return null;
}
