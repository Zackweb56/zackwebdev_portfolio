import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/backend/dal";
import connectMongoose from "@/backend/db/mongoose";
import { Project } from "@/backend/models/PortfolioContent";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectMongoose();
    const { id } = await params;
    const body = await req.json();
    const { _id, ...updateData } = body;
    const updated = await Project.findByIdAndUpdate(id, updateData, { new: true, lean: true });
    if (!updated) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json({ success: true, project: updated });
  } catch (err: any) {
    console.error("[API_PROJECT_PUT_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
