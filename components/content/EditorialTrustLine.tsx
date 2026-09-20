import Link from "next/link";
import type { Locale } from "@/utils/locale";
import { withLocalePrefix } from "@/utils/locale-path";

type EditorialTrustLineProps = {
  locale: Locale;
};

/** Makes authorship and the editorial methodology easy to find for readers and crawlers. */
export default function EditorialTrustLine({ locale }: EditorialTrustLineProps) {
  const isTurkish = locale === "tr";

  return (
    <p className="text-xs leading-relaxed text-slate-500">
      {isTurkish ? "Hazırlayan ve teknik inceleme: TORQYX Mühendislik Ekibi" : "Prepared and technically reviewed by: TORQYX Engineering Team"}
      {" · "}
      <Link href={withLocalePrefix("/hakkinda", locale)} className="font-semibold text-sky-700 hover:underline">
        {isTurkish ? "Metodoloji ve ekip" : "Methodology and team"}
      </Link>
    </p>
  );
}
