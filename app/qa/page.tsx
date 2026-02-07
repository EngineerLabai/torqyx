import PageShell from "@/components/layout/PageShell";
import QaBoard from "@/components/community/QaBoard";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = getMessages(locale).pages.qa;

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
