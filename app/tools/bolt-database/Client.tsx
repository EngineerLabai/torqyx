"use client";

// app/tools/bolt-database/page.tsx
import { useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";

type ThreadInfo = {
  name: string;
  majorDia: number;
  pitch: string;
  drill: string;
  category: "metric" | "unc" | "unf";
};

const THREADS: ThreadInfo[] = [
  // METRİK (coarse)
  { name: "M3", majorDia: 3, pitch: "0.50", drill: "2.5 mm", category: "metric" },
  { name: "M4", majorDia: 4, pitch: "0.70", drill: "3.3 mm", category: "metric" },
  { name: "M5", majorDia: 5, pitch: "0.80", drill: "4.2 mm", category: "metric" },
  { name: "M6", majorDia: 6, pitch: "1.00", drill: "5.0 mm", category: "metric" },
  { name: "M8", majorDia: 8, pitch: "1.25", drill: "6.8 mm", category: "metric" },
  { name: "M10", majorDia: 10, pitch: "1.50", drill: "8.5 mm", category: "metric" },
  { name: "M12", majorDia: 12, pitch: "1.75", drill: "10.2 mm", category: "metric" },
  { name: "M14", majorDia: 14, pitch: "2.00", drill: "12.0 mm", category: "metric" },
  { name: "M16", majorDia: 16, pitch: "2.00", drill: "14.0 mm", category: "metric" },
  { name: "M18", majorDia: 18, pitch: "2.50", drill: "15.5 mm", category: "metric" },
  { name: "M20", majorDia: 20, pitch: "2.50", drill: "17.5 mm", category: "metric" },
  { name: "M22", majorDia: 22, pitch: "2.50", drill: "19.5 mm", category: "metric" },
  { name: "M24", majorDia: 24, pitch: "3.00", drill: "21.0 mm", category: "metric" },
  { name: "M27", majorDia: 27, pitch: "3.00", drill: "24.0 mm", category: "metric" },
  { name: "M30", majorDia: 30, pitch: "3.50", drill: "26.5 mm", category: "metric" },
  { name: "M33", majorDia: 33, pitch: "3.50", drill: "29.5 mm", category: "metric" },
  { name: "M36", majorDia: 36, pitch: "4.00", drill: "32.0 mm", category: "metric" },
  { name: "M39", majorDia: 39, pitch: "4.00", drill: "35.0 mm", category: "metric" },
  { name: "M42", majorDia: 42, pitch: "4.50", drill: "37.5 mm", category: "metric" },
  { name: "M45", majorDia: 45, pitch: "4.50", drill: "40.5 mm", category: "metric" },
  { name: "M48", majorDia: 48, pitch: "5.00", drill: "43.0 mm", category: "metric" },
  { name: "M52", majorDia: 52, pitch: "5.00", drill: "47.0 mm", category: "metric" },
  { name: "M56", majorDia: 56, pitch: "5.50", drill: "50.5 mm", category: "metric" },
  { name: "M60", majorDia: 60, pitch: "5.50", drill: "54.5 mm", category: "metric" },

  // UNC
  {
    name: '5/16"-18 UNC',
    majorDia: 7.94,
    pitch: "18 TPI",
    drill: "6.7 mm",
    category: "unc",
  },
  {
    name: '3/8"-16 UNC',
    majorDia: 9.53,
    pitch: "16 TPI",
    drill: "7.9 mm",
    category: "unc",
  },

  // UNF
  {
    name: '1/4"-28 UNF',
    majorDia: 6.35,
    pitch: "28 TPI",
    drill: "5.3 mm",
    category: "unf",
  },
  {
    name: '3/8"-24 UNF',
    majorDia: 9.53,
    pitch: "24 TPI",
    drill: "8.6 mm",
    category: "unf",
  },
];

type BoltGrade = {
  grade: string;
  tensile: number; // çekme dayanımı (MPa)
  yield: number; // akma dayanımı (MPa)
  hardness: string;
  toughness: string;
};

const BOLT_GRADES: BoltGrade[] = [
  {
    grade: "8.8",
    tensile: 800,
    yield: 640,
    hardness: "22–34 HRC",
    toughness: "Orta seviye, genel kullanım",
  },
  {
    grade: "10.9",
    tensile: 1040,
    yield: 940,
    hardness: "32–39 HRC",
    toughness: "Yüksek dayanım, süspansiyon parçalarında yaygın",
  },
  {
    grade: "12.9",
    tensile: 1220,
    yield: 1100,
    hardness: "39–44 HRC",
    toughness: "Çok yüksek dayanım, yüksek ön yük gereken yerler",
  },
  {
    grade: "A2 Paslanmaz",
    tensile: 700,
    yield: 450,
    hardness: "~25 HRC",
    toughness: "İyi korozyon direnci, daha düşük dayanım",
  },
  {
    grade: "A4 Paslanmaz",
    tensile: 800,
    yield: 600,
    hardness: "~29 HRC",
    toughness: "Asit/kimyasal ortamlara dayanıklı",
  },
];

type BoltDatabaseClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function BoltDatabasePage({ initialDocs }: BoltDatabaseClientProps) {
  const [selectedThread, setSelectedThread] = useState<string>(THREADS[0].name);
  const [selectedGrade, setSelectedGrade] = useState<string>(BOLT_GRADES[0].grade);

  const thread = THREADS.find((t) => t.name === selectedThread)!;
  const grade = BOLT_GRADES.find((g) => g.grade === selectedGrade)!;

  return (
    <PageShell>
      <ToolDocTabs slug="bolt-database" initialDocs={initialDocs}>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm shadow-sm">
        <h1 className="mb-4 text-2xl font-bold text-slate-900">
          Standart Cıvata Veri Merkezi
        </h1>

        {/* Cıvata ölçüsü seçimi */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">Cıvata Ölçüsü</label>
          <select
            className="mt-1 w-full rounded border p-2 text-sm"
            value={selectedThread}
            onChange={(e) => setSelectedThread(e.target.value)}
          >
            <optgroup label="Metrik">
              {THREADS.filter((t) => t.category === "metric").map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </optgroup>

            <optgroup label="UNC">
              {THREADS.filter((t) => t.category === "unc").map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </optgroup>

            <optgroup label="UNF">
              {THREADS.filter((t) => t.category === "unf").map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </optgroup>
          </select>

          <div className="mt-3 text-sm">
            <p>
              <strong>Dış çap:</strong> {thread.majorDia.toFixed(2)} mm
            </p>
            <p>
              <strong>Adım / TPI:</strong> {thread.pitch}
            </p>
            <p>
              <strong>Matkap çapı:</strong> {thread.drill}
            </p>
          </div>
        </div>

        {/* Cıvata kalitesi seçimi */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">Cıvata Kalitesi</label>
          <select
            className="mt-1 w-full rounded border p-2 text-sm"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            {BOLT_GRADES.map((g) => (
              <option key={g.grade} value={g.grade}>
                {g.grade}
              </option>
            ))}
          </select>

          <div className="mt-3 text-sm">
            <p>
              <strong>Çekme Dayanımı:</strong> {grade.tensile} MPa
            </p>
            <p>
              <strong>Akma Dayanımı:</strong> {grade.yield} MPa
            </p>
            <p>
              <strong>Sertlik:</strong> {grade.hardness}
            </p>
            <p>
              <strong>Tokluk:</strong> {grade.toughness}
            </p>
          </div>
        </div>

        {/* Uygunluk yorumları */}
        <div className="mt-6 border-t pt-4">
          <h2 className="mb-2 text-lg font-semibold">Uygunluk Değerlendirmesi</h2>

          <p className="mb-1 text-sm">
            <strong>{thread.name}</strong> cıvatası tipik olarak şu sınıflarda bulunabilir:
          </p>

          <ul className="list-inside list-disc text-sm text-gray-700">
            {thread.majorDia <= 30 ? (
              <>
                <li>8.8</li>
                <li>10.9</li>
                <li>12.9</li>
              </>
            ) : thread.majorDia <= 48 ? (
              <>
                <li>8.8</li>
                <li>10.9 (çoğu uygulamada)</li>
              </>
            ) : (
              <>
                <li>8.8 (yaygın)</li>
                <li>10.9 (özel tedarik)</li>
              </>
            )}
            <li>A2 / A4 paslanmaz (korozyon ortamında)</li>
          </ul>

          <p className="mt-3 text-sm text-gray-600">
            Not: Değerler genel mühendislik pratiğine göredir. Kritik uygulamalarda mutlaka
            ilgili standartlara ve üretici kataloglarına bakınız.
          </p>
        </div>
      </section>
          </ToolDocTabs>
    </PageShell>
  );
}


