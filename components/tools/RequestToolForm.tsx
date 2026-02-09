"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";
import {
  REQUESTS_EVENT,
  addToolRequest,
  readToolRequests,
  type ToolRequestData,
  type ToolRequestEntry,
} from "@/utils/tool-requests";

const GITHUB_ISSUE_URL = "https://github.com/EngineerLabai/aiengineerslab/issues/new";

type FieldKey = keyof ToolRequestData;

type RequestToolCopy = ReturnType<typeof getMessages>["components"]["requestToolForm"];

const buildReadableText = (data: ToolRequestData, copy: RequestToolCopy) => {
  return [
    copy.issueTitle,
    "",
    `${copy.fields.problem}:`,
    data.problem,
    "",
    `${copy.fields.inputs}:`,
    data.inputs,
    "",
    `${copy.fields.outputs}:`,
    data.outputs,
    "",
    `${copy.fields.standards}:`,
    data.standards,
    "",
    `${copy.fields.examples}:`,
    data.examples,
    "",
  ].join("\n");
};

const buildIssueBody = (data: ToolRequestData, copy: RequestToolCopy) => {
  return [
    `## ${copy.issueTitle}`,
    "",
    `### ${copy.fields.problem}`,
    data.problem,
    "",
    `### ${copy.fields.inputs}`,
    data.inputs,
    "",
    `### ${copy.fields.outputs}`,
    data.outputs,
    "",
    `### ${copy.fields.standards}`,
    data.standards,
    "",
    `### ${copy.fields.examples}`,
    data.examples,
  ].join("\n");
};

const buildIssueUrl = (data: ToolRequestData, copy: RequestToolCopy) => {
  const titleBase = data.problem.trim().slice(0, 70);
  const title = titleBase ? `${copy.issueTitlePrefix}: ${titleBase}` : copy.issueTitle;
  const body = buildIssueBody(data, copy);
  const params = new URLSearchParams({
    title,
    body,
  });
  return `${GITHUB_ISSUE_URL}?${params.toString()}`;
};

export default function RequestToolForm() {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.requestToolForm;
  const backHref = withLocalePrefix("/tools", locale);
  const [values, setValues] = useState<ToolRequestData>({
    problem: "",
    inputs: "",
    outputs: "",
    standards: "",
    examples: "",
  });
  const [errors, setErrors] = useState<Record<FieldKey, string>>({
    problem: "",
    inputs: "",
    outputs: "",
    standards: "",
    examples: "",
  });
  const [lastEntry, setLastEntry] = useState<ToolRequestEntry | null>(null);
  const [history, setHistory] = useState<ToolRequestEntry[]>([]);
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    Promise.resolve().then(() => setHistory(readToolRequests()));
  }, []);

  useEffect(() => {
    const handleUpdate = () => setHistory(readToolRequests());
    window.addEventListener(REQUESTS_EVENT, handleUpdate);
    return () => window.removeEventListener(REQUESTS_EVENT, handleUpdate);
  }, []);

  const handleChange = (key: FieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validate = () => {
    const nextErrors: Record<FieldKey, string> = {
      problem: values.problem.trim() ? "" : copy.required,
      inputs: values.inputs.trim() ? "" : copy.required,
      outputs: values.outputs.trim() ? "" : copy.required,
      standards: values.standards.trim() ? "" : copy.required,
      examples: values.examples.trim() ? "" : copy.required,
    };
    setErrors(nextErrors);
    return Object.values(nextErrors).every((value) => !value);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const entry = addToolRequest({
      problem: values.problem.trim(),
      inputs: values.inputs.trim(),
      outputs: values.outputs.trim(),
      standards: values.standards.trim(),
      examples: values.examples.trim(),
    });
    setLastEntry(entry);
  };

  const handleCopy = async () => {
    if (!lastEntry) return;
    const payload = {
      id: lastEntry.id,
      createdAt: lastEntry.createdAt,
      ...lastEntry.data,
    };
    const readable = buildReadableText(lastEntry.data, copy);
    const text = `${readable}\n\nJSON:\n${JSON.stringify(payload, null, 2)}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(copy.copied);
    } catch {
      setCopyStatus(copy.copyFail);
    }

    window.setTimeout(() => setCopyStatus(""), 2000);
  };

  const issueUrl = useMemo(
    () => (lastEntry ? buildIssueUrl(lastEntry.data, copy) : ""),
    [lastEntry, copy.issueTitle, copy.issueTitlePrefix],
  );

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <Link href={backHref} className="text-xs font-semibold text-emerald-700 hover:underline">
            {copy.back}
          </Link>
          <h1 className="text-balance text-2xl font-semibold text-slate-900 md:text-3xl">{copy.title}</h1>
          <p className="text-sm text-slate-600">{copy.description}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label={copy.fields.problem}
            value={values.problem}
            onChange={(value) => handleChange("problem", value)}
            error={errors.problem}
            ariaLabel={copy.fields.problem}
          />
          <Field
            label={copy.fields.inputs}
            value={values.inputs}
            onChange={(value) => handleChange("inputs", value)}
            error={errors.inputs}
            ariaLabel={copy.fields.inputs}
          />
          <Field
            label={copy.fields.outputs}
            value={values.outputs}
            onChange={(value) => handleChange("outputs", value)}
            error={errors.outputs}
            ariaLabel={copy.fields.outputs}
          />
          <Field
            label={copy.fields.standards}
            value={values.standards}
            onChange={(value) => handleChange("standards", value)}
            error={errors.standards}
            ariaLabel={copy.fields.standards}
          />
        </div>
        <div className="mt-4">
          <Field
            label={copy.fields.examples}
            value={values.examples}
            onChange={(value) => handleChange("examples", value)}
            error={errors.examples}
            ariaLabel={copy.fields.examples}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-slate-800"
            aria-label={copy.submit}
          >
            {copy.submit}
          </button>
          {lastEntry ? (
            <>
              <a
                href={issueUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-semibold text-emerald-700 transition hover:border-emerald-300"
                aria-label={copy.github}
              >
                {copy.github}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300"
                aria-label={copy.copy}
              >
                {copy.copy}
              </button>
              {copyStatus ? <span className="text-[11px] text-slate-500">{copyStatus}</span> : null}
            </>
          ) : null}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.history}</h2>
          <p className="text-xs text-slate-500">{copy.storageNote}</p>
        </div>
        {history.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            {copy.emptyHistory}
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {history.slice(0, 6).map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] text-slate-500">
                  {new Intl.DateTimeFormat(locale === "en" ? "en-US" : "tr-TR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(entry.createdAt))}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{entry.data.problem}</p>
                <p className="mt-1 text-xs text-slate-600">{entry.data.outputs}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  ariaLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  ariaLabel: string;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <textarea
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
        aria-label={ariaLabel}
      />
      {error ? <span className="text-[10px] text-red-600">{error}</span> : null}
    </label>
  );
}
