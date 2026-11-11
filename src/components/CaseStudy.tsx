import { ArrowRight, Check } from "lucide-react";
import { caseStudy as c } from "../data/content";
import { Social } from "../lib/icons";

export default function CaseStudy() {
  return (
    <section id="case-study" className="case">
      <div className="eyebrow noline">{c.eyebrow}</div>
      <h2>{c.name}</h2>
      <p className="sub">
        Smart Business Management
        <br />
        for Growing Businesses<span className="o">.</span>
      </p>
      <p className="p">
        {c.body[0]}
        <br />
        {c.body[1]}
      </p>
      <a href="#" className="btn">
        {c.cta} <ArrowRight />
      </a>

      <div className="case-img" role="img" aria-label="WingBM dashboard on laptop and phone" />

      <aside className="hl">
        <h3>PROJECT HIGHLIGHTS</h3>
        <ul>
          {c.highlights.map((h) => (
            <li key={h}>
              <Check /> {h}
            </li>
          ))}
        </ul>
        <div className="links">
          <a href={c.demo.href}>
            {c.demo.label} <ArrowRight />
          </a>
          <a href={c.github.href} className="gh">
            <Social icon="github" size={17} /> {c.github.label}
          </a>
        </div>
      </aside>
    </section>
  );
}
