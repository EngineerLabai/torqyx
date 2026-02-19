import type { Locale } from "@/utils/locale";

export type QualityReportActionsCopy = {
  demoFill: string;
  save: string;
  manage: string;
  exportPdf: string;
  reset: string;
  saveModalTitle: string;
  saveTitleLabel: string;
  saveTitlePlaceholder: string;
  saveConfirm: string;
  cancel: string;
  close: string;
  manageTitle: string;
  emptySaved: string;
  load: string;
  rename: string;
  remove: string;
  exportJson: string;
  createdAt: string;
  updatedAt: string;
  renamePrompt: string;
  deleteConfirm: string;
  saveSuccess: string;
  loadSuccess: string;
  removeSuccess: string;
  renameSuccess: string;
  exportPdfError: string;
};

export const qualityReportActionsCopy: Record<Locale, QualityReportActionsCopy> = {
  tr: {
    demoFill: "Örnek Veri Doldur",
    save: "Kaydet",
    manage: "Kayıtları Yönet",
    exportPdf: "PDF İndir",
    reset: "Sıfırla",
    saveModalTitle: "Raporu Kaydet",
    saveTitleLabel: "Kayıt Başlığı",
    saveTitlePlaceholder: "Örn: Pres Hattı 5 Why - Vardiya A",
    saveConfirm: "Kaydet",
    cancel: "Vazgeç",
    close: "Kapat",
    manageTitle: "Kayıtlı Raporlar",
    emptySaved: "Henüz kayıt bulunmuyor.",
    load: "Yükle",
    rename: "Yeniden Adlandır",
    remove: "Sil",
    exportJson: "JSON İndir",
    createdAt: "Oluşturulma",
    updatedAt: "Güncelleme",
    renamePrompt: "Yeni başlığı girin",
    deleteConfirm: "Bu kaydı silmek istediğinize emin misiniz?",
    saveSuccess: "Kayıt oluşturuldu.",
    loadSuccess: "Kayıt yüklendi.",
    removeSuccess: "Kayıt silindi.",
    renameSuccess: "Kayıt adı güncellendi.",
    exportPdfError: "PDF dışa aktarma sırasında hata oluştu.",
  },
  en: {
    demoFill: "Fill Demo Data",
    save: "Save",
    manage: "Manage Saved",
    exportPdf: "Export PDF",
    reset: "Reset",
    saveModalTitle: "Save Report",
    saveTitleLabel: "Report Title",
    saveTitlePlaceholder: "e.g. Press Line 5 Why - Shift A",
    saveConfirm: "Save",
    cancel: "Cancel",
    close: "Close",
    manageTitle: "Saved Reports",
    emptySaved: "No saved reports yet.",
    load: "Load",
    rename: "Rename",
    remove: "Delete",
    exportJson: "Export JSON",
    createdAt: "Created",
    updatedAt: "Updated",
    renamePrompt: "Enter new title",
    deleteConfirm: "Are you sure you want to delete this record?",
    saveSuccess: "Record saved.",
    loadSuccess: "Record loaded.",
    removeSuccess: "Record deleted.",
    renameSuccess: "Record renamed.",
    exportPdfError: "PDF export failed.",
  },
};
