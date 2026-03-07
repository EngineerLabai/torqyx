import { getQualityToolStatusLabel, type QualityToolStatus } from "@/data/quality-tools/registry";
import type { Locale } from "@/utils/locale";

const STATUS_BADGE_CLASS: Record<QualityToolStatus, string> = {
  free: "border-emerald-200 bg-emerald-50 text-emerald-700",
  beta: "border-sky-200 bg-sky-50 text-sky-700",
  planned: "border-slate-200 bg-slate-50 text-slate-600",
  premium: "border-amber-200 bg-amber-50 text-amber-800",
};

const joinClassNames = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(" ");

type QualityToolStatusBadgeProps = {
  locale: Locale;
  status: QualityToolStatus;
  className?: string;
};

export function QualityToolStatusBadge({ locale, status, className }: QualityToolStatusBadgeProps) {
  return (
    <span
      className={joinClassNames(
        "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
        STATUS_BADGE_CLASS[status],
        className,
      )}
    >
      {getQualityToolStatusLabel(locale, status)}
    </span>
  );
}
