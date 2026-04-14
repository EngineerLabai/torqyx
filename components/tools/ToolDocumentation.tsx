import Link from "next/link";
import type { Locale } from "@/utils/locale";
import type { ToolDocumentationExample } from "@/data/tool-documentation";
import { withLocalePrefix } from "@/utils/locale-path";

export type ToolDocumentationProps = {
  toolTitle: string;
  locale: Locale;
  scope: string;
  assumptionsAndUnits: string[];
  limits: string[];
  referenceStandards: string[];
  validationExamples: ToolDocumentationExample[];
  version: string;
  lastUpdated: string;
};

const LABELS: Record<
  Locale,
  {
    sectionTitle: string;
    scope: string;
    assumptionsAndUnits: string;
    limits: string;
    references: string;
    validation: string;
    release: string;
    input: string;
    expectedOutput: string;
    version: string;
    lastUpdated: string;
    note: string;
  }
> = {
  tr: {
    sectionTitle: "Standart Dokümantasyon",
    scope: "Kapsam: Bu araç ne hesaplar?",
    assumptionsAndUnits: "Varsayımlar ve Birimler",
    limits: "Limitler / Sınırlar",
    references: "Referans Standart",
    validation: "Doğrulama Örneği",
    release: "Sürüm ve Güncelleme",
    input: "Girdi",
    expectedOutput: "Beklenen Çıktı",
    version: "Sürüm",
    lastUpdated: "Son güncelleme",
    note: "Not",
  },
  en: {
    sectionTitle: "Standard Documentation",
    scope: "Scope: What does this tool calculate?",
    assumptionsAndUnits: "Assumptions and Units",
    limits: "Limits / Boundaries",
    references: "Reference Standard",
    validation: "Validation Example",
    release: "Version and Update",
    input: "Input",
    expectedOutput: "Expected Output",
    version: "Version",
    lastUpdated: "Last updated",
    note: "Note",
  },
};

const ListBlock = ({ items }: { items: string[] }) => (
  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

export default function ToolDocumentation({
  toolTitle,
  locale,
  scope,
  assumptionsAndUnits,
  limits,
  referenceStandards,
  validationExamples,
  version,
  lastUpdated,
}: ToolDocumentationProps) {
  const label = LABELS[locale];
  const changelogHref = withLocalePrefix("/changelog", locale);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">{label.sectionTitle}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">{toolTitle}</span>
      </div>

      <div className="space-y-2">
        <details open className="group rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">{label.scope}</summary>
          <p className="mt-2 text-sm text-slate-700">{scope}</p>
        </details>

        <details className="group rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">{label.assumptionsAndUnits}</summary>
          <div className="mt-2">
            <ListBlock items={assumptionsAndUnits} />
          </div>
        </details>

        <details className="group rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">{label.limits}</summary>
          <div className="mt-2">
            <ListBlock items={limits} />
          </div>
        </details>

        <details className="group rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">{label.references}</summary>
          <div className="mt-2">
            <ListBlock items={referenceStandards} />
          </div>
        </details>

        <details className="group rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">{label.validation}</summary>
          <div className="mt-3 space-y-3">
            {validationExamples.map((example) => (
              <div key={example.title} className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-sm font-semibold text-slate-900">{example.title}</p>
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-2 py-1 text-left font-semibold text-slate-700">{label.input}</th>
                        <th className="px-2 py-1 text-left font-semibold text-slate-700">{label.expectedOutput}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {example.rows.map((row) => (
                        <tr key={`${row.input}|${row.expectedOutput}`} className="border-b border-slate-100 last:border-b-0">
                          <td className="px-2 py-1 text-slate-700">{row.input}</td>
                          <td className="px-2 py-1 text-slate-700">{row.expectedOutput}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {example.note ? (
                  <p className="mt-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-600">{label.note}: </span>
                    {example.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </details>

        <details className="group rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">{label.release}</summary>
          <dl className="mt-2 grid gap-1 text-sm text-slate-700 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-600">{label.version}</dt>
              <dd>
                <Link href={changelogHref} className="underline decoration-slate-300 underline-offset-2 hover:text-slate-900">
                  {version}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-600">{label.lastUpdated}</dt>
              <dd>
                <Link href={changelogHref} className="underline decoration-slate-300 underline-offset-2 hover:text-slate-900">
                  {lastUpdated}
                </Link>
              </dd>
            </div>
          </dl>
        </details>
      </div>
    </section>
  );
}
