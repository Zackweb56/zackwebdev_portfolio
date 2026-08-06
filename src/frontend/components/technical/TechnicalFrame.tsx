import React from "react";

interface TechnicalFrameProps {
  children: React.ReactNode;
  title?: string;
  code?: string;
  showCorners?: boolean;
  className?: string;
  headerRight?: React.ReactNode;
}

/**
 * TechnicalFrame
 *
 * Precision technical container primitive with thin borders, corner bracket ticks,
 * and optional technical dossier header stamps.
 * Replaces generic rounded cards or glassmorphism panels.
 */
export function TechnicalFrame({
  children,
  title,
  code,
  showCorners = true,
  className = "",
  headerRight,
}: TechnicalFrameProps) {
  return (
    <div
      className={`relative border border-white/10 bg-[#050505]/80 p-5 sm:p-6 ${className}`}
    >
      {/* ── 4 Precision Corner Brackets ── */}
      {showCorners && (
        <>
          <span
            className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-[#FFAA00]/70"
            aria-hidden="true"
          />
          <span
            className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-[#FFAA00]/70"
            aria-hidden="true"
          />
          <span
            className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-[#FFAA00]/70"
            aria-hidden="true"
          />
          <span
            className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-[#FFAA00]/70"
            aria-hidden="true"
          />
        </>
      )}

      {/* ── Optional Dossier Technical Panel Header ── */}
      {(title || code || headerRight) && (
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 select-none">
          <div className="flex items-center gap-2.5 font-mono text-[0.65rem] tracking-[0.15em] uppercase">
            {code && <span className="text-[#FFAA00]">[{code}]</span>}
            {title && <span className="text-white/60 font-semibold">{title}</span>}
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}

      {/* ── Frame Body Content ── */}
      <div>{children}</div>
    </div>
  );
}
