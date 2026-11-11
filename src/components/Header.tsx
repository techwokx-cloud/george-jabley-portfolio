import { ArrowRight, Moon } from "lucide-react";
import { nav } from "../data/content";

const navX = [8, 69, 124, 202, 253, 327]; // text x-offsets from the nav origin (mockup positions)

export default function Header() {
  return (
    <header className="header">
      <div className="inner">
        <a href="#home" className="logo" aria-label="George Jabley">
          GJ<i>.</i>
        </a>
        <nav className="nav" aria-label="Primary">
          {nav.map((n, i) => (
            <a key={n.href} href={n.href} className={i === 0 ? "active" : undefined} style={{ left: navX[i] }}>
              {n.label}
            </a>
          ))}
        </nav>
        <button className="toggle" aria-label="Toggle theme" type="button">
          <Moon />
          <small>●</small>
        </button>
        <a href="#contact" className="talk">
          Let&apos;s Talk <ArrowRight />
        </a>
      </div>
    </header>
  );
}
