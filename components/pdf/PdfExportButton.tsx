"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePdfExport } from "@/hooks/usePdfExport";
import type { ReportData } from "@/lib/pdf/types";

interface PdfExportButtonProps {
  toolId: string;
  reportData: ReportData;
  disabled?: boolean;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function PdfExportButton({
  toolId,
  reportData,
  disabled = false,
  variant = "outline",
  size = "default",
  className,
}: PdfExportButtonProps) {
  const { exportPdf, isExporting, isPremiumRequired, canExport } = usePdfExport({
    toolId,
    onSuccess: () => {
      alert("PDF rapor başarıyla indirildi!");
    },
    onError: (error) => {
      alert(`PDF oluşturma hatası: ${error}`);
    },
  });

  const handleExport = () => {
    exportPdf(reportData);
  };

  if (isPremiumRequired) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled
        className={className}
        title="PDF rapor özelliği premium üyeler için kullanılabilir"
      >
        <FileText className="w-4 h-4 mr-2" />
        PDF Rapor (Premium)
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={disabled || isExporting || !canExport}
      className={className}
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <FileText className="w-4 h-4 mr-2" />
      )}
      {isExporting ? "PDF Hazırlanıyor..." : "PDF Rapor İndir"}
    </Button>
  );
}