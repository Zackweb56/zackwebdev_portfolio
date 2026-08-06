import React from "react";

export type StatusVariant = "amber" | "muted" | "subtle";

interface TechnicalStatusProps {
  label: string;
  variant?: StatusVariant;
  pulse?: boolean;
  className?: string;
}

/**
 * TechnicalStatus
 *
 * Micro status indicator badge (e.g. ● ONLINE, ● STABLE, ● LIVE_FEED).
 * Uses minimal monospace typography and subtle amber pulse animation.
 */
export function TechnicalStatus({
  label,
  variant = "amber",
  pulse = true,
  className = "",
}: TechnicalStatusProps) {
  const variantStyles: Record<StatusVariant, { text: string; dot: string }> = {
    amber: {
      text: "text-[#FFAA00]",
      dot: "bg-[#FFAA00]",
    },
    muted: {
      text: "text-white/60",
      dot: "bg-white/60",
    },
    subtle: {
      text: "text-white/40",
      dot: "bg-white/40",
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.15em] uppercase select-none ${style.text} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${style.dot} ${
          pulse ? "animate-pulse" : ""
        }`}
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
