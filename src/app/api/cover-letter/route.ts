import { NextResponse } from "next/server";
import { verifyAdmin } from "../../../lib/adminAuth";
import { PROFILE, WRITER_RULES } from "../../../lib/profile";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const groq = process.env.GROQ_API_KEY;
  const anth = process.env.ANTHROPIC_API_KEY;
  if (!groq && !anth) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const b = (await req.json().catch(() => ({}))) as {
    mode?: "cover" | "followup"; jd?: string; company?: string; role?: string; contact?: string; tone?: string; notes?: string; letter?: string;
  };
  const mode = b.mode === "followup" ? "followup" : "cover";
  const jd = String(b.jd ?? "").slice(0, 12000);
  if (mode === "cover" && jd.trim().length < 40) return NextResponse.json({ error: "Paste the job description first." }, { status: 422 });

  const task =
    mode === "cover"
      ? `Write the cover letter email for this job.\nCompany: ${b.company || "(not given)"}\nRole: ${b.role || "(not given)"}\nContact person: ${b.contact || "(not given)"}\nTone: ${b.tone || "professional"}\nExtra points George wants included: ${b.notes || "none"}\n\nJOB DESCRIPTION:\n${jd}`
      : `Write the follow-up email.\nCompany: ${b.company || ""}\nRole: ${b.role || ""}\nContact person: ${b.contact || "(not given)"}\nOriginal letter for context:\n${String(b.letter ?? "").slice(0, 3000)}`;

  const system = `${WRITER_RULES}\n\nPROFILE:\n${PROFILE}`;
  let letter = "";
  if (groq) {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${groq}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        max_tokens: 1200,
        temperature: 0.6,
        messages: [{ role: "system", content: system }, { role: "user", content: task }],
      }),
    });
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      return NextResponse.json({ error: `ai_failed: ${r.status} ${t.slice(0, 200)}` }, { status: 502 });
    }
    const j = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    letter = (j.choices?.[0]?.message?.content ?? "").trim();
  } else {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": anth!, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
        max_tokens: 1200,
        system,
        messages: [{ role: "user", content: task }],
      }),
    });
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      return NextResponse.json({ error: `ai_failed: ${r.status} ${t.slice(0, 200)}` }, { status: 502 });
    }
    const j = (await r.json()) as { content?: { type: string; text?: string }[] };
    letter = (j.content ?? []).filter((c) => c.type === "text").map((c) => c.text).join("").trim();
  }
  if (!letter) return NextResponse.json({ error: "empty" }, { status: 502 });
  return NextResponse.json({ letter });
}
