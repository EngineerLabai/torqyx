import Link from "next/link";
import { getMessages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";

type ConfidenceProps = {
  locale?: "tr" | "en";
  version?: string;
  lastUpdated?: string;
  assumptions?: string[];
  references?: string[];
};

export default function Confidence({
  locale = "tr",
  version,
  lastUpdated,
  assumptions,
  references,
}: ConfidenceProps) {
  const copy = getMessages(locale).components.confidence;
  const hasAssumptions = assumptions && assumptions.length > 0;
  const hasReferences = references && references.length > 0;
  const changelogHref = withLocalePrefix("/changelog", locale);

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{copy.title}</span>
        {version ? (
          <Link
            href={changelogHref}
            className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white hover:bg-slate-800"
          >
            {copy.version}: {version}
          </Link>
        ) : null}
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          {lastUpdated ? (
            <p>
              <span className="font-semibold text-slate-900">{copy.updated}:</span>{" "}
              <Link href={changelogHref} className="underline decoration-slate-300 underline-offset-2 hover:text-slate-900">
                {lastUpdated}
              </Link>
            </p>
          ) : null}

          {hasReferences ? (
            <div>
              <p className="font-semibold text-slate-900">{copy.references}</p>
              <ul className="list-disc space-y-1 pl-4">
                {references?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {hasAssumptions ? (
          <div>
            <p className="font-semibold text-slate-900">{copy.assumptions}</p>
            <ul className="list-disc space-y-1 pl-4">
              {assumptions?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
