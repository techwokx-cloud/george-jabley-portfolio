import Image from "next/image";
import { ArrowRight, MapPin, Play } from "lucide-react";
import { hero, site } from "../data/content";

function HeroArt() {
  return (
    <div className="hero-art" aria-hidden={false}>
      <div className="stage">
        <i className="shape s1" />
        <i className="shape s2" />
        <i className="ring" />
        <i className="disc" />

        <div className="code" data-hero="code" aria-hidden>
          <span><em>const</em> innovate = () =&gt; {"{"}</span>
          <span className="i1"><em>return</em> {"{"}</span>
          <span className="i2">build: <b>true</b>,</span>
          <span className="i2">solve: <b>true</b>,</span>
          <span className="i2">grow: <b>true</b></span>
          <span className="i1">{"};"}</span>
          <span>{"};"}</span>
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
      <HeroArt />
      <div className="copy">
        <p className="hi" data-hero style={{ ["--d" as string]: "0s" }}>{hero.eyebrow}</p>
        <h1>
          <span className="ln"><span style={{ ["--d" as string]: "0.08s" }}>{hero.lines[0]}</span></span>
          <span className="ln"><span style={{ ["--d" as string]: "0.2s" }}>{hero.lines[1]} <span className="o">{hero.accent}</span></span></span>
        </h1>
        <p className="sub" data-hero style={{ ["--d" as string]: "0.5s" }}>
          {hero.sub[0]}
          <br />
          {hero.sub[1]}
        </p>
        <div className="actions">
          <a href="#work" className="btn" data-hero style={{ ["--d" as string]: "0.7s" }}>
            View My Work <ArrowRight />
          </a>
          <button className="play" type="button" data-hero style={{ ["--d" as string]: "0.82s" }}>
            <span>
              <Play />
            </span>
            Watch Intro
          </button>
        </div>
        <div className="status" data-hero style={{ ["--d" as string]: "1s" }}>
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
