import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import RequestToolForm from "@/components/tools/RequestToolForm";
import { BRAND_NAME } from "@/utils/brand";
import { DEFAULT_OG_IMAGE_META, buildCanonical } from "@/utils/seo";

export const metadata: Metadata = {
  title: `Tool Request | ${BRAND_NAME}`,
  description: "Ihtiyac duydugun araclari hizla tarif et ve talep olustur.",
  alternates: {
    canonical: buildCanonical("/request-tool") ?? "/request-tool",
  },
  openGraph: {
    title: `Tool Request | ${BRAND_NAME}`,
    description: "Ihtiyac duydugun araclari hizla tarif et ve talep olustur.",
    type: "website",
    url: buildCanonical("/request-tool") ?? "/request-tool",
    images: [DEFAULT_OG_IMAGE_META],
  },
  twitter: {
    card: "summary_large_image",
    title: `Tool Request | ${BRAND_NAME}`,
    description: "Ihtiyac duydugun araclari hizla tarif et ve talep olustur.",
    images: [DEFAULT_OG_IMAGE_META.url],
  },
};

export default function RequestToolPage() {
  return (
    <PageShell>
      <RequestToolForm />
    </PageShell>
  );
}
