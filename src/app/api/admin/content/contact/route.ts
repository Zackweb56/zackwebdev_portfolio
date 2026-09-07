import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/backend/dal";
import connectMongoose from "@/backend/db/mongoose";
import { PortfolioContent } from "@/backend/models/PortfolioContent";

export async function GET() {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectMongoose();
    const doc = await PortfolioContent.findOne({}).lean();
    return NextResponse.json({ contact: doc?.contact ?? null });
  } catch (err: any) {
    console.error("[API_CONTACT_GET_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAdminApiAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectMongoose();
    const body = await req.json();
    const doc = await PortfolioContent.findOneAndUpdate(
      {},
      { $set: { contact: body.contact, updatedBy: auth.user.email } },
      { upsert: true, new: true, lean: true }
    );
    return NextResponse.json({ success: true, contact: doc?.contact ?? null });
  } catch (err: any) {
    console.error("[API_CONTACT_PUT_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
