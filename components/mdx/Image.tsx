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

const isExternal = (src: string) => src.startsWith("http://") || src.startsWith("https://");

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
  const hasDimensions = typeof width === "number" && typeof height === "number";
  const useNextImage = hasDimensions && !isExternal(src);

  return (
    <figure className="my-6 flex flex-col items-center gap-2">
      {useNextImage ? (
        <NextImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={mergeClassName("rounded-xl border border-slate-200 bg-white", className)}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={mergeClassName("rounded-xl border border-slate-200 bg-white", className)}
          {...rest}
        />
      )}
      {caption ? <figcaption className="text-xs text-slate-500">{caption}</figcaption> : null}
    </figure>
  );
}
