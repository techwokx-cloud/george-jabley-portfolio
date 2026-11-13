"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { contact } from "../data/content";

type State = "idle" | "sending" | "sent" | "error";

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "", company: "" });
  const first = useRef<HTMLInputElement>(null);

  // any element with [data-contact] (or a #contact link) opens the dialog
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest("[data-contact]");
      if (t) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    window.setTimeout(() => first.current?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open]);

  const wa = (text: string) => `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`;
  const waText = () =>
    form.message.trim()
      ? `Hi George, I'm ${form.name || "a visitor"} (from your portfolio). ${form.message.trim()}`
      : "Hi George, I found your portfolio and would like to talk.";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setState(r.ok ? "sent" : "error");
      if (r.ok) setForm({ name: "", email: "", message: "", company: "" });
    } catch {
      setState("error");
    }
  };

  if (!open) return null;
  return (
    <div className="cm-back" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="cm" role="dialog" aria-modal="true" aria-labelledby="cm-title">
        <button type="button" className="cm-x" aria-label="Close" onClick={() => setOpen(false)}>
          <X />
        </button>
        <h3 id="cm-title">Let&apos;s talk<span>.</span></h3>
        <p className="cm-sub">Send a message straight from here, or chat on WhatsApp.</p>

        {state === "sent" ? (
          <div className="cm-ok" role="status">
            <b>Message sent.</b> Thanks, I&apos;ll reply to you by email soon.
            <button type="button" className="cm-btn ghost" onClick={() => { setState("idle"); setOpen(false); }}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label>Name<input ref={first} required minLength={2} maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></label>
            <label>Email<input required type="email" maxLength={160} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" /></label>
            <label>Message<textarea required minLength={5} maxLength={4000} rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
            <input className="cm-hp" tabIndex={-1} autoComplete="off" aria-hidden value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            {state === "error" && (
              <p className="cm-err" role="alert">Couldn&apos;t send by email right now. Please use WhatsApp below.</p>
            )}
            <div className="cm-row">
              <button type="submit" className="cm-btn" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : <>Send message <Send /></>}
              </button>
              <a className="cm-btn wa" href={wa(waText())} target="_blank" rel="noopener noreferrer">
                <MessageCircle /> WhatsApp
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
