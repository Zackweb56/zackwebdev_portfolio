"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  LayoutGrid,
  FolderGit2,
  Image as ImageIcon,
  Sliders,
  BarChart3,
  LogOut,
  X,
  Globe,
} from "lucide-react";
import { authClient } from "@/backend/auth/client";

export type AdminPrimaryNav =
  | "CV_DATA_CORE"
  | "SITE_CONTENT"
  | "LANGUAGES"
  | "PROJECT_EVIDENCE"
  | "MEDIA_LIBRARY"
  | "SYSTEM_CONFIG"
  | "VISITOR_STATS";

export type AdminContentSection =
  | "hero"
  | "about"
  | "projects"
  | "contact";

interface AdminSidebarProps {
  activePrimaryNav: AdminPrimaryNav;
  onSelectPrimaryNav: (nav: AdminPrimaryNav) => void;
  activeContentSection: AdminContentSection;
  onSelectContentSection: (section: AdminContentSection) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const PRIMARY_NAV_ITEMS: { id: AdminPrimaryNav; label: string; icon: React.ElementType }[] = [
  { id: "SITE_CONTENT", label: "SITE_CONTENT", icon: LayoutGrid },
  { id: "LANGUAGES", label: "LANGUAGES_I18N", icon: Globe },
  { id: "CV_DATA_CORE", label: "CV_DATA_CORE", icon: FileText },
  { id: "PROJECT_EVIDENCE", label: "PROJECT_EVIDENCE", icon: FolderGit2 },
  { id: "MEDIA_LIBRARY", label: "MEDIA_LIBRARY", icon: ImageIcon },
  { id: "SYSTEM_CONFIG", label: "SYSTEM_CONFIG", icon: Sliders },
  { id: "VISITOR_STATS", label: "VISITOR_STATS", icon: BarChart3 },
];

const CONTENT_SECTIONS: { id: AdminContentSection; label: string; code: string }[] = [
  { id: "hero", label: "Hero Section", code: "[01]" },
  { id: "about", label: "About / Profile", code: "[02]" },
  { id: "projects", label: "Projects / Evidence", code: "[03]" },
  { id: "contact", label: "Contact Section", code: "[04]" },
];

export function AdminSidebar({
  activePrimaryNav,
  onSelectPrimaryNav,
  activeContentSection,
  onSelectContentSection,
  isMobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
    } catch {
      // Ignore network errors on logout
    }
    router.push("/access_bz_admin");
    router.refresh();
  };

  const handleSelectPrimary = (nav: AdminPrimaryNav) => {
    onSelectPrimaryNav(nav);
    // If not switching to sub-nav or on mobile, we can manage state
  };

  const handleSelectSection = (section: AdminContentSection) => {
    onSelectContentSection(section);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col sm:flex-row h-full">
      {/* ── Primary Main Column ── */}
      <div className="w-full sm:w-56 border-b sm:border-b-0 sm:border-r border-white/10 flex flex-col justify-between p-3 sm:p-4 bg-[#050505] shrink-0">
        <div>
          {/* Mobile Drawer Header with Close Button */}
          <div className="flex lg:hidden items-center justify-between pb-3 mb-2 border-b border-white/10">
            <span className="font-mono text-xs font-bold text-[#FFAA00]">NAVIGATION_MATRIX</span>
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 text-white/50 hover:text-white"
                aria-label="Close navigation"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Primary Nav List */}
          <div className="space-y-1">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activePrimaryNav === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectPrimary(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 font-mono text-xs text-left transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#FFAA00] text-[#050505] font-bold"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#050505]" : "text-white/40"}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions: Terminate Session */}
        <div className="pt-4 mt-6 border-t border-white/10 space-y-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-between border border-white/15 hover:border-[#FFAA00]/50 hover:bg-[#FFAA00]/10 px-3 py-2 text-white/70 hover:text-[#FFAA00] font-mono text-xs transition-colors cursor-pointer group"
          >
            <span className="font-semibold tracking-wider">TERMINATE SESSION</span>
            <LogOut className="w-3.5 h-3.5 text-white/40 group-hover:text-[#FFAA00]" />
          </button>

          <div className="flex items-center justify-between font-mono text-[9px] text-white/30 px-1">
            <span>VER. 2.5.0</span>
            <span className="text-[#FFAA00]/60 font-semibold">ENCRYPTED</span>
          </div>
        </div>
      </div>

      {/* ── Secondary Sub-Navigation Column (for Site Content) ── */}
      {activePrimaryNav === "SITE_CONTENT" && (
        <div className="w-full sm:w-52 border-b sm:border-b-0 sm:border-r border-white/10 bg-[#070707] p-3 sm:p-4 flex flex-col justify-between shrink-0">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3 px-2 flex items-center justify-between">
              <span>CONTENT SECTIONS</span>
              <span className="text-[#FFAA00]/50 text-[9px]">[CMS]</span>
            </div>

            <div className="space-y-1">
              {CONTENT_SECTIONS.map((sec) => {
                const isActive = activeContentSection === sec.id;

                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => handleSelectSection(sec.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 font-mono text-xs text-left transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-[#FFAA00] text-[#050505] font-bold"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="truncate">{sec.label}</span>
                    <span className={`text-[10px] ${isActive ? "text-[#050505]/80 font-bold" : "text-white/30"}`}>
                      {sec.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[9px] font-mono text-white/30 px-2 hidden sm:block">
            SELECT SECTION TO EDIT
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (>= 1024px) */}
      <aside className="hidden lg:flex select-none shrink-0 h-full">
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Drawer (< 1024px) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer content panel */}
          <div className="relative z-50 flex flex-col max-w-[85vw] sm:max-w-md w-full bg-[#050505] border-r border-white/15 h-full overflow-y-auto shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
