// app/tools/material-cards/page.tsx
"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";

type MaterialCategory =
  | "steel"
  | "stainless"
  | "tool"
  | "aluminum"
  | "copper"
  | "titanium"
  | "nickel"
  | "plastics"
  | "elastomer";

type MaterialInfo = {
  name: string;
  category: MaterialCategory;
  description: string;
  typicalUse: string;
  properties: string[];
  notes?: string;
};

const CATEGORY_LABELS: Record<MaterialCategory, string> = {
  steel: "Karbon / Alaşımlı Çelik",
  stainless: "Paslanmaz",
  tool: "Takım Çeliği",
  aluminum: "Alüminyum",
  copper: "Bakır Alaşımları",
  titanium: "Titanyum",
  nickel: "Nikel Esaslı",
  plastics: "Plastikler",
  elastomer: "Elastomer",
};

const CATEGORY_EXTRA: Partial<Record<MaterialCategory, string>> = {
  steel:
    "Tipik ısıl işlem aralıkları: karbon/alaşımlı çeliklerde ıslah sonrası Rm ~600–1300 MPa, yüzey sertleştirme ile dışta 50–62 HRC; kaynaklı parçalarda stres giderme tavı önerilir.",
  stainless:
    "Östenitik (304/316) çökelmez, ısıl sertleştirme yok; martensitik (410/420) 50–58 HRC’ye kadar sertleşir; PH (17-4PH) yaşlandırma ile Rp0.2 ~900–1100 MPa.",
  tool:
    "Soğuk iş çelikleri 58–62 HRC aralığında; sıcak iş çelikleri 44–52 HRC’ye ayarlanır; P20/P20+Ni önsert ~28–36 HRC; nitrasyonla yüzey 900–1200 HV olabilir.",
  aluminum:
    "5000 serisi (Mg) çökelmez, kaynak sonrası mukavemet korunur; 6000 serisi T6’da orta-yüksek dayanım; 7000 serisi (7075) çok yüksek dayanım fakat korozyon sınırlı.",
  copper:
    "Pirinç/bronzu ısıl sertleştirme sınırlıdır; berilyum bronz çökelme sertleşmesiyle 1100 MPa üstüne çıkabilir; Al bronz deniz suyuna ve kavitasyona dayanıklıdır.",
  titanium:
    "Ti-6Al-4V çökelme/germe ile 900–1100 MPa dayanım; CP Ti düşük dayanım ama yüksek korozyon; kaynak ve yüzey hazırlığı kritik.",
  nickel:
    "Süperalaşımlar (Inconel/Hastelloy) çözümleme + yaşlandırma ile yüksek sıcaklık dayanımı sağlar; işlenebilirlik zayıf, nikel oranı yüksek maliyetli.",
  plastics:
    "Mühendislik plastiklerinde sıcaklık sınırı ve su emme (PA6/PA66) kritik; PEEK/PEI/PPS yüksek sıcaklıkta boyutsal stabil, PTFE/UHMWPE düşük sürtünme sağlar.",
  elastomer:
    "Elastomer seçiminde ortam (yağ, yakıt, su/ozon) ve sıcaklık aralığı belirleyici; FKM/FFKM yüksek sıcaklık ve kimyasal, EPDM su/buhar, NBR yağ, HNBR yüks. T yağ için.",
};

const MATERIALS: MaterialInfo[] = [
  // Karbon / Alaşımlı Çelikler
  { name: "S235JR", category: "steel", description: "Düşük karbonlu yapısal çelik.", typicalUse: "Konstrüksiyon, profil, sac işleri.", properties: ["Re min ~235 MPa", "Kaynaklanabilir", "Genel amaç"] },
  { name: "S275JR", category: "steel", description: "Orta dayanımlı yapısal çelik.", typicalUse: "Şase, makine gövdesi.", properties: ["Re min ~275 MPa", "Kaynaklanabilir", "Ekonomik"] },
  { name: "S355JR/MC", category: "steel", description: "Yapısal çelik, yüksek akma.", typicalUse: "Şase, vinç, taşıyıcı kiriş.", properties: ["Re min ~355 MPa", "İyi kaynak", "Genel konstrüksiyon"] },
  { name: "S460", category: "steel", description: "Yüksek dayanımlı yapı çeliği.", typicalUse: "Ağır kiriş, vinç bomu.", properties: ["Re ~460 MPa", "Isıl kesimde dikkat", "İnce taneli"] },
  { name: "A36", category: "steel", description: "ASTM yapısal çelik.", typicalUse: "Genel çelik yapı, plaka.", properties: ["Re ~250 MPa", "Kaynaklanabilir", "Konstrüksiyon"] },
  { name: "C35", category: "steel", description: "Orta karbon çelik.", typicalUse: "Miller, dişli ön parça.", properties: ["Islah sonrası ~550–700 MPa", "İyi işlenebilirlik", "Yüzey sertleştirme yapılabilir"] },
  { name: "C45 / Ck45", category: "steel", description: "Orta karbon, ıslah edilebilir çelik.", typicalUse: "Miller, dişliler, pinyon.", properties: ["Islah sonrası ~600–800 MPa", "Indüksiyonla yüzey sertleşir", "İyi işlenebilirlik"] },
  { name: "20MnCr5", category: "steel", description: "Karbonlama çeliği.", typicalUse: "Dişli, pinyon, şaft.", properties: ["Karbonlama sonrası yüzey sert", "Tok çekirdek", "İyi yorulma"] },
  { name: "16MnCr5", category: "steel", description: "Karbonlama çeliği, düşük C.", typicalUse: "Otomotiv dişli ve miller.", properties: ["Derin karbonlama", "Tok çekirdek", "İyi işlenebilirlik"] },
  { name: "42CrMo4 (1.7225)", category: "steel", description: "Krom-molibden alaşımlı çelik.", typicalUse: "Mil, bağlantı, kalıp taşıyıcı.", properties: ["Islah ~900–1100 MPa", "Tokluk yüksek", "İndüksiyonla yüzey sertleşir"] },
  { name: "34CrNiMo6", category: "steel", description: "Ni-Cr-Mo yüksek dayanım çeliği.", typicalUse: "Ağır mil, dişli, krank.", properties: ["Islah ~1000–1300 MPa", "Yüksek darbe tokluğu", "Yorulma direnci iyi"] },
  { name: "30CrNiMo8", category: "steel", description: "Ni-Cr-Mo çeliği.", typicalUse: "Kritik miller, pinyonlar.", properties: ["Islah sonrası yüksek dayanım", "İyi darbe tokluğu", "Isıl işlemde dikkat"] },
  { name: "38MnSiVS5", category: "steel", description: "Mn-Si mikroalaşımlı, ıslah çeliği.", typicalUse: "Cıvata, somun, bağlantı elemanı.", properties: ["İyi dövülebilirlik", "Yüksek çekme dayanımı", "Mikroalaşımlı"] },
  { name: "50CrV4", category: "steel", description: "Krom-vanadyum yay çeliği.", typicalUse: "Yay, darbe alan parçalar.", properties: ["Islah ~1000–1300 MPa", "Yorulma direnci yüksek", "Yüzey sertleşebilir"] },
  { name: "100Cr6 (1.3505)", category: "steel", description: "Bilyalı rulman çeliği.", typicalUse: "Rulman bilyası, halka.", properties: ["Yüksek sertlik", "Temiz çelik", "Aşınma direnci"] },
  { name: "36CrNiMo4 (4340)", category: "steel", description: "Ni-Cr-Mo yüksek dayanım çeliği.", typicalUse: "Ağır yük miller, dişliler.", properties: ["Islah ~1100–1300 MPa", "Tok", "Yorulma direnci"] },
  { name: "25CrMo4 (4130)", category: "steel", description: "Cr-Mo çeliği, kaynaklanabilir.", typicalUse: "Roll cage, boru şase.", properties: ["İyi kaynak ve ıslah", "Orta-yüksek dayanım", "Düşük alaşım"] },
  { name: "ST52-3 (S355J2G3)", category: "steel", description: "Alaşımsız yapı çeliği.", typicalUse: "Şase, profil, genel konstrüksiyon.", properties: ["Re ~355 MPa", "Kaynaklanabilir", "Ekonomik"] },
  { name: "HARDOX 400", category: "steel", description: "Aşınma sacı.", typicalUse: "Kova, astar, aşınma plakası.", properties: ["Sertlik ~400 HB", "Yüksek aşınma direnci", "Kaynak/mekanik işleme dikkat"] },
  { name: "HARDOX 500", category: "steel", description: "Yüksek sertlik aşınma sacı.", typicalUse: "Ağır aşınma plakaları.", properties: ["~500 HB", "Yüksek aşınma", "Kesme/isleme zor"] },

  // Paslanmaz Çelikler
  { name: "AISI 304 / 1.4301", category: "stainless", description: "Östenitik paslanmaz, genel amaç.", typicalUse: "Gıda ekipmanı, dekoratif.", properties: ["İyi korozyon", "Manyetik değil", "Kaynaklanabilir"] },
  { name: "AISI 304L", category: "stainless", description: "Düşük karbonlu 304.", typicalUse: "Kaynaklı tank, boru.", properties: ["Düşük karbür çökelmesi", "Kaynak sonrası dayanım iyi", "Genel korozyon"] },
  { name: "AISI 316L / 1.4404", category: "stainless", description: "Mo alaşımlı, deniz ortamına dayanıklı.", typicalUse: "Kimya proses, deniz suyu.", properties: ["Klorid direnci 304'ten iyi", "Kaynaklanabilir", "Düşük C"] },
  { name: "AISI 321", category: "stainless", description: "Ti stabilizeli, yüksek sıcaklık.", typicalUse: "Egzoz, ısıl çevrim.", properties: ["Sensitizasyona direnç", "Yüksek sıcaklıkta kararlı", "Östenitik"] },
  { name: "AISI 430 / 1.4016", category: "stainless", description: "Ferritik paslanmaz, ekonomik.", typicalUse: "Ev aleti kapakları.", properties: ["Manyetik", "Orta korozyon", "Ucuz"] },
  { name: "AISI 410 / 1.4006", category: "stainless", description: "Martensitik, sertleştirilebilir.", typicalUse: "Bıçak, şaft, vana içi.", properties: ["Isıl işlemle sertleşir", "Korozyon 304'ten düşük", "Manyetik"] },
  { name: "AISI 420 / 1.4021", category: "stainless", description: "Yüksek C martensitik.", typicalUse: "Bıçak, kalıp parçası.", properties: ["Yüksek sertlik", "Korozyon orta", "Manyetik"] },
  { name: "17-4PH / 1.4542", category: "stainless", description: "Çökelme sertleşmeli.", typicalUse: "Havacılık, güç ekipmanı.", properties: ["H900'da Rp0.2 ~1000 MPa", "İyi korozyon", "Yaşlandırma ile ayarlanır"] },
  { name: "15-5PH / 1.4545", category: "stainless", description: "PH paslanmaz, iyi tokluk.", typicalUse: "Uçak iniş takımı parçaları.", properties: ["Yüksek dayanım", "İyi korozyon", "PH ısıl işlem"] },
  { name: "2205 Duplex", category: "stainless", description: "Duplex paslanmaz (ferrit+östenit).", typicalUse: "Petrol, gaz, deniz suyu.", properties: ["Yüksek klorid direnci", "Yüksek Re", "Stres korozyonuna dirençli"] },
  { name: "2507 Super Duplex", category: "stainless", description: "Süper duplex, yüksek PREN.", typicalUse: "Agresif deniz ortamı.", properties: ["Çok yüksek pitting direnci", "Yüksek dayanım", "Kaynakta kontrol şart"] },
  { name: "904L / 1.4539", category: "stainless", description: "Yüksek Ni-Mo östenitik.", typicalUse: "Asit ortamları, gübre.", properties: ["PREN yüksek", "İyi form kabiliyeti", "Pahalı"] },
  { name: "440C / 1.4125", category: "stainless", description: "Yüksek C martensitik, bıçak/rulman.", typicalUse: "Bıçak, rulman bileziği.", properties: ["Yüksek sertlik", "Korozyon sınırlı", "Manyetik"] },

  // Takım Çelikleri
  { name: "1.2379 (D2)", category: "tool", description: "Yüksek kromlu soğuk iş çeliği.", typicalUse: "Kesme kalıbı, bıçak.", properties: ["Sertlik 58–62 HRC", "Aşınma direnci yüksek", "Tokluk orta"] },
  { name: "1.2080 (D3)", category: "tool", description: "Yüksek karbon-krom soğuk iş.", typicalUse: "Kesici bıçak, makas.", properties: ["Sertlik 60–62 HRC", "Aşınma yüksek", "Tokluk düşük"] },
  { name: "1.2842 (O2)", category: "tool", description: "Yağda soğuyan soğuk iş çeliği.", typicalUse: "El aletleri, bıçak.", properties: ["Sertlik 58–62 HRC", "İyi işlenebilirlik", "Stabilite iyi"] },
  { name: "1.2367", category: "tool", description: "Sıcak iş çeliği, yüksek tokluk.", typicalUse: "Alüminyum dövme kalıbı.", properties: ["Sıcak dayanım yüksek", "Tokluk iyi", "Termal yorulma direnci"] },
  { name: "1.2344 (H13)", category: "tool", description: "Sıcak iş çeliği.", typicalUse: "Basınçlı döküm, sıcak dövme.", properties: ["Sıcak sertlik", "Termal şok direnci", "Nitrasyon yapılabilir"] },
  { name: "1.2343 (H11)", category: "tool", description: "Sıcak iş, daha tok.", typicalUse: "Sıcak dövme kalıbı.", properties: ["Tokluk yüksek", "Sıcak dayanım iyi", "Termal yorulma"] },
  { name: "1.2738 (P20+Ni)", category: "tool", description: "Plastik kalıp çeliği, önsert.", typicalUse: "Kalıp gövdesi, 3D oyuk.", properties: ["Sertlik ~32–36 HRC", "İyi işlenebilir", "Nitrasyon uygulanabilir"] },
  { name: "1.2311 (P20)", category: "tool", description: "Plastik kalıp çeliği.", typicalUse: "Enjeksiyon kalıpları.", properties: ["Sertlik 28–34 HRC", "Parlatılabilir", "Kaynakta dikkat"] },
  { name: "1.2312 (P20+S)", category: "tool", description: "Serbest işleme P20.", typicalUse: "Kalıp gövdesi, aparat blok.", properties: ["Sertlik 28–32 HRC", "İyi işlenebilirlik", "Sert kaplama mümkün"] },
  { name: "1.2083 (SUS420 mod.)", category: "tool", description: "Korozyon dirençli plastik kalıp çeliği.", typicalUse: "Şeffaf kalıplar, medikal.", properties: ["Paslanmaz özellik", "Polisaj iyi", "Sertleşebilir"] },
  { name: "1.2767", category: "tool", description: "Ni alaşımlı kalıp çeliği, çok tok.", typicalUse: "Kesme kalıbı, kalıp insert.", properties: ["Yüksek tokluk", "Darbeye dayanım", "Islah + yüzey sertleştirme"] },
  { name: "1.2714", category: "tool", description: "Sıcak iş, Ni-Cr-Mo çeliği.", typicalUse: "Dövme kalıbı, matris.", properties: ["Tok", "Sıcak sertlik iyi", "Islahlanabilir"] },

  // Alüminyum Alaşımları
  { name: "EN AW-1050A", category: "aluminum", description: "Saf alüminyum, yumuşak.", typicalUse: "Isı değiştirici, reflektör.", properties: ["İyi iletkenlik", "Şekillendirilebilir", "Dayanım düşük"] },
  { name: "EN AW-3003", category: "aluminum", description: "Mn alaşımlı, çekme ve sac.", typicalUse: "HVAC kanalı, kaplama.", properties: ["Korozyon iyi", "Kaynaklanabilir", "Orta dayanım"] },
  { name: "EN AW-5005", category: "aluminum", description: "Mg alaşımlı dekoratif.", typicalUse: "Kaplama, mimari paneller.", properties: ["Anodizasyona uygun", "Korozyon iyi", "Orta dayanım"] },
  { name: "EN AW-5052", category: "aluminum", description: "Mg alaşımlı, iyi korozyon.", typicalUse: "Deniz, tank, panel.", properties: ["Kaynak iyi", "Dayanım 3000 seriden yüksek", "Bükülebilir"] },
  { name: "EN AW-5083", category: "aluminum", description: "Denizcilik alaşımı.", typicalUse: "Gemi, tank, kriyojenik.", properties: ["Yüksek korozyon direnci", "Kaynak sonrası dayanım fena değil", "Dayanım 5000 serisi yüksek"] },
  { name: "EN AW-5086", category: "aluminum", description: "Mg alaşımlı, deniz.", typicalUse: "Gövde, üst yapı.", properties: ["Korozyon iyi", "Kaynaklanabilir", "Orta dayanım"] },
  { name: "EN AW-5754", category: "aluminum", description: "Mg alaşımlı sac.", typicalUse: "Otomotiv panel, kapı.", properties: ["Korozyon ve şekillendirme iyi", "Kaynaklanabilir", "Orta dayanım"] },
  { name: "EN AW-6005A", category: "aluminum", description: "Ekstrüzyon profili alaşımı.", typicalUse: "Profil, konstrüksiyon.", properties: ["Dayanım 6063'ten yüksek", "Kaynaklanabilir", "Anodize edilebilir"] },
  { name: "EN AW-6060", category: "aluminum", description: "Ekonomik profil alaşımı.", typicalUse: "Pencere, hafif profil.", properties: ["İyi yüzey", "Düşük dayanım", "Anodizasyona uygun"] },
  { name: "EN AW-6061", category: "aluminum", description: "Genel amaçlı 6000 serisi.", typicalUse: "Makine parçaları, şasi.", properties: ["T6 dayanımı iyi", "Kaynak kabiliyeti orta", "İyi korozyon"] },
  { name: "EN AW-6063", category: "aluminum", description: "Profil ve mimari alaşım.", typicalUse: "Profil, dekoratif.", properties: ["İyi anodizasyon", "Dayanım 6061'den düşük", "Şekillendirilebilir"] },
  { name: "EN AW-6082", category: "aluminum", description: "Yüksek dayanımlı 6000 serisi.", typicalUse: "Taşıyıcı profil, vinç kolu.", properties: ["T6'da yüksek dayanım", "Kaynak 7000'e göre iyi", "Korozyon iyi"] },
  { name: "EN AW-6013", category: "aluminum", description: "Isıl işlemle güçlenen 6000 serisi.", typicalUse: "Havacılık orta yük parça.", properties: ["Orta-yüksek dayanım", "İyi işlenebilirlik", "Kaynak sınırlı"] },
  { name: "EN AW-2024 T3", category: "aluminum", description: "Cu alaşımlı yüksek dayanım.", typicalUse: "Uçak gövde, bağlantı.", properties: ["Yorulma iyi", "Korozyon düşük", "Kaplama gerek"] },
  { name: "EN AW-2014", category: "aluminum", description: "Yüksek dayanım, iyi işlenebilirlik.", typicalUse: "Havacılık bağlantı, fitting.", properties: ["Yüksek mukavemet", "Korozyon sınırlı", "Kaplama önerilir"] },
  { name: "EN AW-2219", category: "aluminum", description: "Kaynaklanabilir yüksek dayanım.", typicalUse: "Havacılık yakıt tankı.", properties: ["Kaynak iyi", "Dayanım 2024'e yakın", "Kriyo uygulama"] },
  { name: "EN AW-7020", category: "aluminum", description: "Zn-Mg kaynaklanabilir.", typicalUse: "Bisiklet kadro, savunma.", properties: ["Dayanım yüksek", "Kaynak yapılabilir", "Korozyon 7xxx için iyi"] },
  { name: "EN AW-7050", category: "aluminum", description: "Yüksek tokluklu 7xxx.", typicalUse: "Uçak iskelet, bulkhead.", properties: ["Yüksek dayanım", "SCC direnci 7075'ten iyi", "Isıl işlem hassas"] },
  { name: "EN AW-7075 T6/T73", category: "aluminum", description: "Çok yüksek dayanım 7xxx.", typicalUse: "Havacılık, motorsport.", properties: ["Çekme >500 MPa", "Korozyon sınırlı", "Kaynak önerilmez"] },
  { name: "EN AW-6069", category: "aluminum", description: "Yüksek dayanım 6000.", typicalUse: "Taşıyıcı profiller.", properties: ["T6 mukavemet yüksek", "Kaynak kabiliyeti iyi", "Korozyon iyi"] },

  // Bakır Alaşımları
  { name: "Cu-ETP (CW004A)", category: "copper", description: "Elektrolitik bakır, yüksek iletkenlik.", typicalUse: "Baralar, kablo, busbar.", properties: ["IACS ~100%", "İyi şekillendirilebilir", "Korozyon iyi"] },
  { name: "Cu-OF (CW008A)", category: "copper", description: "Oksijensiz bakır, vakum uygulama.", typicalUse: "Vakum, kriyo parçalar.", properties: ["İletkenlik çok yüksek", "Hidrojen gevrekliği yok", "Temiz yüzey"] },
  { name: "CuSn12 (Bronz)", category: "copper", description: "Kalay bronz, yatak ve burç.", typicalUse: "Burç, kayma yüzeyi.", properties: ["Aşınma direnci", "Yük altında stabil", "Döküm/işleme uygun"] },
  { name: "CuSn8 (Bronz C52100)", category: "copper", description: "Fosfor bronz, yaylık.", typicalUse: "Yay şerit, kontak.", properties: ["İyi yay kabiliyeti", "Aşınma iyi", "Korozyon orta"] },
  { name: "CuSn6", category: "copper", description: "Fosfor bronz.", typicalUse: "Elektrik yayları, burç.", properties: ["Tokluk iyi", "Yay etkisi", "İşlenebilirlik orta"] },
  { name: "CuZn37 (CW508L)", category: "copper", description: "Pirinç (63/37).", typicalUse: "Armatür, dekoratif.", properties: ["İyi şekillendirme", "Korozyon orta", "İşleme iyi"] },
  { name: "CuZn39Pb3 (CW614N)", category: "copper", description: "Otomat pirinç, kurşunlu.", typicalUse: "Fittings, valf gövdesi.", properties: ["Mükemmel işlenebilirlik", "Korozyon orta", "Soğuk şekil sınırlı"] },
  { name: "CuZn36Pb2 (CW603N)", category: "copper", description: "Kurşunlu pirinç.", typicalUse: "Otomotiv fittings.", properties: ["İşlenebilirlik yüksek", "Korozyon orta", "Ekonomi"] },
  { name: "CuAl10Ni5Fe4 (Ni-Al Bronz)", category: "copper", description: "Nikel-alüminyum bronz.", typicalUse: "Deniz suyu, pervane, burç.", properties: ["Yüksek korozyon", "Tok ve aşınma dirençli", "Kavitasyona direnç"] },
  { name: "CuAl11Fe6Ni6 (C95800)", category: "copper", description: "Yüksek Ni Al bronz.", typicalUse: "Ağır deniz donanımı.", properties: ["Yüksek dayanım", "Korozyon çok iyi", "Döküm alaşımı"] },
  { name: "CuNi10Fe1Mn", category: "copper", description: "Bakır-nikel alaşımı.", typicalUse: "Deniz suyu boru.", properties: ["Deniz korozyonu iyi", "İyi şekillendirilebilir", "Kriyo uygun"] },
  { name: "CuNi30Mn1Fe", category: "copper", description: "Yüksek Ni Cu alaşımı.", typicalUse: "Kriyo, direnç elemanı.", properties: ["İletkenlik düşük", "Korozyon iyi", "Stabil"] },
  { name: "CuBe2", category: "copper", description: "Berilyum bronz, yaylık.", typicalUse: "Kontak, yay, kalıp insert.", properties: ["Yüksek dayanım", "İyi iletkenlik", "Kıvılcım yapmaz"], notes: "Berilyum tozu tehlikeli; güvenli işleme gerekir." },

  // Titanyum
  { name: "Ti Gr2 (CP)", category: "titanium", description: "Ticari saf titanyum, orta dayanım.", typicalUse: "Kimya, medikal implant.", properties: ["Yüksek korozyon", "Kaynaklanabilir", "Düşük yoğunluk"] },
  { name: "Ti Gr5 (Ti-6Al-4V)", category: "titanium", description: "En yaygın Ti alaşımı.", typicalUse: "Havacılık, medikal, motorsport.", properties: ["Yüksek dayanım/ağırlık", "Isıl işlemle güçlenir", "Kaynak sınırlı"] },
  { name: "Ti Gr23 (ELI)", category: "titanium", description: "Düşük intersisyel Ti-6Al-4V.", typicalUse: "Medikal implant.", properties: ["Yüksek tokluk", "Biyouyumlu", "Isıl işlem uygulanabilir"] },
  { name: "Ti Gr9 (Ti-3Al-2.5V)", category: "titanium", description: "Soğuk şekillendirmeye uygun.", typicalUse: "Boru, bisiklet kadro.", properties: ["Orta dayanım", "İyi şekil kabiliyeti", "Kaynaklanabilir"] },

  // Nikel Esaslı
  { name: "Inconel 625", category: "nickel", description: "Ni-Cr-Mo alaşımı, korozyon ve yüksek sıcaklık.", typicalUse: "Kimya, deniz suyu, yüksek T.", properties: ["Yüksek nikel", "Çatlak direnci", "Kaynak yapılabilir"] },
  { name: "Inconel 718", category: "nickel", description: "Yaşlandırılabilir süperalaşım.", typicalUse: "Uçak motoru, türbin.", properties: ["Yüksek sıcaklık dayanımı", "Çökelme sertleşmesi", "Kaynaklanabilir"] },
  { name: "Hastelloy C276", category: "nickel", description: "Ni-Mo-Cr alaşımı, ağır korozif ortamlar.", typicalUse: "Asit tankı, kimya ekipmanı.", properties: ["Mükemmel korozyon", "Kaynak yapılabilir", "Pahalı"] },
  { name: "Monel 400", category: "nickel", description: "Ni-Cu alaşımı.", typicalUse: "Deniz suyu, kriyo.", properties: ["Korozyon iyi", "Dayanım orta", "İyi süneklik"] },
  { name: "Incoloy 800H", category: "nickel", description: "Yüksek sıcaklık oksidasyon direnci.", typicalUse: "Petrokimya, ısıtıcı tüp.", properties: ["Creep dayanımı", "Oksidasyon direnci", "Ni-Fe-Cr alaşımı"] },

  // Plastikler
  { name: "PA6", category: "plastics", description: "Poliamid 6, mühendislik plastiği.", typicalUse: "Dişli, kayar parça.", properties: ["Dayanım orta", "Nem alır", "Sürtünme düşük"] },
  { name: "PA66 GF30", category: "plastics", description: "Cam elyaf takviyeli PA66.", typicalUse: "Yapısal plastik parça.", properties: ["Yüksek dayanım", "Isı direnci artmış", "Boyutsal stabil"] },
  { name: "POM-C (Delrin)", category: "plastics", description: "Asetal kopolimer.", typicalUse: "Kayma yatak, dişli.", properties: ["Düşük sürtünme", "Boyutsal kararlılık", "İyi işlenebilir"] },
  { name: "PEEK", category: "plastics", description: "Yüksek performanslı termoplastik.", typicalUse: "Havacılık, medikal, kimya.", properties: ["Yüksek sıcaklık", "Kimyasal direnç", "İyi mekanik"] },
  { name: "PTFE", category: "plastics", description: "Çok düşük sürtünme, kimyasal inert.", typicalUse: "Conta, yatak, kaplama.", properties: ["Kimyasal inert", "Sıcaklık yüksek", "Mekanik zayıf"] },
  { name: "UHMWPE", category: "plastics", description: "Ultra yüksek molekül PE.", typicalUse: "Aşınma plakası, liner.", properties: ["Çok düşük sürtünme", "Aşınma direnci", "Mukavemet orta"] },
  { name: "PC (Polikarbonat)", category: "plastics", description: "Darbeye dayanıklı şeffaf plastik.", typicalUse: "Koruma kapakları, lens.", properties: ["Yüksek darbe", "Şeffaf", "Isıya orta"] },
  { name: "PMMA (Akrilik)", category: "plastics", description: "Şeffaf, sert plastik.", typicalUse: "Cam yerine, ışık difüzör.", properties: ["Yüksek şeffaflık", "Çizilmeye hassas", "UV stabil"] },
  { name: "ABS", category: "plastics", description: "Genel amaçlı darbe dayanımlı.", typicalUse: "Otomotiv iç trim, ev aleti.", properties: ["İyi işlenebilir", "Yüzey boyanabilir", "Orta kimyasal direnç"] },
  { name: "PET-G", category: "plastics", description: "Kolay şekil, şeffaf.", typicalUse: "Ambalaj, 3D baskı.", properties: ["Şeffaf", "Düşük çekme", "Kolay termoform"] },
  { name: "PPS", category: "plastics", description: "Yüksek sıcaklık, kimyasal direnç.", typicalUse: "Elektrik, otomotiv parça.", properties: ["Isı 200°C+", "Kimyasal direnç yüksek", "Boyutsal kararlı"] },
  { name: "PVDF", category: "plastics", description: "Floropolimer, kimyasal direnç.", typicalUse: "Kimya hatları, film.", properties: ["Kimyasal inert", "Alev direnci", "Orta mekanik"] },
  { name: "PEI (Ultem)", category: "plastics", description: "Yüksek sıcaklık mühendislik plastiği.", typicalUse: "Elektrik izolatör, havacılık.", properties: ["Isı 170–200°C", "İyi dielektrik", "Boyutsal stabil"] },
  { name: "HDPE", category: "plastics", description: "Yüksek yoğunluklu PE.", typicalUse: "Borular, tank, levha.", properties: ["Kimyasal direnç", "Darbe dayanımı", "Düşük sürtünme"] },

  // Elastomerler
  { name: "NBR", category: "elastomer", description: "Nitril kauçuk.", typicalUse: "O-ring, hidrolik keçe.", properties: ["Yağ direnci iyi", "Sıcaklık -30/+100°C", "Ozon direnci zayıf"] },
  { name: "HNBR", category: "elastomer", description: "Hidrojenlenmiş NBR.", typicalUse: "Yakıt/hava keçesi.", properties: ["Yağ ve yakıt direnci", "Sıcaklık -30/+140°C", "Ozon NBR'den iyi"] },
  { name: "FKM (Viton)", category: "elastomer", description: "Fluoroelastomer.", typicalUse: "Yüksek sıcaklık sızdırmazlık.", properties: ["Sıcaklık -20/+200°C", "Yakıt/kimyasal direnç", "Pahalı"] },
  { name: "FFKM", category: "elastomer", description: "Perfluoroelastomer, en yüksek kimyasal direnç.", typicalUse: "Kimyasal proses contaları.", properties: ["Çok yüksek kimyasal direnç", "Sıcaklık yüksek", "Çok pahalı"] },
  { name: "EPDM", category: "elastomer", description: "Etilen-propilen.", typicalUse: "Su/buhar contası.", properties: ["Su/buhar direnci", "Sıcaklık -40/+130°C", "Mineral yağla uyumsuz"] },
  { name: "VMQ (Silikon)", category: "elastomer", description: "Silikon kauçuk.", typicalUse: "Gıda contası, yüksek/ düşük sıcaklık.", properties: ["-50/+200°C", "Ozon/UV iyi", "Yakıt/yağ zayıf"] },
  { name: "CR (Neopren)", category: "elastomer", description: "Kloropren kauçuk.", typicalUse: "Genel amaç conta.", properties: ["Alev ve yağ direnci orta", "Ozon orta", "Sıcaklık -35/+100°C"] },
  { name: "PU (TPU)", category: "elastomer", description: "Poliüretan elastomer.", typicalUse: "Süpürge keçesi, wiper.", properties: ["Aşınma direnci çok iyi", "Sıcaklık -30/+90°C", "Hidroliz riski"] },
];

export default function MaterialCardsPage() {
  const [categoryFilter, setCategoryFilter] = useState<MaterialCategory | "all">("all");

  const filtered = useMemo(
    () => MATERIALS.filter((m) => (categoryFilter === "all" ? true : m.category === categoryFilter)),
    [categoryFilter],
  );

  return (
    <PageShell>
      <ToolDocTabs slug="material-cards">
      {/* Başlık + filtre alanı */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Bilgi Kartları
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-600">
            Malzeme · Isıl İşlem · Kaplama Merkezi
          </span>
        </div>

        <h1 className="text-lg font-semibold text-slate-900">Malzeme Bilgi Kartları</h1>
        <p className="mt-2 text-xs text-slate-600">
          Çelik, paslanmaz, alüminyum, bakır alaşımları, titanyum, nikel alaşımları, plastik ve
          elastomerler için hızlı mühendislik özetleri. Değerler fikir vermek içindir; kritik
          tasarımda datasheet ve standartları kontrol edin.
        </p>

        {/* Filtre butonları */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-700">Kategori filtresi:</span>
          <FilterChip label="Tümü" active={categoryFilter === "all"} onClick={() => setCategoryFilter("all")} />
          {(Object.keys(CATEGORY_LABELS) as MaterialCategory[]).map((cat) => (
            <FilterChip
              key={cat}
              label={CATEGORY_LABELS[cat]}
              active={categoryFilter === cat}
              onClick={() => setCategoryFilter(cat)}
            />
          ))}
        </div>
      </section>

      {/* Malzeme kartları */}
      <section className="grid gap-4 md:grid-cols-2">
        {filtered.map((m) => (
          <article
            key={m.name}
            className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-sm hover:border-slate-300 hover:shadow-md"
          >
            <div>
              <header className="mb-2">
                <h2 className="text-sm font-semibold text-slate-900">{m.name}</h2>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  {CATEGORY_LABELS[m.category]}
                </p>
              </header>

              <p className="mb-2 text-[11px] text-slate-700">{m.description}</p>

              <p className="mb-1 text-[11px] text-slate-700">
                <span className="font-semibold">Tipik kullanım:</span> {m.typicalUse}
              </p>

              <ul className="mb-1 list-inside list-disc text-[11px] text-slate-700">
                {m.properties.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>

              {m.notes && <p className="mt-1 text-[11px] text-slate-500">{m.notes}</p>}
              {CATEGORY_EXTRA[m.category] && (
                <p className="mt-1 text-[11px] text-slate-500">
                  {CATEGORY_EXTRA[m.category]}
                </p>
              )}
            </div>

            <footer className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
              <span>Genel mühendislik referansı</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5">Free içerik</span>
            </footer>
          </article>
        ))}
      </section>
          </ToolDocTabs>
    </PageShell>
  );
}

type FilterChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 font-medium ${
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}


