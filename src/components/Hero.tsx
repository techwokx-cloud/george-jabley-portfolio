import { ArrowRight, MapPin, Play } from "lucide-react";
import { hero, site } from "../data/content";

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-img" role="img" aria-label="George Jabley" />
      <div className="copy">
        <p className="hi">{hero.eyebrow}</p>
        <h1>
          {hero.lines[0]}
          <br />
          {hero.lines[1]} <span className="o">{hero.accent}</span>
        </h1>
        <p className="sub">
          {hero.sub[0]}
          <br />
          {hero.sub[1]}
        </p>
        <div className="actions">
          <a href="#work" className="btn">
            View My Work <ArrowRight />
          </a>
          <button className="play" type="button">
            <span>
              <Play />
            </span>
            Watch Intro
          </button>
        </div>
        <div className="status">
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
