import PageShell from "@/components/layout/PageShell";
import QaBoard from "@/components/community/QaBoard";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy =
    locale === "tr"
      ? {
          title: "Soru-cevap",
          description: "Soru-cevap alaninda hizli yanitlar al, deneyim paylas ve teknik konulari tartis.",
        }
      : {
          title: "Q&A",
          description: "Get fast answers, share experience, and discuss technical topics.",
        };

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/qa",
    locale,
  });
}

export default function QaPage() {
  return (
    <PageShell>
      <QaBoard />
    </PageShell>
  );
}
