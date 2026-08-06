"use client";

import React, { useEffect, useRef, useState } from "react";
import { CursorState } from "./cursor.types";
import { getCursorStateFromElement } from "./cursor.utils";
import { useReducedMotion } from "@/frontend/hooks/useReducedMotion";
import { initAudio, playSound } from "@/frontend/lib/sound";

/**
 * CustomCursor
 *
 * High-performance, technical inspection cursor system with instant audio feedback.
 *
 * Features:
 *   - Continuous, smooth CSS transitions between DEFAULT, INTERACTIVE, and TEXT shapes.
 *   - Instant UI audio triggers for hover, click, and open events without playback latency.
 *   - Translucent fill & dotted border on interactive active shape.
 *   - Micro annotation stamp (2x smaller, translucent background).
 *   - Direct DOM transform updates via requestAnimationFrame lerp loop (0 React re-renders on mousemove).
 *   - Fine-pointer device detection & prefers-reduced-motion support.
 */
export function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const [isEnabled, setIsEnabled] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: "default",
    action: null,
    label: null,
    symbol: null,
  });

  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef<number | null>(null);
  const prevMode = useRef<string>("default");

  // Check pointer capability & initialize preloaded audio on mount
  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (hasFinePointer) {
      setIsEnabled(true);
      document.documentElement.classList.add("has-custom-cursor");
      initAudio();
    }
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  // Track mouse movement & target element
  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement | null;
      const newState = getCursorStateFromElement(target);

      setCursorState((prevState) => {
        if (
          prevState.mode !== newState.mode ||
          prevState.action !== newState.action ||
          prevState.label !== newState.label
        ) {
          // Play instant hover audio when entering an interactive target
          if (newState.mode === "interactive" && prevState.mode !== "interactive") {
            playSound("hover");
          }
          return newState;
        }
        return prevState;
      });
    };

    // Instant click & open audio listener
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest<HTMLElement>(
        "a, button, [data-cursor], [data-cursor-action], [role='button']"
      );

      if (interactiveEl) {
        const action = interactiveEl.getAttribute("data-cursor-action") ||
          interactiveEl.getAttribute("data-cursor");
        const isExternal = interactiveEl.tagName === "A" &&
          interactiveEl.getAttribute("target") === "_blank";
        const isProjectRoute = interactiveEl.getAttribute("href")?.includes("/projects/");

        if (action === "OPEN" || action === "open" || action === "INSPECT" || action === "VIEW" || isProjectRoute || isExternal) {
          playSound("open");
        } else {
          playSound("click");
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick, { capture: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick, { capture: true });
    };
  }, [isEnabled]);

  // High performance rAF loop for smooth lerp position updates
  useEffect(() => {
    if (!isEnabled) return;

    const lerpFactor = reducedMotion ? 1 : 0.22;

    const renderLoop = () => {
      const targetX = mousePos.current.x;
      const targetY = mousePos.current.y;

      if (reducedMotion) {
        currentPos.current.x = targetX;
        currentPos.current.y = targetY;
      } else {
        currentPos.current.x += (targetX - currentPos.current.x) * lerpFactor;
        currentPos.current.y += (targetY - currentPos.current.y) * lerpFactor;
      }

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isEnabled, reducedMotion]);

  if (!isEnabled) return null;

  const isInteractive = cursorState.mode === "interactive";
  const isText = cursorState.mode === "text";

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[var(--z-cursor)] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      aria-hidden="true"
    >
      <div className="relative flex items-center justify-center">
        {/* ── Continuous Marker Box (Smooth In/Out Shape Transition) ── */}
        <div
          className={`relative flex items-center justify-center transition-all duration-200 ease-out ${
            isInteractive
              ? "w-12 h-12 border border-dotted border-[#FFAA00]/80 bg-[#FFAA00]/10 shadow-[0_0_10px_rgba(255,170,0,0.15)]"
              : isText
              ? "w-[2px] h-5 border-none bg-[#FFAA00] shadow-[0_0_6px_rgba(255,170,0,0.6)]"
              : "w-3 h-3 border border-[#FFAA00]/40 bg-[#FFAA00]/15"
          }`}
        >
          {/* Inner Center Node Dot */}
          {!isText && (
            <div
              className={`bg-[#FFAA00] transition-all duration-200 ease-out ${
                isInteractive ? "w-1 h-1 opacity-80" : "w-1.5 h-1.5 opacity-100"
              }`}
            />
          )}
        </div>

        {/* ── Technical Micro Annotation Stamp (2x Smaller, Translucent) ── */}
        <div
          className={`absolute left-13 top-16 -translate-y-1/2 flex items-center gap-1 font-mono text-[0.5rem] tracking-[0.15em] bg-[#050505]/60 backdrop-blur-[2px] text-[#FFAA00] border border-[#FFAA00]/30 px-1 py-0.5 whitespace-nowrap shadow-sm transition-all duration-150 ease-out ${
            isInteractive && cursorState.label
              ? "opacity-100 scale-100 translate-x-0"
              : "opacity-0 scale-90 -translate-x-1 pointer-events-none"
          }`}
        >
          {cursorState.symbol && (
            <span className="text-white/60 font-semibold">
              [{cursorState.symbol}]
            </span>
          )}
          {cursorState.label && (
            <span className="font-semibold uppercase">{cursorState.label}</span>
          )}
        </div>
      </div>
    </div>
  );
}
