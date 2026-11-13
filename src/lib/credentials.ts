export const CRED_KINDS = ["Certificate", "Hackathon", "Event"] as const;

export type Credential = {
  id: string;
  title: string;
  issuer: string;
  kind: string;
  date: string;
  description: string;
  image: string;
  url: string;
  sort: number;
};

type Row = Omit<Credential, never>;

// Starter entries — names only, no invented details. Add dates, photos and certificates in /admin.
export const CRED_SEED: Credential[] = [
  { id: "hackathons", title: "Hackathon Participation", issuer: "Various hackathons", kind: "Hackathon", date: "", description: "Building and shipping working prototypes against the clock.", image: "", url: "", sort: 1 },
  { id: "ispreme-innovation-lab", title: "iSpreme Innovation Lab", issuer: "iSpreme", kind: "Event", date: "", description: "Participation in the innovation lab programme.", image: "", url: "", sort: 2 },
  { id: "africa-technology-forum", title: "Africa Technology Forum", issuer: "Africa Technology Forum", kind: "Event", date: "", description: "Participation in the forum.", image: "", url: "", sort: 3 },
];

const hdr = () => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return { apikey: key, Authorization: `Bearer ${key}` };
};

export async function getCredentials(): Promise<Credential[]> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return CRED_SEED;
  try {
    const res = await fetch(`${base}/rest/v1/credentials?select=*&order=sort.asc`, { headers: hdr(), next: { revalidate: 60 } });
    if (!res.ok) return CRED_SEED;
    const rows = (await res.json()) as Row[];
    return rows.length ? rows : CRED_SEED;
  } catch {
    return CRED_SEED;
  }
}

/** Resume URL uploaded from /admin; falls back to the PDF shipped in /public. */
export const RESUME_FALLBACK = "/George-Jabley-Resume.pdf";
export async function getResumeUrl(): Promise<string> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return RESUME_FALLBACK;
  try {
    const res = await fetch(`${base}/rest/v1/site_files?select=url&key=eq.resume`, { headers: hdr(), next: { revalidate: 60 } });
    if (!res.ok) return RESUME_FALLBACK;
    const rows = (await res.json()) as { url: string }[];
    return rows[0]?.url || RESUME_FALLBACK;
  } catch {
    return RESUME_FALLBACK;
  }
}
