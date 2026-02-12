import Link from "next/link";
import { Bolt, Cog, Droplets, Gauge, Sigma, Wrench } from "lucide-react";
import type { Locale } from "@/utils/locale";
import { formatMessage, getMessages } from "@/utils/messages";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";
import { withLocalePrefix } from "@/utils/locale-path";

type PopularToolsSectionProps = {
  locale: Locale;
};

export default function PopularToolsSection({ locale }: PopularToolsSectionProps) {
  const messages = getMessages(locale);
  const copy = messages.home.showcase;
  const categoryLabels = messages.components.toolLibrary.labels;
  const tools = [
    { id: "bolt-calculator", icon: Bolt, usage: 12400 },
    { id: "gear-module", icon: Cog, usage: 9800 },
    { id: "pipe-pressure-loss", icon: Droplets, usage: 8600 },
    { id: "shaft-torsion", icon: Gauge, usage: 7400 },
    { id: "bearing-life", icon: Sigma, usage: 6900 },
    { id: "hydraulic-cylinder", icon: Wrench, usage: 6100 },
  ]
    .map((item) => ({
      ...item,
      tool: toolCatalog.find((tool) => tool.id === item.id) ?? null,
    }))
    .filter((item): item is typeof item & { tool: NonNullable<typeof item.tool> } => Boolean(item.tool));
  const libraryHref = withLocalePrefix("/tools", locale);
  const formatUsage = (value: number) =>
    formatMessage(copy.usageLabel, { count: new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US").format(value) });

  return (
    <section id="calculator-showcase" className="px-4 py-12 md:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">{copy.kicker}</p>
          <h2 className="text-balance text-2xl font-semibold text-slate-900 md:text-3xl">{copy.title}</h2>
          <p className="max-w-[68ch] text-sm leading-relaxed text-slate-600 md:text-base">{copy.description}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ tool, icon: Icon, usage }) => {
            const toolCopy = getToolCopy(tool, locale);
            const categoryLabel = tool.category ? categoryLabels.category[tool.category] : categoryLabels.generalCategory;
            return (
              <Link
                key={tool.id}
                href={withLocalePrefix(tool.href, locale)}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <Icon size={20} />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 group-hover:text-slate-950">
                        {toolCopy.title}
                      </h3>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {categoryLabel}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                    {formatUsage(usage)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{toolCopy.description}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  {copy.tryNow}
                </div>
              </Link>
            );
          })}
        </div>

        <Link
          href={libraryHref}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          {copy.cta}
        </Link>
      </div>
    </section>
  );
}
