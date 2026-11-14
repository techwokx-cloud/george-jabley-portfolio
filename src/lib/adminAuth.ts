/** Server-side: verifies the caller is the signed-in admin (Supabase session token + ADMIN_EMAIL env). */
export async function verifyAdmin(req: Request): Promise<string | null> {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!token || !base || !anon || !admin) return null;
  try {
    const r = await fetch(`${base}/auth/v1/user`, { headers: { apikey: anon, Authorization: `Bearer ${token}` } });
    if (!r.ok) return null;
    const u = (await r.json()) as { email?: string };
    return String(u.email ?? "").toLowerCase() === admin ? admin : null;
  } catch {
    return null;
  }
}
