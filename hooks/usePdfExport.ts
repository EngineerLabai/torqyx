"use client";

import { useCallback, useState } from "react";
import { useFeatureGate } from "@/hooks/useFeatureGate";
import type { ReportData } from "@/lib/pdf/types";

type UsePdfExportOptions = {
  toolId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
};

type UsePdfExportResult = {
  exportPdf: (reportData: ReportData) => Promise<void>;
  isExporting: boolean;
  isPdfUnavailable: boolean;
  canExport: boolean;
};

export function usePdfExport({
  toolId,
  onSuccess,
  onError,
}: UsePdfExportOptions): UsePdfExportResult {
  const [isExporting, setIsExporting] = useState(false);
  const { hasAccess: hasPdfAccess, isLoading: isCheckingPdfAccess } = useFeatureGate("pdf_export", {
    toolId,
  });

  const exportPdf = useCallback(
    async (reportData: ReportData) => {
      if (!hasPdfAccess) {
        onError?.("PDF rapor dışa aktarımı şu anda kullanılamıyor.");
        return;
      }

      setIsExporting(true);

      try {
        const response = await fetch("/api/generate-pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            toolId,
            reportData,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "PDF oluşturma başarısız");
        }

        // PDF blob'ını indir
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${toolId}-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        onSuccess?.();
      } catch (error) {
        console.error("PDF export error:", error);
        onError?.(error instanceof Error ? error.message : "Bilinmeyen hata");
      } finally {
        setIsExporting(false);
      }
    },
    [toolId, hasPdfAccess, onSuccess, onError]
  );

  return {
    exportPdf,
    isExporting,
    isPdfUnavailable: !hasPdfAccess,
    canExport: hasPdfAccess && !isCheckingPdfAccess,
  };
}
