"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { CONSENT_CHANGE_EVENT, isAnalyticsAllowed } from "@/utils/consent";

type GoogleAnalyticsTagProps = {
  measurementId: string;
};

const buildGoogleTagInitScript = (measurementId: string) => `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
window.gtag("consent", "default", {
  analytics_storage: "granted",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied"
});
window.gtag("js", new Date());
window.gtag("config", ${JSON.stringify(measurementId)});
`;

export default function GoogleAnalyticsTag({ measurementId }: GoogleAnalyticsTagProps) {
  const normalizedMeasurementId = measurementId.trim();
  const analyticsAllowed = useSyncExternalStore(subscribeToConsent, getAnalyticsSnapshot, getServerSnapshot);

  if (!normalizedMeasurementId || !analyticsAllowed) return null;

  return (
    <>
      <Script
        id="google-tag-loader"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(normalizedMeasurementId)}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {buildGoogleTagInitScript(normalizedMeasurementId)}
      </Script>
    </>
  );
}

const getAnalyticsSnapshot = () => (typeof window === "undefined" ? false : isAnalyticsAllowed());
const getServerSnapshot = () => false;

const subscribeToConsent = (onStoreChange: () => void) => {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  };
};
