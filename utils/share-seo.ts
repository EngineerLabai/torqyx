import type { Metadata } from "next";
import type { Locale } from "@/utils/locale";
import { buildPageMetadata } from "@/utils/metadata";

export const buildSharedCalculationMetadata = (code: string, locale: Locale): Metadata => {
  const copy =
    locale === "tr"
      ? {
          title: "Paylaşılan hesaplama",
          description: "TORQYX üzerinde güvenli bir bağlantıyla paylaşılan mühendislik hesaplaması.",
        }
      : {
          title: "Shared calculation",
          description: "An engineering calculation shared through a secure TORQYX link.",
        };

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path: `/s/${encodeURIComponent(code)}`,
    locale,
    noIndex: true,
    alternatesLanguages: null,
  });
};
