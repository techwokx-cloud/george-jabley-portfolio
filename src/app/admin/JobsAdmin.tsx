"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { templateFollowUp, templateLetter } from "../../lib/coverLetter";
import { useSubScreen } from "./subscreen";

export type App = {
  id?: string; created_at?: string; company: string; role: string; job_url: string; source: string; kind: string; location: string;
  status: string; applied_on: string | null; follow_up: string | null; contact_name: string; contact_email: string;
  job_description: string; cover_letter: string; followup_text: string; notes: string;
};
export const APP_STATUSES = ["Saved", "Applied", "Follow-up sent", "Interview", "Offer", "Rejected", "No reply", "Closed"];
const KINDS = ["Remote job", "Work abroad", "VA role", "Freelance", "Other"];
const SOURCES = ["LinkedIn", "Upwork", "OnlineJobs.ph", "We Work Remotely", "Wellfound", "RemoteOK", "Facebook", "Company site", "Referral", "Other"];
const DONE = ["Offer", "Rejected", "Closed"];

const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const today = () => iso(new Date());
const plus = (days: number) => { const d = new Date(); d.setDate(d.getDate() + days); return iso(d); };
const blank = (): App => ({ company: "", role: "", job_url: "", source: "LinkedIn", kind: "Remote job", location: "Remote", status: "Saved", applied_on: null, follow_up: null, contact_name: "", contact_email: "", job_description: "", cover_letter: "", followup_text: "", notes: "" });

export function dueLabel(a: { follow_up: string | null; status: string }) {
  if (!a.follow_up || DONE.includes(a.status) || a.status === "Saved") return null;
  const t = today();
  if (a.follow_up < t) return { text: "Overdue", cls: "a-over" };
  if (a.follow_up === t) return { text: "Follow up today", cls: "a-over" };
  const days = Math.round((new Date(a.follow_up).getTime() - new Date(t).getTime()) / 86400000);
  return { text: `Follow up in ${days}d`, cls: days <= 3 ? "a-soon" : "a-later" };
}

export default function JobsAdmin({ focusId, onChanged }: { focusId?: string | null; onChanged: () => void }) {
  const [items, setItems] = useState<App[]>([]);
  const [form, setForm] = useState<App | null>(null);
  const [q, setQ] = useState("");
  const [fs, setFs] = useState("All");
  const [dueOnly, setDueOnly] = useState(false);
  const [busy, setBusy] = useState("");
  const [tone, setTone] = useState("professional");
  const [extra, setExtra] = useState("");
  const [subject, setSubject] = useState("");
  const [attach, setAttach] = useState(true);
  const [aiNote, setAiNote] = useState("");
  const [msg, setMsg] = useState<{ t: "ok" | "err"; text: string } | null>(null);

  useSubScreen(!!form, () => setForm(null), form ? form.company || "New application" : "");
  useEffect(() => { if (!msg) return; const t = setTimeout(() => setMsg(null), 6000); return () => clearTimeout(t); }, [msg]);

  const load = useCallback(async () => {
    if (!supabase) return;
    const r = await supabase.from("applications").select("*").order("created_at", { ascending: false });
    if (r.error) return setMsg({ t: "err", text: `${r.error.message} — run supabase/update8.sql in the Supabase SQL Editor.` });
    setItems((r.data ?? []) as App[]);
    return (r.data ?? []) as App[];
  }, []);

  useEffect(() => {
    load().then((rows) => {
      if (focusId === "__new") open(blank());
      else if (focusId && rows) { const f = rows.find((x) => x.id === focusId); if (f) open(f); }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, focusId]);

  function open(a: App) {
    setForm(a);
    setSubject(`Application: ${a.role || "Open position"} — George Jabley`);
    setAiNote("");
    setExtra("");
  }

  const set = <K extends keyof App>(k: K, v: App[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));
  const token = async () => (await supabase!.auth.getSession()).data.session?.access_token ?? "";

  async function persist(next?: App): Promise<App | null> {
    const row = { ...(next ?? form)! };
    if (!row.company.trim() && !row.role.trim()) { setMsg({ t: "err", text: "Add at least a company or a role." }); return null; }
    row.applied_on = row.applied_on || null;
    row.follow_up = row.follow_up || null;
    const { data, error } = await supabase!.from("applications").upsert(row).select().single();
    if (error) { setMsg({ t: "err", text: error.message }); return null; }
    setForm(data as App);
    onChanged();
    return data as App;
  }

  async function save() {
    setBusy("save");
    const r = await persist();
    setBusy("");
    if (r) { setMsg({ t: "ok", text: "Saved." }); setForm(null); load(); }
  }
  async function remove() {
    if (!form?.id || !confirm(`Delete “${form.company || form.role}”?`)) return;
    const { error } = await supabase!.from("applications").delete().eq("id", form.id);
    if (error) return setMsg({ t: "err", text: error.message });
    setForm(null); load(); onChanged();
  }

  async function generate(mode: "cover" | "followup") {
    if (!form) return;
    if (mode === "cover" && form.job_description.trim().length < 40) return setMsg({ t: "err", text: "Paste the job description first (at least a few lines)." });
    setBusy(mode); setAiNote("");
    try {
      const r = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${await token()}` },
        body: JSON.stringify({ mode, jd: form.job_description, company: form.company, role: form.role, contact: form.contact_name, tone, notes: extra, letter: form.cover_letter }),
      });
      const j = (await r.json().catch(() => ({}))) as { letter?: string; error?: string };
      if (r.ok && j.letter) {
        set(mode === "cover" ? "cover_letter" : "followup_text", j.letter);
        setAiNote("Written by Claude from your real profile. Read it through and edit before sending.");
      } else if (r.status === 503) {
        const o = { company: form.company, role: form.role, jd: form.job_description, contact: form.contact_name, tone, notes: extra };
        set(mode === "cover" ? "cover_letter" : "followup_text", mode === "cover" ? templateLetter(o) : templateFollowUp(o));
        setAiNote("Template letter (no AI key set). Add GROQ_API_KEY in Vercel for letters tailored to each job.");
      } else setMsg({ t: "err", text: j.error || "Could not generate the letter." });
    } catch (e) { setMsg({ t: "err", text: (e as Error).message }); }
    setBusy("");
  }

  async function send(kind: "apply" | "followup") {
    if (!form) return;
    const body = kind === "apply" ? form.cover_letter : form.followup_text;
    if (!form.contact_email.trim()) return setMsg({ t: "err", text: "Add the recruiter's email first, or use “Open in Gmail”." });
    if (body.trim().length < 20) return setMsg({ t: "err", text: "Write or generate the message first." });
    if (!confirm(`Send this ${kind === "apply" ? "application" : "follow-up"} to ${form.contact_email}?`)) return;
    setBusy("send");
    try {
      let resumeUrl = "/George-Jabley-Resume.pdf";
      const f = await supabase!.from("site_files").select("url").eq("key", "resume").maybeSingle();
      if (f.data?.url) resumeUrl = f.data.url;
      const r = await fetch("/api/apply-send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${await token()}` },
        body: JSON.stringify({ to: form.contact_email, subject: kind === "apply" ? subject : `Following up: ${form.role || "my application"}`, body, attachResume: kind === "apply" && attach, resumeUrl }),
      });
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      if (r.ok) {
        const next = kind === "apply"
          ? { ...form, status: "Applied", applied_on: form.applied_on || today(), follow_up: form.follow_up || plus(7) }
          : { ...form, status: "Follow-up sent", follow_up: plus(7) };
        await persist(next);
        setMsg({ t: "ok", text: kind === "apply" ? "Sent. Marked as Applied; follow-up set for 7 days." : "Follow-up sent; next reminder in 7 days." });
      } else if (r.status === 503) setMsg({ t: "err", text: "Sending from here isn't set up (needs RESEND_API_KEY and a verified sender). Use “Open in Gmail” for now." });
      else setMsg({ t: "err", text: j.error || "Send failed." });
    } catch (e) { setMsg({ t: "err", text: (e as Error).message }); }
    setBusy("");
  }

  const gmail = () => {
    if (!form) return;
    const body = form.cover_letter;
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(form.contact_email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (url.length > 7000) { navigator.clipboard?.writeText(body); setMsg({ t: "ok", text: "Letter is long, so it was copied. Paste it into the Gmail window." }); }
    window.open(url.length > 7000 ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(form.contact_email)}&su=${encodeURIComponent(subject)}` : url, "_blank", "noopener");
  };
  const copy = (t: string) => navigator.clipboard?.writeText(t).then(() => setMsg({ t: "ok", text: "Copied." }));
  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([form!.cover_letter], { type: "text/plain" }));
    a.download = `Cover-letter-${(form!.company || "job").replace(/\W+/g, "-")}.txt`; a.click();
  };
  const markApplied = async () => { if (form) await persist({ ...form, status: "Applied", applied_on: form.applied_on || today(), follow_up: form.follow_up || plus(7) }); setMsg({ t: "ok", text: "Marked as applied. Follow-up in 7 days." }); };
  const followedUp = async () => { if (form) await persist({ ...form, status: "Follow-up sent", follow_up: plus(7) }); setMsg({ t: "ok", text: "Follow-up logged. Next reminder in 7 days." }); };

  const shown = items.filter((a) => (fs === "All" || a.status === fs) && (!dueOnly || dueLabel(a)?.cls === "a-over") && `${a.company} ${a.role} ${a.source}`.toLowerCase().includes(q.toLowerCase()));
  const dueCount = items.filter((a) => dueLabel(a)?.cls === "a-over").length;

  return (
    <>
      {msg && <div className={`a-toast ${msg.t === "ok" ? "a-ok" : "a-err"}`}>{msg.text}</div>}

      {!form && (
        <>
          <div className="a-stats">
            <div><b>{items.length}</b><span>Tracked</span></div>
            <div><b>{items.filter((a) => a.status === "Applied" || a.status === "Follow-up sent").length}</b><span>Waiting for reply</span></div>
            <div><b>{dueCount}</b><span>Follow-ups due</span></div>
            <div className="wide"><b>{items.filter((a) => a.status === "Interview").length} interview · {items.filter((a) => a.status === "Offer").length} offer</b><span>Progress</span></div>
          </div>
          <div className="a-card">
            <div className="a-row" style={{ justifyContent: "space-between" }}>
              <div><h2 style={{ margin: 0 }}>Jobs &amp; applications</h2><div className="a-muted">Paste a job description, generate a cover letter, apply and track follow-ups.</div></div>
              <div className="a-row a-tools">
                <input type="text" className="a-search" placeholder="Search company or role…" value={q} onChange={(e) => setQ(e.target.value)} />
                <select className="a-fsel" value={fs} onChange={(e) => setFs(e.target.value)}><option>All</option>{APP_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                <button className={dueOnly ? "a-primary" : ""} onClick={() => setDueOnly((v) => !v)}>Due ({dueCount})</button>
                <button className="a-primary" onClick={() => open(blank())}>+ New application</button>
              </div>
            </div>
          </div>
          <div className="a-list">
            {shown.map((a) => {
              const d = dueLabel(a);
              return (
                <button key={a.id} className="a-item" onClick={() => open(a)}>
                  <div className="a-item-main">
                    <b>{a.company || "—"}</b>
                    <span>{a.role}</span>
                    <small>{[a.source, a.kind, a.applied_on ? `Applied ${a.applied_on}` : ""].filter(Boolean).join(" · ")}</small>
                  </div>
                  <div className="a-item-side">
                    <span className={`a-pill a-st-${a.status.replace(/\W+/g, "").toLowerCase()}`}>{a.status}</span>
                    {d && <span className={`a-due-chip ${d.cls}`}>{d.text}</span>}
                  </div>
                </button>
              );
            })}
            {shown.length === 0 && <div className="a-card a-muted" style={{ textAlign: "center" }}>No applications yet. Tap “+ New application” and paste a job description.</div>}
          </div>
        </>
      )}

      {form && (
        <div className="a-form">
          <div className="a-card">
            <h2>Job</h2>
            <div className="a-grid">
              <div><label>Company</label><input type="text" value={form.company} onChange={(e) => set("company", e.target.value)} /></div>
              <div><label>Role</label><input type="text" value={form.role} onChange={(e) => { set("role", e.target.value); setSubject(`Application: ${e.target.value || "Open position"} — George Jabley`); }} /></div>
              <div className="a-full"><label>Job link</label>
                <div className="a-row"><input type="text" style={{ flex: 1 }} placeholder="https://…" value={form.job_url} onChange={(e) => set("job_url", e.target.value)} />
                  {form.job_url && <a className="a-link" href={form.job_url} target="_blank" rel="noopener noreferrer">Open ↗</a>}</div></div>
              <div><label>Source</label><input type="text" list="jsrc" value={form.source} onChange={(e) => set("source", e.target.value)} /><datalist id="jsrc">{SOURCES.map((s) => <option key={s} value={s} />)}</datalist></div>
              <div><label>Type</label><select value={form.kind} onChange={(e) => set("kind", e.target.value)}>{KINDS.map((s) => <option key={s}>{s}</option>)}</select></div>
              <div><label>Location</label><input type="text" value={form.location} onChange={(e) => set("location", e.target.value)} /></div>
              <div><label>Contact person (optional)</label><input type="text" value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} /></div>
              <div className="a-full"><label>Recruiter / application email</label><input type="email" inputMode="email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} /></div>
            </div>
          </div>

          <div className="a-card">
            <div className="a-row" style={{ justifyContent: "space-between" }}>
              <h2 style={{ margin: 0 }}>Job description</h2>
              <button onClick={async () => { try { set("job_description", await navigator.clipboard.readText()); } catch { setMsg({ t: "err", text: "Allow clipboard access, or paste manually." }); } }}>Paste</button>
            </div>
            <textarea rows={8} placeholder="Paste the full job description here…" value={form.job_description} onChange={(e) => set("job_description", e.target.value)} style={{ marginTop: 10 }} />
          </div>

          <div className="a-card">
            <h2>Cover letter</h2>
            <div className="a-grid">
              <div><label>Tone</label><select value={tone} onChange={(e) => setTone(e.target.value)}><option value="professional">Professional</option><option value="warm and friendly">Warm &amp; friendly</option><option value="concise and direct">Concise &amp; direct</option><option value="confident">Confident</option></select></div>
              <div><label>Anything to emphasise? (optional)</label><input type="text" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="e.g. available immediately" /></div>
            </div>
            <div className="a-row" style={{ margin: "12px 0" }}>
              <button className="a-primary" onClick={() => generate("cover")} disabled={!!busy}>{busy === "cover" ? "Writing…" : form.cover_letter ? "Regenerate" : "Generate cover letter"}</button>
              {form.cover_letter && <><button onClick={() => copy(form.cover_letter)}>Copy</button><button onClick={download}>Download .txt</button></>}
            </div>
            {aiNote && <div className="a-note" style={{ marginBottom: 10 }}>{aiNote}</div>}
            <textarea rows={14} value={form.cover_letter} onChange={(e) => set("cover_letter", e.target.value)} placeholder="The letter appears here. You can edit it freely." />
          </div>

          <div className="a-card">
            <h2>Apply</h2>
            <div className="a-grid">
              <div className="a-full"><label>Email subject</label><input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
              <div className="a-full a-checks"><label><input type="checkbox" checked={attach} onChange={(e) => setAttach(e.target.checked)} /> Attach my resume (PDF)</label></div>
            </div>
            <div className="a-row" style={{ marginTop: 12 }}>
              <button className="a-primary" onClick={() => send("apply")} disabled={!!busy}>{busy === "send" ? "Sending…" : "Send application"}</button>
              <button onClick={gmail} disabled={!form.cover_letter}>Open in Gmail</button>
              {form.job_url && <a className="a-link" href={form.job_url} target="_blank" rel="noopener noreferrer">Apply on site ↗</a>}
              <button onClick={markApplied}>Mark as applied</button>
            </div>
            <div className="a-muted" style={{ marginTop: 8 }}>“Send application” emails the recruiter and BCCs you. Applying on a website instead? Use “Apply on site”, then “Mark as applied”.</div>
          </div>

          <div className="a-card">
            <h2>Tracking &amp; follow-up</h2>
            <div className="a-grid">
              <div><label>Status</label><select value={form.status} onChange={(e) => set("status", e.target.value)}>{APP_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
              <div><label>Applied on</label><input type="date" value={form.applied_on ?? ""} onChange={(e) => set("applied_on", e.target.value)} /></div>
              <div className="a-full"><label>Follow up on</label>
                <div className="a-row"><input type="date" style={{ width: "auto" }} value={form.follow_up ?? ""} onChange={(e) => set("follow_up", e.target.value)} />
                  {[3, 7, 14].map((n) => <button key={n} onClick={() => set("follow_up", plus(n))}>+{n} days</button>)}</div></div>
            </div>
            <div className="a-row" style={{ margin: "14px 0 10px" }}>
              <button onClick={() => generate("followup")} disabled={!!busy}>{busy === "followup" ? "Writing…" : "Draft follow-up message"}</button>
              {form.followup_text && <><button onClick={() => copy(form.followup_text)}>Copy</button><button onClick={() => send("followup")} disabled={!!busy}>Send follow-up</button></>}
              <button onClick={followedUp}>I followed up</button>
            </div>
            {(form.followup_text || busy === "followup") && <textarea rows={6} value={form.followup_text} onChange={(e) => set("followup_text", e.target.value)} />}
            <label style={{ marginTop: 14 }}>Notes</label>
            <textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Interview dates, salary talk, who you spoke to…" />
          </div>

          <div className="a-row a-sticky a-card" style={{ position: "sticky" }}>
            <button className="a-primary" onClick={save} disabled={!!busy}>{busy === "save" ? "Saving…" : "Save"}</button>
            <button onClick={() => history.back()}>Cancel</button>
            {form.id && <button className="a-danger" style={{ marginLeft: "auto" }} onClick={remove}>Delete</button>}
          </div>
        </div>
      )}
    </>
  );
}
