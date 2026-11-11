"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Globe, Smartphone } from "lucide-react";
import { work } from "../data/content";

type Phase = "shown" | "fading" | "gone";

export default function Work() {
  const [active, setActive] = useState("All Projects");
  const [phase, setPhase] = useState<Record<string, Phase>>({});
  const [enter, setEnter] = useState<Record<string, number>>({});
  const timer = useRef<number>(0);

  const matches = (cats: string[], f: string) => f === "All Projects" || cats.includes(f);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function choose(f: string) {
    if (f === active) return;
    setActive(f);
    // 1) fade out cards that no longer match, 2) remove them, 3) fade in newly matching ones
    const next: Record<string, Phase> = {};
    const entering: Record<string, number> = {};
    let n = 0;
    work.projects.forEach((p) => {
      const was = phase[p.name] ?? "shown";
      if (matches(p.categories, f)) {
        next[p.name] = "shown";
        if (was !== "shown") entering[p.name] = n++;
      } else {
        next[p.name] = was === "gone" ? "gone" : "fading";
      }
    });
    setPhase(next);
    setEnter(entering);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setPhase((cur) => {
        const out = { ...cur };
        for (const k in out) if (out[k] === "fading") out[k] = "gone";
        return out;
      });
    }, 280);
  }

  return (
    <section id="work" className="work">
      <div className="eyebrow" data-reveal>{work.eyebrow}</div>
      <h2 className="h2" data-reveal style={{ ["--d" as string]: "0.08s" }}>
        Building real solutions
        <br />
        with modern <span className="o">technology.</span>
      </h2>

      <div className="filters" role="tablist" aria-label="Project filters">
        {work.filters.map((f, i) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={active === f}
            className={`pill${active === f ? " on" : ""}`}
            style={{ width: [88, 91, 80, 116, 103, 88][i], ["--d" as string]: `${0.12 + i * 0.06}s` }}
            data-reveal
            onClick={() => choose(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="cards">
        {work.projects.map((p, i) => {
          const ph = phase[p.name] ?? "shown";
          const cls = `card${ph === "fading" ? " fading" : ""}${ph === "gone" ? " hide" : ""}${p.name in enter ? " entering" : ""}`;
          const common = {
            className: cls,
            "data-reveal": "card",
            style: { ["--d" as string]: `${0.15 + i * 0.12}s`, ["--e" as string]: `${(enter[p.name] ?? 0) * 0.08}s` },
          } as const;
          const body = (
            <>
              <span className="card-bg" style={{ backgroundImage: `url(${p.image})` }} />
              <span className="badge">
                {p.icon === "phone" ? <Smartphone /> : <Globe />}
                {p.kind}
              </span>
              <h4>
                {p.name} <ArrowRight />
              </h4>
              <p>{p.tagline}</p>
              <ArrowUpRight className="go" strokeWidth={1.6} />
            </>
          );
          return p.href ? (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="View Project"
              aria-label={`${p.name} — ${p.tagline} (opens in a new tab)`}
              {...common}
            >
              {body}
            </a>
          ) : (
            <div key={p.name} data-cursor="Coming soon" aria-label={`${p.name} — ${p.tagline} (link coming soon)`} {...common}>
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}
