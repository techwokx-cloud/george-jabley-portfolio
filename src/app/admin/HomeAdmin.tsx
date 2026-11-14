"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { dueLabel, type App } from "./JobsAdmin";
import type { Tab } from "./Shell";

type Light = Pick<App, "id" | "company" | "role" | "status" | "follow_up" | "applied_on">;

export default function HomeAdmin({
  apps, leadsNew, projects, go, openJob, newProject,
}: { apps: Light[]; leadsNew: number; projects: number; go: (t: Tab) => void; openJob: (id?: string) => void; newProject: () => void }) {
  const [status, setStatus] = useState<{ ai: boolean; send: boolean; notify: boolean } | null>(null);

  useEffect(() => {
    (async () => {
      const t = (await supabase?.auth.getSession())?.data.session?.access_token;
      if (!t) return;
      const r = await fetch("/api/admin-status", { headers: { Authorization: `Bearer ${t}` } }).catch(() => null);
      if (r?.ok) setStatus(await r.json());
    })();
  }, []);

  const h = new Date().getHours();
  const hello = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const due = apps.filter((a) => dueLabel(a)).sort((a, b) => (a.follow_up ?? "").localeCompare(b.follow_up ?? "")).slice(0, 6);
  const overdue = apps.filter((a) => dueLabel(a)?.cls === "a-over").length;

  return (
    <>
      <div className="a-card a-hello">
        <h2>{hello}, George.</h2>
        <div className="a-muted">{overdue ? `${overdue} follow-up${overdue > 1 ? "s need" : " needs"} attention today.` : "Nothing overdue. Nice."}</div>
        <div className="a-quick">
          <button className="a-primary" onClick={() => openJob()}>+ Application</button>
          <button onClick={newProject}>+ Project</button>
          <button onClick={() => go("leads")}>Leads</button>
        </div>
      </div>

      <div className="a-stats">
        <div><b>{apps.filter((a) => a.applied_on && a.applied_on >= weekAgo).length}</b><span>Applied this week</span></div>
        <div><b>{apps.filter((a) => a.status === "Interview").length}</b><span>Interviews</span></div>
        <div><b>{leadsNew}</b><span>New leads</span></div>
        <div className="wide"><b>{projects} projects · {apps.length} applications</b><span>On the portfolio · tracked</span></div>
      </div>

      <div className="a-card">
        <h2>Follow-ups</h2>
        {due.length === 0 && <div className="a-muted">No follow-ups scheduled. Applied jobs get a reminder automatically.</div>}
        <div className="a-list" style={{ marginTop: 8 }}>
          {due.map((a) => {
            const d = dueLabel(a)!;
            return (
              <button key={a.id} className="a-item" onClick={() => openJob(a.id)}>
                <div className="a-item-main"><b>{a.company || "—"}</b><span>{a.role}</span></div>
                <div className="a-item-side"><span className={`a-due-chip ${d.cls}`}>{d.text}</span></div>
              </button>
            );
          })}
        </div>
      </div>

      {status && (
        <div className="a-card">
          <h2>Setup</h2>
          <ul className="a-check">
            <li className={status.ai ? "a-yes" : "a-no"}>AI cover letters {status.ai ? "ready" : "— add GROQ_API_KEY in Vercel (template letters until then)"}</li>
            <li className={status.send ? "a-yes" : "a-no"}>Send applications from here {status.send ? "ready" : "— needs RESEND_API_KEY and a verified sender (APPLY_FROM). “Open in Gmail” works meanwhile"}</li>
            <li className={status.notify ? "a-yes" : "a-no"}>Email me contact-form messages {status.notify ? "ready" : "— add RESEND_API_KEY and CONTACT_TO_EMAIL (messages are still saved in Leads)"}</li>
          </ul>
        </div>
      )}
    </>
  );
}
