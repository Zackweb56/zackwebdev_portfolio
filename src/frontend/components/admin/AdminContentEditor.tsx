"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  UploadCloud,
  Trash2,
} from "lucide-react";
import { AdminContentSection } from "./AdminSidebar";
import { defaultHeroContent } from "@/frontend/lib/heroContent";
import { defaultProfileContent } from "@/frontend/lib/profileContent";
import { uploadToCloudinary } from "@/frontend/lib/cloudinaryUpload";
import { AdminProjectsManager } from "./AdminProjectsManager";

import { LanguageItem } from "@/shared/constants/languages";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Localized = Record<string, string>;

interface HeroData {
  availability: Localized;
  nameFirst: string;
  nameLast: string;
  role: Localized;
  bio: Localized;
  scrollLabel: Localized;
}

interface IdentityData {
  fullName: string;
  roleTitle: Localized;
  classCode: string;
  location: string;
  workMode: Localized;
  availability: Localized;
  profileImage: string;
  languages: string[];
}

interface EducationItem {
  _id?: string;
  institution: string;
  period: string;
  degree: Localized;
  field: Localized;
}

interface ExperienceItem {
  _id?: string;
  company: string;
  role: Localized;
  period: string;
  stack: string[];
  description: Localized;
}

interface ProfileData {
  header: {
    label: Localized;
    stamp: Localized;
    systemRef: string;
  };
  identity: IdentityData;
  summary: Localized;
  education: EducationItem[];
  experience: ExperienceItem[];
  hardSkills: string[];
  softSkills: string[];
  resume: {
    label: Localized;
    href: string;
    downloadFilename: string;
    cvFiles?: Record<string, string>;
  };
}

interface ContactData {
  email: string;
  headline: Localized;
  availabilityBadge: Localized;
  locationCity: string;
  locationCountry: string;
  socialLinks: { id: string; name: string; code: string; href: string; platform: string }[];
}

// ─── Default Initial States (Guarantees instant render without spinner blocking) ─

const INITIAL_HERO: HeroData = {
  availability: { fr: "Ouvert aux opportunités", en: defaultHeroContent.availability },
  nameFirst: defaultHeroContent.name.first,
  nameLast: defaultHeroContent.name.last,
  role: { fr: "Développeur Web Full Stack", en: defaultHeroContent.role },
  bio: {
    fr: "Je conçois et développe des applications web full-stack fiables avec une architecture propre, des performances optimales et des interactions utilisateur soignées.",
    en: defaultHeroContent.bio,
  },
  scrollLabel: { fr: "Explorer", en: defaultHeroContent.scrollLabel },
};

const INITIAL_PROFILE: ProfileData = {
  header: {
    label: { fr: "PROFIL", en: defaultProfileContent.header.label },
    stamp: { fr: "DOSSIER // SPÉCIFICATION SUJET", en: defaultProfileContent.header.stamp },
    systemRef: defaultProfileContent.header.systemRef,
  },
  identity: {
    fullName: defaultProfileContent.identity.fullName,
    roleTitle: { fr: "DÉVELOPPEUR WEB FULL-STACK", en: defaultProfileContent.identity.roleTitle },
    classCode: defaultProfileContent.identity.classCode,
    location: defaultProfileContent.identity.location,
    workMode: { fr: "TÉLÉTRAVAIL INTERNATIONAL", en: defaultProfileContent.identity.workMode },
    availability: { fr: "DISPONIBLE", en: defaultProfileContent.identity.availability },
    profileImage: defaultProfileContent.identity.profileImage,
    languages: defaultProfileContent.identity.languages,
  },
  summary: {
    fr: "Développeur Web Full-Stack spécialisé dans la création d'applications web scalables, fiables et performantes avec Laravel, Next.js et React.",
    en: defaultProfileContent.summary,
  },
  education: defaultProfileContent.education.map((edu) => ({
    institution: edu.institution,
    period: edu.period,
    degree: { fr: edu.degree, en: edu.degree },
    field: { fr: edu.field, en: edu.field },
  })),
  experience: defaultProfileContent.experience.map((exp) => ({
    company: exp.company,
    role: { fr: exp.role, en: exp.role },
    period: exp.period,
    stack: exp.stack || [],
    description: { fr: exp.description, en: exp.description },
  })),
  hardSkills: defaultProfileContent.hardSkills,
  softSkills: defaultProfileContent.softSkills,
  resume: {
    label: { fr: "VOIR ET TÉLÉCHARGER CV", en: defaultProfileContent.resume.label },
    href: defaultProfileContent.resume.href,
    downloadFilename: defaultProfileContent.resume.downloadFilename,
    cvFiles: {},
  },
};

const INITIAL_CONTACT: ContactData = {
  email: "zackwebdev56@gmail.com",
  headline: { fr: "Et si nous travaillions ensemble ?", en: "What if we worked together?" },
  availabilityBadge: { fr: "DISPONIBLE POUR DU TRAVAIL", en: "AVAILABLE FOR WORK" },
  locationCity: "Beni Mellal",
  locationCountry: "Morocco",
  socialLinks: [
    { id: "whatsapp", name: "WHATSAPP", code: "WA // DIRECT", href: "https://wa.me/212620719875", platform: "whatsapp" },
    { id: "github", name: "GITHUB", code: "GH // REPO", href: "https://github.com/Zackweb56", platform: "github" },
    { id: "linkedin", name: "LINKEDIN", code: "IN // NETWORK", href: "https://www.linkedin.com/in/zakariyae-boughaba", platform: "linkedin" },
  ],
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

function LocalizedField({
  label,
  value,
  onChange,
  lang,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: Localized;
  onChange: (val: Localized) => void;
  lang: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const cls =
    "w-full bg-[#080808] border border-white/15 focus:border-[#FFAA00] focus:ring-1 focus:ring-[#FFAA00]/40 text-white font-mono text-xs sm:text-sm px-3 sm:px-3.5 py-2.5 outline-none transition-colors resize-none";

  const safeVal = value ? value[lang] || "" : "";

  return (
    <div className="w-full">
      <label className="font-mono text-[10px] sm:text-xs uppercase text-white/40 mb-1.5 flex items-center justify-between">
        <span>{label}</span>
        <span className="text-[#FFAA00] font-semibold text-[9px] sm:text-[10px] tracking-wider">[{lang.toUpperCase()}]</span>
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={safeVal}
          onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
          placeholder={placeholder}
          className={cls}
        />
      ) : (
        <input
          type="text"
          value={safeVal}
          onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  );
}

function StringListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full">
      <label className="block font-mono text-[10px] sm:text-xs uppercase text-white/40 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {(items || []).map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 bg-[#080808] border border-white/15 px-2.5 py-1 font-mono text-[10px] sm:text-xs text-white/80"
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="p-0.5 text-white/40 hover:text-[#FFAA00] transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="Add item..."
          className="flex-1 bg-[#080808] border border-white/15 focus:border-[#FFAA00] text-white font-mono text-xs px-3 py-2 outline-none transition-colors"
        />
        <button
          type="button"
          onClick={addItem}
          className="px-3.5 py-2 bg-[#FFAA00]/10 border border-[#FFAA00]/30 text-[#FFAA00] font-mono text-xs hover:bg-[#FFAA00]/20 transition-colors cursor-pointer flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ADD</span>
        </button>
      </div>
    </div>
  );
}

// ─── Hero Editor ──────────────────────────────────────────────────────────────

function HeroEditor({ lang }: { lang: string }) {
  const [data, setData] = useState<HeroData>(INITIAL_HERO);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/content/hero");
      if (!res.ok) throw new Error(`HTTP_${res.status}`);
      const json = await res.json();
      if (json.hero) {
        setData((prev) => ({ ...prev, ...json.hero }));
      }
    } catch {
      setError("Note: Loaded default records. Atlas sync ready.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/content/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero: data }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to commit changes. Check network or authentication.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Hero Section"
        tag="[HERO_SECTION]"
        loading={loading}
        saving={saving}
        saved={saved}
        error={error}
        onSave={handleSave}
        onRefresh={fetchData}
      />

      <div className="space-y-4">
        <LocalizedField
          label="AVAILABILITY STATUS"
          value={data.availability}
          onChange={(v) => setData({ ...data, availability: v })}
          lang={lang}
          placeholder={lang === "fr" ? "Ouvert aux opportunités" : "Open to opportunities"}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block font-mono text-[10px] sm:text-xs uppercase text-white/40 mb-1.5">FIRST NAME</label>
            <input
              type="text"
              value={data.nameFirst}
              onChange={(e) => setData({ ...data, nameFirst: e.target.value })}
              className="w-full bg-[#080808] border border-white/15 focus:border-[#FFAA00] focus:ring-1 focus:ring-[#FFAA00]/40 text-white font-mono text-xs sm:text-sm px-3.5 py-2.5 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] sm:text-xs uppercase text-white/40 mb-1.5">LAST NAME</label>
            <input
              type="text"
              value={data.nameLast}
              onChange={(e) => setData({ ...data, nameLast: e.target.value })}
              className="w-full bg-[#080808] border border-white/15 focus:border-[#FFAA00] focus:ring-1 focus:ring-[#FFAA00]/40 text-white font-mono text-xs sm:text-sm px-3.5 py-2.5 outline-none transition-colors"
            />
          </div>
        </div>

        <LocalizedField
          label="ROLE / TITLE"
          value={data.role}
          onChange={(v) => setData({ ...data, role: v })}
          lang={lang}
          placeholder={lang === "fr" ? "Développeur Web Full Stack" : "Full Stack Web Developer"}
        />

        <LocalizedField
          label="BIO / POSITIONING"
          value={data.bio}
          onChange={(v) => setData({ ...data, bio: v })}
          lang={lang}
          multiline
        />

        <LocalizedField
          label="SCROLL CUE LABEL"
          value={data.scrollLabel}
          onChange={(v) => setData({ ...data, scrollLabel: v })}
          lang={lang}
          placeholder={lang === "fr" ? "Explorer" : "Explore"}
        />
      </div>
    </div>
  );
}

// ─── Profile Editor ───────────────────────────────────────────────────────────

function ProfileEditor({
  lang,
  languages = [],
}: {
  lang: string;
  languages?: LanguageItem[];
}) {
  const [data, setData] = useState<ProfileData>(INITIAL_PROFILE);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [openSection, setOpenSection] = useState<string>("identity");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/content/profile");
      if (!res.ok) throw new Error(`HTTP_${res.status}`);
      const json = await res.json();
      if (json.profile) {
        setData((prev) => ({ ...prev, ...json.profile }));
      }
    } catch {
      setError("Note: Loaded default records. Atlas sync ready.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/content/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: data }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to commit profile changes.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = (s: string) => setOpenSection(openSection === s ? "" : s);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="About / Profile"
        tag="[PROFILE_HEADER]"
        loading={loading}
        saving={saving}
        saved={saved}
        error={error}
        onSave={handleSave}
        onRefresh={fetchData}
      />

      {/* Identity */}
      <Accordion open={openSection === "identity"} onToggle={() => toggle("identity")} label="IDENTITY MODULE [ID_CARD]">
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[10px] sm:text-xs uppercase text-white/40 mb-1.5">NAME ID</label>
              <input
                type="text"
                value={data.identity.fullName}
                onChange={(e) => setData({ ...data, identity: { ...data.identity, fullName: e.target.value } })}
                className="w-full bg-[#080808] border border-white/15 focus:border-[#FFAA00] text-white font-mono text-xs sm:text-sm px-3.5 py-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] sm:text-xs uppercase text-white/40 mb-1.5">CLASS CODE</label>
              <input
                type="text"
                value={data.identity.classCode}
                onChange={(e) => setData({ ...data, identity: { ...data.identity, classCode: e.target.value } })}
                className="w-full bg-[#080808] border border-white/15 focus:border-[#FFAA00] text-white font-mono text-xs sm:text-sm px-3.5 py-2.5 outline-none"
              />
            </div>
          </div>

          <LocalizedField
            label="ROLE TITLE"
            value={data.identity.roleTitle}
            onChange={(v) => setData({ ...data, identity: { ...data.identity, roleTitle: v } })}
            lang={lang}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[10px] sm:text-xs uppercase text-white/40 mb-1.5">LOCATION</label>
              <input
                type="text"
                value={data.identity.location}
                onChange={(e) => setData({ ...data, identity: { ...data.identity, location: e.target.value } })}
                className="w-full bg-[#080808] border border-white/15 focus:border-[#FFAA00] text-white font-mono text-xs sm:text-sm px-3.5 py-2.5 outline-none"
              />
            </div>
          </div>

          <ProfileImageUploader
            value={data.identity.profileImage}
            onChange={(url) =>
              setData({ ...data, identity: { ...data.identity, profileImage: url } })
            }
          />

          <LocalizedField
            label="AVAILABILITY BADGE"
            value={data.identity.availability}
            onChange={(v) => setData({ ...data, identity: { ...data.identity, availability: v } })}
            lang={lang}
          />

          <StringListEditor
            label="LANGUAGES"
            items={data.identity.languages}
            onChange={(v) => setData({ ...data, identity: { ...data.identity, languages: v } })}
          />
        </div>
      </Accordion>

      {/* Summary */}
      <Accordion open={openSection === "summary"} onToggle={() => toggle("summary")} label="SUMMARY [BIO]">
        <LocalizedField
          label="PROFESSIONAL SUMMARY"
          value={data.summary}
          onChange={(v) => setData({ ...data, summary: v })}
          lang={lang}
          multiline
        />
      </Accordion>

      {/* Experience */}
      <Accordion open={openSection === "experience"} onToggle={() => toggle("experience")} label="EXPERIENCE [WORK_HISTORY]">
        <div className="space-y-4">
          {data.experience.map((exp, i) => (
            <div key={i} className="border border-white/10 bg-[#080808] p-3 sm:p-4 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#FFAA00] font-semibold">ENTRY #{i + 1}</span>
                <button
                  type="button"
                  onClick={() => setData({ ...data, experience: data.experience.filter((_, idx) => idx !== i) })}
                  className="p-1 text-white/40 hover:text-[#FFAA00] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-white/40 mb-1">COMPANY</label>
                  <input type="text" value={exp.company}
                    onChange={(e) => { const n = [...data.experience]; n[i] = { ...n[i], company: e.target.value }; setData({ ...data, experience: n }); }}
                    className="w-full bg-black border border-white/15 focus:border-[#FFAA00] text-white font-mono text-xs px-3 py-2 outline-none" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-white/40 mb-1">PERIOD</label>
                  <input type="text" value={exp.period}
                    onChange={(e) => { const n = [...data.experience]; n[i] = { ...n[i], period: e.target.value }; setData({ ...data, experience: n }); }}
                    className="w-full bg-black border border-white/15 focus:border-[#FFAA00] text-white font-mono text-xs px-3 py-2 outline-none" />
                </div>
              </div>
              <LocalizedField
                label="ROLE"
                value={exp.role}
                onChange={(v) => { const n = [...data.experience]; n[i] = { ...n[i], role: v }; setData({ ...data, experience: n }); }}
                lang={lang}
              />
              <LocalizedField
                label="DESCRIPTION"
                value={exp.description}
                onChange={(v) => { const n = [...data.experience]; n[i] = { ...n[i], description: v }; setData({ ...data, experience: n }); }}
                lang={lang}
                multiline
              />
              <StringListEditor
                label="TECH STACK"
                items={exp.stack}
                onChange={(v) => { const n = [...data.experience]; n[i] = { ...n[i], stack: v }; setData({ ...data, experience: n }); }}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setData({
              ...data,
              experience: [...data.experience, {
                company: "",
                role: { fr: "", en: "" },
                period: "",
                stack: [],
                description: { fr: "", en: "" },
              }],
            })}
            className="w-full border border-dashed border-[#FFAA00]/30 hover:border-[#FFAA00] text-[#FFAA00]/70 hover:text-[#FFAA00] font-mono text-xs py-3 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-[#FFAA00]/5"
          >
            <Plus className="w-4 h-4" />
            <span>ADD EXPERIENCE ENTRY</span>
          </button>
        </div>
      </Accordion>

      {/* Education */}
      <Accordion open={openSection === "education"} onToggle={() => toggle("education")} label="EDUCATION [ACADEMIC_RECORD]">
        <div className="space-y-4">
          {data.education.map((edu, i) => (
            <div key={i} className="border border-white/10 bg-[#080808] p-3 sm:p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-[#FFAA00] font-semibold">ENTRY #{i + 1}</span>
                <button type="button" onClick={() => setData({ ...data, education: data.education.filter((_, idx) => idx !== i) })} className="p-1 text-white/40 hover:text-[#FFAA00] transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-white/40 mb-1">INSTITUTION</label>
                  <input type="text" value={edu.institution}
                    onChange={(e) => { const n = [...data.education]; n[i] = { ...n[i], institution: e.target.value }; setData({ ...data, education: n }); }}
                    className="w-full bg-black border border-white/15 focus:border-[#FFAA00] text-white font-mono text-xs px-3 py-2 outline-none" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-white/40 mb-1">PERIOD</label>
                  <input type="text" value={edu.period}
                    onChange={(e) => { const n = [...data.education]; n[i] = { ...n[i], period: e.target.value }; setData({ ...data, education: n }); }}
                    className="w-full bg-black border border-white/15 focus:border-[#FFAA00] text-white font-mono text-xs px-3 py-2 outline-none" />
                </div>
              </div>
              <LocalizedField label="DEGREE" value={edu.degree} onChange={(v) => { const n = [...data.education]; n[i] = { ...n[i], degree: v }; setData({ ...data, education: n }); }} lang={lang} />
              <LocalizedField label="FIELD" value={edu.field} onChange={(v) => { const n = [...data.education]; n[i] = { ...n[i], field: v }; setData({ ...data, education: n }); }} lang={lang} />
            </div>
          ))}
          <button type="button"
            onClick={() => setData({ ...data, education: [...data.education, { institution: "", period: "", degree: { fr: "", en: "" }, field: { fr: "", en: "" } }] })}
            className="w-full border border-dashed border-[#FFAA00]/30 hover:border-[#FFAA00] text-[#FFAA00]/70 hover:text-[#FFAA00] font-mono text-xs py-3 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-[#FFAA00]/5">
            <Plus className="w-4 h-4" /><span>ADD EDUCATION ENTRY</span>
          </button>
        </div>
      </Accordion>

      {/* Skills */}
      <Accordion open={openSection === "skills"} onToggle={() => toggle("skills")} label="SKILLS [TECH_MATRIX]">
        <div className="space-y-4">
          <StringListEditor label="HARD SKILLS" items={data.hardSkills} onChange={(v) => setData({ ...data, hardSkills: v })} />
          <StringListEditor label="SOFT SKILLS" items={data.softSkills} onChange={(v) => setData({ ...data, softSkills: v })} />
        </div>
      </Accordion>

      {/* Resume & CV per Language */}
      <Accordion open={openSection === "resume"} onToggle={() => toggle("resume")} label="RESUME & CV [PER_LOCALE_FILES]">
        <CvUploader
          resume={data.resume}
          onChange={(resume) => setData({ ...data, resume })}
          languages={languages}
          lang={lang}
        />
      </Accordion>
    </div>
  );
}

// ─── Contact Editor ───────────────────────────────────────────────────────────

function ContactEditor({ lang }: { lang: string }) {
  const [data, setData] = useState<ContactData>(INITIAL_CONTACT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/content/contact");
      if (!res.ok) throw new Error(`HTTP_${res.status}`);
      const json = await res.json();
      if (json.contact) {
        setData((prev) => ({ ...prev, ...json.contact }));
      }
    } catch {
      setError("Note: Loaded default records. Atlas sync ready.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/content/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: data }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to commit contact changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Contact Section"
        tag="[CONTACT_CHANNEL]"
        loading={loading}
        saving={saving}
        saved={saved}
        error={error}
        onSave={handleSave}
        onRefresh={fetchData}
      />

      <div className="space-y-4">
        <div>
          <label className="block font-mono text-[10px] sm:text-xs uppercase text-white/40 mb-1.5">CONTACT EMAIL</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full bg-[#080808] border border-white/15 focus:border-[#FFAA00] focus:ring-1 focus:ring-[#FFAA00]/40 text-white font-mono text-xs sm:text-sm px-3.5 py-2.5 outline-none transition-colors"
          />
        </div>

        <LocalizedField label="HEADLINE" value={data.headline} onChange={(v) => setData({ ...data, headline: v })} lang={lang} multiline />
        <LocalizedField label="AVAILABILITY BADGE TEXT" value={data.availabilityBadge} onChange={(v) => setData({ ...data, availabilityBadge: v })} lang={lang} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block font-mono text-[10px] sm:text-xs uppercase text-white/40 mb-1.5">LOCATION CITY</label>
            <input
              type="text"
              value={data.locationCity}
              onChange={(e) => setData({ ...data, locationCity: e.target.value })}
              className="w-full bg-[#080808] border border-white/15 focus:border-[#FFAA00] text-white font-mono text-xs sm:text-sm px-3.5 py-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] sm:text-xs uppercase text-white/40 mb-1.5">LOCATION COUNTRY</label>
            <input
              type="text"
              value={data.locationCountry}
              onChange={(e) => setData({ ...data, locationCountry: e.target.value })}
              className="w-full bg-[#080808] border border-white/15 focus:border-[#FFAA00] text-white font-mono text-xs sm:text-sm px-3.5 py-2.5 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] sm:text-xs uppercase text-white/40 mb-2">SOCIAL NETWORK LINKS</label>
          <div className="space-y-2.5">
            {data.socialLinks.map((link, i) => (
              <div key={i} className="flex flex-col sm:grid sm:grid-cols-12 gap-2 border border-white/10 bg-[#080808] p-3">
                <span className="sm:col-span-2 font-mono text-xs text-[#FFAA00] font-semibold">{link.name}</span>
                <input
                  type="text"
                  value={link.code}
                  onChange={(e) => {
                    const n = [...data.socialLinks];
                    n[i] = { ...n[i], code: e.target.value };
                    setData({ ...data, socialLinks: n });
                  }}
                  placeholder="CODE"
                  className="sm:col-span-3 bg-black border border-white/10 focus:border-[#FFAA00] text-white font-mono text-xs px-2.5 py-1.5 outline-none"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => {
                    const n = [...data.socialLinks];
                    n[i] = { ...n[i], href: e.target.value };
                    setData({ ...data, socialLinks: n });
                  }}
                  placeholder="URL / PROTOCOL"
                  className="sm:col-span-7 bg-black border border-white/10 focus:border-[#FFAA00] text-white font-mono text-xs px-2.5 py-1.5 outline-none truncate"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Image Uploader Sub-Component ─────────────────────────────────────

function ProfileImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      setError("Supported formats: WebP, JPEG, PNG, AVIF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds 5 MB limit.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setError("");

    try {
      const { secureUrl } = await uploadToCloudinary(file, "portfolio/profile", (pct) =>
        setProgress(pct)
      );
      // Persist to server profile endpoint
      const res = await fetch("/api/admin/uploads/profile-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secureUrl }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to persist profile image to database");
      }
      onChange(secureUrl);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border border-white/10 p-3 sm:p-4 bg-[#080808] space-y-3">
      <div className="flex items-center justify-between">
        <label className="block font-mono text-[10px] sm:text-xs uppercase text-white/40">
          PROFILE PHOTO (CLOUDINARY DIRECT UPLOAD)
        </label>
        {value && (
          <span className="font-mono text-[10px] text-emerald-400">ACTIVE PHOTO</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-black border border-white/15 overflow-hidden shrink-0">
          {value ? (
            <Image src={value} alt="Profile preview" fill className="object-cover" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 font-mono text-[10px]">
              NO PHOTO
            </div>
          )}
        </div>

        <div className="flex-1 w-full space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full border border-dashed border-[#FFAA00]/40 bg-[#FFAA00]/5 hover:bg-[#FFAA00]/10 text-[#FFAA00] font-mono text-xs py-3 px-4 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>UPLOADING TO CLOUDINARY ({progress}%)...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>UPLOAD NEW PHOTO (MAX 5 MB)</span>
              </>
            )}
          </button>

          {error && (
            <div className="font-mono text-[11px] text-red-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-mono text-[9px] uppercase text-white/30 mb-1">
              OR DIRECT URL
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="w-full bg-black border border-white/10 text-white font-mono text-xs px-2.5 py-1.5 outline-none focus:border-[#FFAA00]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CV Uploader Sub-Component ────────────────────────────────────────────────

function CvUploader({
  resume,
  onChange,
  languages = [],
  lang,
}: {
  resume: ProfileData["resume"];
  onChange: (resume: ProfileData["resume"]) => void;
  languages?: LanguageItem[];
  lang: string;
}) {
  const [uploadingLocale, setUploadingLocale] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const activeLangs =
    languages.length > 0
      ? languages.filter((l) => l.isActive)
      : [
          { code: "en", name: "English", flag: "🇬🇧", isActive: true },
          { code: "fr", name: "Français", flag: "🇫🇷", isActive: true },
        ];

  const handleUploadCv = async (code: string, file: File) => {
    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      setError("Only PDF and DOCX documents are accepted.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds 10 MB limit.");
      return;
    }

    setUploadingLocale(code);
    setProgress(0);
    setError("");

    try {
      const { secureUrl } = await uploadToCloudinary(file, "portfolio/cv", (pct) =>
        setProgress(pct)
      );
      const res = await fetch("/api/admin/uploads/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: code,
          secureUrl,
          originalName: file.name,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to persist CV file");
      }
      const data = await res.json();
      onChange({
        ...resume,
        cvFiles: data.cvFiles || { ...(resume.cvFiles || {}), [code]: secureUrl },
      });
    } catch (err: any) {
      setError(err.message || "Failed to upload CV");
    } finally {
      setUploadingLocale(null);
    }
  };

  const handleRemoveCv = async (code: string) => {
    try {
      const res = await fetch(`/api/admin/uploads/cv?locale=${code}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove CV");
      const nextCv = { ...(resume.cvFiles || {}) };
      delete nextCv[code];
      onChange({ ...resume, cvFiles: nextCv });
    } catch (err: any) {
      setError(err.message || "Failed to remove CV");
    }
  };

  return (
    <div className="space-y-4">
      <div className="border border-white/10 p-3 sm:p-4 bg-[#080808] space-y-3">
        <span className="font-mono text-xs font-bold text-[#FFAA00] block">
          PER-LOCALE CURRICULUM VITAE UPLOADS (CLOUDINARY)
        </span>
        <p className="font-mono text-[11px] text-white/50">
          Upload dedicated CV documents for each active portfolio language. If a language does not have a CV uploaded, the public portfolio will display a subtle &quot;coming soon&quot; status pill.
        </p>

        {error && (
          <div className="font-mono text-xs text-red-400 flex items-center gap-1.5 p-2 bg-red-950/20 border border-red-500/30">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {activeLangs.map((l) => {
            const code = l.code.toLowerCase();
            const currentUrl = resume.cvFiles?.[code];
            const isUploading = uploadingLocale === code;

            return (
              <div
                key={code}
                className="border border-white/10 bg-black p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{l.flag}</span>
                    <span className="font-bold text-white uppercase">
                      [{code.toUpperCase()}] {l.name}
                    </span>
                    {currentUrl ? (
                      <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                        UPLOADED
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400/70 border border-amber-500/20 text-[9px]">
                        NOT CONFIGURED
                      </span>
                    )}
                  </div>
                  {currentUrl && (
                    <a
                      href={currentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FFAA00] hover:underline text-[10px] truncate block max-w-md"
                    >
                      {currentUrl}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={(el) => {
                      fileInputs.current[code] = el;
                    }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadCv(code, file);
                      e.target.value = "";
                    }}
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                  />

                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputs.current[code]?.click()}
                    className="px-3 py-1.5 bg-white/10 hover:bg-[#FFAA00] hover:text-black border border-white/15 text-white font-bold text-[10px] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>UPLOADING ({progress}%)...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3 h-3" />
                        <span>{currentUrl ? "REPLACE CV" : "UPLOAD CV (.PDF / .DOCX)"}</span>
                      </>
                    )}
                  </button>

                  {currentUrl && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCv(code)}
                      className="p-1.5 text-white/40 hover:text-red-400 border border-white/10 hover:border-red-500/40 transition-colors cursor-pointer"
                      title="Remove CV"
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

      {/* Global Fallback & CTA Label */}
      <div className="border border-white/10 p-3 sm:p-4 bg-[#080808] space-y-3 font-mono text-xs">
        <span className="text-white/60 font-bold block text-[11px]">
          CV ACTION BUTTON LABELS & LEGACY FALLBACK
        </span>

        <LocalizedField
          label="CTA BUTTON LABEL"
          value={resume.label}
          onChange={(v) => onChange({ ...resume, label: v })}
          lang={lang}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-white/40 mb-1 text-[10px] uppercase">
              LEGACY FALLBACK CV URL (GLOBAL)
            </label>
            <input
              type="text"
              value={resume.href}
              onChange={(e) => onChange({ ...resume, href: e.target.value })}
              className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
            />
          </div>

          <div>
            <label className="block text-white/40 mb-1 text-[10px] uppercase">
              DOWNLOAD FILENAME
            </label>
            <input
              type="text"
              value={resume.downloadFilename}
              onChange={(e) => onChange({ ...resume, downloadFilename: e.target.value })}
              className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Header Helper ─────────────────────────────────────────────────────

function SectionHeader({
  title,
  tag,
  loading = false,
  saving,
  saved,
  error,
  onSave,
  onRefresh,
}: {
  title: string;
  tag: string;
  loading?: boolean;
  saving: boolean;
  saved: boolean;
  error: string;
  onSave: () => void;
  onRefresh?: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
      <div>
        <div className="font-mono text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <span>{title}</span>
          <span className="text-[#FFAA00] text-xs">{tag}</span>
        </div>
        {error && (
          <div className="flex items-center gap-1.5 mt-1 text-amber-400 font-mono text-[10px] sm:text-xs">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="p-2 border border-white/15 text-white/60 hover:text-white hover:border-[#FFAA00] transition-colors cursor-pointer"
            title="Reload from Atlas"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#FFAA00]" : ""}`} />
          </button>
        )}

        {saved && (
          <span className="inline-flex items-center gap-1 font-mono text-xs text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SAVED TO ATLAS</span>
            <span className="sm:hidden">SAVED</span>
          </span>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#FFAA00] hover:bg-[#ffbe33] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider px-4 sm:px-6 py-2.5 transition-all duration-150 cursor-pointer active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>SYNCING...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>COMMIT CHANGES</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Accordion({
  open,
  onToggle,
  label,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-white/10 bg-[#050505]">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3.5 sm:px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/80 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
      >
        <span className="truncate">{label}</span>
        {open ? <ChevronUp className="w-4 h-4 text-[#FFAA00] shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
      </button>
      {open && <div className="p-3 sm:p-5 border-t border-white/10 bg-[#070707]">{children}</div>}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

interface AdminContentEditorProps {
  currentLanguage: string;
  onLanguageChange?: (lang: string) => void;
  languages?: LanguageItem[];
  activeSection: AdminContentSection;
  adminEmail: string;
}

export function AdminContentEditor({
  currentLanguage,
  onLanguageChange,
  languages = [],
  activeSection,
}: AdminContentEditorProps) {
  const lang = currentLanguage.toLowerCase();
  const activeLangs = languages.filter((l) => l.isActive);

  return (
    <div className="flex-1 bg-[#050505] p-3 sm:p-6 lg:p-8 overflow-y-auto max-w-5xl w-full mx-auto space-y-6">
      {/* Dynamic language selection tabs bar */}
      <div className="border border-white/10 bg-[#080808] p-3 sm:p-4 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFAA00] animate-pulse shrink-0" />
            <span className="font-mono text-xs text-white">
              Editing Locale: <strong className="text-[#FFAA00] font-bold">[{currentLanguage}]</strong>
            </span>
          </div>
          <span className="text-white/40 text-[10px] font-mono">
            DYNAMIC MULTI-LOCALE CMS // MONGO ATLAS
          </span>
        </div>

        {/* Quick Locale Pills */}
        {activeLangs.length > 0 && onLanguageChange && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5">
            <span className="font-mono text-[9px] text-white/40 uppercase mr-1">SWITCH:</span>
            {activeLangs.map((l) => {
              const isSelected = l.code.toUpperCase() === currentLanguage.toUpperCase();
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => onLanguageChange(l.code.toUpperCase())}
                  className={`flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FFAA00] text-black"
                      : "border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/30"
                  }`}
                >
                  <span className="text-xs">{l.flag}</span>
                  <span>{l.code.toUpperCase()}</span>
                  <span className="text-[9px] opacity-70">({l.name})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {activeSection === "hero" && <HeroEditor lang={lang} />}
      {activeSection === "about" && <ProfileEditor lang={lang} languages={languages} />}
      {activeSection === "projects" && <AdminProjectsManager lang={lang} languages={languages} />}
      {activeSection === "contact" && <ContactEditor lang={lang} />}
    </div>
  );
}
