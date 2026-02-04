"use client";

type FormulaEditorCopy = {
  title: string;
  description: string;
  placeholder: string;
};

type FormulaEditorProps = {
  formula: string;
  onChange: (value: string) => void;
  copy: FormulaEditorCopy;
};

export default function FormulaEditor({ formula, onChange, copy }: FormulaEditorProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-900">{copy.title}</h2>
        <p className="text-xs text-slate-500">{copy.description}</p>
      </div>
      <textarea
        value={formula}
        onChange={(event) => onChange(event.target.value)}
        placeholder={copy.placeholder}
        rows={3}
        className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        aria-label={copy.title}
      />
    </section>
  );
}
