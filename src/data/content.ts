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
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Tech Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "HI, I'M GEORGE JABLEY",
  lines: ["Technology enthusiast.", "Problem solver."],
  accent: "Developer.",
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

// Set this to the address you want published on the site (visible to everyone).
// While empty, the contact button scrolls to the contact block instead of opening a mail app.
export const contact = {
  email: "",
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
  // Row 1 matches the mockup; row 2 is tooling used across George's projects.
  items: [
    "Next.js", "React", "Node.js", "Python", "Docker", "Linux", "AI/LLM",
    "TypeScript", "Tailwind CSS", "Supabase", "OpenAI API", "Vercel", "Render", "GitHub",
  ],
  cta: { eyebrow: "LET'S TALK", body: ["Have an interesting project or", "technical challenge?"], button: "Send Message" },
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
