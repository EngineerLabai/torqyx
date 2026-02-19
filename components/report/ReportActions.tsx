"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import { buildQualityPdfFilename, exportElementToPdf } from "@/lib/pdf/exportElementToPdf";
import { getJSON, setJSON } from "@/lib/storage";
import type { QualityReportActionsCopy } from "@/data/quality-tools/report-actions";

type SavedReport<T> = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  data: T;
};

type ReportActionsProps<T> = {
  toolKey: string;
  currentData: T;
  onLoadData: (data: T) => void;
  onDemoFill: () => void;
  onReset: () => void;
  reportRootRef: RefObject<HTMLElement | null>;
  copy: QualityReportActionsCopy;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const safePart = (value: string) =>
  value
    .trim()
    .replace(/[^\w\s-]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

function formatDateLabel(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

function downloadJsonFile(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function readSavedReports<T>(storageKey: string): SavedReport<T>[] {
  const loaded = getJSON<SavedReport<T>[]>(storageKey, []);
  return Array.isArray(loaded) ? loaded : [];
}

export default function ReportActions<T>({
  toolKey,
  currentData,
  onLoadData,
  onDemoFill,
  onReset,
  reportRootRef,
  copy,
}: ReportActionsProps<T>) {
  const storageKey = useMemo(() => `aielab:quality:${toolKey}:saved`, [toolKey]);
  const [savedReports, setSavedReports] = useState<SavedReport<T>[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [statusText, setStatusText] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSavedReports(readSavedReports<T>(storageKey));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [storageKey]);

  useEffect(() => {
    if (!statusText) return;
    const timeoutId = window.setTimeout(() => setStatusText(null), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [statusText]);

  function persist(next: SavedReport<T>[]) {
    setSavedReports(next);
    setJSON(storageKey, next);
  }

  function openSaveModal() {
    setTitleInput("");
    setIsSaveModalOpen(true);
  }

  function createSavedReport() {
    const now = new Date().toISOString();
    const normalizedTitle = titleInput.trim() || `${toolKey.toUpperCase()} ${now.slice(0, 10)}`;
    const nextEntry: SavedReport<T> = {
      id: `rep_${Date.now().toString(36)}`,
      title: normalizedTitle,
      createdAt: now,
      updatedAt: now,
      data: currentData,
    };
    persist([nextEntry, ...savedReports]);
    setIsSaveModalOpen(false);
    setStatusText(copy.saveSuccess);
  }

  async function exportCurrentPdf() {
    const element = reportRootRef.current;
    if (!element) return;
    try {
      const filename = buildQualityPdfFilename(toolKey);
      await exportElementToPdf(element, filename);
    } catch {
      setStatusText(copy.exportPdfError);
    }
  }

  function exportSavedJson(entry: SavedReport<T>) {
    const titlePart = safePart(entry.title) || "report";
    const filename = `AI-Engineers-Lab_${safePart(toolKey) || "quality"}_${titlePart}.json`;
    downloadJsonFile(filename, entry);
  }

  async function exportSavedPdf(entry: SavedReport<T>) {
    const element = reportRootRef.current;
    if (!element) return;

    try {
      onLoadData(entry.data);
      await wait(120);
      const filename = buildQualityPdfFilename(`${toolKey}-${safePart(entry.title) || "report"}`);
      await exportElementToPdf(element, filename);
    } catch {
      setStatusText(copy.exportPdfError);
    }
  }

  function renameEntry(entry: SavedReport<T>) {
    const nextTitle = window.prompt(copy.renamePrompt, entry.title)?.trim();
    if (!nextTitle || nextTitle === entry.title) return;
    const now = new Date().toISOString();
    const next = savedReports.map((item) =>
      item.id === entry.id ? { ...item, title: nextTitle, updatedAt: now } : item,
    );
    persist(next);
    setStatusText(copy.renameSuccess);
  }

  function removeEntry(entry: SavedReport<T>) {
    if (!window.confirm(copy.deleteConfirm)) return;
    const next = savedReports.filter((item) => item.id !== entry.id);
    persist(next);
    setStatusText(copy.removeSuccess);
  }

  function loadEntry(entry: SavedReport<T>) {
    onLoadData(entry.data);
    setStatusText(copy.loadSuccess);
  }

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onDemoFill}
            data-testid="report-actions-demo"
            className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            {copy.demoFill}
          </button>
          <button
            type="button"
            onClick={openSaveModal}
            data-testid="report-actions-save"
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            {copy.save}
          </button>
          <button
            type="button"
            onClick={() => setIsManageModalOpen(true)}
            data-testid="report-actions-manage"
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            {copy.manage} ({savedReports.length})
          </button>
          <button
            type="button"
            onClick={exportCurrentPdf}
            data-testid="report-actions-export-pdf"
            className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
          >
            {copy.exportPdf}
          </button>
          <button
            type="button"
            onClick={onReset}
            data-testid="report-actions-reset"
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            {copy.reset}
          </button>
        </div>
        {statusText ? <p className="mt-2 text-[11px] text-slate-600">{statusText}</p> : null}
      </section>

      {isSaveModalOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4"
          data-testid="report-actions-save-modal"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-900">{copy.saveModalTitle}</h3>
            <label className="mt-3 block space-y-1">
              <span className="block text-[11px] font-medium text-slate-700">{copy.saveTitleLabel}</span>
              <input
                type="text"
                value={titleInput}
                onChange={(event) => setTitleInput(event.target.value)}
                placeholder={copy.saveTitlePlaceholder}
                data-testid="report-actions-title-input"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              />
            </label>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                {copy.cancel}
              </button>
              <button
                type="button"
                onClick={createSavedReport}
                data-testid="report-actions-save-confirm"
                className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
              >
                {copy.saveConfirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isManageModalOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4"
          data-testid="report-actions-manage-modal"
        >
          <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900">{copy.manageTitle}</h3>
              <button
                type="button"
                onClick={() => setIsManageModalOpen(false)}
                data-testid="report-actions-manage-close"
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                {copy.close}
              </button>
            </div>

            {savedReports.length === 0 ? (
              <p className="text-xs text-slate-600">{copy.emptySaved}</p>
            ) : (
              <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
                {savedReports.map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
                        <p className="text-[11px] text-slate-600">
                          {copy.createdAt}: {formatDateLabel(entry.createdAt)} | {copy.updatedAt}:{" "}
                          {formatDateLabel(entry.updatedAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => loadEntry(entry)}
                          data-testid="report-actions-load"
                          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          {copy.load}
                        </button>
                        <button
                          type="button"
                          onClick={() => renameEntry(entry)}
                          data-testid="report-actions-rename"
                          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          {copy.rename}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeEntry(entry)}
                          data-testid="report-actions-delete"
                          className="rounded-full border border-rose-300 bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
                        >
                          {copy.remove}
                        </button>
                        <button
                          type="button"
                          onClick={() => exportSavedPdf(entry)}
                          data-testid="report-actions-export-pdf-saved"
                          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          {copy.exportPdf}
                        </button>
                        <button
                          type="button"
                          onClick={() => exportSavedJson(entry)}
                          data-testid="report-actions-export-json"
                          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          {copy.exportJson}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
