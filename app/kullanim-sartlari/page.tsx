import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { HERO_PLACEHOLDER } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopy = {
  title: "Kullanım Şartları",
  description: "AI Engineers Lab hizmetlerinin kullanımına ilişkin koşullar.",
  imageAlt: "Kullanım şartları görseli",
};

const pageCopyEn = {
  title: "Terms of Use",
  description: "Terms and conditions for using AI Engineers Lab services.",
  imageAlt: "Terms of use visual",
};

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = locale === "en" ? pageCopyEn : pageCopy;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/kullanim-sartlari",
    locale,
    alternatesLanguages: null,
  });
}

export default async function TermsPage() {
  const locale = await getLocaleFromCookies();

  if (locale === "en") {
    return (
      <PageShell>
        <PageHero
          title={pageCopyEn.title}
          description={pageCopyEn.description}
          imageSrc={HERO_PLACEHOLDER}
          imageAlt={pageCopyEn.imageAlt}
        />

        <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm md:text-base">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">1. Acceptance and scope</h2>
            <p>
              By using AI Engineers Lab, you agree to these terms. They apply to all calculators, content, and services on the site.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">2. Informational content</h2>
            <p>
              Calculations and content are provided for informational purposes only and do not replace professional engineering judgment
              or certification. Final design and implementation decisions remain the user&apos;s responsibility.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">3. Limitation of liability</h2>
            <p>
              AI Engineers Lab is not liable for direct or indirect damages, data loss, business interruption, or production defects
              arising from use of the service. Services are provided &quot;as is&quot; without warranties of fitness for a particular
              purpose.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">4. Usage rules</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>You agree to use the service in compliance with applicable laws and ethical standards.</li>
              <li>Unauthorized copying or redistribution of content is prohibited.</li>
              <li>Actions that harm security, performance, or other users&apos; experience are not allowed.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">5. Changes</h2>
            <p>
              We reserve the right to update the service or these terms. Updates will be published on this page.
            </p>
          </section>
        </article>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero
        title={pageCopy.title}
        description={pageCopy.description}
        imageSrc={HERO_PLACEHOLDER}
        imageAlt={pageCopy.imageAlt}
      />

      <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm md:text-base">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">1. Kabul ve kapsam</h2>
          <p>
            AI Engineers Lab web sitesini kullandığınızda bu şartları kabul etmiş sayılırsınız. Şartlar, sitedeki
            hesaplayıcılar, içerikler ve hizmetlerin tümünü kapsar.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">2. Bilgilendirme amaçlı içerik</h2>
          <p>
            Site üzerindeki hesaplamalar ve içerikler bilgilendirme amaçlıdır; resmi mühendislik sertifikasyonu veya
            nihai teknik karar yerine geçmez. Nihai tasarım ve uygulama kararları kullanıcının sorumluluğundadır.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">3. Sorumluluk sınırı</h2>
          <p>
            AI Engineers Lab, doğrudan veya dolaylı zararlardan, veri kaybından, iş kaybından ya da üretim hatalarından
            sorumlu tutulamaz. Hizmetler “olduğu gibi” sunulur ve belirli bir amaca uygunluk garantisi verilmez.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">4. Kullanım kuralları</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Hizmeti hukuka ve etik ilkelere uygun kullanmayı kabul edersiniz.</li>
            <li>İçeriklerin izinsiz kopyalanması veya yeniden dağıtılması yasaktır.</li>
            <li>Güvenlik, performans ve diğer kullanıcıların deneyimini olumsuz etkileyecek eylemlerden kaçınılmalıdır.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">5. Değişiklikler</h2>
          <p>
            Hizmet kapsamında güncelleme yapma veya bu şartları değiştirme hakkı saklıdır. Güncellemeler bu sayfadan
            duyurulur.
          </p>
        </section>
      </article>
    </PageShell>
  );
}
