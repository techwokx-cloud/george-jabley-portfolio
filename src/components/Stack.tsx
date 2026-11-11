import { ArrowRight } from "lucide-react";
import { stack } from "../data/content";
import { toolIcon } from "../lib/icons";

export default function Stack() {
  return (
    <section id="stack" className="stack">
      <div className="eyebrow">{stack.eyebrow}</div>
      <h2 className="h2">
        Modern tools<span className="o">.</span>
        <br />
        Real impact<span className="o">.</span>
      </h2>
      <p className="p">
        {stack.body[0]}
        <br />
        {stack.body[1]}
      </p>

      <i className="vline" style={{ left: 260 }} />
      <div className="tiles">
        {stack.items.map((t) => (
          <div key={t} className="tile">
            <div className="box">{t === "Next.js" ? <span style={{ color: "#fff", fontWeight: 600, fontSize: 22 }}>N</span> : toolIcon(t, 25)}</div>
            <span>{t}</span>
          </div>
        ))}
      </div>
      <i className="vline o" style={{ left: 796 }} />

      <div className="cta" id="contact">
        <h3>
          {stack.cta.eyebrow.replace(".", "")}
          <span className="o">.</span>
        </h3>
        <p>
          {stack.cta.body[0]}
          <br />
          {stack.cta.body[1]}
        </p>
        <a href={stack.cta.href} className="btn">
          {stack.cta.button} <ArrowRight />
        </a>
      </div>
    </section>
  );
}
