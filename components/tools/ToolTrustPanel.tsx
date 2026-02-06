"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";

export type ToolReference = {
  title: string;
  url?: string;
  note?: string;
};

export default function ToolTrustPanel({
  formula,
  assumptions,
  references,
}: {
  formula?: string;
  assumptions?: string[];
  references?: ToolReference[];
}) {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.toolTrustPanel;
  const hasFormula = Boolean(formula && formula.trim().length > 0);
  const hasAssumptions = Boolean(assumptions && assumptions.length > 0);
  const hasReferences = Boolean(references && references.length > 0);

  if (!hasFormula && !hasAssumptions && !hasReferences) return null;

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {hasFormula ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">{copy.formula}</h2>
          <p className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-700">{formula}</p>
        </div>
      ) : null}

      {hasAssumptions ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">{copy.assumptions}</h2>
          <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-700">
            {assumptions?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {hasReferences ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">{copy.references}</h2>
          <ul className="space-y-2 text-[11px] text-slate-700">
            {references?.map((ref) => (
              <li key={ref.title} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="font-semibold text-slate-800">
                  {ref.url ? (
                    <a href={ref.url} target="_blank" rel="noreferrer" className="underline">
                      {ref.title}
                    </a>
                  ) : (
                    ref.title
                  )}
                </div>
                {ref.note ? <p className="mt-1 text-[10px] text-slate-500">{ref.note}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
