import type { Metadata } from "next";
import { site, stack, contact } from "../../data/content";
import { getProjects } from "../../lib/projects";
import { getCredentials } from "../../lib/credentials";
import PrintBar from "./PrintBar";
import "./portfolio.css";

export const revalidate = 60;
export const metadata: Metadata = { title: "Portfolio · George Jabley", description: site.description };

const bio =
  "Technology professional based in Accra, Ghana, with 25+ years in technology and 16+ years in IT support and infrastructure. Founder of TechWokx Ghana. For about a year I have been building AI-powered software and automation with Next.js, TypeScript, Node.js and Python. Open to remote opportunities as a Junior AI Software Developer.";

export default async function PortfolioPage() {
  const [projects, creds] = await Promise.all([getProjects(), getCredentials()]);
  return (
    <div className="pf">
      <PrintBar />
      <header>
        <h1>George Jabley<i>.</i></h1>
        <p className="role">Junior AI Software Developer · Technology enthusiast · Problem solver</p>
        <p className="meta">{site.location} · WhatsApp +{contact.whatsapp.replace(/^(\d{3})(\d{2})(\d{3})(\d{4})$/, "$1 $2 $3 $4")} · github.com/techwokx-cloud</p>
      </header>

      <section><h2>Profile</h2><p>{bio}</p>
        <ul className="stats"><li><b>25+</b> years in technology</li><li><b>16+</b> years in IT support</li><li><b>~1</b> year in AI development</li></ul>
      </section>

      <section><h2>Selected work</h2>
        <div className="pgrid">
          {projects.map((p) => (
            <article key={p.id}>
              <h3>{p.name} <span>{p.status}</span></h3>
              <p className="k">{p.kind} · {p.tagline}</p>
              {p.description && <p>{p.description}</p>}
              {p.url && <p className="u">{p.url}</p>}
            </article>
          ))}
        </div>
      </section>

      <section><h2>Certificates, hackathons &amp; events</h2>
        <ul className="plain">
          {creds.map((c) => (
            <li key={c.id}><b>{c.title}</b>{c.issuer && c.issuer !== c.title ? ` — ${c.issuer}` : ""}{c.date ? ` (${c.date})` : ""}</li>
          ))}
        </ul>
      </section>

      <section><h2>Tools &amp; technologies</h2>
        {stack.groups.map((g) => (
          <p key={g.label}><b>{g.label}:</b> {g.items.join(", ")}</p>
        ))}
        <p>{stack.any.body}</p>
      </section>
    </div>
  );
}
