import type { Locale } from "@/utils/locale";
import { getUiLabel } from "@/utils/ui-labels";

export type ChecklistItem = {
  id: string;
  title: string;
  detail: string;
};

export type ChecklistStep = {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
};

export const COMMISSIONING_COPY: Record<Locale, {
  seo: { title: string; description: string };
  hero: { title: string; description: string; eyebrow: string; imageAlt: string };
  progressLabel: string;
  resetLabel: string;
  exportLabel: string;
  exportSoon: string;
  completedLabel: string;
  markDoneLabel: string;
  checklistTitle: string;
  storageNote: string;
}> = {
  tr: {
    seo: {
      title: "Devreye Alma Paneli | Proje Merkezi",
      description: "Komisyoning adımları, checklist, loglar ve teslim paketi için lokal çalışan panel.",
    },
    hero: {
      title: "Devreye Alma Paneli",
      description:
        "Adım adım komisyoning akışını yönet. Her maddeyi tamamla, notları gör ve teslim paketini hazırla.",
      eyebrow: getUiLabel("tr", "projectHub"),
      imageAlt: "Devreye alma iş akışı",
    },
    progressLabel: "Genel ilerleme",
    resetLabel: "Checklist sıfırla",
    exportLabel: "Checklist dışa aktar",
    exportSoon: "Çok yakında",
    completedLabel: "Tamamlandı",
    markDoneLabel: "Tamamla",
    checklistTitle: "Komisyoning checklisti",
    storageNote: "İşaretler bu cihazda saklanır (localStorage).",
  },
  en: {
    seo: {
      title: "Commissioning Panel | Project Hub",
      description: "Local-first commissioning workflow with checklists, logs, and handover package.",
    },
    hero: {
      title: "Commissioning Panel",
      description:
        "Run the commissioning workflow step by step. Mark tasks, review details, and prepare the handover package.",
      eyebrow: getUiLabel("en", "projectHub"),
      imageAlt: "Commissioning workflow",
    },
    progressLabel: "Overall progress",
    resetLabel: "Reset checklist",
    exportLabel: "Export checklist",
    exportSoon: "Coming soon",
    completedLabel: "Completed",
    markDoneLabel: "Mark done",
    checklistTitle: "Commissioning checklist",
    storageNote: "Checkmarks are stored on this device (localStorage).",
  },
};

export const COMMISSIONING_STEPS: Record<Locale, ChecklistStep[]> = {
  tr: [
    {
      id: "prechecks",
      title: "Ön Hazırlık / Pre-Checks",
      description: "Dokümanlar, izinler ve sahaya çıkmadan önceki kontroller.",
      items: [
        {
          id: "docs",
          title: "Doküman setini doğrula",
          detail: "Güncel P&ID, layout, elek/schematics, ekipman datasheet ve revizyon listesi.",
        },
        {
          id: "safety",
          title: "Emniyet izinleri ve risk listesi",
          detail: "Saha izinleri, LOTO, risk analizi ve acil durum planlarını onayla.",
        },
        {
          id: "tools",
          title: "Kalibrasyonlu ekipman kontrolü",
          detail: "Tork anahtarı, basınç sensörü, multimetre ve test ekipmanı kalibrasyon tarihi.",
        },
        {
          id: "spares",
          title: "Kritik sarf ve yedekler",
          detail: "Conta, hortum, fittings ve sarf malzemelerin stok durumu.",
        },
      ],
    },
    {
      id: "mechanical",
      title: "Mekanik Montaj Kontrolleri",
      description: "Tork, montaj, hizalama ve işaretleme adımları.",
      items: [
        {
          id: "torque",
          title: "Tork loglarını tamamla",
          detail: "Kritik bağlantılar için hedef tork, cihaz ve operatör bilgisi kaydı.",
        },
        {
          id: "marking",
          title: "İşaretleme ve witness",
          detail: "Torklanan bağlantıları boya veya witness mark ile işaretle.",
        },
        {
          id: "alignment",
          title: "Hizalama ve hizalama toleransı",
          detail: "Kaplinler, rulman yatakları ve hareketli parçalar için hizalama kontrolü.",
        },
      ],
    },
    {
      id: "pneumatic",
      title: "Pnömatik / Hidrolik Kontroller",
      description: "Sızdırmazlık, basınç tutma ve temizlik.",
      items: [
        {
          id: "leak",
          title: "Kaçak testi",
          detail: "Düşüş basınç testini uygula ve sızıntı noktalarını kaydet.",
        },
        {
          id: "pressure",
          title: "Basınç tutma",
          detail: "Belirlenen süre boyunca basınç düşüşünü gözle ve kaydet.",
        },
        {
          id: "cleanliness",
          title: "Filtre / yağ temizliği",
          detail: "Filtre elemanlarını ve yağ temizliğini standartlara göre kontrol et.",
        },
      ],
    },
    {
      id: "electrical",
      title: "Elektrik / Enstrümantasyon",
      description: "Sensör, kablolama ve I/O doğrulamaları.",
      items: [
        {
          id: "io",
          title: "I/O noktalarını doğrula",
          detail: "PLC sinyalleri, sensör okumaları ve ters polarite kontrolleri.",
        },
        {
          id: "ground",
          title: "Topraklama ve izolasyon",
          detail: "Kablo etiketleri, topraklama direnci ve izolasyon testleri.",
        },
        {
          id: "calibration",
          title: "Sensör kalibrasyonu",
          detail: "Basınç, sıcaklık ve debi sensörlerinin kalibrasyon sertifikaları.",
        },
      ],
    },
    {
      id: "functional",
      title: "Fonksiyonel Testler",
      description: "Soğuk/sıcak test ve kabul kriterleri.",
      items: [
        {
          id: "dryrun",
          title: "Soğuk çalıştırma",
          detail: "Yük olmadan hız ve titreşim kontrolü yap.",
        },
        {
          id: "hotrun",
          title: "Sıcak döngü",
          detail: "Isı yüklenmesi, genleşme ve stabilite kontrolü.",
        },
        {
          id: "acceptance",
          title: "Kabul kriterleri",
          detail: "Performans, enerji ve kalite hedeflerini doğrula.",
        },
      ],
    },
    {
      id: "handover",
      title: "Teslim Paketi",
      description: "Loglar, checklist ve kapanış dokümanları.",
      items: [
        {
          id: "logs",
          title: "Test ve tork logları",
          detail: "Tüm test raporlarını ve tork loglarını dosyala.",
        },
        {
          id: "checklist",
          title: "Checklist paketini tamamla",
          detail: "Onaylı checklist ve imza sayfalarını ekle.",
        },
        {
          id: "handoff",
          title: "Eğitim ve teslim",
          detail: "Operatör eğitimi, bakım planı ve yedek parça listesi.",
        },
      ],
    },
  ],
  en: [
    {
      id: "prechecks",
      title: "Pre-Checks",
      description: "Documents, permits, and readiness before entering the site.",
      items: [
        {
          id: "docs",
          title: "Verify the document pack",
          detail: "Latest P&ID, layout, schematics, equipment datasheets, and revision list.",
        },
        {
          id: "safety",
          title: "Safety permits and risk list",
          detail: "Site permits, LOTO, risk assessment, and emergency plans signed off.",
        },
        {
          id: "tools",
          title: "Calibrated tools check",
          detail: "Torque wrench, pressure gauge, multimeter, and test gear calibration dates.",
        },
        {
          id: "spares",
          title: "Critical consumables",
          detail: "Gaskets, hoses, fittings, and essential spares available.",
        },
      ],
    },
    {
      id: "mechanical",
      title: "Mechanical Assembly Checks",
      description: "Torque logs, markings, alignment, and mechanical verification.",
      items: [
        {
          id: "torque",
          title: "Complete torque logs",
          detail: "Record target torque, tool, and operator for critical joints.",
        },
        {
          id: "marking",
          title: "Witness marking",
          detail: "Mark torqued joints with paint or witness marks for quick audits.",
        },
        {
          id: "alignment",
          title: "Alignment verification",
          detail: "Check couplings, bearing seats, and moving components for alignment.",
        },
      ],
    },
    {
      id: "pneumatic",
      title: "Pneumatic / Hydraulic Checks",
      description: "Leak tests, pressure hold, and cleanliness controls.",
      items: [
        {
          id: "leak",
          title: "Leak test",
          detail: "Run low-pressure leak check and document any leak points.",
        },
        {
          id: "pressure",
          title: "Pressure hold",
          detail: "Monitor pressure drop over the specified hold time.",
        },
        {
          id: "cleanliness",
          title: "Filter and fluid cleanliness",
          detail: "Confirm filters and fluid cleanliness to spec before operation.",
        },
      ],
    },
    {
      id: "electrical",
      title: "Electrical / Instrumentation",
      description: "Sensors, wiring, and I/O validation.",
      items: [
        {
          id: "io",
          title: "Validate I/O points",
          detail: "PLC signals, sensor readings, and polarity checks.",
        },
        {
          id: "ground",
          title: "Grounding and insulation",
          detail: "Grounding continuity, insulation test, and cable labeling.",
        },
        {
          id: "calibration",
          title: "Sensor calibration",
          detail: "Pressure, temperature, and flow sensor certificates verified.",
        },
      ],
    },
    {
      id: "functional",
      title: "Functional Tests",
      description: "Cold/hot cycles and acceptance criteria.",
      items: [
        {
          id: "dryrun",
          title: "Cold run",
          detail: "No-load run to check speed, vibration, and noise.",
        },
        {
          id: "hotrun",
          title: "Hot cycle",
          detail: "Check thermal stability, expansion, and steady-state behavior.",
        },
        {
          id: "acceptance",
          title: "Acceptance criteria",
          detail: "Verify performance, energy, and quality targets.",
        },
      ],
    },
    {
      id: "handover",
      title: "Handover Package",
      description: "Logs, checklist, and close-out documentation.",
      items: [
        {
          id: "logs",
          title: "Test and torque logs",
          detail: "Archive test reports and torque logs in the handover pack.",
        },
        {
          id: "checklist",
          title: "Checklist sign-off",
          detail: "Attach signed checklist and approvals.",
        },
        {
          id: "handoff",
          title: "Training and handover",
          detail: "Operator training, maintenance plan, and spares list.",
        },
      ],
    },
  ],
};
