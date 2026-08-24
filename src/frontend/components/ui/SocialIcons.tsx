"use client";

import React from "react";
import { playSound } from "@/frontend/lib/sound";

export interface SocialIconItem {
  id: string;
  name: string;
  href: string;
  icon: React.ReactNode;
}

export const SOCIAL_LINKS: SocialIconItem[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    href: "https://wa.me/212620719875?text=Hello%20Zakariyae%2C%20I%20reviewed%20your%20portfolio%20and%20would%20like%20to%20connect.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    id: "github",
    name: "GitHub",
    href: "https://github.com/Zackweb56",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/zakariyae-boughaba",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

interface SocialIconsProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SocialIcons({ className = "", size = "md" }: SocialIconsProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-9 h-9 sm:w-10 sm:h-10",
    lg: "w-11 h-11",
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${item.name}`}
          title={item.name}
          onMouseEnter={() => playSound("hover")}
          onClick={() => playSound("click")}
          className={`group relative flex items-center justify-center ${sizeClasses} rounded-sm border border-white/10 hover:border-[#FFAA00]/70 bg-white/[0.02] hover:bg-[#FFAA00]/10 text-white/60 hover:text-[#FFAA00] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFAA00]`}
        >
          {/* Micro Corner Highlight */}
          <span className="absolute top-0 left-0 w-1 h-1 border-t border-l border-white/20 group-hover:border-[#FFAA00] transition-colors" />
          <span className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-white/20 group-hover:border-[#FFAA00] transition-colors" />

          {/* SVG Icon */}
          <span className="transition-transform duration-200 group-hover:scale-110">
            {item.icon}
          </span>
        </a>
      ))}
    </div>
  );
}
