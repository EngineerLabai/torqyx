import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import ToolSeo from "@/components/tools/ToolSeo";
import ToleranceLabWorkspace from "@/components/tools/ToleranceLabWorkspace";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildToolMetadata } from "@/utils/tool-seo";
import { NOINDEX_FOLLOW_ROBOTS } from "@/utils/metadata";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const params = (await searchParams) ?? {};
  const state = Array.isArray(params.state) ? params.state[0] : params.state;
  const base = buildToolMetadata("tolerance-lab", locale);

  return state ? { ...base, robots: NOINDEX_FOLLOW_ROBOTS } : base;
}

export default async function ToleranceLabPage() {
  const locale = await getLocaleFromCookies();
  const isTurkish = locale === "tr";

  return (
    <PageShell>
      <ToolSeo toolId="tolerance-lab" locale={locale} />
      <ToleranceLabWorkspace locale={locale} />
      <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          {isTurkish ? "Doğrusal tolerans zinciri nasıl yorumlanır?" : "How to interpret a linear tolerance stack"}
        </h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
          {isTurkish
            ? "Tolerance Lab, ölçü zincirindeki her elemanı nominal değer, üst-alt sapma ve toplama yönüyle açıkça gösterir. Worst-case sonucu üretim dağılımı hakkında varsayım yapmadan fiziksel sınırları toplar; RSS görünümü ise bağımsız etkilerin istatistiksel tahminini sunar."
            : "Tolerance Lab exposes each stack member as a nominal value, upper/lower deviation, and signed direction. The worst-case result sums physical limits without assuming a production distribution; the RSS view provides a statistical estimate for independent contributors."}
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <section className="rounded-2xl bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">{isTurkish ? "Worst-case" : "Worst-case"}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {isTurkish ? "Montaj sınırını ve garanti edilmesi gereken açıklık/interferans aralığını kontrol etmek için kullanılır." : "Use it to check assembly limits and the clearance/interference interval that must be guaranteed."}
            </p>
          </section>
          <section className="rounded-2xl bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">RSS</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {isTurkish ? "Bağımsız ve yaklaşık normal dağılımlı katkılar için erken tasarım tahminidir; proses kabiliyeti yerine geçmez." : "An early-design estimate for independent, approximately normal contributors; it does not replace process capability evidence."}
            </p>
          </section>
          <section className="rounded-2xl bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">{isTurkish ? "Hassasiyet" : "Sensitivity"}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {isTurkish ? "En yüksek varyans katkısını üreten elemanları öne çıkararak tolerans bütçesini daha etkili dağıtmayı sağlar." : "Highlights the members with the largest variance contribution so the tolerance budget can be improved deliberately."}
            </p>
          </section>
        </div>
      </article>
    </PageShell>
  );
}
