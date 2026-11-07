import Link from "next/link";
import Confidence from "@/components/mdx/Confidence";
import type { ToolDocReference } from "@/lib/tool-docs/schema";

type FaqItem = { question: string; answer: string };

type ToolDocStandardData = {
  version: string;
  lastUpdated: string;
  howTo: string[];
  formula: string;
  formulaDerivation?: string[];
  whenToUse?: string[];
  whenNotToUse?: string[];
  references: ToolDocReference[];
  commonMistakes: string[];
  assumptions?: string[];
  faq?: FaqItem[];
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

  const isTr = locale === "tr";
  const whenToUseTitle = isTr ? "Ne Zaman Kullanılır" : "When to Use";
  const whenNotToUseTitle = isTr ? "Ne Zaman Kullanılmaz" : "When Not to Use";
  const derivationTitle = isTr ? "Formül Türetmesi" : "Formula Derivation";
  const faqTitle = isTr ? "Sık Sorulan Sorular" : "Frequently Asked Questions";

  return (
    <div className="space-y-6">
      {/* When to Use */}
      {doc.whenToUse && doc.whenToUse.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">{whenToUseTitle}</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            {doc.whenToUse.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* When Not to Use */}
      {doc.whenNotToUse && doc.whenNotToUse.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">{whenNotToUseTitle}</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            {doc.whenNotToUse.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* How To */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">{copy.howToTitle}</h3>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
          {doc.howTo.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      {/* Formula */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">{copy.formulaTitle}</h3>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
          <code className="font-mono">{doc.formula}</code>
        </div>
      </section>

      {/* Formula Derivation */}
      {doc.formulaDerivation && doc.formulaDerivation.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">{derivationTitle}</h3>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
            {doc.formulaDerivation.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {/* Common Mistakes */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">{copy.commonMistakesTitle}</h3>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
          {doc.commonMistakes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      {doc.faq && doc.faq.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">{faqTitle}</h3>
          <div className="space-y-3">
            {doc.faq.map((item) => (
              <div key={item.question} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="mb-1.5 text-sm font-medium text-slate-800">{item.question}</p>
                <p className="text-sm text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* References */}
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

