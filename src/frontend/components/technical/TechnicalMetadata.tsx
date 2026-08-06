import React from "react";

interface TechnicalMetadataProps {
  label: string;
  value: React.ReactNode;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

/**
 * TechnicalMetadata
 *
 * Key/Value dossier metadata primitive used for displaying technical attributes
 * (e.g. ROLE / FULL STACK, LOCATION / MOROCCO, STATUS / AVAILABLE).
 */
export function TechnicalMetadata({
  label,
  value,
  orientation = "vertical",
  className = "",
}: TechnicalMetadataProps) {
  if (orientation === "horizontal") {
    return (
      <div className={`flex items-center gap-3 font-mono text-xs ${className}`}>
        <span className="text-white/35 tracking-[0.15em] uppercase text-[0.65rem]">
          {label}:
        </span>
        <span className="text-white/90 font-medium">{value}</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 font-mono text-xs ${className}`}>
      <span className="text-white/35 tracking-[0.15em] uppercase text-[0.625rem] select-none">
        // {label}
      </span>
      <div className="text-white/90 text-sm">{value}</div>
    </div>
  );
}
