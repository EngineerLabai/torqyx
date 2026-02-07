"use client";

import Image from "next/image";
import { useState } from "react";

type BrandLogoProps = {
  name: string;
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  textClassName?: string;
};

export default function BrandLogo({
  name,
  className = "",
  markClassName = "",
  wordClassName = "",
  textClassName = "",
}: BrandLogoProps) {
  const [markVisible, setMarkVisible] = useState(true);
  const [wordVisible, setWordVisible] = useState(true);

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <div className="flex items-center sm:hidden">
        {markVisible ? (
          <Image
            src="/brand/logo-mark-dark.svg"
            alt={`${name} logo mark`}
            width={40}
            height={40}
            className={`h-10 w-10 ${markClassName}`.trim()}
            onError={() => setMarkVisible(false)}
            priority
          />
        ) : (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-[11px] font-semibold uppercase tracking-[0.2em] text-white ${markClassName}`.trim()}
            aria-hidden="true"
          >
            AI
          </div>
        )}
      </div>

      <div className="hidden items-center gap-3 sm:flex">
        {wordVisible ? (
          <Image
            src="/brand/logo.png"
            alt={`${name} logo`}
            width={180}
            height={36}
            className={`h-7 w-auto ${wordClassName}`.trim()}
            onError={() => setWordVisible(false)}
            priority
          />
        ) : null}
        <span className={`text-base font-semibold tracking-tight text-slate-900 ${textClassName}`.trim()}>
          {name}
        </span>
      </div>
    </div>
  );
}
