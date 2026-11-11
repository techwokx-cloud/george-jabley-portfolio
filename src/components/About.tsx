import { ArrowRight, Cpu, Headset, Laptop } from "lucide-react";
import { about } from "../data/content";
import { toolIcon } from "../lib/icons";

const icons = { laptop: Laptop, headset: Headset, cpu: Cpu } as const;
const statLeft = [384, 505, 626];

export default function About() {
  return (
    <section id="about" className="about">
      <div className="eyebrow">{about.eyebrow}</div>
      <div className="wm" aria-hidden>
        GJ.
      </div>
      <h2 className="h2">
        {about.title[0]}
        <br />
        {about.title[1]}
        <span className="o">.</span>
      </h2>
      <p className="p">
        {about.body[0]}
        <br />
        {about.body[1]}
      </p>
      <a href="#experience" className="more">
        {about.link} <ArrowRight />
      </a>

      {about.stats.map((s, i) => {
        const Icon = icons[s.icon as keyof typeof icons];
        return (
          <div key={s.value} className="stat" style={{ left: statLeft[i] }}>
            <Icon className="ic" />
            <b>{s.value}</b>
            <span>
              {s.label[0]}
              <br />
              {s.label[1]}
            </span>
          </div>
        );
      })}

      <div className="toolkit" id="experience">
        <h3>MY TOOLKIT</h3>
        <ul>
          {about.toolkit.map((t) => (
            <li key={t}>
              {t === "Next.js" ? (
                <span className="tkic n">{toolIcon(t, 10)}</span>
              ) : t === "TypeScript" ? (
                <span className="tkic t">Ts</span>
              ) : (
                <span className="tkic">{toolIcon(t, 17, true)}</span>
              )}
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
