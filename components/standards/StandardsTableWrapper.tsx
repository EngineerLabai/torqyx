"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type StandardsTableWrapperProps = {
  children: ReactNode;
  hintLabel: string;
};

export default function StandardsTableWrapper({ children, hintLabel }: StandardsTableWrapperProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [didScroll, setDidScroll] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scrollContainer = host.querySelector<HTMLElement>("[data-standards-table-scroll]");
    if (!scrollContainer) return;

    const updateOverflow = () => {
      setHasOverflow(scrollContainer.scrollWidth > scrollContainer.clientWidth + 1);
    };

    const handleScroll = () => {
      if (scrollContainer.scrollLeft > 0) {
        setDidScroll(true);
      }
    };

    const initialFrame = window.requestAnimationFrame(updateOverflow);
    handleScroll();

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateOverflow);
      observer.observe(scrollContainer);
    } else {
      window.addEventListener("resize", updateOverflow);
    }

    return () => {
      window.cancelAnimationFrame(initialFrame);
      scrollContainer.removeEventListener("scroll", handleScroll);
      if (observer) {
        observer.disconnect();
      } else {
        window.removeEventListener("resize", updateOverflow);
      }
    };
  }, []);

  return (
    <div ref={hostRef} className="space-y-2">
      {hasOverflow && !didScroll ? (
        <div className="flex justify-end md:hidden">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            {hintLabel}
          </span>
        </div>
      ) : null}
      {children}
    </div>
  );
}
