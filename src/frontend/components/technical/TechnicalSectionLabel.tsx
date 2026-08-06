import React from "react";

interface TechnicalSectionLabelProps {
  index: string; // e.g. "01", "02"
  label: string; // e.g. "PROFILE", "PROJECTS"
  stamp?: string; // e.g. "CLASSIFIED // DOSSIER"
  className?: string;
}

/**
 * TechnicalSectionLabel
 *
 * Reusable section index header primitive combining editorial typography
 * with system index metadata tags.
 */
export function TechnicalSectionLabel({
  index,
  label,
  stamp,
  className = "",
}: TechnicalSectionLabelProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Micro Stamp Metadata */}
      {stamp && (
        <span className="font-mono text-[0.625rem] tracking-[0.2em] text-[#FFAA00] uppercase opacity-75 select-none">
          {stamp}
        </span>
      )}

      {/* Main Section Header Title */}
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs text-[#FFAA00] tracking-widest font-semibold">
          [{index}]
        </span>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white/90 uppercase tracking-tight">
          {label}
        </h2>
      </div>
    </div>
  );
}
