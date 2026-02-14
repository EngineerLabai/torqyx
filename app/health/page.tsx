import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function HealthPage() {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-locale") ?? "unknown";
  const now = new Date().toISOString();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Health</h1>
      <p className="mt-2 text-sm text-slate-700">status: ok</p>
      <p className="mt-1 text-sm text-slate-700">renderedAt: {now}</p>
      <p className="mt-1 text-sm text-slate-700">localeHeader: {locale}</p>
    </main>
  );
}
