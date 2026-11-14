"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, BUCKET } from "../../lib/supabase";
import CredAdmin from "./CredAdmin";
import LeadsAdmin from "./LeadsAdmin";
import {
  CATEGORIES, KINDS, SEED, STATUSES, featuredFor, fromRow, toRow, weekNumber,
  type Project, type Status,
} from "../../lib/projects";

const blank = (sort: number): Project => ({
  id: "", name: "", tagline: "", headline: "", description: "", kind: "Web App", categories: [], status: "Concept" as Status,
  url: "", github: "", image: "", caseImage: "", highlights: [], period: "", featuredPool: false, pinned: false, sort,
});

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `project-${Date.now()}`;

/** Downscale big screenshots before upload (max 1600px wide, WebP). */
async function prepare(file: File): Promise<{ blob: Blob; ext: string; type: string }> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / bmp.width);
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    const blob: Blob | null = await new Promise((r) => c.toBlob(r, "image/webp", 0.88));
    if (blob) return { blob, ext: "webp", type: "image/webp" };
  } catch {}
  return { blob: file, ext: file.name.split(".").pop() || "png", type: file.type };
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [msg, setMsg] = useState<{ t: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"projects" | "creds" | "leads">("projects");
  const [q, setQ] = useState("");
  const [fs, setFs] = useState("All");

  useEffect(() => {
    if (!msg) return;
    const t = window.setTimeout(() => setMsg(null), 5000);
    return () => window.clearTimeout(t);
  }, [msg]);

  useEffect(() => {
    if (!supabase) return setReady(true);
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from("projects").select("*").order("sort", { ascending: true });
    if (error) return setMsg({ t: "err", text: error.message });
    setProjects((data ?? []).map(fromRow));
  }, []);

  useEffect(() => {
    if (session) load();
  }, [session, load]);

  const featured = useMemo(() => featuredFor(projects), [projects]);

  if (!ready) return <div className="a-wrap a-muted">Loading…</div>;

  if (!supabase) {
    return (
      <div className="a-wrap">
        <h1>Admin<i>.</i></h1>
        <div className="a-card a-note" style={{ marginTop: 18 }}>
          <b>Supabase isn&apos;t configured yet.</b> Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (locally in <code>.env.local</code> and in Vercel → Settings → Environment
          Variables), then redeploy. See <code>SETUP-ADMIN.md</code>. Until then the site shows its built-in starter projects.
        </div>
      </div>
    );
  }

  if (!session) return <Login />;

  async function save() {
    if (!form || !supabase) return;
    if (!form.name.trim()) return setMsg({ t: "err", text: "Project name is required." });
    setBusy(true);
    const row = toRow({ ...form, id: form.id || slug(form.name), highlights: form.highlights.filter(Boolean).slice(0, 3) });
    const { error } = await supabase.from("projects").upsert(row);
    setBusy(false);
    if (error) return setMsg({ t: "err", text: error.message });
    setMsg({ t: "ok", text: `Saved “${form.name}”. The site updates within a minute.` });
    setForm(null);
    load();
  }

  async function remove(p: Project) {
    if (!supabase || !confirm(`Delete “${p.name}”? This can't be undone.`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    if (error) return setMsg({ t: "err", text: error.message });
    setMsg({ t: "ok", text: `Deleted “${p.name}”.` });
    load();
  }

  async function togglePool(p: Project) {
    if (!supabase) return;
    const { error } = await supabase.from("projects").update({ featured_pool: !p.featuredPool }).eq("id", p.id);
    if (error) return setMsg({ t: "err", text: error.message });
    load();
  }

  async function importSeed() {
    if (!supabase) return;
    const { error } = await supabase.from("projects").upsert(SEED.map(toRow));
    if (error) return setMsg({ t: "err", text: error.message });
    setMsg({ t: "ok", text: "Starter projects imported. Edit them to add real details and images." });
    load();
  }

  async function upload(file: File, field: "image" | "caseImage") {
    if (!supabase || !form) return;
    setBusy(true);
    try {
      const { blob, ext, type } = await prepare(file);
      const path = `${slug(form.name || "project")}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: type, upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      setForm((f) => (f ? { ...f, [field]: data.publicUrl } : f));
      setMsg({ t: "ok", text: "Image uploaded. Remember to press Save." });
    } catch (e) {
      setMsg({ t: "err", text: `Upload failed: ${(e as Error).message}` });
    }
    setBusy(false);
  }

  const set = <K extends keyof Project>(k: K, v: Project[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));

  return (
    <div className="a-wrap">
      <header className="a-top">
        <div className="a-brand"><h1>Admin<i>.</i></h1><span className="a-sub">Portfolio dashboard</span></div>
        <div className="a-row">
          <a className="a-link" href="/" target="_blank" rel="noopener noreferrer">View site ↗</a>
          <span className="a-muted a-email">{session.user.email}</span>
          <button onClick={() => supabase!.auth.signOut()}>Sign out</button>
        </div>
      </header>

      <nav className="a-tabs">
        <button className={tab === "projects" ? "a-tab a-on" : "a-tab"} onClick={() => setTab("projects")}>Projects <em>{projects.length}</em></button>
        <button className={tab === "creds" ? "a-tab a-on" : "a-tab"} onClick={() => setTab("creds")}>Certificates &amp; Resume</button>
        <button className={tab === "leads" ? "a-tab a-on" : "a-tab"} onClick={() => setTab("leads")}>Leads &amp; Ads</button>
      </nav>

      {tab === "projects" && !form && (
        <div className="a-stats">
          <div><b>{projects.length}</b><span>Projects</span></div>
          <div><b>{projects.filter((p) => p.status === "Live").length}</b><span>Live</span></div>
          <div><b>{projects.filter((p) => p.url).length}</b><span>With a link</span></div>
          <div className="wide"><b>{featured ? featured.name : "—"}</b><span>Featured this week · week {weekNumber()}</span></div>
        </div>
      )}

      {tab === "creds" && <CredAdmin />}
      {tab === "leads" && <LeadsAdmin />}
      {tab === "projects" && msg && <div className={`a-toast ${msg.t === "ok" ? "a-ok" : "a-err"}`}>{msg.text}</div>}

      {tab === "projects" && !form && (
        <>
          <div className="a-card">
            <div className="a-row" style={{ justifyContent: "space-between" }}>
              <div>
                <h2 style={{ margin: 0 }}>Projects ({projects.length})</h2>
                <div className="a-muted">
                  Featured this week (week {weekNumber()}): <b>{featured ? featured.name : "—"}</b>
                  {projects.some((p) => p.pinned) ? " · pinned" : " · rotates every Monday through projects marked ★"}
                </div>
              </div>
              <div className="a-row a-tools">
                <input type="text" className="a-search" placeholder="Search projects…" value={q} onChange={(e) => setQ(e.target.value)} />
                <select className="a-fsel" value={fs} onChange={(e) => setFs(e.target.value)}>
                  <option>All</option>
                  {STATUSES.map((x) => <option key={x}>{x}</option>)}
                </select>
                {projects.length === 0 && <button onClick={importSeed}>Import starter projects</button>}
                <button
                  className="a-primary"
                  onClick={() => {
                    setForm(blank((projects.at(-1)?.sort ?? 0) + 1));
                    setIsNew(true);
                    setMsg(null);
                  }}
                >
                  + New project
                </button>
              </div>
            </div>
          </div>

          <div className="a-card" style={{ padding: 0, overflowX: "auto" }}>
            <table>
              <thead>
                <tr><th></th><th>Project</th><th>Status</th><th>Link</th><th>Featured pool</th><th></th></tr>
              </thead>
              <tbody>
                {projects.filter((p) => (fs === "All" || p.status === fs) && `${p.name} ${p.tagline} ${p.kind}`.toLowerCase().includes(q.toLowerCase())).map((p) => (
                  <tr key={p.id}>
                    <td><span className="a-thumb" style={p.image ? { backgroundImage: `url(${p.image})` } : undefined} /></td>
                    <td>
                      <b>{p.name}</b>{" "}
                      {featured?.id === p.id && <span className="a-pill a-star">This week</span>}
                      <div className="a-muted">{p.tagline} · {p.kind}</div>
                    </td>
                    <td><span className={`a-pill${p.status === "Live" ? " a-live" : ""}`}>{p.status}</span></td>
                    <td className="a-muted">{p.url ? "yes" : "none"}</td>
                    <td><input type="checkbox" checked={p.featuredPool} onChange={() => togglePool(p)} aria-label={`${p.name} in featured pool`} /></td>
                    <td>
                      <div className="a-row" style={{ justifyContent: "flex-end" }}>
                        <button onClick={() => { setForm(p); setIsNew(false); setMsg(null); }}>Edit</button>
                        <button className="a-danger" onClick={() => remove(p)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr><td colSpan={6} className="a-muted" style={{ padding: 24 }}>No projects yet. Import the starter set or add your first one.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "projects" && form && (
        <div className="a-card">
          <h2>{isNew ? "New project" : `Edit · ${form.name}`}</h2>
          <div className="a-grid">
            <div><label>Name *</label><input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
            <div><label>Card subtitle (short)</label><input type="text" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Business Management Platform" /></div>
            <div className="a-full"><label>Short description</label><textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="2–3 lines. Only describe what is verified." /></div>
            <div className="a-full"><label>Featured headline (longer line used when this project is featured)</label><input type="text" value={form.headline} onChange={(e) => set("headline", e.target.value)} /></div>
            <div>
              <label>Type</label>
              <select value={form.kind} onChange={(e) => set("kind", e.target.value)}>
                {KINDS.map((k) => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label>Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value as Status)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="a-full">
              <label>Categories (used by the filters)</label>
              <div className="a-checks">
                {CATEGORIES.map((c) => (
                  <label key={c}>
                    <input type="checkbox" checked={form.categories.includes(c)} onChange={(e) => set("categories", e.target.checked ? [...form.categories, c] : form.categories.filter((x) => x !== c))} />
                    {c}
                  </label>
                ))}
              </div>
            </div>
            <div><label>Project URL (optional — leave empty for Windows apps or unreleased work)</label><input type="text" value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://…" /></div>
            <div><label>Source code URL (optional)</label><input type="text" value={form.github} onChange={(e) => set("github", e.target.value)} placeholder="https://github.com/…" /></div>
            <div><label>Period (optional, e.g. “Aug 2026” — feeds the timeline)</label><input type="text" value={form.period} onChange={(e) => set("period", e.target.value)} /></div>
            <div><label>Display order (lower = earlier)</label><input type="number" value={form.sort} onChange={(e) => set("sort", Number(e.target.value))} /></div>
            <div className="a-full"><label>Highlights for the featured section (one per line, max 3)</label>
              <textarea value={form.highlights.join("\n")} onChange={(e) => set("highlights", e.target.value.split("\n"))} /></div>
            <div className="a-full a-checks">
              <label><input type="checkbox" checked={form.featuredPool} onChange={(e) => set("featuredPool", e.target.checked)} /> ★ Include in the weekly featured rotation</label>
              <label><input type="checkbox" checked={form.pinned} onChange={(e) => set("pinned", e.target.checked)} /> Pin as featured now (overrides rotation)</label>
            </div>
            <div>
              <label>Card image (real screenshot)</label>
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "image")} />
              <input type="text" value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="or paste an image URL" style={{ marginTop: 6 }} />
              {form.image && <div className="a-preview" style={{ backgroundImage: `url(${form.image})` }} />}
            </div>
            <div>
              <label>Featured-section image (optional wide image)</label>
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "caseImage")} />
              <input type="text" value={form.caseImage} onChange={(e) => set("caseImage", e.target.value)} placeholder="falls back to the card image" style={{ marginTop: 6 }} />
              {form.caseImage && <div className="a-preview" style={{ backgroundImage: `url(${form.caseImage})` }} />}
            </div>
          </div>
          <div className="a-row" style={{ marginTop: 18 }}>
            <button className="a-primary" onClick={save} disabled={busy}>{busy ? "Working…" : "Save project"}</button>
            <button onClick={() => setForm(null)} disabled={busy}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="a-login">
      <h1 style={{ textAlign: "center", marginBottom: 14 }}>Admin<i>.</i></h1>
      <form
        className="a-card"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setErr("");
          const { error } = await supabase!.auth.signInWithPassword({ email, password });
          setBusy(false);
          if (error) setErr(error.message);
        }}
      >
        {err && <div className="a-err">{err}</div>}
        <div style={{ marginBottom: 12 }}><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required /></div>
        <div style={{ marginBottom: 16 }}><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></div>
        <button className="a-primary" style={{ width: "100%" }} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}
