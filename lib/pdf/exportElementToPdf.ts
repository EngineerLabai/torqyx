const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const safePart = (value: string) =>
  value
    .trim()
    .replace(/[^\w\s-]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

export function buildQualityPdfFilename(toolSlug: string, date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const tool = safePart(toolSlug) || "report";
  return `AI-Engineers-Lab_${tool}_${yyyy}-${mm}-${dd}.pdf`;
}

export async function exportElementToPdf(element: HTMLElement, filename: string) {
  if (typeof window === "undefined") return false;

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  await wait(60);

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    windowWidth: element.scrollWidth,
    foreignObjectRendering: true,
    logging: false,
  });

  const imageData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 36;
  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;
  const imageHeight = (canvas.height * printableWidth) / canvas.width;

  let remainingHeight = imageHeight;
  let positionY = margin;

  pdf.addImage(imageData, "PNG", margin, positionY, printableWidth, imageHeight);
  remainingHeight -= printableHeight;

  while (remainingHeight > 0) {
    pdf.addPage();
    positionY = margin - (imageHeight - remainingHeight);
    pdf.addImage(imageData, "PNG", margin, positionY, printableWidth, imageHeight);
    remainingHeight -= printableHeight;
  }

  pdf.save(filename);
  return true;
}
