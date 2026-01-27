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
import { getLocaleFromCookies } from "@/utils/locale-server";
import { SITE_URL, buildCanonical } from "@/utils/seo";
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
  title: "Yapay Zeka Muhendisleri Laboratuvari",
  description: "Gelecegi kodluyoruz.",
  alternates: {
    canonical: buildCanonical("/") ?? "/",
  },
  openGraph: {
    title: "Yapay Zeka Muhendisleri Laboratuvari",
    description: "Gelecegi kodluyoruz.",
    type: "website",
    siteName: "AI Engineers Lab",
    url: "/",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary",
    title: "Yapay Zeka Muhendisleri Laboratuvari",
    description: "Gelecegi kodluyoruz.",
  },
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AI Engineers Lab",
  url: SITE_URL,
  description: "Gelecegi kodluyoruz.",
  inLanguage: "tr-TR",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
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
