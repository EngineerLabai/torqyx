import Link from "next/link";
import Confidence from "@/components/mdx/Confidence";
import type { ToolDocReference } from "@/lib/tool-docs/schema";

type ToolDocStandardData = {
  version: string;
  lastUpdated: string;
  howTo: string[];
  formula: string;
  references: ToolDocReference[];
  commonMistakes: string[];
  assumptions?: string[];
};

type ToolDocStandardProps = {
  doc: ToolDocStandardData;
  locale: "tr" | "en";
  copy: {
    howToTitle: string;
    formulaTitle: string;
    commonMistakesTitle: string;
    referencesTitle: string;
  };
};

export default function ToolDocStandard({ doc, locale, copy }: ToolDocStandardProps) {
  const referenceText = doc.references.map((ref) =>
    ref.note ? `${ref.title} — ${ref.note}` : ref.title,
  );

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">{copy.howToTitle}</h3>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
          {doc.howTo.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">{copy.formulaTitle}</h3>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
          <code className="font-mono">{doc.formula}</code>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">{copy.commonMistakesTitle}</h3>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
          {doc.commonMistakes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">{copy.referencesTitle}</h3>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
          {doc.references.map((ref) => (
            <li key={ref.title}>
              {ref.href ? (
                <Link
                  href={ref.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 underline-offset-4 hover:underline"
                >
                  {ref.title}
                </Link>
              ) : (
                <span>{ref.title}</span>
              )}
              {ref.note ? <span className="text-slate-500"> — {ref.note}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <Confidence
        locale={locale}
        version={doc.version}
        lastUpdated={doc.lastUpdated}
        assumptions={doc.assumptions}
        references={referenceText}
      />
    </div>
  );
}
