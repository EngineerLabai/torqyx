import Script from "next/script";
import { ADSENSE_PUBLISHER_ID } from "@/config/adsense";

/**
 * Loads the publisher verification tag without enabling ad slots.
 * Ad serving remains separately gated by AdSense.tsx and the consent flow.
 */
export default function AdSenseVerification() {
  if (
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_ADSENSE_SITE_VERIFICATION !== "true"
  ) {
    return null;
  }

  return (
    <Script
      id="adsense-site-verification"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
      crossOrigin="anonymous"
      strategy="beforeInteractive"
    />
  );
}
