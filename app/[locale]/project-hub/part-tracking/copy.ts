import type { Locale } from "@/utils/locale";

export type RevisionStatus = "open" | "review" | "approved" | "released" | "closed";
export type RevisionPriority = "low" | "medium" | "high";
export type RevisionSort = "newest" | "due-date" | "priority" | "status";

export const REVISION_STATUS_OPTIONS: Array<{ value: RevisionStatus; label: Record<Locale, string> }> = [
  { value: "open", label: { tr: "Acik", en: "Open" } },
  { value: "review", label: { tr: "Inceleme", en: "Review" } },
  { value: "approved", label: { tr: "Onaylandi", en: "Approved" } },
  { value: "released", label: { tr: "Yayinlandi", en: "Released" } },
  { value: "closed", label: { tr: "Kapandi", en: "Closed" } },
];

export const REVISION_PRIORITY_OPTIONS: Array<{ value: RevisionPriority; label: Record<Locale, string> }> = [
  { value: "high", label: { tr: "Yuksek", en: "High" } },
  { value: "medium", label: { tr: "Orta", en: "Medium" } },
  { value: "low", label: { tr: "Dusuk", en: "Low" } },
];

export const REVISION_SORT_OPTIONS: Array<{ value: RevisionSort; label: Record<Locale, string> }> = [
  { value: "newest", label: { tr: "En yeni", en: "Newest" } },
  { value: "due-date", label: { tr: "Teslim tarihi", en: "Due date" } },
  { value: "priority", label: { tr: "Oncelik", en: "Priority" } },
  { value: "status", label: { tr: "Durum", en: "Status" } },
];

export const REVISION_COPY: Record<Locale, {
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
    partCode: string;
    revision: string;
    change: string;
    owner: string;
    dueDate: string;
    priority: string;
    status: string;
    link: string;
    notes: string;
  };
  emptyState: string;
  actions: { delete: string };
  storageNote: string;
}> = {
  tr: {
    seo: {
      title: "Parca ve Revizyon Takip | Proje Merkezi",
      description: "Parca revizyonlari icin lokal takip paneli.",
    },
    hero: {
      title: "Parca / Revizyon Takip Panosu",
      description:
        "Revizyon ve degisiklikleri sahip, oncelik ve teslim tarihine gore yonetin.",
      eyebrow: "Project Hub",
      imageAlt: "Revision tracker",
    },
    formTitle: "Yeni revizyon kaydi",
    formSubtitle: "Parca kodu, revizyon ve degisiklik bilgisini tek satirda tutun.",
    formCta: "Kaydi ekle",
    filtersTitle: "Filtreler ve siralama",
    tableTitle: "Revizyon listesi",
    exportLabel: "Tabloyu disari aktar",
    exportSoon: "Cok yakinda",
    searchPlaceholder: "Parca, sahip veya not icinde ara",
    fields: {
      partCode: "Parca kodu",
      revision: "Revizyon",
      change: "Degisiklik nedeni",
      owner: "Sahip",
      dueDate: "Hedef tarih",
      priority: "Oncelik",
      status: "Durum",
      link: "Dokuman linki",
      notes: "Notlar",
    },
    emptyState: "Henuz revizyon kaydi yok. Ustteki formdan yeni kayit ekleyin.",
    actions: { delete: "Sil" },
    storageNote: "Veriler cihazinizda saklanir (localStorage).",
  },
  en: {
    seo: {
      title: "Part & Revision Tracker | Project Hub",
      description: "Local-first tracker for part revisions and change control.",
    },
    hero: {
      title: "Part / Revision Tracker",
      description:
        "Manage revisions and change control with owners, priorities, and due dates.",
      eyebrow: "Project Hub",
      imageAlt: "Revision tracker",
    },
    formTitle: "New revision entry",
    formSubtitle: "Capture part code, revision, and change reason in one row.",
    formCta: "Add entry",
    filtersTitle: "Filters and sorting",
    tableTitle: "Revision list",
    exportLabel: "Export table",
    exportSoon: "Coming soon",
    searchPlaceholder: "Search part, owner, or notes",
    fields: {
      partCode: "Part code",
      revision: "Revision",
      change: "Change reason",
      owner: "Owner",
      dueDate: "Due date",
      priority: "Priority",
      status: "Status",
      link: "Document link",
      notes: "Notes",
    },
    emptyState: "No revision entries yet. Add one using the form above.",
    actions: { delete: "Delete" },
    storageNote: "Data is stored on this device (localStorage).",
  },
};
