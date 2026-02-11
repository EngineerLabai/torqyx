import type { Locale } from "@/utils/locale";

type FieldCopy = {
  label: string;
  placeholder?: string;
};

type EightDStepCopy = {
  id: string;
  title: string;
  subtitle?: string;
  guidance: string[];
  placeholder: string;
};

type EightDCopy = {
  badges: {
    report: string;
    level: string;
    beta: string;
  };
  title: string;
  description: string;
  caseTitle: string;
  fields: {
    caseId: FieldCopy;
    customer: FieldCopy;
    product: FieldCopy;
    lot: FieldCopy;
    owner: FieldCopy;
    team: FieldCopy;
    startDate: FieldCopy;
    targetDate: FieldCopy;
  };
  guidanceTitle: string;
  steps: EightDStepCopy[];
  checklist: {
    title: string;
    description: string;
    reset: string;
    items: string[];
  };
};

export const eightDCopy: Record<Locale, EightDCopy> = {
  tr: {
    badges: {
      report: "8D Raporu",
      level: "İleri seviye",
      beta: "Beta",
    },
    title: "8D Rapor İskeleti (Etkileşimli Taslak)",
    description:
      "Müşteri şikayetleri ve kritik uygunsuzluklar için 8D adımlarını yapılandırılmış şekilde doldur. Geçici/kalıcı aksiyonları, kök neden analizini ve yayılım planını aynı dosyada sakla. PDF/Word çıktısı gelecekte eklenecek.",
    caseTitle: "Vaka Temel Bilgileri",
    fields: {
      caseId: { label: "Vaka / Şikayet No", placeholder: "Örn: Q-2025-118" },
      customer: { label: "Müşteri / İç kaynak", placeholder: "Örn: OEM X, İç Denetim" },
      product: { label: "Ürün / Referans", placeholder: "Örn: ABC123, Rev.05" },
      lot: { label: "Lot / Seri", placeholder: "Örn: 24B-17" },
      owner: { label: "Sorumlu (Owner)", placeholder: "İsim / departman" },
      team: { label: "Ekip", placeholder: "İsimler ve fonksiyonlar" },
      startDate: { label: "Başlangıç tarihi", placeholder: "GG.AA.YYYY" },
      targetDate: { label: "Hedef kapanış tarihi", placeholder: "GG.AA.YYYY" },
    },
    guidanceTitle: "Doldururken düşün:",
    steps: [
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
          "İç proses için kontrol artırma (ek ölçüm, poka-yoke devreye alma).",
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
          "Aksiyon: Matkap takım ömrü 2.000 adet → 1.200 adete indirilecek; otomatik sayaçlı takım değişimi. PFMEA & CP revizyonu. Doğrulama: 3 lot pilot, Cpk >= 1.33; MSA tekrarlanacak. Hedef: 22.12.2025, sorumlu: E. Şahin.",
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
    ],
    checklist: {
      title: "Hızlı Kontrol Listesi",
      description: "Raporu gönderirken aşağıdakileri gözden geçir.",
      reset: "Formu temizle",
      items: [
        "D0 ve D3 aksiyonlarında kapsam, tarih ve sorumlu tanımlı mı?",
        "D4 kök neden + kaçış nedeni doğrulaması kayıtlı mı?",
        "D5 kalıcı aksiyonların doğrulama planı (D6) açık mı?",
        "Benzer ürün/hatlar için yayılım (D7) planlandı mı?",
        "Onay alanları (Müşteri/İç) ve ölçütler güncel mi?",
      ],
    },
  },
  en: {
    badges: {
      report: "8D Report",
      level: "Advanced",
      beta: "Beta",
    },
    title: "8D Report Skeleton (Interactive Draft)",
    description:
      "Fill out 8D steps for customer complaints and critical nonconformities. Capture containment and permanent actions, root cause analysis, and spread plan in one file. PDF/Word export will be added later.",
    caseTitle: "Case Basics",
    fields: {
      caseId: { label: "Case / Complaint ID", placeholder: "e.g. Q-2025-118" },
      customer: { label: "Customer / Internal source", placeholder: "e.g. OEM X, Internal Audit" },
      product: { label: "Product / Reference", placeholder: "e.g. ABC123, Rev.05" },
      lot: { label: "Lot / Serial", placeholder: "e.g. 24B-17" },
      owner: { label: "Owner", placeholder: "Name / department" },
      team: { label: "Team", placeholder: "Names and functions" },
      startDate: { label: "Start date", placeholder: "MM/DD/YYYY" },
      targetDate: { label: "Target close date", placeholder: "MM/DD/YYYY" },
    },
    guidanceTitle: "Think about:",
    steps: [
      {
        id: "d0",
        title: "D0 - Emergency Response / Interim Containment",
        subtitle: "Protect the customer and the line",
        guidance: [
          "Document the stop-shipment / isolation / 100% inspection decision and scope.",
          "Record the containment start date and owner.",
          "Record isolated quantity, location, lot/serial details.",
        ],
        placeholder:
          "e.g. 100% visual inspection launched at customer site and warehouse. Lot: 24B-17, 1,250 pcs isolated; shipment stopped. Owner: L. Demir, 12 Dec 2025.",
      },
      {
        id: "d1",
        title: "D1 - Build the Team",
        subtitle: "Cross-functional team",
        guidance: [
          "Quality, production, maintenance, process, logistics, supply chain, purchasing, R&D reps.",
          "Roles: leader, facilitator, customer liaison, recorder.",
          "Meeting cadence and decision authority.",
        ],
        placeholder:
          "Team: Quality lead A. Korkmaz; Production B. Aydin; Process E. Sahin; Maintenance D. Oz; Supply chain M. Yilmaz; Customer rep C. Arslan. Meetings: 2x/week, 30 min.",
      },
      {
        id: "d2",
        title: "D2 - Problem Description",
        subtitle: "What, where, when, how many?",
        guidance: [
          "What: defect definition, part/component/operation.",
          "Where and when: station, lot, date, shift.",
          "How many: defect rate/PPM, quantity, trend (per control plan).",
          "Visual evidence / customer complaint reference.",
        ],
        placeholder:
          "e.g. Product ABC123, Operation 40 (drilling). Defect: Hole diameter 8.00±0.05 expected, measured 8.15 mm. Affected lot 24B-17, 1,250 pcs; detected at customer incoming inspection 12 Dec 2025. Defect rate 3.5% (PPM 35,000).",
      },
      {
        id: "d3",
        title: "D3 - Interim Containment Action",
        subtitle: "Customer protection + internal process",
        guidance: [
          "Isolated stock and shipping plan.",
          "Field action for customer stock (recall / sorting).",
          "Increase internal controls (extra checks, temporary poka-yoke).",
        ],
        placeholder:
          "100% diameter inspection added in warehouse and WIP; nonconforming parts quarantined. Customer sorting plan: 14-15 Dec, two inspectors; target 1,250 pcs.",
      },
      {
        id: "d4",
        title: "D4 - Root Cause Analysis",
        subtitle: "Problem + escape causes",
        guidance: [
          "Technical root cause (5 Why, fishbone): why did it happen?",
          "Escape cause: why did the control plan miss it?",
          "Validate assumptions: tests, measurements, data analysis.",
        ],
        placeholder:
          "5 Why summary: 1) Diameter is oversized because the drill is worn. 2) Wear was not detected because measurement frequency is every 2 hours. 3) Frequency was low because risk class was set too low (M). 4) Risk class was wrong because PFMEA was not updated (new customer tolerance missing). Validation: test with worn tool shows diameter 8.14-8.16 mm.",
      },
      {
        id: "d5",
        title: "D5 - Permanent Corrective Action",
        subtitle: "Eliminate root causes",
        guidance: [
          "Selected permanent action(s), owner, target date.",
          "Planned validation method (MSA, capability, pilot run).",
          "Resource needs and risks.",
        ],
        placeholder:
          "Action: Reduce drill tool life from 2,000 pcs to 1,200 pcs; add automatic counter-based tool change. Update PFMEA and control plan. Validation: 3-lot pilot, Cpk >= 1.33; repeat MSA. Target: 22 Dec 2025, owner: E. Sahin.",
      },
      {
        id: "d6",
        title: "D6 - Verify Corrective Action",
        subtitle: "Proof of effectiveness",
        guidance: [
          "Measurements, capability results, field performance.",
          "Pilot / trial results and approval criteria.",
          "Customer feedback (PPAP/ISIR if applicable).",
        ],
        placeholder:
          "Pilot 3 lots (3x1,200 pcs): diameter avg 8.01, Cpk 1.48. First shipments show zero defects in the field. PPAP level 3 file sent; customer approval on 02 Jan 2026.",
      },
      {
        id: "d7",
        title: "D7 - System Prevention / Spread",
        subtitle: "Apply to similar products/lines",
        guidance: [
          "List similar processes/products and deploy actions.",
          "Update standard documents (PFMEA, control plan, work instructions, maintenance plan).",
          "Training and competency updates.",
        ],
        placeholder:
          "Similar operations: DEF200 (op40), GHI330 (op35). PFMEA and control plan updated; drill life 1,200 pcs, inspection every 1 hour. Operator training completed on 18 Dec 2025; maintenance plan updated with counter.",
      },
      {
        id: "d8",
        title: "D8 - Closure and Recognition",
        subtitle: "Lessons learned and thanks",
        guidance: [
          "Thank the team and supporters.",
          "Short summary of lessons learned.",
          "Customer notification date.",
        ],
        placeholder:
          "Team: A. Korkmaz, B. Aydin, E. Sahin, D. Oz, M. Yilmaz. Lessons: tool life tracking counter is required; PFMEA review cadence every 6 months. Closure email sent to customer on 03 Jan 2026.",
      },
      {
        id: "risks",
        title: "Risks and Blockers",
        guidance: [
          "Resource needs, supplier risk, downtime risk.",
          "Reasons for delay and contingency plan.",
        ],
        placeholder:
          "Tool lead time is 2 weeks; inventory is critical. PLC I/O shortage risk for counter system; maintenance ordered an extra module.",
      },
      {
        id: "metrics",
        title: "Metrics and Targets",
        guidance: [
          "PPM target, scrap rate, customer-reported defect count.",
          "SLA: response time, containment completion time.",
        ],
        placeholder:
          "PPM target < 500, scrap < 0.5%. D0 completion: 24 hours, D3 containment: 48 hours. Customer report response time: 5 working days (full 8D: 10 working days).",
      },
      {
        id: "signoff",
        title: "Approval / Tracking",
        guidance: [
          "Customer approval (date, person).",
          "Internal approval (quality manager, production manager).",
          "Tracking format for open actions.",
        ],
        placeholder:
          "Customer approval: A. Smith, 03 Jan 2026 (email ref# 2415). Internal approval: Quality Manager I. Kaya 04 Jan 2026; Production Manager Z. Cetin 04 Jan 2026. Open actions tracked in shared sheet.",
      },
    ],
    checklist: {
      title: "Quick Checklist",
      description: "Review the items below before sending the report.",
      reset: "Clear form",
      items: [
        "Are D0 and D3 actions defined with scope, date, and owner?",
        "Is D4 root cause + escape cause validation documented?",
        "Is the validation plan for D5 permanent actions (D6) clear?",
        "Is the spread plan for similar products/lines (D7) defined?",
        "Are approvals (customer/internal) and metrics up to date?",
      ],
    },
  },
};
