import NextImage from "next/image";

type MdxImageProps = {
  caption?: string;
  priority?: boolean;
  className?: string;
  title?: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

const mergeClassName = (base: string, extra?: string) => (extra ? `${base} ${extra}` : base);

const isExternal = (src: string) => /^(https?:)?\/\//.test(src);
const isDataUrl = (src: string) => src.startsWith("data:");
const isRootRelative = (src: string) => src.startsWith("/");
const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 675;
const DEFAULT_IMAGE_ALT = "Content image";

function normalizeLocalSrc(src: string) {
  if (isExternal(src) || isDataUrl(src) || isRootRelative(src)) {
    return src;
  }

  return `/${src.replace(/^[./]+/, "")}`;
}

export default function Image({
  src,
  alt = "",
  width,
  height,
  caption,
  priority,
  className,
  title,
}: MdxImageProps) {
  const normalizedSrc = normalizeLocalSrc(src);
  const resolvedWidth = typeof width === "number" && width > 0 ? width : DEFAULT_IMAGE_WIDTH;
  const resolvedHeight = typeof height === "number" && height > 0 ? height : DEFAULT_IMAGE_HEIGHT;
  const resolvedAlt = alt.trim() ? alt : DEFAULT_IMAGE_ALT;
  const shouldPrioritize = Boolean(priority);
  const shouldBypassOptimization = isExternal(normalizedSrc) || isDataUrl(normalizedSrc);

  return (
    <figure className="my-6 flex flex-col items-center gap-2">
      <NextImage
        src={normalizedSrc}
        alt={resolvedAlt}
        width={resolvedWidth}
        height={resolvedHeight}
        title={title}
        priority={shouldPrioritize}
        fetchPriority={shouldPrioritize ? "high" : undefined}
        loading={shouldPrioritize ? undefined : "lazy"}
        unoptimized={shouldBypassOptimization}
        className={mergeClassName("rounded-xl border border-slate-200 bg-white", className)}
      />
      {caption ? <figcaption className="text-xs text-slate-500">{caption}</figcaption> : null}
    </figure>
  );
}
