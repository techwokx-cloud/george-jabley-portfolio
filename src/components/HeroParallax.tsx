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
    const leave = () => {
      hero.style.setProperty("--mx", "0");
      hero.style.setProperty("--my", "0");
    };
    hero.addEventListener("mousemove", move, { passive: true });
    hero.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("mousemove", move);
      hero.removeEventListener("mouseleave", leave);
    };
  }, []);
  return null;
}
