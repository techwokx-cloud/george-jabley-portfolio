"use client";

import { useEffect, useState } from "react";

/** Footer switch. Animations are ON by default; visitors who prefer calm can turn them off. */
export default function MotionToggle() {
  const [off, setOff] = useState(false);
  useEffect(() => setOff(document.documentElement.classList.contains("reduce-motion")), []);
  const flip = () => {
    const next = !off;
    try { localStorage.setItem("gj_motion", next ? "off" : "on"); } catch {}
    window.location.reload();
  };
  return (
    <button type="button" className="mtoggle" onClick={flip} aria-pressed={off}>
      Animations: {off ? "Off" : "On"}
    </button>
  );
}
