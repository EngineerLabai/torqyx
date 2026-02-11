import type { Locale } from "@/utils/locale";

type FieldCopy = {
  label: string;
  placeholder?: string;
};

type KaizenCopy = {
  badges: {
    title: string;
    beta: string;
  };
  title: string;
  description: string;
  basics: {
    title: string;
    reset: string;
    fields: {
      title: FieldCopy;
      area: FieldCopy;
    };
  };
  problem: {
    title: string;
    fields: {
      problem: FieldCopy;
      rootCause: FieldCopy;
      targetState: FieldCopy;
      metricsBefore: FieldCopy;
      metricsAfter: FieldCopy;
    };
  };
  gains: {
    title: string;
    fields: {
      gains: FieldCopy;
      risks: FieldCopy;
      lessons: FieldCopy;
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

export const kaizenCopy: Record<Locale, KaizenCopy> = {
  tr: {
    badges: {
      title: "Kaizen",
      beta: "Beta",
    },
    title: "Kaizen / Sürekli İyileştirme Kartı",
    description:
      'Küçük ama sürekli iyileştirmeleri hızlıca tanımla, aksiyonları sahiplen, sonuç ve kazanımları kaydet. Bu taslak; problem, hedef, aksiyon listesi ve "önce/sonra" metrikleri tek sayfada toplar.',
    basics: {
      title: "Temel Bilgiler",
      reset: "Formu temizle",
      fields: {
        title: {
          label: "Başlık / Kaizen adı",
          placeholder: "Örn: Operasyon 30 çevrim süresi iyileştirme",
        },
        area: {
          label: "Alan / Hat / Hücre",
          placeholder: "Örn: Hat B, Operasyon 30",
        },
      },
    },
    problem: {
      title: "Problem & Hedef",
      fields: {
        problem: {
          label: "Problem / Mevcut durum",
          placeholder:
            "Örn: Çevrim süresi ort. 54 sn, hedef 45 sn; darboğaz Operasyon 30, bekleme ve malzeme besleme eksik.",
        },
        rootCause: {
          label: "Kök neden (özet)",
          placeholder:
            "Örn: Besleme operatörü iki hatta bakıyor; malzeme arabası tasarımı çift yönlü değil; standart iş yok.",
        },
        targetState: {
          label: "Hedef durum",
          placeholder: "Örn: Çevrim süresi <= 45 sn, malzeme besleme gecikmesi sıfır, WIP dengeli.",
        },
        metricsBefore: {
          label: "Ölçülebilir metrikler (önce)",
          placeholder: "Örn: Çevrim ort 54 sn, OEE 68%, hurda %1.2, operatör adım sayısı 24.",
        },
        metricsAfter: {
          label: "Ölçülebilir metrikler (sonra)",
          placeholder: "Hedef/gerçekleşen: çevrim <=45 sn, OEE >=75%, hurda < %1, adım sayısı <=16.",
        },
      },
    },
    gains: {
      title: "Kazanımlar",
      fields: {
        gains: {
          label: "Beklenen / elde edilen kazanımlar",
          placeholder:
            "Örn: Çevrim -9 sn, hat kapasitesi +20%; ergonomi: eğilme hareketi %50 azaldı; stok alanı 3 paletten 1 palete indi; güvenlik: kesici uç koruyucu eklendi.",
        },
        risks: {
          label: "Riskler / engeller",
          placeholder:
            "Örn: Yeni arabaların tedarik süresi; operatör rotasyonu için eğitim süresi; bakım yükü artışı.",
        },
        lessons: {
          label: "Öğrenilmiş dersler",
          placeholder: "Örn: Malzeme akışının tek yönlü tasarımı çevrim süresini düşürdü; standart iş kartı şart.",
        },
      },
    },
    actions: {
      title: "Aksiyon Listesi",
      description: "Sahip, tarih ve durumla takip et. İstersen tamamlananları silmek için çöp kutusu.",
      add: "Aksiyon ekle",
      placeholders: {
        task: "Aksiyon (Örn: Malzeme arabası tek yönlü düzenle)",
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
        "Problem, kök neden ve hedef durum tanımlı mı?",
        '"Önce/sonra" metrikleri sayısal olarak yazıldı mı?',
        "Aksiyonlarda sahip, tarih ve durum bilgisi eksiksiz mi?",
        "Kazanımlar (SQDCM) ve öğrenilmiş dersler not edildi mi?",
        "Riskler ve engeller için B planı var mı?",
      ],
    },
  },
  en: {
    badges: {
      title: "Kaizen",
      beta: "Beta",
    },
    title: "Kaizen / Continuous Improvement Card",
    description:
      "Define small but continuous improvements, assign actions, and capture results and gains. This template gathers problem, target, action list, and before/after metrics on one page.",
    basics: {
      title: "Basics",
      reset: "Clear form",
      fields: {
        title: {
          label: "Title / Kaizen name",
          placeholder: "e.g. Operation 30 cycle time improvement",
        },
        area: {
          label: "Area / Line / Cell",
          placeholder: "e.g. Line B, Operation 30",
        },
      },
    },
    problem: {
      title: "Problem & Target",
      fields: {
        problem: {
          label: "Problem / current state",
          placeholder:
            "e.g. Cycle time avg 54 s, target 45 s; bottleneck at Operation 30 due to waiting and missing material feed.",
        },
        rootCause: {
          label: "Root cause (summary)",
          placeholder: "e.g. Feeder operator supports two lines; cart design is not two-way; no standard work.",
        },
        targetState: {
          label: "Target state",
          placeholder: "e.g. Cycle time <= 45 s, material feed delays at zero, WIP balanced.",
        },
        metricsBefore: {
          label: "Measurable metrics (before)",
          placeholder: "e.g. Cycle avg 54 s, OEE 68%, scrap 1.2%, operator steps 24.",
        },
        metricsAfter: {
          label: "Measurable metrics (after)",
          placeholder: "Target/actual: cycle <=45 s, OEE >=75%, scrap <1%, steps <=16.",
        },
      },
    },
    gains: {
      title: "Gains",
      fields: {
        gains: {
          label: "Expected / achieved gains",
          placeholder:
            "e.g. Cycle -9 s, line capacity +20%; ergonomics: bending motions down 50%; inventory space reduced from 3 pallets to 1; safety: blade guard added.",
        },
        risks: {
          label: "Risks / blockers",
          placeholder: "e.g. Lead time for new carts; training time for operator rotation; increased maintenance load.",
        },
        lessons: {
          label: "Lessons learned",
          placeholder: "e.g. One-way material flow design reduced cycle time; standard work sheet is required.",
        },
      },
    },
    actions: {
      title: "Action List",
      description: "Track owner, date, and status. Use the trash icon to remove completed rows.",
      add: "Add action",
      placeholders: {
        task: "Action (e.g. Redesign cart for one-way flow)",
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
        "Problem, root cause, and target state are defined.",
        "Before/after metrics are quantified.",
        "Actions include owner, date, and status.",
        "Gains (SQDCM) and lessons learned are recorded.",
        "Risks and blockers have a contingency plan.",
      ],
    },
  },
};
