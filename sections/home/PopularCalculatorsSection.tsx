import Link from "next/link";
import {
  Wrench, Move, RotateCw, CircleDot, Droplets,
  Ruler, Flame, ArrowUpDown, ShieldCheck
} from "lucide-react";
import type { Locale } from "@/utils/locale";
import { getMessages } from "@/utils/messages";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";
import { withLocalePrefix } from "@/utils/locale-path";

type PopularCalculatorsSectionProps = {
  locale: Locale;
};

const POPULAR_CALC_IDS = [
  { id: "bolt-calculator", icon: Wrench },
  { id: "bending-stress", icon: Move },
  { id: "shaft-torsion", icon: RotateCw },
  { id: "bearing-life", icon: CircleDot },
  { id: "pipe-pressure-loss", icon: Droplets },
  { id: "tolerance-lab", icon: Ruler },
  { id: "fillet-weld", icon: Flame },
  { id: "hydraulic-cylinder", icon: ArrowUpDown },
  { id: "sanity-check", icon: ShieldCheck },
] as const;

export default function PopularCalculatorsSection({ locale }: PopularCalculatorsSectionProps) {
  const copy = getMessages(locale).home.popularCalculators;
  const tools = POPULAR_CALC_IDS
    .map((item, i) => ({
      ...item,
      tool: toolCatalog.find((t) => t.id === item.id) ?? null,
      description: copy.items[i].description,
    }))
    .filter((item): item is typeof item & { tool: NonNullable<typeof item.tool> } => Boolean(item.tool));

  const libraryHref = withLocalePrefix("/tools", locale);

  return (
    <section id="popular-calculators" className="w-full py-12">
      <div className="site-container space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">{copy.kicker}</p>
          <h2 className="text-balance text-2xl font-semibold text-slate-900 md:text-3xl">{copy.title}</h2>
          <p className="max-w-[68ch] text-sm leading-relaxed text-slate-600 md:text-base">{copy.description}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ tool, icon: Icon, description }) => {
            const toolCopy = getToolCopy(tool, locale);
            return (
              <Link
                key={tool.id}
                href={withLocalePrefix(tool.href, locale)}
                className="group flex min-h-[180px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-brand">
                    <Icon size={19} />
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-slate-950">
                    {toolCopy.title}
                  </h3>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">{description}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand">
                    {copy.tryNow}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <Link
          href={libraryHref}
          className="inline-flex items-center justify-center rounded-md border border-brand bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand transition hover:bg-brand hover:text-white"
        >
          {copy.cta}
        </Link>
      </div>
    </section>
  );
}
