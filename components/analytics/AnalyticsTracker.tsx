"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isAnalyticsAllowed } from "@/utils/consent";
import { trackPageView } from "@/utils/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const initialPageViewHandledRef = useRef(false);

  useEffect(() => {
    if (!pathname) return;
    trackPageView(pathname, document.title);

    if (!initialPageViewHandledRef.current) {
      initialPageViewHandledRef.current = true;
      return;
    }

    if (!isAnalyticsAllowed() || typeof window.gtag !== "function") return;

    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: `${window.location.pathname}${window.location.search}`,
    });
  }, [pathname]);

  return null;
}
