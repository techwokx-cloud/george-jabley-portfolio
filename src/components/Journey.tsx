import type { Project } from "../lib/projects";

// Draft biography — written only from facts George has stated. Review before publishing.
const bio = [
  "I'm George Jabley, a technology professional based in Accra, Ghana, with more than 25 years in the industry — 16+ of them in IT support, infrastructure and technical operations. Along the way I've supported hotels, SMEs and NGOs with business email, security audits and day-to-day IT, and I founded TechWokx, an IT consultancy serving organisations across Ghana.",
  "For about a year I've focused on building software with AI: full-stack web applications, AI-powered assistants and automation tools, using Next.js, TypeScript, Node.js and Python. WingBM, BridgeAI and ChiefFlow AI are where that new chapter shows most clearly.",
  "I enjoy problems that sit between operations and software. Years of seeing how real businesses actually run help me build tools that are practical, dependable and easy to adopt. I'm open to remote opportunities as a Junior AI Software Developer.",
];

const facts = [
  ["25+", "years in technology"],
  ["16+", "years in IT support & infrastructure"],
  ["~1", "year building AI products"],
];

export default function Journey({ projects }: { projects: Project[] }) {
  const timeline = projects
    .filter((p) => p.period && !Number.isNaN(Date.parse(`1 ${p.period}`)))
    .sort((a, b) => Date.parse(`1 ${a.period}`) - Date.parse(`1 ${b.period}`));

  return (
    <section id="journey" className="journey" data-section>
      <div className="jl">
        <div className="eyebrow" data-reveal>MY JOURNEY</div>
        <h2 className="h2" data-lines>
          <span className="ln"><span>From IT support to</span></span>
          <span className="ln"><span style={{ ["--d" as string]: "0.12s" }}>AI software<span className="o">.</span></span></span>
        </h2>
        {bio.map((t, i) => (
          <p key={i} data-reveal style={{ ["--d" as string]: `${0.1 + i * 0.12}s` }}>{t}</p>
        ))}
      </div>

      <div className="jr" data-reveal style={{ ["--d" as string]: "0.2s" }}>
        <ul className="facts">
          {facts.map(([n, l]) => (
            <li key={n}>
              <b>{n}</b>
              <span>{l}</span>
            </li>
          ))}
        </ul>
        {timeline.length > 0 && (
          <div className="tl" data-gate>
            <h3>RECENT WORK</h3>
            <ol>
              {timeline.map((p) => (
                <li key={p.id}>
                  <time>{p.period}</time>
                  <span>{p.name}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
