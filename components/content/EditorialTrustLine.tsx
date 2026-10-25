import Link from "next/link";
import type { Locale } from "@/utils/locale";
import { withLocalePrefix } from "@/utils/locale-path";
import { ShieldCheck, Award } from "lucide-react";

type EditorialTrustLineProps = {
  locale: Locale;
  lastUpdated?: string;
};

/** Makes authorship and the editorial methodology easy to find for readers and crawlers (E-E-A-T). */
export default function EditorialTrustLine({ locale, lastUpdated }: EditorialTrustLineProps) {
  const isTurkish = locale === "tr";

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-2 text-xs text-slate-600">
      <div className="flex items-center gap-1.5 font-medium text-slate-800">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>
          {isTurkish
            ? "Mühendislik İncelemesi: TORQYX Mekanik Tasarım Masası"
            : "Engineering Review: TORQYX Mechanical Design Desk"}
        </span>
      </div>
      <span className="text-slate-300">|</span>
      <div className="flex items-center gap-1.5">
        <Award className="h-3.5 w-3.5 text-primary-600" />
        <Link
          href={withLocalePrefix("/hakkinda", locale)}
          className="font-semibold text-primary-700 underline-offset-2 hover:underline"
        >
          {isTurkish ? "Doğrulama Metodolojisi & Ekip" : "Verification Methodology & Team"}
        </Link>
      </div>
      {lastUpdated && (
        <>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">
            {isTurkish ? `Güncelleme: ${lastUpdated}` : `Updated: ${lastUpdated}`}
          </span>
        </>
      )}
    </div>
  );
}
