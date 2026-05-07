"use client";

import { useWorkspaceStore, WorkspaceMaterial, WorkspaceState } from "@/useWorkspaceStore";
import { useState } from "react";

interface MaterialExportButtonProps {
  material: WorkspaceMaterial;
}

export default function MaterialExportButton({ material }: MaterialExportButtonProps) {
  const setActiveMaterial = useWorkspaceStore((state: WorkspaceState) => state.setActiveMaterial);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setActiveMaterial(material);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <button
      onClick={handleSave}
      type="button"
      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
        saved ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {saved ? "Çalışma Alanına Alındı" : "Çalışma Alanında Kullan"}
    </button>
  );
}
