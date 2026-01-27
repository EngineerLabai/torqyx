"use client";

import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";

type CalcCard = {
  name: string;
  description: string;
  status: "Aktif" | "Yakında";
  href: string;
  badge: string;
};

const calculators: CalcCard[] = [
  {
    name: "Modül Hesaplayıcı",
    description: "Dişli boyutu, diş sayısı ve kaliteye göre modül önerisi ve kontrolü.",
    status: "Aktif",
    href: "/tools/gear-design/calculators/module-calculator",
    badge: "Modül",
  },
  {
    name: "Dişli Oranı Hesaplayıcı",
    description: "z1/z2 veya d1/d2 ile oran, rpm ve tork ilişkisi.",
    status: "Aktif",
    href: "/tools/gear-design/calculators/ratio-calculator",
    badge: "Oran",
  },
  {
    name: "Çevresel Kuvvet / Tork Hesaplayıcı",
    description: "Ft = 2·π·T/d ve Fr/Fa (helis) otomatik hesap.",
    status: "Aktif",
    href: "/tools/gear-design/calculators/force-torque-calculator",
    badge: "Kuvvet",
  },
  {
    name: "Helis Aksiyel Kuvvet Hesaplayıcı",
    description: "Helis açısı ve basınç açısıyla Fa hesaplar; yatak yük tahmini.",
    status: "Aktif",
    href: "/tools/gear-design/calculators/helix-axial-calculator",
    badge: "Helis",
  },
  {
    name: "Kontak Oranı Hesaplayıcı",
    description: "e_alpha + e_beta (profil + overlap) ile temas sırasını tahmin eder.",
    status: "Aktif",
    href: "/tools/gear-design/calculators/contact-ratio-calculator",
    badge: "Kontak",
  },
  {
    name: "Yağ Viskozitesi Seçici",
    description: "ks ve v değerlerine göre ISO VG ve yağlama yöntemi önerisi.",
    status: "Aktif",
    href: "/tools/gear-design/calculators/viscosity-selector",
    badge: "Yağlama",
  },
  {
    name: "Dişli Ağırlığı / Gövde Optimizasyonu",
    description: "Geometri + boşaltma/kaburga bilgisiyle ağırlık ve tasarruf tahmini.",
    status: "Aktif",
    href: "/tools/gear-design/calculators/weight-optimization",
    badge: "Ağırlık",
  },
  {
    name: "Backlash Hesaplayıcı",
    description: "Min/nom/max backlash; modül, merkez mesafesi, sıcaklık girdisi.",
    status: "Aktif",
    href: "/tools/gear-design/calculators/backlash-calculator",
    badge: "Backlash",
  },
];

export default function GearCalculatorsPage() {
  return (
    <PageShell>
      <ToolDocTabs slug="gear-design/calculators">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_24%)]" />
        <div className="relative space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
              Dişli Online Hesaplayıcılar
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Karttan seç, hesaplamaya başla
            </span>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">
            Hesaplayıcı kartlarını seç, &quot;Kullan&quot; ile ilgili sayfayı aç
          </h1>
          <p className="text-sm leading-relaxed text-slate-700">
            Her hesaplayıcı için bir kart var. &quot;Kullan&quot; butonu o aracın detayına gider; hesaplamaya başlayıp gerekirse
            açıklama veya görseller ekleyebilirsin.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {calculators.map((calc) => (
          <article
            key={calc.name}
            className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 text-sm shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h2 className="break-words text-sm font-semibold leading-snug text-slate-900">{calc.name}</h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    calc.status === "Aktif" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {calc.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">{calc.badge}</span>
              </div>
              <p className="break-words text-[12px] leading-relaxed text-slate-700">{calc.description}</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
              <span>{calc.status === "Aktif" ? "" : "Hazırlanacak"}</span>
              {calc.status === "Aktif" ? (
                <Link
                  href={calc.href}
                  className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
                >
                  Kullan
                </Link>
              ) : (
                <button
                  disabled
                  className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500"
                >
                  Yakında
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
          </ToolDocTabs>
    </PageShell>
  );
}


