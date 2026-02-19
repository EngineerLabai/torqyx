import { exportElementToPdf } from "@/lib/pdf/exportElementToPdf";

const safeFilename = (value: string) => {
  const trimmed = value.trim() || "report";
  return trimmed
    .replace(/[^\w\s-]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
};

export const downloadReportPdf = async (elementId: string, title: string) => {
  if (typeof window === "undefined") return;
  const element = document.getElementById(elementId);
  if (!element) return;
  await exportElementToPdf(element, `${safeFilename(title)}.pdf`);
};
