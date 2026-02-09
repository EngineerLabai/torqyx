import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { HERO_PLACEHOLDER } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopy = {
  title: "Kullanım Şartları",
  description: "AI Engineers Lab hizmetlerinin kullanımına ilişkin koşullar.",
  imageAlt: "Kullanım şartları görseli",
};

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const fallbackCopy = getMessages(locale).pages.contentFallback;
  const isTurkish = locale === "tr";

  return buildPageMetadata({
    title: `${isTurkish ? pageCopy.title : fallbackCopy.title} | ${brandContent.siteName}`,
    description: isTurkish ? pageCopy.description : fallbackCopy.description,
    path: "/kullanim-sartlari",
    locale,
    alternatesLanguages: null,
  });
}

export default async function TermsPage() {
  const locale = await getLocaleFromCookies();
  const fallbackCopy = getMessages(locale).pages.contentFallback;

  if (locale !== "tr") {
    return (
      <PageShell>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">{fallbackCopy.title}</h1>
          <p className="mt-3">{fallbackCopy.description}</p>
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
