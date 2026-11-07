"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";

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
  nameTr: string;
  nameEn: string;
  groups: MaterialGroup[];
  goals: Goal[];
  descTr: string;
  descEn: string;
  notesTr?: string;
  notesEn?: string;
  typicalTr?: string;
  typicalEn?: string;
};

const TREATMENTS: Treatment[] = [
  {
    nameTr: "Gerilim Giderme",
    nameEn: "Stress Relief Annealing",
    groups: ["carbon", "alloy", "stainless", "tool", "aluminum", "castiron", "bearing"],
    goals: ["distortion", "stability"],
    descTr:
      "Düşük sıcaklıkta tavlama (çelik ~550–650°C, Al ~150–200°C) ile kaynak ve kaba talaşlı imalat iç gerilmelerini düşürür.",
    descEn:
      "Subcritical annealing (steels ~550–650°C, Al ~150–200°C) to relieve residual stresses from welding and rough machining.",
    notesTr: "Boyutsal stabilite için hassas finiş işleme öncesinde uygulanır.",
    notesEn: "Essential for dimensional stability prior to final precision grinding and EDM.",
  },
  {
    nameTr: "Normalizasyon",
    nameEn: "Normalizing",
    groups: ["carbon", "alloy", "castiron"],
    goals: ["strength", "distortion", "stability"],
    descTr:
      "Ac3 üzerine ısıtma ardından durgun havada soğutma; tane yapısını inceltir, homojen perlitik yapı sağlar.",
    descEn:
      "Heating above Ac3 followed by still-air cooling; refines grain size and restores uniform microstructure.",
    typicalTr: "C45, S355 gibi dövme veya haddelenmiş parçalarda işleme öncesi.",
    typicalEn: "Forged or hot-rolled parts (AISI 1045, S355) before machining.",
  },
  {
    nameTr: "Su Verme + Temper (Islah)",
    nameEn: "Quench and Temper (Q&T / Through Hardening)",
    groups: ["carbon", "alloy", "tool"],
    goals: ["strength", "wear", "fatigue"],
    descTr:
      "Östenitleme ardından martensit oluşturacak hızlı soğutma (yağ/su/polimer) ve temperleme. Mukavemet ve tokluk dengesi.",
    descEn:
      "Austenitizing followed by rapid cooling (oil/water/polymer) to martensite, followed by tempering for strength and toughness balance.",
    notesTr:
      "İstenen sertlik temperleme sıcaklığıyla hassas ayarlanır; çatlak riskini önlemek için kesit geçişlerine dikkat edilmelidir.",
    notesEn:
      "Target hardness is controlled by temper temperature. Generous corner radii are critical to prevent quench cracks.",
  },
  {
    nameTr: "Vakum Sertleştirme",
    nameEn: "Vacuum Hardening",
    groups: ["tool", "alloy", "bearing"],
    goals: ["strength", "distortion", "fatigue"],
    descTr:
      "Vakum fırında koruyucu gaz altında sertleştirme; dekarbürizasyonsuz, temiz yüzey ve minimum boyutsal deformasyon.",
    descEn:
      "Heating in a vacuum chamber with high-pressure nitrogen quenching; avoids decarburization and minimizes dimensional distortion.",
    typicalTr: "Sıcak/soğuk iş kalıp çelikleri (H13, 1.2379 / D2) ve hassas rulmanlar.",
    typicalEn: "Tool and die steels (H13, AISI D2, P20) and high-precision bearing components.",
  },
  {
    nameTr: "İndüksiyonla Yüzey Sertleştirme",
    nameEn: "Induction Surface Hardening",
    groups: ["carbon", "alloy", "castiron"],
    goals: ["wear", "fatigue"],
    descTr:
      "Yüksek frekans akımıyla lokal yüzey ısıtması ve anında duşla soğutma; çekirdek tok kalırken yüzey sertleşir.",
    descEn:
      "Localized high-frequency induction heating followed by immediate water spray quench; leaves tough core with high wear surface.",
    typicalTr: "Miller, pinyon dişliler, kam milleri (C45, 42CrMo4, 50CrV4).",
    typicalEn: "Shafts, pinion teeth, camshafts, and axles (AISI 1045, 4140, 6150).",
  },
  {
    nameTr: "Sementasyon (Karbonlama)",
    nameEn: "Case Hardening (Carburizing)",
    groups: ["alloy", "carbon", "bearing"],
    goals: ["wear", "fatigue"],
    descTr:
      "Düşük karbonlu çelik yüzeyine 900–930°C'de karbon emdirme ve su verme; sert aşınma kabuğu ve darbelere dayanıklı tok gövde.",
    descEn:
      "Diffusing carbon into low-carbon steel surfaces at 900–930°C followed by quench and temper; creates hard case and shock-resistant core.",
    typicalTr: "Ağır hizmet dişlileri ve diferansiyel dişlileri (16MnCr5, 20MnCr5, 8620).",
    typicalEn: "Heavy-duty transmission gears and pinions (AISI 5115, 8620, EN 16MnCr5).",
  },
  {
    nameTr: "Nitrasyon / Nitrokarbürleme",
    nameEn: "Nitriding / Nitrocarburizing",
    groups: ["alloy", "tool", "stainless", "castiron"],
    goals: ["wear", "corrosion", "fatigue", "stability"],
    descTr:
      "500–580°C'de östenitik faz sınırının altında azot difüzyonu; faz dönüşümü olmadığından deformasyon neredeyse sıfırdır.",
    descEn:
      "Ferritic thermochemical nitrogen diffusion at 500–580°C below phase transformation; minimal distortion and high surface hardness.",
    notesTr: "Al, Cr, Mo, V içeren çeliklerde yüksek yüzey sertliği (900–1200 HV) elde edilir.",
    notesEn: "Alloys containing Al, Cr, Mo, and V achieve extraordinary case hardness (900–1200 HV).",
  },
  {
    nameTr: "QPQ / Tenifer (Tuz Banyosu Nitrokarbürleme)",
    nameEn: "QPQ / Ferritic Nitrocarburizing",
    groups: ["alloy", "tool", "carbon"],
    goals: ["wear", "corrosion", "fatigue"],
    descTr:
      "Nitrokarbürleme, parlatma ve kontrollü oksidasyon işlemi; parlak siyah yüzey, yüksek aşınma ve tuz sisi korozyon direnci.",
    descEn:
      "Quench-Polish-Quench salt bath nitrocarburizing with secondary post-oxidation; provides black aesthetic, extreme wear and salt-spray resistance.",
    typicalTr: "Hidrolik piston milleri, kalıp kılavuz plakaları, ateşli silah parçaları.",
    typicalEn: "Hydraulic cylinder rods, sliding wear plates, and industrial firearm components.",
  },
  {
    nameTr: "Austemperleme (Bainitik Dönüşüm)",
    nameEn: "Austempering (Bainitic Hardening)",
    groups: ["carbon", "alloy", "castiron"],
    goals: ["strength", "fatigue", "distortion"],
    descTr:
      "Sıcak tuz banyosunda izotermal tutma ile martensit yerine beynit oluşturma; çatlama riski ve boyutsal çarpılma düşüktür.",
    descEn:
      "Isothermal quenching in molten salt to produce a tough bainitic structure without entering the martensite start range.",
    notesTr: "Özellikle küresel grafitli dökme demirde (ADI) yüksek darbe ve yorulma direnci kazandırır.",
    notesEn: "Widely used for Austempered Ductile Iron (ADI) providing exceptional toughness and fatigue limits.",
  },
  {
    nameTr: "Derin Kriyojenik İşlem (-196°C)",
    nameEn: "Cryogenic Sub-Zero Treatment",
    groups: ["tool", "bearing"],
    goals: ["wear", "stability", "fatigue"],
    descTr:
      "Sertleştirme sonrası sıvı azotta -196°C'ye soğutma; kalıntı östeniti martensite dönüştürür ve ince eta-karbürleri çöktürür.",
    descEn:
      "Deep freezing in liquid nitrogen (-196°C) post-quench; transforms retained austenite to martensite and precipitates fine sub-micro carbides.",
    notesTr: "D2, A2 ve 100Cr6 takımlarda maksimum aşınma direnci ve mikron boyutsal kararlılık sağlar.",
    notesEn: "Essential for AISI D2, A2, and bearing 52100 steels where micron stability is required.",
  },
  {
    nameTr: "Çözelti Alma + Yaşlandırma (Alüminyum)",
    nameEn: "Solution Heat Treating + Aging (T6)",
    groups: ["aluminum"],
    goals: ["strength", "corrosion", "stability"],
    descTr:
      "480–530°C'de çözeltiye alma, su verme ve ardından 160–180°C'de yapay yaşlandırma; intermetalik çökelmeler mukavemeti 2–3 kat artırır.",
    descEn:
      "Solutionizing at 480–530°C, cold water quenching, and artificial aging at 160–180°C; coherent precipitates dramatically boost strength.",
    typicalTr: "6061-T6, 6082-T6, 7075-T6 havacılık ve makine gövde parçaları.",
    typicalEn: "6061-T6, 6082-T6, 7075-T6 aerospace structures and high-speed robotic components.",
  },
  {
    nameTr: "Aşırı Yaşlandırma / SCC Koruması (T73 / T74)",
    nameEn: "Overaging for Stress Corrosion (T73 / T74)",
    groups: ["aluminum"],
    goals: ["corrosion", "stability"],
    descTr:
      "İki kademeli yüksek sıcaklık yaşlandırması ile pik mukavemetten %10–15 feragat edilerek stres korozyonu çatlaması önlenir.",
    descEn:
      "Two-stage overaging that trades 10–15% peak tensile strength for immunity to stress corrosion cracking (SCC).",
    typicalTr: "7075 ve 7050 serisi kritik havacılık ve denizcilik bağlantı elemanları.",
    typicalEn: "Critical aerospace spars and marine fittings in 7075 / 7050 alloys.",
  },
  {
    nameTr: "Çökelme Sertleşmesi (Paslanmaz 17-4PH)",
    nameEn: "Precipitation Hardening (17-4 PH)",
    groups: ["stainless"],
    goals: ["strength", "corrosion"],
    descTr:
      "Çözelti tavı sonrasında 480–620°C arasında tek kademeli yaşlandırma; korozyon direncini korurken 1100–1300 MPa akma mukavemeti sağlar.",
    descEn:
      "Single-step heat treatment at 480–620°C (H900 to H1150) post-solution anneal; achieves 1100–1300 MPa yield while resisting rust.",
    typicalTr: "H900 maksimum sertlik; H1025 ve H1150 darbe tokluğu gerektiren şaft ve miller.",
    typicalEn: "H900 for maximum hardness, H1025 / H1150 for high-toughness pump shafts and valves.",
  },
  {
    nameTr: "Çökelme Sertleşmesi (Berilyum Bakır / Alüminyum Bronz)",
    nameEn: "Precipitation Hardening (CuBe / CuAl Bronze)",
    groups: ["copper"],
    goals: ["strength", "wear", "fatigue"],
    descTr:
      "Bakır matrisinde intermetalik parçacık çökelterek çelik seviyesinde mukavemet (~1400 MPa) ve yüksek iletkenlik kazandırır.",
    descEn:
      "Precipitating intermetallic phases in copper matrix to reach steel-like tensile properties (~1400 MPa) while retaining high thermal conductivity.",
    notesTr: "Berilyum tozu toksiktir; kuru taşlama ve işlemede ISG önlemlerine dikkat edilmelidir.",
    notesEn: "Beryllium dust is hazardous; follow strict dry machining dust extraction protocols.",
  },
  {
    nameTr: "Küreselleştirme / Yumuşatma Tavı",
    nameEn: "Spheroidize Annealing",
    groups: ["tool", "carbon"],
    goals: ["distortion", "stability"],
    descTr:
      "Yüksek karbonlu ve takım çeliklerinde lamelli perliti küresel karbürlere dönüştürerek talaşlı işlenebilirliği maksimize eder.",
    descEn:
      "Transforms lamellar pearlite into spherical carbide particles to dramatically improve machinability and ductility in tool steels.",
    notesTr: "Kalıp bloklarının kaba işlenmesi öncesinde malzeme tedarikçisinden bu kondisyonda istenir.",
    notesEn: "Standard procurement condition for high-alloy tool blocks prior to CNC roughing.",
  },
  {
    nameTr: "Çözümleyici Tavlama (Östenitik Paslanmaz)",
    nameEn: "Solution Annealing (Austenitic Stainless)",
    groups: ["stainless"],
    goals: ["corrosion", "stability"],
    descTr:
      "1050–1150°C'ye ısıtıp hızla soğutarak kaynak dikişlerinde çökelen krom karbürleri matrise geri çözer; tane sınırları korozyonunu önler.",
    descEn:
      "Heating to 1050–1150°C followed by rapid quenching to dissolve grain boundary chromium carbides, preventing intergranular corrosion.",
    notesTr: "304 ve 316 kaynaklı boru ve kimyasal kazan imalatlarında pasivasyon öncesi uygulanır.",
    notesEn: "Mandatory for welded 304/316 piping and chemical vessels prior to pickling and passivation.",
  },
  {
    nameTr: "Ferritleştirme / Dönüşüm Tavı (Dökme Demir)",
    nameEn: "Ferritizing Anneal (Ductile / Gray Iron)",
    groups: ["castiron"],
    goals: ["stability", "strength"],
    descTr:
      "Döküm sonrasında perlitik yapıyı ferritik matrise dönüştürerek uzama kabiliyetini artırır ve artık döküm gerilimlerini yok eder.",
    descEn:
      "Transforms pearlitic matrix into ferrite to increase elongation and ductility while relieving internal casting shrink stresses.",
    typicalTr: "GGG-40 sfero döküm gövdeler ve valf muhafazaları.",
    typicalEn: "EN-GJS-400 ductile iron pump housings and heavy valve bodies.",
  },
  {
    nameTr: "Gerilim Giderme Tavı (Gri Dökme Demir)",
    nameEn: "Subcritical Stress Relief (Gray Iron)",
    groups: ["castiron"],
    goals: ["stability"],
    descTr:
      "550–600°C'de yavaş ısıtma ve fırında soğutma; sertliği değiştirmeden torna ve frezelemede geometrik çarpılmayı önler.",
    descEn:
      "Slow heating to 550–600°C and controlled furnace cooling; prevents twist and warping during CNC precision boring.",
  },
];

const GROUP_LABELS = {
  tr: {
    carbon: "Karbon Çelikleri",
    alloy: "Alaşımlı Çelikler",
    stainless: "Paslanmaz Çelikler",
    tool: "Takım Çelikleri",
    aluminum: "Alüminyum Alaşımları",
    castiron: "Dökme Demir",
    bearing: "Rulman Çelikleri",
    copper: "Bakır / Bronz Alaşımları",
  },
  en: {
    carbon: "Carbon Steels",
    alloy: "Alloy Steels",
    stainless: "Stainless Steels",
    tool: "Tool Steels",
    aluminum: "Aluminum Alloys",
    castiron: "Cast Irons",
    bearing: "Bearing Steels",
    copper: "Copper & Bronze Alloys",
  },
} as const;

const GOAL_LABELS = {
  tr: {
    strength: "Dayanım & Tokluk",
    wear: "Aşınma & Yüzey Sertliği",
    distortion: "Düşük Deformasyon",
    corrosion: "Korozyon Direnci",
    fatigue: "Yorulma Ömrü",
    stability: "Boyutsal Kararlılık",
  },
  en: {
    strength: "Strength & Toughness",
    wear: "Wear & Surface Hardness",
    distortion: "Low Distortion",
    corrosion: "Corrosion Resistance",
    fatigue: "Fatigue Life",
    stability: "Dimensional Stability",
  },
} as const;

const COPY = {
  tr: {
    badge: "Isıl İşlem",
    subBadge: "Malzeme Odaklı",
    title: "Hangi Malzemeye Hangi Isıl İşlem?",
    desc: "Malzeme grubunu ve öncelikli ihtiyacı seç; uygun ısıl işlem önerilerini ve kısa notları gör. Değerler/öneriler hızlı hatırlatma içindir; kritik parçalar için standarda ve tedarikçi reçetesine bakın.",
    selectionsTitle: "Seçimler",
    matGroupLabel: "Malzeme grubu",
    goalLabel: "Hedef / Öncelik",
    tip: "İpucu: Deformasyon kaygısı varsa düşük sıcaklıklı veya difüzyon bazlı işlemler (nitrasyon, stres giderme) tercih edilir. Aşınma için yüzey sertleştirme veya difüzyon; korozyon için paslanmaz çözelti/yaşlandırma veya nitrasyon.",
    recTitle: "Uyumlu Isıl İşlem Önerileri",
    typicalLabel: "Tipik kullanım:",
    noMatch: "Bu kombinasyon için öneri bulunamadı. Parametreleri değiştirin.",
  },
  en: {
    badge: "Heat Treatment",
    subBadge: "Material Selector",
    title: "Heat Treatment Selection Guide",
    desc: "Select the alloy family and primary engineering requirement to view recommended heat treatment processes, metallurgical effects, and shop-floor design tips. Reference guidance only; verify with standard specs and heat treaters.",
    selectionsTitle: "Parameters",
    matGroupLabel: "Material Family",
    goalLabel: "Target Objective / Priority",
    tip: "Design Tip: For tight tolerances and low distortion, prioritize diffusion-based or subcritical treatments (nitriding, stress relief). For localized wear resistance choose induction hardening or carburizing; for corrosion choose solution annealing or precipitation hardening.",
    recTitle: "Recommended Heat Treatment Processes",
    typicalLabel: "Typical applications:",
    noMatch: "No direct heat treatment recommendation found for this combination. Try adjusting the material or target objective.",
  },
} as const;

type HeatTreatmentClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function HeatTreatmentPage({ initialDocs }: HeatTreatmentClientProps) {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const t = COPY[isEn ? "en" : "tr"];
  const groupLabels = GROUP_LABELS[isEn ? "en" : "tr"];
  const goalLabels = GOAL_LABELS[isEn ? "en" : "tr"];

  const [group, setGroup] = useState<MaterialGroup>("alloy");
  const [goal, setGoal] = useState<Goal>("strength");

  const filtered = useMemo(
    () =>
      TREATMENTS.filter(
        (treatment) => treatment.groups.includes(group) && treatment.goals.includes(goal),
      ),
    [group, goal],
  );

  return (
    <PageShell>
      <ToolDocTabs slug="heat-treatment" initialDocs={initialDocs}>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-xs">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {t.badge}
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-medium text-amber-700">
              {t.subBadge}
            </span>
          </div>
          <h1 className="text-lg font-semibold text-slate-900">{t.title}</h1>
          <p className="mt-2 text-xs text-slate-600">{t.desc}</p>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.selectionsTitle}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="block text-[11px] font-medium text-slate-700">
                  {t.matGroupLabel}
                </span>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value as MaterialGroup)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                >
                  {(Object.keys(groupLabels) as MaterialGroup[]).map((g) => (
                    <option key={g} value={g}>
                      {groupLabels[g]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="block text-[11px] font-medium text-slate-700">
                  {t.goalLabel}
                </span>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as Goal)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                >
                  {(Object.keys(goalLabels) as Goal[]).map((g) => (
                    <option key={g} value={g}>
                      {goalLabels[g]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="mt-2 text-[11px] text-slate-600">{t.tip}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">{t.recTitle}</h3>
            <div className="space-y-3">
              {filtered.map((item) => (
                <article
                  key={item.nameTr}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <h4 className="text-sm font-semibold text-slate-900">
                    {isEn ? item.nameEn : item.nameTr}
                  </h4>
                  <p className="text-[11px] text-slate-700">{isEn ? item.descEn : item.descTr}</p>
                  {(isEn ? item.typicalEn : item.typicalTr) && (
                    <p className="mt-1 text-[11px] text-slate-700">
                      <span className="font-semibold">{t.typicalLabel} </span>
                      {isEn ? item.typicalEn : item.typicalTr}
                    </p>
                  )}
                  {(isEn ? item.notesEn : item.notesTr) && (
                    <p className="mt-1 text-[11px] text-slate-500">
                      {isEn ? item.notesEn : item.notesTr}
                    </p>
                  )}
                </article>
              ))}
              {filtered.length === 0 && (
                <p className="text-[11px] text-slate-600">{t.noMatch}</p>
              )}
            </div>
          </div>
        </section>
      </ToolDocTabs>
    </PageShell>
  );
}
