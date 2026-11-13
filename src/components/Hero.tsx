import Image from "next/image";
import { ArrowRight, MapPin, Play } from "lucide-react";
import { hero, site } from "../data/content";
import HeroParallax from "./HeroParallax";
import CodeField from "./CodeField";

const code: { t: React.ReactNode; c?: string }[] = [
  { t: <><em>const</em> innovate = () =&gt; {"{"}</> },
  { t: <><em>return</em> {"{"}</>, c: "i1" },
  { t: <>build: <b>true</b>,</>, c: "i2" },
  { t: <>solve: <b>true</b>,</>, c: "i2" },
  { t: <>grow: <b>true</b></>, c: "i2" },
  { t: <>{"};"}</>, c: "i1" },
  { t: <>{"};"}<i className="caret" /></> },
];

function HeroArt() {
  return (
    <div className="hero-art">
      <div className="stage">
        <i className="shape s1" />
        <i className="shape s2" />

        <div className="depth" aria-hidden>
          <i className="ripple r1" />
          <i className="ripple r2" />
          <i className="ring" data-hero />
          <i className="disc" data-hero />
        </div>

        <CodeField />

        <div className="code" data-hero="code" aria-hidden>
          {code.map((l, i) => (
            <span key={i} className={l.c} style={{ ["--i" as string]: i }}>{l.t}</span>
          ))}
        </div>

        <div className="portrait-wrap">
          <Image
            data-hero="portrait"
            className="portrait"
            src="/images/george-hero.webp"
            alt="George Jabley, resting his chin on his hand"
            width={1315}
            height={1196}
            priority
            sizes="548px"
          />
        </div>

        <a href="#about" className="scroll" data-hero style={{ ["--d" as string]: "1.5s" }} aria-label="Scroll to About">
          <svg viewBox="0 0 12 40" width="12" height="40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M6 2v32M2 30l4 5 4-5" />
          </svg>
          <span>Scroll</span>
          <svg className="clock" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
            <circle cx="10" cy="10" r="8.4" /><path d="M10 5.5V10l3 2" strokeLinecap="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home" className="hero">
      <HeroParallax />
      <HeroArt />
      <div className="copy">
        <p className="hi" data-hero style={{ ["--d" as string]: "0s" }}>{hero.eyebrow}</p>
        <h1>
          <span className="ln"><span style={{ ["--d" as string]: "0.1s" }}>{hero.lines[0]}</span></span>
          <span className="ln"><span style={{ ["--d" as string]: "0.26s" }}>{hero.lines[1]}</span></span>
          <span className="ln"><span style={{ ["--d" as string]: "0.42s" }}><span className="o">{hero.accent}</span></span></span>
        </h1>
        <p className="sub" data-hero style={{ ["--d" as string]: "0.75s" }}>
          {hero.sub[0]}
          <br />
          {hero.sub[1]}
        </p>
        <div className="actions">
          <a href="#work" className="btn" data-hero style={{ ["--d" as string]: "0.95s" }}>
            View My Work <ArrowRight />
          </a>
          <button className="play" type="button" data-hero style={{ ["--d" as string]: "1.08s" }}>
            <span>
              <Play />
            </span>
            Watch Intro
          </button>
        </div>
        <div className="status" data-hero style={{ ["--d" as string]: "1.25s" }}>
          <i className="dot" />
          {hero.status}
          <i className="sep" />
          <MapPin />
          {site.location}
        </div>
      </div>
    </section>
  );
}
