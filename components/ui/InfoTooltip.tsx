import { Info } from "lucide-react";

type InfoTooltipProps = {
  label: string;
  content: string;
  className?: string;
};

export default function InfoTooltip({ label, content, className = "" }: InfoTooltipProps) {
  return (
    <span className={`group relative inline-flex ${className}`}>
      <button
        type="button"
        aria-label={label}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
      >
        <Info size={14} />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-[calc(100%+0.5rem)] z-20 hidden w-72 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-left text-[11px] leading-relaxed text-slate-600 shadow-lg group-hover:block group-focus-within:block"
      >
        <span className="block text-[11px] font-semibold text-slate-900">{label}</span>
        <span className="mt-1 block">{content}</span>
      </span>
    </span>
  );
}
