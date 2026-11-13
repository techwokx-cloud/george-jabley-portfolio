import type { ReactNode } from "react";

/** Decorative code layers behind the hero portrait. Lines react to the cursor (see HeroParallax). */
const BLOCKS: { id: string; x: number; y: number; depth: number; lines: string[] }[] = [
  {
    id: "server", x: 196, y: 64, depth: 14,
    lines: [
      '// server.ts',
      'import express from "express";',
      'const app = express();',
      'app.post("/api/chat", async (req, res) => {',
      '  const reply = await llm.complete({',
      '    model: "claude",',
      '    prompt: req.body.prompt,',
      '  });',
      '  res.json({ reply });',
      '});',
      'app.listen(3000);',
    ],
  },
  {
    id: "llm", x: 410, y: 14, depth: 22,
    lines: [
      '# agent.py',
      'from openai import OpenAI',
      'client = OpenAI()',
      'def ask(question):',
      '    r = client.responses.create(',
      '        model="gpt", input=question)',
      '    return r.output_text',
    ],
  },
  {
    id: "api", x: 206, y: 262, depth: 8,
    lines: [
      '// app/api/projects/route.ts',
      'export async function GET() {',
      '  const { data } = await supabase',
      '    .from("projects").select("*");',
      '  return Response.json(data);',
      '}',
    ],
  },
  {
    id: "ops", x: 190, y: 372, depth: 18,
    lines: [
      '$ ssh root@vps "systemctl restart nginx"',
      '$ docker compose up -d --build',
      'GET /api/health 200 12ms',
      'POST /api/chat 200 418ms',
    ],
  },
];

const TOKEN = /(\/\/.*|#.*|\$ )|("[^"]*"|'[^']*')|\b(import|from|const|let|await|async|return|export|def|function|new|if|else)\b|\b(\d+ms|\d{3,}|\d+)\b|([A-Za-z_][\w.]*)(?=\()/g;

function hl(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const cls = m[1] ? "c" : m[2] ? "s" : m[3] ? "k" : m[4] ? "n" : "f";
    out.push(<i key={m.index} className={`t-${cls}`}>{m[0]}</i>);
    last = m.index + m[0].length;
    if (m[1] && m[1].startsWith("//") || (m[1] && m[1].startsWith("#"))) { last = line.length; break; }
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export default function CodeField() {
  let n = 0;
  return (
    <div className="codefield" aria-hidden>
      {BLOCKS.map((b) => (
        <div key={b.id} className="cb" style={{ left: b.x, top: b.y, ["--dp" as string]: b.depth }}>
          {b.lines.map((l) => (
            <span key={l} className="cl" style={{ ["--i" as string]: n++ }}>{hl(l)}{" "}</span>
          ))}
        </div>
      ))}
    </div>
  );
}
