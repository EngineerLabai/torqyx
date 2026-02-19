import NextImage from "next/image";
import type { ImgHTMLAttributes } from "react";

type MdxImageProps = {
  caption?: string;
  priority?: boolean;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "width" | "height"> & {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

const mergeClassName = (base: string, extra?: string) => (extra ? `${base} ${extra}` : base);

const isExternal = (src: string) => /^(https?:)?\/\//.test(src);
const isDataUrl = (src: string) => src.startsWith("data:");
const isRootRelative = (src: string) => src.startsWith("/");

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
  ...rest
}: MdxImageProps) {
  const normalizedSrc = normalizeLocalSrc(src);
  const hasDimensions = typeof width === "number" && typeof height === "number";
  const useNextImage = hasDimensions && !isExternal(normalizedSrc) && !isDataUrl(normalizedSrc);

  return (
    <figure className="my-6 flex flex-col items-center gap-2">
      {useNextImage ? (
        <NextImage
          src={normalizedSrc}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={mergeClassName("rounded-xl border border-slate-200 bg-white", className)}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={normalizedSrc}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className={mergeClassName("rounded-xl border border-slate-200 bg-white", className)}
          {...rest}
        />
      )}
      {caption ? <figcaption className="text-xs text-slate-500">{caption}</figcaption> : null}
    </figure>
  );
}
