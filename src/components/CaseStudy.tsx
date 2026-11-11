import { ArrowRight, Check } from "lucide-react";
import { caseStudy as c } from "../data/content";
import { Social } from "../lib/icons";

export default function CaseStudy() {
  return (
    <section id="case-study" className="case">
      <div className="eyebrow noline" data-reveal>{c.eyebrow}</div>
      <h2 data-reveal style={{ ["--d" as string]: "0.08s" }}>{c.name}</h2>
      <p className="sub" data-reveal style={{ ["--d" as string]: "0.16s" }}>
        Smart Business Management
        <br />
        for Growing Businesses<span className="o">.</span>
      </p>
      <p className="p" data-reveal style={{ ["--d" as string]: "0.24s" }}>
        {c.body[0]}
        <br />
        {c.body[1]}
      </p>
      <a href={c.cta.href} className="btn" target="_blank" rel="noopener noreferrer" data-reveal style={{ ["--d" as string]: "0.32s" }}>
        {c.cta.label} <ArrowRight />
      </a>

      <a href={c.demo.href} className="case-img" data-reveal="img" data-cursor="View Live" target="_blank" rel="noopener noreferrer" aria-label="Open the WingBM live demo (dashboard on laptop and phone)" />

      <aside className="hl" data-reveal style={{ ["--d" as string]: "0.3s" }}>
        <h3>PROJECT HIGHLIGHTS</h3>
        <ul>
          {c.highlights.map((h) => (
            <li key={h}>
              <Check /> {h}
            </li>
          ))}
        </ul>
        <div className="links">
          <a href={c.demo.href} target="_blank" rel="noopener noreferrer">
            {c.demo.label} <ArrowRight />
          </a>
          <a href={c.github.href} className="gh" target="_blank" rel="noopener noreferrer">
            <Social icon="github" size={17} /> {c.github.label}
          </a>
        </div>
      </aside>
    </section>
  );
}
