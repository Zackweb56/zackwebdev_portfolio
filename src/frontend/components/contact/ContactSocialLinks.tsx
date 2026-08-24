"use client";

import React from "react";
import { playSound } from "@/frontend/lib/sound";

interface SocialItem {
  id: string;
  name: string;
  code: string;
  href: string;
  icon: React.ReactNode;
}

const SOCIAL_ITEMS: SocialItem[] = [
  {
    id: "whatsapp",
    name: "WHATSAPP",
    code: "WA // DIRECT",
    href: "https://wa.me/212620719875?text=Hello%20Zakariyae%2C%20I%20reviewed%20your%20portfolio%20and%20would%20like%20to%20connect.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    id: "github",
    name: "GITHUB",
    code: "GH // REPO",
    href: "https://github.com/Zackweb56",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    name: "LINKEDIN",
    code: "IN // NETWORK",
    href: "https://www.linkedin.com/in/zakariyae-boughaba",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

/**
 * ContactSocialLinks
 *
 * Minimalist, high-tech social links exclusively for WhatsApp, GitHub, and LinkedIn.
 */
export function ContactSocialLinks() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 select-none">
      {SOCIAL_ITEMS.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => playSound("hover")}
          onClick={() => playSound("click")}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 border border-white/10 hover:border-[#FFAA00]/60 bg-[#0c0c0c]/80 hover:bg-[#FFAA00]/5 transition-all duration-200"
          style={{
            boxShadow: "0 0 15px rgba(0,0,0,0.4)",
          }}
        >
          {/* Active corner ticks */}
          <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/20 group-hover:border-[#FFAA00] transition-colors" />
          <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/20 group-hover:border-[#FFAA00] transition-colors" />

          {/* Icon */}
          <span className="text-white/60 group-hover:text-[#FFAA00] transition-colors">
            {item.icon}
          </span>

          {/* Label & Code */}
          <div className="flex flex-col text-left">
            <span className="font-mono text-[0.55rem] tracking-[0.16em] text-white/30 group-hover:text-[#FFAA00]/70 transition-colors uppercase">
              {item.code}
            </span>
            <span className="font-mono text-xs font-semibold tracking-widest text-white/80 group-hover:text-white transition-colors">
              [ {item.name} ]
            </span>
          </div>

          {/* External Arrow Hint */}
          <span className="text-white/30 group-hover:text-[#FFAA00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-xs">
            ↗
          </span>
        </a>
      ))}
    </div>
  );
}
