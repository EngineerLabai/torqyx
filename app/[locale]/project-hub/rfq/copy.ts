import type { Locale } from "@/utils/locale";

export type RfqStatus = "new" | "review" | "waiting" | "quoted" | "won" | "lost";
export type RfqPriority = "low" | "medium" | "high";
export type RfqSort = "newest" | "due-date" | "priority" | "status";

export const RFQ_STATUS_OPTIONS: Array<{ value: RfqStatus; label: Record<Locale, string> }> = [
  { value: "new", label: { tr: "Yeni", en: "New" } },
  { value: "review", label: { tr: "Inceleme", en: "In review" } },
  { value: "waiting", label: { tr: "Musteri bekleniyor", en: "Waiting on customer" } },
  { value: "quoted", label: { tr: "Teklif verildi", en: "Quoted" } },
  { value: "won", label: { tr: "Kazanildi", en: "Won" } },
  { value: "lost", label: { tr: "Kaybedildi", en: "Lost" } },
];

export const RFQ_PRIORITY_OPTIONS: Array<{ value: RfqPriority; label: Record<Locale, string> }> = [
  { value: "high", label: { tr: "Yuksek", en: "High" } },
  { value: "medium", label: { tr: "Orta", en: "Medium" } },
  { value: "low", label: { tr: "Dusuk", en: "Low" } },
];

export const RFQ_SORT_OPTIONS: Array<{ value: RfqSort; label: Record<Locale, string> }> = [
  { value: "newest", label: { tr: "En yeni", en: "Newest" } },
  { value: "due-date", label: { tr: "Teslim tarihi", en: "Due date" } },
  { value: "priority", label: { tr: "Oncelik", en: "Priority" } },
  { value: "status", label: { tr: "Durum", en: "Status" } },
];

export const RFQ_COPY: Record<Locale, {
  seo: { title: string; description: string };
  hero: { title: string; description: string; eyebrow: string; imageAlt: string };
  formTitle: string;
  formSubtitle: string;
  formCta: string;
  filtersTitle: string;
  tableTitle: string;
  exportLabel: string;
  exportSoon: string;
  searchPlaceholder: string;
  fields: {
    customer: string;
    rfqId: string;
    part: string;
    owner: string;
    dueDate: string;
    priority: string;
    status: string;
    volume: string;
    sopDate: string;
    link: string;
    notes: string;
  };
  emptyState: string;
  actions: { delete: string };
  storageNote: string;
}> = {
  tr: {
    seo: {
      title: "RFQ ve Teknik Sartname Ozeti | Proje Merkezi",
      description: "RFQ ve teknik sartname maddeleri icin lokal takip paneli.",
    },
    hero: {
      title: "RFQ / Teknik Sartname Ozeti",
      description:
        "Musteri RFQ ve teknik sartnameleri icin sahip, teslim tarihi ve oncelik odakli takip.",
      eyebrow: "Project Hub",
      imageAlt: "RFQ tracker",
    },
    formTitle: "Yeni RFQ satiri",
    formSubtitle: "Musteri, parca ve teklif detaylarini tek satirda topla.",
    formCta: "RFQ ekle",
    filtersTitle: "Filtreler ve siralama",
    tableTitle: "RFQ listesi",
    exportLabel: "Tabloyu disari aktar",
    exportSoon: "Cok yakinda",
    searchPlaceholder: "Musteri, parca, sahip veya not icinde ara",
    fields: {
      customer: "Musteri",
      rfqId: "RFQ / Proje kodu",
      part: "Parca / Sistem",
      owner: "Sahip",
      dueDate: "Teklif teslim",
      priority: "Oncelik",
      status: "Durum",
      volume: "Hedef adet",
      sopDate: "Hedef SOP",
      link: "Sartname linki",
      notes: "Notlar",
    },
    emptyState: "Henuz RFQ kaydi yok. Ustteki formdan yeni satir ekleyin.",
    actions: { delete: "Sil" },
    storageNote: "Veriler cihazinizda saklanir (localStorage).",
  },
  en: {
    seo: {
      title: "RFQ & Technical Spec Summary | Project Hub",
      description: "Local-first tracker for RFQs and technical specification summaries.",
    },
    hero: {
      title: "RFQ / Technical Spec Summary",
      description:
        "Track RFQs with owners, due dates, priorities, and quick links to spec documents.",
      eyebrow: "Project Hub",
      imageAlt: "RFQ tracker",
    },
    formTitle: "New RFQ entry",
    formSubtitle: "Capture customer, part, and quotation details in one row.",
    formCta: "Add RFQ",
    filtersTitle: "Filters and sorting",
    tableTitle: "RFQ list",
    exportLabel: "Export table",
    exportSoon: "Coming soon",
    searchPlaceholder: "Search customer, part, owner, or notes",
    fields: {
      customer: "Customer",
      rfqId: "RFQ / Project ID",
      part: "Part / System",
      owner: "Owner",
      dueDate: "Quote due",
      priority: "Priority",
      status: "Status",
      volume: "Target volume",
      sopDate: "Target SOP",
      link: "Spec link",
      notes: "Notes",
    },
    emptyState: "No RFQ entries yet. Add one using the form above.",
    actions: { delete: "Delete" },
    storageNote: "Data is stored on this device (localStorage).",
  },
};
