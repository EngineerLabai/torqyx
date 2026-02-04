"use client";

import type { VariableEntry } from "@/lib/sanityCheck/types";

const createVariable = (defaultName: string): VariableEntry => ({
  id: `var-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  symbol: "x",
  name: defaultName,
  description: "",
  value: 0,
  unit: "",
  min: 0,
  max: 0,
});

type VariableTableCopy = {
  title: string;
  add: string;
  symbol: string;
  name: string;
  defaultName: string;
  description: string;
  value: string;
  unit: string;
  unitPlaceholder: string;
  min: string;
  max: string;
  distribution: string;
  distributionNone: string;
  distributionUniform: string;
  distributionNormal: string;
  remove: string;
};

type VariableTableProps = {
  variables: VariableEntry[];
  onChange: (next: VariableEntry[]) => void;
  copy: VariableTableCopy;
};

const parseNumberInput = (value: string) => {
  if (value.trim() === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function VariableTable({ variables, onChange, copy }: VariableTableProps) {
  const handleUpdate = (id: string, updates: Partial<VariableEntry>) => {
    onChange(variables.map((variable) => (variable.id === id ? { ...variable, ...updates } : variable)));
  };

  const handleAdd = () => onChange([...variables, createVariable(copy.defaultName)]);

  const handleRemove = (id: string) => onChange(variables.filter((variable) => variable.id !== id));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900">{copy.title}</h2>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
        >
          {copy.add}
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {variables.map((variable) => (
          <div key={variable.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="grid gap-3 md:grid-cols-[120px_minmax(0,1fr)]">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">{copy.symbol}</label>
                <input
                  value={variable.symbol}
                  onChange={(event) => handleUpdate(variable.id, { symbol: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
                  aria-label={copy.symbol}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">{copy.name}</label>
                <input
                  value={variable.name}
                  onChange={(event) => handleUpdate(variable.id, { name: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
                  aria-label={copy.name}
                />
              </div>
            </div>

            <div className="mt-2 space-y-1">
              <label className="block text-[11px] font-semibold text-slate-600">{copy.description}</label>
              <input
                value={variable.description ?? ""}
                onChange={(event) => handleUpdate(variable.id, { description: event.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
                aria-label={copy.description}
              />
            </div>

            <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">{copy.value}</label>
                <input
                  type="number"
                  value={variable.value}
                  onChange={(event) => handleUpdate(variable.id, { value: parseNumberInput(event.target.value) })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
                  aria-label={copy.value}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">{copy.unit}</label>
                <input
                  list="sanity-units"
                  value={variable.unit ?? ""}
                  onChange={(event) => handleUpdate(variable.id, { unit: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
                  placeholder={copy.unitPlaceholder}
                  aria-label={copy.unit}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">{copy.distribution}</label>
                <select
                  value={variable.distribution ?? ""}
                  onChange={(event) => handleUpdate(variable.id, { distribution: event.target.value ? (event.target.value as VariableEntry["distribution"]) : undefined })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
                  aria-label={copy.distribution}
                >
                  <option value="">{copy.distributionNone}</option>
                  <option value="uniform">{copy.distributionUniform}</option>
                  <option value="normal">{copy.distributionNormal}</option>
                </select>
              </div>
            </div>

            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">{copy.min}</label>
                <input
                  type="number"
                  value={variable.min ?? 0}
                  onChange={(event) => handleUpdate(variable.id, { min: parseNumberInput(event.target.value) })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
                  aria-label={copy.min}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">{copy.max}</label>
                <input
                  type="number"
                  value={variable.max ?? 0}
                  onChange={(event) => handleUpdate(variable.id, { max: parseNumberInput(event.target.value) })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
                  aria-label={copy.max}
                />
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => handleRemove(variable.id)}
                className="rounded-full border border-slate-300 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-white"
                aria-label={copy.remove}
              >
                {copy.remove}
              </button>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
