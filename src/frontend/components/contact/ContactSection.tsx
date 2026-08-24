"use client";

import React, { useState } from "react";
import { DottedWorldMap } from "./DottedWorldMap";
import { ContactForm } from "./ContactForm";
import { SocialIcons } from "@/frontend/components/ui/SocialIcons";
import { playSound } from "@/frontend/lib/sound";

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const emailAddress = "zackwebdev56@gmail.com";

  const handleCopyEmail = () => {
    playSound("click");
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen py-24 sm:py-32 px-4 sm:px-6 lg:px-12 border-t border-white/10 flex flex-col justify-between"
      style={{ background: "#050505" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col gap-12 sm:gap-16">
        {/* ── Section Header ── */}
        <div className="flex flex-col items-center text-center gap-4">
          {/* Section index stamp */}
          <div className="flex flex-col gap-1.5 items-center">
            <span className="font-mono text-[0.625rem] tracking-[0.2em] text-[#FFAA00] uppercase opacity-75 select-none">
              CONTACT // OPEN CHANNEL
            </span>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-[#FFAA00] tracking-widest font-semibold">[03]</span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white/90 uppercase tracking-tight">
                Contact
              </h2>
            </div>
          </div>

          {/* Availability badge */}
          <div className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] uppercase text-white/50 bg-white/[0.02] border border-white/10 px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#44FF88] animate-pulse" />
            <span>AVAILABLE FOR WORK</span>
          </div>

          {/* Headline */}
          <p className="font-sans font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight mt-2 max-w-2xl">
            What if we worked together?
          </p>

          {/* Direct Email Action */}
          <button
            type="button"
            onClick={handleCopyEmail}
            onMouseEnter={() => playSound("hover")}
            className="group mt-1 inline-flex items-center gap-2 font-mono text-sm sm:text-base text-[#FFAA00] hover:text-[#ffbe33] tracking-widest transition-colors cursor-pointer border-b border-[#FFAA00]/30 hover:border-[#FFAA00] pb-0.5"
          >
            <span>{emailAddress}</span>
            <span className="font-mono text-[0.65rem] text-white/40 group-hover:text-white transition-colors">
              {copied ? "[ COPIED! ]" : "[ COPY ]"}
            </span>
          </button>
        </div>

        {/* ── Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 flex">
            <DottedWorldMap />
          </div>
          <div className="lg:col-span-6 flex">
            <ContactForm />
          </div>
        </div>

        {/* ── Social Links ── */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <span className="font-mono text-[0.58rem] tracking-[0.25em] text-white/30 uppercase">
            CONNECT // SOCIAL NETWORKS
          </span>
          <SocialIcons size="md" />
        </div>
      </div>
    </section>
  );
}
