import AccessBadge from "@/components/tools/AccessBadge";
import ToolBadge from "@/components/tools/ToolBadge";
import { getMessages } from "@/utils/messages";
import type { Locale } from "@/utils/locale";
import { getToolCopy, toolCatalog } from "@/tools/_shared/catalog";

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

  return (
    <section className="mb-6 min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
    </section>
  );
}
