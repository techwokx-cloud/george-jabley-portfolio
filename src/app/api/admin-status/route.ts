import { NextResponse } from "next/server";
import { verifyAdmin } from "../../../lib/adminAuth";

export const runtime = "nodejs";

/** Tells the admin which server features are configured (booleans only — no secrets). */
export async function GET(req: Request) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({
    ai: !!(process.env.GROQ_API_KEY || process.env.ANTHROPIC_API_KEY),
    send: !!process.env.RESEND_API_KEY && !!(process.env.APPLY_FROM || process.env.CONTACT_FROM),
    notify: !!process.env.RESEND_API_KEY && !!process.env.CONTACT_TO_EMAIL,
  });
}
