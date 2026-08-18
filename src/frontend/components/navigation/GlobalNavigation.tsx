"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useActiveSection, SectionId } from "@/frontend/hooks/useActiveSection";

interface NavItem {
  id: SectionId;
  code: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "profile", code: "01", label: "PROFILE", href: "#profile" },
  { id: "projects", code: "02", label: "PROJECTS", href: "#projects" },
  { id: "contact", code: "03", label: "CONTACT", href: "#contact" },
];

/**
 * GlobalNavigation
 *
 * Minimal technical interface navigation for the classified portfolio system.
 *
 * Features:
 *   - Zero background fill at top (inherits global #050505 environment)
 *   - Glass/blur effect on scroll: backdrop-blur + bg applied via classList
 *     on the header DOM ref — no React state, no re-renders per scroll event.
 *     CSS transition handles smooth interpolation between states.
 *   - Controlled amber accent (#FFAA00) for active & focus states
 *   - Desktop: Fixed edge-aligned system bar with subtle mono typography
 *   - Mobile: Compact header + thumb-friendly system index drawer
 *   - Keyboard accessible with clear focus-visible rings & ESC key listener
 *   - Reactive section tracking via IntersectionObserver (useActiveSection)
 */
export function GlobalNavigation() {
  const activeSection = useActiveSection();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // ─── Scroll glass effect ──────────────────────────────────────────────────
  // Direct classList toggle on the DOM node — zero React state, zero re-renders.
  // CSS transition (on .nav-header) handles smooth interpolation.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("nav--scrolled", window.scrollY > 10);
    };

    // Apply immediately in case page loads mid-scroll (e.g., refresh)
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      ref={headerRef}
      className="nav-header fixed top-0 left-0 w-full z-[var(--z-navigation)] pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* ── System Identity / Brand Mark ── */}
        <a
          href="#hero"
          className="flex items-center py-1 px-1 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFAA00] focus-visible:outline-offset-2 opacity-90 hover:opacity-100 transition-opacity"
          aria-label="Portfolio Home — Zakariyae Boughaba"
        >
          <Image
            src="/assets/branding/BZ.png"
            alt="ZackwebDev brand logo"
            width={38}
            height={38}
            priority
            className="object-contain select-none"
          />
        </a>

        {/* ── Desktop Technical Index Navigation ── */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`group relative flex items-center gap-2 font-mono text-xs tracking-[0.12em] transition-colors duration-200 py-1.5 px-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFAA00] focus-visible:outline-offset-2 ${
                  isActive
                    ? "text-[#FFAA00] font-medium"
                    : "text-white/40 hover:text-white/80"
                }`}
              >
                {/* Active Indicator Square */}
                <span
                  className={`inline-block w-1.5 h-1.5 transition-all duration-200 ${
                    isActive
                      ? "bg-[#FFAA00] scale-100 opacity-100"
                      : "bg-white/20 scale-0 opacity-0 group-hover:scale-75 group-hover:opacity-50"
                  }`}
                />
                <span className="text-[0.65rem] opacity-60">{item.code}</span>
                <span>/</span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* ── Mobile Menu Toggle Button ── */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.15em] text-white/70 hover:text-[#FFAA00] border border-white/10 hover:border-[#FFAA00]/40 px-3 py-1.5 rounded-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFAA00]"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-drawer"
            aria-label={mobileMenuOpen ? "Close System Navigation" : "Open System Navigation"}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFAA00]" />
            <span>{mobileMenuOpen ? "[ CLOSE ]" : "[ SYS.INDEX ]"}</span>
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="fixed inset-0 top-14 bg-[#050505]/95 backdrop-blur-sm z-50 flex flex-col justify-between p-6 border-t border-white/10 md:hidden"
        >
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[0.65rem] tracking-[0.2em] text-[#FFAA00] uppercase mb-4 opacity-70">
              CLASSIFIED SYSTEM // NAVIGATION INDEX
            </p>

            <nav aria-label="Mobile Navigation" className="flex flex-col gap-4">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between font-mono text-sm tracking-[0.15em] p-3 border border-white/5 rounded-sm transition-all ${
                      isActive
                        ? "text-[#FFAA00] border-[#FFAA00]/40 bg-[#FFAA00]/5"
                        : "text-white/70 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#FFAA00]">{item.code}</span>
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <span className="font-mono text-[0.65rem] text-[#FFAA00] tracking-widest">
                        ● ACTIVE
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Drawer Footer Status */}
          <div className="pt-6 border-t border-white/5 flex items-center justify-between font-mono text-[0.65rem] text-white/30 tracking-widest">
            <span>SYS.ID: ZB-2026</span>
            <span>SECURE CHANNEL</span>
          </div>
        </div>
      )}
    </header>
  );
}
