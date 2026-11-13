import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** null when Supabase isn't configured — the public site then uses its built-in seed projects. */
export const supabase = url && key ? createClient(url, key) : null;
export const BUCKET = "project-images";
