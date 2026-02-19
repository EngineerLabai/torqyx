"use client";

import { useEffect, useMemo, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import type { Locale } from "@/utils/locale";

type LocalizedText = Record<Locale, string>;

type MaterialRow = {
  id: string;
  name: string;
  category: LocalizedText;
  density: string;
  elasticModulus: string;
  yieldStrength: string;
  conductivity: string;
  thermalExpansion: string;
  corrosionNote: LocalizedText;
};

const MATERIALS: MaterialRow[] = [
  {
    id: "s235jr",
    name: "S235JR",
    category: { tr: "Yapısal çelik", en: "Structural steel" },
    density: "7,850",
    elasticModulus: "210",
    yieldStrength: "235",
    conductivity: "50",
    thermalExpansion: "12",
    corrosionNote: { tr: "Kaplamasız dış ortamda hızlı paslanır.", en: "Rusts quickly outdoors without coating." },
  },
  {
    id: "c45",
    name: "C45 / 1045",
    category: { tr: "Karbon çeliği", en: "Carbon steel" },
    density: "7,850",
    elasticModulus: "210",
    yieldStrength: "310-450",
    conductivity: "49",
    thermalExpansion: "11.5",
    corrosionNote: { tr: "Yüzey koruması önerilir.", en: "Surface protection recommended." },
  },
  {
    id: "42crmo4",
    name: "42CrMo4",
    category: { tr: "Alaşımlı çelik", en: "Alloy steel" },
    density: "7,850",
    elasticModulus: "210",
    yieldStrength: "650-900",
    conductivity: "42",
    thermalExpansion: "11.8",
    corrosionNote: { tr: "İşlenmiş yüzeyde kaplama gerektirir.", en: "Machined surfaces usually need coating." },
  },
  {
    id: "en-gjl-250",
    name: "EN-GJL-250",
    category: { tr: "Dökme demir (lamel grafit)", en: "Cast iron (gray iron)" },
    density: "7,200",
    elasticModulus: "110-130",
    yieldStrength: "-",
    conductivity: "46",
    thermalExpansion: "10.5",
    corrosionNote: { tr: "Atmosferik korozyona karşı orta direnç.", en: "Moderate atmospheric corrosion resistance." },
  },
  {
    id: "en-gjs-500-7",
    name: "EN-GJS-500-7",
    category: { tr: "Sfero dökme demir", en: "Ductile iron" },
    density: "7,100",
    elasticModulus: "165-175",
    yieldStrength: "320",
    conductivity: "32",
    thermalExpansion: "11",
    corrosionNote: { tr: "Kaplama ile servis ömrü uzar.", en: "Coating improves service life." },
  },
  {
    id: "6061-t6",
    name: "Al 6061-T6",
    category: { tr: "Alüminyum", en: "Aluminum" },
    density: "2,700",
    elasticModulus: "69",
    yieldStrength: "240-275",
    conductivity: "167",
    thermalExpansion: "23.6",
    corrosionNote: { tr: "Genel ortamda iyi; deniz ortamında dikkat.", en: "Good in general service; check marine exposure." },
  },
  {
    id: "7075-t6",
    name: "Al 7075-T6",
    category: { tr: "Alüminyum", en: "Aluminum" },
    density: "2,810",
    elasticModulus: "71",
    yieldStrength: "500-540",
    conductivity: "130",
    thermalExpansion: "23.5",
    corrosionNote: { tr: "Gerilim korozyonuna hassas olabilir.", en: "Can be sensitive to stress corrosion." },
  },
  {
    id: "aisi-304",
    name: "AISI 304",
    category: { tr: "Paslanmaz çelik", en: "Stainless steel" },
    density: "7,900",
    elasticModulus: "193",
    yieldStrength: "200-215",
    conductivity: "16",
    thermalExpansion: "17.2",
    corrosionNote: { tr: "Genel korozyon direnci iyi.", en: "Good general corrosion resistance." },
  },
  {
    id: "aisi-316",
    name: "AISI 316",
    category: { tr: "Paslanmaz çelik", en: "Stainless steel" },
    density: "8,000",
    elasticModulus: "193",
    yieldStrength: "200-205",
    conductivity: "15",
    thermalExpansion: "16",
    corrosionNote: { tr: "Klorürlü ortamlarda 304'e göre daha iyi.", en: "Better than 304 in chloride environments." },
  },
  {
    id: "cuzn39pb3",
    name: "CuZn39Pb3 (Brass)",
    category: { tr: "Pirinç", en: "Brass" },
    density: "8,470",
    elasticModulus: "100",
    yieldStrength: "200-350",
    conductivity: "110",
    thermalExpansion: "20.5",
    corrosionNote: { tr: "Su sistemlerinde iyi; amonyakta dikkat.", en: "Good in water systems; caution with ammonia." },
  },
  {
    id: "cusn12",
    name: "CuSn12 (Bronze)",
    category: { tr: "Bronz", en: "Bronze" },
    density: "8,800",
    elasticModulus: "105",
    yieldStrength: "250-320",
    conductivity: "58",
    thermalExpansion: "17.5",
    corrosionNote: { tr: "Aşınma ve deniz ortamında avantajlı.", en: "Good wear and marine performance." },
  },
  {
    id: "pom",
    name: "POM",
    category: { tr: "Mühendislik plastiği", en: "Engineering plastic" },
    density: "1,410",
    elasticModulus: "2.8-3.2",
    yieldStrength: "60-70",
    conductivity: "0.31",
    thermalExpansion: "110",
    corrosionNote: { tr: "Çoğu yağ ve yakıta dayanır.", en: "Resists many oils and fuels." },
  },
  {
    id: "pa6",
    name: "PA6",
    category: { tr: "Mühendislik plastiği", en: "Engineering plastic" },
    density: "1,130",
    elasticModulus: "2.0-2.8",
    yieldStrength: "45-80",
    conductivity: "0.25",
    thermalExpansion: "80-100",
    corrosionNote: { tr: "Nem alma ile özellik değişebilir.", en: "Properties shift with moisture absorption." },
  },
  {
    id: "ptfe",
    name: "PTFE",
    category: { tr: "Mühendislik plastiği", en: "Engineering plastic" },
    density: "2,150",
    elasticModulus: "0.4-0.7",
    yieldStrength: "15-30",
    conductivity: "0.25",
    thermalExpansion: "120-200",
    corrosionNote: { tr: "Kimyasallara karşı çok yüksek direnç.", en: "Excellent resistance to most chemicals." },
  },
  {
    id: "nbr",
    name: "NBR",
    category: { tr: "Elastomer", en: "Elastomer" },
    density: "1,000-1,300",
    elasticModulus: "0.005-0.02",
    yieldStrength: "-",
    conductivity: "0.2",
    thermalExpansion: "160-220",
    corrosionNote: { tr: "Yağlara iyi, ozon ve UV'ye zayıf.", en: "Good with oils, weaker against ozone/UV." },
  },
  {
    id: "epdm",
    name: "EPDM",
    category: { tr: "Elastomer", en: "Elastomer" },
    density: "860-1,200",
    elasticModulus: "0.003-0.01",
    yieldStrength: "-",
    conductivity: "0.25",
    thermalExpansion: "150-210",
    corrosionNote: { tr: "Su, buhar ve hava koşullarına iyi.", en: "Strong against water, steam, and weathering." },
  },
];

const COPY: Record<Locale, {
  hero: { title: string; description: string; eyebrow: string; imageAlt: string };
  intro: string;
  mini: {
    label: string;
    title: string;
    description: string;
    searchLabel: string;
    searchPlaceholder: string;
    selected: string;
    max: string;
    compareHint: string;
  };
  table: {
    title: string;
    columns: string[];
    compareButton: string;
    compareButtonActive: string;
    noResults: string;
  };
  compare: {
    title: string;
    description: string;
    rows: {
      category: string;
      density: string;
      elasticModulus: string;
      yieldStrength: string;
      conductivity: string;
      thermalExpansion: string;
      corrosion: string;
    };
    empty: string;
  };
  references: { title: string; items: string[] };
}> = {
  tr: {
    hero: {
      title: "Malzemeler: hızlı mühendislik karşılaştırma",
      description:
        "Pratik özellik tablosu ile malzeme adaylarını filtrele, sonra en fazla 3 aday için yan yana karşılaştır.",
      eyebrow: "Standards",
      imageAlt: "Materials engineering comparison",
    },
    intro:
      "Değerler tipik aralıktır (oda sıcaklığı). Isıl işlem, üretici standardı ve ürün formuna göre değişebilir.",
    mini: {
      label: "Mini Tool",
      title: "Arama + karşılaştırma",
      description: "Tablodan en fazla 3 malzeme seçerek ana özellikleri satır bazında kıyaslayın.",
      searchLabel: "Malzeme ara",
      searchPlaceholder: "Örnek: EN-GJS, 316, PTFE, elastomer",
      selected: "Seçilen",
      max: "Maksimum 3 malzeme karşılaştırılabilir.",
      compareHint: "Seçim için tabloda Karşılaştır butonunu kullanın.",
    },
    table: {
      title: "Pratik malzeme tablosu",
      columns: [
        "Aksiyon",
        "Malzeme",
        "Kategori",
        "Yoğunluk (kg/m³)",
        "E (GPa)",
        "Akma (MPa, tipik)",
        "Isıl iletkenlik (W/mK)",
        "Isıl genleşme (µm/mK)",
        "Korozyon notu",
      ],
      compareButton: "Karşılaştır",
      compareButtonActive: "Seçildi",
      noResults: "Arama kriterine uyan malzeme bulunamadı.",
    },
    compare: {
      title: "Yan yana karşılaştırma",
      description: "Seçili malzemeler aynı satırlarda gösterilir.",
      rows: {
        category: "Kategori",
        density: "Yoğunluk (kg/m³)",
        elasticModulus: "Elastisite modülü E (GPa)",
        yieldStrength: "Akma dayanımı (MPa, tipik)",
        conductivity: "Isıl iletkenlik (W/mK)",
        thermalExpansion: "Isıl genleşme (µm/mK)",
        corrosion: "Korozyon / kimyasal not",
      },
      empty: "Karşılaştırma için en az 1 malzeme seçin.",
    },
    references: {
      title: "References",
      items: [
        "EN 10025: Structural steels",
        "EN 1561 / EN 1563: Cast iron grades (EN-GJL / EN-GJS)",
        "EN 573 / EN 485: Aluminum alloys and temper designations",
        "ASM Handbook, Volume 2: Properties and Selection of Metals",
        "MatWeb and supplier datasheets (for final grade confirmation)",
      ],
    },
  },
  en: {
    hero: {
      title: "Materials: practical engineering comparison",
      description:
        "Filter candidates with one practical property table, then compare up to 3 materials side by side.",
      eyebrow: "Standards",
      imageAlt: "Materials engineering comparison",
    },
    intro:
      "Values are typical ranges at room temperature. Heat treatment, supplier standard, and product form can shift results.",
    mini: {
      label: "Mini Tool",
      title: "Search + compare",
      description: "Select up to 3 materials from the table and compare key properties row by row.",
      searchLabel: "Search materials",
      searchPlaceholder: "Example: EN-GJS, 316, PTFE, elastomer",
      selected: "Selected",
      max: "Maximum 3 materials can be compared.",
      compareHint: "Use Compare buttons in the table to select items.",
    },
    table: {
      title: "Practical materials table",
      columns: [
        "Action",
        "Material",
        "Category",
        "Density (kg/m³)",
        "E (GPa)",
        "Yield (MPa, typical)",
        "Conductivity (W/mK)",
        "Thermal expansion (µm/mK)",
        "Corrosion note",
      ],
      compareButton: "Compare",
      compareButtonActive: "Selected",
      noResults: "No materials match the search query.",
    },
    compare: {
      title: "Side-by-side compare",
      description: "Selected materials are shown across identical property rows.",
      rows: {
        category: "Category",
        density: "Density (kg/m³)",
        elasticModulus: "Elastic modulus E (GPa)",
        yieldStrength: "Yield strength (MPa, typical)",
        conductivity: "Thermal conductivity (W/mK)",
        thermalExpansion: "Thermal expansion (µm/mK)",
        corrosion: "Corrosion / chemical note",
      },
      empty: "Select at least 1 material for comparison.",
    },
    references: {
      title: "References",
      items: [
        "EN 10025: Structural steels",
        "EN 1561 / EN 1563: Cast iron grades (EN-GJL / EN-GJS)",
        "EN 573 / EN 485: Aluminum alloys and temper designations",
        "ASM Handbook, Volume 2: Properties and Selection of Metals",
        "MatWeb and supplier datasheets (for final grade confirmation)",
      ],
    },
  },
};

export default function MaterialsStandardsClient({ locale, heroImage }: { locale: Locale; heroImage: string }) {
  const copy = COPY[locale];
  const [query, setQuery] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  useEffect(() => {
    if (!showLimitWarning) return;
    const timeoutId = window.setTimeout(() => setShowLimitWarning(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [showLimitWarning]);

  const normalizedQuery = query.trim().toLocaleLowerCase(locale === "tr" ? "tr-TR" : "en-US");

  const filteredRows = useMemo(() => {
    if (!normalizedQuery) return MATERIALS;
    return MATERIALS.filter((row) => {
      const haystack = [
        row.name,
        row.category[locale],
        row.corrosionNote[locale],
        row.density,
        row.elasticModulus,
        row.yieldStrength,
      ]
        .join(" ")
        .toLocaleLowerCase(locale === "tr" ? "tr-TR" : "en-US");
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery, locale]);

  const selectedRows = useMemo(
    () =>
      compareIds
        .map((id) => MATERIALS.find((row) => row.id === id))
        .filter((row): row is MaterialRow => Boolean(row)),
    [compareIds],
  );

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) {
        setShowLimitWarning(true);
        return prev;
      }
      return [...prev, id];
    });
  };

  const compareRows: Array<{ key: string; label: string; getValue: (row: MaterialRow) => string }> = [
    { key: "category", label: copy.compare.rows.category, getValue: (row) => row.category[locale] },
    { key: "density", label: copy.compare.rows.density, getValue: (row) => row.density },
    { key: "elasticModulus", label: copy.compare.rows.elasticModulus, getValue: (row) => row.elasticModulus },
    { key: "yieldStrength", label: copy.compare.rows.yieldStrength, getValue: (row) => row.yieldStrength },
    { key: "conductivity", label: copy.compare.rows.conductivity, getValue: (row) => row.conductivity },
    { key: "thermalExpansion", label: copy.compare.rows.thermalExpansion, getValue: (row) => row.thermalExpansion },
    { key: "corrosion", label: copy.compare.rows.corrosion, getValue: (row) => row.corrosionNote[locale] },
  ];

  return (
    <PageShell>
      <PageHero
        title={copy.hero.title}
        description={copy.hero.description}
        eyebrow={copy.hero.eyebrow}
        imageSrc={heroImage}
        imageAlt={copy.hero.imageAlt}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        {copy.intro}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">{copy.mini.label}</p>
          <h2 className="text-lg font-semibold text-slate-900">{copy.mini.title}</h2>
          <p className="text-sm text-slate-600">{copy.mini.description}</p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <label className="space-y-1 text-[11px] font-medium text-slate-700">
            <span>{copy.mini.searchLabel}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.mini.searchPlaceholder}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
            />
          </label>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700">
            <p>
              <span className="font-semibold">{copy.mini.selected}:</span> {selectedRows.length} / 3
            </p>
            <p className="mt-1">{copy.mini.max}</p>
            <p className="mt-1">{copy.mini.compareHint}</p>
            {showLimitWarning ? <p className="mt-1 font-semibold text-amber-700">{copy.mini.max}</p> : null}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{copy.table.title}</h2>
        {filteredRows.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">{copy.table.noResults}</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full border-collapse text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  {copy.table.columns.map((column) => (
                    <th key={column} className="border-b border-slate-200 px-4 py-3">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => {
                  const isSelected = compareIds.includes(row.id);
                  return (
                    <tr key={row.id} className="border-b border-slate-100 last:border-b-0">
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => handleToggleCompare(row.id)}
                          className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                            isSelected
                              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {isSelected ? copy.table.compareButtonActive : copy.table.compareButton}
                        </button>
                      </td>
                      <td className="px-4 py-2 font-semibold text-slate-800">{row.name}</td>
                      <td className="px-4 py-2 text-slate-700">{row.category[locale]}</td>
                      <td className="px-4 py-2 text-slate-700">{row.density}</td>
                      <td className="px-4 py-2 text-slate-700">{row.elasticModulus}</td>
                      <td className="px-4 py-2 text-slate-700">{row.yieldStrength}</td>
                      <td className="px-4 py-2 text-slate-700">{row.conductivity}</td>
                      <td className="px-4 py-2 text-slate-700">{row.thermalExpansion}</td>
                      <td className="px-4 py-2 text-slate-700">{row.corrosionNote[locale]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.compare.title}</h2>
          <p className="text-sm text-slate-600">{copy.compare.description}</p>
        </div>
        {selectedRows.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">{copy.compare.empty}</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full border-collapse text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-3">{locale === "tr" ? "Özellik" : "Property"}</th>
                  {selectedRows.map((row) => (
                    <th key={`compare-header-${row.id}`} className="border-b border-slate-200 px-4 py-3">
                      {row.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((rowItem) => (
                  <tr key={rowItem.key} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-4 py-2 font-semibold text-slate-700">{rowItem.label}</td>
                    {selectedRows.map((material) => (
                      <td key={`${rowItem.key}-${material.id}`} className="px-4 py-2 text-slate-700">
                        {rowItem.getValue(material)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{copy.references.title}</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
          {copy.references.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
