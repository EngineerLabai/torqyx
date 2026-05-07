"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

type AdSenseProps = {
  publisherId: string;
};

export default function AdSense({ publisherId }: AdSenseProps) {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    // Çerez sisteminizin "advertising" (Reklam) iznini kontrol ediyoruz
    // Eğer cookie/localStorage içerisinde reklam izni varsa scripti renderla
    const hasAdConsent = localStorage.getItem("cookie-consent-advertising") === "true";
    
    if (hasAdConsent) {
      setConsentGiven(true);
    }
  }, []);

  if (!consentGiven) return null;

  return (
    <Script
      id="adsense-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
    />
  );
}