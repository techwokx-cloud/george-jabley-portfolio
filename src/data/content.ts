// All copy lives here so the docx content can be dropped in later.

export const site = {
  name: "George Jabley",
  location: "Accra, Ghana",
  title: "George Jabley | Senior IT Consultant · Full-Stack Developer · AI Builder",
  description:
    "25+ years in technology, 16+ years in IT support. A new chapter in software development and AI.",
};

export const nav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#journey" },
  { label: "Work", href: "#work" },
  { label: "Tech Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "HI, I'M GEORGE JABLEY",
  lines: ["Technology enthusiast.", "Problem solver."],
  accent: "Junior AI Software Developer.",
  sub: ["25+ years in technology. 16+ years in IT support.", "A new chapter in software development and AI."],
  status: "Available for remote opportunities",
};

export const about = {
  eyebrow: "ABOUT ME",
  title: ["25 years of", "experience"],
  body: ["From IT support to full-stack development,", "I build intelligent solutions that make an impact."],
  link: "Learn more about my journey",
  stats: [
    { icon: "laptop", value: "25+", label: ["Years in", "Technology"] },
    { icon: "headset", value: "16+", label: ["Years in", "IT Support"] },
    { icon: "cpu", value: "~1", label: ["Year in", "AI Development"] },
  ],
  toolkit: ["Next.js", "Docker", "TypeScript", "Linux", "Node.js", "AI/LLM", "Python", "Cloud"],
};

// WhatsApp number in international format, digits only (no +).
export const contact = {
  whatsapp: "233264375628",
};

export const work = {
  eyebrow: "SELECTED WORK",
  filters: ["All Projects", "Mobile Apps", "Web Apps", "Windows Utilities", "AI & Automation", "Experimental"],
  // `href` empty = no verified public URL yet (card is shown but does not link anywhere).
  projects: [
    {
      name: "WingBM", tagline: "Business Management Platform", kind: "Web App", icon: "globe",
      image: "/images/work-1.jpg", href: "https://wingbm.vercel.app/",
      categories: ["Web Apps"],
    },
    {
      name: "BridgeAI", tagline: "Mental Wellbeing Companion", kind: "Mobile App", icon: "phone",
      image: "/images/work-2.jpg", href: "https://bridgeai-einf.onrender.com",
      categories: ["Mobile Apps", "AI & Automation"],
    },
    {
      name: "ChiefFlow AI", tagline: "SME Business Assistant", kind: "Web App", icon: "globe",
      image: "/images/work-3.jpg", href: "",
      categories: ["Web Apps", "AI & Automation"],
    },
  ],
};

export const caseStudy = {
  eyebrow: "FEATURED CASE STUDY",
  name: "WingBM",
  subtitle: "Smart Business Management for Growing Businesses",
  body: ["A powerful PWA for sales, inventory,", "expenses and business insights."],
  cta: { label: "Explore Case Study", href: "https://wingbm.vercel.app/" },
  highlights: ["PWA · Offline Ready", "Real-time Analytics", "Multi-device Support"],
  demo: { label: "View Live Demo", href: "https://wingbm.vercel.app/" },
  github: { label: "View on GitHub", href: "https://github.com/techwokx-cloud" },
};

export const stack = {
  eyebrow: "TECH STACK",
  body: ["A blend of proven technologies and", "cutting-edge AI tools."],
  groups: [
    { label: "AI Tools", items: ["Claude", "ChatGPT", "Gemini", "DeepSeek", "Copilot", "OpenAI API", "AI/LLM"] },
    { label: "Languages & Web", items: ["Next.js", "React", "Node.js", "TypeScript", "Python", "PHP", "HTML", "CSS", "Bootstrap", "Tailwind CSS", "Flutter"] },
    { label: "Dev Tools & Scripting", items: ["VS Code", "PowerShell", "Shell Script", "Git", "GitHub"] },
    { label: "Servers & Hosting", items: ["Linux", "VPS", "Nginx", "Apache", "Docker", "Supabase", "Vercel", "Render", "Cloud"] },
  ],
  any: {
    title: "Not limited to the tools listed.",
    body: "With the right AI tools I can develop any solution: Windows apps, iOS and Android apps, utilities, Windows tools, web apps and more. Just imagine it, it can be done.",
    chips: ["Windows apps", "iOS apps", "Android apps", "Utilities", "Windows tools", "Web apps", "Mobile apps", "Automation"],
  },
  cta: {
    eyebrow: "LET'S TALK",
    body: ["I'm open to remote opportunities as a", "Junior AI Software Developer."],
    tag: "Let's build something together.",
    button: "Send Message",
  },
};

export const footer = {
  tagline: "Senior IT Consultant · Full-Stack Developer · AI Builder",
  copyright: "© 2026 George Jabley. All rights reserved.",
  // Empty href = icon is shown but not clickable until a real profile URL is supplied.
  social: [
    { label: "GitHub", href: "https://github.com/techwokx-cloud", icon: "github" },
    { label: "LinkedIn", href: "", icon: "linkedin" },
    { label: "YouTube", href: "", icon: "youtube" },
  ],
};
