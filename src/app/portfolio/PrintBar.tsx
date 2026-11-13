"use client";

import { useState } from "react";

export default function PrintBar() {
  const [c, setC] = useState(false);
  return (
    <div className="bar noprint">
      <button onClick={() => window.print()}>Save as PDF / Print</button>
      <button
        onClick={async () => {
          try { await navigator.clipboard.writeText(window.location.href); } catch {}
          setC(true);
          setTimeout(() => setC(false), 2000);
        }}
      >
        {c ? "Link copied" : "Copy link"}
      </button>
      <a href="/">← Back to site</a>
    </div>
  );
}
