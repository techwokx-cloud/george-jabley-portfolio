"use client";

import { useEffect, useState } from "react";
import { reduced } from "../lib/motion";

const DOWN = 110; // px per second — a slow, readable scroll
const UP = 320;

/**
 * On the first visit of a session the page scrolls itself slowly to the bottom and back to the top
 * so every section's reveal plays. Any wheel / touch / key / click stops it immediately for good.
 */
export default function AutoTour() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let done = false;
    try { done = !!sessionStorage.getItem("gj_tour"); } catch {}
    if (done || reduced() || location.hash || window.scrollY > 40) return;

    const root = document.documentElement;
    let raf = 0;
    let starter = 0;
    let stopped = false;

    const finish = () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(starter);
      root.classList.remove("touring");
      setOn(false);
      try { sessionStorage.setItem("gj_tour", "1"); } catch {}
      ["wheel", "touchstart", "keydown", "pointerdown", "mousedown"].forEach((t) => window.removeEventListener(t, finish));
    };

    const run = () => {
      if (stopped) return;
      root.classList.add("touring");
      setOn(true);
      let dir: 1 | -1 = 1;
      let pos = window.scrollY;
      let last = performance.now();
      let hold = 0;
      const tick = (now: number) => {
        if (stopped) return;
        const dt = Math.min(now - last, 60) / 1000;
        last = now;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (hold > 0) {
          hold -= dt;
        } else {
          pos += dir * (dir === 1 ? DOWN : UP) * dt;
          if (dir === 1 && pos >= max) { pos = max; dir = -1; hold = 1.4; }
          if (dir === -1 && pos <= 0) { window.scrollTo(0, 0); finish(); return; }
          window.scrollTo(0, pos);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    ["wheel", "touchstart", "keydown", "pointerdown", "mousedown"].forEach((t) => window.addEventListener(t, finish, { passive: true }));

    // wait for the opening preloader / hero reveal, then begin
    const begin = () => {
      if (stopped) return;
      if (!root.classList.contains("ready")) return void (starter = window.setTimeout(begin, 300));
      starter = window.setTimeout(run, 3200);
    };
    begin();
    return finish;
  }, []);

  if (!on) return null;
  return (
    <div className="tour-pill" role="status">
      <i /> Auto tour · scroll, tap or press any key to take over
    </div>
  );
}
