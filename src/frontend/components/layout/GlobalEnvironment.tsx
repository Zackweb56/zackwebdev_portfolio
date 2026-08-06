import React from "react";

interface GlobalEnvironmentProps {
  children: React.ReactNode;
}

/**
 * GlobalEnvironment
 *
 * A Server Component that establishes the persistent visual atmosphere
 * for the entire portfolio.
 *
 * Structure:
 *   - Base #050505 environment container
 *   - Layer 1 (Noise): Sensor grain overlay (pointer-events: none)
 *   - Layer 2 (Scanlines): Horizontal monitoring lines (pointer-events: none)
 *   - Layer 3 (Content): Application content (z-index: var(--z-content))
 */
export function GlobalEnvironment({ children }: GlobalEnvironmentProps) {
  return (
    <div className="global-environment min-h-screen bg-[#050505] text-white relative">
      {/* ── Layer 1: Sensor Noise / Grain ── */}
      <div className="global-noise-layer" aria-hidden="true" />

      {/* ── Layer 2: Surveillance Scanlines ── */}
      <div className="global-scanlines-layer" aria-hidden="true" />

      {/* ── Layer 3: Application Content ── */}
      <div className="relative z-[30]">{children}</div>
    </div>
  );
}
