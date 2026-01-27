"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ActionCard from "@/components/ui/ActionCard";
import Callout from "@/components/mdx/Callout";
import MDXClient from "@/components/mdx/MDXClient";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/utils/analytics";

const TABS = {
  tr: [
    { id: "calculator", label: "Hesaplayici" },
    { id: "explanation", label: "Aciklama" },
    { id: "examples", label: "Ornekler" },
  ],
  en: [
    { id: "calculator", label: "Calculator" },
    { id: "explanation", label: "Explanation" },
    { id: "examples", label: "Examples" },
  ],
} as const;

type TabId = (typeof TABS)["tr"][number]["id"];

type RelatedItem = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readingTimeMinutes: number;
};

type ExampleItem = {
  title: string;
  description?: string;
  inputs?: Record<string, string>;
  outputs?: Record<string, string>;
  notes?: string[];
};

type ToolDocsResponse = {
  tool: { id: string; title: string; tags: string[] } | null;
  explanation: import("next-mdx-remote").MDXRemoteSerializeResult | null;
  examples:
    | { kind: "mdx"; source: import("next-mdx-remote").MDXRemoteSerializeResult }
    | { kind: "json"; items: ExampleItem[] }
    | null;
  related: { guides: RelatedItem[]; glossary: RelatedItem[] };
};

type ToolDocTabsProps = {
  slug: string;
  children: ReactNode;
};

const isValidTab = (value: string | null, locale: "tr" | "en"): value is TabId =>
  Boolean(value && TABS[locale].some((tab) => tab.id === value));

export default function ToolDocTabs({ slug, children }: ToolDocTabsProps) {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");
  const initialTab = isValidTab(tabParam, locale) ? tabParam : "calculator";
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [docs, setDocs] = useState<ToolDocsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const didTrackOpen = useRef<string | null>(null);

  const copy =
    locale === "en"
      ? {
          tabsTitle: "Tool tabs",
          explanationTitle: "Calculation explanation",
          examplesTitle: "Examples",
          loadingExamples: "Loading examples...",
          loadingExplanation: "Loading explanation...",
          docsFailed: "Documentation could not be loaded.",
          examplesEmptyTitle: "Example",
          examplesEmptyBody: "No example set yet for this tool.",
          examplesEmptyHint: "Example set is empty. Update the JSON file to add samples.",
          inputs: "Inputs",
          outputs: "Outputs",
          note: "Note",
          guidesTitle: "Guides",
          guidesHeading: "Related guides",
          guidesDesc: "Browse guides with similar tags.",
          glossaryTitle: "Glossary",
          glossaryHeading: "Related terms",
          glossaryDesc: "Terms that share the same concepts as this tool.",
          read: "Read",
        }
      : {
          tabsTitle: "Tool Sekmeleri",
          explanationTitle: "Hesaplama Aciklamasi",
          examplesTitle: "Ornekler",
          loadingExamples: "Ornekler yukleniyor...",
          loadingExplanation: "Aciklama yukleniyor...",
          docsFailed: "Dokumantasyon yuklenemedi.",
          examplesEmptyTitle: "Ornek",
          examplesEmptyBody: "Bu arac icin ornek seti henuz eklenmedi.",
          examplesEmptyHint: "Ornek seti bos. Yeni ornekler eklemek icin JSON dosyasini guncelle.",
          inputs: "Girdiler",
          outputs: "Ciktilar",
          note: "Not",
          guidesTitle: "Guides",
          guidesHeading: "Ilgili rehberler",
          guidesDesc: "Benzer etiketli rehberlere goz at.",
          glossaryTitle: "Glossary",
          glossaryHeading: "Ilgili terimler",
          glossaryDesc: "Aracla ayni kavramlara bakan terimler.",
          read: "Oku",
        };

  useEffect(() => {
    if (isValidTab(tabParam, locale)) {
      Promise.resolve().then(() => setActiveTab(tabParam));
    }
  }, [tabParam, locale]);

  useEffect(() => {
    let ignore = false;
    Promise.resolve().then(() => {
      setLoading(true);
      setError("");
    });

    fetch(`/api/tools/docs?slug=${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Docs load failed");
        }
        const data = (await res.json()) as ToolDocsResponse;
        if (!ignore) {
          setDocs(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError(copy.docsFailed);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [slug, copy.docsFailed]);

  useEffect(() => {
    if (!slug) return;
    if (didTrackOpen.current === slug) return;
    didTrackOpen.current = slug;
    trackEvent("tool_open", { tool_id: slug });
  }, [slug]);

  const { relatedGuides, relatedGlossary, hasRelated } = useMemo(() => {
    const guides = docs?.related.guides ?? [];
    const glossary = docs?.related.glossary ?? [];
    return {
      relatedGuides: guides,
      relatedGlossary: glossary,
      hasRelated: guides.length > 0 || glossary.length > 0,
    };
  }, [docs]);

  const renderExamples = () => {
    if (loading) {
      return <p className="text-sm text-slate-500">{copy.loadingExamples}</p>;
    }

    if (error) {
      return <p className="text-sm text-rose-600">{error}</p>;
    }

    if (!docs?.examples) {
      return (
        <Callout type="info" title={copy.examplesEmptyTitle}>
          {copy.examplesEmptyBody}
        </Callout>
      );
    }

    if (docs.examples.kind === "mdx") {
      return (
        <div className="mdx-content space-y-6">
          <MDXClient source={docs.examples.source} />
        </div>
      );
    }

    if (docs.examples.items.length === 0) {
      return (
        <Callout type="info" title={copy.examplesEmptyTitle}>
          {copy.examplesEmptyHint}
        </Callout>
      );
    }

    return (
      <div className="grid gap-4">
        {docs.examples.items.map((example) => (
          <div key={example.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-slate-900">{example.title}</h3>
              {example.description ? <p className="text-sm text-slate-600">{example.description}</p> : null}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {example.inputs ? <ExampleList title={copy.inputs} items={example.inputs} /> : null}
              {example.outputs ? <ExampleList title={copy.outputs} items={example.outputs} /> : null}
            </div>
            {example.notes && example.notes.length > 0 ? (
              <div className="mt-4">
                <Callout type="warning" title={copy.note}>
                  <ul className="list-disc space-y-1 pl-4">
                    {example.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </Callout>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.tabsTitle}</div>
        <div className="flex flex-wrap gap-2">
          {TABS[locale].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full border px-4 py-2 text-[11px] font-semibold transition ${
                activeTab === tab.id
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={activeTab === "calculator" ? "space-y-6" : "hidden"}>{children}</div>

      <section className={activeTab === "explanation" ? "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" : "hidden"}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{copy.explanationTitle}</h2>
          {loading ? <p className="text-sm text-slate-500">{copy.loadingExplanation}</p> : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {!loading && !error && docs?.explanation ? (
            <div className="mdx-content space-y-6">
              <MDXClient source={docs.explanation} />
            </div>
          ) : null}
          {!loading && !error && !docs?.explanation ? (
            <Callout type="info" title={copy.explanationTitle}>
              {copy.examplesEmptyBody}
            </Callout>
          ) : null}
        </div>
      </section>

      <section className={activeTab === "examples" ? "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" : "hidden"}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{copy.examplesTitle}</h2>
          {renderExamples()}
        </div>
      </section>

      {hasRelated ? (
        <section className="space-y-4">
          {relatedGuides.length ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{copy.guidesTitle}</p>
                <h3 className="text-lg font-semibold text-slate-900">{copy.guidesHeading}</h3>
                <p className="text-sm text-slate-600">{copy.guidesDesc}</p>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {relatedGuides.map((item) => (
                  <ActionCard
                    key={item.slug}
                    title={item.title}
                    description={item.description}
                    href={`/guides/${item.slug}`}
                    badge={item.category}
                    ctaLabel={copy.read}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {relatedGlossary.length ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{copy.glossaryTitle}</p>
                <h3 className="text-lg font-semibold text-slate-900">{copy.glossaryHeading}</h3>
                <p className="text-sm text-slate-600">{copy.glossaryDesc}</p>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {relatedGlossary.map((item) => (
                  <ActionCard
                    key={item.slug}
                    title={item.title}
                    description={item.description}
                    href={`/glossary/${item.slug}`}
                    badge={item.category}
                    ctaLabel={copy.read}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function ExampleList({ title, items }: { title: string; items: Record<string, string> }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</p>
      <dl className="mt-2 space-y-2 text-xs text-slate-700">
        {Object.entries(items).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">{key}</dt>
            <dd className="font-mono text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
