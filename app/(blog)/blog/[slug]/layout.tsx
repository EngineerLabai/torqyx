import type { ReactNode } from "react";
import AdSense from "@/components/ads/AdSense";
import { ADSENSE_PUBLISHER_ID } from "@/config/adsense";
import { getContentBySlug } from "@/utils/content";
import { isBlogPostAdEligible } from "@/utils/blog-ad-eligibility";
import { getLocaleFromCookies } from "@/utils/locale-server";

type BlogPostLayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function BlogPostLayout({ children, params }: BlogPostLayoutProps) {
  const [{ slug }, locale] = await Promise.all([params, getLocaleFromCookies()]);
  const post = await getContentBySlug("blog", slug, { locale, includeDrafts: false });

  return (
    <>
      {isBlogPostAdEligible(post) ? <AdSense publisherId={ADSENSE_PUBLISHER_ID} /> : null}
      {children}
    </>
  );
}
