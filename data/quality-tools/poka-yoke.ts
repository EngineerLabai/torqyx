import type { Locale } from "@/utils/locale";

type FieldCopy = {
  label: string;
  placeholder?: string;
};

type OptionCopy = {
  value: string;
  label: string;
};

type PokaYokeCopy = {
  badges: {
    title: string;
    subtitle: string;
    beta: string;
  };
  title: string;
  description: string;
  basics: {
    title: string;
    reset: string;
    fields: {
      title: FieldCopy;
      process: FieldCopy;
      station: FieldCopy;
      part: FieldCopy;
      owner: FieldCopy;
      date: FieldCopy;
    };
  };
  problem: {
    title: string;
    fields: {
      problem: FieldCopy;
      failureMode: FieldCopy;
      currentControl: FieldCopy;
      severity: FieldCopy;
      occurrence: FieldCopy;
      detection: FieldCopy;
    };
  };
  idea: {
    title: string;
    fields: {
      idea: FieldCopy;
      expectedEffect: FieldCopy;
      feasibility: FieldCopy;
      cost: FieldCopy;
      risk: FieldCopy;
      validation: FieldCopy;
    };
    ideaType: {
      label: string;
      options: OptionCopy[];
    };
    principle: {
      label: string;
      options: OptionCopy[];
    };
  };
  actions: {
    title: string;
    description: string;
    add: string;
    placeholders: {
      task: string;
      owner: string;
      due: string;
    };
    removeTitle: string;
  };
  status: {
    planned: string;
    inProgress: string;
    done: string;
  };
  checklist: {
    title: string;
    items: string[];
  };
};

export const pokaYokeCopy: Record<Locale, PokaYokeCopy> = {
  tr: {
    badges: {
      title: "Poka-Yoke",
      subtitle: "Hata Önleme",
      beta: "Beta",
    },
    title: "Poka-Yoke Fikir Kartı",
    description:
      "Hata önleyici fikirlerini tanımla, tipini belirle (önleyici/algılayıcı/uyarıcı), uygulanabilirliğini ve beklenen etkiyi yaz, aksiyonlarla takip et. Basit bir onay ve doğrulama planı için temel alanlar içerir.",
    basics: {
      title: "Temel Bilgiler",
      reset: "Formu temizle",
      fields: {
        title: {
          label: "Fikir / Proje adı",
          placeholder: "Örn: Yanlış parça montajını fiziksel kılavuzla engelleme",
        },
        process: {
          label: "Proses / Hat",
          placeholder: "Örn: Montaj Hattı B",
        },
        station: {
          label: "İstasyon",
          placeholder: "Örn: İstasyon 12",
        },
        part: {
          label: "Ürün / Parça kodu",
          placeholder: "Örn: ABC123-04",
        },
        owner: {
          label: "Hazırlayan / Sorumlu",
          placeholder: "İsim / departman",
        },
        date: {
          label: "Tarih",
          placeholder: "GG.AA.YYYY",
        },
      },
    },
    problem: {
      title: "Problem ve Hata Modu",
      fields: {
        problem: {
          label: "Problem / şikayet",
          placeholder: "Örn: Yanlış yönlü montaj, müşteri montajında takılma; hata PPM: 12.000.",
        },
        failureMode: {
          label: "Hata modu (FMEA referansı)",
          placeholder: "Örn: Yanlış yön montaj (FM-12); etkisi: sahada montaj yapılamıyor.",
        },
        currentControl: {
          label: "Mevcut kontrol / tespit noktası",
          placeholder: "Örn: Operatör görsel kontrol; hat sonu %10 örnekleme.",
        },
        severity: { label: "Şiddet (S)", placeholder: "Örn: 8" },
        occurrence: { label: "Olasılık (O)", placeholder: "Örn: 6" },
        detection: { label: "Tespit (D)", placeholder: "Örn: 6" },
      },
    },
    idea: {
      title: "Poka-Yoke Fikri",
      fields: {
        idea: {
          label: "Fikir / çözüm",
          placeholder:
            "Örn: Parça yönünü kılavuzlayan simetrik olmayan fikstür + pin; doğru yön dışında parça oturmuyor.",
        },
        expectedEffect: {
          label: "Beklenen etki",
          placeholder: "Örn: Yanlış yön montajını fiziksel olarak engelle; hedef O=2, D=3; PPM < 100.",
        },
        feasibility: {
          label: "Uygulanabilirlik / kaynak",
          placeholder:
            "Örn: Mevcut fikstüre ek parça; CNC işleme 2 saat; montaj 30 dk; bakım desteği gerekiyor.",
        },
        cost: {
          label: "Maliyet / süre",
          placeholder: "Örn: Parça maliyeti 120 USD, işçilik 2 saat; devreye alma hedefi 10.01.2026.",
        },
        risk: {
          label: "Riskler / yan etkiler",
          placeholder: "Örn: Yanlış pozisyonda sıkışma riski; çevrim süresinde +2 sn artış olabilir.",
        },
        validation: {
          label: "Doğrulama planı",
          placeholder: "Örn: 3 vardiya pilot; 0 hata ve doğru yönden başka montaj imkansız testi; bakım onayı.",
        },
      },
      ideaType: {
        label: "Tip",
        options: [
          { value: "prevention", label: "Önleyici" },
          { value: "detection", label: "Algılayıcı" },
          { value: "warning", label: "Uyarı" },
        ],
      },
      principle: {
        label: "Prensip / yöntem",
        options: [
          { value: "physicalGuide", label: "Fiziksel kılavuz / geometri" },
          { value: "interlock", label: "Kilitleme / zorlama" },
          { value: "sensor", label: "Sensör (foto, proximity, switch)" },
          { value: "counter", label: "Sayaç / sekans kontrol" },
          { value: "labelColor", label: "Renk/etiketleme" },
        ],
      },
    },
    actions: {
      title: "Aksiyon Listesi",
      description: "Sahip, tarih ve durum ile takip et. Satır ekle/sil ile listeyi daralt ya da genişlet.",
      add: "Aksiyon ekle",
      placeholders: {
        task: "Aksiyon (Örn: Kılavuz pimi tasarla ve üret)",
        owner: "Sorumlu",
        due: "Hedef tarih",
      },
      removeTitle: "Satırı sil",
    },
    status: {
      planned: "Planlandı",
      inProgress: "Devam ediyor",
      done: "Tamamlandı",
    },
    checklist: {
      title: "Hızlı Kontrol Listesi",
      items: [
        "Hata modu, mevcut kontrol ve FMEA dereceleri (S/O/D) yazıldı mı?",
        "Poka-yoke tipi ve prensibi net mi (önleyici/algılayıcı/uyarıcı)?",
        "Beklenen etki (hedef S/O/D veya PPM) belirtildi mi?",
        "Uygulanabilirlik, maliyet ve riskler kaydedildi mi?",
        "Doğrulama planı ve aksiyon sorumluları atanmış mı?",
      ],
    },
  },
  en: {
    badges: {
      title: "Poka-Yoke",
      subtitle: "Error Proofing",
      beta: "Beta",
    },
    title: "Poka-Yoke Idea Card",
    description:
      "Define error-proofing ideas, choose the type (prevention/detection/warning), capture feasibility and expected impact, and track actions. Includes basic approval and validation fields.",
    basics: {
      title: "Basics",
      reset: "Clear form",
      fields: {
        title: {
          label: "Idea / Project name",
          placeholder: "e.g. Prevent wrong-part assembly with a physical guide",
        },
        process: {
          label: "Process / Line",
          placeholder: "e.g. Assembly Line B",
        },
        station: {
          label: "Station",
          placeholder: "e.g. Station 12",
        },
        part: {
          label: "Product / Part code",
          placeholder: "e.g. ABC123-04",
        },
        owner: {
          label: "Prepared by / Owner",
          placeholder: "Name / department",
        },
        date: {
          label: "Date",
          placeholder: "MM/DD/YYYY",
        },
      },
    },
    problem: {
      title: "Problem and Failure Mode",
      fields: {
        problem: {
          label: "Problem / complaint",
          placeholder: "e.g. Wrong orientation assembly, customer cannot fit; defect PPM: 12,000.",
        },
        failureMode: {
          label: "Failure mode (FMEA reference)",
          placeholder: "e.g. Wrong orientation assembly (FM-12); effect: cannot assemble in the field.",
        },
        currentControl: {
          label: "Current control / detection point",
          placeholder: "e.g. Operator visual check; end-of-line 10% sampling.",
        },
        severity: { label: "Severity (S)", placeholder: "e.g. 8" },
        occurrence: { label: "Occurrence (O)", placeholder: "e.g. 6" },
        detection: { label: "Detection (D)", placeholder: "e.g. 6" },
      },
    },
    idea: {
      title: "Poka-Yoke Idea",
      fields: {
        idea: {
          label: "Idea / solution",
          placeholder: "e.g. Asymmetric fixture + pin to guide part orientation; part cannot sit in the wrong direction.",
        },
        expectedEffect: {
          label: "Expected effect",
          placeholder: "e.g. Physically prevent wrong orientation; target O=2, D=3; PPM < 100.",
        },
        feasibility: {
          label: "Feasibility / resources",
          placeholder:
            "e.g. Add-on to existing fixture; CNC machining 2 hours; assembly 30 min; maintenance support required.",
        },
        cost: {
          label: "Cost / timeline",
          placeholder: "e.g. Part cost 120 USD, labor 2 hours; go-live target 01/10/2026.",
        },
        risk: {
          label: "Risks / side effects",
          placeholder: "e.g. Risk of jamming in wrong position; cycle time may increase by +2 s.",
        },
        validation: {
          label: "Validation plan",
          placeholder: "e.g. 3-shift pilot; zero defects and only-correct-orientation test; maintenance sign-off.",
        },
      },
      ideaType: {
        label: "Type",
        options: [
          { value: "prevention", label: "Prevention" },
          { value: "detection", label: "Detection" },
          { value: "warning", label: "Warning" },
        ],
      },
      principle: {
        label: "Principle / method",
        options: [
          { value: "physicalGuide", label: "Physical guide / geometry" },
          { value: "interlock", label: "Interlock / constraint" },
          { value: "sensor", label: "Sensor (photo, proximity, switch)" },
          { value: "counter", label: "Counter / sequence control" },
          { value: "labelColor", label: "Color / labeling" },
        ],
      },
    },
    actions: {
      title: "Action List",
      description: "Track owner, date, and status. Add or remove rows as needed.",
      add: "Add action",
      placeholders: {
        task: "Action (e.g. Design and machine guide pin)",
        owner: "Owner",
        due: "Target date",
      },
      removeTitle: "Delete row",
    },
    status: {
      planned: "Planned",
      inProgress: "In progress",
      done: "Completed",
    },
    checklist: {
      title: "Quick Checklist",
      items: [
        "Failure mode, current control, and FMEA ratings (S/O/D) are recorded.",
        "Poka-yoke type and principle are clear (prevention/detection/warning).",
        "Expected effect (target S/O/D or PPM) is stated.",
        "Feasibility, cost, and risks are documented.",
        "Validation plan and action owners are assigned.",
      ],
    },
  },
};
