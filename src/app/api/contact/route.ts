import { NextRequest, NextResponse } from "next/server";

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

/**
 * POST /api/contact
 *
 * Handles incoming transmission from the portfolio contact form.
 * Validates payload parameters and confirms dispatch.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPayload;

    const { name, email, message } = body;

    // Validate presence
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Validate lengths
    if (name.length > 100 || email.length > 255 || message.length > 3000) {
      return NextResponse.json(
        { error: "Payload exceeds allowable character limits." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address format." },
        { status: 400 }
      );
    }

    // Success response with reference ID
    const refId = `ENC-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json(
      {
        success: true,
        message: "Transmission received and queued.",
        refId,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Internal transmission processing error." },
      { status: 500 }
    );
  }
}
