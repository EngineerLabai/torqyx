"use client";

import dynamic from "next/dynamic";

function ReferenceCenterSkeleton() {
  return (
    <div className="grid w-full min-w-0 gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="hidden min-w-0 lg:block">
        <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
          <div className="h-3 w-28 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-40 rounded bg-slate-100" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={`reference-side-skeleton-${index}`} className="h-8 rounded-xl bg-slate-100" />
            ))}
          </div>
        </div>
      </aside>
      <div className="min-w-0 space-y-6">
        <section className="w-full min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
          <div className="h-4 w-36 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-full rounded bg-slate-100" />
          <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
          <div className="mt-4 h-10 w-full rounded-2xl bg-slate-100" />
        </section>
        {Array.from({ length: 3 }).map((_, index) => (
          <section key={`reference-table-skeleton-${index}`} className="space-y-3 animate-pulse">
            <div className="h-5 w-44 rounded bg-slate-200" />
            <div className="h-40 rounded-2xl border border-slate-200 bg-white" />
          </section>
        ))}
      </div>
    </div>
  );
}

// The table controls hydrate on the client, but the reference data itself must
// be in the initial HTML. Keeping SSR enabled makes technical values available
// to search engines and avoids a client-only content gap for users on slow links.
const ReferenceCenter = dynamic(() => import("@/components/reference/ReferenceCenter"), {
  loading: () => <ReferenceCenterSkeleton />,
});

export default function ReferenceCenterLazy() {
  return <ReferenceCenter />;
}
