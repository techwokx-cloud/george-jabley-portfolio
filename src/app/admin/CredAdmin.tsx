"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { CRED_KINDS, CRED_SEED, type Credential } from "../../lib/credentials";

const DOCS = "documents";
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `item-${Date.now()}`;
const blank = (sort: number): Credential => ({ id: "", title: "", issuer: "", kind: "Certificate", date: "", description: "", image: "", url: "", sort });

async function shrink(file: File): Promise<{ blob: Blob; ext: string; type: string }> {
  if (!file.type.startsWith("image/")) return { blob: file, ext: file.name.split(".").pop() || "bin", type: file.type };
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1400 / bmp.width);
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    const blob: Blob | null = await new Promise((r) => c.toBlob(r, "image/webp", 0.88));
    if (blob) return { blob, ext: "webp", type: "image/webp" };
  } catch {}
  return { blob: file, ext: file.name.split(".").pop() || "png", type: file.type };
}

export default function CredAdmin() {
  const [items, setItems] = useState<Credential[]>([]);
  const [form, setForm] = useState<Credential | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ t: "ok" | "err"; text: string } | null>(null);
  const [resume, setResume] = useState("");

  const load = useCallback(async () => {
    if (!supabase) return;
    const a = await supabase.from("credentials").select("*").order("sort", { ascending: true });
    if (a.error) return setMsg({ t: "err", text: `${a.error.message} — did you run the Update 5 SQL in supabase/schema.sql?` });
    setItems((a.data ?? []) as Credential[]);
    const b = await supabase.from("site_files").select("url").eq("key", "resume").maybeSingle();
    setResume(b.data?.url ?? "");
  }, []);
  useEffect(() => { load(); }, [load]);

  async function putFile(file: File, name: string) {
    const { blob, ext, type } = await shrink(file);
    const path = `${name}-${Date.now()}.${ext}`;
    const { error } = await supabase!.storage.from(DOCS).upload(path, blob, { contentType: type, upsert: true });
    if (error) throw error;
    return supabase!.storage.from(DOCS).getPublicUrl(path).data.publicUrl;
  }

  async function uploadImage(file: File) {
    if (!form) return;
    setBusy(true);
    try {
      const url = await putFile(file, slug(form.title || "cert"));
      setForm((f) => (f ? { ...f, image: url } : f));
      setMsg({ t: "ok", text: "Image uploaded. Press Save." });
    } catch (e) { setMsg({ t: "err", text: `Upload failed: ${(e as Error).message}` }); }
    setBusy(false);
  }

  async function uploadResume(file: File) {
    setBusy(true);
    try {
      const url = await putFile(file, "George-Jabley-Resume");
      const { error } = await supabase!.from("site_files").upsert({ key: "resume", url });
      if (error) throw error;
      setResume(url);
      setMsg({ t: "ok", text: "Resume updated. The Download Resume button uses it within a minute." });
    } catch (e) { setMsg({ t: "err", text: `Upload failed: ${(e as Error).message}` }); }
    setBusy(false);
  }

  async function save() {
    if (!form || !form.title.trim()) return setMsg({ t: "err", text: "Title is required." });
    setBusy(true);
    const { error } = await supabase!.from("credentials").upsert({ ...form, id: form.id || slug(form.title) });
    setBusy(false);
    if (error) return setMsg({ t: "err", text: error.message });
    setMsg({ t: "ok", text: `Saved “${form.title}”.` });
    setForm(null);
    load();
  }

  async function remove(c: Credential) {
    if (!confirm(`Delete “${c.title}”?`)) return;
    const { error } = await supabase!.from("credentials").delete().eq("id", c.id);
    if (error) return setMsg({ t: "err", text: error.message });
    load();
  }

  async function importSeed() {
    const { error } = await supabase!.from("credentials").upsert(CRED_SEED);
    if (error) return setMsg({ t: "err", text: error.message });
    load();
  }

  const set = <K extends keyof Credential>(k: K, v: Credential[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));

  return (
    <>
      {msg && <div className={`a-toast ${msg.t === "ok" ? "a-ok" : "a-err"}`}>{msg.text}</div>}

      <div className="a-card">
        <h2 style={{ margin: 0 }}>Resume (PDF)</h2>
        <div className="a-muted" style={{ margin: "4px 0 10px" }}>
          Current: {resume ? <a href={resume} target="_blank" rel="noreferrer">{resume.split("/").pop()}</a> : "using the built-in starter resume"}
        </div>
        <input type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && uploadResume(e.target.files[0])} disabled={busy} />
      </div>

      {!form && (
        <>
          <div className="a-card">
            <div className="a-row" style={{ justifyContent: "space-between" }}>
              <div>
                <h2 style={{ margin: 0 }}>Certificates, hackathons &amp; events ({items.length})</h2>
                <div className="a-muted">Shown as a sliding card carousel on the site, in display order.</div>
              </div>
              <div className="a-row">
                {items.length === 0 && <button onClick={importSeed}>Import starter entries</button>}
                <button className="a-primary" onClick={() => { setForm(blank((items.at(-1)?.sort ?? 0) + 1)); setIsNew(true); setMsg(null); }}>+ Add</button>
              </div>
            </div>
          </div>
          <div className="a-card" style={{ padding: 0, overflowX: "auto" }}>
            <table>
              <thead><tr><th></th><th>Title</th><th>Type</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id}>
                    <td><span className="a-thumb" style={c.image ? { backgroundImage: `url(${c.image})` } : undefined} /></td>
                    <td><b>{c.title}</b><div className="a-muted">{c.issuer}</div></td>
                    <td><span className="a-pill">{c.kind}</span></td>
                    <td className="a-muted">{c.date || "—"}</td>
                    <td><div className="a-row" style={{ justifyContent: "flex-end" }}>
                      <button onClick={() => { setForm(c); setIsNew(false); setMsg(null); }}>Edit</button>
                      <button className="a-danger" onClick={() => remove(c)}>Delete</button>
                    </div></td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={5} className="a-muted" style={{ padding: 24 }}>Nothing yet. Import the starter entries or add your first one.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {form && (
        <div className="a-card">
          <h2>{isNew ? "Add entry" : `Edit · ${form.title}`}</h2>
          <div className="a-grid">
            <div><label>Title *</label><input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
            <div><label>Issuer / organiser</label><input type="text" value={form.issuer} onChange={(e) => set("issuer", e.target.value)} /></div>
            <div><label>Type</label><select value={form.kind} onChange={(e) => set("kind", e.target.value)}>{CRED_KINDS.map((k) => <option key={k}>{k}</option>)}</select></div>
            <div><label>Date (free text, e.g. “Oct 2026”)</label><input type="text" value={form.date} onChange={(e) => set("date", e.target.value)} /></div>
            <div className="a-full"><label>Short description (optional)</label><textarea value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
            <div><label>Link (optional — verification or event page)</label><input type="text" value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://…" /></div>
            <div><label>Display order</label><input type="number" value={form.sort} onChange={(e) => set("sort", Number(e.target.value))} /></div>
            <div className="a-full">
              <label>Certificate image / photo</label>
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
              <input type="text" value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="or paste an image URL" style={{ marginTop: 6 }} />
              {form.image && <div className="a-preview" style={{ backgroundImage: `url(${form.image})` }} />}
            </div>
          </div>
          <div className="a-row" style={{ marginTop: 18 }}>
            <button className="a-primary" onClick={save} disabled={busy}>{busy ? "Working…" : "Save"}</button>
            <button onClick={() => setForm(null)} disabled={busy}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
