import { ArrowRight } from "lucide-react";
import { stack } from "../data/content";
import { toolIcon } from "../lib/icons";

export default function Stack() {
  return (
    <section id="stack" className="stack" data-section>
      <div className="eyebrow" data-reveal>{stack.eyebrow}</div>
      <h2 className="h2" data-lines>
        <span className="ln"><span>Modern tools<span className="o">.</span></span></span>
        <span className="ln"><span style={{ ["--d" as string]: "0.12s" }}>Real impact<span className="o">.</span></span></span>
      </h2>
      <p className="p" data-reveal style={{ ["--d" as string]: "0.16s" }}>
        {stack.body[0]}
        <br />
        {stack.body[1]}
      </p>

      <i className="vline" style={{ left: 260 }} />
      <ul className="tiles" aria-label="Technologies">
        {stack.items.map((t, i) => (
          <li key={t} className="tile" tabIndex={0} data-reveal style={{ ["--d" as string]: `${0.1 + (i % 7) * 0.07 + Math.floor(i / 7) * 0.15}s` }}>
            <div className="box">{t === "Next.js" ? <span className="nlogo">N</span> : toolIcon(t, 25)}</div>
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <i className="vline o" style={{ left: 796 }} />

      <div className="cta" id="contact" data-reveal style={{ ["--d" as string]: "0.2s" }}>
        <h3>
          {stack.cta.eyebrow.replace(".", "")}
          <span className="o">.</span>
        </h3>
        <p>
          {stack.cta.body[0]}
          <br />
          {stack.cta.body[1]}
        </p>
        <button type="button" data-contact className="btn">
          {stack.cta.button} <ArrowRight />
        </button>
      </div>
    </section>
  );
}
