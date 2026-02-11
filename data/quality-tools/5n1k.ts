import type { Locale } from "@/utils/locale";

type FieldCopy = {
  label: string;
  placeholder?: string;
};

type InlineNoteCopy = {
  prefix: string;
  link: string;
  suffix: string;
};

type FiveN1kCopy = {
  badge: string;
  badgeSub: string;
  title: string;
  description: string;
  formTitle: string;
  buttons: {
    save: string;
    clear: string;
  };
  saveErrorEmpty: string;
  fields: {
    what: FieldCopy;
    where: FieldCopy;
    when: FieldCopy;
    who: FieldCopy;
    why: FieldCopy;
    how: FieldCopy;
  };
  sessionNote: InlineNoteCopy;
  summary: {
    title: string;
    empty: string;
    labels: {
      what: string;
      where: string;
      when: string;
      who: string;
      why: string;
      how: string;
    };
    oneLine: {
      title: string;
      empty: string;
      prefixes: {
        where: string;
        when: string;
        who: string;
        why: string;
        how: string;
      };
    };
  };
  summaryTips: string[];
  saved: {
    title: string;
    searchPlaceholder: string;
    empty: string;
    metaTemplate: string;
    emptyValue: string;
  };
  premium: InlineNoteCopy & {
    title: string;
    pdf: string;
    excel: string;
  };
};

export const fiveN1kCopy: Record<Locale, FiveN1kCopy> = {
  tr: {
    badge: "Kalite Aracı",
    badgeSub: "5N1K · Problem Tanımlama",
    title: "5N1K - Problem Tanımlama Formu",
    description:
      "Kalite problemi, müşteri şikayeti veya üretim hattı uygunsuzluğunu netleştirmek için 5N1K sorularını doldur. Aşağıdaki alanlara girdikçe sağ tarafta otomatik olarak kısa bir problem özeti oluşur. Bu özet daha sonra 8D, 5 Why ve FMEA çalışmalarında giriş verisi olarak kullanılabilir.",
    formTitle: "5N1K Giriş Alanları",
    buttons: {
      save: "Kaydet",
      clear: "Formu Temizle",
    },
    saveErrorEmpty: "Kaydedilecek problem özeti yok. Lütfen alanları doldurun.",
    fields: {
      what: {
        label: "Ne? (What) - Problem nedir?",
        placeholder: "Örn. Ön sağ amortisör bağlantı cıvatasında gevşeme şikayeti...",
      },
      where: {
        label: "Nerede? (Where)",
        placeholder: "Örn. Montaj hattı 2, istasyon 4 / saha aracı, Avrupa pazarı...",
      },
      when: {
        label: "Ne zaman? (When)",
        placeholder: "Örn. Soğuk havalarda, 10.000 km sonrası, son 3 ay içinde...",
      },
      who: {
        label: "Kim? (Who)",
        placeholder: "Örn. Araç kullanıcısı, montaj operatörü, kalite kontrol, bayi teknik ekibi...",
      },
      why: {
        label: "Neden? (Why) - İlk tahmin / hipotez",
        placeholder: "Örn. Tork değerinin düşük olması, uygun olmayan rondela kullanımı, hatalı fikstür konumlandırması...",
      },
      how: {
        label: "Nasıl? (How) - Problem nasıl ortaya çıkıyor?",
        placeholder: "Örn. Araç darbeye maruz kaldığında, belirli tork altında, belirli hız/sıcaklık koşullarında...",
      },
    },
    sessionNote: {
      prefix:
        "Not: Buraya girilen bilgiler yalnızca bu tarayıcı oturumunda saklanır. Gelecekte PDF/Excel çıktısı ve hesap açarak kayıt tutma özellikleri premium paket planında. Ödeme yok,",
      link: "bekleme listesi açık",
      suffix: ".",
    },
    summary: {
      title: "Problem Özeti (5N1K)",
      empty:
        "Soldaki alanları doldurdukça burada otomatik olarak kısa bir problem özeti oluşacaktır. Bu özet; 8D raporu, 5 Why analizi ve FMEA çalışmalarında doğrudan kullanılabilecek şekilde kurgulanmıştır.",
      labels: {
        what: "Ne?",
        where: "Nerede?",
        when: "Ne zaman?",
        who: "Kim?",
        why: "İlk tahmin (Neden?)",
        how: "Nasıl ortaya çıkıyor?",
      },
      oneLine: {
        title: "Kısa Problem Tanımı (tek satır)",
        empty: "Problem tanımı henüz tamamlanmamış.",
        prefixes: {
          where: "Konum",
          when: "Zaman",
          who: "İlgili",
          why: "İlk tahmin",
          how: "Ortaya çıkış şekli",
        },
      },
    },
    summaryTips: [
      "Bu özet, 8D'nin D2 (Problem Tanımı) ve D3 (Geçici Önlem) adımlarına temel oluşturabilir.",
      'Aynı problem için 5 Why analizine geçtiğinde, buradaki "Ne?" ve "Neden?" cümleleri başlangıç noktası olarak kullanılabilir.',
    ],
    saved: {
      title: "Kaydedilen Problem Özetleri",
      searchPlaceholder: "Özetlerde ara...",
      empty: "Henüz kaydedilmiş problem özeti yok veya filtreye uyan sonuç bulunamadı.",
      metaTemplate: "Ne: {what} · Nerede: {where} · Ne zaman: {when} · Kim: {who}",
      emptyValue: "-",
    },
    premium: {
      title: "PDF / Excel'e Aktar - Premium (bekleme listesi)",
      prefix:
        "5N1K problem tanımlama kayıtlarını PDF veya Excel olarak dışa aktarma ve ekiplerle paylaşma özelliği premium paket planında. Ödeme yok,",
      link: "bekleme listesi açık",
      suffix: ".",
      pdf: "PDF'e Aktar (Premium)",
      excel: "Excel'e Aktar (Premium)",
    },
  },
  en: {
    badge: "Quality Tool",
    badgeSub: "5W1H · Problem Definition",
    title: "5W1H - Problem Definition Form",
    description:
      "Use 5W1H questions to clarify a quality issue, customer complaint, or line nonconformity. As you fill the fields below, a short problem summary is generated on the right. This summary can feed into 8D, 5 Why, and FMEA work.",
    formTitle: "5W1H Input Fields",
    buttons: {
      save: "Save",
      clear: "Clear form",
    },
    saveErrorEmpty: "Nothing to save yet. Please fill in the fields.",
    fields: {
      what: {
        label: "What? - What is the problem?",
        placeholder: "e.g. Front right shock absorber mounting bolt loosens in the field...",
      },
      where: {
        label: "Where? (Location)",
        placeholder: "e.g. Assembly line 2, station 4 / customer vehicle, EU market...",
      },
      when: {
        label: "When? (Timing)",
        placeholder: "e.g. In cold weather, after 10,000 km, within the last 3 months...",
      },
      who: {
        label: "Who? (Stakeholders)",
        placeholder: "e.g. Vehicle owner, assembly operator, quality inspector, dealer service team...",
      },
      why: {
        label: "Why? - Initial hypothesis",
        placeholder: "e.g. Low torque value, incorrect washer, fixture misalignment...",
      },
      how: {
        label: "How? - How does the problem appear?",
        placeholder: "e.g. Occurs under impact load, below a torque threshold, or at specific speed/temperature conditions...",
      },
    },
    sessionNote: {
      prefix:
        "Note: The information entered here is stored only in this browser session. PDF/Excel export and account-based saving are planned for the premium package. No payment required,",
      link: "waitlist is open",
      suffix: ".",
    },
    summary: {
      title: "Problem Summary (5W1H)",
      empty:
        "As you fill the fields on the left, a short problem summary will appear here. This summary is designed to feed directly into 8D, 5 Why, and FMEA work.",
      labels: {
        what: "What?",
        where: "Where?",
        when: "When?",
        who: "Who?",
        why: "Initial hypothesis (Why?)",
        how: "How does it occur?",
      },
      oneLine: {
        title: "Short Problem Statement (one line)",
        empty: "Problem statement is not complete yet.",
        prefixes: {
          where: "Location",
          when: "Time",
          who: "Stakeholder",
          why: "Initial hypothesis",
          how: "Occurrence pattern",
        },
      },
    },
    summaryTips: [
      "This summary can feed 8D D2 (Problem Description) and D3 (Containment) steps.",
      'When moving to a 5 Why analysis, the "What?" and "Why?" lines here can serve as the starting point.',
    ],
    saved: {
      title: "Saved Problem Summaries",
      searchPlaceholder: "Search summaries...",
      empty: "No saved summaries yet or no matches found.",
      metaTemplate: "What: {what} · Where: {where} · When: {when} · Who: {who}",
      emptyValue: "-",
    },
    premium: {
      title: "Export to PDF / Excel - Premium (waitlist)",
      prefix:
        "Export 5W1H problem definitions to PDF or Excel and share them with your team. No payment required,",
      link: "waitlist is open",
      suffix: ".",
      pdf: "Export to PDF (Premium)",
      excel: "Export to Excel (Premium)",
    },
  },
};
