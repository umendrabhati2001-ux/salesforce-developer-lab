"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Avoid double firing for same page in same tab session
    const sessionKey = `tracked_${pathname}`;
    if (typeof window === "undefined" || sessionStorage.getItem(sessionKey)) {
      return;
    }

    sessionStorage.setItem(sessionKey, "true");

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || "Direct",
      }),
    }).catch(() => {
      // Non-blocking fail-safe
    });
  }, [pathname]);

  return null;
}
