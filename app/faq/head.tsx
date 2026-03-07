import FaqPageJsonLd from "@/components/seo/FaqPageJsonLd";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";

export default async function Head() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.faq;
  const items = copy.categories.flatMap((category) =>
    category.items.map((item) => ({
      question: item.q,
      answer: item.a,
    })),
  );

  return (
    <FaqPageJsonLd
      id="faq-page-jsonld"
      items={items}
      inLanguage={locale === "tr" ? "tr-TR" : "en-US"}
    />
  );
}

