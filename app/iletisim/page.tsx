import type { ReactNode } from "react";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/seo/JsonLd";
import SupportForm from "@/components/support/SupportForm";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";
import { Mail, ShieldCheck, Timer, CheckCircle, FileCheck } from "lucide-react";

const pageCopy = {
  title: "Bize Ulaşın — TORQYX Mühendislik İletişim Masası",
  description:
    "Teknik hesaplama soruları, formül doğrulama, standart uyumluluğu, özellik önerisi veya hata bildirimleri için bize ulaşın.",
  imageAlt: "İletişim sayfası görseli",
};

const pageCopyEn = {
  title: "Contact Us — TORQYX Engineering Helpdesk",
  description:
    "Get in touch for technical calculation inquiries, formula verification, standard compliance questions, feature requests, or bug reports.",
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
  const isEn = locale === "en";

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: isEn ? pageCopyEn.title : pageCopy.title,
    description: isEn ? pageCopyEn.description : pageCopy.description,
    url: "https://torqyx.com/iletisim",
    mainEntity: {
      "@type": "Organization",
      name: "TORQYX",
      email: "infotorqyx@gmail.com",
      url: "https://torqyx.com",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support and technical verification",
        email: "infotorqyx@gmail.com",
        availableLanguage: ["Turkish", "English"],
      },
    },
  };

  return (
    <PageShell>
      <JsonLd id="contact-page-jsonld" data={contactJsonLd} />

      <PageHero
        title={isEn ? pageCopyEn.title : pageCopy.title}
        description={isEn ? pageCopyEn.description : pageCopy.description}
        imageSrc={heroImage}
        imageAlt="Torqyx Engineering - Contact Hero"
      />

      <section className="grid gap-4 md:grid-cols-3">
        <ContactInfoCard
          icon={<Mail size={18} />}
          title={supportCopy.emailLabel}
          body={supportCopy.email}
          href={`mailto:${supportCopy.email}`}
        />
        <ContactInfoCard
          icon={<Timer size={18} />}
          title={supportCopy.responseTitle}
          body={supportCopy.responseTime}
        />
        <ContactInfoCard
          icon={<ShieldCheck size={18} />}
          title={supportCopy.linkedinLabel}
          body={supportCopy.linkedinUnavailable}
        />
      </section>

      <section id="support-form" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SupportForm />
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <CheckCircle className="h-5 w-5 text-primary-600" />
            <h2 className="text-base font-semibold">
              {isEn ? "Support Guidance & Bug Reports" : "Destek Rehberi ve Bildirim Önerileri"}
            </h2>
          </div>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-slate-600">
            <li>
              {isEn
                ? "Specify the calculator name, tool ID, or URL."
                : "İlgili hesaplayıcı adını, araç kodunu veya sayfa bağlantısını belirtin."}
            </li>
            <li>
              {isEn
                ? "Share input parameters, material specifications, and units used."
                : "Kullandığınız girdi parametrelerini, malzeme değerlerini ve birimleri paylaşın."}
            </li>
            <li>
              {isEn
                ? "If citing an external standard (DIN, ISO, VDI), note the clause or table."
                : "Farklı bir standart sonucuna atıf yapıyorsanız ilgili norm maddesini belirtin."}
            </li>
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <FileCheck className="h-5 w-5 text-primary-600" />
            <h2 className="text-base font-semibold">
              {isEn ? "Editorial & Peer-Review Verification" : "Editoryal ve Hakemli İnceleme Süreci"}
            </h2>
          </div>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-slate-600">
            <li>
              {isEn
                ? "Technical tickets are reviewed directly by mechanical design engineers."
                : "Teknik bildirimler doğrudan makine tasarım mühendislerimiz tarafından incelenir."}
            </li>
            <li>
              {isEn
                ? "Formula or benchmark updates are tracked in the public changelog."
                : "Onaylanan formül ve benchmark güncellemeleri açık sürüm günlüğünde (Changelog) yayımlanır."}
            </li>
            <li>
              {isEn
                ? "Typical response time is within 24 business hours."
                : "Ortalama teknik geri bildirim süremiz 24 saattir."}
            </li>
          </ul>
        </section>
      </div>
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
