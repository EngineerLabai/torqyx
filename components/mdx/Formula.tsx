import type { ReactNode } from "react";

type FormulaProps = {
  label?: string;
  children: ReactNode;
};

export default function Formula({ label, children }: FormulaProps) {
  return (
    <figure className="rounded-2xl border border-slate-200 bg-slate-950 px-4 py-3 shadow-sm">
      {label ? (
        <figcaption className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
          {label}
        </figcaption>
      ) : null}
      <pre className="overflow-x-auto text-sm text-emerald-100">
        <code className="font-mono">{children}</code>
      </pre>
    </figure>
  );
}
