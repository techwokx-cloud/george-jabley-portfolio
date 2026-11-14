"use client";

import { useEffect } from "react";
import { reduced } from "../lib/motion";

/** Adds a "curtain" to every section that lifts as the section scrolls in, and replays when a menu link jumps to it. */
export default function Curtains() {
  useEffect(() => {
    if (reduced()) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    sections.forEach((sec, i) => {
      if (sec.querySelector(":scope > .curtain")) return;
      const label = (sec.querySelector(".eyebrow")?.textContent || sec.id || "").replace(/[·•].*$/, "").trim();
      const c = document.createElement("i");
      c.className = `curtain ${i % 2 ? "c2" : "c1"}`;
      c.setAttribute("aria-hidden", "true");
      c.innerHTML = `<b>${String(i + 1).padStart(2, "0")}</b><span>${label}</span>`;
      sec.appendChild(c);
    });

    let flip = false;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const id = a?.getAttribute("href")?.slice(1);
      const sec = id ? document.getElementById(id) : null;
      const c = sec?.querySelector<HTMLElement>(":scope > .curtain");
      if (!c) return;
      window.setTimeout(() => {
        flip = !flip;
        c.classList.remove("rp1", "rp2");
        void c.offsetWidth;
        c.classList.add(flip ? "rp1" : "rp2");
      }, 450);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
