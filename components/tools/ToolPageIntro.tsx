import Link from "next/link";
import { ChevronRight } from "lucide-react";
import AccessBadge from "@/components/tools/AccessBadge";
import ToolBadge from "@/components/tools/ToolBadge";
import { getMessages } from "@/utils/messages";
import type { Locale } from "@/utils/locale";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";
import { withLocalePrefix } from "@/utils/locale-path";
import { getCategoryForToolId } from "@/data/tool-categories";

type ToolPageIntroProps = {
  toolId: string;
  locale: Locale;
};

export default function ToolPageIntro({ toolId, locale }: ToolPageIntroProps) {
  const catalogEntry = toolCatalog.find((item) => item.id === toolId);
  if (!catalogEntry) return null;

  const messages = getMessages(locale);
  const toolCopy = getToolCopy(catalogEntry, locale);
  const accessLabel = messages.common.access?.[catalogEntry.access] ?? messages.common.access?.free ?? "";
  const toolPageCopy = messages.components.toolPage;
  const category = getCategoryForToolId(toolId);

  const homeHref = withLocalePrefix("/", locale);
  const toolsHref = withLocalePrefix("/tools", locale);
  const homeLabel = locale === "tr" ? "Ana Sayfa" : "Home";
  const toolsLabel = locale === "tr" ? "Hesaplayıcılar" : "Calculators";

  return (
    <section className="mb-6 min-w-0 space-y-3">
      {/* Breadcrumb: Home > Calculators > Category > Tool */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <Link href={homeHref} className="transition-colors hover:text-slate-900">
          {homeLabel}
        </Link>
        <ChevronRight size={12} className="text-slate-400" />
        <Link href={toolsHref} className="transition-colors hover:text-slate-900">
          {toolsLabel}
        </Link>
        {category ? (
          <>
            <ChevronRight size={12} className="text-slate-400" />
            <Link
              href={withLocalePrefix(`/tools/${category.slug}`, locale)}
              className="transition-colors hover:text-slate-900"
            >
              {category.title[locale]}
            </Link>
          </>
        ) : null}
        <ChevronRight size={12} className="text-slate-400" />
        <span className="font-semibold text-slate-900" aria-current="page">
          {toolCopy.title}
        </span>
      </nav>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {toolPageCopy.badge}
            </span>
            <ToolBadge status={catalogEntry.status} standard={catalogEntry.validationStandard} locale={locale} />
            {accessLabel ? <AccessBadge access={catalogEntry.access} label={accessLabel} size="sm" /> : null}
          </div>
          <h1 className="text-lg font-semibold text-slate-900">{toolCopy.title}</h1>
          <p className="text-sm text-slate-600">{toolCopy.description}</p>
        </div>
      </div>
    </section>
  );
}
