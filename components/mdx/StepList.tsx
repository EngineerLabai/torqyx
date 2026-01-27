import type { ReactNode } from "react";

type StepListProps = {
  title?: string;
  steps?: string[];
  children?: ReactNode;
};

export default function StepList({ title, steps, children }: StepListProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {title ? <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3> : null}
      <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
        {steps ? steps.map((step, index) => <li key={`${step}-${index}`}>{step}</li>) : children}
      </ol>
    </div>
  );
}
