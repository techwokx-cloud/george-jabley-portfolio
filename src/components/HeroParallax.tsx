"use client";

import { useEffect } from "react";
import { reduced } from "../lib/motion";

/** Desktop-only: nudges hero layers with the pointer (sets --mx/--my on .hero). */
export default function HeroParallax() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    if (!hero) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (reduced()) return;
    let raf = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
        hero.style.setProperty("--mx", x.toFixed(3));
        hero.style.setProperty("--my", y.toFixed(3));
      });
    };
    // code lines glow / slide as the cursor passes over them
    let lines: HTMLElement[] = [];
    const collect = () => (lines = Array.from(hero.querySelectorAll<HTMLElement>(".hero-art .cl, .hero-art .code > span")));
    collect();
    const heat = (e: MouseEvent) => {
      for (const el of lines) {
        const r = el.getBoundingClientRect();
        const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right) * 0.35;
        const dy = e.clientY - (r.top + r.height / 2);
        const v = Math.max(0, 1 - Math.hypot(dx, dy) / 46);
        el.style.setProperty("--h", v.toFixed(2));
      }
    };
    hero.addEventListener("mousemove", heat, { passive: true });
    const leave = () => {
      lines.forEach((el) => el.style.setProperty("--h", "0"));
      hero.style.setProperty("--mx", "0");
      hero.style.setProperty("--my", "0");
    };
    hero.addEventListener("mousemove", move, { passive: true });
    hero.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("mousemove", move);
      hero.removeEventListener("mousemove", heat);
      hero.removeEventListener("mouseleave", leave);
    };
  }, []);
  return null;
}
