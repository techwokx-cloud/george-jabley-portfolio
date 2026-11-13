"use client";

import { useState } from "react";
import { Download, FileText, Link2, Check } from "lucide-react";

/** Resume download + printable portfolio page + copyable link. */
export default function DocLinks({ resume }: { resume: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const url = `${window.location.origin}/portfolio`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const t = document.createElement("textarea");
      t.value = url;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };
  return (
    <div className="doclinks">
      <a className="dl primary" href={resume} download target="_blank" rel="noopener noreferrer"><Download /> Download Resume</a>
      <a className="dl" href="/George-Jabley-Portfolio.pdf" download><FileText /> Portfolio PDF</a>
      <a className="dl" href="/portfolio" target="_blank" rel="noopener noreferrer"><FileText /> View printable portfolio</a>
      <button type="button" className="dl" onClick={copy}>{copied ? <Check /> : <Link2 />} {copied ? "Link copied" : "Copy portfolio link"}</button>
    </div>
  );
}
