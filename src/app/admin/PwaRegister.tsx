"use client";

import { useEffect } from "react";

declare global {
  interface Window { __a2hs?: Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> } }
}

/** Registers the admin service worker and keeps the "Install app" prompt for the menu. */
export default function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/admin/sw.js", { scope: "/admin" }).catch(() => {});
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      window.__a2hs = e as Window["__a2hs"];
      window.dispatchEvent(new Event("a2hs-ready"));
    };
    const onInstalled = () => { window.__a2hs = undefined; window.dispatchEvent(new Event("a2hs-ready")); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);
  return null;
}
