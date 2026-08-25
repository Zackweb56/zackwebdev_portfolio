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

export function GlobalNavigation() {
  const activeSection = useActiveSection();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // ─── Force glass styles via CSSOM — bypasses all cascade/specificity issues ──
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    header.style.setProperty("background", "rgba(5, 5, 5, 0.45)", "important");
    header.style.setProperty("backdrop-filter", "blur(24px) saturate(180%)", "important");
    header.style.setProperty("-webkit-backdrop-filter", "blur(24px) saturate(180%)", "important");

    // Diagnostic — check your browser console after load
    console.log("[nav-header] computed backdrop-filter:", getComputedStyle(header).backdropFilter);

    // Diagnostic — walk ancestors for anything breaking position:fixed
    let el: HTMLElement | null = header.parentElement;
    while (el) {
      const t = getComputedStyle(el).transform;
      if (t !== "none") {
        console.warn("[nav-header] ancestor has transform, breaking fixed context:", el, t);
      }
      el = el.parentElement;
    }
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("nav--scrolled", window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header ref={headerRef} className="nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
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

          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`group relative flex items-center gap-2 font-mono text-xs tracking-[0.12em] transition-colors duration-200 py-1.5 px-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFAA00] focus-visible:outline-offset-2 ${
                    isActive ? "text-[#FFAA00] font-medium" : "text-white/40 hover:text-white/80"
                  }`}
                >
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

        {mobileMenuOpen && (
          <div
            id="mobile-menu-drawer"
            className="fixed inset-0 top-14 z-50 flex flex-col justify-between p-6 border-t border-white/10 md:hidden mobile-drawer"
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
            <div className="pt-6 border-t border-white/5 flex items-center justify-between font-mono text-[0.65rem] text-white/30 tracking-widest">
              <span>SYS.ID: ZB-2026</span>
              <span>SECURE CHANNEL</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
}