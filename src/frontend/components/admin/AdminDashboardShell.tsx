"use client";

import React, { useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar, AdminPrimaryNav, AdminContentSection } from "./AdminSidebar";
import { AdminContentEditor } from "./AdminContentEditor";
import { AdminSessionUser } from "@/backend/dal";
import { Database, FolderGit2, FileText, Image as ImageIcon, Sliders, BarChart3 } from "lucide-react";

interface AdminDashboardShellProps {
  user: AdminSessionUser;
}

const MOBILE_SECTIONS: { id: AdminContentSection; label: string; code: string }[] = [
  { id: "hero", label: "HERO", code: "01" },
  { id: "about", label: "ABOUT", code: "02" },
  { id: "projects", label: "PROJECTS", code: "03" },
  { id: "contact", label: "CONTACT", code: "04" },
];

export function AdminDashboardShell({ user }: AdminDashboardShellProps) {
  const [currentLanguage, setCurrentLanguage] = useState<"FR" | "EN">("FR");
  const [activePrimaryNav, setActivePrimaryNav] = useState<AdminPrimaryNav>("SITE_CONTENT");
  const [activeContentSection, setActiveContentSection] = useState<AdminContentSection>("about");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#050505] text-white overflow-hidden font-sans">
      {/* ── Top Header Navigation ── */}
      <AdminHeader
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        activeSectionTitle={
          activePrimaryNav === "SITE_CONTENT"
            ? `SITE_CONTENT // ${activeContentSection.toUpperCase()}`
            : activePrimaryNav
        }
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* ── Mobile Quick Section Bar (Visible on mobile/tablet when in SITE_CONTENT) ── */}
      {activePrimaryNav === "SITE_CONTENT" && (
        <div className="lg:hidden w-full border-b border-white/10 bg-[#070707] px-3 py-2 flex items-center gap-1.5 overflow-x-auto shrink-0 select-none">
          <span className="font-mono text-[9px] text-white/30 uppercase mr-1 shrink-0">SEC:</span>
          {MOBILE_SECTIONS.map((sec) => {
            const isActive = activeContentSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveContentSection(sec.id)}
                className={`flex items-center gap-1.5 px-3 py-1 font-mono text-[10px] font-bold uppercase transition-all duration-150 shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#FFAA00] text-[#050505]"
                    : "border border-white/10 text-white/60 hover:text-white bg-white/5"
                }`}
              >
                <span>[{sec.code}]</span>
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Main Area: Sidebar + Workstation ── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Nav (Desktop persistent + Mobile Drawer) */}
        <AdminSidebar
          activePrimaryNav={activePrimaryNav}
          onSelectPrimaryNav={(nav) => {
            setActivePrimaryNav(nav);
            setIsMobileMenuOpen(false);
          }}
          activeContentSection={activeContentSection}
          onSelectContentSection={(sec) => {
            setActiveContentSection(sec);
            setIsMobileMenuOpen(false);
          }}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Center Workstation */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#050505] w-full">
          {activePrimaryNav === "SITE_CONTENT" ? (
            <AdminContentEditor
              currentLanguage={currentLanguage}
              activeSection={activeContentSection}
              adminEmail={user.email}
            />
          ) : (
            <div className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center font-mono text-center space-y-4">
              <div className="p-4 border border-white/10 bg-[#080808]">
                {activePrimaryNav === "CV_DATA_CORE" && <FileText className="w-8 h-8 text-[#FFAA00] mx-auto" />}
                {activePrimaryNav === "PROJECT_EVIDENCE" && <FolderGit2 className="w-8 h-8 text-[#FFAA00] mx-auto" />}
                {activePrimaryNav === "MEDIA_LIBRARY" && <ImageIcon className="w-8 h-8 text-[#FFAA00] mx-auto" />}
                {activePrimaryNav === "SYSTEM_CONFIG" && <Sliders className="w-8 h-8 text-[#FFAA00] mx-auto" />}
                {activePrimaryNav === "VISITOR_STATS" && <BarChart3 className="w-8 h-8 text-[#FFAA00] mx-auto" />}
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-white tracking-wider">
                  MODULE // {activePrimaryNav}
                </h2>
                <p className="text-xs text-white/40">
                  Data access verified. Connected to MongoDB Atlas cluster.
                </p>
              </div>
              <div className="border border-white/10 bg-black/60 px-4 py-2 text-xs text-emerald-400">
                AUTH_STATUS: VERIFIED (DAL) // {user.email}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
