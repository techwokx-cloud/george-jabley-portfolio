"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Download, ExternalLink, FolderKanban, House, Briefcase, Megaphone, MoreHorizontal, LogOut, Award, X, Share } from "lucide-react";

export type Tab = "home" | "projects" | "jobs" | "leads" | "creds";

const TITLES: Record<Tab, string> = { home: "Home", projects: "Projects", jobs: "Jobs", leads: "Leads & Ads", creds: "Certificates & Resume" };

/** Desktop: top bar + tabs. Mobile: app bar (with Back), bottom navigation and a "More" sheet — like a native app. */
export default function Shell({
  tab, setTab, email, onSignOut, badges,
}: {
  tab: Tab; setTab: (t: Tab) => void; email?: string; onSignOut: () => void; badges: { jobs: number; leads: number; projects: number };
}) {
  const [sub, setSub] = useState("");
  const [sheet, setSheet] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const onSub = (e: Event) => setSub((e as CustomEvent<string>).detail || "");
    const sync = () => setCanInstall(!!window.__a2hs);
    window.addEventListener("adm-sub", onSub);
    window.addEventListener("a2hs-ready", sync);
    sync();
    setStandalone(window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    return () => { window.removeEventListener("adm-sub", onSub); window.removeEventListener("a2hs-ready", sync); };
  }, []);

  const install = async () => {
    const p = window.__a2hs;
    if (!p) return;
    await p.prompt();
    await p.userChoice.catch(() => null);
    window.__a2hs = undefined;
    setCanInstall(false);
    setSheet(false);
  };
  const go = (t: Tab) => { setSheet(false); setTab(t); window.scrollTo({ top: 0 }); };

  const Nav = ({ t, icon, label, badge }: { t: Tab; icon: React.ReactNode; label: string; badge?: number }) => (
    <button className={`a-bn${tab === t ? " a-on" : ""}`} onClick={() => go(t)} aria-current={tab === t ? "page" : undefined}>
      <span className="a-bi">{icon}{!!badge && <em>{badge > 9 ? "9+" : badge}</em>}</span>
      {label}
    </button>
  );

  return (
    <>
      {/* desktop header + tabs */}
      <header className="a-top a-desk">
        <div className="a-brand"><h1>Admin<i>.</i></h1><span className="a-sub">Portfolio dashboard</span></div>
        <div className="a-row">
          {canInstall && !standalone && <button onClick={install}><Download size={14} style={{ verticalAlign: -2 }} /> Install app</button>}
          <a className="a-link" href="/" target="_blank" rel="noopener noreferrer">View site ↗</a>
          <span className="a-muted a-email">{email}</span>
          <button onClick={onSignOut}>Sign out</button>
        </div>
      </header>
      <nav className="a-tabs a-desk" aria-label="Sections">
        {(["home", "projects", "jobs", "leads", "creds"] as Tab[]).map((t) => (
          <button key={t} className={`a-tab${tab === t ? " a-on" : ""}`} onClick={() => go(t)}>
            {TITLES[t]}
            {t === "projects" && <em>{badges.projects}</em>}
            {t === "jobs" && badges.jobs > 0 && <em className="a-due">{badges.jobs}</em>}
            {t === "leads" && badges.leads > 0 && <em className="a-due">{badges.leads}</em>}
          </button>
        ))}
      </nav>

      {/* mobile app bar */}
      <header className="a-appbar a-mob">
        {sub ? (
          <button className="a-ab-btn" aria-label="Back" onClick={() => history.back()}><ChevronLeft /></button>
        ) : (
          <span className="a-logo">GJ<i>.</i></span>
        )}
        <h1>{sub || TITLES[tab]}</h1>
        <button className="a-ab-btn" aria-label="Menu" onClick={() => setSheet(true)}><MoreHorizontal /></button>
      </header>

      {/* mobile bottom navigation */}
      <nav className="a-bottom a-mob" aria-label="Sections">
        <Nav t="home" icon={<House />} label="Home" />
        <Nav t="projects" icon={<FolderKanban />} label="Projects" />
        <Nav t="jobs" icon={<Briefcase />} label="Jobs" badge={badges.jobs} />
        <Nav t="leads" icon={<Megaphone />} label="Leads" badge={badges.leads} />
        <button className={`a-bn${tab === "creds" ? " a-on" : ""}`} onClick={() => setSheet(true)}>
          <span className="a-bi"><MoreHorizontal /></span>More
        </button>
      </nav>

      {sheet && (
        <div className="a-sheet-back" onClick={() => setSheet(false)}>
          <div className="a-sheet" role="dialog" aria-label="Menu" onClick={(e) => e.stopPropagation()}>
            <div className="a-sheet-h"><b>Menu</b><button className="a-ab-btn" aria-label="Close" onClick={() => setSheet(false)}><X /></button></div>
            <button className="a-sl" onClick={() => go("creds")}><Award /> Certificates &amp; Resume</button>
            <a className="a-sl" href="/" target="_blank" rel="noopener noreferrer"><ExternalLink /> View website</a>
            {canInstall && !standalone && <button className="a-sl" onClick={install}><Download /> Install this app</button>}
            {ios && !standalone && <div className="a-hint"><Share size={14} /> To install on iPhone: tap Share, then “Add to Home Screen”.</div>}
            <div className="a-hint">{email}</div>
            <button className="a-sl a-out" onClick={onSignOut}><LogOut /> Sign out</button>
          </div>
        </div>
      )}
    </>
  );
}
