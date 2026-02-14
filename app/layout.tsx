// app/layout.tsx
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import SiteShell, { type SiteShellMessages } from "@/components/layout/SiteShell";
import GlobalErrorMonitor from "@/components/monitoring/GlobalErrorMonitor";
import WebVitalsReporter from "@/components/monitoring/WebVitalsReporter";
import UserStateSync from "@/components/sync/UserStateSync";
import JsonLd from "@/components/seo/JsonLd";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { SITE_URL } from "@/utils/seo";
import { buildPageMetadata } from "@/utils/metadata";
import "../styles/globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "600", "700"],
});

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);

  const base = buildPageMetadata({
    title: brandContent.siteName,
    description: brandContent.tagline,
    path: "/",
    locale,
    openGraph: {
      siteName: brandContent.siteName,
    },
  });

  return {
    metadataBase: new URL(SITE_URL),
    ...base,
  };
}

const LOGO_URL = new URL("/brand/logo.png", SITE_URL).toString();

async function getWebsiteJsonLd() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        name: brandContent.siteName,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: LOGO_URL,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        name: brandContent.siteName,
        url: SITE_URL,
        description: brandContent.tagline,
        inLanguage: locale === "tr" ? "tr-TR" : "en-US",
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getLocaleFromCookies();
  const websiteJsonLd = await getWebsiteJsonLd();
  const messages = getMessages(locale);
  const shellMessages: SiteShellMessages = {
    nav: messages.nav,
    authButtons: messages.authButtons,
    languageSwitcher: messages.languageSwitcher,
    components: {
      search: messages.components.search,
      authModal: messages.components.authModal,
      consent: messages.components.consent,
      premiumCTA: messages.components.premiumCTA,
    },
  };
  return (
    <html lang={locale}>
      <body className={`${sora.variable} ${inter.variable} ${jetBrainsMono.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <JsonLd data={websiteJsonLd} />
        <LocaleProvider initialLocale={locale}>
          <AuthProvider>
            <GlobalErrorMonitor />
            <AnalyticsTracker />
            <WebVitalsReporter />
            <UserStateSync />
            <SiteShell messages={shellMessages}>{children}</SiteShell>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
