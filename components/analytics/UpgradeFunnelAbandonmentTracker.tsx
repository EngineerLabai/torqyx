"use client";

import { useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  UPGRADE_FUNNEL_STATE_UPDATED_EVENT,
  getUpgradeFunnelAbandonmentCandidate,
  getUpgradeFunnelRemainingMs,
  markUpgradeFunnelAbandoned,
} from "@/utils/upgrade-funnel";

export default function UpgradeFunnelAbandonmentTracker() {
  const { track } = useAnalytics();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const clearTimer = () => {
      if (!timer) return;
      clearTimeout(timer);
      timer = null;
    };

    const checkAndSchedule = () => {
      clearTimer();

      const abandonment = getUpgradeFunnelAbandonmentCandidate();
      if (abandonment) {
        markUpgradeFunnelAbandoned();
        track("funnel_abandoned", {
          plan: abandonment.plan,
          source: abandonment.source,
          drop_off_step:
            abandonment.dropOffStep === "upgrade_success" ? "payment_info_entered" : abandonment.dropOffStep,
          elapsed_seconds: abandonment.elapsedSeconds,
        });
        return;
      }

      const remainingMs = getUpgradeFunnelRemainingMs();
      if (remainingMs === null) return;
      timer = setTimeout(checkAndSchedule, Math.max(remainingMs, 1000));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      checkAndSchedule();
    };

    checkAndSchedule();
    window.addEventListener(UPGRADE_FUNNEL_STATE_UPDATED_EVENT, checkAndSchedule);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimer();
      window.removeEventListener(UPGRADE_FUNNEL_STATE_UPDATED_EVENT, checkAndSchedule);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [track]);

  return null;
}
