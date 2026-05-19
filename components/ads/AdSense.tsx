"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { CONSENT_CHANGE_EVENT, isAdvertisingAllowed } from "@/utils/consent";
import { isAdsAllowedPath } from "@/utils/ads";

type AdSenseProps = {
  publisherId: string;
};

export default function AdSense({ publisherId }: AdSenseProps) {
  const pathname = usePathname() ?? "/";
  const consentGiven = useSyncExternalStore(subscribeToConsent, getAdvertisingSnapshot, getServerSnapshot);
  const shouldLoadAds = process.env.NODE_ENV === "production" && publisherId !== "pub-0000000000000000";
  const allowedOnPath = isAdsAllowedPath(pathname);

  if (!shouldLoadAds || !consentGiven || !allowedOnPath) return null;

  return (
    <Script
      id="adsense-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
    />
  );
}

const getAdvertisingSnapshot = () => (typeof window === "undefined" ? false : isAdvertisingAllowed());
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
