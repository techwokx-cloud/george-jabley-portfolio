"use client";

import { useState } from "react";
import { ArrowRight, Globe, Smartphone } from "lucide-react";
import { work } from "../data/content";

const filterMap: Record<string, string[]> = {
  "All Projects": [],
  "Mobile Apps": ["Mobile App"],
  "Web Apps": ["Web App"],
  "Windows Utilities": ["Windows Utility"],
  "AI & Automation": ["AI"],
  Experimental: ["Experimental"],
};

export default function Work() {
  const [active, setActive] = useState("All Projects");
  const kinds = filterMap[active];

  return (
    <section id="work" className="work">
      <div className="eyebrow">{work.eyebrow}</div>
      <h2 className="h2">
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
            style={{ width: [88, 91, 80, 116, 103, 88][i] }}
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="cards">
        {work.projects.map((p) => {
          const hidden = kinds.length > 0 && !kinds.includes(p.kind);
          return (
            <a
              key={p.name}
              href={p.href}
              className={`card${hidden ? " hide" : ""}`}
              style={{ ["--img" as string]: `url(${p.image})` }}
            >
              <span className="badge">
                {p.icon === "phone" ? <Smartphone /> : <Globe />}
                {p.kind}
              </span>
              <h4>
                {p.name} <ArrowRight />
              </h4>
              <p>{p.tagline}</p>
              <ArrowRight className="go" strokeWidth={1.6} />
            </a>
          );
        })}
      </div>
    </section>
  );
}
