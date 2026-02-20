import Image from "next/image";

type HeroProps = {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  priority?: boolean;
};

export default function Hero({ title, subtitle, imageSrc, imageAlt, priority = true }: HeroProps) {
  const normalizedImageSrc =
    imageSrc.startsWith("/") || /^(https?:)?\/\//.test(imageSrc)
      ? imageSrc
      : `/${imageSrc.replace(/^[./]+/, "")}`;

  return (
    <section className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(16,185,129,0.12),transparent_40%),radial-gradient(circle_at_84%_8%,rgba(14,165,233,0.12),transparent_34%)]" />
      <div className="site-container relative py-6 md:py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div className="min-w-0 max-w-2xl space-y-3">
            <h1 className="text-balance text-2xl font-semibold leading-tight text-slate-900 md:text-3xl">{title}</h1>
            <p className="text-sm leading-relaxed text-slate-700 md:text-base">{subtitle}</p>
          </div>

          <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
              <Image
                src={normalizedImageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 50vw"
                className="object-cover"
                priority={priority}
                unoptimized={normalizedImageSrc.toLowerCase().endsWith(".svg")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
