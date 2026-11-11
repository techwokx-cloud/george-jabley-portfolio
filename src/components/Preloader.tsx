"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Brief opening preloader. Only shows when the inline <head> script marked the
 * page as `loading` (first visit this session, motion allowed). The head script
 * also has a hard failsafe, so a script failure can never block the page.
 */
export default function Preloader() {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("loading")) {
      root.classList.add("ready");
      return;
    }
    const start = performance.now();
    const MIN = 1100; // keep it brief: no artificial long delay
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);
    let raf = 0;
    let done = false;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / MIN);
      const eased = 1 - Math.pow(1 - t, 3);
      // hold at 92% until the page has actually finished loading
      const target = loaded ? eased : Math.min(eased, 0.92);
      const value = Math.round(target * 100);
      setPct(value);
      if (bar.current) bar.current.style.transform = `scaleX(${target})`;
      if (t >= 1 && loaded && !done) {
        done = true;
        setLeaving(true);
        window.setTimeout(() => {
          root.classList.remove("loading");
          root.classList.add("ready");
          try { sessionStorage.setItem("gj_pre", "1"); } catch {}
        }, 750);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div className={`preloader${leaving ? " leaving" : ""}`} aria-hidden="true">
      <div className="pre-inner">
        <div className="pre-logo">
          GJ<i>.</i>
        </div>
        <div className="pre-row">
          <span>Loading Portfolio</span>
          <span className="pre-pct">{pct}%</span>
        </div>
        <div className="pre-track">
          <span ref={bar} />
        </div>
      </div>
    </div>
  );
}
