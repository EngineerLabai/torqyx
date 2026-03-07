"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAnalytics } from "@/hooks/useAnalytics";

type UpgradePlanViewTrackerProps = {
  plan: string;
  source: string;
};

export default function UpgradePlanViewTracker({ plan, source }: UpgradePlanViewTrackerProps) {
  const pathname = usePathname() ?? "/";
  const { track } = useAnalytics();

  useEffect(() => {
    const dedupeKey = `analytics:plan_view:${pathname}:${plan}:${source}`;

    try {
      if (window.sessionStorage.getItem(dedupeKey)) return;
      window.sessionStorage.setItem(dedupeKey, "1");
    } catch {
      // ignore sessionStorage restrictions
    }

    track("plan_view", { plan, source });
  }, [pathname, plan, source, track]);

  return null;
}
