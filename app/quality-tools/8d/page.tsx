// app/quality-tools/8d/page.tsx
"use client";

import { useState } from "react";
import PageShell from "@/components/layout/PageShell";

type StepId =
  | "d0"
  | "d1"
  | "d2"
  | "d3"
  | "d4"
  | "d5"
  | "d6"
  | "d7"
  | "d8"
  | "risks"
  | "metrics"
  | "signoff";

type Step = {
  id: StepId;
  title: string;
  subtitle?: string;
  guidance: string[];
  placeholder: string;
};

type FormState = {
  caseId: string;
  customer: string;
  product: string;
  lot: string;
  owner: string;
  team: string;
  startDate: string;
  targetDate: string;
} & Record<StepId, string>;

const STEPS: Step[] = [
  {
    id: "d0",
    title: "D0 - Acil Kontrol / Geçici Önlem",
    subtitle: "Müşteriyi ve hattı koru",
    guidance: [
      "Sevkiyat stop / izolasyon / 100% kontrol kararını ve kapsamını yaz.",
      "Geçici önlemin uygulanma tarihi ve sorumlusu.",
      "İzole edilen miktar, lokasyon, parti/lot bilgisi.",
    ],
    placeholder:
      "Örn: Müşteri sahasında ve depoda 100% görsel kontrol başlatıldı. Lot: 24B-17, 1.250 adet stok; sevkiyat durduruldu. Sorumlu: L. Demir, 12.12.2025.",
  },
  {
    id: "d1",
    title: "D1 - Ekip Oluşturma",
    subtitle: "Fonksiyonlar arası ekip",
    guidance: [
      "Kalite, üretim, bakım, proses, lojistik, tedarik zinciri, satın alma, AR-GE temsilcileri.",
      "Roller: lider, fasilitatör, müşteri temsilcisi, kayıtçı.",
      "Toplantı ritmi ve karar alma yetkisi.",
    ],
    placeholder:
      "Ekip: Ekip lideri (KAL): A. Korkmaz; ÜRT: B. Aydın; PRS: E. Şahin; BKM: D. Öz; SAT/TZ: M. Yılmaz; Müşteri temsilcisi: C. Arslan. Haftada 2x 30 dk.",
  },
  {
    id: "d2",
    title: "D2 - Problem Tanımı",
    subtitle: "Neyi, nerede, ne zaman, ne kadar?",
    guidance: [
      "Ne: Kusur tanımı, parça/bileşen/operasyon.",
      "Nerede ve ne zaman: İstasyon, seri/lot, tarih, vardiya.",
      "Ne kadar: Kusur oranı/PPM, adet, trend (kontrol planına göre).",
      "Görsel kanıt / müşteri şikayeti referansı.",
    ],
    placeholder:
      "Örn: Ürün ABC123, Operasyon 40 (delme). Kusur: Delik çapı 8.00±0.05 yerine 8.15 mm (oversize). Etkilenen lot: 24B-17, 1.250 adet; tespit: müşteri giriş kontrolü 12.12.2025. Kusur oranı: %3,5 (PPM 35.000).",
  },
  {
    id: "d3",
    title: "D3 - Geçici Düzeltici Aksiyon (Containment)",
    subtitle: "Müşteri koruması + iç süreç",
    guidance: [
      "İzole edilen stok ve sevkiyat planı.",
      "Sahadaki ürün için aksiyon (geri çağırma / sorting).",
      "İç proses için kontrol artırma (ek ölçüm, poke-yoke devreye alma).",
    ],
    placeholder:
      "Depo ve WIP stoklarında 100% çap ölçümü eklendi; uygunsuz parçalar kırmızı kutuda tutuluyor. Müşteride sorting planı: 14-15.12, 2 kişi; hedef 1.250 adet kontrol.",
  },
  {
    id: "d4",
    title: "D4 - Kök Neden Analizi",
    subtitle: "Problem + kaçış nedenleri",
    guidance: [
      "Teknik kök neden (5 Why, balık kılçığı): neden oluştu?",
      "Kaçış nedeni: neden kontrol planı yakalayamadı?",
      "Varsayım doğrulaması: deney, ölçüm, veri analizi.",
    ],
    placeholder:
      "5 Why özeti: 1) Çap büyük çünkü matkap aşınmış. 2) Aşınmayı operatör fark etmedi çünkü ölçüm sıklığı 2 saatte bir. 3) Ölçüm sıklığı düşük çünkü önceki risk sınıfı yanlış (M). 4) Risk sınıfı yanlış çünkü PFMEA güncel değil (yeni müşteri toleransı girilmemiş). Doğrulama: aşınmış takımla deneme; çap 8.14-8.16 mm.",
  },
  {
    id: "d5",
    title: "D5 - Kalıcı Düzeltici Aksiyon",
    subtitle: "Kök nedenleri ortadan kaldır",
    guidance: [
      "Seçilen kalıcı aksiyon(lar), sorumlu, hedef tarih.",
      "Planlanan doğrulama yöntemi (MSA, capability, pilot üretim).",
      "Kaynak ihtiyacı ve riskler.",
    ],
    placeholder:
      "Aksiyon: Matkap takım ömrü 2.000 adet → 1.200 adete indirilecek; otomatik sayaçlı takım değişimi. PFMEA & CP revizyonu. Doğrulama: 3 lot pilot, Cpk ≥ 1.33; MSA tekrarlanacak. Hedef: 22.12.2025, sorumlu: E. Şahin.",
  },
  {
    id: "d6",
    title: "D6 - Kalıcı Aksiyonun Doğrulanması",
    subtitle: "Etkinlik kanıtı",
    guidance: [
      "Ölçümler, capability sonuçları, saha performansı.",
      "Pilot/deneme üretim sonuçları ve onay kriteri.",
      "Müşteri geri bildirimi (varsa PPAP/ISIR).",
    ],
    placeholder:
      "Pilot 3 lot (3x1.200 adet): çap ort 8.01, Cpk 1.48. İlk sevkiyat sonrası sahada sıfır hata. PPAP seviye 3 dosyası gönderildi; müşteri 02.01.2026 onayı.",
  },
  {
    id: "d7",
    title: "D7 - Sistematik Önleme / Yaygınlaştırma",
    subtitle: "Benzer ürün/hatlara yay",
    guidance: [
      "Benzer proses/ürün listesi ve aksiyon yayılımı.",
      "Standart doküman güncellemeleri (PFMEA, CP, iş talimatı, bakım planı).",
      "Eğitim ve yetkinlik güncellemeleri.",
    ],
    placeholder:
      "Benzer operasyonlar: DEF200 (op40), GHI330 (op35). PFMEA-CP güncellendi; matkap ömrü 1.200 adet, kontrol sıklığı 1 saat. Operatör eğitimi 18.12.2025, bakım planına sayaç eklemesi yapıldı.",
  },
  {
    id: "d8",
    title: "D8 - Kapanış ve Takdir",
    subtitle: "Öğrenilmiş dersler ve teşekkür",
    guidance: [
      "Ekip ve destekleyen kişilere teşekkür.",
      "Öğrenilmiş dersler kısa özeti.",
      "Müşteri bilgilendirme tarihi.",
    ],
    placeholder:
      "Ekip: A. Korkmaz, B. Aydın, E. Şahin, D. Öz, M. Yılmaz. Öğrenilenler: takım ömrü izleme için sayaç şart; PFMEA revizyon ritmi 6 ay. Müşteriye kapanış maili 03.01.2026.",
  },
  {
    id: "risks",
    title: "Risk ve Engeller",
    guidance: [
      "Kaynak ihtiyacı, tedarik riski, duruş riski.",
      "Aksiyonların gecikme sebepleri ve B planı.",
    ],
    placeholder:
      "Takım tedarik süresi 2 hafta; stok kritik. Sayaçlı sistem kurulumunda PLC I/O eksikliği riski; bakım ekibi ek modül sipariş etti.",
  },
  {
    id: "metrics",
    title: "Ölçütler ve Hedefler",
    guidance: [
      "PPM hedefi, hurda/iskarta, müşteride raporlanan kusur sayısı.",
      "SLA: cevap süresi, containment tamamlama süresi.",
    ],
    placeholder:
      "PPM hedefi < 500, hurda < %0.5. D0 tamamlanma: 24 saat, D3 containment: 48 saat. Müşteri rapor süre hedefi: 5 iş günü (tam 8D: 10 iş günü).",
  },
  {
    id: "signoff",
    title: "Onay / İzleme",
    guidance: [
      "Müşteri onayı (tarih, kişi).",
      "İç onay (kalite müdürü, üretim müdürü).",
      "Açık aksiyonların takip formatı.",
    ],
    placeholder:
      "Müşteri onayı: A. Smith, 03.01.2026 (mail ref# 2415). İç onay: Kalite Müdürü: İ. Kaya 04.01.2026; Üretim Müdürü: Z. Çetin 04.01.2026. Açık aksiyon takip tablosu linki: ...",
  },
];

const INITIAL_FORM: FormState = {
  caseId: "",
  customer: "",
  product: "",
  lot: "",
  owner: "",
  team: "",
  startDate: "",
  targetDate: "",
  d0: "",
  d1: "",
  d2: "",
  d3: "",
  d4: "",
  d5: "",
  d6: "",
  d7: "",
  d8: "",
  risks: "",
  metrics: "",
  signoff: "",
};

export default function EightDPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  function handleFieldChange(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    setForm(INITIAL_FORM);
  }

  return (
    <PageShell>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            8D Raporu
          </span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-700">
            İleri seviye
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-medium text-emerald-700">
            Beta
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          8D Rapor İskeleti (Etkileşimli Taslak)
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Müşteri şikayetleri ve kritik uygunsuzluklar için 8D adımlarını
          yapılandırılmış şekilde doldur. Geçici/kalıcı aksiyonları, kök neden
          analizini ve yayılım planını aynı dosyada sakla. PDF/Word çıktısı
          gelecekte eklenecek.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">
          Vaka Temel Bilgileri
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Vaka / Şikayet No"
            value={form.caseId}
            onChange={(v) => handleFieldChange("caseId", v)}
            placeholder="Örn: Q-2025-118"
          />
          <Field
            label="Müşteri / İç kaynak"
            value={form.customer}
            onChange={(v) => handleFieldChange("customer", v)}
            placeholder="Örn: OEM X, İç Denetim"
          />
          <Field
            label="Ürün / Referans"
            value={form.product}
            onChange={(v) => handleFieldChange("product", v)}
            placeholder="Örn: ABC123, Rev.05"
          />
          <Field
            label="Lot / Seri"
            value={form.lot}
            onChange={(v) => handleFieldChange("lot", v)}
            placeholder="Örn: 24B-17"
          />
          <Field
            label="Sorumlu (Owner)"
            value={form.owner}
            onChange={(v) => handleFieldChange("owner", v)}
            placeholder="İsim / departman"
          />
          <Field
            label="Ekip"
            value={form.team}
            onChange={(v) => handleFieldChange("team", v)}
            placeholder="İsimler ve fonksiyonlar"
          />
          <Field
            label="Başlangıç tarihi"
            value={form.startDate}
            onChange={(v) => handleFieldChange("startDate", v)}
            placeholder="GG.AA.YYYY"
          />
          <Field
            label="Hedef kapanış tarihi"
            value={form.targetDate}
            onChange={(v) => handleFieldChange("targetDate", v)}
            placeholder="GG.AA.YYYY"
          />
        </div>
      </section>

      <section className="space-y-4">
        {STEPS.map((step) => (
          <StepCard
            key={step.id}
            step={step}
            value={form[step.id]}
            onChange={(v) => handleFieldChange(step.id, v)}
          />
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Hızlı Kontrol Listesi
            </h3>
            <p className="text-[11px] text-slate-600">
              Raporu gönderirken aşağıdakileri gözden geçir.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
          >
            Formu temizle
          </button>
        </div>
        <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-700">
          <li>D0 ve D3 aksiyonlarında kapsam, tarih ve sorumlu tanımlı mı?</li>
          <li>D4 kök neden + kaçış nedeni doğrulaması kayıtlı mı?</li>
          <li>D5 kalıcı aksiyonların doğrulama planı (D6) açık mı?</li>
          <li>Benzer ürün/hatlar için yayılım (D7) planlandı mı?</li>
          <li>Onay alanları (Müşteri/İç) ve ölçütler güncel mi?</li>
        </ul>
      </section>
    </PageShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
        placeholder={placeholder}
      />
    </label>
  );
}

function StepCard({
  step,
  value,
  onChange,
}: {
  step: Step;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              {step.title}
            </span>
            {step.subtitle && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                {step.subtitle}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            placeholder={step.placeholder}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="mb-2 text-[11px] font-semibold text-slate-800">Doldururken düşün:</p>
          <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-700">
            {step.guidance.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
