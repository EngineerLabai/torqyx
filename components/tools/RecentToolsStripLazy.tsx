"use client";

import dynamic from "next/dynamic";

type RecentToolsStripProps = {
  tone?: "light" | "dark";
  className?: string;
  maxItems?: number;
};

const RecentToolsStrip = dynamic(() => import("@/components/tools/RecentToolsStrip"), {
  ssr: false,
  loading: () => (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-2">
        <div className="h-4 w-40 rounded-full bg-slate-100" />
        <div className="h-3 w-64 rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-24 rounded-2xl border border-dashed border-slate-200 bg-slate-50" />
        ))}
      </div>
    </section>
  ),
});

export default function RecentToolsStripLazy(props: RecentToolsStripProps) {
  return <RecentToolsStrip {...props} />;
}
