import Link from "next/link";
import { ArrowLeft, AlertTriangle, Terminal, ShieldAlert, RefreshCw } from "lucide-react";

/**
 * 404 Not Found — Classified System Terminal Theme
 *
 * Implements an immersive developer-terminal / surveillance OS error console
 * conforming strictly to the master specification:
 *   - Monochromatic deep background (#050505) with amber accents (#FFAA00)
 *   - CRT scanlines and sensor noise textures
 *   - Monospace telemetry diagnostics and anomaly readouts
 *   - Interactive radar-return navigation
 */
export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full flex items-center justify-center p-4 sm:p-8 select-none">
      {/* ── Background Grid & Reticle Overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 170, 0, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 170, 0, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Terminal HUD Window ── */}
      <div className="relative z-10 w-full max-w-2xl border border-white/25 bg-[#050505]/90 backdrop-blur-md p-6 sm:p-10">
        {/* ── Top Bar / HUD Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4 mb-8">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFAA00] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFAA00]" />
            </span>
            <span className="font-mono text-xs tracking-widest text-[#FFAA00] font-semibold uppercase">
              ERR_404 // ROUTE_UNRESOLVED
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-white/40">
            <span className="border border-white/10 px-2 py-0.5 rounded-xs">
              CLEARANCE: LEVEL 0
            </span>
            <span>SEC_ID: 0x404</span>
          </div>
        </div>

        {/* ── Main Error Diagnostic Block ── */}
        <div className="space-y-6">
          {/* Big Glitch 404 Heading */}
          <div className="flex items-baseline gap-4">
            <h1 className="font-mono text-6xl sm:text-8xl font-black tracking-tighter text-[#FFAA00]">
              404
            </h1>
            <div className="flex flex-col">
              <span className="font-mono text-xs tracking-widest text-white/50 uppercase">
                Anomaly Detected
              </span>
              <span className="font-mono text-sm tracking-wider text-white/90 font-medium">
                TARGET NODE MISSING
              </span>
            </div>
          </div>

          {/* Telemetry Log Window */}
          <div className="border border-white/10 bg-black/60 p-4 font-mono text-xs space-y-2 text-white/70">
            <div className="flex items-center gap-2 text-[#FFAA00]/80">
              <Terminal className="w-3.5 h-3.5" />
              <span>SYSTEM DIAGNOSTIC LOG:</span>
            </div>
            <div className="text-[11px] leading-relaxed text-white/60 pl-2 border-l border-[rgba(255,170,0,0.3)] space-y-1">
              <p>&gt; Request URI queried against active route matrix.</p>
              <p>&gt; Query returned: <span className="text-[#FFAA00]">STATUS_OBJECT_NAME_NOT_FOUND</span></p>
              <p>&gt; Coordinates: <span className="text-white/80">SECTOR_NULL // 0x00000404</span></p>
              <p>&gt; Suggested action: Return to root radar console.</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans">
            The requested classified sector or route does not exist or has been relocated to another clearance node.
          </p>

          {/* ── Action Buttons ── */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/15">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 bg-[#FFAA00] text-black font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 transition-all duration-200 hover:bg-[#ffbe33] active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Radar / Root
            </Link>

            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 hover:bg-white/5 text-white/80 hover:text-white font-mono text-xs uppercase tracking-wider px-5 py-3 transition-all duration-200"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#FFAA00]" />
              Report System Anomaly
            </Link>
          </div>
        </div>

        {/* ── HUD Corner Markings ── */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#FFAA00]" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#FFAA00]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#FFAA00]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#FFAA00]" />
      </div>
    </div>
  );
}