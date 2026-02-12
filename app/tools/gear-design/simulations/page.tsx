import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

const simulations = [
  {
    title: "MAAG Sistemi Hareket Animasyonu",
    description: "Planya stroku ve kremayer bÄ±Ã§ak senkronu; Ã§ift yÃ¼zey iÅŸleme diyagramÄ±.",
    status: "PlanlandÄ±",
  },
  {
    title: "FELLOW Sistemi DinamiÄŸi",
    description: "DiÅŸli kesici yukarÄ± Ã§Ä±kÄ±ÅŸta dÃ¶ner, aÅŸaÄŸÄ± iniÅŸte keser; eÄŸik tabla ayarÄ± gÃ¶rselleÅŸtirmesi.",
    status: "PlanlandÄ±",
  },
  {
    title: "AzdÄ±rma (Hobbing) Kesim Animasyonu",
    description: "Hob sarmal hareketi, radyal/eksenel besleme ve helis aÃ§Ä±sÄ± ayarÄ±; Ã§ok aÄŸÄ±zlÄ± hob aÅŸÄ±nma senaryosu.",
    status: "PlanlandÄ±",
  },
  {
    title: "TaÅŸlama SimÃ¼lasyonu",
    description: "Profil vs form taÅŸlama, soÄŸutma akÄ±ÅŸÄ±, yanma riski ve honing/superfinish etkisi.",
    status: "PlanlandÄ±",
  },
  {
    title: "DÃ¶kÃ¼m SoÄŸuma Animasyonu",
    description: "Besleyici/maÃ§a yerleÅŸimi, katÄ±laÅŸma sÄ±rasÄ± ve bÃ¼zÃ¼lme risk alanlarÄ±nÄ±n gÃ¶rselleÅŸtirilmesi.",
    status: "PlanlandÄ±",
  },
];

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("gear-design/simulations", locale);
}

export default async function GearSimulationsPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("gear-design/simulations", locale);
  return (
    <>
      <ToolSeo toolId="gear-design/simulations" locale={locale} />

    <PageShell>
      <ToolDocTabs slug="gear-design/simulations" initialDocs={initialDocs}>
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_24%)]" />
        <div className="relative space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
              DiÅŸli Ãœretim SimÃ¼lasyonlarÄ±
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              PlanlandÄ±
            </span>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">
            MAAG, FELLOW, AzdÄ±rma ve taÅŸlama/dÃ¶kÃ¼m simÃ¼lasyonlarÄ±
          </h1>
          <p className="text-sm leading-relaxed text-slate-700">
            Hareket ve proses animasyonlarÄ± Ã¶ÄŸrenciler ve mÃ¼hendisler iÃ§in hÄ±zlÄ± gÃ¶rsel rehber olacak. Her kart,
            eklenecek video/animasyon alanÄ± iÃ§in yer tutucu.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {simulations.map((sim) => (
          <article
            key={sim.title}
            className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 text-sm shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold leading-snug text-slate-900 break-words">{sim.title}</h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  {sim.status}
                </span>
              </div>
              <p className="text-[12px] leading-relaxed text-slate-700 break-words">{sim.description}</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
              <span>Animasyon alanÄ± eklenecek</span>
              <button
                disabled
                className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500"
              >
                YakÄ±nda
              </button>
            </div>
          </article>
        ))}
      </section>
          </ToolDocTabs>
    </PageShell>
  
    </>
  );
}




