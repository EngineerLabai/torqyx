"use server";

import jsPDF from "jspdf";
import type { ReportData, User } from "./types";
import { formatValueWithUnit } from "@/utils/units";
import { SITE_URL } from "@/utils/seo";

const SITE_HOST = (() => {
  try {
    return new URL(SITE_URL).host;
  } catch {
    return "torqyx.com";
  }
})();

const SITE_CONFIG = {
  name: "TORQYX",
  url: SITE_HOST,
  logo: "TORQYX", // Text-based logo for now
};

export async function generatePdfReport(
  toolId: string,
  reportData: ReportData,
  user: User
): Promise<Buffer> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Font ayarları
  doc.setFont("helvetica", "normal");

  // Başlık bloğu
  await addHeader(doc, reportData, user, margin, pageWidth);
  yPosition = 60;

  // Unit system bilgisi
  yPosition = addUnitSystemInfo(doc, reportData.unitSystem, yPosition, margin);

  // Giriş parametreleri
  if (reportData.parameters.length > 0) {
    yPosition = addParametersSection(doc, reportData.parameters, reportData.unitSystem, yPosition, pageWidth, margin);
  }

  // Hesaplama formülleri
  if (reportData.formulas.length > 0) {
    yPosition = addFormulasSection(doc, reportData.formulas, yPosition, margin);
  }

  // Sonuçlar
  if (reportData.results.length > 0) {
    yPosition = addResultsSection(doc, reportData.results, reportData.unitSystem, yPosition, pageWidth, margin);
  }

  // Hesaplama adımları
  if (reportData.calculationSteps && reportData.calculationSteps.length > 0) {
    yPosition = addCalculationStepsSection(doc, reportData.calculationSteps, yPosition, margin);
  }

  // Referans standartları
  if (reportData.standards.length > 0) {
    addStandardsSection(doc, reportData.standards, yPosition, margin);
  }

  // Footer
  addFooter(doc, pageWidth, pageHeight);

  return Buffer.from(doc.output("arraybuffer"));
}

async function addHeader(
  doc: jsPDF,
  reportData: ReportData,
  user: User,
  margin: number,
  pageWidth: number
) {
  // Logo ve başlık
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(SITE_CONFIG.logo, margin, 30);

  doc.setFontSize(16);
  doc.text(reportData.toolName, margin, 45);

  // Kullanıcı ve tarih bilgileri
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const userName = user.name || user.email || "Kullanıcı";
  doc.text(`Kullanıcı: ${userName}`, pageWidth - margin, 30, { align: "right" });
  doc.text(`Tarih: ${new Date(reportData.calculationDate).toLocaleDateString("tr-TR")}`, pageWidth - margin, 40, { align: "right" });
  doc.text(`Araç ID: ${reportData.toolId}`, pageWidth - margin, 50, { align: "right" });
}

function addUnitSystemInfo(
  doc: jsPDF,
  unitSystem: ReportData["unitSystem"],
  yPosition: number,
  margin: number
): number {
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  const systemText = unitSystem === 'SI' ? 'SI Birimleri (mm, N, MPa)' :
                    unitSystem === 'Imperial' ? 'Imperial Birimler (in, lbf, psi)' :
                    'Karma Birimler';
  doc.text(`Birim Sistemi: ${systemText}`, margin, yPosition);
  yPosition += 8;

  return yPosition;
}

function addParametersSection(
  doc: jsPDF,
  parameters: ReportData["parameters"],
  unitSystem: ReportData["unitSystem"],
  yPosition: number,
  pageWidth: number,
  margin: number
): number {
  // Başlık
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Giriş Parametreleri", margin, yPosition);
  yPosition += 10;

  // Tablo başlıkları
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Parametre", margin, yPosition);
  doc.text("Değer", pageWidth / 2, yPosition);
  doc.text("Birim", pageWidth - margin - 30, yPosition);
  yPosition += 5;

  // Çizgi
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 5;

  // Parametreler
  doc.setFont("helvetica", "normal");
  parameters.forEach((param) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.text(param.label, margin, yPosition);
    doc.text(String(param.value), pageWidth / 2, yPosition);
    doc.text(param.unit || "-", pageWidth - margin - 30, yPosition);
    yPosition += 8;
  });

  return yPosition + 10;
}

function addFormulasSection(
  doc: jsPDF,
  formulas: ReportData["formulas"],
  yPosition: number,
  margin: number
): number {
  // Başlık
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Hesaplama Formülleri", margin, yPosition);
  yPosition += 10;

  // Formüller
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  formulas.forEach((formula) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFont("helvetica", "bold");
    doc.text(formula.label, margin, yPosition);
    yPosition += 8;

    doc.setFont("helvetica", "normal");
    // LaTeX benzeri gösterim için basit text kullan
    doc.text(formula.latex, margin + 10, yPosition);
    yPosition += 8;

    if (formula.description) {
      doc.setFontSize(8);
      doc.text(formula.description, margin + 10, yPosition);
      yPosition += 6;
    }

    yPosition += 5;
  });

  return yPosition + 10;
}

function addResultsSection(
  doc: jsPDF,
  results: ReportData["results"],
  unitSystem: ReportData["unitSystem"],
  yPosition: number,
  pageWidth: number,
  margin: number
): number {
  // Başlık
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Hesaplama Sonuçları", margin, yPosition);
  yPosition += 10;

  // Tablo başlıkları
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Parametre", margin, yPosition);
  doc.text("Sonuç", pageWidth / 3, yPosition);
  doc.text("Birim", (pageWidth * 2) / 3, yPosition);
  doc.text("Durum", pageWidth - margin - 40, yPosition);
  yPosition += 5;

  // Çizgi
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 5;

  // Sonuçlar
  doc.setFont("helvetica", "normal");
  results.forEach((result) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    // Unit conversion for display
    let displayValue = String(result.value);
    let displayUnit = result.unit || "-";

    if (result.unit && typeof result.value === 'number') {
      const formatted = formatValueWithUnit(result.value, result.unit, unitSystem);
      displayValue = formatted.value.toFixed(2);
      displayUnit = formatted.unit;
    }

    doc.text(result.label, margin, yPosition);
    doc.text(displayValue, pageWidth / 3, yPosition);
    doc.text(displayUnit, (pageWidth * 2) / 3, yPosition);

    // Durum göstergesi
    const statusText = getStatusText(result.status);
    doc.text(statusText, pageWidth - margin - 40, yPosition);
    yPosition += 8;
  });

  return yPosition + 10;
}

function addCalculationStepsSection(
  doc: jsPDF,
  steps: ReportData["calculationSteps"],
  yPosition: number,
  margin: number
): number {
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Hesaplama Adımları", margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  steps?.forEach((step) => {
    if (!step) return;
    if (yPosition > 240) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFont("helvetica", "bold");
    doc.text(step.name, margin, yPosition);
    yPosition += 8;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text(step.standard ?? "", margin, yPosition);
    yPosition += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(step.formula, margin, yPosition);
    yPosition += 8;

    step.variables.forEach((variable) => {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(`• ${variable.label}: ${variable.value}${variable.unit ? ` ${variable.unit}` : ""}` , margin + 8, yPosition);
      yPosition += 7;
    });

    if (yPosition > 240) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFont("helvetica", "bold");
    doc.text(`${step.result} ${step.unit}`, margin + 8, yPosition);
    yPosition += 10;
  });

  return yPosition + 5;
}

function addStandardsSection(
  doc: jsPDF,
  standards: ReportData["standards"],
  yPosition: number,
  margin: number
): number {
  // Başlık
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Referans Standartları", margin, yPosition);
  yPosition += 10;

  // Standartlar
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  standards.forEach((standard) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFont("helvetica", "bold");
    doc.text(standard.code, margin, yPosition);
    yPosition += 8;

    doc.setFont("helvetica", "normal");
    doc.text(standard.title, margin + 10, yPosition);
    yPosition += 8;

    if (standard.url) {
      doc.setFontSize(8);
      doc.text(standard.url, margin + 10, yPosition);
      yPosition += 6;
    }

    yPosition += 5;
  });

  return yPosition + 10;
}

function addFooter(doc: jsPDF, pageWidth: number, pageHeight: number) {
  const footerY = pageHeight - 20;

  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(
    `Bu rapor ${SITE_CONFIG.url} tarafından oluşturulmuştur — sonuçlar standart tabanlıdır`,
    pageWidth / 2,
    footerY,
    { align: "center" }
  );
}

function getStatusText(status: ReportData["results"][0]["status"]): string {
  switch (status) {
    case "pass":
      return "✓ Kabul";
    case "fail":
      return "✗ Red";
    case "warning":
      return "⚠ Uyarı";
    case "info":
      return "ℹ Bilgi";
    default:
      return "-";
  }
}
