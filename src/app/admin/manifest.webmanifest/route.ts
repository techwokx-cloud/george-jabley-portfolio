export const dynamic = "force-static";

export function GET() {
  const manifest = {
    name: "George Jabley · Admin",
    short_name: "GJ Admin",
    description: "Portfolio dashboard: projects, jobs, leads and certificates.",
    id: "/admin",
    start_url: "/admin",
    scope: "/admin",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f3f0ea",
    theme_color: "#ff7210",
    icons: [
      { src: "/icons/admin-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/admin-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/admin-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Jobs", url: "/admin?tab=jobs" },
      { name: "Leads", url: "/admin?tab=leads" },
    ],
  };
  return new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/manifest+json", "Cache-Control": "public, max-age=3600" } });
}
