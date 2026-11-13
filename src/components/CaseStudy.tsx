import { ArrowRight, Check } from "lucide-react";
import { Social } from "../lib/icons";
import type { Project } from "../lib/projects";

const initials = (n: string) =>
  n.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export default function CaseStudy({ project: c, week }: { project: Project | null; week: number }) {
  if (!c) return null;
  const long = c.name.length > 12;
  const shot = c.caseImage || c.image;
  return (
    <section id="case-study" className="case" data-section>
      <div className="left" key={c.id}>
        <div className="eyebrow noline" data-reveal>
          FEATURED CASE STUDY <span className="chip" title={`Rotates every Monday · week ${week}`}>This week</span>
        </div>
        <h2 className={long ? "long" : undefined} data-reveal style={{ ["--d" as string]: "0.08s" }}>{c.name}</h2>
        {c.headline && (
          <p className="sub" data-reveal style={{ ["--d" as string]: "0.16s" }}>
            {c.headline}
            <span className="o">.</span>
          </p>
        )}
        {c.description && (
          <p className="p" data-reveal style={{ ["--d" as string]: "0.24s" }}>{c.description}</p>
        )}
        {c.url && (
          <a href={c.url} className="btn" target="_blank" rel="noopener noreferrer" data-reveal style={{ ["--d" as string]: "0.32s" }}>
            Explore Case Study <ArrowRight />
          </a>
        )}
      </div>

      {(() => {
        const cls = `case-img${c.caseImage ? "" : shot ? " shot" : " type"}`;
        const style = shot ? { backgroundImage: `url(${shot})` } : undefined;
        const inner = !shot ? <b>{initials(c.name)}</b> : null;
        return c.url ? (
          <a href={c.url} className={cls} style={style} data-reveal="img" data-cursor="View Live" target="_blank" rel="noopener noreferrer" aria-label={`Open ${c.name}`}>
            {inner}
          </a>
        ) : (
          <div className={cls} style={style} data-reveal="img" role="img" aria-label={c.name}>
            {inner}
          </div>
        );
      })()}

      <aside className="hl" data-reveal style={{ ["--d" as string]: "0.3s" }}>
        <h3>PROJECT HIGHLIGHTS</h3>
        <ul>
          {c.highlights.slice(0, 3).map((h) => (
            <li key={h}>
              <Check /> {h}
            </li>
          ))}
          <li className="st">
            <i className={`dot2 s-${c.status.replace(/\s+/g, "").toLowerCase()}`} /> {c.status}
            {c.period ? ` · ${c.period}` : ""}
          </li>
        </ul>
        <div className="links">
          {c.url ? (
            <a href={c.url} target="_blank" rel="noopener noreferrer">
              View Live Demo <ArrowRight />
            </a>
          ) : (
            <span className="muted">No public link yet</span>
          )}
          {c.github && (
            <a href={c.github} className="gh" target="_blank" rel="noopener noreferrer">
              <Social icon="github" size={17} /> View on GitHub
            </a>
          )}
        </div>
      </aside>
    </section>
  );
}
