"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { CONSENT_CHANGE_EVENT, isAdvertisingAllowed } from "@/utils/consent";

type AdSenseProps = {
  publisherId: string;
};

export default function AdSense({ publisherId }: AdSenseProps) {
  const consentGiven = useSyncExternalStore(subscribeToConsent, getAdvertisingSnapshot, getServerSnapshot);
  const shouldLoadAds = process.env.NODE_ENV === "production" && publisherId !== "pub-0000000000000000";

  if (!shouldLoadAds || !consentGiven) return null;

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
