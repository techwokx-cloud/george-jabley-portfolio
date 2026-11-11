"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop-only cursor: small dot + lagging ring. The ring turns into a labelled
 * disc over elements with data-cursor="…" (e.g. "View Project") and grows over
 * links/buttons. Disabled on touch devices and when custom cursors can't work.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("has-cursor");

    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      root.classList.add("cursor-on");
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
    };
    const loop = () => {
      rx += (x - rx) * (reduce ? 1 : 0.16);
      ry += (y - ry) * (reduce ? 1 : 0.16);
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const over = (e: MouseEvent) => {
      const t = e.target as Element | null;
      const tagged = t?.closest<HTMLElement>("[data-cursor]");
      const link = t?.closest("a,button,[role=tab]");
      ring.current?.classList.toggle("is-label", !!tagged);
      ring.current?.classList.toggle("is-link", !tagged && !!link);
      if (label.current) label.current.textContent = tagged?.dataset.cursor ?? "";
    };
    const leave = () => root.classList.remove("cursor-on");

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor", "cursor-on");
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <span ref={label} />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
