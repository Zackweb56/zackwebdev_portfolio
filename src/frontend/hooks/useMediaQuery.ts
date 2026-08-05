"use client";

import { useEffect, useState } from "react";

/**
 * useMediaQuery
 *
 * Reactive wrapper around window.matchMedia.
 * Used by animations to switch between desktop/mobile behaviors.
 *
 * Usage:
 *   const isDesktop = useMediaQuery("(min-width: 1024px)");
 *   const isMobile  = useMediaQuery("(max-width: 767px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
