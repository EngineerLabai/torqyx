export type SvgExportOptions = {
  filename: string;
  scale?: number;
};

const defaultScale = 2;

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const downloadDataUrl = (dataUrl: string, filename: string) => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
};

const getSvgSize = (svg: SVGSVGElement) => {
  const viewBox = svg.viewBox?.baseVal;
  if (viewBox && viewBox.width > 0 && viewBox.height > 0) {
    return { width: viewBox.width, height: viewBox.height };
  }

  const widthAttr = Number(svg.getAttribute("width"));
  const heightAttr = Number(svg.getAttribute("height"));

  if (widthAttr > 0 && heightAttr > 0) {
    return { width: widthAttr, height: heightAttr };
  }

  const rect = svg.getBoundingClientRect();
  const width = rect.width || 300;
  const height = rect.height || 150;
  return { width, height };
};

export const serializeSvg = (svg: SVGSVGElement) => {
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);
  if (!source.includes("xmlns=\"http://www.w3.org/2000/svg\"")) {
    source = source.replace("<svg", "<svg xmlns=\"http://www.w3.org/2000/svg\"");
  }
  return source;
};

export const getSvgPreview = (svg: SVGSVGElement | null) => {
  if (!svg) return "";
  const source = serializeSvg(svg);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
};

export const getCanvasPreview = (canvas: HTMLCanvasElement | null) => {
  if (!canvas) return "";
  return canvas.toDataURL("image/png");
};

export const exportSvg = (svg: SVGSVGElement | null, filename: string) => {
  if (!svg) return false;
  const source = serializeSvg(svg);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, filename);
  return true;
};

export const exportSvgToPng = async (svg: SVGSVGElement | null, options: SvgExportOptions) => {
  if (!svg) return false;
  const { filename, scale = defaultScale } = options;
  const { width, height } = getSvgSize(svg);
  const source = serializeSvg(svg);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  return new Promise<boolean>((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(width * scale);
      canvas.height = Math.ceil(height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve(false);
        return;
      }
      ctx.scale(scale, scale);
      ctx.drawImage(image, 0, 0, width, height);
      const pngUrl = canvas.toDataURL("image/png");
      downloadDataUrl(pngUrl, filename);
      URL.revokeObjectURL(url);
      resolve(true);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    image.src = url;
  });
};

export const exportCanvasPng = (canvas: HTMLCanvasElement | null, filename: string) => {
  if (!canvas) return false;
  const dataUrl = canvas.toDataURL("image/png");
  downloadDataUrl(dataUrl, filename);
  return true;
};

export const exportCanvasSvg = (canvas: HTMLCanvasElement | null, filename: string) => {
  if (!canvas) return false;
  const dataUrl = canvas.toDataURL("image/png");
  const width = canvas.clientWidth || canvas.width;
  const height = canvas.clientHeight || canvas.height;
  const svg = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n` +
    `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${width}\" height=\"${height}\" viewBox=\"0 0 ${width} ${height}\">` +
    `<image href=\"${dataUrl}\" width=\"100%\" height=\"100%\" />` +
    `</svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, filename);
  return true;
};
