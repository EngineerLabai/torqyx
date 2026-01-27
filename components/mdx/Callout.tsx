import type { ReactNode } from "react";

type CalloutVariant = "info" | "warning" | "success" | "danger";

type CalloutProps = {
  title?: string;
  type?: CalloutVariant;
  children: ReactNode;
};

const variantStyles: Record<CalloutVariant, { wrapper: string; title: string }> = {
  info: {
    wrapper: "border-emerald-400/70 bg-emerald-50",
    title: "text-emerald-700",
  },
  warning: {
    wrapper: "border-amber-400/70 bg-amber-50",
    title: "text-amber-700",
  },
  success: {
    wrapper: "border-sky-400/70 bg-sky-50",
    title: "text-sky-700",
  },
  danger: {
    wrapper: "border-rose-400/70 bg-rose-50",
    title: "text-rose-700",
  },
};

export default function Callout({ title, type = "info", children }: CalloutProps) {
  const styles = variantStyles[type];

  return (
    <div className={`rounded-2xl border-l-4 p-4 ${styles.wrapper}`}>
      {title ? (
        <div className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${styles.title}`}>
          {title}
        </div>
      ) : null}
      <div className="text-sm leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}
