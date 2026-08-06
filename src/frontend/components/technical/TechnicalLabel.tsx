import React from "react";

interface TechnicalLabelProps {
  children: React.ReactNode;
  variant?: "amber" | "muted" | "subtle";
  prefix?: string; // e.g. "//" or "["
  suffix?: string; // e.g. "]"
  className?: string;
}

/**
 * TechnicalLabel
 *
 * Inline monospace system label primitive.
 * Used for field identifiers, category stamps, metadata annotations.
 *
 * Usage:
 *   <TechnicalLabel>PROFILE_DATA</TechnicalLabel>
 *   <TechnicalLabel prefix="[" suffix="]">READ_ONLY</TechnicalLabel>
 *   <TechnicalLabel variant="muted">TECH_STACK</TechnicalLabel>
 */
export function TechnicalLabel({
  children,
  variant = "amber",
  prefix,
  suffix,
  className = "",
}: TechnicalLabelProps) {
  const colorMap = {
    amber: "text-[#FFAA00]",
    muted: "text-white/50",
    subtle: "text-white/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-0.5 font-mono text-[0.625rem] tracking-[0.15em] uppercase leading-none ${colorMap[variant]} ${className}`}
    >
      {prefix && (
        <span className="opacity-60">{prefix}</span>
      )}
      {children}
      {suffix && (
        <span className="opacity-60">{suffix}</span>
      )}
    </span>
  );
}
