"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatMessage, getMessages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";
import { buildProjectItem, readProjects, saveProjectItem, type Project } from "@/lib/projects/storage";

type ToolDataActionsProps = {
  toolSlug: string;
  toolTitle: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown> | null;
  reportUrl?: string;
};

type ExportRow = { section: string; key: string; value: string };

const isPrimitive = (value: unknown) =>
  value === null ||
  value === undefined ||
  typeof value === "string" ||
  typeof value === "number" ||
  typeof value === "boolean";

const sanitizeRecord = (input: Record<string, unknown>) =>
  Object.entries(input).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (isPrimitive(value)) {
      acc[key] = value;
    }
    return acc;
  }, {});

const formatValue = (value: unknown) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
};

const downloadBlob = (filename: string, content: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const escapeCsv = (value: string) => {
  if (value.includes("\"") || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

const getDefaultProjectTitle = (value?: string) => value?.trim() || "My Project";

export default function ToolDataActions({ toolSlug, toolTitle, inputs, outputs, reportUrl }: ToolDataActionsProps) {
  const { locale } = useLocale();
  const messages = getMessages(locale);
  const copy = messages.components.toolDataActions;

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [newProjectTitle, setNewProjectTitle] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const safeInputs = useMemo(() => sanitizeRecord(inputs), [inputs]);
  const safeOutputs = useMemo(() => (outputs ? sanitizeRecord(outputs) : null), [outputs]);

  useEffect(() => {
    const stored = readProjects();
    setProjects(stored);
    if (stored.length > 0) {
      setSelectedProjectId(stored[0].id);
    } else {
      setSelectedProjectId("new");
      setNewProjectTitle(getDefaultProjectTitle(copy.defaultProject));
    }
  }, [copy]);

  const handleSave = () => {
    if (!safeOutputs) return;
    const isNew = selectedProjectId === "new" || !projects.find((project) => project.id === selectedProjectId);
    const title = (isNew ? newProjectTitle.trim() : "") || getDefaultProjectTitle(copy.defaultProject);

    const item = buildProjectItem({
      toolSlug,
      inputs: safeInputs,
      outputs: safeOutputs,
      reportMeta: {
        title: toolTitle,
        reportUrl,
      },
    });

    const { projects: nextProjects, project } = saveProjectItem({
      projectId: isNew ? undefined : selectedProjectId,
      projectTitle: title,
      item,
    });

    setProjects(nextProjects);
    setSelectedProjectId(project.id);
    setStatus(formatMessage(copy.savedMessage, { project: project.title }));
    window.setTimeout(() => setStatus(""), 2500);
  };

  const handleExportJson = () => {
    if (!safeOutputs) return;
    const payload = {
      inputs: safeInputs,
      outputs: safeOutputs,
    };
    const json = JSON.stringify(payload, null, 2);
    const filename = `${toolSlug.replace(/\//g, "-")}-export.json`;
    downloadBlob(filename, json, "application/json;charset=utf-8");
  };

  const handleExportCsv = () => {
    if (!safeOutputs) return;
    const rows: ExportRow[] = [];
    Object.entries(safeInputs).forEach(([key, value]) => {
      rows.push({ section: copy.sections.inputs, key, value: formatValue(value) });
    });
    Object.entries(safeOutputs).forEach(([key, value]) => {
      rows.push({ section: copy.sections.outputs, key, value: formatValue(value) });
    });
    const header = [copy.csvHeaders.section, copy.csvHeaders.key, copy.csvHeaders.value].map(escapeCsv).join(",");
    const lines = rows.map((row) =>
      [row.section, row.key, row.value].map((value) => escapeCsv(value)).join(","),
    );
    const csv = [header, ...lines].join("\n");
    const filename = `${toolSlug.replace(/\//g, "-")}-export.csv`;
    downloadBlob(filename, csv, "text/csv;charset=utf-8");
  };

  const projectsHref = withLocalePrefix("/projects", locale);
  const hasResults = Boolean(safeOutputs);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-slate-900">{copy.title}</h2>
          <p className="text-[11px] text-slate-500">{copy.description}</p>
        </div>
        <Link
          href={projectsHref}
          className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          {copy.openProjects}
        </Link>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-2">
          <label className="text-[11px] font-medium text-slate-700">{copy.projectLabel}</label>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedProjectId}
              onChange={(event) => setSelectedProjectId(event.target.value)}
              className="min-w-[180px] rounded-lg border border-slate-300 px-2 py-1.5 text-[11px] text-slate-700"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
              <option value="new">{copy.newProject}</option>
            </select>
            {selectedProjectId === "new" ? (
              <input
                type="text"
                value={newProjectTitle}
                onChange={(event) => setNewProjectTitle(event.target.value)}
                placeholder={copy.newProjectPlaceholder}
                className="min-w-[180px] rounded-lg border border-slate-300 px-2 py-1.5 text-[11px] text-slate-700"
              />
            ) : null}
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasResults}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                hasResults
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "cursor-not-allowed bg-slate-200 text-slate-500"
              }`}
            >
              {copy.save}
            </button>
            {status ? <span className="text-[11px] text-emerald-600">{status}</span> : null}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-medium text-slate-700">{copy.exportLabel}</label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              disabled={!hasResults}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                hasResults
                  ? "border-slate-300 text-slate-700 hover:border-slate-400"
                  : "cursor-not-allowed border-slate-200 text-slate-400"
              }`}
            >
              {copy.exportJson}
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={!hasResults}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                hasResults
                  ? "border-slate-300 text-slate-700 hover:border-slate-400"
                  : "cursor-not-allowed border-slate-200 text-slate-400"
              }`}
            >
              {copy.exportCsv}
            </button>
          </div>
          <p className="text-[10px] text-slate-500">{copy.exportHint}</p>
        </div>
      </div>
    </section>
  );
}
