"use client";

import React, { useState } from "react";
import {
  Globe,
  Plus,
  Check,
  AlertCircle,
  RefreshCw,
  Star,
  Trash2,
  Edit3,
  Sliders,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { LanguageItem, DEFAULT_TOP_LANGUAGES } from "@/shared/constants/languages";

interface AdminLanguageManagerProps {
  languages: LanguageItem[];
  onRefreshLanguages: () => Promise<void>;
  onSelectLanguageForEdit: (code: string) => void;
  adminEmail?: string;
}

export function AdminLanguageManager({
  languages,
  onRefreshLanguages,
  onSelectLanguageForEdit,
  adminEmail,
}: AdminLanguageManagerProps) {
  const [loadingCode, setLoadingCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Custom Form state
  const [customCode, setCustomCode] = useState("");
  const [customName, setCustomName] = useState("");
  const [customNativeName, setCustomNativeName] = useState("");
  const [customFlag, setCustomFlag] = useState("");
  const [customDirection, setCustomDirection] = useState<"ltr" | "rtl">("ltr");
  const [customSubmitting, setCustomSubmitting] = useState(false);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Toggle Active / Inactive
  const handleToggleActive = async (lang: LanguageItem) => {
    clearMessages();
    setLoadingCode(lang.code);
    try {
      const res = await fetch(`/api/admin/languages/${lang.code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !lang.isActive }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update language status");
      } else {
        setSuccess(`Language [${lang.code.toUpperCase()}] is now ${!lang.isActive ? "ACTIVE" : "INACTIVE"}`);
        await onRefreshLanguages();
      }
    } catch {
      setError("Network error while updating language status");
    } finally {
      setLoadingCode(null);
    }
  };

  // Set as default
  const handleSetDefault = async (lang: LanguageItem) => {
    clearMessages();
    setLoadingCode(lang.code);
    try {
      const res = await fetch(`/api/admin/languages/${lang.code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true, isActive: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to set default language");
      } else {
        setSuccess(`[${lang.code.toUpperCase()}] is now the PRIMARY DEFAULT language.`);
        await onRefreshLanguages();
      }
    } catch {
      setError("Network error while setting default language");
    } finally {
      setLoadingCode(null);
    }
  };

  // Delete custom language
  const handleDeleteLanguage = async (lang: LanguageItem) => {
    if (!confirm(`Are you sure you want to delete [${lang.code.toUpperCase()}] (${lang.name})?`)) {
      return;
    }
    clearMessages();
    setLoadingCode(lang.code);
    try {
      const res = await fetch(`/api/admin/languages/${lang.code}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to delete language");
      } else {
        setSuccess(`Language [${lang.code.toUpperCase()}] removed successfully.`);
        await onRefreshLanguages();
      }
    } catch {
      setError("Network error while deleting language");
    } finally {
      setLoadingCode(null);
    }
  };

  // 1-Click Add / Enable from Preset
  const handleAddPreset = async (preset: (typeof DEFAULT_TOP_LANGUAGES)[0]) => {
    clearMessages();
    setLoadingCode(preset.code);
    try {
      const res = await fetch("/api/admin/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...preset,
          isActive: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Failed to add preset ${preset.code.toUpperCase()}`);
      } else {
        setSuccess(`Preset [${preset.code.toUpperCase()}] (${preset.name}) activated.`);
        await onRefreshLanguages();
      }
    } catch {
      setError("Network error while adding preset language");
    } finally {
      setLoadingCode(null);
    }
  };

  // Submit custom language
  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCode || !customName || !customNativeName || !customFlag) {
      setError("All fields are required to create a custom language.");
      return;
    }
    clearMessages();
    setCustomSubmitting(true);
    try {
      const res = await fetch("/api/admin/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: customCode.toLowerCase().trim(),
          name: customName.trim(),
          nativeName: customNativeName.trim(),
          flag: customFlag.trim(),
          direction: customDirection,
          isActive: true,
          isDefault: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create language");
      } else {
        setSuccess(`Custom language [${customCode.toUpperCase()}] successfully configured.`);
        setCustomCode("");
        setCustomName("");
        setCustomNativeName("");
        setCustomFlag("");
        setShowCustomForm(false);
        await onRefreshLanguages();
      }
    } catch {
      setError("Network error while creating language");
    } finally {
      setCustomSubmitting(false);
    }
  };

  const configuredCodes = new Set(languages.map((l) => l.code));

  return (
    <div className="flex-1 bg-[#050505] p-3 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl w-full mx-auto space-y-6">
      {/* ── Top Header & Stats ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-[#FFAA00]" />
            <h1 className="font-mono text-base sm:text-lg font-bold text-white tracking-wider">
              DYNAMIC_LANGUAGE_MATRIX
            </h1>
            <span className="font-mono text-[10px] px-2 py-0.5 bg-[#FFAA00]/10 text-[#FFAA00] border border-[#FFAA00]/30 font-semibold">
              I18N // LIVE
            </span>
          </div>
          <p className="font-mono text-xs text-white/40 mt-1">
            Configure dynamic multi-language systems, active locales, and localized content pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefreshLanguages}
            className="inline-flex items-center gap-1.5 border border-white/15 px-3 py-1.5 font-mono text-xs text-white/70 hover:text-white hover:border-[#FFAA00] bg-white/5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>SYNC CLUSTER</span>
          </button>
        </div>
      </div>

      {/* ── Alerts / Feedback ── */}
      {error && (
        <div className="border border-red-500/30 bg-red-950/20 p-3 font-mono text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="border border-emerald-500/30 bg-emerald-950/20 p-3 font-mono text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {/* ── Section: Top 8 Default Presets ── */}
      <div className="border border-white/10 bg-[#080808] p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFAA00]" />
            <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-white">
              DEFAULT_TOP_LANGUAGES // PRESETS
            </span>
          </div>
          <span className="font-mono text-[9px] text-white/40 uppercase hidden sm:inline">
            1-CLICK ACTIVATION MATRIX
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {DEFAULT_TOP_LANGUAGES.map((preset) => {
            const configured = languages.find((l) => l.code === preset.code);
            const isInstalled = Boolean(configured);
            const isActive = configured?.isActive ?? false;
            const isDefault = configured?.isDefault ?? false;
            const isLoading = loadingCode === preset.code;

            return (
              <div
                key={preset.code}
                className={`border p-3 flex flex-col justify-between gap-2.5 transition-all ${
                  isActive
                    ? "border-[#FFAA00]/40 bg-[#FFAA00]/5"
                    : "border-white/10 bg-black/40 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl select-none" role="img" aria-label={preset.name}>
                      {preset.flag}
                    </span>
                    <span className="font-mono font-bold text-xs text-white">
                      {preset.code.toUpperCase()}
                    </span>
                  </div>
                  {isDefault && (
                    <span className="font-mono text-[8px] px-1.5 py-0.5 bg-[#FFAA00] text-black font-bold">
                      DEFAULT
                    </span>
                  )}
                </div>

                <div>
                  <div className="font-mono text-xs font-semibold text-white/90 truncate">
                    {preset.name}
                  </div>
                  <div className="font-mono text-[10px] text-white/40 truncate">
                    {preset.nativeName}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-1">
                  {isInstalled ? (
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleToggleActive(configured!)}
                      className={`w-full py-1 px-2 font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer text-center ${
                        isActive
                          ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "border border-white/15 bg-white/5 text-white/50 hover:text-white"
                      }`}
                    >
                      {isLoading ? "UPDATING..." : isActive ? "ACTIVE" : "INACTIVE"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleAddPreset(preset)}
                      className="w-full py-1 px-2 font-mono text-[10px] font-bold uppercase border border-[#FFAA00]/40 bg-[#FFAA00]/10 text-[#FFAA00] hover:bg-[#FFAA00] hover:text-black transition-colors cursor-pointer text-center"
                    >
                      {isLoading ? "INSTALLING..." : "+ ADD PRESET"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section: Active & Configured Languages Table ── */}
      <div className="border border-white/10 bg-[#080808] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FFAA00]" />
            <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-white">
              CONFIGURED_SYSTEM_LOCALES ({languages.length})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[#FFAA00] hover:text-[#ffbe33] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>CUSTOM LANGUAGE</span>
            {showCustomForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* ── Custom Language Addition Drawer ── */}
        {showCustomForm && (
          <form
            onSubmit={handleCreateCustom}
            className="border border-[#FFAA00]/30 bg-black/60 p-4 space-y-4 font-mono text-xs"
          >
            <div className="font-bold text-[#FFAA00] text-xs uppercase tracking-wider">
              NEW_CUSTOM_LANGUAGE_REGISTRATION
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div>
                <label className="block text-white/50 text-[10px] uppercase mb-1">CODE (e.g. 'nl')</label>
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="nl"
                  maxLength={5}
                  required
                  className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                />
              </div>
              <div>
                <label className="block text-white/50 text-[10px] uppercase mb-1">NAME</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Dutch"
                  required
                  className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                />
              </div>
              <div>
                <label className="block text-white/50 text-[10px] uppercase mb-1">NATIVE NAME</label>
                <input
                  type="text"
                  value={customNativeName}
                  onChange={(e) => setCustomNativeName(e.target.value)}
                  placeholder="Nederlands"
                  required
                  className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                />
              </div>
              <div>
                <label className="block text-white/50 text-[10px] uppercase mb-1">FLAG (EMOJI)</label>
                <input
                  type="text"
                  value={customFlag}
                  onChange={(e) => setCustomFlag(e.target.value)}
                  placeholder="🇳🇱"
                  required
                  className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                />
              </div>
              <div>
                <label className="block text-white/50 text-[10px] uppercase mb-1">TEXT DIRECTION</label>
                <select
                  value={customDirection}
                  onChange={(e) => setCustomDirection(e.target.value as "ltr" | "rtl")}
                  className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                >
                  <option value="ltr">LTR (Default)</option>
                  <option value="rtl">RTL (Right-to-Left)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="px-3 py-1.5 border border-white/10 text-white/50 hover:text-white"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={customSubmitting}
                className="px-4 py-1.5 bg-[#FFAA00] text-black font-bold uppercase hover:bg-[#ffbe33] cursor-pointer"
              >
                {customSubmitting ? "REGISTERING..." : "REGISTER LANGUAGE"}
              </button>
            </div>
          </form>
        )}

        {/* ── Language List ── */}
        <div className="divide-y divide-white/5">
          {languages.map((lang) => {
            const isLoading = loadingCode === lang.code;

            return (
              <div
                key={lang.code}
                className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs"
              >
                {/* Left: Flag & Details */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl select-none" role="img" aria-label={lang.name}>
                    {lang.flag}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        [{lang.code.toUpperCase()}] {lang.name}
                      </span>
                      <span className="text-white/40 text-[11px]">({lang.nativeName})</span>
                      {lang.isDefault && (
                        <span className="font-mono text-[9px] px-2 py-0.5 bg-[#FFAA00] text-black font-bold">
                          DEFAULT
                        </span>
                      )}
                      {lang.direction === "rtl" && (
                        <span className="font-mono text-[9px] px-1.5 py-0.5 border border-purple-500/40 text-purple-300">
                          RTL
                        </span>
                      )}
                    </div>
                    <div className="text-white/40 text-[10px] mt-0.5">
                      System Status:{" "}
                      <span className={lang.isActive ? "text-emerald-400 font-bold" : "text-white/40"}>
                        {lang.isActive ? "ACTIVE IN PUBLIC MATRIX" : "INACTIVE // DISABLED"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                  {/* Edit translations in Site Content */}
                  <button
                    type="button"
                    onClick={() => onSelectLanguageForEdit(lang.code)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/15 bg-white/5 text-white/80 hover:text-[#FFAA00] hover:border-[#FFAA00]/50 transition-colors cursor-pointer"
                    title={`Edit translations for ${lang.name}`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>EDIT TRANSLATIONS</span>
                  </button>

                  {/* Set Default */}
                  {!lang.isDefault && (
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleSetDefault(lang)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
                      title="Set as Default Language"
                    >
                      <Star className="w-3 h-3 text-[#FFAA00]" />
                      <span>SET DEFAULT</span>
                    </button>
                  )}

                  {/* Toggle Active / Inactive */}
                  <button
                    type="button"
                    disabled={isLoading || lang.isDefault}
                    onClick={() => handleToggleActive(lang)}
                    className={`px-3 py-1.5 font-bold uppercase transition-colors cursor-pointer ${
                      lang.isActive
                        ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "border border-white/15 bg-white/5 text-white/40 hover:text-white"
                    } ${lang.isDefault ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {lang.isActive ? "DEACTIVATE" : "ACTIVATE"}
                  </button>

                  {/* Delete custom if not default and not preset */}
                  {!lang.isDefault && (
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleDeleteLanguage(lang)}
                      className="p-1.5 border border-white/10 text-white/30 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
                      title="Remove Language"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
