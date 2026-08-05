import { NextResponse } from "next/server";

/**
 * GET  /api/admin/projects — list all projects (admin, includes drafts)
 * POST /api/admin/projects — create new project
 * Implemented in Task 10.5 (project CRUD).
 */
export async function GET() {
  return NextResponse.json({ error: "Not implemented — see Task 10.5" }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ error: "Not implemented — see Task 10.5" }, { status: 501 });
}
