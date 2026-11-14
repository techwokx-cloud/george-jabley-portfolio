/** Offline fallback used when no Anthropic key is configured. */
const SKILLS: [RegExp, string][] = [
  [/next\.?js|react/i, "building web apps with Next.js and React"],
  [/typescript|javascript/i, "TypeScript and JavaScript development"],
  [/node/i, "Node.js back-end work"],
  [/python/i, "Python automation and applications"],
  [/\bphp\b|laravel|wordpress/i, "PHP and WordPress sites"],
  [/flutter|mobile app|ios|android/i, "mobile app development"],
  [/\bai\b|llm|openai|claude|gpt|gemini|machine learning|prompt/i, "integrating LLMs and AI tools into real products"],
  [/api|rest|integration/i, "designing and integrating APIs"],
  [/supabase|postgres|sql|database/i, "database design with Supabase and SQL"],
  [/docker|linux|vps|nginx|server|devops/i, "Linux servers, Docker and VPS deployment"],
  [/support|helpdesk|infrastructure|it admin/i, "16+ years of IT support and infrastructure"],
  [/email|inbox/i, "inbox and email management"],
  [/calendar|schedul/i, "calendar and schedule management"],
  [/social media|content/i, "social media and content scheduling"],
  [/research/i, "fast, accurate online research"],
  [/data entry|spreadsheet|excel/i, "accurate data entry and spreadsheets"],
  [/travel|booking|reservation/i, "travel and reservation coordination"],
  [/crm|hubspot|lead/i, "CRM tools and lead generation"],
  [/customer|client/i, "clear, friendly client communication"],
];

export function templateLetter(o: { company: string; role: string; jd: string; contact?: string; tone?: string; notes?: string }) {
  const hits = SKILLS.filter(([re]) => re.test(o.jd)).map(([, t]) => t).slice(0, 4);
  const skills = hits.length ? hits : ["web and AI development", "IT support and infrastructure"];
  const list = skills.length > 1 ? `${skills.slice(0, -1).join(", ")} and ${skills.at(-1)}` : skills[0];
  const to = o.contact?.trim() ? `Dear ${o.contact.trim()},` : "Dear Hiring Manager,";
  const role = o.role || "the open position";
  const co = o.company ? ` at ${o.company}` : "";
  return `${to}

I am writing to apply for ${role}${co}. I am a technology professional based in Accra, Ghana, with 25+ years in technology, including 16+ years in IT support and infrastructure, and about a year building AI-powered products.

Your description highlights ${list}. These are areas I work in every day: I founded TechWokx Ghana, where I deliver email infrastructure, security and IT support for hotels, SMEs and NGOs, and I build full-stack and AI projects such as WingBM, BridgeAI and ChiefFlow AI with Next.js, TypeScript, Node.js, Python and Supabase.${o.notes?.trim() ? `\n\n${o.notes.trim()}` : ""}

I work remotely with reliability, clear communication and a habit of finishing what I start. My portfolio is at https://george-jabley-portfolio.vercel.app, and I would welcome a short conversation about how I can contribute.

Kind regards,
George Jabley`;
}

export function templateFollowUp(o: { company: string; role: string; contact?: string }) {
  return `${o.contact?.trim() ? `Dear ${o.contact.trim()},` : "Dear Hiring Manager,"}

I recently applied for ${o.role || "the position"}${o.company ? ` at ${o.company}` : ""} and wanted to follow up. I remain very interested and would be glad to share more about my experience or answer any questions.

Thank you for your time and consideration.

Kind regards,
George Jabley`;
}
