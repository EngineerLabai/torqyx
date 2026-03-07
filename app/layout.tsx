// app/layout.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import UpgradeFunnelAbandonmentTracker from "@/components/analytics/UpgradeFunnelAbandonmentTracker";
import UpgradeSuccessTracker from "@/components/analytics/UpgradeSuccessTracker";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import SiteShell, { type SiteShellMessages } from "@/components/layout/SiteShell";
import GlobalErrorMonitor from "@/components/monitoring/GlobalErrorMonitor";
import ImagePathWarnings from "@/components/monitoring/ImagePathWarnings";
import WebVitalsReporter from "@/components/monitoring/WebVitalsReporter";
import UserStateSync from "@/components/sync/UserStateSync";
import JsonLd from "@/components/seo/JsonLd";
import { getBrandCopy } from "@/config/brand";
import { listPublicImagePaths } from "@/lib/assets";
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

const isVercelAppHost = (host: string) => {
  const normalized = host.toLowerCase().trim().replace(/:\d+$/, "");
  return normalized === "vercel.app" || normalized.endsWith(".vercel.app");
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const requestHeaders = await headers();
  const requestHost = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "";
  const hasVercelEnvUrl = isVercelAppHost(process.env.VERCEL_URL ?? "");
  const shouldNoIndex = isVercelAppHost(requestHost) || (!requestHost && hasVercelEnvUrl);

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
    ...(shouldNoIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}

const LOGO_URL = new URL("/images/logo.png", SITE_URL).toString();

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
  const knownImageAssets = listPublicImagePaths();
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
    <html lang={locale} className="w-full overflow-x-hidden">
      <body className={`${sora.variable} ${inter.variable} ${jetBrainsMono.variable} w-full overflow-x-hidden bg-slate-50 font-sans text-slate-900 antialiased`}>
        <JsonLd data={websiteJsonLd} />
        <LocaleProvider initialLocale={locale}>
          <AuthProvider>
            <GlobalErrorMonitor />
            <AnalyticsTracker />
            <UpgradeFunnelAbandonmentTracker />
            <UpgradeSuccessTracker />
            {process.env.NODE_ENV === "production" ? <WebVitalsReporter /> : null}
            {process.env.NODE_ENV === "production" ? <SpeedInsights /> : null}
            {process.env.NODE_ENV === "development" ? <ImagePathWarnings knownAssets={knownImageAssets} /> : null}
            <UserStateSync />
            <SiteShell messages={shellMessages}>{children}</SiteShell>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
