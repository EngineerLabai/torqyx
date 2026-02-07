"use client";
// app/project-hub/devreye-alma/page.tsx
import PageShell from "@/components/layout/PageShell";

const STEPS = [
  {
    title: "1) Ön hazırlık",
    detail: "P&ID, layout, malzeme sertifikaları, montaj kılavuzları ve emniyet izinlerini topla; risk/punch list oluştur.",
  },
  {
    title: "2) Temizlik ve kontrol",
    detail: "Flanş yüzeyleri ve kanallar temiz, silikon/yağ kalıntısı yok; filtre/süzgeç temizliğini doğrula.",
  },
  {
    title: "3) Kuru montaj + tork",
    detail: "Conta seçimi ve kanal boşlukları datasheet ile uyumlu; kritik bağlantıları tork anahtarıyla işaretle ve logla.",
  },
  {
    title: "4) Ön sızdırmazlık testi",
    detail: "Uygun test sıvısı/gazı ile düşük basınçta kaçak kontrolü yap; sızıntı noktalarını işaretle ve yeniden sık.",
  },
  {
    title: "5) Sıcak-soğuk çevrim",
    detail: "Kademeli ısıt/soğut; genleşme ve creep etkilerini gözle, gerekirse retork yap.",
  },
  {
    title: "6) Devretme ve loglama",
    detail: "Test sonuçları, tork logları, kullanılan contalar ve bakım periyotlarını kaydet; bakım ekibine devret.",
  },
];

export default function DevreyeAlmaPage() {
  return (
    <PageShell>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Proje Mühendisleri
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-medium text-emerald-700">Devreye alma</span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">Devreye Alma Paneli</h1>
        <p className="mt-2 text-[11px] text-slate-600">
          Checklist: listeleri tamamla, kritik bağlantıları torkla, düşük basınç testi yap, sıcak/soğuk kademelerini gözle,
          logları bakıma devret. Her adımı aç/kapat yaparak detaya bak.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <div className="space-y-2">
          {STEPS.map((s, idx) => (
            <details key={s.title} className="group rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <summary className="flex cursor-pointer items-center justify-between text-[11px] font-semibold text-slate-900">
                {s.title}
                <span className="text-[10px] text-slate-500 group-open:hidden">&#9660;</span>
                <span className="text-[10px] text-slate-500 hidden group-open:inline">&#9650;</span>
              </summary>
              <p className="mt-1 text-[11px] text-slate-700">{s.detail}</p>
            </details>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-slate-600">
          Not: Basınç/sıcaklık testlerinde tedarikçi prosedürleri ve emniyet izinleri kontrol edilmelidir.
        </p>
      </section>
    </PageShell>
  );
}
