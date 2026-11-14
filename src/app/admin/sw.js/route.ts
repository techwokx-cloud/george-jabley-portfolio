export const dynamic = "force-static";

// Service worker for the admin app. Caches static assets and the app shell; never touches the API or Supabase.
const SW = `
const V = "gj-admin-v1";
self.addEventListener("install", (e) => { self.skipWaiting(); e.waitUntil(caches.open(V).then((c) => c.addAll(["/admin"]).catch(() => {}))); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  if (req.mode === "navigate" && url.pathname.startsWith("/admin")) {
    e.respondWith(
      fetch(req).then((r) => { const copy = r.clone(); caches.open(V).then((c) => c.put("/admin", copy)); return r; })
        .catch(() => caches.match("/admin").then((r) => r || new Response("<h1>Offline</h1><p>Reconnect to use the admin.</p>", { headers: { "Content-Type": "text/html" } })))
    );
    return;
  }
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => { const copy = r.clone(); caches.open(V).then((c) => c.put(req, copy)); return r; })));
  }
});
`;

export function GET() {
  return new Response(SW, { headers: { "Content-Type": "application/javascript", "Cache-Control": "no-cache", "Service-Worker-Allowed": "/admin" } });
}
