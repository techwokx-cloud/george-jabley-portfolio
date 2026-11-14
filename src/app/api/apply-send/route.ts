import { NextResponse } from "next/server";
import { verifyAdmin } from "../../../lib/adminAuth";

export const runtime = "nodejs";

/** Sends an application email from the admin (Resend). A copy goes to the admin's own inbox (BCC). */
export async function POST(req: Request) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const key = process.env.RESEND_API_KEY;
  const from = process.env.APPLY_FROM || process.env.CONTACT_FROM;
  if (!key || !from) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const b = (await req.json().catch(() => ({}))) as { to?: string; subject?: string; body?: string; attachResume?: boolean; resumeUrl?: string };
  const to = String(b.to ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || !b.subject || !b.body) return NextResponse.json({ error: "Recipient, subject and message are required." }, { status: 422 });

  const payload: Record<string, unknown> = { from, to: [to], bcc: [admin], reply_to: admin, subject: String(b.subject).slice(0, 200), text: String(b.body).slice(0, 8000) };
  if (b.attachResume) {
    const origin = new URL(req.url).origin;
    const href = b.resumeUrl?.startsWith("http") ? b.resumeUrl : `${origin}${b.resumeUrl || "/George-Jabley-Resume.pdf"}`;
    payload.attachments = [{ filename: "George-Jabley-Resume.pdf", path: href }];
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const t = (await r.json().catch(() => ({}))) as { message?: string };
    return NextResponse.json({ error: t.message || "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
