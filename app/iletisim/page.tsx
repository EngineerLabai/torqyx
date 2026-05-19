import type { ReactNode } from "react";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import SupportForm from "@/components/support/SupportForm";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";
import { Linkedin, Mail, Timer } from "lucide-react";

const pageCopy = {
  title: "Bize Ulaşın",
  description: "Teknik soru, özellik önerisi veya hata bildirimi için aşağıdaki formu kullanın. Her mesaja yanıt veriyoruz.",
  imageAlt: "İletişim sayfası görseli",
};

const pageCopyEn = {
  title: "Contact Us",
  description: "Use the form below for technical questions, feature suggestions, or bug reports. We respond to every message.",
  imageAlt: "Contact page visual",
};

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const copy = locale === "en" ? pageCopyEn : pageCopy;

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/iletisim",
    locale,
  });
}

export default async function ContactPage() {
  const locale = await getLocaleFromCookies();
  const supportCopy = getMessages(locale).pages.support;
  const heroImage = getHeroImageSrc("contact");

  if (locale === "en") {
    return (
      <PageShell>
        <PageHero
          title={pageCopyEn.title}
          description={pageCopyEn.description}
          imageSrc={heroImage}
          imageAlt="Torqyx Engineering - Contact Hero"
        />

        <section className="grid gap-4 md:grid-cols-3">
          <ContactInfoCard icon={<Mail size={18} />} title={supportCopy.emailLabel} body={supportCopy.email} href={`mailto:${supportCopy.email}`} />
          <ContactInfoCard icon={<Timer size={18} />} title={supportCopy.responseTitle} body={supportCopy.responseTime} />
          <ContactInfoCard icon={<Linkedin size={18} />} title={supportCopy.linkedinLabel} body={supportCopy.linkedinUnavailable} />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SupportForm />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Support guidance</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Include the calculator name or page URL.</li>
            <li>Share input values, units, and the expected outcome.</li>
            <li>If it is urgent, mention it at the top of your message.</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Response time</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>We typically respond within 24 hours.</li>
            <li>Providing context and attachments helps us resolve issues faster.</li>
          </ul>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero
        title={pageCopy.title}
        description={pageCopy.description}
        imageSrc={heroImage}
        imageAlt="Torqyx Engineering - Contact Hero"
      />

      <section className="grid gap-4 md:grid-cols-3">
        <ContactInfoCard icon={<Mail size={18} />} title={supportCopy.emailLabel} body={supportCopy.email} href={`mailto:${supportCopy.email}`} />
        <ContactInfoCard icon={<Timer size={18} />} title={supportCopy.responseTitle} body={supportCopy.responseTime} />
        <ContactInfoCard icon={<Linkedin size={18} />} title={supportCopy.linkedinLabel} body={supportCopy.linkedinUnavailable} />
      </section>

      <section id="support-form" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SupportForm />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Yanıt süresi</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Genellikle 24 saat içinde yanıt veriyoruz.</li>
          <li>Acil notlarınızı mesaj alanında belirtmeniz süreci hızlandırır.</li>
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
