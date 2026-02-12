import type { ToolAccess } from "@/tools/_shared/catalog";

type AccessBadgeProps = {
  access: ToolAccess;
  label: string;
  size?: "xs" | "sm";
  className?: string;
};

const TONE_CLASSES: Record<ToolAccess, string> = {
  free: "bg-slate-100 text-slate-700",
  beta: "bg-amber-100 text-amber-700",
  premium: "bg-indigo-100 text-indigo-700",
};

export default function AccessBadge({ access, label, size = "xs", className = "" }: AccessBadgeProps) {
  const sizeClass = size === "sm" ? "text-[11px]" : "text-[10px]";
  return (
    <span className={`rounded-full px-2 py-0.5 font-semibold ${sizeClass} ${TONE_CLASSES[access]} ${className}`.trim()}>
      {label}
    </span>
  );
}
