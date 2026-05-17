import AdSense from "@/components/ads/AdSense";
// app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
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
import { CANONICAL_SITE_URL, IS_INDEXING_ENABLED, SITE_URL, buildOgImageUrl } from "@/utils/seo";
import { buildPageMetadata } from "@/utils/metadata";
import { Toaster } from "@/components/ui/toaster";
import { UnitSystemProvider } from "@/contexts/UnitSystemContext";
import "../styles/globals.css";
import "katex/dist/katex.min.css";

const DEFAULT_SITE_TITLE = "TORQYX";
const DEFAULT_SITE_DESCRIPTION =
  "ISO/DIN/VDI referanslı, standart temelli mekanik mühendislik hesaplayıcıları. Tahmin değil, deterministik sonuç.";
const DEFAULT_OG_DESCRIPTION = "ISO/DIN/VDI referanslı mekanik hesaplayıcılar. 500+ mühendis kullanıyor.";

export async function generateMetadata(): Promise<Metadata> {
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
  const defaultOgImage = buildOgImageUrl({
    title: DEFAULT_SITE_TITLE,
    description: brandContent.tagline,
    locale,
    path: "/",
  });

  return {
    metadataBase: new URL(CANONICAL_SITE_URL),
    ...base,
    title: {
      default: DEFAULT_SITE_TITLE,
      template: "%s | TORQYX",
    },
    description: DEFAULT_SITE_DESCRIPTION,
    openGraph: {
      ...(base.openGraph ?? {}),
      type: "website",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      url: base.openGraph?.url ?? CANONICAL_SITE_URL,
      siteName: "TORQYX",
      title: DEFAULT_SITE_TITLE,
      description: brandContent.tagline || DEFAULT_OG_DESCRIPTION,
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: "TORQYX — Mühendislik Hesaplayıcıları",
        },
      ],
    },
    twitter: {
      ...(base.twitter ?? {}),
      card: "summary_large_image",
      title: DEFAULT_SITE_TITLE,
      description: "ISO/DIN/VDI referanslı mekanik hesaplayıcılar.",
      images: [defaultOgImage],
    },
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      other: [{ rel: "mask-icon", url: "/favicon.ico" }],
    },
    manifest: "/site.webmanifest",
    other: {
      ...(base.other ?? {}),
      "google-adsense-account": "ca-pub-8444187117761223",
    },
    ...(!IS_INDEXING_ENABLED
      ? {
          robots: {
            index: false,
            follow: false,
            googleBot: {
              index: false,
              follow: false,
            },
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
          target: `${SITE_URL}/tools?q={search_term_string}`,
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
      <body className="w-full overflow-x-hidden bg-slate-50 font-sans text-slate-900 antialiased"> 
        <AdSense publisherId="ca-pub-8444187117761223" />
        <JsonLd data={websiteJsonLd} />
        <LocaleProvider initialLocale={locale}>
          <AuthProvider>
            <UnitSystemProvider>
              <GlobalErrorMonitor />
              <AnalyticsTracker />
              <UpgradeFunnelAbandonmentTracker />
              <UpgradeSuccessTracker />
              {process.env.NODE_ENV === "production" ? <WebVitalsReporter /> : null}
              {process.env.NODE_ENV === "production" ? <SpeedInsights /> : null}
              {process.env.NODE_ENV === "development" ? <ImagePathWarnings knownAssets={knownImageAssets} /> : null}
              <UserStateSync />
              <SiteShell messages={shellMessages}>{children}</SiteShell>
              <Toaster />
            </UnitSystemProvider>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
