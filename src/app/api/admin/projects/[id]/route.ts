import { NextResponse } from "next/server";

/**
 * GET    /api/admin/projects/[id] — fetch single project
 * PATCH  /api/admin/projects/[id] — update project
 * DELETE /api/admin/projects/[id] — delete project
 * Implemented in Task 10.5 (project CRUD).
 */
export async function GET() {
  return NextResponse.json({ error: "Not implemented — see Task 10.5" }, { status: 501 });
}

export async function PATCH() {
  return NextResponse.json({ error: "Not implemented — see Task 10.5" }, { status: 501 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Not implemented — see Task 10.5" }, { status: 501 });
}
