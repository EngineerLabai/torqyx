// app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import CustomCursor from "@/components/effects/CustomCursor";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import SiteShell from "@/components/layout/SiteShell";
import JsonLd from "@/components/seo/JsonLd";
import { BRAND_NAME, BRAND_TAGLINE } from "@/utils/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { DEFAULT_OG_IMAGE_META, SITE_URL, buildCanonical } from "@/utils/seo";
import "../styles/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "500", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: BRAND_NAME,
  description: BRAND_TAGLINE,
  alternates: {
    canonical: buildCanonical("/") ?? "/",
  },
  openGraph: {
    title: BRAND_NAME,
    description: BRAND_TAGLINE,
    type: "website",
    siteName: BRAND_NAME,
    url: "/",
    locale: "tr_TR",
    images: [DEFAULT_OG_IMAGE_META],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_NAME,
    description: BRAND_TAGLINE,
    images: [DEFAULT_OG_IMAGE_META.url],
  },
};

const LOGO_URL = new URL("/icons/logo-mark.svg", SITE_URL).toString();
const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: BRAND_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: BRAND_NAME,
      url: SITE_URL,
      description: BRAND_TAGLINE,
      inLanguage: "tr-TR",
      publisher: {
        "@id": `${SITE_URL}#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/blog?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getLocaleFromCookies();
  return (
    <html lang={locale}>
      <body className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} font-sans antialiased bg-neutral-950 text-white`}>
        <JsonLd data={WEBSITE_JSON_LD} />
        <LocaleProvider initialLocale={locale}>
          <AuthProvider>
            <AnalyticsTracker />
            <CustomCursor />
            <SiteShell>{children}</SiteShell>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
