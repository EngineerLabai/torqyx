"use client";

import dynamic from "next/dynamic";
import type { Locale } from "@/utils/locale";

type ToolLibraryLazyProps = {
  locale: Locale;
  searchParams?: Record<string, string | string[] | undefined>;
};

function ToolLibrarySkeleton() {
  return (
    <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="h-4 w-40 rounded bg-slate-200" />
      <div className="h-3 w-64 rounded bg-slate-100" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`tool-library-skeleton-${index}`} className="h-40 rounded-2xl border border-slate-100 bg-slate-50" />
        ))}
      </div>
    </section>
  );
}

// Bundle estimate (webpack analyzer, parsed): /tools initial page chunk ~46KB -> ~20-30KB (lazy-loaded rest).
const ToolLibrary = dynamic(() => import("@/components/tools/ToolLibrary"), {
  loading: () => <ToolLibrarySkeleton />,
  ssr: false,
});

export default function ToolLibraryLazy(props: ToolLibraryLazyProps) {
  return <ToolLibrary {...props} />;
}

