"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Moon } from "lucide-react";
import { nav } from "../data/content";

const navX = [8, 69, 124, 202, 253, 327]; // text x-offsets from the nav origin (mockup positions)
const widths = [28, 26, 47, 24, 47, 33];  // approximate link widths for the first paint

// Which nav item each page region highlights (Experience shares the About region)
const spy: Record<string, string> = { home: "#home", about: "#about", work: "#work", "case-study": "#work", stack: "#stack" };

export default function Header() {
  const [active, setActive] = useState("#home");
  const [ind, setInd] = useState({ left: 0, width: 44 });
  const links = useRef<(HTMLAnchorElement | null)[]>([]);

  // scrollspy: update the active item as sections enter view (no scroll hijacking)
  useEffect(() => {
    const ids = Object.keys(spy);
    const onScroll = () => {
      const y = window.innerHeight * 0.35;
      let cur = "#home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= y) cur = spy[id];
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) cur = "#contact";
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // slide the underline to the active link
  useEffect(() => {
    const i = nav.findIndex((n) => n.href === active);
    const el = links.current[i];
    if (el) setInd({ left: el.offsetLeft - 8, width: el.offsetWidth + 16 });
  }, [active]);

  return (
    <header className="header">
      <div className="inner">
        <a href="#home" className="logo" aria-label="George Jabley">
          GJ<i>.</i>
        </a>
        <nav className="nav" aria-label="Primary">
          {nav.map((n, i) => (
            <a
              key={n.href}
              href={n.href}
              ref={(el) => { links.current[i] = el; }}
              className={active === n.href ? "active" : undefined}
              aria-current={active === n.href ? "true" : undefined}
              style={{ left: navX[i] }}
            >
              {n.label}
            </a>
          ))}
          <i className="nav-ind" style={{ left: ind.left || navX[0] - 8, width: ind.width || widths[0] + 16 }} />
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
