import type { Locale } from "@/utils/locale";

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
      description: "Komisyoning adimlari, checklist, loglar ve teslim paketi icin lokal calisan panel.",
    },
    hero: {
      title: "Devreye Alma Paneli",
      description:
        "Adim adim komisyoning akisini yonet. Her maddeyi tamamla, notlari gor ve teslim paketini hazirla.",
      eyebrow: "Project Hub",
      imageAlt: "Commissioning workflow",
    },
    progressLabel: "Genel ilerleme",
    resetLabel: "Checklist sifirla",
    exportLabel: "Checklist disa aktar",
    exportSoon: "Cok yakinda",
    completedLabel: "Tamamlandi",
    markDoneLabel: "Tamamla",
    checklistTitle: "Komisyoning checklisti",
    storageNote: "Isaretler bu cihazda saklanir (localStorage).",
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
      eyebrow: "Project Hub",
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
      title: "On Hazirlik / Pre-Checks",
      description: "Dokumanlar, izinler ve sahaya cikmadan onceki kontroller.",
      items: [
        {
          id: "docs",
          title: "Dokuman setini dogrula",
          detail: "Guncel P&ID, layout, elek/schematics, ekipman datasheet ve revizyon listesi.",
        },
        {
          id: "safety",
          title: "Emniyet izinleri ve risk listesi",
          detail: "Saha izinleri, LOTO, risk analizi ve acil durum planlarini onayla.",
        },
        {
          id: "tools",
          title: "Kalibrasyonlu ekipman kontrolu",
          detail: "Tork anahtari, basinc sensoru, multimetre ve test ekipmani kalibrasyon tarihi.",
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
      description: "Tork, montaj, hizalama ve isaretleme adimlari.",
      items: [
        {
          id: "torque",
          title: "Tork loglarini tamamla",
          detail: "Kritik baglantilar icin hedef tork, cihaz ve operator bilgisi kaydi.",
        },
        {
          id: "marking",
          title: "Isaretleme ve witness",
          detail: "Torklanan baglantilari boya veya witness mark ile isaretle.",
        },
        {
          id: "alignment",
          title: "Hizalama ve hizalama toleransi",
          detail: "Kaplinler, rulman yataklari ve hareketli parcalar icin hizalama kontrolu.",
        },
      ],
    },
    {
      id: "pneumatic",
      title: "Pnomatik / Hidrolik Kontroller",
      description: "Sizdirmazlik, basinc tutma ve temizlik.",
      items: [
        {
          id: "leak",
          title: "Kacak testi",
          detail: "Dusus basinc testini uygula ve sizinti noktalarini kaydet.",
        },
        {
          id: "pressure",
          title: "Basinc tutma",
          detail: "Belirlenen sure boyunca basinc dususunu gozle ve kaydet.",
        },
        {
          id: "cleanliness",
          title: "Filtre / yag temizligi",
          detail: "Filtre elemanlarini ve yag temizligini standartlara gore kontrol et.",
        },
      ],
    },
    {
      id: "electrical",
      title: "Elektrik / Enstrumantasyon",
      description: "Sensor, kablolama ve I/O dogrulamalari.",
      items: [
        {
          id: "io",
          title: "I/O noktalarini dogrula",
          detail: "PLC sinyalleri, sensor okumalari ve ters polarite kontrolleri.",
        },
        {
          id: "ground",
          title: "Topraklama ve izolasyon",
          detail: "Kablo etiketleri, topraklama direnci ve izolasyon testleri.",
        },
        {
          id: "calibration",
          title: "Sensor kalibrasyonu",
          detail: "Basinc, sicaklik ve debi sensorlerinin kalibrasyon sertifikalari.",
        },
      ],
    },
    {
      id: "functional",
      title: "Fonksiyonel Testler",
      description: "Soguk/sicak test ve kabul kriterleri.",
      items: [
        {
          id: "dryrun",
          title: "Soguk calistirma",
          detail: "Yuk olmadan hiz ve titresim kontrolu yap.",
        },
        {
          id: "hotrun",
          title: "Sicak dongu",
          detail: "Isi yuklenmesi, genlesme ve stabilite kontrolu.",
        },
        {
          id: "acceptance",
          title: "Kabul kriterleri",
          detail: "Performans, enerji ve kalite hedeflerini dogrula.",
        },
      ],
    },
    {
      id: "handover",
      title: "Teslim Paketi",
      description: "Loglar, checklist ve kapanis dokumanlari.",
      items: [
        {
          id: "logs",
          title: "Test ve tork loglari",
          detail: "Tum test raporlarini ve tork loglarini dosyala.",
        },
        {
          id: "checklist",
          title: "Checklist paketini tamamla",
          detail: "Onayli checklist ve imza sayfalarini ekle.",
        },
        {
          id: "handoff",
          title: "Egitim ve teslim",
          detail: "Operator egitimi, bakim plani ve yedek parca listesi.",
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
