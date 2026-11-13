import type { ReactNode } from "react";
import {
  siNextdotjs, siReact, siNodedotjs, siPython, siDocker, siLinux, siTypescript,
  siGithub, siYoutube, siGnubash, siTailwindcss, siSupabase, siVercel, siRender,
  siClaude, siGooglegemini, siDeepseek, siGithubcopilot, siPhp, siHtml5, siCss, siBootstrap, siFlutter, siNginx, siApache, siGit,
} from "simple-icons";

type Si = { path: string; hex: string };

export function Brand({ icon, size = 18, color, className }: { icon: Si; size?: number; color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill={color ?? `#${icon.hex}`} aria-hidden>
      <path d={icon.path} />
    </svg>
  );
}

export const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

export function Social({ icon, size = 20 }: { icon: string; size?: number }) {
  if (icon === "github") return <Brand icon={siGithub} size={size} color="currentColor" />;
  if (icon === "youtube") return <Brand icon={siYoutube} size={size} color="currentColor" />;
  return <Brand icon={{ path: LINKEDIN_PATH, hex: "fff" }} size={size} color="currentColor" />;
}

/* Hand-drawn glyphs for tools without a clean brand mark */
const Terminal = ({ s }: { s: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="2.2" /><ellipse cx="12" cy="12" rx="9" ry="3.6" /><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
  </svg>
);
const AiMark = ({ s }: { s: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="2" fill="#f59e0b" />
    {[0, 60, 120, 180, 240, 300].map((a) => (
      <g key={a} transform={`rotate(${a} 12 12)`}><path d="M12 10V4.5" /><circle cx="12" cy="3.6" r="1.4" /></g>
    ))}
  </svg>
);
const OpenAiMark = ({ s }: { s: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="#10c9a0" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
    {[0, 60, 120].map((a) => (<path key={a} transform={`rotate(${a} 12 12)`} d="M12 3.2l6.6 3.8v7.6L12 18.4 5.4 14.6V7z" />))}
  </svg>
);
const VsCode = ({ s }: { s: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden>
    <path fill="#2489ca" d="M17.5 2.2 9.8 9.3 5.2 5.8 3.6 6.6v10.8l1.6.8 4.6-3.5 7.7 7.1 3.4-1.6V3.8z" />
    <path fill="#0b1e2d" d="M17.5 7.6v8.8L12.2 12z" opacity=".55" />
    <path fill="#fff" d="M17.5 7.7v8.6L11.6 12z" opacity=".9" />
  </svg>
);
const PowerShell = ({ s }: { s: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden>
    <path fill="#2f86d6" d="M3.2 4h16.6c.9 0 1.4.9 1.1 1.7l-3.6 13.7c-.2.6-.7 1-1.4 1H1.4c-.8 0-1.4-.8-1.1-1.6L3.2 4z" transform="translate(1.2 -.4)" />
    <path fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7.6 8l5.2 4.2-6.2 4.6M12.8 17.6h5" />
  </svg>
);
const Vps = ({ s }: { s: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
    <rect x="3" y="3.5" width="18" height="6.2" rx="1.6" /><rect x="3" y="12.3" width="18" height="6.2" rx="1.6" />
    <circle cx="6.8" cy="6.6" r=".9" fill="#38bdf8" /><circle cx="6.8" cy="15.4" r=".9" fill="#38bdf8" /><path d="M11 6.6h6M11 15.4h6M12 21h0" />
  </svg>
);
const CloudMark = ({ s, dark }: { s: number; dark?: boolean }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill={dark ? "#1d1e23" : "#e5e7eb"} aria-hidden>
    <path d="M7 18a5 5 0 0 1-.6-9.96A6 6 0 0 1 18 9.5a4.2 4.2 0 0 1-.4 8.4V18H7z" /><path d="M12 10.5v5m0 0-2-2m2 2 2-2" stroke={dark ? "#fff" : "#111"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function toolIcon(name: string, size = 18, onLight = false): ReactNode {
  switch (name) {
    case "Next.js": return <Brand icon={siNextdotjs} size={size} color="#fff" className="toolicon-next" />;
    case "React": return <Brand icon={siReact} size={size} />;
    case "Node.js": return <Brand icon={siNodedotjs} size={size} />;
    case "Python": return <Brand icon={siPython} size={size} />;
    case "Docker": return <Brand icon={siDocker} size={size} />;
    case "Linux": return <Brand icon={siLinux} size={size} color={onLight ? "#1f3a4d" : undefined} />;
    case "TypeScript": return <Brand icon={siTypescript} size={size} />;
    case "AI/LLM": return <AiMark s={size} />;
    case "Tailwind CSS": return <Brand icon={siTailwindcss} size={size} />;
    case "Supabase": return <Brand icon={siSupabase} size={size} />;
    case "Vercel": return <Brand icon={siVercel} size={size} color="#fff" />;
    case "Render": return <Brand icon={siRender} size={size} color="#fff" />;
    case "GitHub": return <Brand icon={siGithub} size={size} color="#fff" />;
    case "OpenAI API": return <OpenAiMark s={size} />;
    case "Claude": return <Brand icon={siClaude} size={size} />;
    case "ChatGPT": return <OpenAiMark s={size} />;
    case "Gemini": return <Brand icon={siGooglegemini} size={size} />;
    case "DeepSeek": return <Brand icon={siDeepseek} size={size} />;
    case "Copilot": return <Brand icon={siGithubcopilot} size={size} color="#fff" />;
    case "PHP": return <Brand icon={siPhp} size={size} />;
    case "HTML": return <Brand icon={siHtml5} size={size} />;
    case "CSS": return <Brand icon={siCss} size={size} />;
    case "Bootstrap": return <Brand icon={siBootstrap} size={size} />;
    case "Flutter": return <Brand icon={siFlutter} size={size} />;
    case "Nginx": return <Brand icon={siNginx} size={size} />;
    case "Apache": return <Brand icon={siApache} size={size} />;
    case "Git": return <Brand icon={siGit} size={size} />;
    case "Shell Script": return <Brand icon={siGnubash} size={size} color="#4eaa25" />;
    case "VS Code": return <VsCode s={size} />;
    case "PowerShell": return <PowerShell s={size} />;
    case "VPS": return <Vps s={size} />;
    case "Cloud": return <CloudMark s={size} dark={onLight} />;
    default: return <Terminal s={size} />;
  }
}
void siGnubash;
