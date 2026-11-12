"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Globe, Smartphone, Monitor, Sparkles } from "lucide-react";
import { work } from "../data/content";
import type { Project } from "../lib/projects";
import { reduced } from "../lib/motion";

const STEP = 960;   // page (3×304 + 2×16 = 944) + gap (16)
const PAGE = 6;     // 3 columns × 2 rows
const FILTER_W = [80, 84, 72, 108, 96, 80, 88];
const FILTERS = [...work.filters, "Client Websites"];

const initials = (n: string) =>
  n.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const HUES = [22, 28, 212, 226, 34, 16]; // brand-friendly oranges and blues
const hue = (s: string) => HUES[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];

function KindIcon({ kind }: { kind: string }) {
  if (kind === "Mobile App") return <Smartphone />;
  if (kind === "Windows Utility") return <Monitor />;
  if (kind === "AI & Automation" || kind === "Experimental") return <Sparkles />;
  return <Globe />;
}

export default function Work({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState("All Projects");
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; moved: boolean } | null>(null);

  const list = useMemo(
    () => projects.filter((p) => active === "All Projects" || p.categories.includes(active)),
    [projects, active]
  );
  const pages = useMemo(() => {
    const out: Project[][] = [];
    for (let i = 0; i < list.length; i += PAGE) out.push(list.slice(i, i + PAGE));
    return out;
  }, [list]);
  const max = Math.max(0, pages.length - 1);
  const go = useCallback((i: number) => setIndex(Math.min(Math.max(i, 0), max)), [max]);

  // reset position when the filter changes
  useEffect(() => setIndex(0), [active]);

  // autoplay: one page (6 cards) at a time, loops; pauses on hover/focus/drag/hidden tab/offscreen
  useEffect(() => {
    if (paused || dragging || !inView || max === 0) return;
    if (reduced()) return;
    const t = window.setInterval(() => setIndex((i) => (i >= max ? 0 : i + 1)), 4200);
    return () => window.clearInterval(t);
  }, [paused, dragging, inView, max]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // pointer drag / swipe
  const down = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    start.current = { x: e.clientX, moved: false };
    setDragging(true);
  };
  const move = (e: React.PointerEvent) => {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    if (Math.abs(dx) > 6) start.current.moved = true;
    setDrag(dx);
  };
  const up = () => {
    if (!start.current) return;
    const dx = drag;
    start.current.moved = start.current.moved && Math.abs(dx) > 6;
    setDragging(false);
    setDrag(0);
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
    window.setTimeout(() => (start.current = null), 0);
  };
  const swallowClick = (e: React.MouseEvent) => {
    if (start.current?.moved) e.preventDefault();
  };

  const from = index * PAGE + 1;
  const shownTo = Math.min((index + 1) * PAGE, list.length);

  return (
    <section id="work" className="work" data-section>
      <div className="eyebrow" data-reveal>{work.eyebrow}</div>
      <h2 className="h2" data-lines>
        <span className="ln"><span>Building real solutions</span></span>
        <span className="ln"><span style={{ ["--d" as string]: "0.12s" }}>with modern <span className="o">technology.</span></span></span>
      </h2>

      <div className="filters" role="tablist" aria-label="Project filters">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={active === f}
            className={`pill${active === f ? " on" : ""}`}
            style={{ width: FILTER_W[i], ["--d" as string]: `${0.12 + i * 0.06}s` }}
            data-reveal
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div
        ref={root}
        className="carousel"
        data-gate
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected projects"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          className={`viewport${dragging ? " dragging" : ""}`}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onPointerLeave={() => dragging && up()}
          onClickCapture={swallowClick}
        >
          <div
            className="track"
            key={active}
            style={{ transform: `translate3d(${-index * STEP + drag}px,0,0)`, transition: dragging ? "none" : undefined }}
          >
            {pages.map((pg, pi) => (
              <div className="page" key={pi}>
            {pg.map((p, i) => {
              const h = hue(p.id);
              const body = (
                <>
                  {p.image ? (
                    <span className="card-bg" style={{ backgroundImage: `url(${p.image})` }} />
                  ) : (
                    <span
                      className="card-bg type"
                      style={{ ["--h" as string]: String(h) }}
                      aria-hidden
                    >
                      <b>{initials(p.name)}</b>
                    </span>
                  )}
                  <span className={`status s-${p.status.replace(/\s+/g, "").toLowerCase()}`}>
                    <i />
                    {p.status}
                  </span>
                  <span className="badge">
                    <KindIcon kind={p.kind} />
                    {p.kind}
                  </span>
                  <h4>
                    {p.name} <ArrowRight />
                  </h4>
                  <p>{p.tagline}</p>
                  <ArrowUpRight className="go" strokeWidth={1.6} />
                </>
              );
              const common = {
                className: "card slide",
                style: { ["--e" as string]: `${i * 0.08}s` },
                "aria-label": `${p.name} — ${p.tagline}, ${p.status}${p.url ? " (opens in a new tab)" : " (no public link yet)"}`,
                draggable: false,
              } as const;
              return p.url ? (
                <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" data-cursor="View Project" {...common}>
                  {body}
                </a>
              ) : (
                <div key={p.id} data-cursor={p.status === "Live" ? "" : p.status} {...common}>
                  {body}
                </div>
              );
            })}
              </div>
            ))}
            {list.length === 0 && <p className="empty">No projects in this category yet.</p>}
          </div>
        </div>

        <div className="ctrl">
          <div className="count" aria-live="polite">
            <b>{String(list.length ? from : 0).padStart(2, "0")}–{String(shownTo).padStart(2, "0")}</b> / {String(list.length).padStart(2, "0")}
          </div>
          <div className="bar" aria-hidden>
            <span style={{ width: `${list.length ? (shownTo / list.length) * 100 : 0}%` }} />
          </div>
          <button type="button" className="arrow" aria-label="Previous projects" onClick={() => go(index - 1)} disabled={index === 0}>
            <ArrowLeft />
          </button>
          <button type="button" className="arrow" aria-label="Next projects" onClick={() => go(index + 1)} disabled={index >= max}>
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}
