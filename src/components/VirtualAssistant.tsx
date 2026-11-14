import { siGmail, siGooglecalendar, siCalendly, siZoom, siWhatsapp, siTrello, siAsana, siClickup, siNotion, siHubspot, siMeta, siBuffer, siWordpress, siQuickbooks } from "simple-icons";
import { ArrowRight } from "lucide-react";
import { Brand } from "../lib/icons";
import { va } from "../data/content";

const ICONS: Record<string, Parameters<typeof Brand>[0]["icon"]> = {
  Gmail: siGmail, "Google Calendar": siGooglecalendar, Calendly: siCalendly, Zoom: siZoom, "WhatsApp Business": siWhatsapp,
  Trello: siTrello, Asana: siAsana, ClickUp: siClickup, Notion: siNotion, HubSpot: siHubspot, "Meta Business Suite": siMeta,
  Buffer: siBuffer, WordPress: siWordpress, QuickBooks: siQuickbooks,
};
const DOTS: Record<string, string> = {
  Outlook: "#0078D4", "Microsoft Teams": "#6264A7", Slack: "#4A154B", Canva: "#00C4CC", "Google Workspace": "#4285F4", "Microsoft 365": "#D83B01",
};

function Tool({ name }: { name: string }) {
  const icon = ICONS[name];
  return (
    <li className="vt">
      {icon ? <Brand icon={icon} size={16} /> : <span className="vdot" style={{ background: DOTS[name] || "#888" }}>{name[0]}</span>}
      {name}
    </li>
  );
}

export default function VirtualAssistant() {
  return (
    <section id="va" className="va" data-section>
      <div className="eyebrow" data-reveal>{va.eyebrow}</div>
      <h2 className="h2" data-lines>
        <span className="ln"><span>Also available for</span></span>
        <span className="ln"><span style={{ ["--d" as string]: "0.12s" }}>Virtual Assistance<span className="o">.</span></span></span>
      </h2>
      <p className="vp" data-reveal style={{ ["--d" as string]: "0.16s" }}>{va.body}</p>

      <ul className="vsv">
        {va.services.map((s, i) => (
          <li key={s} data-reveal style={{ ["--d" as string]: `${0.1 + i * 0.05}s` }}>{s}</li>
        ))}
      </ul>

      <div className="vgrid">
        {va.tools.map((g, gi) => (
          <div key={g.label} data-reveal style={{ ["--d" as string]: `${0.1 + gi * 0.1}s` }}>
            <h4>{g.label}</h4>
            <ul>{g.items.map((t) => <Tool key={t} name={t} />)}</ul>
          </div>
        ))}
      </div>

      <button type="button" className="btn vbtn" data-contact>
        {va.cta} <ArrowRight />
      </button>
    </section>
  );
}
