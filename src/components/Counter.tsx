"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up once when scrolled into view. Screen readers get the final value only. */
export default function Counter({ to, prefix = "", suffix = "", duration = 1400 }: { to: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to); // final value by default (SSR / no-JS / reduced motion)

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setN(Math.round((1 - Math.pow(1 - t, 3)) * to));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref}>
      <span className="sr-only">{`${prefix}${to}${suffix}`}</span>
      <span aria-hidden="true">{`${prefix}${n}${suffix}`}</span>
    </span>
  );
}
