import { ArrowRight } from "lucide-react";
import { stack } from "../data/content";
import { toolIcon } from "../lib/icons";
import Waves from "./Waves";

export default function Stack() {
  let n = 0;
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
      <div className="groups">
        {stack.groups.map((g, gi) => (
          <div key={g.label} className="grp">
            <h4 data-reveal style={{ ["--d" as string]: `${gi * 0.1}s` }}>{g.label}</h4>
            <ul className="tiles" aria-label={g.label}>
              {g.items.map((t, i) => (
                <li
                  key={t}
                  className="tile"
                  tabIndex={0}
                  data-reveal
                  style={{ ["--d" as string]: `${0.08 + gi * 0.1 + i * 0.05}s`, ["--b" as string]: `${(n++ % 9) * 0.35}s` }}
                >
                  <div className="box">{t === "Next.js" ? <span className="nlogo">N</span> : toolIcon(t, 25)}</div>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="any">
        <h3 data-lines>
          <span className="ln"><span>{stack.any.title}</span></span>
        </h3>
        <p data-reveal style={{ ["--d" as string]: "0.12s" }}>{stack.any.body}</p>
        <ul className="chips">
          {stack.any.chips.map((c, i) => (
            <li key={c} data-reveal style={{ ["--d" as string]: `${0.2 + i * 0.06}s`, ["--b" as string]: `${i * 0.4}s` }}>{c}</li>
          ))}
        </ul>
      </div>

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
        <p className="tagline">{stack.cta.tag}</p>
        <button type="button" data-contact className="btn">
          {stack.cta.button} <ArrowRight />
        </button>
      </div>
      <Waves />
    </section>
  );
}
