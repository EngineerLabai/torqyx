import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy =
    locale === "tr"
      ? {
          title: "Referanslama",
          description: "3-2-1 referanslama, pim yerleşimi ve dayama blokları için pratik kart.",
        }
      : {
          title: "Locating",
          description: "A practical card for 3-2-1 locating, pin placement, and locating blocks.",
        };

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/fixture-tools/locating",
    locale,
  });
}
// app/fixture-tools/locating/page.tsx
export default function LocatingPage() {
  return (
    <PageShell>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Referanslama
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-medium text-emerald-700">
            Beta
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          3-2-1 Referanslama ve Pim Yerleşimi Kartı
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Parçayı 3-2-1 prensibine göre nasıl konumlandıracağını, sabit/kayan pim
          yerlerini ve dayama bloklarını hızlıca planlamak için hafif bir kart.
          Amaç: tekrarlanabilir montaj, net referanslar ve minimum çapak/stres.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            3-2-1 prensibi hatırlatma
          </h2>
          <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-700">
            <li>3 nokta: Ana taban yüzeyini sabitler (Z ekseni). Rijit ve temiz yüzey.</li>
            <li>2 nokta: Yan yüzeyde hat hizalaması (Y ekseni). Biri sabit, biri kayan olabilir.</li>
            <li>1 nokta: Üçüncü eksen (X) için tek referans. Açık tolerans için uzun delik düşünebilirsin.</li>
            <li>Sabit pim: Konum referansı. Kayan pim: Genleşme/işleme toleransı için.</li>
            <li>Kısa, kılavuz chamferlı pim; çapak cebini temizle, geçme H7/h6 öner.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Pim ve dayama seçimi
          </h3>
          <div className="space-y-2 text-[11px] text-slate-700">
            <p>
              Tipik pimler: <span className="font-mono">Ø10</span> ve <span className="font-mono">Ø12</span> silindirik pim,
              <span className="font-mono">H7</span> delik + <span className="font-mono">h6</span> pim. Kayan pim için uzun delik veya
              oval delik kullan.
            </p>
            <p>
              Dayama bloğu: Yükü taşıyan yüzeye geniş, ince çapak almayan köşe radyüsü ekle
              (örn. R1-R2). Yüzey sertliği gerekiyorsa insert/kılıf düşün.
            </p>
            <p>
              Pim ve dayama mesafesi: Keskin köşeye çok yaklaşma (min. 1.5-2× pim çapı).
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Kontrol listesi
          </h3>
          <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-700">
            <li>Birincil yüzey (3 nokta) taşlanmış mı, kir/çapak için temizlenebilir mi?</li>
            <li>Pimlerden biri sabit, diğeri uzun delik/kayan mı? Tolerans payı verildi mi?</li>
            <li>Pimler işleme sırasında talaş/gres ile tıkanmayacak konumda mı?</li>
            <li>Dayama bloğu yük yolunda mı, kıskaç ile kuvvet hattı çakışıyor mu?</li>
            <li>Sökme-takma yönü erişilebilir mi; operatör için rehber chamfer var mı?</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Referanslama not tablosu
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-left text-[11px]">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 font-semibold">Yüzey / Nokta</th>
                  <th className="px-3 py-2 font-semibold">Tip (sabit/kayan)</th>
                  <th className="px-3 py-2 font-semibold">Not</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
                <tr>
                  <td className="px-3 py-2">Taban 3 nokta</td>
                  <td className="px-3 py-2">Dayama + pim</td>
                  <td className="px-3 py-2 text-slate-700">Taşlanmış yüzey, çekme payı yok.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Yan yüzey 2 nokta</td>
                  <td className="px-3 py-2">1 sabit, 1 kayan</td>
                  <td className="px-3 py-2 text-slate-700">Kayan pim uzun delik; çapak temizle.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Ön yüzey 1 nokta</td>
                  <td className="px-3 py-2">Kayan / uzun delik</td>
                  <td className="px-3 py-2 text-slate-700">Termal/genleşme için boşluk bırak.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
