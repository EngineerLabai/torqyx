import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "RFQ Teklif Takip Paneli" : "RFQ Quotation Tracking Panel";
  const description =
    locale === "tr"
      ? "RFQ talepleri, teklif süreçleri ve teknik gereksinimleri proje bazında takip ederek ekipler için hızlı durum görünürlüğü sağlar."
      : "RFQ tracking panel that improves visibility of quotation requests, technical requirements, and project-based follow-up actions.";

  return buildPageMetadata({
    title,
    description,
    path: "/project-hub/rfq",
    locale,
  });
}

export default function RfqLayout({ children }: { children: ReactNode }) {
  return children;
}
