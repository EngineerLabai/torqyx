"use client";

import { useWorkspaceStore, WorkspaceVariable } from "@/lib/store/useWorkspaceStore";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface VariableExportButtonProps {
  variable: WorkspaceVariable;
}

export default function VariableExportButton({ variable }: VariableExportButtonProps) {
  const setVariable = useWorkspaceStore((state) => state.setVariable);
  const t = useTranslations("workspace.variables");
  const [saved, setSaved] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleSave = () => {
    setVariable(variable);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <button
      onClick={handleSave}
      type="button"
      className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
        saved
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
      }`}
    >
      {saved ? t("successSaved") : t("export")}
    </button>
  );
}