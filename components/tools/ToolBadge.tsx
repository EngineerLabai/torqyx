import type { Locale } from "@/utils/locale";
import type { ToolStatus } from "@/tools/_shared/catalog";

type ToolBadgeProps = {
  status: ToolStatus;
  standard?: string;
  locale?: Locale;
  className?: string;
};

const LABELS: Record<Locale, Record<ToolStatus, string>> = {
  tr: {
    verified: "Do\u011frulanm\u0131\u015f \u2713",
    beta: "Beta \ud83d\udd2c",
    experimental: "Deneysel \u26a0\ufe0f",
  },
  en: {
    verified: "Verified \u2713",
    beta: "Beta \ud83d\udd2c",
    experimental: "Experimental \u26a0\ufe0f",
  },
};

const buildTooltip = (status: ToolStatus, locale: Locale, standard: string) => {
  if (locale === "tr") {
    if (status === "verified") return `Bu araç ${standard} ile doğrulanmıştır.`;
    if (status === "beta") return `Bu araç beta aşamasındadır. Sonuçları ${standard} referanslarıyla kontrol edin.`;
    return "Bu araç deneysel aşamadadır. Üretim kararlarından önce ek doğrulama yapın.";
  }

  if (status === "verified") return `This tool is validated against ${standard}.`;
  if (status === "beta") return `This tool is in beta. Verify outputs against ${standard} references.`;
  return "This tool is experimental. Run an extra verification before production decisions.";
};

export default function ToolBadge({
  status,
  standard = "ISO / DIN / VDI",
  locale = "tr",
  className = "",
}: ToolBadgeProps) {
  const toneClass = {
    verified: "border-emerald-200 bg-emerald-50 text-emerald-700",
    beta: "border-amber-200 bg-amber-50 text-amber-700",
    experimental: "border-slate-300 bg-slate-100 text-slate-700",
  }[status];

  const label = LABELS[locale][status];
  const tooltip = buildTooltip(status, locale, standard);

  return (
    <span className={`group relative inline-flex ${className}`.trim()}>
      <button
        type="button"
        aria-label={tooltip}
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${toneClass}`.trim()}
      >
        {label}
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-[calc(100%+0.45rem)] z-40 hidden w-72 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-left text-[11px] leading-relaxed text-slate-600 shadow-lg group-hover:block group-focus-within:block"
      >
        {tooltip}
      </span>
    </span>
  );
}
