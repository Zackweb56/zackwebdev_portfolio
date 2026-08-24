"use client";

import React, { useEffect, useMemo, useState } from "react";
import DottedMap from "dotted-map";

/**
 * DottedWorldMap
 *
 * Real geographic Dotted World Map powered by the `dotted-map` GIS engine,
 * focused on Béni Mellal, Morocco.
 */
export function DottedWorldMap() {
  const [localTime, setLocalTime] = useState<string>("");

  // Initialize DottedMap instance and compute real world SVG map
  const { svgContent, pinCoords } = useMemo(() => {
    const map = new DottedMap({ height: 55, grid: "diagonal" });

    // Highlight Morocco's region
    map.addPin({
      lat: 32.3394,
      lng: -6.3608,
      svgOptions: { color: "#FFAA00", radius: 0.38 },
    });

    const svg = map.getSVG({
      radius: 0.22,
      color: "rgba(255, 255, 255, 0.22)",
      shape: "circle",
      backgroundColor: "transparent",
    });

    const coordsMap: Record<string, { x: number; y: number }> = {};
    const hub = { name: "BÉNI MELLAL", lat: 32.3394, lng: -6.3608 };
    const pin = map.getPin({ lat: hub.lat, lng: hub.lng });
    if (pin) {
      coordsMap[hub.name] = { x: pin.x, y: pin.y };
    }

    return { svgContent: svg, pinCoords: coordsMap };
  }, []);

  const beniMellalPos = pinCoords["BÉNI MELLAL"] || { x: 52, y: 21.65 };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-GB", {
        timeZone: "Africa/Casablanca",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setLocalTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-full border border-white/10 bg-[#080808]/95 p-5 sm:p-6 overflow-hidden flex flex-col justify-between"
      style={{
        boxShadow: "0 0 35px rgba(0,0,0,0.7), inset 0 0 25px rgba(255,255,255,0.02)",
      }}
    >
      {/* 4 Precision Corner HUD Reticles */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FFAA00]" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FFAA00]" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FFAA00]" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FFAA00]" />

      {/* ── Top HUD Telemetry Strip ── */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 font-mono text-[0.62rem] tracking-[0.2em] uppercase">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#FFAA00] animate-pulse" />
          <span className="text-[#FFAA00] font-bold">REMOTE // WORLDWIDE</span>
        </div>
        <div className="flex items-center gap-3 text-white/60">
          <span className="text-white/40">MOROCCO_TZ (GMT+1):</span>
          <span className="text-[#FFAA00] font-medium font-mono">{localTime || "12:00:00"}</span>
        </div>
      </div>

      {/* ── Real Geographic Dotted Map Viewport ── */}
      <div className="relative w-full aspect-[109/55] flex items-center justify-center my-1 select-none overflow-hidden">
        {/* Render Dotted-Map Raw SVG Layer */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {/* Interactive Overlay Layer Matching Exact ViewBox */}
        <svg
          viewBox="0 0 109 55"
          className="absolute inset-0 w-full h-full pointer-events-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="primary-beacon-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFAA00" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFAA00" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Radar Circles Centered on Béni Mellal, Morocco */}
          <circle
            cx={beniMellalPos.x}
            cy={beniMellalPos.y}
            r="24"
            stroke="rgba(255, 170, 0, 0.08)"
            strokeDasharray="1 1"
            strokeWidth="0.15"
          />
          <circle
            cx={beniMellalPos.x}
            cy={beniMellalPos.y}
            r="14"
            stroke="rgba(255, 170, 0, 0.14)"
            strokeDasharray="0.8 0.8"
            strokeWidth="0.2"
          />
          <circle
            cx={beniMellalPos.x}
            cy={beniMellalPos.y}
            r="6"
            stroke="rgba(255, 170, 0, 0.25)"
            strokeWidth="0.25"
          />

          {/* ── PRIMARY FOCUS BEACON: BÉNI MELLAL, MOROCCO ── */}
          <g>
            {/* Concentric Animated Radar Wave Rings */}
            <circle
              cx={beniMellalPos.x}
              cy={beniMellalPos.y}
              r="3.5"
              fill="url(#primary-beacon-glow)"
            >
              <animate attributeName="r" values="1.5;6.5" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle
              cx={beniMellalPos.x}
              cy={beniMellalPos.y}
              r="2.2"
              stroke="#FFAA00"
              strokeWidth="0.3"
              fill="rgba(255, 170, 0, 0.25)"
            >
              <animate
                attributeName="stroke-opacity"
                values="1;0.4;1"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Central Solid Pin */}
            <circle cx={beniMellalPos.x} cy={beniMellalPos.y} r="0.8" fill="#FFAA00" />
            <circle cx={beniMellalPos.x} cy={beniMellalPos.y} r="0.3" fill="#050505" />

            {/* Prominent High-Visibility Target Reticle & Badge */}
            <g transform={`translate(${beniMellalPos.x + 2.8}, ${beniMellalPos.y - 3.8})`}>
              <rect
                x="0"
                y="0"
                width="31"
                height="5.4"
                fill="#050505"
                stroke="#FFAA00"
                strokeWidth="0.25"
              />
              <text
                x="1.4"
                y="2.4"
                fill="#FFAA00"
                fontFamily="monospace"
                fontSize="1.65"
                fontWeight="bold"
                letterSpacing="0.08em"
              >
                ● BÉNI MELLAL, MOROCCO
              </text>
              <text
                x="1.4"
                y="4.3"
                fill="rgba(255, 255, 255, 0.6)"
                fontFamily="monospace"
                fontSize="1.3"
                letterSpacing="0.05em"
              >
                READY // REMOTE // ANYWHERE
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* ── Bottom Status Strip ── */}
      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-6 font-mono text-[0.62rem] text-white/50 tracking-wider">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#44FF88] animate-pulse" />
          <span>AVAILABLE FOR REMOTE WORK</span>
        </div>
        <div className="flex items-center gap-2 text-white/30">
          <span>✦</span>
          <span>GLOBAL REACH</span>
          <span>✦</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#FFAA00]">⏻</span>
          <span>ANY TIMEZONE</span>
        </div>
      </div>
    </div>
  );
}