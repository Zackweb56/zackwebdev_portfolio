import React from "react";

interface PublicLayoutShellProps {
  children: React.ReactNode;
}

/**
 * PublicLayoutShell
 *
 * A Server Component that establishes the structural frame of the public application.
 *
 * Architectural Layers:
 *   1. Global UI Root    (z-index: var(--z-navigation) -> 50)
 *      Slot for future fixed Navigation, System Status indicators, and interactive controls.
 *
 *   2. Main Content      (z-index: var(--z-content) -> 30)
 *      Semantic <main> element for section assembly (01 Hero, 02 Profile, 03 Projects, 04 Contact).
 *
 *   3. Global Overlay    (z-index: var(--z-overlays) -> 70)
 *      Slot for future modals, technical overlays, and route transitions.
 */
export function PublicLayoutShell({ children }: PublicLayoutShellProps) {
  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
      {/* ── Global UI Layer Slot (Navigation, Fixed UI) ── */}
      <div id="global-ui-root" className="relative z-[var(--z-navigation)]" />

      {/* ── Main Content Container ── */}
      <main
        id="main-content"
        className="relative flex-1 w-full flex flex-col z-[var(--z-content)]"
      >
        {children}
      </main>

      {/* ── Global Overlay Slot (Modals, Technical Overlays) ── */}
      <div id="global-overlay-root" className="relative z-[var(--z-overlays)]" />
    </div>
  );
}
