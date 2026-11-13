"use client";

import { useEffect } from "react";
import { reduced } from "../lib/motion";

/**
 * Drives CSS-based motion:
 *  - [data-reveal]  → gets `data-in` when scrolled into view (once)
 *  - [data-hero]    → gets `data-in` when the page is `ready` (after the preloader)
 * Content is only hidden while <html> has `.js`; a failsafe reveals everything
 * if anything goes wrong, so nothing can stay invisible.
 */
export default function MotionRoot() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = reduced();

    const show = (el: Element) => {
      el.setAttribute("data-in", "");
      // drop the stagger delay afterwards so hover transitions aren't delayed
      window.setTimeout(() => (el as HTMLElement).style.removeProperty("--d"), 1600);
    };

    // split paragraphs into words so they can animate (static, server-rendered blocks only)
    const split = (el: Node, counter: { n: number }) => {
      Array.from(el.childNodes).forEach((node) => {
        if (node.nodeType === 3) {
          const txt = node.textContent || "";
          if (!txt.trim()) return;
          const frag = document.createDocumentFragment();
          txt.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
            else {
              const w = document.createElement("span");
              w.className = "w";
              w.style.setProperty("--w", String(counter.n++));
              w.textContent = part;
              frag.appendChild(w);
            }
          });
          node.parentNode?.replaceChild(frag, node);
        } else if (node.nodeType === 1 && (node as Element).tagName !== "BR") {
          split(node, counter);
        }
      });
    };
    if (!reduce) {
      document
        .querySelectorAll(".hero .sub, .about .p, .journey .jl p, .stack .p, .stack .any p, .stack .cta p, .case .left .p")
        .forEach((el) => !el.querySelector(".w") && split(el, { n: 0 }));
    }

    const heroEls = () => Array.from(document.querySelectorAll("[data-hero]"));
    const revealHero = () => heroEls().forEach(show);

    if (reduce) {
      document.querySelectorAll("[data-reveal],[data-hero],[data-lines],[data-gate],[data-section]").forEach((el) => el.setAttribute("data-in", ""));
      return;
    }

    // hero: wait for the preloader curtain
    let heroDone = false;
    const heroNow = () => {
      if (heroDone) return;
      heroDone = true;
      revealHero();
    };
    if (root.classList.contains("ready")) heroNow();
    const mo = new MutationObserver(() => root.classList.contains("ready") && heroNow());
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });

    // scroll reveals
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll("[data-reveal],[data-lines],[data-gate],[data-section]").forEach((el) => io.observe(el));

    // failsafe: never leave content hidden
    const t = window.setTimeout(() => {
      heroNow();
    }, 6000);

    return () => {
      mo.disconnect();
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return null;
}
