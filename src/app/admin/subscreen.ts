"use client";

import { useEffect, useRef } from "react";

/**
 * Makes a "sub screen" (an open form / detail view) behave like a real app screen:
 * the browser/Android Back button and the app bar's back arrow close it instead of leaving /admin.
 */
export function useSubScreen(open: boolean, close: () => void, title?: string) {
  const pushed = useRef(false);
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    if (open && !pushed.current) {
      history.pushState({ sub: 1 }, "");
      pushed.current = true;
    } else if (!open && pushed.current) {
      pushed.current = false;
      if ((history.state as { sub?: number } | null)?.sub) history.back();
    }
    window.dispatchEvent(new CustomEvent("adm-sub", { detail: open ? title || "Back" : "" }));
  }, [open, title]);

  useEffect(() => {
    const onPop = () => {
      if (pushed.current) {
        pushed.current = false;
        closeRef.current();
      }
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.dispatchEvent(new CustomEvent("adm-sub", { detail: "" }));
    };
  }, []);
}
