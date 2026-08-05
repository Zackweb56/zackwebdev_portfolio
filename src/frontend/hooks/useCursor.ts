"use client";

import { useEffect, useRef } from "react";

/**
 * useCursor
 *
 * Tracks raw mouse position and provides refs for the custom cursor elements.
 * The actual flashlight effect logic lives in animations/cursor/flashlight.ts.
 *
 * Returns:
 *   - mouseRef: current { x, y } mouse position (updated via mousemove)
 *   - isDesktop: whether cursor effects should be active
 *
 * Fully implemented in Task 2.4 (custom cursor) and Task 2.5 (flashlight).
 */

interface CursorPosition {
  x: number;
  y: number;
}

export function useCursor() {
  const mouseRef = useRef<CursorPosition>({ x: 0, y: 0 });

  useEffect(() => {
    // Only run on devices with a fine pointer (mouse/trackpad)
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return { mouseRef };
}
