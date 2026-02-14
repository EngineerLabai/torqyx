"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatMessage, getMessages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";
import { encodeToolState } from "@/utils/tool-share";
import { readProjects, type Project, type ProjectItem } from "@/lib/projects/storage";

const formatDate = (value: string, locale: "tr" | "en") =>
  new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", { dateStyle: "medium" }).format(new Date(value));

const getToolTitle = (item: ProjectItem) => {
  const meta = item.reportMeta ?? {};
  return typeof meta.title === "string" && meta.title.trim() ? meta.title : item.toolSlug;
};

export default function ProjectsClient() {
  const { locale } = useLocale();
  const copy = getMessages(locale).pages.projects;
  const [projects] = useState<Project[]>(() => readProjects());

  const content = useMemo(() => {
    if (!projects.length) return null;
    return projects.map((project) => {
      const itemCount = project.items.length;
      return (
        <section key={project.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {copy.projectLabel}
              </div>
              <h2 className="text-lg font-semibold text-slate-900">{project.title}</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
              {formatMessage(copy.itemCount, { count: itemCount })}
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {project.items.map((item) => {
              const reportBase = withLocalePrefix(`/tools/${item.toolSlug}/report`, locale);
              const encoded = encodeToolState(item.inputs ?? {});
              const reportUrl = encoded ? `${reportBase}?input=${encoded}` : reportBase;
              return (
                <article
                  key={item.id}
                  className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">{getToolTitle(item)}</h3>
                    <p className="text-[11px] text-slate-500">
                      {copy.createdLabel}: {formatDate(item.createdAt, locale)}
                    </p>
                  </div>
                  <Link
                    href={reportUrl}
                    className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    {copy.openReport}
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      );
    });
  }, [projects, locale, copy]);

  if (!projects.length) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold text-slate-900">{copy.emptyTitle}</h2>
        <p className="mt-2 text-sm text-slate-600">{copy.emptyDescription}</p>
      </section>
    );
  }

  return <div className="space-y-6">{content}</div>;
}
