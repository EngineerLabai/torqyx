"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import Image, { type ImageProps } from "next/image";

type OptimizedImageProps = Omit<ImageProps, "src" | "alt" | "onError"> & {
  src?: string;
  alt: string;
  fallbackSrc?: string;
  onError?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
};

const DEFAULT_FALLBACK_SRC = "/images/hero-background.webp";

const isExternal = (src: string) => /^(https?:)?\/\//.test(src);
const isDataUrl = (src: string) => src.startsWith("data:");
const isRootRelative = (src: string) => src.startsWith("/");

const normalizeSrc = (src?: string, fallbackSrc = DEFAULT_FALLBACK_SRC) => {
  const next = src?.trim() || fallbackSrc;
  if (isExternal(next) || isDataUrl(next) || isRootRelative(next)) {
    return next;
  }

  return `/${next.replace(/^[./]+/, "")}`;
};

const OBJECT_FIT_CLASS = /\b!?object-(contain|cover|fill|none|scale-down)\b/;

const mergeClassName = (base: string, extra?: string) => {
  if (!extra) return base;
  return OBJECT_FIT_CLASS.test(extra) ? extra : `${base} ${extra}`;
};

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK_SRC,
  className,
  unoptimized,
  onError,
  priority,
  loading,
  sizes,
  ...props
}: OptimizedImageProps) {
  const normalizedFallback = normalizeSrc(fallbackSrc, DEFAULT_FALLBACK_SRC);
  const [currentSrc, setCurrentSrc] = useState(() => normalizeSrc(src, normalizedFallback));

  useEffect(() => {
    setCurrentSrc(normalizeSrc(src, normalizedFallback));
  }, [src, normalizedFallback]);

  const shouldBypassOptimization =
    Boolean(unoptimized) ||
    isDataUrl(currentSrc) ||
    currentSrc.toLowerCase().endsWith(".svg");

  const resolvedLoading = priority ? undefined : (loading ?? "lazy");
  const resolvedSizes = sizes ?? (props.fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px" : undefined);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      priority={priority}
      loading={resolvedLoading}
      sizes={resolvedSizes}
      unoptimized={shouldBypassOptimization}
      className={mergeClassName("object-cover", className)}
      onError={(event) => {
        onError?.(event);
        if (currentSrc !== normalizedFallback) {
          setCurrentSrc(normalizedFallback);
        }
      }}
    />
  );
}
