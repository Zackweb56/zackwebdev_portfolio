"use client";

import React, { useEffect, useRef } from "react";

/**
 * HeroBackground
 *
 * ─── CREATIVE CONCEPT: "The Dark Lab" ────────────────────────────────────────
 *
 * ARCHITECTURE:
 *
 *  1. HeroBackgroundAmbient — always visible, zero opacity impact on text:
 *     - GSAP-animated amber micro-particles only (no grid)
 *     - Each particle has independent breathing + drift, organic, non-uniform
 *
 *  2. HeroBackgroundDiscovery — rendered INSIDE FlashlightContent as the ONLY
 *     child, meaning the flashlight mask applies exclusively to:
 *     - The schematic grid (revealed under cursor, invisible in darkness)
 *     - Code glyphs, skill labels, system coordinates — all on the PERIMETER
 *       of the hero, never overlapping the center content area
 *
 * KEY LAYOUT RULE for discovery fragments:
 *   The hero content occupies roughly x: 20–80%, y: 25–75%.
 *   All fragments are placed OUTSIDE this zone — on the 4 edge strips.
 *   The cursor sweeps the edges to uncover them while the center stays clean.
 */

// ─── Ambient Particle Data ─────────────────────────────────────────────────
// Positioned on the perimeter / corners only — no particles in center zone.

interface AmbientParticle {
  id: string;
  x: number;
  y: number;
  glyph: string;
  size: number;
  delay: number;
  driftX: number;
  driftY: number;
  duration: number;
}

const ambientParticles: AmbientParticle[] = [
  // Top-left corner cluster
  { id: "p01", x: 6,   y: 12,  glyph: "+",  size: 0.55, delay: 0,    driftX: 4,  driftY: 6,  duration: 6.2 },
  { id: "p02", x: 14,  y: 8,   glyph: "\u00b7", size: 0.7,  delay: 0.8,  driftX: 5,  driftY: 4,  duration: 7.8 },
  // Top-right corner cluster
  { id: "p03", x: 82,  y: 10,  glyph: "+",  size: 0.5,  delay: 1.4,  driftX: 6,  driftY: 5,  duration: 5.5 },
  { id: "p04", x: 94,  y: 18,  glyph: "\u00d7", size: 0.6,  delay: 2.1,  driftX: 3,  driftY: 7,  duration: 8.3 },
  // Left edge mid
  { id: "p05", x: 4,   y: 40,  glyph: "\u00b7", size: 0.65, delay: 0.3,  driftX: 6,  driftY: 3,  duration: 6.9 },
  { id: "p06", x: 7,   y: 62,  glyph: "+",  size: 0.5,  delay: 1.9,  driftX: 4,  driftY: 5,  duration: 7.1 },
  // Right edge mid
  { id: "p07", x: 93,  y: 55,  glyph: "\u00b7", size: 0.7,  delay: 0.6,  driftX: 5,  driftY: 4,  duration: 5.8 },
  { id: "p08", x: 96,  y: 75,  glyph: "+",  size: 0.55, delay: 2.5,  driftX: 3,  driftY: 6,  duration: 6.5 },
  // Bottom-left corner cluster
  { id: "p09", x: 8,   y: 85,  glyph: "\u00d7", size: 0.6,  delay: 1.1,  driftX: 5,  driftY: 5,  duration: 8.0 },
  { id: "p10", x: 16,  y: 92,  glyph: "\u00b7", size: 0.65, delay: 3.0,  driftX: 4,  driftY: 7,  duration: 6.3 },
  // Bottom-right corner cluster
  { id: "p11", x: 78,  y: 90,  glyph: "+",  size: 0.5,  delay: 0.4,  driftX: 5,  driftY: 3,  duration: 7.4 },
  { id: "p12", x: 90,  y: 88,  glyph: "\u00d7", size: 0.55, delay: 1.7,  driftX: 6,  driftY: 4,  duration: 5.9 },
  // Top center strip
  { id: "p13", x: 38,  y: 5,   glyph: "+",  size: 0.5,  delay: 2.8,  driftX: 4,  driftY: 5,  duration: 7.6 },
  { id: "p14", x: 62,  y: 6,   glyph: "\u00b7", size: 0.7,  delay: 0.9,  driftX: 5,  driftY: 4,  duration: 6.1 },
  // Bottom center strip
  { id: "p15", x: 50,  y: 94,  glyph: "+",  size: 0.5,  delay: 1.5,  driftX: 3,  driftY: 6,  duration: 8.5 },
];

// ─── Discovery Fragment Data ───────────────────────────────────────────────
// ALL fragments are placed in the 4 edge strips, never in the center zone.
// Center safe zone: x 20–80%, y 22–78% — everything outside those bounds.
//
// Edge strips:
//   TOP    — y: 3–20%    (any x)
//   BOTTOM — y: 80–97%   (any x)
//   LEFT   — x: 2–16%,   y: 20–80%
//   RIGHT  — x: 84–98%,  y: 20–80%

interface DiscoveryFragment {
  id: string;
  x: number;
  y: number;
  label: string;
  type: "glyph" | "skill" | "coord" | "comment";
}

const discoveryFragments: DiscoveryFragment[] = [
  // ── TOP EDGE ─────────────────────────────────────────────────────────────
  { id: "c01", x: 4,   y: 4,   label: "34.0195\u00b0 N",  type: "coord"   },
  { id: "c03", x: 92,  y: 4,   label: "ALT//0000",        type: "coord"   },
  { id: "s01", x: 18,  y: 10,  label: "React",            type: "skill"   },
  { id: "s02", x: 68,  y: 8,   label: "TypeScript",       type: "skill"   },
  { id: "s08", x: 44,  y: 14,  label: "Docker",           type: "skill"   },
  { id: "f07", x: 82,  y: 16,  label: "0xFF",             type: "glyph"   },

  // ── BOTTOM EDGE ──────────────────────────────────────────────────────────
  { id: "c04", x: 4,   y: 96,  label: "SYS//IDLE",        type: "coord"   },
  { id: "c02", x: 84,  y: 96,  label: "\u22126.8416\u00b0 W", type: "coord" },
  { id: "s05", x: 22,  y: 88,  label: "PostgreSQL",       type: "skill"   },
  { id: "s06", x: 58,  y: 90,  label: "Tailwind",         type: "skill"   },
  { id: "s07", x: 76,  y: 85,  label: "GSAP",             type: "skill"   },
  { id: "f09", x: 40,  y: 94,  label: "async / await",   type: "comment" },

  // ── LEFT EDGE ────────────────────────────────────────────────────────────
  { id: "f01", x: 5,   y: 26,  label: "{ }",              type: "glyph"   },
  { id: "f12", x: 6,   y: 38,  label: "\u03bb",           type: "glyph"   },
  { id: "f03", x: 5,   y: 52,  label: "=>",               type: "glyph"   },
  { id: "s04", x: 7,   y: 68,  label: "Next.js",          type: "skill"   },
  { id: "f05", x: 9,   y: 80,  label: "// deploy",        type: "comment" },

  // ── RIGHT EDGE ───────────────────────────────────────────────────────────
  { id: "f02", x: 91,  y: 24,  label: "</>",              type: "glyph"   },
  { id: "f11", x: 93,  y: 38,  label: "\u221e",           type: "glyph"   },
  { id: "f04", x: 92,  y: 52,  label: "&&",               type: "glyph"   },
  { id: "s03", x: 88,  y: 68,  label: "Node.js",          type: "skill"   },
  { id: "f06", x: 90,  y: 80,  label: "::",               type: "glyph"   },
];

// ─── Style helpers ─────────────────────────────────────────────────────────

function glyphStyle(f: DiscoveryFragment): React.CSSProperties {
  const base: React.CSSProperties = {
    fontFamily: "var(--font-mono, monospace)",
    whiteSpace: "nowrap",
  };
  switch (f.type) {
    case "skill":
      return {
        ...base,
        fontSize: "0.6rem",
        letterSpacing: "0.18em",
        color: "rgba(255,170,0,0.9)",
        textTransform: "uppercase",
        border: "1px solid rgba(255,170,0,0.3)",
        padding: "2px 7px",
        borderRadius: "2px",
      };
    case "comment":
      return {
        ...base,
        fontSize: "0.58rem",
        letterSpacing: "0.08em",
        color: "rgba(255,255,255,0.45)",
        fontStyle: "italic",
      };
    case "coord":
      return {
        ...base,
        fontSize: "0.55rem",
        letterSpacing: "0.14em",
        color: "rgba(255,170,0,0.55)",
      };
    case "glyph":
    default:
      return {
        ...base,
        fontSize: "0.72rem",
        letterSpacing: "0.04em",
        color: "rgba(255,170,0,0.45)",
      };
  }
}

// ─── HeroBackgroundAmbient ─────────────────────────────────────────────────
// Always-visible: GSAP micro-particles only. No grid (grid is flashlight-only).

export function HeroBackgroundAmbient() {
  const particleRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let ctx: { revert: () => void } | null = null;

    import("@/frontend/animations/gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        particleRefs.current.forEach((el, i) => {
          if (!el) return;
          const p = ambientParticles[i];
          if (!p) return;

          // Independent opacity breathing
          gsap.to(el, {
            opacity: 0.05,
            duration: p.duration * 0.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: p.delay,
          });

          // Subtle positional drift
          gsap.to(el, {
            x: p.driftX,
            y: p.driftY,
            duration: p.duration,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: p.delay * 0.5,
          });
        });
      });
    });

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <div
      className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
      style={{ zIndex: "var(--z-background)" }}
    >
      {ambientParticles.map((p, i) => (
        <span
          key={p.id}
          ref={(el) => { particleRefs.current[i] = el; }}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontFamily: "var(--font-mono, monospace)",
            fontSize: `${p.size}rem`,
            color: "rgba(255,170,0,0.22)",
            opacity: 0.22,
            lineHeight: 1,
            willChange: "transform, opacity",
          }}
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
}

/**
 * HeroBackgroundDiscovery
 *
 * Rendered as the ONLY child of <FlashlightContent> in Hero.tsx.
 * Everything here is invisible in darkness and reveals only under the cursor:
 *  — The schematic grid
 *  — Perimeter-only code fragments and skill labels
 *
 * MUST NOT contain the hero text (name/role/bio) — that lives outside.
 */
export function HeroBackgroundDiscovery() {
  return (
    <div
      className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* ── Schematic grid — only visible under the flashlight cursor ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── Perimeter discovery fragments ── */}
      {discoveryFragments.map((f) => (
        <span
          key={f.id}
          className="absolute"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            transform: "translate(-50%, -50%)",
            ...glyphStyle(f),
          }}
        >
          {f.label}
        </span>
      ))}
    </div>
  );
}
