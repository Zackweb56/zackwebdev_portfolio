import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/backend/dal";
import connectMongoose from "@/backend/db/mongoose";
import { Project } from "@/backend/models/PortfolioContent";

function buildIdFilter(id: string) {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  if (isObjectId) {
    return { $or: [{ _id: id }, { projectId: id }] };
  }
  return { projectId: id };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectMongoose();
    const { id } = await params;
    const project = await Project.findOne(buildIdFilter(id)).lean();
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (err: any) {
    console.error("[API_PROJECT_GET_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectMongoose();
    const { id } = await params;
    const body = await req.json();
    const { _id, ...updateData } = body;

    // If slug is being updated, sanitize and check uniqueness
    if (updateData.slug) {
      updateData.slug = updateData.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 80);

      const filter = buildIdFilter(id);
      const duplicateSlug = await Project.findOne({
        slug: updateData.slug,
        $nor: [filter],
      }).lean();

      if (duplicateSlug) {
        return NextResponse.json(
          { error: `Slug '${updateData.slug}' is already used by another project.` },
          { status: 409 }
        );
      }
    }

    const updated = await Project.findOneAndUpdate(
      buildIdFilter(id),
      { $set: updateData },
      { new: true, lean: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (err: any) {
    console.error("[API_PROJECT_PUT_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectMongoose();
    const { id } = await params;
    const deleted = await Project.findOneAndDelete(buildIdFilter(id)).lean();

    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (err: any) {
    console.error("[API_PROJECT_DELETE_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
