import React from "react";

interface TechnicalDividerProps {
  index?: string;
  label?: string;
  className?: string;
}

/**
 * TechnicalDivider
 *
 * Minimal technical separator with optional index and label.
 * Replaces generic <hr> with system-coded separators.
 *
 * Usage:
 *   <TechnicalDivider />
 *   <TechnicalDivider index="01" label="PROFILE_DATA" />
 */
export function TechnicalDivider({
  index,
  label,
  className = "",
}: TechnicalDividerProps) {
  return (
    <div
      className={`flex items-center gap-3 select-none ${className}`}
      role="separator"
      aria-hidden="true"
    >
      {index && (
        <span className="font-mono text-[0.6rem] text-[#FFAA00] tracking-[0.15em] shrink-0">
          {index}
        </span>
      )}
      <div className="flex-1 h-px bg-white/10" />
      {label && (
        <span className="font-mono text-[0.6rem] text-white/35 tracking-[0.12em] uppercase shrink-0">
          {label}
        </span>
      )}
    </div>
  );
}
