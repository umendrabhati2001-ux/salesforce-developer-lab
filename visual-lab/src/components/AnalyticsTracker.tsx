"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (pathname === "/studio") {
      track("Page: Live Apex & SOQL Studio", {
        section: "Studio IDE",
        path: "/studio",
      });
    } else if (pathname === "/") {
      track("Page: Home Architecture Portal", {
        section: "Main Portfolio",
        path: "/",
      });
    } else {
      track(`Page: ${pathname}`, { path: pathname });
    }
  }, [pathname]);

  return null;
}
