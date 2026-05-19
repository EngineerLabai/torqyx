import type { ReactNode } from "react";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import SupportForm from "@/components/support/SupportForm";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";
import { Linkedin, Mail, Timer } from "lucide-react";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = getMessages(locale).pages.support;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/support",
    locale,
  });
}

export default async function SupportPage() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.support;
  const heroImage = getHeroImageSrc("support");

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        eyebrow={copy.badge}
        imageSrc={heroImage}
        imageAlt="Torqyx Engineering - Support Hero"
      />

      <section className="grid gap-4 md:grid-cols-3">
        <ContactInfoCard icon={<Mail size={18} />} title={copy.emailLabel} body={copy.email} href={`mailto:${copy.email}`} />
        <ContactInfoCard icon={<Timer size={18} />} title={copy.responseTitle} body={copy.responseTime} />
        <ContactInfoCard icon={<Linkedin size={18} />} title={copy.linkedinLabel} body={copy.linkedinUnavailable} />
      </section>

      <section id="support-form" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SupportForm />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{copy.tipsTitle}</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {copy.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}

function ContactInfoCard({
  icon,
  title,
  body,
  href,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm transition hover:border-brand">
      <div className="flex items-center gap-2 text-brand">
        {icon}
        <h2 className="font-semibold text-slate-900">{title}</h2>
      </div>
      <p className="mt-3 leading-relaxed text-slate-600">{body}</p>
    </div>
  );

  return href ? <a href={href}>{content}</a> : content;
}
