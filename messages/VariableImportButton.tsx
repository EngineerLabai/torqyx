"use client";

import { useWorkspaceStore } from "@/lib/store/useWorkspaceStore";
import { useTranslations } from "next-intl";

interface VariableImportButtonProps {
  variableId: string;
  onImport: (value: number, unit: string) => void;
}

export default function VariableImportButton({ variableId, onImport }: VariableImportButtonProps) {
  const getVariable = useWorkspaceStore((state) => state.getVariable);
  const t = useTranslations("workspace.variables");
  const variable = getVariable(variableId);

  if (!variable) return null; // Çalışma alanında ilgili değişken yoksa butonu gizle

  return (
    <button
      onClick={() => onImport(variable.value, variable.unit)}
      type="button"
      className="group relative flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700 transition hover:bg-amber-100"
      title={`${t("savedFrom", { tool: variable.sourceToolId })}: ${variable.value} ${variable.unit}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
      </svg>
      {variable.name} {t("import")}
    </button>
  );
}
