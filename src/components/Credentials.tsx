"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Award, Trophy, CalendarDays } from "lucide-react";
import type { Credential } from "../lib/credentials";
import { reduced } from "../lib/motion";

const STEP = 320; // card 304 + gap 16
const VISIBLE = 3;

const Icon = ({ kind }: { kind: string }) =>
  kind === "Certificate" ? <Award /> : kind === "Hackathon" ? <Trophy /> : <CalendarDays />;

export default function Credentials({ items }: { items: Credential[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const x0 = useRef<number | null>(null);
  const moved = useRef(false);
  const max = Math.max(0, items.length - VISIBLE);
  const go = useCallback((i: number) => setIndex(Math.min(Math.max(i, 0), max)), [max]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || dragging || !inView || max === 0 || reduced()) return;
    const t = window.setInterval(() => setIndex((i) => (i >= max ? 0 : i + 1)), 4000);
    return () => window.clearInterval(t);
  }, [paused, dragging, inView, max]);

  return (
    <section id="credentials" className="creds" data-section>
      <div className="eyebrow" data-reveal>CERTIFICATES &amp; EVENTS</div>
      <h2 className="h2" data-lines>
        <span className="ln"><span>Learning, competing</span></span>
        <span className="ln"><span style={{ ["--d" as string]: "0.12s" }}>and showing up<span className="o">.</span></span></span>
      </h2>
      <p className="cp" data-reveal style={{ ["--d" as string]: "0.16s" }}>
        Hackathons, innovation labs, forums and certificates.
      </p>

      <div
        ref={root}
        className="ccar"
        data-gate
        role="region"
        aria-roledescription="carousel"
        aria-label="Certificates and events"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          className={`cview${dragging ? " dragging" : ""}`}
          onPointerDown={(e) => { x0.current = e.clientX; moved.current = false; setDragging(true); }}
          onPointerMove={(e) => { if (x0.current === null) return; const dx = e.clientX - x0.current; if (Math.abs(dx) > 6) moved.current = true; setDrag(dx); }}
          onPointerUp={() => { if (x0.current === null) return; const dx = drag; x0.current = null; setDragging(false); setDrag(0); if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1)); }}
          onPointerCancel={() => { x0.current = null; setDragging(false); setDrag(0); }}
          onClickCapture={(e) => moved.current && e.preventDefault()}
        >
          <div className="ctrack" style={{ transform: `translate3d(${-index * STEP + drag}px,0,0)`, transition: dragging ? "none" : undefined }}>
            {items.map((c, i) => {
              const inner = (
                <>
                  {c.image ? (
                    <span className="cimg" style={{ backgroundImage: `url(${c.image})` }} />
                  ) : (
                    <span className="cimg ph" aria-hidden><Icon kind={c.kind} /></span>
                  )}
                  <span className="cbody">
                    <span className="ck"><Icon kind={c.kind} />{c.kind}{c.date ? ` · ${c.date}` : ""}</span>
                    <b>{c.title}</b>
                    <span className="ci">{c.issuer}</span>
                    {c.description && <span className="cd">{c.description}</span>}
                  </span>
                  {c.url && <ArrowUpRight className="cgo" strokeWidth={1.6} />}
                </>
              );
              const style = { ["--e" as string]: `${Math.min(i, 5) * 0.09}s` };
              return c.url ? (
                <a key={c.id} className="ccard slide" style={style} href={c.url} target="_blank" rel="noopener noreferrer" draggable={false}>{inner}</a>
              ) : (
                <div key={c.id} className="ccard slide" style={style}>{inner}</div>
              );
            })}
          </div>
        </div>
        <div className="ctrl cctrl">
          <div className="count" aria-live="polite"><b>{String(Math.min(index + 1, items.length)).padStart(2, "0")}</b> / {String(items.length).padStart(2, "0")}</div>
          <div className="bar" aria-hidden><span style={{ width: `${items.length ? (Math.min(index + VISIBLE, items.length) / items.length) * 100 : 0}%` }} /></div>
          <button type="button" className="arrow" aria-label="Previous" onClick={() => go(index - 1)} disabled={index === 0}><ArrowLeft /></button>
          <button type="button" className="arrow" aria-label="Next" onClick={() => go(index + 1)} disabled={index >= max}><ArrowRight /></button>
        </div>
      </div>
    </section>
  );
}
