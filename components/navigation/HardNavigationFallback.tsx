"use client";

import { useEffect } from "react";

const LOCALE_PATH_REGEX = /^\/(tr|en)(\/|$)/;

const isPrimaryUnmodifiedClick = (event: MouseEvent) =>
  event.button === 0 && !event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

export default function HardNavigationFallback() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!isPrimaryUnmodifiedClick(event)) return;

      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      let nextUrl: URL;
      try {
        nextUrl = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (nextUrl.origin !== window.location.origin) return;
      if (!LOCALE_PATH_REGEX.test(nextUrl.pathname)) return;

      const current = window.location;
      const sameDocument =
        nextUrl.pathname === current.pathname &&
        nextUrl.search === current.search &&
        nextUrl.hash === current.hash;
      if (sameDocument) return;

      event.preventDefault();
      window.location.assign(nextUrl.toString());
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
