import type { Locale } from "@/utils/locale";

type DeterministicDisclaimerProps = {
  locale: Locale;
  compact?: boolean;
  className?: string;
};

const DISCLAIMER_TEXT: Record<Locale, string> = {
  tr: "Hesaplamalar ISO/DIN/VDI standartlarına dayalı deterministik formüllerle yürütülür. Sistem girişleri kontrol eder ve olası riskleri işaretler.",
  en: "Calculations use deterministic formulas based on ISO/DIN/VDI standards. The system validates inputs and highlights potential engineering risks.",
};

const joinClassNames = (...values: Array<string | undefined>) => values.filter(Boolean).join(" ");

export default function DeterministicDisclaimer({
  locale,
  compact = false,
  className,
}: DeterministicDisclaimerProps) {
  const text = DISCLAIMER_TEXT[locale];

  if (compact) {
    return (
      <p
        className={joinClassNames(
          "inline-flex items-start gap-1 text-[11px] leading-relaxed text-slate-500",
          className,
        )}
      >
        <span aria-hidden className="mt-[1px] text-slate-400">
          i
        </span>
        <span>{text}</span>
      </p>
    );
  }

  return (
    <div
      className={joinClassNames(
        "rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600",
        className,
      )}
    >
      {text}
    </div>
  );
}
