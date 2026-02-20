"use client";

import { useEffect } from "react";

type ImagePathWarningsProps = {
  knownAssets: string[];
};

const warnedMessages = new Set<string>();

function warnOnce(message: string) {
  if (warnedMessages.has(message)) {
    return;
  }

  warnedMessages.add(message);
  console.warn(message);
}

function resolveOriginalPath(srcValue: string): string | null {
  if (!srcValue || srcValue.startsWith("data:") || srcValue.startsWith("blob:")) {
    return null;
  }

  try {
    const parsed = new URL(srcValue, window.location.origin);
    if (parsed.pathname === "/_next/image") {
      const encodedSource = parsed.searchParams.get("url");
      if (encodedSource) {
        return decodeURIComponent(encodedSource);
      }
    }

    if (parsed.origin === window.location.origin) {
      return `${parsed.pathname}${parsed.search}`;
    }

    return parsed.toString();
  } catch {
    return srcValue;
  }
}

export default function ImagePathWarnings({ knownAssets }: ImagePathWarningsProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const knownAssetSet = new Set(knownAssets.map((asset) => asset.split("?")[0]));
    const normalizedWindowOrigin = window.location.origin;

    const inspectImage = (img: HTMLImageElement) => {
      if (!img.hasAttribute("data-nimg")) {
        return;
      }

      const rawSrc = img.getAttribute("src") ?? img.currentSrc;
      const originalPath = resolveOriginalPath(rawSrc);

      if (!originalPath) {
        return;
      }

      if (
        originalPath.startsWith("http://") ||
        originalPath.startsWith("https://") ||
        originalPath.startsWith("//")
      ) {
        warnOnce(
          `[ImagePathWarnings] Image src should start with '/'. Found external source: ${originalPath}`,
        );
        return;
      }

      const pathWithoutQuery = originalPath.split("?")[0];
      if (!pathWithoutQuery.startsWith("/")) {
        warnOnce(`[ImagePathWarnings] Image src should start with '/'. Found: ${originalPath}`);
        return;
      }

      if (pathWithoutQuery.startsWith("/images/") && !knownAssetSet.has(pathWithoutQuery)) {
        warnOnce(
          `[ImagePathWarnings] Image src points to a missing known asset: ${pathWithoutQuery} (origin: ${normalizedWindowOrigin})`,
        );
      }
    };

    const inspectNode = (node: Element | Document) => {
      if (node instanceof Element && node.matches("img[data-nimg]")) {
        inspectImage(node as HTMLImageElement);
      }

      node.querySelectorAll("img[data-nimg]").forEach((imageNode) => {
        inspectImage(imageNode as HTMLImageElement);
      });
    };

    inspectNode(document);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.target instanceof HTMLImageElement) {
          inspectImage(mutation.target);
          return;
        }

        mutation.addedNodes.forEach((addedNode) => {
          if (!(addedNode instanceof Element)) {
            return;
          }

          inspectNode(addedNode);
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"],
    });

    return () => {
      observer.disconnect();
    };
  }, [knownAssets]);

  return null;
}
