"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { AdminContentSection } from "./AdminSidebar";
import { defaultHeroContent } from "@/frontend/lib/heroContent";
import { defaultProfileContent } from "@/frontend/lib/profileContent";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Localized {
  fr: string;
  en: string;
}

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
  lang: "fr" | "en";
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

function HeroEditor({ lang }: { lang: "fr" | "en" }) {
  const [data, setData] = useState<HeroData>(INITIAL_HERO);
  const [loading, setLoading] = useState(true);
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

function ProfileEditor({ lang }: { lang: "fr" | "en" }) {
  const [data, setData] = useState<ProfileData>(INITIAL_PROFILE);
  const [loading, setLoading] = useState(true);
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
            <div>
              <label className="block font-mono text-[10px] sm:text-xs uppercase text-white/40 mb-1.5">PROFILE IMAGE URL</label>
              <input
                type="text"
                value={data.identity.profileImage}
                onChange={(e) => setData({ ...data, identity: { ...data.identity, profileImage: e.target.value } })}
                className="w-full bg-[#080808] border border-white/15 focus:border-[#FFAA00] text-white font-mono text-xs sm:text-sm px-3.5 py-2.5 outline-none"
              />
            </div>
          </div>

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
    </div>
  );
}

// ─── Contact Editor ───────────────────────────────────────────────────────────

function ContactEditor({ lang }: { lang: "fr" | "en" }) {
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

// ─── Projects Editor ──────────────────────────────────────────────────────────

function ProjectsEditor({ lang }: { lang: "fr" | "en" }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/content/projects");
      if (!res.ok) throw new Error(`HTTP_${res.status}`);
      const json = await res.json();
      setProjects(json.projects || []);
    } catch {
      setError("Could not load projects from Atlas. Ready to retry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="font-mono text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span>Projects / Evidence</span>
            <span className="text-[#FFAA00] text-xs">[PROJECT_EVIDENCE]</span>
          </div>
          <p className="font-mono text-[10px] sm:text-xs text-white/40 mt-0.5">
            {projects.length} PROJECT(S) CONFIGURED IN MONGODB ATLAS
          </p>
        </div>

        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 border border-white/15 px-3 py-1.5 font-mono text-xs text-white/60 hover:text-white hover:border-[#FFAA00] transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#FFAA00]" : ""}`} />
          <span>REFRESH</span>
        </button>
      </div>

      {error && (
        <div className="border border-amber-500/30 bg-amber-950/20 p-3 font-mono text-xs text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {projects.map((proj, i) => (
          <div key={proj._id || i} className="border border-white/10 bg-[#080808] p-3.5 sm:p-5 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#FFAA00] font-bold">{proj.metadata?.evidenceId || `PROJ ${i + 1}`}</span>
                <span className={`font-mono text-[9px] px-2 py-0.5 ${proj.published ? "bg-emerald-900/40 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-white/40 border border-white/10"}`}>
                  {proj.published ? "PUBLISHED" : "DRAFT"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const n = [...projects];
                  n[i] = { ...n[i], published: !n[i].published };
                  setProjects(n);
                }}
                className="font-mono text-[10px] text-white/50 hover:text-[#FFAA00] transition-colors cursor-pointer border border-white/10 px-2 py-1"
              >
                TOGGLE PUBLISH
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] uppercase text-white/40 mb-1">TITLE ({lang.toUpperCase()})</label>
                <input
                  type="text"
                  value={proj.title?.[lang] || ""}
                  onChange={(e) => { const n = [...projects]; n[i] = { ...n[i], title: { ...n[i].title, [lang]: e.target.value } }; setProjects(n); }}
                  className="w-full bg-black border border-white/15 focus:border-[#FFAA00] text-white font-mono text-xs px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase text-white/40 mb-1">CLIENT / DOMAIN</label>
                <input
                  type="text"
                  value={proj.metadata?.client || ""}
                  onChange={(e) => { const n = [...projects]; n[i] = { ...n[i], metadata: { ...n[i].metadata, client: e.target.value } }; setProjects(n); }}
                  className="w-full bg-black border border-white/15 focus:border-[#FFAA00] text-white font-mono text-xs px-3 py-2 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-white/40 mb-1">SHORT DESCRIPTION ({lang.toUpperCase()})</label>
              <textarea
                rows={2}
                value={proj.shortDescription?.[lang] || ""}
                onChange={(e) => { const n = [...projects]; n[i] = { ...n[i], shortDescription: { ...n[i].shortDescription, [lang]: e.target.value } }; setProjects(n); }}
                className="w-full bg-black border border-white/15 focus:border-[#FFAA00] text-white font-mono text-xs px-3 py-2 outline-none resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
              <div className="flex flex-wrap gap-1">
                {(proj.technologies || []).slice(0, 4).map((t: any, ti: number) => (
                  <span key={ti} className="font-mono text-[9px] border border-white/10 px-1.5 py-0.5 text-white/50">{t.name}</span>
                ))}
              </div>

              <button
                type="button"
                disabled={saving === proj._id}
                onClick={async () => {
                  setSaving(proj._id);
                  try {
                    await fetch(`/api/admin/content/projects/${proj._id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(proj),
                    });
                  } catch {
                    setError("Project save failed");
                  } finally {
                    setSaving(null);
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#FFAA00] hover:bg-[#ffbe33] text-[#050505] font-mono text-xs font-bold uppercase px-4 py-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {saving === proj._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>COMMIT PROJECT</span>
              </button>
            </div>
          </div>
        ))}
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
  currentLanguage: "FR" | "EN";
  activeSection: AdminContentSection;
  adminEmail: string;
}

export function AdminContentEditor({ currentLanguage, activeSection }: AdminContentEditorProps) {
  const lang = currentLanguage.toLowerCase() as "fr" | "en";

  return (
    <div className="flex-1 bg-[#050505] p-3 sm:p-6 lg:p-8 overflow-y-auto max-w-5xl w-full mx-auto">
      {/* Dynamic language indicator pill */}
      <div className="flex items-center justify-between border border-white/10 bg-[#080808] px-3 py-2 font-mono text-[10px] sm:text-xs text-white/60 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFAA00] animate-pulse shrink-0" />
          <span>Active Language: <strong className="text-[#FFAA00]">{currentLanguage}</strong></span>
        </div>
        <span className="text-white/40 text-[9px] hidden sm:inline">DUAL-LOCALE MONGODB ATLAS CMS</span>
      </div>

      {activeSection === "hero" && <HeroEditor lang={lang} />}
      {activeSection === "about" && <ProfileEditor lang={lang} />}
      {activeSection === "projects" && <ProjectsEditor lang={lang} />}
      {activeSection === "contact" && <ContactEditor lang={lang} />}
    </div>
  );
}
