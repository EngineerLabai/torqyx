"use client";

import { useEffect, useRef } from "react";
import { CONSENT_CHANGE_EVENT, isAdvertisingAllowed, isAnalyticsAllowed } from "@/utils/consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const toGoogleConsentValue = (allowed: boolean) => (allowed ? "granted" : "denied");

const sendCurrentPageView = () => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}`,
  });
};

export default function GoogleConsentSync() {
  const analyticsAllowedRef = useRef<boolean | null>(null);

  useEffect(() => {
    const syncConsent = () => {
      const analyticsAllowed = isAnalyticsAllowed();
      const advertisingAllowed = isAdvertisingAllowed();
      const wasAnalyticsAllowed = analyticsAllowedRef.current;
      analyticsAllowedRef.current = analyticsAllowed;

      if (typeof window.gtag !== "function") return;

      window.gtag("consent", "update", {
        analytics_storage: toGoogleConsentValue(analyticsAllowed),
        ad_storage: toGoogleConsentValue(advertisingAllowed),
        ad_user_data: toGoogleConsentValue(advertisingAllowed),
        ad_personalization: toGoogleConsentValue(advertisingAllowed),
      });

      if (analyticsAllowed && wasAnalyticsAllowed === false) {
        sendCurrentPageView();
      }
    };

    syncConsent();
    window.addEventListener("storage", syncConsent);
    window.addEventListener(CONSENT_CHANGE_EVENT, syncConsent);

    return () => {
      window.removeEventListener("storage", syncConsent);
      window.removeEventListener(CONSENT_CHANGE_EVENT, syncConsent);
    };
  }, []);

  return null;
}
