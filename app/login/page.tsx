import AuthGate from "@/components/auth/AuthGate";
import LoginPanel from "@/components/auth/LoginPanel";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy =
    locale === "tr"
      ? { title: "Giriş", description: "Google ile giriş yap ve kayıtlı alanları aç." }
      : { title: "Sign in", description: "Sign in with Google to access saved areas." };

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/login",
    locale,
  });
}

export default async function LoginPage() {
  const locale = await getLocaleFromCookies();
  const authCopy = getMessages(locale).authButtons;
  const copy =
    locale === "tr"
      ? { title: "Giriş", description: "Google ile giriş yaparak kayıtlı hesaplara ve favorilere ulaşın." }
      : { title: "Sign in", description: "Sign in with Google to access favorites and saved areas." };
  const badgeLabel = locale === "tr" ? "Erişim" : "Access";

  return (
    <PageShell>
      <AuthGate>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600">
              {badgeLabel}
            </div>
            <h1 className="text-balance text-2xl font-semibold text-slate-900 md:text-3xl">{copy.title}</h1>
            <p className="text-sm text-slate-600">{copy.description}</p>
          </div>

          <div className="mt-4 max-w-md">
            <LoginPanel copy={authCopy} />
          </div>
        </section>
      </AuthGate>
    </PageShell>
  );
}
