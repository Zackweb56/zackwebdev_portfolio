"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  UploadCloud,
  Layers,
  Calendar,
  Image as ImageIcon,
  Code2,
  BookOpen,
  Sliders,
  Check,
  X,
  Eye,
  EyeOff,
  Sparkles,
  ArrowUpDown,
  Tag,
} from "lucide-react";
import { uploadToCloudinary } from "@/frontend/lib/cloudinaryUpload";
import { LanguageItem } from "@/shared/constants/languages";

export type Localized = Record<string, string>;

export interface TechItem {
  name: string;
  category: "frontend" | "backend" | "database" | "tools" | "other";
  icon?: string;
  highlight?: boolean;
}

export interface GalleryItem {
  src: string;
  alt: Localized;
  caption: Localized;
}

export interface ProjectFormData {
  _id?: string;
  projectId: string;
  slug: string;
  title: Localized;
  shortTitle: Localized;
  category: "enterprise" | "system" | "web" | "other";
  status: "completed" | "in-progress" | "concept";
  published: boolean;
  shortDescription: Localized;
  fullDescription: Localized;
  thumbnailSrc: string;
  thumbnailAlt: Localized;
  gallery: GalleryItem[];
  tags: string[];
  technologies: TechItem[];
  links: {
    github: string;
    live: string;
    demo: string;
  };
  caseStudy: {
    overview: Localized;
    problem: Localized;
    solution: Localized;
    role: Localized;
    duration: Localized;
    architectureHighlights: string[];
    keyFeatures: string[];
    results: Localized;
    techStack: Localized;
    challenges: Localized;
    learnings: Localized;
  };
  metadata: {
    evidenceId: string;
    year: string;
    duration: string;
    client: string;
    featured: boolean;
    order: number;
  };
}

const EMPTY_PROJECT: ProjectFormData = {
  projectId: "",
  slug: "",
  title: { en: "", fr: "" },
  shortTitle: { en: "", fr: "" },
  category: "web",
  status: "completed",
  published: true,
  shortDescription: { en: "", fr: "" },
  fullDescription: { en: "", fr: "" },
  thumbnailSrc: "",
  thumbnailAlt: { en: "", fr: "" },
  gallery: [],
  tags: [],
  technologies: [],
  links: { github: "", live: "", demo: "" },
  caseStudy: {
    overview: { en: "", fr: "" },
    problem: { en: "", fr: "" },
    solution: { en: "", fr: "" },
    role: { en: "", fr: "" },
    duration: { en: "", fr: "" },
    architectureHighlights: [],
    keyFeatures: [],
    results: { en: "", fr: "" },
    techStack: { en: "", fr: "" },
    challenges: { en: "", fr: "" },
    learnings: { en: "", fr: "" },
  },
  metadata: {
    evidenceId: "EVIDENCE // 01",
    year: "2026",
    duration: "4 months",
    client: "",
    featured: false,
    order: 1,
  },
};

const CATEGORY_COLORS: Record<string, { badge: string; dot: string }> = {
  frontend: { badge: "border-blue-500/30 bg-blue-500/10 text-blue-400", dot: "bg-blue-400" },
  backend: { badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400", dot: "bg-emerald-400" },
  database: { badge: "border-amber-500/30 bg-amber-500/10 text-amber-400", dot: "bg-amber-400" },
  tools: { badge: "border-purple-500/30 bg-purple-500/10 text-purple-400", dot: "bg-purple-400" },
  other: { badge: "border-white/10 bg-white/5 text-white/70", dot: "bg-white/40" },
};

export function AdminProjectsManager({
  lang,
  languages = [],
}: {
  lang: string;
  languages?: LanguageItem[];
}) {
  const [projects, setProjects] = useState<ProjectFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "identity" | "timeline" | "media" | "stack" | "casestudy" | "metadata"
  >("identity");

  // Filter / Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Editing state
  const [editingProject, setEditingProject] = useState<ProjectFormData | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Deletion modal state
  const [projectToDelete, setProjectToDelete] = useState<ProjectFormData | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Upload state
  const [thumbUploading, setThumbUploading] = useState(false);
  const [thumbProgress, setThumbProgress] = useState(0);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Tag input state
  const [tagInput, setTagInput] = useState("");

  // Tech item addition state
  const [newTech, setNewTech] = useState<TechItem>({
    name: "",
    category: "backend",
    icon: "",
    highlight: false,
  });

  const activeCodes = useMemo(() => {
    if (languages.length > 0) {
      return languages.filter((l) => l.isActive).map((l) => l.code.toLowerCase());
    }
    return ["en", "fr"];
  }, [languages]);

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/content/projects");
      if (!res.ok) throw new Error(`HTTP_${res.status}`);
      const json = await res.json();
      setProjects(json.projects || []);
    } catch {
      setError("Failed to fetch projects from MongoDB Atlas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const titleMatch =
        (p.title?.[lang] || p.title?.en || p.slug || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        p.projectId.toLowerCase().includes(searchQuery.toLowerCase());
      const catMatch = filterCategory === "all" || p.category === filterCategory;
      const statusMatch = filterStatus === "all" || p.status === filterStatus;
      return titleMatch && catMatch && statusMatch;
    });
  }, [projects, searchQuery, filterCategory, filterStatus, lang]);

  const handleOpenCreate = () => {
    const nextOrder = projects.length + 1;
    const generatedId = `proj-${Date.now().toString(36)}`;
    setEditingProject({
      ...EMPTY_PROJECT,
      projectId: generatedId,
      metadata: { ...EMPTY_PROJECT.metadata, order: nextOrder },
    });
    setIsCreatingNew(true);
    setActiveTab("identity");
    setSaveError("");
    setSaveSuccess(false);
  };

  const handleOpenEdit = (proj: ProjectFormData) => {
    setEditingProject(JSON.parse(JSON.stringify(proj)));
    setIsCreatingNew(false);
    setActiveTab("identity");
    setSaveError("");
    setSaveSuccess(false);
  };

  const handleCloseEditor = () => {
    setEditingProject(null);
    setIsCreatingNew(false);
    setSaveError("");
    setSaveSuccess(false);
  };

  // Quick published toggle
  const handleTogglePublished = async (proj: ProjectFormData) => {
    const nextPublished = !proj.published;
    const targetId = proj._id || proj.projectId;
    try {
      const res = await fetch(`/api/admin/content/projects/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: nextPublished }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) =>
            (p._id && p._id === proj._id) || p.projectId === proj.projectId
              ? { ...p, published: nextPublished }
              : p
          )
        );
      }
    } catch (e) {
      console.error("Toggle publish failed", e);
    }
  };

  // Commit changes (Save / Create)
  const handleSaveProject = async () => {
    if (!editingProject) return;
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    // Auto slug if empty
    let slug = editingProject.slug.trim();
    if (!slug) {
      const fallbackTitle = editingProject.title?.[lang] || editingProject.title?.en || "";
      slug = fallbackTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      if (!slug) slug = `project-${Date.now().toString(36)}`;
      editingProject.slug = slug;
    }

    try {
      const targetId = editingProject._id || editingProject.projectId;
      const url = isCreatingNew
        ? "/api/admin/content/projects"
        : `/api/admin/content/projects/${targetId}`;
      const method = isCreatingNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save project");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      await fetchProjects();
      if (isCreatingNew && json.project) {
        setEditingProject(json.project);
        setIsCreatingNew(false);
      }
    } catch (e: any) {
      setSaveError(e.message || "An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  // Delete project
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setDeleting(true);
    try {
      const targetId = projectToDelete._id || projectToDelete.projectId;
      const res = await fetch(`/api/admin/content/projects/${targetId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to delete project");
      }
      setProjects((prev) =>
        prev.filter((p) => p._id !== projectToDelete._id && p.projectId !== projectToDelete.projectId)
      );
      if (editingProject && (editingProject._id === projectToDelete._id || editingProject.projectId === projectToDelete.projectId)) {
        setEditingProject(null);
      }
      setProjectToDelete(null);
    } catch (e: any) {
      alert("Delete failed: " + e.message);
    } finally {
      setDeleting(false);
    }
  };

  // Thumbnail upload
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      alert("Please upload a valid image (JPEG, PNG, WebP, AVIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size exceeds 5MB limit.");
      return;
    }

    setThumbUploading(true);
    setThumbProgress(0);
    try {
      const { secureUrl } = await uploadToCloudinary(file, "portfolio/projects", (p) =>
        setThumbProgress(p)
      );
      setEditingProject({
        ...editingProject,
        thumbnailSrc: secureUrl,
      });
    } catch (err: any) {
      alert("Thumbnail upload failed: " + err.message);
    } finally {
      setThumbUploading(false);
      if (thumbInputRef.current) thumbInputRef.current.value = "";
    }
  };

  // Gallery item upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      alert("Please upload a valid image (JPEG, PNG, WebP, AVIF).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert("Image size exceeds 8MB limit.");
      return;
    }

    setGalleryUploading(true);
    try {
      const { secureUrl } = await uploadToCloudinary(file, "portfolio/projects");
      const newGalleryItem: GalleryItem = {
        src: secureUrl,
        alt: { en: "", fr: "" },
        caption: { en: "", fr: "" },
      };
      setEditingProject({
        ...editingProject,
        gallery: [...(editingProject.gallery || []), newGalleryItem],
      });
    } catch (err: any) {
      alert("Gallery upload failed: " + err.message);
    } finally {
      setGalleryUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  // Helper for localized fields
  const updateLocField = (
    fieldPath: string,
    subLocale: string,
    val: string
  ) => {
    if (!editingProject) return;
    const parts = fieldPath.split(".");
    const updated = { ...editingProject };
    let cur: any = updated;
    for (let i = 0; i < parts.length - 1; i++) {
      cur = cur[parts[i]];
    }
    const last = parts[parts.length - 1];
    cur[last] = { ...(cur[last] || {}), [subLocale]: val };
    setEditingProject(updated);
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="font-mono text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span>Project Management Suite</span>
            <span className="text-[#FFAA00] text-xs">[EVIDENCE_CORE]</span>
          </div>
          <p className="font-mono text-[10px] sm:text-xs text-white/40 mt-0.5">
            {projects.length} PROJECT(S) RECORDED // ATLAS PERSISTENCE ACTIVE
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchProjects}
            disabled={loading}
            className="inline-flex items-center gap-1.5 border border-white/15 px-3 py-1.5 font-mono text-xs text-white/60 hover:text-white hover:border-[#FFAA00] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#FFAA00]" : ""}`} />
            <span>SYNC</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 bg-[#FFAA00] text-black font-mono text-xs font-bold px-3.5 py-1.5 hover:bg-[#ffb726] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NEW PROJECT</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="border border-amber-500/30 bg-amber-950/20 p-3 font-mono text-xs text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Master Project Editor Modal / Workspace ── */}
      {editingProject && (
        <div className="border-2 border-[#FFAA00]/60 bg-[#080808] p-4 sm:p-6 shadow-2xl relative space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="font-mono text-xs sm:text-sm font-bold text-[#FFAA00] flex items-center gap-2">
                <span>{isCreatingNew ? "[CREATE // NEW PROJECT]" : `[EDIT // ${editingProject.slug || editingProject.projectId}]`}</span>
              </div>
              <p className="font-mono text-[11px] text-white/40 mt-0.5">
                DATABASE KEY: {editingProject.projectId}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveProject}
                disabled={saving}
                className="inline-flex items-center gap-1.5 bg-[#FFAA00] text-black font-mono text-xs font-bold px-4 py-2 hover:bg-[#ffb726] transition-colors cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>{saving ? "COMMITTING..." : "COMMIT PROJECT"}</span>
              </button>

              <button
                type="button"
                onClick={handleCloseEditor}
                className="p-2 border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition-colors"
                title="Close editor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {saveError && (
            <div className="border border-red-500/40 bg-red-950/30 p-3 font-mono text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="border border-emerald-500/40 bg-emerald-950/30 p-3 font-mono text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Project committed successfully to MongoDB.</span>
            </div>
          )}

          {/* Tab Navigation (6 Sections) */}
          <div className="flex items-center gap-1 border-b border-white/10 overflow-x-auto pb-1 select-none">
            {[
              { id: "identity", label: "01. IDENTITY", icon: Sliders },
              { id: "timeline", label: "02. TIMELINE", icon: Calendar },
              { id: "media", label: "03. MEDIA", icon: ImageIcon },
              { id: "stack", label: "04. TAGS & STACK", icon: Code2 },
              { id: "casestudy", label: "05. CASE STUDY", icon: BookOpen },
              { id: "metadata", label: "06. LINKS & META", icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 font-mono text-[11px] font-bold uppercase transition-colors shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#FFAA00] text-black"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: IDENTITY */}
          {activeTab === "identity" && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/40 mb-1 uppercase text-[10px]">
                    PROJECT ID (DATABASE KEY)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingProject.projectId}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, projectId: e.target.value })
                      }
                      className="flex-1 bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditingProject({
                          ...editingProject,
                          projectId: `proj-${Date.now().toString(36)}`,
                        })
                      }
                      className="px-2.5 py-2 border border-white/10 text-white/60 hover:text-white text-[10px]"
                    >
                      GEN
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white/40 mb-1 uppercase text-[10px]">
                    URL SLUG (UNIQUE ALPHANUMERIC)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingProject.slug}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, slug: e.target.value })
                      }
                      placeholder="e.g. distributed-cloud-engine"
                      className="flex-1 bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const base =
                          editingProject.title?.[lang] || editingProject.title?.en || "";
                        const autoSlug = base
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-+|-+$/g, "");
                        if (autoSlug) {
                          setEditingProject({ ...editingProject, slug: autoSlug });
                        }
                      }}
                      className="px-2.5 py-2 border border-white/10 text-white/60 hover:text-white text-[10px]"
                    >
                      AUTO
                    </button>
                  </div>
                </div>
              </div>

              {/* Localized Titles */}
              <div className="border border-white/10 p-3 bg-black/40 space-y-3">
                <span className="text-[#FFAA00] font-bold text-[11px] block">
                  PRIMARY TITLE (LOCALIZED)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeCodes.map((code) => (
                    <div key={code}>
                      <label className="block text-white/40 mb-1 text-[10px] uppercase">
                        TITLE [{code.toUpperCase()}]
                      </label>
                      <input
                        type="text"
                        value={editingProject.title?.[code] || ""}
                        onChange={(e) => updateLocField("title", code, e.target.value)}
                        className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Localized Short Titles */}
              <div className="border border-white/10 p-3 bg-black/40 space-y-3">
                <span className="text-white/60 font-bold text-[11px] block">
                  SHORT TITLE / ACRONYM (LOCALIZED)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeCodes.map((code) => (
                    <div key={code}>
                      <label className="block text-white/40 mb-1 text-[10px] uppercase">
                        SHORT [{code.toUpperCase()}]
                      </label>
                      <input
                        type="text"
                        value={editingProject.shortTitle?.[code] || ""}
                        onChange={(e) => updateLocField("shortTitle", code, e.target.value)}
                        className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/40 mb-1 uppercase text-[10px]">
                    CATEGORY
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value as any })
                    }
                    className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                  >
                    <option value="enterprise">Enterprise</option>
                    <option value="system">System</option>
                    <option value="web">Web Application</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/40 mb-1 uppercase text-[10px]">
                    STATUS
                  </label>
                  <select
                    value={editingProject.status}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, status: e.target.value as any })
                    }
                    className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="concept">Concept</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/40 mb-1 uppercase text-[10px]">
                    VISIBILITY / PUBLISHED
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProject({
                        ...editingProject,
                        published: !editingProject.published,
                      })
                    }
                    className={`w-full py-2 px-3 border font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      editingProject.published
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : "border-white/15 bg-white/5 text-white/40"
                    }`}
                  >
                    {editingProject.published ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>PUBLISHED (LIVE)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>DRAFT (HIDDEN)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Descriptions */}
              <div className="border border-white/10 p-3 bg-black/40 space-y-3">
                <span className="text-white/60 font-bold text-[11px] block">
                  SHORT CARD DESCRIPTION
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeCodes.map((code) => (
                    <div key={code}>
                      <label className="block text-white/40 mb-1 text-[10px] uppercase">
                        DESC [{code.toUpperCase()}]
                      </label>
                      <textarea
                        rows={2}
                        value={editingProject.shortDescription?.[code] || ""}
                        onChange={(e) =>
                          updateLocField("shortDescription", code, e.target.value)
                        }
                        className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00] resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE */}
          {activeTab === "timeline" && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/40 mb-1 uppercase text-[10px]">
                    PRODUCTION YEAR
                  </label>
                  <input
                    type="text"
                    value={editingProject.metadata.year}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        metadata: { ...editingProject.metadata, year: e.target.value },
                      })
                    }
                    placeholder="2026"
                    className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                  />
                </div>

                <div>
                  <label className="block text-white/40 mb-1 uppercase text-[10px]">
                    DURATION
                  </label>
                  <input
                    type="text"
                    value={editingProject.metadata.duration}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        metadata: { ...editingProject.metadata, duration: e.target.value },
                      })
                    }
                    placeholder="4 months"
                    className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                  />
                </div>

                <div>
                  <label className="block text-white/40 mb-1 uppercase text-[10px]">
                    CLIENT / ORGANIZATION
                  </label>
                  <input
                    type="text"
                    value={editingProject.metadata.client}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        metadata: { ...editingProject.metadata, client: e.target.value },
                      })
                    }
                    placeholder="e.g. Autonomous Org"
                    className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA (Cloudinary) */}
          {activeTab === "media" && (
            <div className="space-y-6 font-mono text-xs">
              {/* Main Thumbnail */}
              <div className="border border-white/10 p-4 bg-black/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#FFAA00] font-bold text-xs uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>PROJECT THUMBNAIL (PRIMARY MEDIA)</span>
                  </span>
                  {editingProject.thumbnailSrc && (
                    <button
                      type="button"
                      onClick={() => setEditingProject({ ...editingProject, thumbnailSrc: "" })}
                      className="text-red-400 hover:text-red-300 text-[10px] flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>REMOVE</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 relative aspect-video bg-black border border-white/15 flex items-center justify-center overflow-hidden">
                    {editingProject.thumbnailSrc ? (
                      <Image
                        src={editingProject.thumbnailSrc}
                        alt="Project Thumbnail"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-white/20 text-[10px]">NO THUMBNAIL</span>
                    )}
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <input
                      type="file"
                      ref={thumbInputRef}
                      onChange={handleThumbnailUpload}
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => thumbInputRef.current?.click()}
                      disabled={thumbUploading}
                      className="w-full border border-dashed border-[#FFAA00]/40 bg-[#FFAA00]/5 hover:bg-[#FFAA00]/10 text-[#FFAA00] py-3 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      {thumbUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>UPLOADING TO CLOUDINARY ({thumbProgress}%)...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          <span>UPLOAD THUMBNAIL VIA CLOUDINARY (MAX 5MB)</span>
                        </>
                      )}
                    </button>

                    <div>
                      <label className="block text-white/40 mb-1 text-[10px] uppercase">
                        DIRECT URL OVERRIDE
                      </label>
                      <input
                        type="text"
                        value={editingProject.thumbnailSrc}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, thumbnailSrc: e.target.value })
                        }
                        placeholder="https://res.cloudinary.com/..."
                        className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00] text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Localized Alt Text */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  {activeCodes.map((code) => (
                    <div key={code}>
                      <label className="block text-white/40 mb-1 text-[10px] uppercase">
                        THUMBNAIL ALT [{code.toUpperCase()}]
                      </label>
                      <input
                        type="text"
                        value={editingProject.thumbnailAlt?.[code] || ""}
                        onChange={(e) => updateLocField("thumbnailAlt", code, e.target.value)}
                        placeholder="Descriptive image alt..."
                        className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery Multi-Uploader */}
              <div className="border border-white/10 p-4 bg-black/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white/80 font-bold text-xs uppercase block">
                      PROJECT GALLERY (MODAL SLIDES / CAROUSEL)
                    </span>
                    <span className="text-white/30 text-[10px]">
                      {editingProject.gallery?.length || 0} ASSET(S) IN GALLERY
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={galleryInputRef}
                    onChange={handleGalleryUpload}
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={galleryUploading}
                    className="border border-white/15 px-3 py-1.5 text-xs text-[#FFAA00] hover:border-[#FFAA00] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {galleryUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    <span>ADD GALLERY IMAGE</span>
                  </button>
                </div>

                {editingProject.gallery && editingProject.gallery.length > 0 ? (
                  <div className="space-y-3">
                    {editingProject.gallery.map((item, idx) => (
                      <div
                        key={idx}
                        className="border border-white/10 bg-black p-3 flex flex-col md:flex-row gap-3 items-start"
                      >
                        <div className="relative w-28 aspect-video bg-white/5 border border-white/10 shrink-0 overflow-hidden">
                          {item.src && (
                            <Image
                              src={item.src}
                              alt="Gallery item"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                          <input
                            type="text"
                            value={item.caption?.en || ""}
                            onChange={(e) => {
                              const nextGallery = [...editingProject.gallery];
                              nextGallery[idx].caption = {
                                ...(nextGallery[idx].caption || {}),
                                en: e.target.value,
                              };
                              setEditingProject({ ...editingProject, gallery: nextGallery });
                            }}
                            placeholder="Caption (EN)"
                            className="bg-black border border-white/15 px-2.5 py-1.5 text-white outline-none focus:border-[#FFAA00] text-[11px]"
                          />
                          <input
                            type="text"
                            value={item.caption?.fr || ""}
                            onChange={(e) => {
                              const nextGallery = [...editingProject.gallery];
                              nextGallery[idx].caption = {
                                ...(nextGallery[idx].caption || {}),
                                fr: e.target.value,
                              };
                              setEditingProject({ ...editingProject, gallery: nextGallery });
                            }}
                            placeholder="Légende (FR)"
                            className="bg-black border border-white/15 px-2.5 py-1.5 text-white outline-none focus:border-[#FFAA00] text-[11px]"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const nextGallery = editingProject.gallery.filter(
                              (_, i) => i !== idx
                            );
                            setEditingProject({ ...editingProject, gallery: nextGallery });
                          }}
                          className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/20 text-center py-4 border border-dashed border-white/10 text-[11px]">
                    No gallery images yet. Click &quot;ADD GALLERY IMAGE&quot; to upload screenshots.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: TAGS & STACK */}
          {activeTab === "stack" && (
            <div className="space-y-6 font-mono text-xs">
              {/* Tags Section */}
              <div className="border border-white/10 p-4 bg-black/40 space-y-3">
                <span className="text-[#FFAA00] font-bold text-xs uppercase flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>PROJECT TAGS (FILTER PILLS)</span>
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {editingProject.tags?.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/15 text-white/80 rounded-xs text-[11px]"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProject({
                            ...editingProject,
                            tags: editingProject.tags.filter((_, i) => i !== idx),
                          })
                        }
                        className="hover:text-red-400 text-white/40"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (tagInput.trim()) {
                          setEditingProject({
                            ...editingProject,
                            tags: [...(editingProject.tags || []), tagInput.trim()],
                          });
                          setTagInput("");
                        }
                      }
                    }}
                    placeholder="Type tag and press Enter (e.g. Distributed, Microservices)..."
                    className="flex-1 bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tagInput.trim()) {
                        setEditingProject({
                          ...editingProject,
                          tags: [...(editingProject.tags || []), tagInput.trim()],
                        });
                        setTagInput("");
                      }
                    }}
                    className="px-3 py-2 bg-white/10 hover:bg-[#FFAA00] hover:text-black transition-colors"
                  >
                    ADD
                  </button>
                </div>
              </div>

              {/* Technologies Stack Builder */}
              <div className="border border-white/10 p-4 bg-black/40 space-y-4">
                <span className="text-[#FFAA00] font-bold text-xs uppercase flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>TECHNOLOGY STACK (CATEGORY COLOR-CODED)</span>
                </span>

                {/* Existing Technologies List */}
                <div className="space-y-2">
                  {editingProject.technologies?.map((tech, idx) => {
                    const theme = CATEGORY_COLORS[tech.category] || CATEGORY_COLORS.other;
                    return (
                      <div
                        key={idx}
                        className="border border-white/10 bg-black p-2.5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 border font-mono text-[10px] rounded-xs ${theme.badge}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                            <span className="font-bold">{tech.category.toUpperCase()}</span>
                          </span>
                          <span className="text-white font-bold text-xs">{tech.name}</span>
                          {tech.icon && (
                            <span className="text-white/40 text-[10px]">[{tech.icon}]</span>
                          )}
                          {tech.highlight && (
                            <span className="text-[#FFAA00] text-[10px] border border-[#FFAA00]/30 px-1">
                              HIGHLIGHT
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const nextTech = [...editingProject.technologies];
                              nextTech[idx].highlight = !nextTech[idx].highlight;
                              setEditingProject({
                                ...editingProject,
                                technologies: nextTech,
                              });
                            }}
                            className="text-[10px] text-white/50 hover:text-white border border-white/10 px-2 py-1"
                          >
                            {tech.highlight ? "UNSTAR" : "STAR"}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const nextTech = editingProject.technologies.filter(
                                (_, i) => i !== idx
                              );
                              setEditingProject({
                                ...editingProject,
                                technologies: nextTech,
                              });
                            }}
                            className="p-1 text-white/40 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Tech Tool */}
                <div className="border-t border-white/10 pt-3 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    value={newTech.name}
                    onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                    placeholder="Tech Name (e.g. Next.js 16)"
                    className="sm:col-span-4 bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                  />

                  <select
                    value={newTech.category}
                    onChange={(e) =>
                      setNewTech({ ...newTech, category: e.target.value as any })
                    }
                    className="sm:col-span-3 bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                  >
                    <option value="frontend">Frontend (Blue)</option>
                    <option value="backend">Backend (Green)</option>
                    <option value="database">Database (Amber)</option>
                    <option value="tools">Tools (Purple)</option>
                    <option value="other">Other (Gray)</option>
                  </select>

                  <input
                    type="text"
                    value={newTech.icon || ""}
                    onChange={(e) => setNewTech({ ...newTech, icon: e.target.value })}
                    placeholder="Icon Slug (opt)"
                    className="sm:col-span-2 bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                  />

                  <label className="sm:col-span-2 flex items-center gap-1.5 text-white/60 text-[10px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newTech.highlight}
                      onChange={(e) =>
                        setNewTech({ ...newTech, highlight: e.target.checked })
                      }
                      className="accent-[#FFAA00]"
                    />
                    <span>HIGHLIGHT</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      if (newTech.name.trim()) {
                        setEditingProject({
                          ...editingProject,
                          technologies: [
                            ...(editingProject.technologies || []),
                            { ...newTech, name: newTech.name.trim() },
                          ],
                        });
                        setNewTech({
                          name: "",
                          category: newTech.category,
                          icon: "",
                          highlight: false,
                        });
                      }
                    }}
                    className="sm:col-span-1 py-2 bg-[#FFAA00] text-black font-bold flex items-center justify-center hover:bg-[#ffb726] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ENGINEERING DEEP-DIVE (CASE STUDY) */}
          {activeTab === "casestudy" && (
            <div className="space-y-6 font-mono text-xs">
              <div className="border border-white/10 p-4 bg-black/40 space-y-4">
                <span className="text-[#FFAA00] font-bold text-xs uppercase flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>CASE STUDY // SYSTEM NARRATIVES</span>
                </span>

                {/* Problem & Solution */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-white/80 font-bold block text-[11px]">PROBLEM STATEMENT</span>
                    {activeCodes.map((c) => (
                      <textarea
                        key={c}
                        rows={3}
                        value={editingProject.caseStudy?.problem?.[c] || ""}
                        onChange={(e) => updateLocField("caseStudy.problem", c, e.target.value)}
                        placeholder={`Problem description [${c.toUpperCase()}]...`}
                        className="w-full bg-black border border-white/15 p-2.5 text-white outline-none focus:border-[#FFAA00] resize-none"
                      />
                    ))}
                  </div>

                  <div className="space-y-2">
                    <span className="text-white/80 font-bold block text-[11px]">ARCHITECTURAL SOLUTION</span>
                    {activeCodes.map((c) => (
                      <textarea
                        key={c}
                        rows={3}
                        value={editingProject.caseStudy?.solution?.[c] || ""}
                        onChange={(e) => updateLocField("caseStudy.solution", c, e.target.value)}
                        placeholder={`Solution description [${c.toUpperCase()}]...`}
                        className="w-full bg-black border border-white/15 p-2.5 text-white outline-none focus:border-[#FFAA00] resize-none"
                      />
                    ))}
                  </div>
                </div>

                {/* Challenges & Learnings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="space-y-2">
                    <span className="text-white/80 font-bold block text-[11px]">TECHNICAL CHALLENGES</span>
                    {activeCodes.map((c) => (
                      <textarea
                        key={c}
                        rows={3}
                        value={editingProject.caseStudy?.challenges?.[c] || ""}
                        onChange={(e) => updateLocField("caseStudy.challenges", c, e.target.value)}
                        placeholder={`Engineering challenges faced [${c.toUpperCase()}]...`}
                        className="w-full bg-black border border-white/15 p-2.5 text-white outline-none focus:border-[#FFAA00] resize-none"
                      />
                    ))}
                  </div>

                  <div className="space-y-2">
                    <span className="text-white/80 font-bold block text-[11px]">KEY TAKEAWAYS & LEARNINGS</span>
                    {activeCodes.map((c) => (
                      <textarea
                        key={c}
                        rows={3}
                        value={editingProject.caseStudy?.learnings?.[c] || ""}
                        onChange={(e) => updateLocField("caseStudy.learnings", c, e.target.value)}
                        placeholder={`Lessons learned [${c.toUpperCase()}]...`}
                        className="w-full bg-black border border-white/15 p-2.5 text-white outline-none focus:border-[#FFAA00] resize-none"
                      />
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <span className="text-white/80 font-bold block text-[11px]">MEASURABLE RESULTS / METRICS</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeCodes.map((c) => (
                      <textarea
                        key={c}
                        rows={2}
                        value={editingProject.caseStudy?.results?.[c] || ""}
                        onChange={(e) => updateLocField("caseStudy.results", c, e.target.value)}
                        placeholder={`e.g. 99.99% uptime, 4x lower latency [${c.toUpperCase()}]...`}
                        className="w-full bg-black border border-white/15 p-2.5 text-white outline-none focus:border-[#FFAA00] resize-none"
                      />
                    ))}
                  </div>
                </div>

                {/* Highlights List */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <span className="text-white/80 font-bold block text-[11px]">
                    ARCHITECTURE HIGHLIGHTS (KEY BULLETS)
                  </span>
                  <div className="space-y-2">
                    {editingProject.caseStudy?.architectureHighlights?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const next = [...(editingProject.caseStudy.architectureHighlights || [])];
                            next[idx] = e.target.value;
                            setEditingProject({
                              ...editingProject,
                              caseStudy: {
                                ...editingProject.caseStudy,
                                architectureHighlights: next,
                              },
                            });
                          }}
                          className="flex-1 bg-black border border-white/15 px-3 py-1.5 text-white outline-none focus:border-[#FFAA00]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = editingProject.caseStudy.architectureHighlights.filter(
                              (_, i) => i !== idx
                            );
                            setEditingProject({
                              ...editingProject,
                              caseStudy: {
                                ...editingProject.caseStudy,
                                architectureHighlights: next,
                              },
                            });
                          }}
                          className="p-1.5 text-white/40 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setEditingProject({
                          ...editingProject,
                          caseStudy: {
                            ...editingProject.caseStudy,
                            architectureHighlights: [
                              ...(editingProject.caseStudy?.architectureHighlights || []),
                              "",
                            ],
                          },
                        })
                      }
                      className="text-[#FFAA00] hover:underline text-[11px] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>ADD ARCHITECTURE HIGHLIGHT</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: METADATA & LINKS */}
          {activeTab === "metadata" && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/40 mb-1 uppercase text-[10px]">
                    EVIDENCE IDENTIFIER
                  </label>
                  <input
                    type="text"
                    value={editingProject.metadata.evidenceId}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        metadata: { ...editingProject.metadata, evidenceId: e.target.value },
                      })
                    }
                    placeholder="EVIDENCE // 01"
                    className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                  />
                </div>

                <div>
                  <label className="block text-white/40 mb-1 uppercase text-[10px]">
                    DISPLAY ORDER (ASCENDING)
                  </label>
                  <input
                    type="number"
                    value={editingProject.metadata.order}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        metadata: {
                          ...editingProject.metadata,
                          order: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                  />
                </div>

                <div>
                  <label className="block text-white/40 mb-1 uppercase text-[10px]">
                    FEATURED PROJECT
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProject({
                        ...editingProject,
                        metadata: {
                          ...editingProject.metadata,
                          featured: !editingProject.metadata.featured,
                        },
                      })
                    }
                    className={`w-full py-2 px-3 border font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      editingProject.metadata.featured
                        ? "border-[#FFAA00] bg-[#FFAA00]/10 text-[#FFAA00]"
                        : "border-white/15 bg-white/5 text-white/40"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {editingProject.metadata.featured ? "FEATURED (HIGHLIGHTED)" : "STANDARD"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="border border-white/10 p-4 bg-black/40 space-y-3">
                <span className="text-[#FFAA00] font-bold text-xs uppercase block">
                  PROJECT EXTERNAL LINKS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-white/40 mb-1 text-[10px] uppercase">
                      GITHUB REPOSITORY
                    </label>
                    <input
                      type="text"
                      value={editingProject.links.github}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          links: { ...editingProject.links, github: e.target.value },
                        })
                      }
                      placeholder="https://github.com/..."
                      className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/40 mb-1 text-[10px] uppercase">
                      LIVE PRODUCTION URL
                    </label>
                    <input
                      type="text"
                      value={editingProject.links.live}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          links: { ...editingProject.links, live: e.target.value },
                        })
                      }
                      placeholder="https://app.example.com"
                      className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/40 mb-1 text-[10px] uppercase">
                      DEMO / VIDEO URL
                    </label>
                    <input
                      type="text"
                      value={editingProject.links.demo}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          links: { ...editingProject.links, demo: e.target.value },
                        })
                      }
                      placeholder="https://demo.example.com"
                      className="w-full bg-black border border-white/15 px-3 py-2 text-white outline-none focus:border-[#FFAA00]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Search & Filters Bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 font-mono text-xs">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FILTER BY TITLE, SLUG OR EVIDENCE ID..."
            className="w-full bg-[#080808] border border-white/10 pl-9 pr-3 py-2 text-white placeholder-white/30 outline-none focus:border-[#FFAA00]"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-[#080808] border border-white/10 px-3 py-2 text-white/80 outline-none focus:border-[#FFAA00]"
        >
          <option value="all">ALL CATEGORIES</option>
          <option value="enterprise">ENTERPRISE</option>
          <option value="system">SYSTEM</option>
          <option value="web">WEB APPLICATION</option>
          <option value="other">OTHER</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#080808] border border-white/10 px-3 py-2 text-white/80 outline-none focus:border-[#FFAA00]"
        >
          <option value="all">ALL STATUSES</option>
          <option value="completed">COMPLETED</option>
          <option value="in-progress">IN PROGRESS</option>
          <option value="concept">CONCEPT</option>
        </select>
      </div>

      {/* ── Projects Cards Grid ── */}
      {loading ? (
        <div className="p-12 border border-white/10 bg-[#080808] text-center font-mono text-xs text-white/40 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#FFAA00]" />
          <span>SYNCHRONIZING PROJECT REPOSITORIES...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 border border-dashed border-white/10 bg-[#080808] text-center font-mono text-xs text-white/40 space-y-3">
          <p>NO PROJECTS MATCH THE CURRENT FILTERS.</p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-3.5 py-1.5 bg-[#FFAA00] text-black font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>CREATE FIRST PROJECT</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p) => {
            const projectTitle = p.title?.[lang] || p.title?.en || p.slug;
            return (
              <div
                key={p._id || p.projectId}
                className="border border-white/10 bg-[#080808] hover:border-white/25 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-video bg-black/80 border-b border-white/10 overflow-hidden">
                    {p.thumbnailSrc ? (
                      <Image
                        src={p.thumbnailSrc}
                        alt={projectTitle}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 font-mono text-[10px]">
                        NO MEDIA ASSET
                      </div>
                    )}

                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className="px-2 py-0.5 bg-black/80 border border-white/20 font-mono text-[9px] text-[#FFAA00]">
                        {p.metadata?.evidenceId || "EVIDENCE"}
                      </span>
                      {p.metadata?.featured && (
                        <span className="px-1.5 py-0.5 bg-[#FFAA00] text-black font-mono text-[9px] font-bold">
                          ★
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2 right-2">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(p)}
                        className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                          p.published
                            ? "bg-emerald-500/90 text-black"
                            : "bg-black/90 border border-white/30 text-white/50"
                        }`}
                        title="Click to toggle publish status"
                      >
                        {p.published ? "LIVE" : "DRAFT"}
                      </button>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                      <span className="text-white/40 uppercase tracking-wider">
                        CAT: {p.category}
                      </span>
                      <span className="text-white/40">ORDER #{p.metadata?.order ?? 999}</span>
                    </div>

                    <h3 className="font-mono text-sm font-bold text-white group-hover:text-[#FFAA00] transition-colors line-clamp-1">
                      {projectTitle}
                    </h3>

                    <p className="font-mono text-[11px] text-white/50 line-clamp-2">
                      {p.shortDescription?.[lang] || p.shortDescription?.en || "No description set."}
                    </p>

                    {/* Technology Badges Preview */}
                    {p.technologies && p.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {p.technologies.slice(0, 3).map((t, idx) => {
                          const theme = CATEGORY_COLORS[t.category] || CATEGORY_COLORS.other;
                          return (
                            <span
                              key={idx}
                              className={`px-1.5 py-0.5 border font-mono text-[9px] rounded-xs ${theme.badge}`}
                            >
                              {t.name}
                            </span>
                          );
                        })}
                        {p.technologies.length > 3 && (
                          <span className="px-1 py-0.5 border border-white/10 font-mono text-[9px] text-white/40">
                            +{p.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-3 border-t border-white/10 bg-black/40 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-white/30">
                    SLUG: {p.slug}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(p)}
                      className="px-2.5 py-1 bg-white/5 hover:bg-[#FFAA00] hover:text-black border border-white/15 text-white/80 font-mono text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>EDIT</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProjectToDelete(p)}
                      className="p-1 text-white/30 hover:text-red-400 hover:border-red-500/40 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Confirm Deletion Modal ── */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-red-500/50 max-w-md w-full p-6 space-y-4 font-mono shadow-2xl">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>DELETE PROJECT // IRREVERSIBLE ACTION</span>
            </div>

            <p className="text-xs text-white/70">
              Are you sure you want to permanently delete the project:
            </p>

            <div className="bg-black border border-white/10 p-3 text-xs text-white">
              <div>
                TITLE:{" "}
                <span className="text-[#FFAA00]">
                  {projectToDelete.title?.[lang] || projectToDelete.title?.en || projectToDelete.slug}
                </span>
              </div>
              <div className="text-white/40 text-[10px] mt-1">
                ID: {projectToDelete.projectId} // SLUG: {projectToDelete.slug}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                disabled={deleting}
                className="px-3 py-1.5 border border-white/15 text-white/60 hover:text-white text-xs transition-colors"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>CONFIRM PERMANENT DELETE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
