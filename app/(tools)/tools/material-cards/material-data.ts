import type { Locale } from "@/utils/locale";
import type { MaterialCategory, MaterialInfo } from "./material-types";

export const CATEGORY_LABELS: Record<Locale, Record<MaterialCategory, string>> = {
  tr: {
    steel: "Karbon / Alaşımlı Çelik",
    stainless: "Paslanmaz",
    tool: "Takım Çeliği",
    aluminum: "Alüminyum",
    copper: "Bakır Alaşımları",
    titanium: "Titanyum",
    nickel: "Nikel Esaslı",
    plastics: "Plastikler",
    elastomer: "Elastomer",
  },
  en: {
    steel: "Carbon & Alloy Steel",
    stainless: "Stainless Steel",
    tool: "Tool Steel",
    aluminum: "Aluminum Alloys",
    copper: "Copper Alloys",
    titanium: "Titanium",
    nickel: "Nickel-Based",
    plastics: "Engineering Plastics",
    elastomer: "Elastomers",
  },
};

export const CATEGORY_EXTRA: Record<Locale, Partial<Record<MaterialCategory, string>>> = {
  tr: {
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
  },
  en: {
    steel:
      "Typical heat treat ranges: Q&T carbon/alloy steels Rm ~600–1300 MPa, case hardening achieves 50–62 HRC outer case; stress relief annealing recommended for welded parts.",
    stainless:
      "Austenitic (304/316) non-hardenable by heat treatment; martensitic (410/420) hardenable up to 50–58 HRC; precipitation hardening (17-4PH) aging reaches Rp0.2 ~900–1100 MPa.",
    tool:
      "Cold work steels 58–62 HRC; hot work steels tempered to 44–52 HRC; P20/P20+Ni pre-hardened ~28–36 HRC; surface nitriding can reach 900–1200 HV.",
    aluminum:
      "5000 series (Mg) non-heat-treatable, retains strength post-welding; 6000 series T6 medium-high strength; 7000 series (7075) very high strength with limited corrosion resistance.",
    copper:
      "Heat treatment is limited for brass/bronze; beryllium copper reaches >1100 MPa via precipitation hardening; aluminum bronze resists seawater cavitation.",
    titanium:
      "Ti-6Al-4V solution treated & aged reaches 900–1100 MPa; CP Ti offers lower strength but excellent corrosion resistance; welding shielding is critical.",
    nickel:
      "Superalloys (Inconel/Hastelloy) provide high-temperature strength via solution + aging; poor machinability, high alloy cost.",
    plastics:
      "Temperature limit and moisture absorption (PA6/PA66) are critical; PEEK/PEI/PPS provide high-temperature dimensional stability; PTFE/UHMWPE deliver low friction.",
    elastomer:
      "Selection depends on fluid media (oil, fuel, water, ozone) and temperature range; FKM/FFKM for high temp/chemical, EPDM for water/steam, NBR/HNBR for oils.",
  },
};

const MATERIALS_TR: MaterialInfo[] = [
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

const MATERIALS_EN: MaterialInfo[] = [
  // Carbon & Alloy Steels
  { name: "S235JR", category: "steel", description: "Low carbon structural steel.", typicalUse: "Structural fabrication, profiles, sheet metal.", properties: ["Re min ~235 MPa", "Readily weldable", "General purpose"] },
  { name: "S275JR", category: "steel", description: "Medium-strength structural steel.", typicalUse: "Chassis, machine frames.", properties: ["Re min ~275 MPa", "Weldable", "Cost-effective"] },
  { name: "S355JR/MC", category: "steel", description: "High-yield structural steel.", typicalUse: "Chassis, cranes, load-bearing beams.", properties: ["Re min ~355 MPa", "Good weldability", "General construction"] },
  { name: "S460", category: "steel", description: "High-strength fine-grain structural steel.", typicalUse: "Heavy girders, crane booms.", properties: ["Re ~460 MPa", "Controlled thermal cutting", "Fine grained"] },
  { name: "A36", category: "steel", description: "ASTM structural carbon steel.", typicalUse: "General structural frames, base plates.", properties: ["Re ~250 MPa", "Weldable", "Construction standard"] },
  { name: "C35", category: "steel", description: "Medium carbon engineering steel.", typicalUse: "Shafts, gear blanks.", properties: ["Q&T ~550–700 MPa", "Good machinability", "Surface hardenable"] },
  { name: "C45 / Ck45", category: "steel", description: "Medium carbon through-hardening steel.", typicalUse: "Shafts, gears, pinions, axles.", properties: ["Q&T ~600–800 MPa", "Induction hardenable", "Good machinability"] },
  { name: "20MnCr5", category: "steel", description: "Case-hardening alloy steel.", typicalUse: "Gears, pinions, drive shafts.", properties: ["Hard surface after carburizing", "Tough core", "High fatigue limit"] },
  { name: "16MnCr5", category: "steel", description: "Low carbon case-hardening steel.", typicalUse: "Automotive gears and shafts.", properties: ["Deep case depth", "Ductile core", "Good machinability"] },
  { name: "42CrMo4 (1.7225)", category: "steel", description: "Chromium-molybdenum quench and temper steel.", typicalUse: "Shafts, tie rods, mold frames.", properties: ["Q&T ~900–1100 MPa", "High toughness", "Induction hardenable"] },
  { name: "34CrNiMo6", category: "steel", description: "High-strength Ni-Cr-Mo engineering steel.", typicalUse: "Heavy-duty shafts, large gears, crankshafts.", properties: ["Q&T ~1000–1300 MPa", "High impact toughness", "Excellent fatigue strength"] },
  { name: "30CrNiMo8", category: "steel", description: "High-hardenability Ni-Cr-Mo steel.", typicalUse: "Critical shafts, heavy pinions.", properties: ["High strength after Q&T", "Good impact toughness", "Controlled heat treatment required"] },
  { name: "38MnSiVS5", category: "steel", description: "Micro-alloyed forging steel.", typicalUse: "Bolts, studs, structural fasteners.", properties: ["Good forgeability", "High tensile strength", "Precipitation hardened"] },
  { name: "50CrV4", category: "steel", description: "Chromium-vanadium spring steel.", typicalUse: "Springs, shock-loaded components.", properties: ["Q&T ~1000–1300 MPa", "High fatigue limit", "Hardenable surface"] },
  { name: "100Cr6 (1.3505)", category: "steel", description: "High-carbon chromium bearing steel.", typicalUse: "Bearing balls, rollers, rings.", properties: ["High hardness (60-64 HRC)", "High purity", "Wear resistant"] },
  { name: "36CrNiMo4 (4340)", category: "steel", description: "Ultra-high strength Ni-Cr-Mo steel.", typicalUse: "Aerospace shafts, landing gear components.", properties: ["Q&T ~1100–1300 MPa", "High fracture toughness", "Fatigue resistant"] },
  { name: "25CrMo4 (4130)", category: "steel", description: "Weldable chrome-moly steel.", typicalUse: "Roll cages, tubular frames.", properties: ["Excellent weldability & Q&T", "Medium-high strength", "Low alloy"] },
  { name: "ST52-3 (S355J2G3)", category: "steel", description: "Unalloyed structural steel.", typicalUse: "Chassis, hollow sections, general framing.", properties: ["Re ~355 MPa", "Weldable", "Economical"] },
  { name: "HARDOX 400", category: "steel", description: "Abrasion-resistant steel plate.", typicalUse: "Buckets, chutes, wear liners.", properties: ["Hardness ~400 HB", "High wear resistance", "Requires forming guidelines"] },
  { name: "HARDOX 500", category: "steel", description: "Extra high-hardness wear plate.", typicalUse: "Heavy wear liners, crushers.", properties: ["Hardness ~500 HB", "Maximum wear resistance", "Challenging machining"] },

  // Stainless Steels
  { name: "AISI 304 / 1.4301", category: "stainless", description: "Austenitic general purpose stainless steel.", typicalUse: "Food processing equipment, architectural.", properties: ["Good corrosion resistance", "Non-magnetic", "Weldable"] },
  { name: "AISI 304L", category: "stainless", description: "Low carbon 304 stainless steel.", typicalUse: "Welded tanks, fluid piping.", properties: ["Resistant to sensitization", "High post-weld integrity", "General corrosion resistance"] },
  { name: "AISI 316L / 1.4404", category: "stainless", description: "Molybdenum-alloyed marine grade stainless.", typicalUse: "Chemical process vessels, marine fittings.", properties: ["Chloride pitting resistant", "Weldable", "Low carbon"] },
  { name: "AISI 321", category: "stainless", description: "Titanium-stabilized high temperature stainless.", typicalUse: "Exhaust manifolds, expansion joints.", properties: ["Intergranular corrosion resistant", "Stable at 800°C+", "Austenitic"] },
  { name: "AISI 430 / 1.4016", category: "stainless", description: "Ferritic economical stainless steel.", typicalUse: "Appliance panels, interior trims.", properties: ["Magnetic", "Moderate corrosion resistance", "Cost-effective"] },
  { name: "AISI 410 / 1.4006", category: "stainless", description: "Martensitic hardenable stainless.", typicalUse: "Blades, valve trim, turbine buckets.", properties: ["Heat-treatable", "Lower corrosion than 304", "Magnetic"] },
  { name: "AISI 420 / 1.4021", category: "stainless", description: "High-carbon martensitic stainless.", typicalUse: "Cutlery, surgical tools, mold parts.", properties: ["High hardness (50-54 HRC)", "Moderate corrosion resistance", "Magnetic"] },
  { name: "17-4PH / 1.4542", category: "stainless", description: "Precipitation-hardening stainless steel.", typicalUse: "Aerospace parts, pump shafts.", properties: ["Rp0.2 ~1000 MPa (H900)", "Good corrosion resistance", "Tunable aging"] },
  { name: "15-5PH / 1.4545", category: "stainless", description: "PH stainless with high transverse toughness.", typicalUse: "Aircraft structural components.", properties: ["High tensile strength", "Good corrosion resistance", "Vacuum remelted"] },
  { name: "2205 Duplex", category: "stainless", description: "Duplex stainless (ferritic-austenitic).", typicalUse: "Oil & gas, offshore process piping.", properties: ["High chloride resistance", "Twice the yield of 316", "Stress corrosion resistant"] },
  { name: "2507 Super Duplex", category: "stainless", description: "Super duplex stainless with PREN > 42.", typicalUse: "Severe marine and chemical service.", properties: ["Exceptional pitting resistance", "High mechanical strength", "Strict weld control"] },
  { name: "904L / 1.4539", category: "stainless", description: "High Ni-Mo super austenitic stainless.", typicalUse: "Sulfuric acid plants, desalination.", properties: ["High PREN", "Good formability", "Premium cost"] },
  { name: "440C / 1.4125", category: "stainless", description: "High carbon martensitic bearing stainless.", typicalUse: "Bearings, knife blades, valve seats.", properties: ["Hardness up to 58-60 HRC", "Limited corrosion resistance", "Magnetic"] },

  // Tool Steels
  { name: "1.2379 (D2)", category: "tool", description: "High carbon high chromium cold work tool steel.", typicalUse: "Punches, blanking dies, shear blades.", properties: ["Hardness 58–62 HRC", "Excellent wear resistance", "Medium toughness"] },
  { name: "1.2080 (D3)", category: "tool", description: "High carbon chromium cold work steel.", typicalUse: "Cold cutting tools, shear knives.", properties: ["Hardness 60–62 HRC", "High abrasive wear resistance", "Low impact toughness"] },
  { name: "1.2842 (O2)", category: "tool", description: "Oil-hardening cold work steel.", typicalUse: "Hand tools, gauges, guide rails.", properties: ["Hardness 58–62 HRC", "Good machinability", "High dimensional stability"] },
  { name: "1.2367", category: "tool", description: "High-toughness hot work steel.", typicalUse: "Aluminum hot forging dies.", properties: ["High hot tensile strength", "High toughness", "Thermal fatigue resistant"] },
  { name: "1.2344 (H13)", category: "tool", description: "Standard hot work die steel.", typicalUse: "Die casting, extrusion tooling, hot forging.", properties: ["High hot hardness", "Thermal shock resistant", "Nitriding friendly"] },
  { name: "1.2343 (H11)", category: "tool", description: "High toughness hot work steel.", typicalUse: "Hot forging dies, ejector pins.", properties: ["Superior toughness", "Good hot strength", "Thermal fatigue resistant"] },
  { name: "1.2738 (P20+Ni)", category: "tool", description: "Pre-hardened plastic mold steel with nickel.", typicalUse: "Large mold bases, deep cavity molds.", properties: ["Hardness ~32–36 HRC", "Uniform through-hardness", "Polishing & nitriding friendly"] },
  { name: "1.2311 (P20)", category: "tool", description: "Pre-hardened plastic mold steel.", typicalUse: "Injection molds, compression tooling.", properties: ["Hardness 28–34 HRC", "Polishable", "Weldable with preheat"] },
  { name: "1.2312 (P20+S)", category: "tool", description: "Free-machining sulfurized P20.", typicalUse: "Mold frames, holding fixtures.", properties: ["Hardness 28–32 HRC", "Excellent machinability", "Not for mirror polish"] },
  { name: "1.2083 (SUS420 mod.)", category: "tool", description: "Corrosion-resistant plastic mold steel.", typicalUse: "Optics molds, medical plastics.", properties: ["Stainless property", "High mirror polishability", "Hardenable"] },
  { name: "1.2767", category: "tool", description: "High nickel impact-resistant mold steel.", typicalUse: "Heavy blanking dies, stamping inserts.", properties: ["Extra high toughness", "Impact resistant", "Deep hardening"] },
  { name: "1.2714", category: "tool", description: "Ni-Cr-Mo hot die block steel.", typicalUse: "Drop hammer dies, forge rams.", properties: ["Tough", "Good thermal resistance", "Supplied annealed or prehardened"] },

  // Aluminum Alloys
  { name: "EN AW-1050A", category: "aluminum", description: "Commercially pure ductile aluminum.", typicalUse: "Heat exchangers, reflectors.", properties: ["High electrical conductivity", "Easily formed", "Low mechanical strength"] },
  { name: "EN AW-3003", category: "aluminum", description: "Manganese-alloyed work-hardening sheet.", typicalUse: "HVAC ducting, cladding.", properties: ["Good corrosion resistance", "Weldable", "Moderate strength"] },
  { name: "EN AW-5005", category: "aluminum", description: "Magnesium-alloyed architectural aluminum.", typicalUse: "Architectural panels, facades.", properties: ["Anodizing quality", "Good corrosion resistance", "Medium strength"] },
  { name: "EN AW-5052", category: "aluminum", description: "General engineering marine aluminum.", typicalUse: "Fuel tanks, panels, marine brackets.", properties: ["Good weldability", "Higher strength than 3003", "Excellent bendability"] },
  { name: "EN AW-5083", category: "aluminum", description: "Primary structural marine alloy.", typicalUse: "Ship hulls, cryogenic pressure tanks.", properties: ["Exceptional seawater resistance", "Retains strength post-weld", "Highest strength 5xxx"] },
  { name: "EN AW-5086", category: "aluminum", description: "Work-hardenable marine alloy.", typicalUse: "Marine superstructures, hulls.", properties: ["Corrosion resistant", "Weldable", "Good fatigue life"] },
  { name: "EN AW-5754", category: "aluminum", description: "Automotive magnesium-alloyed sheet.", typicalUse: "Vehicle floorings, door structures.", properties: ["Corrosion resistant", "Excellent formability", "Good weldability"] },
  { name: "EN AW-6005A", category: "aluminum", description: "Structural extrusion alloy.", typicalUse: "Heavy railway and construction profiles.", properties: ["Higher strength than 6063", "Weldable", "Anodizable"] },
  { name: "EN AW-6060", category: "aluminum", description: "Extrusion alloy for complex sections.", typicalUse: "Window profiles, light frames.", properties: ["Clean surface finish", "Moderate strength", "Anodizing grade"] },
  { name: "EN AW-6061", category: "aluminum", description: "Versatile structural 6000-series alloy.", typicalUse: "Machined components, frames, fixtures.", properties: ["T6 strength ~310 MPa", "Moderate weldability", "Good corrosion resistance"] },
  { name: "EN AW-6063", category: "aluminum", description: "Architectural extrusion alloy.", typicalUse: "Architectural framing, heat sinks.", properties: ["Excellent anodizing", "Lower strength than 6061", "High extrudability"] },
  { name: "EN AW-6082", category: "aluminum", description: "Highest strength 6000-series alloy.", typicalUse: "Crane structures, trusses, structural frames.", properties: ["High T6 strength", "Better weldability than 7075", "Good corrosion resistance"] },
  { name: "EN AW-6013", category: "aluminum", description: "Aerospace heat-treatable 6000-series.", typicalUse: "Fuselage sheet, aerospace secondary structures.", properties: ["Medium-high strength", "Good machinability", "Better corrosion than 2024"] },
  { name: "EN AW-2024 T3", category: "aluminum", description: "High-strength copper-alloyed aerospace aluminum.", typicalUse: "Aircraft wing structures, tension members.", properties: ["Excellent fatigue strength", "Low corrosion resistance", "Requires cladding/coating"] },
  { name: "EN AW-2014", category: "aluminum", description: "High-hardness copper alloy forging.", typicalUse: "Aerospace fittings, heavy forgings.", properties: ["Very high mechanical strength", "Poor weldability", "Coating recommended"] },
  { name: "EN AW-2219", category: "aluminum", description: "Weldable high-temperature copper alloy.", typicalUse: "Cryogenic rocket fuel tanks, supersonic skin.", properties: ["Good weldability", "Cryogenic to 300°C service", "High fracture toughness"] },
  { name: "EN AW-7020", category: "aluminum", description: "Weldable high-strength zinc-magnesium alloy.", typicalUse: "Bicycle frames, armored vehicle structures.", properties: ["High yield strength", "Naturally aged post-weld", "Good 7xxx weldability"] },
  { name: "EN AW-7050", category: "aluminum", description: "High-toughness thick-plate 7xxx alloy.", typicalUse: "Aircraft bulkheads, wing spars.", properties: ["High yield strength", "Superior SCC resistance vs 7075", "Tight heat treat control"] },
  { name: "EN AW-7075 T6/T73", category: "aluminum", description: "Ultra-high strength zinc-alloyed aerospace aluminum.", typicalUse: "Aerospace primary structure, motorsport.", properties: ["Tensile strength >540 MPa", "Low corrosion resistance", "Welding not recommended"] },
  { name: "EN AW-6069", category: "aluminum", description: "High-strength micro-alloyed 6000 series.", typicalUse: "High-stress bicycle rims, structural tubes.", properties: ["Higher T6 strength than 6061", "Good weld ductility", "Corrosion resistant"] },

  // Copper Alloys
  { name: "Cu-ETP (CW004A)", category: "copper", description: "Electrolytic tough pitch high-conductivity copper.", typicalUse: "Busbars, power cables, electrical contacts.", properties: ["100% IACS conductivity", "Excellent formability", "Corrosion resistant"] },
  { name: "Cu-OF (CW008A)", category: "copper", description: "Oxygen-free high conductivity copper.", typicalUse: "Vacuum electronics, cryogenic leads.", properties: ["Very high conductivity", "No hydrogen embrittlement", "Ultra clean"] },
  { name: "CuSn12 (Bronz)", category: "copper", description: "Tin bronze for bearing bushes.", typicalUse: "Slide bearings, worm wheels, heavy bushings.", properties: ["Wear resistant", "Low friction under load", "Good machinability"] },
  { name: "CuSn8 (Bronz C52100)", category: "copper", description: "Phosphor bronze spring strip.", typicalUse: "Spring clips, switch contacts, diaphragms.", properties: ["High spring resilience", "Good wear resistance", "Corrosion resistant"] },
  { name: "CuSn6", category: "copper", description: "Phosphor bronze wire and strip.", typicalUse: "Electrical springs, contacts, brushes.", properties: ["Good elasticity", "Fatigue resistant", "Formable"] },
  { name: "CuZn37 (CW508L)", category: "copper", description: "Deep-drawing yellow brass (63/37).", typicalUse: "Pressed components, plumbing fittings.", properties: ["Excellent cold forming", "Moderate corrosion resistance", "Good appearance"] },
  { name: "CuZn39Pb3 (CW614N)", category: "copper", description: "Free-machining leaded brass.", typicalUse: "Precision turned parts, valve bodies.", properties: ["100% machinability rating", "Moderate corrosion resistance", "Limited cold forming"] },
  { name: "CuZn36Pb2 (CW603N)", category: "copper", description: "Leaded brass with enhanced cold formability.", typicalUse: "Automotive fittings, plumbing components.", properties: ["High machinability", "Moderate corrosion resistance", "Economic"] },
  { name: "CuAl10Ni5Fe4 (Ni-Al Bronz)", category: "copper", description: "Nickel-aluminum bronze for marine service.", typicalUse: "Marine propellers, seawater valves, pump shafts.", properties: ["High corrosion & cavitation resistance", "High tensile strength", "Non-sparking"] },
  { name: "CuAl11Fe6Ni6 (C95800)", category: "copper", description: "High-nickel aluminum bronze casting.", typicalUse: "Heavy marine hardware, seawater pumps.", properties: ["Very high yield strength", "Excellent marine durability", "Cast alloy"] },
  { name: "CuNi10Fe1Mn", category: "copper", description: "Copper-nickel 90/10 seawater alloy.", typicalUse: "Seawater piping, heat exchanger tubes.", properties: ["Biofouling resistant", "Easily formed and welded", "Cryogenic safe"] },
  { name: "CuNi30Mn1Fe", category: "copper", description: "Copper-nickel 70/30 severe service alloy.", typicalUse: "High-velocity seawater pipes, condensers.", properties: ["High erosion resistance", "Corrosion resistant", "Thermal stable"] },
  { name: "CuBe2", category: "copper", description: "Beryllium copper high-strength alloy.", typicalUse: "Spring contacts, non-sparking safety tools.", properties: ["Tensile up to 1400 MPa", "Good electrical conductivity", "Non-magnetic & non-sparking"], notes: "Beryllium dust is toxic; follow safety standards during grinding." },

  // Titanium
  { name: "Ti Gr2 (CP)", category: "titanium", description: "Commercially pure medium-strength titanium.", typicalUse: "Chemical plant equipment, medical implants.", properties: ["Superior corrosion resistance", "Weldable", "Low density (4.51 g/cm³)"] },
  { name: "Ti Gr5 (Ti-6Al-4V)", category: "titanium", description: "Most widely used alpha-beta titanium alloy.", typicalUse: "Aerospace structures, medical implants, motorsport.", properties: ["High strength-to-weight ratio", "Heat treatable", "Limited cold formability"] },
  { name: "Ti Gr23 (ELI)", category: "titanium", description: "Extra low interstitial Ti-6Al-4V.", typicalUse: "Critical surgical implants, cryogenic tanks.", properties: ["High fracture toughness", "Biocompatible", "High purity"] },
  { name: "Ti Gr9 (Ti-3Al-2.5V)", category: "titanium", description: "Cold-workable near-alpha titanium alloy.", typicalUse: "Hydraulic tubing, bicycle frames.", properties: ["Medium strength", "Cold formable", "Readily weldable"] },

  // Nickel-Based
  { name: "Inconel 625", category: "nickel", description: "Ni-Cr-Mo corrosion & high-temperature superalloy.", typicalUse: "Chemical process, seawater, high-temp exhausts.", properties: ["High nickel base", "Pitting & crevice resistant", "Weldable without post-weld heat treat"] },
  { name: "Inconel 718", category: "nickel", description: "Age-hardenable nickel-chromium superalloy.", typicalUse: "Gas turbine disks, rocket engine components.", properties: ["High strength up to 700°C", "Precipitation hardened", "Good weld crack resistance"] },
  { name: "Hastelloy C276", category: "nickel", description: "Ni-Mo-Cr alloy for severe chemical environments.", typicalUse: "Flue gas desulfurization, acid digesters.", properties: ["Exceptional wet chemical resistance", "Resistant to chlorine ions", "Premium cost"] },
  { name: "Monel 400", category: "nickel", description: "Solid-solution nickel-copper alloy.", typicalUse: "Marine shafts, chemical valves, crude stills.", properties: ["Seawater & acid resistant", "Moderate strength", "High ductility across temps"] },
  { name: "Incoloy 800H", category: "nickel", description: "High-temperature oxidation-resistant Fe-Ni-Cr.", typicalUse: "Petrochemical furnace tubes, reformers.", properties: ["Creep rupture resistant", "Carburization resistant", "Stable at 800°C+"] },

  // Engineering Plastics
  { name: "PA6", category: "plastics", description: "Polyamide 6 (Nylon 6) general engineering plastic.", typicalUse: "Gears, rollers, guide tracks.", properties: ["Medium strength", "Moisture absorbing", "Low sliding friction"] },
  { name: "PA66 GF30", category: "plastics", description: "30% glass fiber reinforced nylon 66.", typicalUse: "Structural housings, engine brackets.", properties: ["High tensile strength", "Increased thermal deflection", "High dimensional stability"] },
  { name: "POM-C (Delrin)", category: "plastics", description: "Acetal copolymer engineering thermoplastic.", typicalUse: "Precision gears, sliding bearings, valves.", properties: ["Low friction coefficient", "High dimensional stability", "Exceptional machinability"] },
  { name: "PEEK", category: "plastics", description: "Polyether ether ketone high-performance plastic.", typicalUse: "Aerospace parts, medical implants, pump gears.", properties: ["Continuous service 250°C", "Broad chemical resistance", "High mechanical stiffness"] },
  { name: "PTFE", category: "plastics", description: "Fluoropolymer with near-zero friction coefficient.", typicalUse: "Gaskets, slide pads, chemical liners.", properties: ["Chemically inert", "Broad temp range (-200 to +260°C)", "Subject to creep/cold flow"] },
  { name: "UHMWPE", category: "plastics", description: "Ultra-high molecular weight polyethylene.", typicalUse: "Wear strips, hopper liners, guide rails.", properties: ["Extremely low friction", "Outstanding abrasion resistance", "Self-lubricating"] },
  { name: "PC (Polikarbonat)", category: "plastics", description: "Impact-resistant transparent polycarbonate.", typicalUse: "Machine guards, sight glasses, protective lenses.", properties: ["High impact resistance", "Optical transparency", "Moderate heat resistance"] },
  { name: "PMMA (Akrilik)", category: "plastics", description: "Rigid transparent acrylic plastic.", typicalUse: "Display panels, visual fluid sight meters.", properties: ["High optical clarity", "Scratch sensitive", "UV stable"] },
  { name: "ABS", category: "plastics", description: "General purpose impact-resistant terpolymer.", typicalUse: "Instrument enclosures, automotive interior trims.", properties: ["Easily machined & painted", "Good dimensional stability", "Moderate chemical resistance"] },
  { name: "PET-G", category: "plastics", description: "Glycol-modified polyethylene terephthalate.", typicalUse: "Thermoformed trays, 3D printed mechanical guards.", properties: ["Transparent", "Low shrinkage", "High toughness"] },
  { name: "PPS", category: "plastics", description: "Polyphenylene sulfide high-temp polymer.", typicalUse: "Automotive fuel parts, electrical connectors.", properties: ["Heat resistant to 200°C+", "Inherent flame resistance", "Zero moisture absorption"] },
  { name: "PVDF", category: "plastics", description: "Polyvinylidene fluoride chemical fluoropolymer.", typicalUse: "Piping in chemical lines, semiconductor valves.", properties: ["High chemical purity", "UV & radiation resistant", "High tensile strength for fluoropolymer"] },
  { name: "PEI (Ultem)", category: "plastics", description: "Polyetherimide high-temperature amorphous plastic.", typicalUse: "Electrical insulators, medical sterilization fixtures.", properties: ["Continuous service to 170°C", "High dielectric strength", "High stiffness"] },
  { name: "HDPE", category: "plastics", description: "High-density polyethylene.", typicalUse: "Chemical storage tanks, cutting blocks, pipe.", properties: ["Chemical resistance", "Impact toughness", "Non-stick surface"] },

  // Elastomers
  { name: "NBR", category: "elastomer", description: "Nitrile butadiene rubber.", typicalUse: "O-rings, hydraulic rod and piston seals.", properties: ["Excellent oil & fuel resistance", "Temperature -30 to +100°C", "Poor ozone & UV resistance"] },
  { name: "HNBR", category: "elastomer", description: "Hydrogenated nitrile butadiene rubber.", typicalUse: "Automotive timing belt seals, air conditioning seals.", properties: ["Superior oil & fuel resistance", "Temperature -30 to +140°C", "Much better ozone resistance than NBR"] },
  { name: "FKM (Viton)", category: "elastomer", description: "Fluoroelastomer synthetic rubber.", typicalUse: "High-temperature shaft seals, chemical O-rings.", properties: ["Continuous -20 to +200°C", "Broad fuel & chemical resistance", "Premium cost"] },
  { name: "FFKM", category: "elastomer", description: "Perfluoroelastomer with highest chemical stability.", typicalUse: "Semiconductor wafer processing, refinery seals.", properties: ["Universal chemical compatibility", "Temperature up to 320°C", "Extremely expensive"] },
  { name: "EPDM", category: "elastomer", description: "Ethylene propylene diene monomer rubber.", typicalUse: "Hot water and steam seals, outdoor gaskets.", properties: ["Excellent steam & weather resistance", "Temperature -40 to +130°C", "Incompatible with mineral oils"] },
  { name: "VMQ (Silikon)", category: "elastomer", description: "Silicone rubber for wide temperature extremes.", typicalUse: "Food grade gaskets, extreme temperature seals.", properties: ["Broad temp range -50 to +200°C", "Ozone & UV resistant", "Poor mechanical wear & oil resistance"] },
  { name: "CR (Neopren)", category: "elastomer", description: "Chloroprene multipurpose synthetic rubber.", typicalUse: "Weather stripping, cable jackets, dust boots.", properties: ["Moderate oil & flame resistance", "Good weathering & ozone resistance", "Temperature -35 to +100°C"] },
  { name: "PU (TPU)", category: "elastomer", description: "Polyurethane elastomer.", typicalUse: "Hydraulic cylinder wipers, wear scrapers.", properties: ["Outstanding abrasion resistance", "Temperature -30 to +90°C", "Sensitive to high-temperature hydrolysis"] },
];

export const getMaterialData = (locale: Locale = "tr") => {
  const isTr = locale === "tr";
  return {
    labels: CATEGORY_LABELS[isTr ? "tr" : "en"],
    extra: CATEGORY_EXTRA[isTr ? "tr" : "en"],
    materials: isTr ? MATERIALS_TR : MATERIALS_EN,
  };
};

// Backward compatibility
export const CATEGORY_LABELS_DEFAULT = CATEGORY_LABELS.tr;
export const CATEGORY_EXTRA_DEFAULT = CATEGORY_EXTRA.tr;
export const MATERIALS = MATERIALS_TR;
