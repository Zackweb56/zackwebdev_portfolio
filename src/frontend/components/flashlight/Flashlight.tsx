"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/frontend/hooks/useReducedMotion";

/**
 * Flashlight (Inspection Light Engine)
 *
 * High-performance pointer tracking engine for the Content Reveal System.
 *
 * Rules:
 *   1. Desktop Only: Active ONLY on desktop devices (min-width: 1024px AND pointer: fine).
 *      Disabled on tablet and mobile devices (content renders at 100% full readability).
 *   2. Hero Section Scope: Controls CSS variables and .has-flashlight class for the Hero section.
 *   3. Zero Graphic Artifacts: Updates --mouse-x and --mouse-y CSS custom properties on documentElement
 *      via requestAnimationFrame lerp loop (0 React re-renders).
 */
export function Flashlight() {
  const reducedMotion = useReducedMotion();
  const [isEnabled, setIsEnabled] = useState(false);

  const targetPos = useRef({ x: -1000, y: -1000 });
  const currentPos = useRef({ x: -1000, y: -1000 });
  const animFrameId = useRef<number | null>(null);
  const hasInitialized = useRef(false);

  // Check desktop capability (min-width: 1024px AND fine pointer) on mount and resize
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");

    const updateCapability = () => {
      if (mq.matches) {
        setIsEnabled(true);
        document.documentElement.classList.add("has-flashlight");
      } else {
        setIsEnabled(false);
        document.documentElement.classList.remove("has-flashlight");
      }
    };

    updateCapability();

    mq.addEventListener("change", updateCapability);
    return () => {
      mq.removeEventListener("change", updateCapability);
      document.documentElement.classList.remove("has-flashlight");
    };
  }, []);

  // Track mouse movement & viewport enter/leave
  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };

      if (!hasInitialized.current) {
        hasInitialized.current = true;
        currentPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseLeave = () => {
      targetPos.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isEnabled]);

  // High-performance rAF loop for smooth trailing CSS variable updates
  useEffect(() => {
    if (!isEnabled) return;

    const lerpFactor = reducedMotion ? 1 : 0.14;

    const renderLoop = () => {
      const tx = targetPos.current.x;
      const ty = targetPos.current.y;

      if (reducedMotion) {
        currentPos.current.x = tx;
        currentPos.current.y = ty;
      } else {
        currentPos.current.x += (tx - currentPos.current.x) * lerpFactor;
        currentPos.current.y += (ty - currentPos.current.y) * lerpFactor;
      }

      // Update CSS custom properties on documentElement.
      // --mouse-x/--mouse-y are relative to .flashlight-content-root because
      // the reveal overlay is position:absolute inside that container.
      // We subtract the container's top so the mask center always aligns exactly
      // with the cursor regardless of how far down the page the section starts.
      const container = document.querySelector(".flashlight-content-root");
      const offsetTop = container ? container.getBoundingClientRect().top : 0;

      document.documentElement.style.setProperty(
        "--mouse-x",
        `${currentPos.current.x}px`
      );
      document.documentElement.style.setProperty(
        "--mouse-y",
        `${currentPos.current.y - offsetTop}px`
      );

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isEnabled, reducedMotion]);

  return null;
}
