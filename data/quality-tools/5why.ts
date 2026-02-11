import type { Locale } from "@/utils/locale";

type FiveWhyCopy = {
  badge: string;
  badgeSub: string;
  title: string;
  description: string;
  formTitle: string;
  reset: string;
  problemLabel: string;
  problemPlaceholder: string;
  stepTitle: string;
  stepLabel: string;
  stepPlaceholderFirst: string;
  stepPlaceholderNext: string;
  actionLabel: string;
  actionPlaceholder: string;
  note: string;
  summary: {
    title: string;
    empty: string;
    problemLabel: string;
    chainTitle: string;
    rootCauseTitle: string;
    actionsTitle: string;
  };
  tips: string[];
  classification: {
    human: string;
    process: string;
    design: string;
    material: string;
    other: string;
  };
};

export const fiveWhyCopy: Record<Locale, FiveWhyCopy> = {
  tr: {
    badge: "Kalite Aracı",
    badgeSub: "5 Why · Kök Neden Analizi",
    title: "5 Why - Kök Neden Analizi Formu",
    description:
      'Tekrarlayan kalite problemleri için, problemi 5 kez "Neden?" sorusuyla derinleştirerek kök nedeni bulmaya yardımcı olur. Solda problem ve 5 adet "Neden?" sorusunu doldur, sağda kök neden özeti ve aksiyon yorumları otomatik oluşsun.',
    formTitle: 'Problem ve 5 Adım "Neden?" Zinciri',
    reset: "Formu Temizle",
    problemLabel: "Problem Tanımı (1-2 cümle)",
    problemPlaceholder:
      "Örn. Müşteri, ön süspansiyon bağlantısından gelen tıkırtı sesi şikayeti bildiriyor. Araç 15.000 km civarında, soğuk havalarda ses artıyor.",
    stepTitle: "{index}. Neden?",
    stepLabel: '{index}. "Neden?" sorusunun cevabı',
    stepPlaceholderFirst: "Örn. Çünkü bağlantı cıvatası zamanla gevşiyor...",
    stepPlaceholderNext: "Örn. Çünkü montaj torku her zaman hedef değere ulaşmıyor...",
    actionLabel: "Bu nedene yönelik olası aksiyon / not",
    actionPlaceholder:
      "Örn. Tork anahtarlarının periyodik kalibrasyonunu artırmak, operatör eğitimini güncellemek...",
    note:
      "Not: Gerçek hayatta her zaman tam olarak 5 adım gerekmez; bazı problemler 3-4 adımda kök nedene ulaşırken, bazı durumlarda 5 adım bile yetmeyebilir. Buradaki amaç, düşünce zincirini kayıt altına almak ve tekrar eden hataları önlemektir.",
    summary: {
      title: "Kök Neden Özeti",
      empty:
        'Soldaki problem ve "Neden?" adımlarını doldurdukça burada olası kök neden özeti ve aksiyon önerileri görünecektir. Bu özet, 8D raporunun kök neden ve düzeltici aksiyon adımlarına doğrudan taşınabilir.',
      problemLabel: "Problem:",
      chainTitle: "Neden zinciri (özet):",
      rootCauseTitle: "Olası kök neden:",
      actionsTitle: "Aksiyon fikirleri (özet):",
    },
    tips: [
      "Kök neden olarak belirlediğiniz cümleyi, 8D raporunun D4 (kök neden analizi) bölümüne doğrudan taşıyabilirsiniz.",
      "Aksiyon fikirlerinden seçtiklerinizi D5 (kalıcı düzeltici aksiyon) tablosuna dönüştürmek, tekrar oluşum ihtimalini azaltacaktır.",
      'Eğer neden zincirinde sıkça "operatör hatası" geçiyorsa, sistem/ekipman tasarımını (Poka-Yoke) gözden geçirmek gerekir.',
    ],
    classification: {
      human: "İnsan / Operatör ilişkili kök neden",
      process: "Proses / Talimat kaynaklı kök neden",
      design: "Tasarım / Fikstür kaynaklı kök neden",
      material: "Malzeme / Kaplama ilişkili kök neden",
      other: "Genel kök neden (sınıflandırma yapılamadı)",
    },
  },
  en: {
    badge: "Quality Tool",
    badgeSub: "5 Why · Root Cause Analysis",
    title: "5 Why - Root Cause Analysis Form",
    description:
      'For recurring quality problems, ask "Why?" up to five times to drill down to root cause. Fill in the problem and 5 Why answers on the left; a root cause summary and action notes will appear on the right.',
    formTitle: 'Problem and 5-step "Why?" chain',
    reset: "Clear form",
    problemLabel: "Problem statement (1-2 sentences)",
    problemPlaceholder:
      "e.g. Customer reports a rattling noise from the front suspension joint. Vehicle around 15,000 km; noise increases in cold weather.",
    stepTitle: "{index}. Why?",
    stepLabel: 'Answer to the {index}. "Why?" question',
    stepPlaceholderFirst: "e.g. Because the mounting bolt loosens over time...",
    stepPlaceholderNext: "e.g. Because assembly torque does not always reach the target value...",
    actionLabel: "Possible action / note for this cause",
    actionPlaceholder: "e.g. Increase torque tool calibration frequency, update operator training...",
    note: "Note: In practice you may need fewer or more than five steps; the goal is to capture the reasoning chain and prevent repeat issues.",
    summary: {
      title: "Root Cause Summary",
      empty:
        'As you fill the problem and "Why?" steps on the left, a root cause summary and action ideas will appear here. This summary can be transferred directly into 8D root cause and corrective action steps.',
      problemLabel: "Problem:",
      chainTitle: "Why chain (summary):",
      rootCauseTitle: "Likely root cause:",
      actionsTitle: "Action ideas (summary):",
    },
    tips: [
      "You can copy the root cause statement into the 8D D4 (Root Cause Analysis) section.",
      "Selected actions can be converted into 8D D5 (Permanent Corrective Action) items.",
      'If the chain often points to "operator error", review system/fixture design (Poka-Yoke).',
    ],
    classification: {
      human: "Human / operator-related root cause",
      process: "Process / standard-related root cause",
      design: "Design / fixture-related root cause",
      material: "Material / coating-related root cause",
      other: "General root cause (not classified)",
    },
  },
};
