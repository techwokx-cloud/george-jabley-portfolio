"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const embed = (u: string) => {
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
  const vm = u.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
  return "";
};

/** "Watch Intro": plays the video uploaded in /admin; without one it scrolls to the story section. */
export default function IntroModal({ url }: { url: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-intro]")) return;
      e.preventDefault();
      if (url) setOpen(true);
      else document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [url]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !url) return null;
  const iframe = embed(url);
  return (
    <div className="cm-back" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="iv" role="dialog" aria-modal="true" aria-label="Introduction video">
        <button type="button" className="cm-x" aria-label="Close video" onClick={() => setOpen(false)}><X /></button>
        {iframe ? (
          <iframe src={iframe} title="Introduction video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        ) : (
          <video src={url} controls autoPlay playsInline preload="metadata" />
        )}
      </div>
    </div>
  );
}
