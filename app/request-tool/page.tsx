import PageShell from "@/components/layout/PageShell";
import RequestToolForm from "@/components/tools/RequestToolForm";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).components.requestToolForm;
  const brandContent = getBrandCopy(locale);

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/request-tool",
    locale,
  });
}

export default function RequestToolPage() {
  return (
    <PageShell>
      <RequestToolForm />
    </PageShell>
  );
}
