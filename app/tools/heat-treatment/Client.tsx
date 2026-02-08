// app/tools/heat-treatment/page.tsx
"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";

type MaterialGroup =
  | "carbon"
  | "alloy"
  | "stainless"
  | "tool"
  | "aluminum"
  | "castiron"
  | "bearing"
  | "copper";

type Goal = "strength" | "wear" | "distortion" | "corrosion" | "fatigue" | "stability";

type Treatment = {
  name: string;
  groups: MaterialGroup[];
  goals: Goal[];
  description: string;
  notes?: string;
  typical?: string;
};

const TREATMENTS: Treatment[] = [
  {
    name: "Gerilim Giderme",
    groups: ["carbon", "alloy", "stainless", "tool", "aluminum", "castiron", "bearing"],
    goals: ["distortion", "stability"],
    description: "Düşük sıcaklıkta tavlama (çelik ~550–650°C, Al ~150–200°C) ile kaynak/işleme gerilmelerini düşürür.",
    notes: "Boyutsal stabilite için işleme öncesi/sonrası uygulanır.",
  },
  {
    name: "Normalizasyon",
    groups: ["carbon", "alloy", "castiron"],
    goals: ["strength", "distortion", "stability"],
    description: "Ac3 üzerine ısıtma ardından hava soğutma; tane incelir, homojen yapı sağlar.",
    typical: "C45, S355 gibi malzemelerde işleme öncesi.",
  },
  {
    name: "Suverme + Temper",
    groups: ["carbon", "alloy", "tool"],
    goals: ["strength", "wear", "fatigue"],
    description: "Martensit oluşturacak soğutma (yağ/su/polimer) ardından temper. Dayanım + tokluk dengesi.",
    notes: "İstenen sertlik temper sıcaklığıyla ayarlanır; çatlak riski için kesit ve soğutma medyası seçimi kritik.",
  },
  {
    name: "Vakum Sertleştirme",
    groups: ["tool", "alloy", "bearing"],
    goals: ["strength", "distortion", "fatigue"],
    description: "Vakum fırında sertleştirme; temiz yüzey, düşük oksit ve daha düşük deformasyon.",
    typical: "Kalıp çelikleri (H13, P20, D2) ve rulman çelikleri.",
  },
  {
    name: "İndüksiyonla Yüzey Sertleştirme",
    groups: ["carbon", "alloy", "castiron"],
    goals: ["wear", "fatigue"],
    description: "Yüzeyde lokal austenitleme + hızlı soğutma; çekirdek tok kalır, yüzey sert olur.",
    typical: "Miller, dişliler, kama kanallı millerde 50CrV4/42CrMo4 gibi çelikler.",
  },
  {
    name: "Karbonlama (Cementation)",
    groups: ["alloy", "carbon", "bearing"],
    goals: ["wear", "fatigue"],
    description: "Yüzeye karbon difüzyonu (900–930°C) ardından sertleştirme. Yüksek yüzey sertliği + tok çekirdek.",
    typical: "16MnCr5 / 20MnCr5 dişli ve pinyonlarda.",
  },
  {
    name: "Nitrasyon / Nitrokarbürleme",
    groups: ["alloy", "tool", "stainless", "castiron"],
    goals: ["wear", "corrosion", "fatigue", "stability"],
    description: "500–580°C civarında azot (ve karbon) difüzyonu; düşük deformasyon, sert difüzyon tabakası.",
    notes: "42CrMo4, 1.2379, bazı paslanmaz sınıflar. Karbür çökelmesi aşındırıcı ortamda avantaj.",
  },
  {
    name: "QPQ / Tenifer (Tuz Banyosu Nitrokarbürleme)",
    groups: ["alloy", "tool", "carbon"],
    goals: ["wear", "corrosion", "fatigue"],
    description: "Tuz banyosunda nitrokarbürleme + oksidasyon; siyah yüzey, yüksek aşınma ve orta korozyon direnci.",
    typical: "Kalıp plaka, şaft, bağlantı elemanı yüzey güçlendirme.",
  },
  {
    name: "Austemper / Bainit",
    groups: ["carbon", "alloy", "castiron"],
    goals: ["strength", "fatigue", "distortion"],
    description: "Martempering sonrası bainitik yapı; kırılganlık düşer, deformasyon azalır.",
    notes: "Küresel grafitli dökme demirde (ADI) yüksek dayanım ve yorulma için.",
  },
  {
    name: "Derin Dondurma (Cryogenic)",
    groups: ["tool", "bearing"],
    goals: ["wear", "stability", "fatigue"],
    description: "Isıl işlem sonrası -80/-196°C’ye soğutma; artık östeniti martensite dönüştürür.",
    notes: "Özellikle D2, A2, rulman çeliklerinde boyutsal stabilite ve aşınma için.",
  },
  {
    name: "Çözelti + Yaşlandırma (Alüminyum)",
    groups: ["aluminum"],
    goals: ["strength", "corrosion", "stability"],
    description: "Çözeltiye alma (480–530°C), su verme ve doğal/yapay yaşlandırma. Dayanım artışı sağlar.",
    typical: "6061-T6, 6082-T6, 7075-T6/T73; T73 stres korozyonu için daha güvenli.",
  },
  {
    name: "Stres Korozyon için Overaging (T73 vb.)",
    groups: ["aluminum"],
    goals: ["corrosion", "stability"],
    description: "Yüksek sıcaklıkta yaşlandırma ile mukavemet bir miktar düşerken SCC dayanımı artar.",
    typical: "7075/7050 gibi 7xxx alaşımlarda T73/T74.",
  },
  {
    name: "Çökelme Sertleşmesi (Paslanmaz 17-4PH)",
    groups: ["stainless"],
    goals: ["strength", "corrosion"],
    description: "Çözelti + yaşlandırma (H900–H1150); yüksek dayanım + korozyon dengesi.",
    typical: "H900: ~1000 MPa Rp0.2; daha tok yapı için H1025–H1150.",
  },
  {
    name: "Çökelme Sertleşmesi (Al Bronz / CuBe)",
    groups: ["copper"],
    goals: ["strength", "wear", "fatigue"],
    description: "Çökelme ile dayanım artırılır; berilyum bronz ve Al bronzda yay/kalıp insertlerinde.",
    notes: "Berilyum tozu tehlikeli; işleme sırasında dikkat.",
  },
  {
    name: "Yumuşatma Tavı (Yeniden Küreselleştirme)",
    groups: ["tool", "carbon"],
    goals: ["distortion", "stability"],
    description: "Takım çeliklerinde işlenebilirlik ve kaba şekil için perlit/karbür yapısını küreselleştirir.",
    notes: "Kesici takım çeliklerinde işleme öncesi tercih edilir.",
  },
  {
    name: "Çözümleyici Tav (Paslanmaz östenitik)",
    groups: ["stainless"],
    goals: ["corrosion", "stability"],
    description: "Sensitizasyonu giderir, karbür çökelmesini çözerek korozyon direncini artırır.",
    notes: "304/316 kaynak sonrası pasivasyon öncesi uygulanabilir.",
  },
  {
    name: "Ferritik/Ostenitik Dönüşüm Tavı (Dökme Demir)",
    groups: ["castiron"],
    goals: ["stability", "strength"],
    description: "Dökme demirde ferrit-perlit dengesini ayarlar; gerilim azaltır, işlenebilirliği iyileştirir.",
    typical: "GG25, GGG40 işleme öncesi.",
  },
  {
    name: "Siyah Tav (Gri Dökme Demir)",
    groups: ["castiron"],
    goals: ["stability"],
    description: "Düşük sıcaklık tavı ile iç gerilme azaltılır, boyutsal stabilite artar.",
  },
];

const GROUP_LABELS: Record<MaterialGroup, string> = {
  carbon: "Karbon Çelikleri",
  alloy: "Alaşımlı Çelikler",
  stainless: "Paslanmaz",
  tool: "Takım Çelikleri",
  aluminum: "Alüminyum Alaşımları",
  castiron: "Dökme Demir",
  bearing: "Rulman Çelikleri",
  copper: "Bakır/Bronz",
};

const GOAL_LABELS: Record<Goal, string> = {
  strength: "Dayanım/çekiç",
  wear: "Aşınma/yüzey sertliği",
  distortion: "Düşük deformasyon",
  corrosion: "Korozyon direnci",
  fatigue: "Yorulma",
  stability: "Boyutsal stabilite",
};

type HeatTreatmentClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function HeatTreatmentPage({ initialDocs }: HeatTreatmentClientProps) {
  const [group, setGroup] = useState<MaterialGroup>("alloy");
  const [goal, setGoal] = useState<Goal>("strength");

  const filtered = useMemo(
    () =>
      TREATMENTS.filter(
        (t) => t.groups.includes(group) && t.goals.includes(goal),
      ),
    [group, goal],
  );

  return (
    <PageShell>
      <ToolDocTabs slug="heat-treatment" initialDocs={initialDocs}>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Isıl İşlem
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-medium text-amber-700">
            Malzeme Odaklı
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          Hangi Malzemeye Hangi Isıl İşlem?
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Malzeme grubunu ve öncelikli ihtiyacı seç; uygun ısıl işlem önerilerini ve kısa
          notları gör. Değerler/öneriler hızlı hatırlatma içindir; kritik parçalar için
          standarda ve tedarikçi reçetesine bakın.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Seçimler</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="block text-[11px] font-medium text-slate-700">
                Malzeme grubu
              </span>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value as MaterialGroup)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              >
                {(Object.keys(GROUP_LABELS) as MaterialGroup[]).map((g) => (
                  <option key={g} value={g}>
                    {GROUP_LABELS[g]}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="block text-[11px] font-medium text-slate-700">
                Hedef / Öncelik
              </span>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as Goal)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              >
                {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
                  <option key={g} value={g}>
                    {GOAL_LABELS[g]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="mt-2 text-[11px] text-slate-600">
            Tip: Deformasyon kaygısı varsa düşük sıcaklıklı veya difüzyon bazlı işlemler
            (nitrasyon, stres giderme) tercih edilir. Aşınma için yüzey sertleştirme veya
            difüzyon; korozyon için paslanmaz çözelti/yaşlandırma veya nitrasyon.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Uyumlu Isıl İşlem Önerileri
          </h3>
          <div className="space-y-3">
            {filtered.map((t) => (
              <article
                key={t.name}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <h4 className="text-sm font-semibold text-slate-900">{t.name}</h4>
                <p className="text-[11px] text-slate-700">{t.description}</p>
                {t.typical && (
                  <p className="mt-1 text-[11px] text-slate-700">
                    <span className="font-semibold">Tipik kullanım: </span>
                    {t.typical}
                  </p>
                )}
                {t.notes && <p className="mt-1 text-[11px] text-slate-500">{t.notes}</p>}
              </article>
            ))}
            {filtered.length === 0 && (
              <p className="text-[11px] text-slate-600">
                Bu kombinasyon için öneri bulunamadı. Parametreleri değiştirin.
              </p>
            )}
          </div>
        </div>
      </section>
          </ToolDocTabs>
    </PageShell>
  );
}


