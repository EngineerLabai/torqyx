"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("[community] route error:", error);
  }, [error]);

  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-slate-900">
      <h2 className="text-lg font-semibold">Something went wrong.</h2>
      <p className="mt-2 text-sm text-slate-700">Please try again or refresh the page.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
