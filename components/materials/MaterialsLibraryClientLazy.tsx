"use client";

import dynamic from "next/dynamic";
import type { MaterialEntry } from "@/src/data/materials/types";
import type { Locale } from "@/utils/locale";

type MaterialsLibraryClientLazyProps = {
  materials: MaterialEntry[];
  locale: Locale;
};

function MaterialsLibrarySkeleton() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-4 w-40 rounded bg-slate-200" />
        <div className="mt-3 h-3 w-2/3 rounded bg-slate-100" />
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="h-10 rounded-xl bg-slate-100" />
          <div className="h-10 rounded-xl bg-slate-100" />
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div className="h-10 rounded-xl bg-slate-100" />
          <div className="h-10 rounded-xl bg-slate-100" />
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`materials-card-skeleton-${index}`} className="h-44 rounded-2xl border border-slate-200 bg-white animate-pulse" />
        ))}
      </section>
    </div>
  );
}

// Bundle estimate (webpack analyzer, parsed): /materials initial page chunk ~35-45KB -> ~15-25KB (library deferred).
const MaterialsLibraryClient = dynamic(() => import("@/components/materials/MaterialsLibraryClient"), {
  loading: () => <MaterialsLibrarySkeleton />,
  ssr: false,
});

export default function MaterialsLibraryClientLazy(props: MaterialsLibraryClientLazyProps) {
  return <MaterialsLibraryClient {...props} />;
}
