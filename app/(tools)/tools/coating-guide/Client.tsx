"use client";

// app/tools/coating-guide/page.tsx
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";

type BaseMaterial = "steel" | "aluminum" | "stainless" | "copper" | "titanium" | "plastic";
type Need = "corrosion" | "wear" | "appearance" | "lowfriction" | "conductivity" | "high_temp";

type Coating = {
  name: string;
  bases: BaseMaterial[];
  needs: Need[];
  description: string;
  notes?: string;
  thickness?: string;
};

const COATINGS: Coating[] = [
  {
    name: "Zinc Galvaniz (Elektrolitik)",
    bases: ["steel"],
    needs: ["corrosion", "appearance"],
    description: "Ekonomik korozyon koruması; dekoratif görünüm, ince kaplama.",
    thickness: "5–15 µm",
    notes: "Beyaz pas riski için pasivasyon + yağlama önerilir.",
  },
  {
    name: "Sıcak Daldırma Galvaniz",
    bases: ["steel"],
    needs: ["corrosion"],
    description: "Kalın Zn tabakası, dış ortam ve ağır korozyon için.",
    thickness: "50–100 µm",
    notes: "Kalın tabaka, ölçü toleransını etkileyebilir; dişli parçaya uygun değil.",
  },
  {
    name: "Zinc-Nickel (Zn-Ni)",
    bases: ["steel"],
    needs: ["corrosion", "appearance"],
    description: "Zn kaplamaya göre çok daha yüksek korozyon direnci; otomotiv sınıfı.",
    thickness: "8–15 µm",
    notes: "~12–15% Ni alaşımı; yüksek sıcaklıkta renk değişimi olabilir.",
  },
  {
    name: "Fosfat (Mangan/Çinko)",
    bases: ["steel"],
    needs: ["corrosion", "wear"],
    description: "Yağ tutucu, boya/yağ öncesi aderans için; hafif korozyon koruması.",
    thickness: "2–15 µm",
    notes: "Mangan fosfat aşınma ve rodaj için, çinko fosfat boya altı için yaygın.",
  },
  {
    name: "Siyah Oksit (Black Oxide)",
    bases: ["steel", "stainless"],
    needs: ["appearance", "lowfriction"],
    description: "Dekoratif siyah film, düşük korozyon; yağ ile desteklenir.",
    thickness: "~1 µm",
    notes: "Hafif korozyon koruması; ölçü değişimi ihmal edilebilir.",
  },
  {
    name: "Sert Anodizasyon",
    bases: ["aluminum"],
    needs: ["wear", "corrosion"],
    description: "Kalın sert oksit tabakası; aşınma ve korozyon direnci.",
    thickness: "25–60 µm",
    notes: "Renk genelde koyu; tolerans ve çatlak riski için geometriye dikkat.",
  },
  {
    name: "Dekoratif Anodizasyon",
    bases: ["aluminum"],
    needs: ["appearance", "corrosion"],
    description: "İnce oksit tabaka, renkli/şeffaf dekoratif yüzey.",
    thickness: "5–25 µm",
    notes: "Renk uyumu için partileri ayır; keskin kenarları pahla.",
  },
  {
    name: "Kromat (Alodine vb.)",
    bases: ["aluminum"],
    needs: ["corrosion", "appearance"],
    description: "İnce kromat tabaka, boya altı aderans ve korozyon koruması.",
    thickness: "1–3 µm",
    notes: "Hexavalent olmayan (RoHS) proses seçilmeli.",
  },
  {
    name: "Pasivasyon (Paslanmaz)",
    bases: ["stainless"],
    needs: ["corrosion"],
    description: "Kimyasal temizleme ve pasif film güçlendirme; serbest Fe uzaklaştırma.",
    notes: "Kaynak sonrası renk giderme ve paslanmaz dayanımı için.",
  },
  {
    name: "PTFE / MoS2 Kuru Film",
    bases: ["steel", "aluminum", "stainless", "titanium"],
    needs: ["lowfriction", "wear", "corrosion"],
    description: "Düşük sürtünme, ince kaplama; hafif korozyon/aşınma iyileştirmesi.",
    thickness: "5–20 µm",
    notes: "Tork kontrollü bağlantılarda kullanım; yüzey hazırlığı kritik.",
  },
  {
    name: "CrN / TiN / DLC (PVD)",
    bases: ["steel", "stainless", "titanium"],
    needs: ["wear", "lowfriction", "appearance"],
    description: "Sert ve ince PVD kaplamalar; kesici takımlar, kalıp yüzeyleri.",
    thickness: "2–5 µm",
    notes: "Yüksek sertlik (2000–3000 HV); keskin kenar/çentiklerde soyulma riski.",
  },
  {
    name: "Elektrolitik Nikel (EN, Ni-P)",
    bases: ["steel", "aluminum", "stainless", "copper"],
    needs: ["wear", "corrosion", "appearance"],
    description: "Uniform kaplama, iyi korozyon ve orta aşınma direnci.",
    thickness: "10–30 µm",
    notes: "Yüksek P içeriği korozyonu artırır, aşınmaya etkisi sınırlı.",
  },
  {
    name: "EN + PTFE Kompozit",
    bases: ["steel", "aluminum", "stainless"],
    needs: ["lowfriction", "corrosion", "wear"],
    description: "EN kaplama içine PTFE dağıtılmış; düşük sürtünme + korozyon kombinasyonu.",
    thickness: "15–30 µm",
  },
  {
    name: "Bakır/Nikel Kalay Kaplama",
    bases: ["copper", "steel"],
    needs: ["conductivity", "corrosion", "appearance"],
    description: "Elektriksel iletkenlik ve korozyon için kalay/nikel/tin-nikel kaplamalar.",
    notes: "Elektrik kontak ve konektörlerde; kalay whisker riski için arayüz tasarımı önemli.",
  },
  {
    name: "Gümüş Kaplama",
    bases: ["copper", "steel"],
    needs: ["conductivity", "wear", "appearance"],
    description: "Yüksek iletkenlik ve düşük temas direnci; orta aşınma direnci.",
    thickness: "5–25 µm",
    notes: "Yüksek sıcaklıkta kükürtle kararabilir; temas direnci düşük.",
  },
  {
    name: "Altın Kaplama",
    bases: ["copper", "stainless"],
    needs: ["conductivity", "corrosion", "appearance"],
    description: "Mükemmel korozyon ve iletkenlik, ince dekoratif/elektrik kaplama.",
    notes: "Çok pahalı; kalınlık mikro düzeyde tutulur.",
  },
  {
    name: "TiAlN / AlCrN (PVD, yüksek sıcaklık)",
    bases: ["steel", "titanium"],
    needs: ["wear", "high_temp", "lowfriction"],
    description: "Kesici takımlarda yüksek sıcaklık oksidasyon direnci, yüksek sertlik.",
    thickness: "2–5 µm",
  },
  {
    name: "Cerakote / Polimer Seramik Kaplama",
    bases: ["steel", "aluminum", "stainless", "titanium", "plastic"],
    needs: ["appearance", "corrosion", "wear"],
    description: "İnce film seramik polimer kaplama; dekoratif + korozyon/kimyasal direnci.",
    notes: "İnce (~25 µm) ve hafif; yüzey hazırlığı kritik.",
  },
  {
    name: "Hard Chrome",
    bases: ["steel", "stainless"],
    needs: ["wear", "corrosion", "appearance"],
    description: "Yüksek sertlikte Cr kaplama; aşınma ve korozyon için klasik çözüm.",
    thickness: "10–100 µm",
    notes: "Çevresel kısıtlar (Cr6+); gözenek ve hidrojen gevrekliği riskine dikkat.",
  },
  {
    name: "HVOF Karbür Kaplama (WC-Co / Cr3C2)",
    bases: ["steel", "stainless", "titanium"],
    needs: ["wear", "corrosion", "high_temp"],
    description: "Aşınma ve korozyona karşı yüksek sertlikli püskürtme kaplama.",
    notes: "Kalınlık 50–300 µm; yüzey taşlama gerekebilir.",
  },
  {
    name: "Anodik Oksidasyon (Titanyum için renkli)",
    bases: ["titanium"],
    needs: ["appearance", "corrosion"],
    description: "Ti için dekoratif renkli oksit tabakası; ince ve tolerans dostu.",
    thickness: "~100 nm–1 µm",
  },
];

const MATERIAL_LABELS: Record<BaseMaterial, string> = {
  steel: "Çelik",
  aluminum: "Alüminyum",
  stainless: "Paslanmaz",
  copper: "Bakır/Bronz",
  titanium: "Titanyum",
  plastic: "Plastik",
};

const NEED_LABELS: Record<Need, string> = {
  corrosion: "Korozyon",
  wear: "Aşınma",
  appearance: "Görünüm",
  lowfriction: "Düşük sürtünme",
  conductivity: "İletkenlik",
  high_temp: "Yüksek sıcaklık",
};

type CoatingGuideClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function CoatingGuidePage({ initialDocs }: CoatingGuideClientProps) {
  const [base, setBase] = useState<BaseMaterial>("steel");
  const [need, setNeed] = useState<Need>("corrosion");

  const filtered = useMemo(
    () => COATINGS.filter((c) => c.bases.includes(base) && c.needs.includes(need)),
    [base, need],
  );

  return (
    <PageShell>
      <ToolDocTabs slug="coating-guide" initialDocs={initialDocs}>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Kaplama
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-medium text-amber-700">
            Hızlı Rehber
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">Kaplama Rehberi</h1>
        <p className="mt-2 text-xs text-slate-600">
          Alt malzeme ve öncelikli ihtiyacı seç; uygun kaplamaları ve kısa notları gör. Tolerans,
          sıcaklık ve kimyasal uygunluk için tedarikçi teknik föyünü mutlaka kontrol edin.
          Kalın/ince kaplama uyarıları ve iletkenlik/ısı etkileri burada özetlenmiştir.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Seçimler</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="block text-[11px] font-medium text-slate-700">Alt malzeme</span>
              <select
                value={base}
                onChange={(e) => setBase(e.target.value as BaseMaterial)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              >
                {(Object.keys(MATERIAL_LABELS) as BaseMaterial[]).map((m) => (
                  <option key={m} value={m}>
                    {MATERIAL_LABELS[m]}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="block text-[11px] font-medium text-slate-700">Öncelik</span>
              <select
                value={need}
                onChange={(e) => setNeed(e.target.value as Need)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              >
                {(Object.keys(NEED_LABELS) as Need[]).map((n) => (
                  <option key={n} value={n}>
                    {NEED_LABELS[n]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="mt-2 text-[11px] text-slate-600">
            İnce kaplamalar (PVD, siyah oksit, Zn) toleransı az etkiler; kalın kaplamalar
            (HDG, sert anodizasyon) ölçüleri büyütür, dişli/raflarda sorun çıkarabilir.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Önerilen Kaplamalar</h3>
          <div className="space-y-3">
            {filtered.map((c) => (
              <article key={c.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <h4 className="text-sm font-semibold text-slate-900">{c.name}</h4>
                <p className="text-[11px] text-slate-700">{c.description}</p>
                {c.thickness && (
                  <p className="mt-1 text-[11px] text-slate-700">
                    <span className="font-semibold">Tipik kalınlık: </span>
                    {c.thickness}
                  </p>
                )}
                {c.notes && <p className="mt-1 text-[11px] text-slate-500">{c.notes}</p>}
              </article>
            ))}
            {filtered.length === 0 && (
              <p className="text-[11px] text-slate-600">
                Bu seçim için öneri bulunamadı. Farklı öncelik veya malzeme seçin.
              </p>
            )}
          </div>
        </div>
      </section>
          </ToolDocTabs>
    </PageShell>
  );
}


