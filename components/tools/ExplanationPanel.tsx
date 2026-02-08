"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";

export type ExplanationVariable = {
  symbol: string;
  description: string;
};

export type ExplanationPanelProps = {
  title?: string;
  formulas: string[];
  variables: ExplanationVariable[];
  notes?: string[];
  children?: ReactNode;
};

export default function ExplanationPanel({
  title,
  formulas,
  variables,
  notes,
  children,
}: ExplanationPanelProps) {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.explanationPanel;
  const resolvedTitle = title ?? copy.title;

  return (
    <details className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <summary className="cursor-pointer text-xs font-semibold text-slate-700">
        {resolvedTitle}
      </summary>
      <div className="mt-3 space-y-3 text-xs text-slate-600">
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-slate-500">{copy.formulasTitle}</p>
          <div className="space-y-1">
            {formulas.map((formula) => (
              <p key={formula} className="font-mono text-[12px] text-slate-900">
                {formula}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-medium text-slate-500">{copy.variablesTitle}</p>
          <dl className="grid gap-1">
            {variables.map((variable) => (
              <div key={variable.symbol} className="flex items-start gap-2">
                <dt className="font-mono text-[12px] font-semibold text-slate-900">{variable.symbol}</dt>
                <dd className="text-[11px] text-slate-600">{variable.description}</dd>
              </div>
            ))}
          </dl>
        </div>

        {notes && notes.length > 0 && (
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-slate-500">{copy.notesTitle}</p>
            <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-600">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {children}
      </div>
    </details>
  );
}
