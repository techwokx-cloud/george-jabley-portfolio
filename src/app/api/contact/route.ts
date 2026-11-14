import { NextResponse } from "next/server";

export const runtime = "nodejs";

// naive in-memory rate limit (per server instance): 5 messages / 10 min / IP
const hits = new Map<string, number[]>();

export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string; company?: string; kind?: string; source?: string; campaign?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (body.company) return NextResponse.json({ ok: true }); // honeypot

  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 160);
  const message = String(body.message ?? "").trim().slice(0, 4000);
  if (name.length < 2 || message.length < 5 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid" }, { status: 422 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 600_000);
  if (recent.length >= 5) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  hits.set(ip, [...recent, now]);

  // 1) save as a lead in Supabase (anon insert is allowed by the leads policy; only the admin can read)
  let saved = false;
  const sb = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (sb && anon) {
    try {
      const r = await fetch(`${sb}/rest/v1/leads`, {
        method: "POST",
        headers: { apikey: anon, Authorization: `Bearer ${anon}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({
          name,
          contact: email,
          message,
          kind: String(body.kind ?? "Other").slice(0, 40),
          source: String(body.source ?? "Website").slice(0, 80),
          campaign: String(body.campaign ?? "").slice(0, 120),
          status: "New",
        }),
      });
      saved = r.ok;
    } catch {}
  }

  // 2) email notification (optional, needs RESEND_API_KEY)
  const key = process.env.RESEND_API_KEY;
  let emailed = false;
  if (key) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
          to: [process.env.CONTACT_TO_EMAIL || "george.jabley@gmail.com"],
          reply_to: email,
          subject: `Portfolio message from ${name}${body.kind ? ` (${body.kind})` : ""}`,
          text: `From: ${name} <${email}>\nAbout: ${body.kind ?? "-"}\nSource: ${body.source ?? "-"} ${body.campaign ?? ""}\n\n${message}`,
        }),
      });
      emailed = r.ok;
    } catch {}
  }

  if (saved || emailed) return NextResponse.json({ ok: true });
  return NextResponse.json({ error: key || (sb && anon) ? "send_failed" : "not_configured" }, { status: key || (sb && anon) ? 502 : 503 });
}
