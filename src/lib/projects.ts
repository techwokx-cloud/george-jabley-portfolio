// Project model, seed data, Supabase loader and the weekly "featured" rotation.
// The site works with no database: if Supabase isn't configured (or fails), SEED is used.

export type Status = "Live" | "Prototype" | "In Development" | "Concept" | "Proposal";

export const STATUSES: Status[] = ["Live", "Prototype", "In Development", "Concept", "Proposal"];
export const KINDS = ["Web App", "Mobile App", "Windows Utility", "AI & Automation", "Client Website", "Experimental"] as const;
export const CATEGORIES = ["Mobile Apps", "Web Apps", "Windows Utilities", "AI & Automation", "Experimental", "Client Websites"] as const;

export type Project = {
  id: string;
  name: string;
  tagline: string;        // short line shown on the card
  headline: string;       // longer line used in the featured case study
  description: string;    // short description (2–3 lines)
  kind: string;           // card badge, e.g. "Web App"
  categories: string[];   // filter categories (a project can have several)
  status: Status;
  url: string;            // optional — empty = card is shown but not clickable
  github: string;         // optional
  image: string;          // card image URL ("" = typographic card, no fake screenshot)
  caseImage: string;      // optional composite image for the featured section
  highlights: string[];   // up to 3 bullets for the featured case study
  period: string;         // optional, e.g. "Aug 2026" (feeds the timeline)
  featuredPool: boolean;  // eligible for the weekly featured rotation
  pinned: boolean;        // force this one to be featured (overrides rotation)
  sort: number;
};

const p = (x: Partial<Project> & Pick<Project, "id" | "name" | "tagline" | "kind" | "status" | "sort">): Project => ({
  headline: "", description: "", categories: [], url: "", github: "", image: "", caseImage: "",
  highlights: [], period: "", featuredPool: false, pinned: false, ...x,
});

// Seed built from the facts in the portfolio brief. Statuses/descriptions are drafts —
// verify and refine them in /admin. No screenshots are invented: cards without an image
// get a typographic treatment until a real image is uploaded.
export const SEED: Project[] = [
  p({
    id: "wingbm", sort: 1, name: "WingBM", tagline: "Business Management Platform", kind: "Web App", status: "Live",
    headline: "Smart Business Management for Growing Businesses",
    description: "Mobile-first business management for small businesses: sales, inventory, expenses and business insights.",
    categories: ["Web Apps"], url: "https://wingbm.vercel.app/", github: "https://github.com/techwokx-cloud",
    image: "/images/work-1.jpg", caseImage: "/images/case-wingbm.jpg",
    highlights: ["Mobile-first design", "Sales and inventory", "Expenses and insights"], featuredPool: true,
  }),
  p({
    id: "bridgeai", sort: 2, name: "BridgeAI", tagline: "Mental Wellbeing Companion", kind: "Mobile App", status: "Prototype",
    headline: "Supportive AI Conversations, One Step at a Time",
    description: "An AI wellbeing companion for supportive conversations, continuity and constructive next steps. A companion, not a replacement for professional support.",
    categories: ["Mobile Apps", "AI & Automation"], url: "https://bridgeai-einf.onrender.com",
    image: "/images/work-2.jpg", highlights: ["Conversations with continuity", "Life Map and action plans", "Privacy built in"], featuredPool: true,
  }),
  p({
    id: "chiefflow", sort: 3, name: "ChiefFlow AI", tagline: "SME Business Assistant", kind: "Web App", status: "Prototype",
    headline: "An AI Assistant for Growing SMEs",
    description: "SME assistant concept for sales intelligence, customer follow-up and reactivation, CRM and WhatsApp workflows.",
    categories: ["Web Apps", "AI & Automation"], image: "/images/work-3.jpg",
    highlights: ["Sales intelligence", "Follow-up and reactivation", "CRM and WhatsApp workflows"], featuredPool: true,
  }),
  p({
    id: "engine", sort: 4, name: "TechWokx AI Business Engine", tagline: "AI Business Platform", kind: "Web App", status: "In Development",
    headline: "One Dashboard for Leads, Content and Automation",
    description: "Dashboard direction covering leads, website scans, conversations, social posts, automation, AI content and reports — built for the TechWokx venture.",
    categories: ["Web Apps", "AI & Automation"], url: "https://techwokx.online",
    highlights: ["Leads and website scans", "Conversations and social posts", "Automation, AI content, reports"], featuredPool: true,
  }),
  p({
    id: "scanner", sort: 5, name: "TechWokx AI Website Scanner", tagline: "Website Analysis Tool", kind: "Web App", status: "Live",
    description: "A website scanner on the TechWokx site that analyses a business website and reports what to improve.",
    categories: ["Web Apps", "AI & Automation"], url: "https://techwokx.online/#scan",
  }),
  p({
    id: "sulnox", sort: 6, name: "MBL / NTL SulNOxEco", tagline: "Client Website", kind: "Client Website", status: "In Development",
    description: "Marketing website for the Ghana distributor of Sulnox Group's fuel conditioner.", categories: ["Client Websites", "Web Apps"],
  }),
  p({
    id: "rnaq", sort: 7, name: "RNAQ Foundation", tagline: "Website Revamp Proposal", kind: "Client Website", status: "Proposal",
    description: "Proposal for revamping the RNAQ Foundation website.", categories: ["Client Websites"],
  }),
  p({
    id: "naija", sort: 8, name: "Naija Brand Chick", tagline: "Website Redesign Proposal", kind: "Client Website", status: "Proposal",
    description: "Proposal for redesigning the Naija Brand Chick website.", categories: ["Client Websites"],
  }),
  p({
    id: "momo", sort: 9, name: "MoMo Escrow", tagline: "Escrow Concept", kind: "Experimental", status: "Concept",
    description: "Escrow concept for mobile-money (MoMo) payments, at concept stage.", categories: ["Experimental"],
  }),
  p({
    id: "bridgeai-robot", sort: 10, name: "BridgeAI 3D Companion Robot", tagline: "Modular Robot Specification", kind: "Experimental", status: "Concept",
    description: "Specification for a modular 3D companion robot related to BridgeAI.", categories: ["Experimental", "AI & Automation"],
  }),
  p({
    id: "aeya", sort: 11, name: "AEYA — AI Lab-in-a-Box", tagline: "Education Concept", kind: "Experimental", status: "Concept",
    description: "AEYA / AI Lab-in-a-Box concept.", categories: ["Experimental", "AI & Automation"],
  }),
];

// ── Supabase (public read via REST; writes happen in /admin with RLS) ─────────────
type Row = {
  id: string; name: string; tagline: string | null; headline: string | null; description: string | null;
  kind: string | null; categories: string[] | null; status: Status | null; url: string | null; github: string | null;
  image: string | null; case_image: string | null; highlights: string[] | null; period: string | null;
  featured_pool: boolean | null; pinned: boolean | null; sort: number | null;
};

export const fromRow = (r: Row): Project => ({
  id: r.id, name: r.name, tagline: r.tagline ?? "", headline: r.headline ?? "", description: r.description ?? "",
  kind: r.kind ?? "Web App", categories: r.categories ?? [], status: (r.status ?? "Concept") as Status,
  url: r.url ?? "", github: r.github ?? "", image: r.image ?? "", caseImage: r.case_image ?? "",
  highlights: r.highlights ?? [], period: r.period ?? "", featuredPool: !!r.featured_pool, pinned: !!r.pinned, sort: r.sort ?? 100,
});

export const toRow = (x: Project) => ({
  id: x.id, name: x.name, tagline: x.tagline, headline: x.headline, description: x.description, kind: x.kind,
  categories: x.categories, status: x.status, url: x.url, github: x.github, image: x.image, case_image: x.caseImage,
  highlights: x.highlights, period: x.period, featured_pool: x.featuredPool, pinned: x.pinned, sort: x.sort,
});

export async function getProjects(): Promise<Project[]> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !key) return SEED;
  try {
    const res = await fetch(`${base}/rest/v1/projects?select=*&order=sort.asc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return SEED;
    const rows = (await res.json()) as Row[];
    return rows.length ? rows.map(fromRow) : SEED;
  } catch {
    return SEED;
  }
}

// ── Weekly featured rotation (Monday-based week, deterministic) ───────────────────
export function weekNumber(now = Date.now()) {
  const days = Math.floor(now / 86_400_000); // 1970-01-01 was a Thursday
  return Math.floor((days + 3) / 7);         // increments every Monday 00:00 UTC
}

export function featuredFor(projects: Project[], now = Date.now()): Project | null {
  const pinned = projects.find((x) => x.pinned);
  if (pinned) return pinned;
  const pool = projects.filter((x) => x.featuredPool).sort((a, b) => a.sort - b.sort);
  if (!pool.length) return projects[0] ?? null;
  return pool[weekNumber(now) % pool.length];
}
