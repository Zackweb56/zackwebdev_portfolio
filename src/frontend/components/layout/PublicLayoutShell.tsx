import React from "react";
import { GlobalNavigation } from "@/frontend/components/navigation/GlobalNavigation";
import { CustomCursor } from "@/frontend/components/cursor/CustomCursor";
import { GlobalTechnicalOverlay } from "@/frontend/components/technical/GlobalTechnicalOverlay";

interface PublicLayoutShellProps {
  children: React.ReactNode;
}

/**
 * PublicLayoutShell
 *
 * A Server Component establishing the structural frame of the public application.
 *
 * Architectural Layers:
 *   1. Custom Cursor Layer (z-index: var(--z-cursor) -> 90)
 *      Global high-performance technical pointer system.
 *
 *   2. Global UI Root       (z-index: var(--z-navigation) -> 50)
 *      Houses GlobalNavigation, status indicators, and persistent UI.
 *
 *   3. Main Content         (z-index: var(--z-content) -> 30)
 *      Semantic <main> element for section assembly (01 Hero, 02 Profile, 03 Projects, 04 Contact).
 *
 *   4. Global Overlay       (z-index: var(--z-overlays) -> 70)
 *      Slot for future modals, technical overlays, and route transitions.
 */
export function PublicLayoutShell({ children }: PublicLayoutShellProps) {
  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
      {/* ── Global Custom Cursor System ── */}
      <CustomCursor />

      {/* ── Global Technical Overlay (corner metadata system) ── */}
      <GlobalTechnicalOverlay />

      {/* ── Global UI Layer Slot (Navigation, Persistent UI) ── */}
      <div id="global-ui-root" className="relative z-[var(--z-navigation)]">
        <GlobalNavigation />
      </div>

      {/* ── Main Content Container ── */}
      <main
        id="main-content"
        className="relative flex-1 w-full flex flex-col z-[var(--z-content)] pt-14"
      >
        {children}
      </main>

      {/* ── Global Overlay Slot (Modals, Technical Overlays) ── */}
      <div id="global-overlay-root" className="relative z-[var(--z-overlays)]" />
    </div>
  );
}
