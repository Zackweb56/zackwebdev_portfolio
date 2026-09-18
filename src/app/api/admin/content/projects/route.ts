import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/backend/dal";
import connectMongoose from "@/backend/db/mongoose";
import { Project } from "@/backend/models/PortfolioContent";

export async function GET() {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectMongoose();
    const projects = await Project.find({}).sort({ "metadata.order": 1 }).lean();
    return NextResponse.json({ projects });
  } catch (err: any) {
    console.error("[API_PROJECTS_GET_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    let {
      projectId,
      slug,
      title,
      shortTitle,
      category = "web",
      status = "completed",
      published = true,
      thumbnailSrc = "",
      thumbnailAlt = {},
      gallery = [],
      tags = [],
      technologies = [],
      links = {},
      caseStudy = {},
      metadata = {},
      shortDescription = {},
      fullDescription = {},
    } = body;

    // Validate slug
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Sanitize slug
    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80);

    if (!cleanSlug) {
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
    }

    // Auto-generate projectId if empty
    if (!projectId || typeof projectId !== "string" || !projectId.trim()) {
      projectId = `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    } else {
      projectId = projectId.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-");
    }

    await connectMongoose();

    // Check for uniqueness of slug & projectId
    const existing = await Project.findOne({
      $or: [{ slug: cleanSlug }, { projectId }],
    }).lean();

    if (existing) {
      if (existing.slug === cleanSlug) {
        return NextResponse.json(
          { error: `Project with slug '${cleanSlug}' already exists.` },
          { status: 409 }
        );
      }
      if (existing.projectId === projectId) {
        return NextResponse.json(
          { error: `Project with ID '${projectId}' already exists.` },
          { status: 409 }
        );
      }
    }

    // Set order default if not provided
    if (metadata.order === undefined || metadata.order === null) {
      const count = await Project.countDocuments();
      metadata.order = count + 1;
    }

    const newProject = await Project.create({
      projectId,
      slug: cleanSlug,
      title: title || {},
      shortTitle: shortTitle || {},
      category,
      status,
      published,
      shortDescription,
      fullDescription,
      thumbnailSrc,
      thumbnailAlt,
      gallery,
      tags,
      technologies,
      links,
      caseStudy,
      metadata,
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (err: any) {
    console.error("[API_PROJECT_CREATE_ERROR]", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

