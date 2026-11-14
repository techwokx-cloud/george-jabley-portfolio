"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Globe, Smartphone, Monitor, Sparkles, Pause, Play } from "lucide-react";
import { work } from "../data/content";
import type { Project } from "../lib/projects";

const SHOW = 3;     // cards that fit across one row (3×304 + 2×16 = 944)
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
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  const list = useMemo(
    () => projects.filter((p) => active === "All Projects" || p.categories.includes(active)),
    [projects, active]
  );
  // top row = 1st, 3rd, 5th…  bottom row = 2nd, 4th, 6th…
  const rows = useMemo(() => [list.filter((_, i) => i % 2 === 0), list.filter((_, i) => i % 2 === 1)], [list]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const renderCard = (p: Project, i: number, copy = false) => {
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
      ...(copy ? { "aria-hidden": true, tabIndex: -1 } : {}),
    } as const;
    return p.url ? (
      <a key={p.id + (copy ? "-c" : "")} href={p.url} target="_blank" rel="noopener noreferrer" data-cursor="View Project" {...common}>
        {body}
      </a>
    ) : (
      <div key={p.id + (copy ? "-c" : "")} data-cursor={p.status === "Live" ? "" : p.status} {...common}>
        {body}
      </div>
    );
  };


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
        className={`carousel${paused ? " paused" : ""}${inView ? " in-view" : ""}`}
        data-gate
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected projects"
      >
        <div className="rows" key={active}>
          {rows.map((row, ri) => {
            const loop = row.length > SHOW; // enough cards to scroll → duplicate for a seamless loop
            const group = (copy: boolean) => (
              <div className="grp" key={copy ? "b" : "a"} aria-hidden={copy || undefined}>
                {row.map((p, i) => renderCard(p, i * 2 + ri, copy))}
              </div>
            );
            return (
              <div className="viewport" key={ri} data-row={ri}>
                <div
                  className={`track ${ri === 0 ? "to-left" : "to-right"}${loop ? " loop" : ""}`}
                  style={{ ["--dur" as string]: `${Math.max(28, row.length * 8)}s` }}
                >
                  {group(false)}
                  {loop && group(true)}
                  {list.length === 0 && ri === 0 && <p className="empty">No projects in this category yet.</p>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="ctrl">
          <div className="count" aria-live="polite">
            <b>{String(list.length).padStart(2, "0")}</b> projects · hover to pause
          </div>
          <div className="bar" aria-hidden />
          <button
            type="button"
            className="arrow"
            aria-label={paused ? "Play movement" : "Pause movement"}
            onClick={() => setPaused((v) => !v)}
          >
            {paused ? <Play /> : <Pause />}
          </button>
        </div>
      </div>
    </section>
  );
}
