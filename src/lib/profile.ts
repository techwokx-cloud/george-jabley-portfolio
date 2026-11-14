/** Verified facts the cover-letter writer may use. Nothing outside this list may be claimed. */
export const PROFILE = `
Name: George Jabley. Based in Accra, Ghana. Available for remote roles and work abroad.
Target roles: Junior AI Software Developer; Virtual Assistant / executive & administrative support.
Experience: 25+ years in technology; 16+ years in IT support and infrastructure; about 1 year building AI-powered products.
Founder and IT Operations Lead of TechWokx Ghana (IT consultancy: business email infrastructure, security audits, IT support for hotels, SMEs and NGOs).
Development stack: Next.js, React, TypeScript, Node.js, Python, PHP, HTML, CSS, Bootstrap, Tailwind CSS, Flutter, Supabase, Docker, Linux, Nginx, Apache, VPS hosting, Vercel, Render, Git/GitHub, PowerShell, shell scripting, VS Code.
AI tools and APIs: Claude, ChatGPT, Gemini, DeepSeek, GitHub Copilot, OpenAI API, LLM integration, automation.
Projects: WingBM (business management web app, live), BridgeAI (mental wellbeing companion, prototype), ChiefFlow AI (SME business assistant), TechWokx AI Business Engine, TechWokx AI Website Scanner, client websites (e.g. MBL / NTL SulNOxEco), and a portfolio with an admin dashboard.
Hackathons and events: hackathon participation, iSpreme Innovation Lab, Africa Technology Forum.
Virtual assistance: inbox and email management, calendar and scheduling, customer communication, social media management, online research, data entry, travel and reservations, lead generation. Tools: Gmail, Outlook, Google Workspace, Microsoft 365, Calendly, Zoom, Teams, Trello, Asana, ClickUp, Notion, Slack, HubSpot, Canva, WordPress, QuickBooks, WhatsApp Business.
Portfolio: https://george-jabley-portfolio.vercel.app
`.trim();

export const WRITER_RULES = `
You write job-application emails for George Jabley.
- Use ONLY the facts in the PROFILE. Never invent employers, degrees, certificates, numbers, dates or achievements. If the job asks for something not in the PROFILE, do not claim it; emphasise related real strengths instead.
- Match the job description: mirror its key requirements with the relevant real experience.
- Plain text only. No markdown, no bullet symbols, no headings. Short paragraphs.
- Cover letter: 200-280 words. Start with "Dear Hiring Manager," (or the contact's name if given). End with a short call to action and sign off "Kind regards," then "George Jabley".
- Follow-up email: 70-110 words, polite, references the application and role, offers to share more, no pressure.
- Do not mention that you are an AI. Output only the letter text.
`.trim();
