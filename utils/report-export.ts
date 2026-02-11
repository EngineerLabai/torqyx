const PRINT_STYLES = `
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 20px;
      color: #0f172a;
      background: #ffffff !important;
      font-family: "Inter", system-ui, -apple-system, sans-serif;
    }
    h1, h2, h3 {
      font-family: "Sora", system-ui, -apple-system, sans-serif;
      letter-spacing: -0.02em;
    }
    .no-print { display: none !important; }
    @media print {
      body { margin: 12mm; background: #ffffff !important; }
      .no-print { display: none !important; }
    }
  </style>
`;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const cloneStyles = (target: Document) => {
  const nodes = document.querySelectorAll("style, link[rel='stylesheet']");
  nodes.forEach((node) => {
    target.head.appendChild(node.cloneNode(true));
  });
};

const cloneReportNode = (node: HTMLElement) => {
  const clone = node.cloneNode(true) as HTMLElement;
  const sourceCanvases = Array.from(node.querySelectorAll("canvas"));
  const targetCanvases = Array.from(clone.querySelectorAll("canvas"));

  sourceCanvases.forEach((canvas, index) => {
    const target = targetCanvases[index];
    if (!target) return;
    const img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    img.alt = "chart";
    img.style.maxWidth = "100%";
    img.style.display = "block";
    target.replaceWith(img);
  });

  return clone;
};

export const downloadReportPdf = (elementId: string, title: string) => {
  if (typeof window === "undefined") return;
  const element = document.getElementById(elementId);
  if (!element) return;

  const cloned = cloneReportNode(element);
  const printWindow = window.open("", "_blank", "width=1280,height=720");
  if (!printWindow) return;

  const safeTitle = escapeHtml(title || "Report");
  printWindow.document.open();
  printWindow.document.write(
    `<!doctype html><html><head><title>${safeTitle}</title>${PRINT_STYLES}</head><body>${cloned.outerHTML}</body></html>`,
  );
  cloneStyles(printWindow.document);
  printWindow.document.close();
  printWindow.focus();

  const triggerPrint = () => {
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };

  if (printWindow.document.readyState === "complete") {
    setTimeout(triggerPrint, 150);
  } else {
    printWindow.addEventListener("load", () => setTimeout(triggerPrint, 150), { once: true });
  }
};
