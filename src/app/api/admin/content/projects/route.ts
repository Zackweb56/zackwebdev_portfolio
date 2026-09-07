import { NextResponse } from "next/server";
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
