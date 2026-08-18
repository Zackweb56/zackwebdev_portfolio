"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  TechnicalLabel,
  TechnicalStatus,
  TechnicalSectionLabel,
} from "@/frontend/components/technical";
import {
  defaultProfileContent,
  ProfileContent,
} from "@/frontend/lib/profileContent";
import { useGSAP } from "@/frontend/hooks/useGSAP";
import { buildProfileReveal } from "@/frontend/animations/profile/profileReveal";
import { playSound } from "@/frontend/lib/sound";

interface ProfileSectionProps {
  content?: ProfileContent;
  className?: string;
}

/**
 * ProfileSection — Task 13: 3-Column Dossier Grid
 *
 * 3 equal border cards (4 columns width each = 4x3=12 layout):
 *   - Card 1: Tactical Profile Photo (clean corners only), Bio specs, Remote Worldwide & Open to Work status.
 *   - Card 2: Profile summary, Education log, and last 3 non-freelance experiences (Licorne, Hedoma, Maroc-Pub).
 *   - Card 3: Technical skill badges with audio hover feedback, soft skills, and Resume view/download action.
 */
export function ProfileSection({
  content = defaultProfileContent,
  className = "",
}: ProfileSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  // ─── GSAP ScrollTrigger Entrance ──────────────────────────────────────────
  useGSAP(
    () => {
      if (!containerRef.current) return;

      buildProfileReveal({
        container: containerRef.current,
        header: headerRef.current,
        cards: [card1Ref.current, card2Ref.current, card3Ref.current].filter(
          Boolean
        ) as HTMLElement[],
      });
    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <section
      ref={containerRef}
      id="profile"
      className={`relative min-h-screen w-full flex flex-col justify-center py-16 lg:py-24 px-4 sm:px-6 lg:px-10 border-t border-white/5 bg-[#050505] ${className}`}
      aria-label="Profile — Subject Dossier"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 lg:gap-10">
        {/* ── 01: SECTION HEADER & IDENTIFIER ── */}
        <div
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5"
        >
          <TechnicalSectionLabel
            index={content.header.index}
            label={content.header.label}
            stamp={content.header.stamp}
          />

          <div className="flex items-center gap-3 font-mono text-xs text-white/40 select-none">
            <TechnicalLabel variant="amber" prefix="[" suffix="]">
              READ_ONLY
            </TechnicalLabel>
            <span className="text-white/20">|</span>
            <span className="tracking-widest text-[0.65rem] uppercase">
              SYS.REF: {content.header.systemRef}
            </span>
          </div>
        </div>

        {/* ── 02: 3-COLUMN BORDER CARDS GRID (4x3 = 12) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* ══════════════════════════════════════════════════════════════════
              CARD 1: PROFILE PHOTO, IDENTIFIER & WORK STATUS
              ══════════════════════════════════════════════════════════════════ */}
          <div
            ref={card1Ref}
            className="relative border border-white/10 bg-[#050505]/80 p-5 sm:p-6 flex flex-col justify-between gap-6"
          >
            {/* 4 Precision Corner Brackets */}
            <span className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 border-[#FFAA00]/70" aria-hidden="true" />
            <span className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t-2 border-r-2 border-[#FFAA00]/70" aria-hidden="true" />
            <span className="absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b-2 border-l-2 border-[#FFAA00]/70" aria-hidden="true" />
            <span className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 border-[#FFAA00]/70" aria-hidden="true" />

            {/* Card Header Stamp */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono text-[0.65rem] text-[#FFAA00] tracking-widest uppercase font-bold">
                // 01_SUBJECT_ID
              </span>
              <span className="font-mono text-[0.6rem] text-white/40">
                CLASS: {content.identity.classCode}
              </span>
            </div>

            {/* Tactical Portrait (Corners only - no center lines or circles) */}
            <div className="relative w-full aspect-[4/4.2] border border-white/15 bg-black/60 overflow-hidden group">
              {/* Photo Corner Brackets */}
              <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FFAA00] z-20" aria-hidden="true" />
              <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FFAA00] z-20" aria-hidden="true" />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FFAA00] z-20" aria-hidden="true" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FFAA00] z-20" aria-hidden="true" />

              <Image
                src={content.identity.profileImage}
                alt={`Portrait of ${content.identity.fullName}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 380px"
                className="object-cover object-center grayscale contrast-125 brightness-95 group-hover:scale-102 transition-transform duration-500"
              />

              {/* Status Tag on image */}
              <div className="absolute top-2.5 right-2.5 z-20 bg-black/85 px-2 py-0.5 border border-[#FFAA00]/40 font-mono text-[0.55rem] text-[#FFAA00]">
                STATUS: VERIFIED
              </div>
            </div>

            {/* Identity Info Specs */}
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="font-sans font-extrabold text-xl text-white tracking-tight">
                  {content.identity.fullName}
                </h3>
                <p className="font-mono text-xs text-[#FFAA00] tracking-wider uppercase">
                  {content.identity.roleTitle}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 font-mono text-xs text-white/70">
                <div>
                  <span className="text-white/35 text-[0.6rem] block uppercase">// LOCATION</span>
                  <span className="text-white/90 text-[0.68rem]">{content.identity.location}</span>
                </div>
                <div>
                  <span className="text-white/35 text-[0.6rem] block uppercase">// LANGUAGES</span>
                  <span className="text-white/90 text-[0.68rem]">AR · EN (B1) · FR (A2)</span>
                </div>
              </div>
            </div>

            {/* Status Alert: Open to Work & Remote Worldwide */}
            <div className="p-3.5 border border-[#FFAA00]/40 bg-[#FFAA00]/[0.04] rounded-xs flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FFAA00] animate-ping" />
                  <span className="font-mono text-[0.6rem] text-[#FFAA00] font-bold tracking-widest uppercase">
                    {content.identity.availability}
                  </span>
                </div>
                <TechnicalStatus label="ONLINE" variant="amber" pulse />
              </div>
              <div className="font-mono text-[0.7rem] text-white font-semibold tracking-wide">
                {content.identity.workMode}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              CARD 2: PROFILE BIO, EDUCATION & LAST 3 EXPERIENCES
              ══════════════════════════════════════════════════════════════════ */}
          <div
            ref={card2Ref}
            className="relative border border-white/10 bg-[#050505]/80 p-5 sm:p-6 flex flex-col justify-between gap-6"
          >
            {/* 4 Precision Corner Brackets */}
            <span className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 border-[#FFAA00]/70" aria-hidden="true" />
            <span className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t-2 border-r-2 border-[#FFAA00]/70" aria-hidden="true" />
            <span className="absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b-2 border-l-2 border-[#FFAA00]/70" aria-hidden="true" />
            <span className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 border-[#FFAA00]/70" aria-hidden="true" />

            <div className="flex flex-col gap-5">
              {/* Card Header Stamp */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[0.65rem] text-[#FFAA00] tracking-widest uppercase font-bold">
                  // 02_BACKGROUND_LOG
                </span>
                <span className="font-mono text-[0.6rem] text-white/40">
                  EDUCATION & EXPERIENCE
                </span>
              </div>

              {/* Bio Summary Paragraph */}
              <p className="font-sans text-xs sm:text-sm text-white/75 leading-relaxed">
                {content.summary}
              </p>

              {/* Education Block */}
              <div className="flex flex-col gap-2.5 pt-2 border-t border-white/10">
                <span className="font-mono text-[0.625rem] text-[#FFAA00] font-bold tracking-widest uppercase">
                  // ACADEMIC_LOG [EDUCATION]
                </span>
                <div className="flex flex-col gap-2">
                  {content.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="border-l-2 border-[#FFAA00]/50 pl-2.5 py-0.5 flex flex-col gap-0.5"
                    >
                      <div className="flex items-center justify-between text-[0.625rem] font-mono">
                        <span className="text-white/90 font-semibold">
                          [{edu.institution}]
                        </span>
                        <span className="text-[#FFAA00]">{edu.period}</span>
                      </div>
                      <div className="font-sans text-xs text-white/80 font-medium">
                        {edu.degree} — {edu.field}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Block (Last 3 non-freelance roles) */}
              <div className="flex flex-col gap-2.5 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.625rem] text-[#FFAA00] font-bold tracking-widest uppercase">
                    // FIELD_OPERATIONS [EXPERIENCE]
                  </span>
                  <span className="font-mono text-[0.55rem] text-white/35">
                    TOP 3 ROLES
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {content.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 border border-white/5 bg-white/[0.02] rounded-xs flex flex-col gap-1 hover:border-[#FFAA00]/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-[#FFAA00] font-bold">
                          [{exp.company}]
                        </span>
                        <span className="font-mono text-[0.6rem] text-white/40">
                          {exp.period}
                        </span>
                      </div>
                      <div className="font-sans text-xs text-white/90 font-semibold">
                        {exp.role}
                      </div>
                      <p className="font-sans text-[0.68rem] text-white/60 leading-snug">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              CARD 3: TECHNICAL SKILLS (AUDIO HOVER), SOFT SKILLS & RESUME
              ══════════════════════════════════════════════════════════════════ */}
          <div
            ref={card3Ref}
            className="relative border border-white/10 bg-[#050505]/80 p-5 sm:p-6 flex flex-col justify-between gap-6"
          >
            {/* 4 Precision Corner Brackets */}
            <span className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 border-[#FFAA00]/70" aria-hidden="true" />
            <span className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t-2 border-r-2 border-[#FFAA00]/70" aria-hidden="true" />
            <span className="absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b-2 border-l-2 border-[#FFAA00]/70" aria-hidden="true" />
            <span className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 border-[#FFAA00]/70" aria-hidden="true" />

            <div className="flex flex-col gap-5">
              {/* Card Header Stamp */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[0.65rem] text-[#FFAA00] tracking-widest uppercase font-bold">
                  // 03_CAPABILITIES_STACK
                </span>
                <span className="font-mono text-[0.6rem] text-white/40">
                  SKILLS & RESUME
                </span>
              </div>

              {/* Technical Skills Badges (with Audio Hover Feedback) */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.625rem] text-[#FFAA00] font-bold tracking-widest uppercase">
                    // HARD SKILLS [INTERACTIVE]
                  </span>
                  <span className="font-mono text-[0.55rem] text-white/30">
                    HOVER TO AUDIT
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {content.hardSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onMouseEnter={() => playSound("hover")}
                      onClick={() => playSound("click")}
                      className="px-2.5 py-1 bg-white/[0.03] border border-white/10 hover:border-[#FFAA00] hover:bg-[#FFAA00]/10 hover:text-white rounded-xs font-mono text-[0.68rem] text-white/80 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FFAA00]"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Soft Skills Section */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                <span className="font-mono text-[0.625rem] text-[#FFAA00] font-bold tracking-widest uppercase">
                  // SOFT SKILLS
                </span>

                <div className="grid grid-cols-2 gap-1.5 font-mono text-[0.68rem] text-white/70">
                  {content.softSkills.map((soft) => (
                    <div
                      key={soft}
                      className="px-2 py-1 bg-white/[0.02] border border-white/5 rounded-xs flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 bg-[#FFAA00] rounded-full shrink-0" />
                      <span className="truncate">{soft}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resume / CV CTA Button */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <a
                href={content.resume.href}
                target="_blank"
                rel="noopener noreferrer"
                download={content.resume.downloadFilename}
                onMouseEnter={() => playSound("hover")}
                onClick={() => playSound("open")}
                className="w-full py-3 px-4 border border-[#FFAA00] bg-[#FFAA00]/10 hover:bg-[#FFAA00] hover:text-[#050505] text-[#FFAA00] font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 rounded-xs group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FFAA00]"
                aria-label="View and download full CV/Resume"
              >
                <span>[ {content.resume.label} ]</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-y-0.5"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
              <span className="font-mono text-[0.55rem] text-center text-white/35">
                PDF FORMAT · COMPLETE EVIDENCE & PROJECT ARCHIVES
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
