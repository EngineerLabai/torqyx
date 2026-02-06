import type { ReactNode } from "react";
import Image from "next/image";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZjlmYWZiIi8+PHBhdGggZD0iTTAgMjBDMTAgMTQuNSAyNSAxMSA0MCA4IiBzdHJva2U9IiNlMmU4ZjAiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==";

type PageHeroProps = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  eyebrow?: string;
  subtitle?: string;
  children?: ReactNode;
  priority?: boolean;
};

export default function PageHero({
  title,
  description,
  imageSrc,
  imageAlt,
  eyebrow,
  subtitle,
  children,
  priority = false,
}: PageHeroProps) {
  if (!imageSrc) {
    return null;
  }

  const normalizedSrc = imageSrc.toLowerCase();
  const isSvg = normalizedSrc.endsWith(".svg");

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm md:p-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
        <div className="space-y-4">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">{eyebrow}</p>
          ) : null}
          <h1 className="text-balance text-[clamp(2.75rem,4.2vw,3.5rem)] font-semibold text-slate-900">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-sm font-medium text-slate-500 md:text-base">{subtitle}</p>
          ) : null}
          <p className="max-w-[68ch] text-base leading-relaxed text-slate-600 md:text-lg">
            {description}
          </p>
          {children ? <div className="flex flex-wrap gap-3">{children}</div> : null}
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200" />
          <div className="relative aspect-[4/3] w-full lg:aspect-[16/10]">
            {isSvg ? (
              <img
                src={imageSrc}
                alt={imageAlt}
                width={1200}
                height={900}
                className="h-full w-full object-cover"
                loading={priority ? "eager" : "lazy"}
                decoding="async"
              />
            ) : (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                priority={priority}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
