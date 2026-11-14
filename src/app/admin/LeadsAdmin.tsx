"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useSubScreen } from "./subscreen";

type Lead = {
  id?: string; created_at?: string; source: string; kind: string; name: string; contact: string; company: string;
  role: string; status: string; campaign: string; message: string; notes: string; follow_up: string | null;
};
const KINDS = ["Remote job", "Work abroad", "VA client", "Project", "Other"];
const STATUSES = ["New", "Applied", "Replied", "Interview", "Offer", "Won", "Rejected", "Closed"];
const SOURCES = ["Facebook Ad", "LinkedIn", "Upwork", "OnlineJobs.ph", "Referral", "Website", "WhatsApp", "Email", "Other"];
const blank = (): Lead => ({ source: "Facebook Ad", kind: "Remote job", name: "", contact: "", company: "", role: "", status: "New", campaign: "", message: "", notes: "", follow_up: null });

export default function LeadsAdmin() {
  const [items, setItems] = useState<Lead[]>([]);
  const [form, setForm] = useState<Lead | null>(null);
  const [fs, setFs] = useState("All");
  const [fk, setFk] = useState("All");
  useSubScreen(!!form, () => setForm(null), form ? (form.name || form.company || "Lead") : "");
  const [msg, setMsg] = useState<{ t: "ok" | "err"; text: string } | null>(null);
  const [camp, setCamp] = useState("va-remote-nov");

  const load = useCallback(async () => {
    if (!supabase) return;
    const r = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (r.error) return setMsg({ t: "err", text: `${r.error.message} — run supabase/fix-rls.sql in the Supabase SQL Editor first.` });
    setItems((r.data ?? []) as Lead[]);
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (!msg) return; const t = setTimeout(() => setMsg(null), 5000); return () => clearTimeout(t); }, [msg]);

  const shown = items.filter((l) => (fs === "All" || l.status === fs) && (fk === "All" || l.kind === fk));
  const bySource = useMemo(() => {
    const m = new Map<string, { n: number; won: number }>();
    items.forEach((l) => { const e = m.get(l.source || "—") ?? { n: 0, won: 0 }; e.n++; if (["Interview", "Offer", "Won"].includes(l.status)) e.won++; m.set(l.source || "—", e); });
    return [...m.entries()].sort((a, b) => b[1].n - a[1].n);
  }, [items]);

  async function save() {
    if (!form) return;
    const row = { ...form, follow_up: form.follow_up || null };
    const { error } = await supabase!.from("leads").upsert(row);
    if (error) return setMsg({ t: "err", text: error.message });
    setForm(null); setMsg({ t: "ok", text: "Saved." }); load();
  }
  async function setStatus(l: Lead, status: string) {
    const { error } = await supabase!.from("leads").update({ status }).eq("id", l.id!);
    if (error) return setMsg({ t: "err", text: error.message });
    setItems((xs) => xs.map((x) => (x.id === l.id ? { ...x, status } : x)));
  }
  async function remove(l: Lead) {
    if (!confirm(`Delete this entry (${l.name || l.company || "no name"})?`)) return;
    const { error } = await supabase!.from("leads").delete().eq("id", l.id!);
    if (error) return setMsg({ t: "err", text: error.message });
    load();
  }
  function csv() {
    const cols = ["created_at", "source", "campaign", "kind", "name", "contact", "company", "role", "status", "follow_up", "message", "notes"] as const;
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const out = [cols.join(","), ...items.map((l) => cols.map((c) => esc(l[c])).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([out], { type: "text/csv" }));
    a.download = "leads.csv"; a.click();
  }
  const set = <K extends keyof Lead>(k: K, v: Lead[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));
  const today = new Date().toISOString().slice(0, 10);
  const utm = `https://george-jabley-portfolio.vercel.app/?utm_source=facebook&utm_medium=paid&utm_campaign=${encodeURIComponent(camp)}`;

  return (
    <>
      {msg && <div className={`a-toast ${msg.t === "ok" ? "a-ok" : "a-err"}`}>{msg.text}</div>}

      {!form && (
        <>
          <div className="a-stats">
            <div><b>{items.length}</b><span>Total leads &amp; applications</span></div>
            <div><b>{items.filter((l) => l.status === "New").length}</b><span>New</span></div>
            <div><b>{items.filter((l) => ["Interview", "Offer", "Won"].includes(l.status)).length}</b><span>Interview / offer / won</span></div>
            <div className="wide"><b style={{ fontSize: 15, lineHeight: 1.6 }}>{bySource.length ? bySource.slice(0, 4).map(([s, v]) => `${s} ${v.n}`).join("  ·  ") : "—"}</b><span>Responses by source</span></div>
          </div>

          <div className="a-card">
            <div className="a-row" style={{ justifyContent: "space-between" }}>
              <div>
                <h2 style={{ margin: 0 }}>Leads, applications &amp; ad responses</h2>
                <div className="a-muted">Contact-form messages land here automatically (with the ad campaign they came from). Add job applications by hand.</div>
              </div>
              <div className="a-row">
                <select className="a-fsel" value={fk} onChange={(e) => setFk(e.target.value)}><option>All</option>{KINDS.map((k) => <option key={k}>{k}</option>)}</select>
                <select className="a-fsel" value={fs} onChange={(e) => setFs(e.target.value)}><option>All</option>{STATUSES.map((k) => <option key={k}>{k}</option>)}</select>
                <button onClick={csv} disabled={!items.length}>Export CSV</button>
                <button className="a-primary" onClick={() => setForm(blank())}>+ Add entry</button>
              </div>
            </div>
          </div>

          <div className="a-card" style={{ padding: 0, overflowX: "auto" }}>
            <table>
              <thead><tr><th>Date</th><th>Who / where</th><th>Type</th><th>Source</th><th>Status</th><th>Follow-up</th><th></th></tr></thead>
              <tbody>
                {shown.map((l) => (
                  <tr key={l.id}>
                    <td className="a-muted">{l.created_at?.slice(0, 10)}</td>
                    <td><b>{l.name || l.company || "—"}</b><div className="a-muted">{[l.company, l.role].filter(Boolean).join(" · ") || l.contact}</div></td>
                    <td><span className="a-pill">{l.kind}</span></td>
                    <td>{l.source}<div className="a-muted">{l.campaign}</div></td>
                    <td><select value={l.status} onChange={(e) => setStatus(l, e.target.value)} style={{ width: 110 }}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
                    <td style={{ color: l.follow_up && l.follow_up < today && !["Won", "Rejected", "Closed"].includes(l.status) ? "#a21b1b" : undefined }}>{l.follow_up || "—"}</td>
                    <td><div className="a-row" style={{ justifyContent: "flex-end" }}>
                      <button onClick={() => setForm(l)}>Open</button>
                      <button className="a-danger" onClick={() => remove(l)}>Delete</button>
                    </div></td>
                  </tr>
                ))}
                {shown.length === 0 && <tr><td colSpan={7} className="a-muted" style={{ padding: 24 }}>Nothing here yet.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="a-card">
            <h2>Ad link builder (to track Facebook ad responses)</h2>
            <div className="a-muted" style={{ marginBottom: 8 }}>Use this as the ad&apos;s website link. When someone from the ad sends a message, the campaign name is saved on the lead.</div>
            <div className="a-row">
              <input type="text" value={camp} onChange={(e) => setCamp(e.target.value.replace(/\s+/g, "-"))} style={{ width: 220 }} />
              <input type="text" readOnly value={utm} style={{ flex: 1, minWidth: 260 }} onFocus={(e) => e.currentTarget.select()} />
              <button onClick={() => navigator.clipboard?.writeText(utm).then(() => setMsg({ t: "ok", text: "Link copied." }))}>Copy</button>
            </div>
          </div>
        </>
      )}

      {form && (
        <div className="a-card">
          <h2>{form.id ? "Lead / application" : "New entry"}</h2>
          <div className="a-grid">
            <div><label>Name / contact person</label><input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
            <div><label>Email / phone / link</label><input type="text" value={form.contact} onChange={(e) => set("contact", e.target.value)} /></div>
            <div><label>Company</label><input type="text" value={form.company} onChange={(e) => set("company", e.target.value)} /></div>
            <div><label>Role</label><input type="text" value={form.role} onChange={(e) => set("role", e.target.value)} /></div>
            <div><label>Type</label><select value={form.kind} onChange={(e) => set("kind", e.target.value)}>{KINDS.map((k) => <option key={k}>{k}</option>)}</select></div>
            <div><label>Status</label><select value={form.status} onChange={(e) => set("status", e.target.value)}>{STATUSES.map((k) => <option key={k}>{k}</option>)}</select></div>
            <div><label>Source</label><input type="text" list="srcs" value={form.source} onChange={(e) => set("source", e.target.value)} /><datalist id="srcs">{SOURCES.map((s) => <option key={s} value={s} />)}</datalist></div>
            <div><label>Campaign / ad name</label><input type="text" value={form.campaign} onChange={(e) => set("campaign", e.target.value)} /></div>
            <div><label>Follow-up date</label><input type="text" placeholder="YYYY-MM-DD" value={form.follow_up ?? ""} onChange={(e) => set("follow_up", e.target.value)} /></div>
            <div className="a-full"><label>Their message</label><textarea value={form.message} onChange={(e) => set("message", e.target.value)} /></div>
            <div className="a-full"><label>My notes</label><textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} /></div>
          </div>
          <div className="a-row a-sticky">
            <button className="a-primary" onClick={save}>Save</button>
            <button onClick={() => setForm(null)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
