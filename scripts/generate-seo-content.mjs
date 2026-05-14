import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content");
const DATE = "2026-05-09";

const ensureDir = async (dir) => fs.mkdir(dir, { recursive: true });

const list = (items) => items.map((item) => `- ${item}`).join("\n");
const numbered = (items) => items.map((item, index) => `${index + 1}. ${item}`).join("\n");
const yamlArray = (items) => `[${items.map((item) => JSON.stringify(item)).join(", ")}]`;

const frontmatter = ({ title, description, tags, category, readingTime = 6 }) => `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(description)}
date: ${JSON.stringify(DATE)}
tags: ${yamlArray(tags)}
category: ${JSON.stringify(category)}
draft: false
readingTime: ${readingTime}
---

`;

const toolLinks = {
  materials: { href: "/materials", tr: "Malzeme Kütüphanesi", en: "Materials Library" },
  reference: { href: "/reference", tr: "Hızlı Referans Merkezi", en: "Quick Reference Center" },
  unit: { href: "/tools/unit-converter", tr: "Birim Dönüştürücü", en: "Unit Converter" },
  bolt: { href: "/tools/bolt-calculator", tr: "Cıvata Boyut ve Ön Yük Hesaplayıcı", en: "Bolt Size and Torque Calculator" },
  torque: { href: "/tools/torque-power", tr: "Güç - Tork - Devir Hesaplayıcı", en: "Power - Torque - RPM Calculator" },
  shaft: { href: "/tools/shaft-torsion", tr: "Mil Burulma Hesaplayıcı", en: "Shaft Torsion Calculator" },
  simpleStress: { href: "/tools/simple-stress", tr: "Çekme Gerilmesi Hesaplayıcı", en: "Tensile Stress Calculator" },
  bearing: { href: "/tools/bearing-life", tr: "Rulman Ömrü Hesaplayıcı", en: "Bearing Life Calculator" },
  belt: { href: "/tools/belt-length", tr: "Kasnak Kayış Uzunluğu Hesaplayıcı", en: "Pulley Belt Length Calculator" },
  bending: { href: "/tools/bending-stress", tr: "Eğilme ve Sehim Hesaplayıcı", en: "Bending and Deflection Calculator" },
  weld: { href: "/tools/fillet-weld", tr: "Köşe Kaynak Boyutlandırma", en: "Fillet Weld Sizing Calculator" },
  pipe: { href: "/tools/pipe-pressure-loss", tr: "Boru Basınç Kaybı Hesaplayıcı", en: "Pipe Pressure Loss Calculator" },
  hydraulic: { href: "/tools/hydraulic-cylinder", tr: "Hidrolik Silindir Kuvvet ve Hız", en: "Hydraulic Cylinder Force and Speed" },
  gear: { href: "/tools/gear-design", tr: "Dişli Tasarımı", en: "Gear Design" },
  gearBacklash: { href: "/tools/gear-design/calculators/backlash-calculator", tr: "Dişli Backlash Hesaplayıcı", en: "Gear Backlash Calculator" },
  quality: { href: "/quality-tools", tr: "Kalite Araçları", en: "Quality Tools" },
  fixture: { href: "/fixture-tools", tr: "Fikstür Araçları", en: "Fixture Tools" },
};

const glossaryLinks = {
  torque: { href: "/glossary/torque", tr: "Tork", en: "Torque" },
  stress: { href: "/glossary/stress", tr: "Gerilme", en: "Stress" },
  tolerance: { href: "/glossary/tolerance", tr: "Tolerans", en: "Tolerance" },
  viscosity: { href: "/glossary/viscosity", tr: "Viskozite", en: "Viscosity" },
  fatigue: { href: "/glossary/fatigue", tr: "Yorulma", en: "Fatigue" },
  corrosion: { href: "/glossary/corrosion-resistance", tr: "Korozyon direnci", en: "Corrosion resistance" },
  reynolds: { href: "/glossary/reynolds-number", tr: "Reynolds sayısı", en: "Reynolds number" },
  safety: { href: "/glossary/factor-of-safety", tr: "Güvenlik faktörü", en: "Factor of safety" },
  hardness: { href: "/glossary/hardness", tr: "Sertlik", en: "Hardness" },
};

const guides = [
  {
    slug: "malzeme-secimi-rehberi",
    tr: {
      title: "Doğru malzeme seçimi rehberi",
      description: "Çelik, alüminyum, paslanmaz ve titanyum arasında seçim yaparken dayanım, ağırlık, maliyet ve korozyon kriterlerini birlikte değerlendirin.",
      category: "Malzeme",
      tags: ["malzeme seçimi", "çelik", "alüminyum", "korozyon"],
      problem: "Malzeme seçimi sadece en yüksek dayanımı seçmek değildir. Tasarım yükleri, ortam, üretim yöntemi, tedarik riski ve bakım stratejisi aynı karar tablosunda ele alınmalıdır.",
      assumptions: ["Yükler statik veya düşük çevrimli kabul edilir.", "Malzeme değerleri tipik katalog değeridir.", "Nihai seçim tedarikçi sertifikası ve sorumlu mühendis onayı ile doğrulanır."],
      steps: ["Çalışma yükünü, sıcaklığı ve ortamı yaz.", "Akma dayanımı, elastisite modülü, yoğunluk ve korozyon direncini karşılaştır.", "Üretim yöntemini ve yüzey işlem ihtiyacını not et.", "Maliyet, bulunabilirlik ve bakım etkisini puanla.", "Kritik parça için ikinci bir alternatif malzeme belirle."],
      mistakes: ["Sadece çekme dayanımına bakmak.", "Korozyon ve yüzey işlemini kararın dışında bırakmak.", "Tedarik edilemeyen kaliteyi tasarımın ana varsayımı yapmak."],
      faq: [
        ["Malzeme seçiminde ilk kriter ne olmalı?", "Önce yük durumu ve servis ortamı netleştirilmelidir; sonra dayanım, ağırlık ve imalat uygunluğu birlikte puanlanır."],
        ["Çelik mi alüminyum mu daha iyi?", "Tek bir doğru yoktur. Çelik dayanım ve maliyet için, alüminyum ağırlık ve korozyon davranışı için avantaj sağlayabilir."],
        ["Korozyon riski nasıl hesaba katılır?", "Ortam sınıfı, yüzey işlemi ve bakım aralığı birlikte değerlendirilir; dış ortamda kaplama veya paslanmaz kalite gerekebilir."],
      ],
    },
    en: {
      title: "Material selection guide",
      description: "Compare steel, aluminum, stainless steel, and titanium with strength, weight, cost, and corrosion criteria in one engineering workflow.",
      category: "Materials",
      tags: ["material selection", "steel", "aluminum", "corrosion"],
      problem: "Material selection is not the same as choosing the strongest alloy. Loads, environment, manufacturing route, supply risk, and maintenance strategy should be reviewed in one decision table.",
      assumptions: ["Loads are static or low-cycle unless stated otherwise.", "Material values are typical catalog values.", "Final selection is confirmed with supplier data and engineering approval."],
      steps: ["Write the load case, temperature, and operating environment.", "Compare yield strength, modulus, density, and corrosion resistance.", "Record manufacturing route and surface treatment needs.", "Score cost, availability, and maintenance impact.", "Choose a backup material for critical parts."],
      mistakes: ["Looking only at ultimate tensile strength.", "Leaving corrosion and coating decisions until the end.", "Designing around a grade that is hard to source."],
      faq: [
        ["What is the first material selection criterion?", "Define the load case and service environment first, then score strength, weight, and manufacturability together."],
        ["Is steel or aluminum better?", "There is no universal answer. Steel often wins on strength and cost; aluminum can win on weight and corrosion behavior."],
        ["How should corrosion risk be included?", "Review exposure class, surface treatment, and maintenance interval together; outdoor service may require coating or stainless grades."],
      ],
    },
    links: ["materials", "reference", "simpleStress"],
    glossary: ["corrosion", "stress", "safety"],
  },
  {
    slug: "standart-birim-sistemi-rehberi",
    tr: {
      title: "Standart birim sistemi rehberi",
      description: "SI, metrik ve imperial birimleri karıştırmadan hesap yapmak için temel dönüşüm ve dokümantasyon kontrol listesi.",
      category: "Standartlar",
      tags: ["birim dönüşümü", "SI", "ISO", "standart"],
      problem: "Birim hataları doğru formülü yanlış sonuca çevirebilir. Özellikle basınç, moment, enerji ve kesit alanı hesaplarında birim seti baştan kilitlenmelidir.",
      assumptions: ["Ana hesap sistemi SI olarak seçilir.", "Tedarikçi verisi farklı birimde gelirse kaynak birim not edilir.", "Rapor çıktısında giriş ve sonuç birimleri birlikte gösterilir."],
      steps: ["Proje ana birimini belirle.", "Gelen veriyi kaynak birimiyle birlikte kaydet.", "Dönüşümü hesap öncesinde yap ve yuvarlama seviyesini yaz.", "Sonuçları aynı birim ailesinde raporla.", "Kritik değerler için ters dönüşümle hızlı kontrol yap."],
      mistakes: ["N/mm2 ile MPa eşdeğerliğini unutmak.", "mm ve m birimlerini aynı formülde karıştırmak.", "Torkta N m ile N mm arasındaki 1000 katsayısını atlamak."],
      faq: [
        ["N/mm2 ile MPa aynı mı?", "Evet, 1 N/mm2 değeri 1 MPa değerine eşittir."],
        ["Ana birim sistemi nasıl seçilir?", "Ekip, tedarikçi ve standart gereksinimine göre seçilir; mekanik hesaplarda SI tabanı en güvenli başlangıçtır."],
        ["Yuvarlama ne zaman yapılmalı?", "Ara adımlarda ham değer korunmalı, raporda anlamlı basamakla yuvarlanmalıdır."],
      ],
    },
    en: {
      title: "Standard unit system guide",
      description: "A practical checklist for SI, metric, and imperial engineering calculations without hidden unit conversion errors.",
      category: "Standards",
      tags: ["unit conversion", "SI", "ISO", "standards"],
      problem: "Unit mistakes can turn a correct formula into a wrong result. Pressure, torque, energy, and section calculations need a locked unit system before calculation starts.",
      assumptions: ["SI is selected as the primary calculation system.", "Supplier data keeps its source unit in the notes.", "Reports show input and output units together."],
      steps: ["Choose the project base unit system.", "Record incoming data with source units.", "Convert before calculation and document rounding.", "Report results in one unit family.", "Check critical values with a reverse conversion."],
      mistakes: ["Forgetting that N/mm2 equals MPa.", "Mixing mm and m in the same formula.", "Missing the 1000 factor between N m and N mm torque."],
      faq: [
        ["Are N/mm2 and MPa equivalent?", "Yes. 1 N/mm2 equals 1 MPa."],
        ["How do I choose a base unit system?", "Use the system required by the team, supplier, and standard; SI is usually the safest engineering baseline."],
        ["When should values be rounded?", "Keep raw values through intermediate steps and round only for report readability."],
      ],
    },
    links: ["unit", "reference", "pipe"],
    glossary: ["stress", "torque"],
  },
  {
    slug: "civata-basi-sekilleri-ve-turleri",
    tr: {
      title: "Cıvata başı şekilleri ve türleri rehberi",
      description: "Altı köşe, alyan, bombe baş ve havşa baş cıvataların tasarım, montaj ve servis açısından karşılaştırması.",
      category: "Bağlantı Elemanları",
      tags: ["cıvata", "bağlantı", "tork", "ISO"],
      problem: "Cıvata başı seçimi montaj alanını, sıkma torkunu, servis erişimini ve yüzey temasını doğrudan etkiler. Yanlış baş tipi iyi hesaplanmış bir bağlantıyı sahada zorlaştırabilir.",
      assumptions: ["Bağlantı yükü ve ön yük hedefi belirlenmiştir.", "Standart metrik cıvata aileleri kullanılır.", "Montaj takımı erişimi tasarım sırasında kontrol edilir."],
      steps: ["Erişim ve takım boşluğunu kontrol et.", "Ön yük ve tork ihtiyacını belirle.", "Yüzey temasını ve rondela gereksinimini incele.", "Korozyon ve sökme takma sıklığını not et.", "Standart baş tipleriyle parça ağacını sadeleştir."],
      mistakes: ["Alyan baş için takım giriş derinliğini unutmak.", "Havşa başta temas alanını fazla iyimser almak.", "Cıvata sınıfı ile baş tipi standardını karıştırmak."],
      faq: [
        ["Altı köşe cıvata ne zaman uygundur?", "Yüksek sıkma torku ve kolay servis erişimi istendiğinde iyi bir varsayılan seçimdir."],
        ["Havşa baş cıvata taşıyıcı bağlantıda kullanılır mı?", "Kullanılabilir ama temas gerilmesi ve yüzey kalitesi dikkatle kontrol edilmelidir."],
        ["Alyan başın avantajı nedir?", "Dar alanlarda kompakt montaj sağlar; takım kalitesi ve yuva aşınması kontrol edilmelidir."],
      ],
    },
    en: {
      title: "Bolt head types guide",
      description: "Compare hex, socket head, button head, and countersunk bolts for design, assembly, and service access.",
      category: "Fasteners",
      tags: ["bolt", "fastener", "torque", "ISO"],
      problem: "Bolt head selection affects tool clearance, tightening torque, service access, and bearing contact. A poor head choice can make a well-calculated joint difficult to assemble.",
      assumptions: ["Joint load and preload target are known.", "Standard metric bolt families are used.", "Tool access is checked during design."],
      steps: ["Check tool access and clearance.", "Define preload and tightening torque needs.", "Review bearing contact and washer needs.", "Record corrosion and service frequency.", "Keep the bill of materials simple with standard head types."],
      mistakes: ["Forgetting socket key insertion depth.", "Overestimating countersunk bearing contact.", "Mixing bolt property class with head style standards."],
      faq: [
        ["When is a hex head bolt suitable?", "It is a strong default when high tightening torque and easy service access are needed."],
        ["Can countersunk bolts carry structural loads?", "They can, but contact stress and surface quality must be checked carefully."],
        ["What is the advantage of socket head bolts?", "They save space in compact assemblies, but tool quality and socket wear matter."],
      ],
    },
    links: ["bolt", "reference", "unit"],
    glossary: ["torque", "stress", "tolerance"],
  },
  {
    slug: "kama-tasarimi-101",
    tr: {
      title: "Kama tasarımı 101",
      description: "Basit makinelerde kama geometrisi, sürtünme açısı ve kuvvet dağılımı için pratik başlangıç rehberi.",
      category: "Makine Elemanları",
      tags: ["kama", "mekanizma", "sürtünme", "kuvvet"],
      problem: "Kama, küçük bir giriş kuvvetini yüksek normal kuvvete dönüştürebilir. Ancak sürtünme, malzeme ezilmesi ve yüzey kalitesi kontrol edilmezse kilitlenme veya aşınma oluşur.",
      assumptions: ["Kama rijit kabul edilir.", "Sürtünme katsayısı yüzey çifti için tahmini alınır.", "Temas basıncı emniyetli sınırda tutulur."],
      steps: ["Kama açısını ve temas boyunu belirle.", "Giriş kuvveti ile normal kuvvet ilişkisini yaz.", "Sürtünme açısını kontrol et.", "Yüzey basıncını ve malzeme ezilmesini incele.", "Geri sökme ve yağlama ihtiyacını planla."],
      mistakes: ["Sürtünmeyi sıfır kabul etmek.", "Temas alanını gerçek yüzeyden büyük almak.", "Kilitlenme koşulunu montaj sonrası fark etmek."],
      faq: [
        ["Kama açısı küçülürse ne olur?", "Aynı giriş kuvvetiyle normal kuvvet artar; fakat sürtünme ve kilitlenme riski de yükselir."],
        ["Kama için hangi malzeme uygundur?", "Temas basıncına dayanacak, aşınma davranışı bilinen ve işlenebilir bir malzeme seçilmelidir."],
        ["Yağlama gerekli mi?", "Yüksek temas basıncı veya sık hareket varsa yağlama aşınmayı azaltır."],
      ],
    },
    en: {
      title: "Wedge design 101",
      description: "A starter guide for wedge geometry, friction angle, and force distribution in simple machines.",
      category: "Machine Elements",
      tags: ["wedge", "mechanism", "friction", "force"],
      problem: "A wedge can transform a small input force into a high normal force. If friction, crushing stress, and surface quality are ignored, locking or wear can appear.",
      assumptions: ["The wedge is treated as rigid.", "Friction coefficient is estimated for the surface pair.", "Contact pressure stays within a safe material limit."],
      steps: ["Define wedge angle and contact length.", "Write the relation between input force and normal force.", "Check the friction angle.", "Review surface pressure and local crushing.", "Plan release direction and lubrication."],
      mistakes: ["Assuming zero friction.", "Using a contact area larger than the real surface.", "Discovering self-locking only after assembly."],
      faq: [
        ["What happens when wedge angle decreases?", "Normal force rises for the same input force, but friction and locking risk also increase."],
        ["Which material works for a wedge?", "Use a machinable material with known wear behavior and enough contact pressure capacity."],
        ["Is lubrication needed?", "Lubrication reduces wear when contact pressure or motion frequency is high."],
      ],
    },
    links: ["fixture", "reference", "simpleStress"],
    glossary: ["stress", "safety"],
  },
  {
    slug: "pompa-turleri-secim-rehberi",
    tr: {
      title: "Pompa türleri seçim rehberi",
      description: "Pozitif deplasmanlı ve turbo pompaları debi, basınç, viskozite ve servis koşullarına göre karşılaştırın.",
      category: "Akışkanlar",
      tags: ["pompa", "debi", "basınç", "viskozite"],
      problem: "Pompa seçimi sadece hedef debiyi tutturmak değildir. Akışkan viskozitesi, basınç kaybı, kavitasyon riski ve kontrol yöntemi pompa tipini belirler.",
      assumptions: ["Akışkan tek fazlı kabul edilir.", "Boru hattı kayıpları yaklaşık olarak bilinir.", "Sürekli çalışma noktası tasarım noktasına yakın tutulur."],
      steps: ["Debi ve basma yüksekliği ihtiyacını yaz.", "Akışkan viskozitesi ve sıcaklığını kontrol et.", "Pozitif deplasmanlı ve santrifüj seçenekleri karşılaştır.", "Kavitasyon ve NPSH payını incele.", "Kontrol vanası veya hız kontrol stratejisini belirle."],
      mistakes: ["Pompayı sadece maksimum debiye göre seçmek.", "Viskozite artışını motor gücüne yansıtmamak.", "Emiş hattında kavitasyon riskini unutmak."],
      faq: [
        ["Santrifüj pompa ne zaman uygundur?", "Düşük-orta viskozite ve değişken debi ihtiyaçlarında genellikle iyi bir seçimdir."],
        ["Pozitif deplasmanlı pompa ne zaman seçilir?", "Yüksek viskozite, hassas dozaj veya yüksek basınç gerektiğinde avantaj sağlar."],
        ["Kavitasyon nasıl azaltılır?", "Emiş kayıpları azaltılır, NPSH payı artırılır ve pompa çalışma noktası doğru seçilir."],
      ],
    },
    en: {
      title: "Pump type selection guide",
      description: "Compare positive displacement and dynamic pumps by flow, pressure, viscosity, and service conditions.",
      category: "Fluids",
      tags: ["pump", "flow", "pressure", "viscosity"],
      problem: "Pump selection is more than meeting a target flow rate. Fluid viscosity, pressure loss, cavitation risk, and control method determine the right pump type.",
      assumptions: ["The fluid is treated as single phase.", "Pipe losses are approximately known.", "Continuous operating point stays near the design point."],
      steps: ["Write the required flow and head.", "Check fluid viscosity and temperature.", "Compare positive displacement and centrifugal options.", "Review cavitation and NPSH margin.", "Choose valve control or speed control strategy."],
      mistakes: ["Sizing only for maximum flow.", "Ignoring viscosity impact on motor power.", "Forgetting cavitation risk in the suction line."],
      faq: [
        ["When is a centrifugal pump suitable?", "It is usually suitable for low to medium viscosity and variable flow duties."],
        ["When should a positive displacement pump be used?", "It helps with high viscosity, precise dosing, or high pressure requirements."],
        ["How can cavitation be reduced?", "Reduce suction losses, increase NPSH margin, and select the correct operating point."],
      ],
    },
    links: ["pipe", "hydraulic", "unit"],
    glossary: ["viscosity", "reynolds"],
  },
  {
    slug: "viskozite-siniflandirmasi-rehberi",
    tr: {
      title: "Viskozite sınıflandırması rehberi",
      description: "ISO VG, SAE ve yağ sınıflarını karıştırmadan viskozite seçimi yapmak için pratik mühendislik notları.",
      category: "Akışkanlar",
      tags: ["viskozite", "yağlama", "ISO VG", "SAE"],
      problem: "Yanlış viskozite seçimi sürtünmeyi, sıcaklığı, enerji tüketimini ve yatak ömrünü etkiler. ISO VG ve SAE sınıfları aynı şeyi anlatmaz; kullanım sıcaklığı mutlaka hesaba katılmalıdır.",
      assumptions: ["Yağ üreticisi veri sayfası mevcuttur.", "Çalışma sıcaklığı aralığı bilinir.", "Uygulama sürekli yağ filmine ihtiyaç duyar."],
      steps: ["Çalışma sıcaklığı ve hızını belirle.", "Üretici tavsiyesindeki viskozite aralığını oku.", "ISO VG sınıfını işletme sıcaklığına göre kontrol et.", "Düşük sıcaklık ilk hareket ve yüksek sıcaklık film kalınlığını birlikte değerlendir.", "Bakım planına uygun stok sınıfı seç."],
      mistakes: ["40 C değerini işletme sıcaklığı sanmak.", "SAE motor yağı sınıfını endüstriyel yağla bire bir eşleştirmek.", "Viskozite arttıkça her zaman daha iyi koruma olacağını varsaymak."],
      faq: [
        ["ISO VG neyi ifade eder?", "Yağın 40 C sıcaklıktaki kinematik viskozite sınıfını belirtir."],
        ["Yüksek viskozite her zaman iyi midir?", "Hayır. Film dayanımı artabilir ama pompalama kaybı ve sıcaklık da artabilir."],
        ["SAE ile ISO VG aynı mı?", "Hayır; farklı sınıflandırma sistemleridir ve doğrudan eşleştirme dikkat ister."],
      ],
    },
    en: {
      title: "Viscosity classification guide",
      description: "Practical notes for choosing viscosity without mixing ISO VG, SAE, and lubricant grade systems.",
      category: "Fluids",
      tags: ["viscosity", "lubrication", "ISO VG", "SAE"],
      problem: "Wrong viscosity affects friction, temperature, energy use, and bearing life. ISO VG and SAE grades do not describe the same scale, and operating temperature must be included.",
      assumptions: ["A lubricant data sheet is available.", "Operating temperature range is known.", "The application needs a continuous oil film."],
      steps: ["Define operating temperature and speed.", "Read the manufacturer recommended viscosity range.", "Check ISO VG at operating temperature.", "Balance cold start behavior and high temperature film thickness.", "Choose a stocked grade that fits maintenance practice."],
      mistakes: ["Treating the 40 C value as operating temperature.", "Mapping SAE engine oil grades directly to industrial oils.", "Assuming higher viscosity is always better protection."],
      faq: [
        ["What does ISO VG mean?", "It defines the kinematic viscosity class of the oil at 40 C."],
        ["Is high viscosity always better?", "No. Film strength may improve, but pumping loss and temperature can also increase."],
        ["Are SAE and ISO VG the same?", "No. They are different grading systems and should be compared carefully."],
      ],
    },
    links: ["pipe", "gear", "reference"],
    glossary: ["viscosity", "reynolds"],
  },
  {
    slug: "korozyon-direnci-paslanmaz-celik-secimi",
    tr: {
      title: "Korozyon direnci ve paslanmaz çelik seçimi",
      description: "304, 316 ve martenzitik paslanmaz çelikleri ortam, sıcaklık ve üretim ihtiyacına göre karşılaştırın.",
      category: "Malzeme",
      tags: ["paslanmaz çelik", "korozyon", "malzeme seçimi"],
      problem: "Paslanmaz çelik seçimi sadece krom oranına bakılarak yapılmaz. Klorür, sıcaklık, kaynak, temizlik kimyasalları ve yüzey pürüzlülüğü korozyon davranışını değiştirir.",
      assumptions: ["Servis ortamı ve temizlik kimyası bilinir.", "Parça yüzey işlemi kontrol edilebilir.", "Mekanik dayanım ve korozyon direnci birlikte değerlendirilir."],
      steps: ["Ortamı kuru, nemli, klorürlü veya kimyasal olarak sınıflandır.", "304 ve 316 gibi yaygın seçenekleri karşılaştır.", "Kaynak sonrası pasivasyon ihtiyacını belirle.", "Yüzey pürüzlülüğü ve temizlenebilirlik hedefini yaz.", "Maliyet ve bulunabilirliği son kontrol olarak puanla."],
      mistakes: ["Her paslanmaz çeliği deniz ortamına uygun sanmak.", "Kaynak sonrası ısı etkisini ve pasivasyonu unutmak.", "Pürüzlü yüzeyde kir tutunmasını hesaba katmamak."],
      faq: [
        ["304 ile 316 arasındaki temel fark nedir?", "316 molibden içerdiği için klorürlü ortamlarda genellikle daha iyi direnç verir."],
        ["Paslanmaz çelik paslanır mı?", "Uygun olmayan ortam, yüzey hasarı veya yanlış temizlik kimyası ile lokal korozyon görülebilir."],
        ["Kaynak sonrası neden pasivasyon yapılır?", "Isı etkisiyle bozulan yüzey tabakasını geri kazanmak ve korozyon riskini azaltmak için yapılır."],
      ],
    },
    en: {
      title: "Corrosion resistance and stainless steel selection",
      description: "Compare 304, 316, and martensitic stainless steels by environment, temperature, and manufacturing needs.",
      category: "Materials",
      tags: ["stainless steel", "corrosion", "material selection"],
      problem: "Stainless steel selection is not just a chromium percentage check. Chlorides, temperature, welding, cleaning chemicals, and surface roughness change corrosion behavior.",
      assumptions: ["Service environment and cleaning chemicals are known.", "Surface finish can be controlled.", "Mechanical strength and corrosion resistance are reviewed together."],
      steps: ["Classify the environment as dry, humid, chloride, or chemical.", "Compare common options such as 304 and 316.", "Define post-weld passivation needs.", "Write the surface roughness and cleanability target.", "Score cost and availability as the final check."],
      mistakes: ["Assuming every stainless steel suits marine service.", "Forgetting heat affected zones and passivation after welding.", "Ignoring dirt retention on rough surfaces."],
      faq: [
        ["What is the main difference between 304 and 316?", "316 contains molybdenum and usually performs better in chloride environments."],
        ["Can stainless steel rust?", "Yes. Wrong environment, surface damage, or aggressive cleaning chemicals can cause local corrosion."],
        ["Why passivate after welding?", "It helps recover the protective surface layer and reduces corrosion risk."],
      ],
    },
    links: ["materials", "reference", "weld"],
    glossary: ["corrosion", "stress"],
  },
  {
    slug: "titanyum-alasimlari-rehberi",
    tr: {
      title: "Titanyum alaşımları rehberi",
      description: "Ti-6Al-4V ve benzeri titanyum alaşımlarını hafiflik, korozyon direnci, maliyet ve işlenebilirlik açısından değerlendirin.",
      category: "Malzeme",
      tags: ["titanyum", "malzeme seçimi", "hafif tasarım"],
      problem: "Titanyum yüksek özgül dayanım ve iyi korozyon direnci sunar, ancak maliyet, tedarik ve işleme zorluğu tasarım kararını sınırlar.",
      assumptions: ["Yüksek değerli veya ağırlık hassas bir uygulama değerlendirilir.", "Tedarikçi veri sayfası ve kalite sertifikası kullanılacaktır.", "İşleme ve yüzey işlemi maliyeti karar tablosuna alınır."],
      steps: ["Ağırlık kazancının projedeki değerini hesapla.", "Ti-6Al-4V ve saf titanyum seçeneklerini karşılaştır.", "Elastisite modülü ve temas aşınmasını kontrol et.", "CNC parametreleri ve takım maliyetini not et.", "Kritik parçada izlenebilir sertifika şartı koy."],
      mistakes: ["Titanyumu çelik gibi işlemek.", "Düşük elastisite modülünün sehim etkisini unutmak.", "Galvanik korozyon çiftlerini dikkate almamak."],
      faq: [
        ["Titanyum neden pahalıdır?", "Hammadde, işleme ve tedarik zinciri maliyetleri çelik ve alüminyuma göre daha yüksektir."],
        ["Titanyum her zaman alüminyumdan güçlü müdür?", "Dayanım/ağırlık oranı yüksek olabilir, ancak alaşım ve ısıl işlem durumuna göre karşılaştırılmalıdır."],
        ["Titanyum işlenirken nelere dikkat edilir?", "Isı birikimi, takım aşınması ve uygun kesme sıvısı kritik konulardır."],
      ],
    },
    en: {
      title: "Titanium alloys guide",
      description: "Evaluate Ti-6Al-4V and similar titanium alloys by weight, corrosion resistance, cost, and machinability.",
      category: "Materials",
      tags: ["titanium", "material selection", "lightweight design"],
      problem: "Titanium offers high specific strength and corrosion resistance, but cost, supply, and machining difficulty limit the decision.",
      assumptions: ["A high-value or weight-sensitive application is being evaluated.", "Supplier data sheets and certificates will be used.", "Machining and finishing cost are included in the decision table."],
      steps: ["Calculate the project value of weight reduction.", "Compare Ti-6Al-4V and commercially pure titanium.", "Check modulus and contact wear behavior.", "Record CNC parameters and tool cost.", "Require traceable certification for critical parts."],
      mistakes: ["Machining titanium like steel.", "Forgetting deflection impact from lower modulus.", "Ignoring galvanic corrosion pairs."],
      faq: [
        ["Why is titanium expensive?", "Raw material, machining, and supply chain costs are higher than common steels and aluminum."],
        ["Is titanium always stronger than aluminum?", "It can have high strength-to-weight ratio, but alloy and heat treatment condition must be compared."],
        ["What matters when machining titanium?", "Heat buildup, tool wear, and suitable cutting fluid are critical."],
      ],
    },
    links: ["materials", "reference", "unit"],
    glossary: ["stress", "fatigue", "corrosion"],
  },
  {
    slug: "kaynakli-tasarim-guvenlik-maliyet",
    tr: {
      title: "Kaynaklı tasarımda güvenlik ve maliyet dengesi",
      description: "Köşe kaynak ve tam nüfuziyet kaynak seçiminde yük yolu, kalite kontrol, deformasyon ve maliyet etkilerini birlikte değerlendirin.",
      category: "İmalat",
      tags: ["kaynak", "fillet weld", "maliyet", "kalite"],
      problem: "Kaynaklı tasarımda fazla güvenli görünen çözüm gereksiz maliyet ve deformasyon oluşturabilir; zayıf çözüm ise yorulma ve çatlak riski taşır.",
      assumptions: ["Yük yolu ve kaynak erişimi bilinir.", "Malzeme kaynaklanabilirliği kontrol edilir.", "Kalite kontrol seviyesi uygulama kritikliğine göre seçilir."],
      steps: ["Yük yönünü ve etkin kaynak boyunu belirle.", "Köşe kaynak ve tam nüfuziyet seçeneklerini karşılaştır.", "Isı girdisi ve çarpılma riskini not et.", "Kontrol yöntemini ve kabul kriterini yaz.", "Maliyet etkisini kaynak boyu, hazırlık ve kontrol olarak ayır."],
      mistakes: ["Kaynak boyunu tüm geometrik çevre sanmak.", "Yorulma etkisini statik hesapla geçmek.", "Kaynak sonrası deformasyon için fikstür planlamamak."],
      faq: [
        ["Köşe kaynak ne zaman yeterlidir?", "Yük seviyesi ve yorulma etkisi sınırlıysa, doğru boğaz kalınlığı ile yeterli olabilir."],
        ["Tam nüfuziyet kaynak her zaman daha iyi mi?", "Hayır. Daha yüksek kalite sağlayabilir ama hazırlık, kontrol ve deformasyon maliyeti artar."],
        ["Kaynakta en sık hata nedir?", "Etkin kaynak boyu ve yük yönünü gerçek montaj koşuluna göre kontrol etmemektir."],
      ],
    },
    en: {
      title: "Welded design safety and cost balance",
      description: "Evaluate load path, inspection, distortion, and cost when choosing fillet or full-penetration welds.",
      category: "Manufacturing",
      tags: ["welding", "fillet weld", "cost", "quality"],
      problem: "In welded design, an overly conservative solution can add cost and distortion, while a weak solution can create fatigue and crack risk.",
      assumptions: ["Load path and weld access are known.", "Material weldability is checked.", "Inspection level is selected by application criticality."],
      steps: ["Define load direction and effective weld length.", "Compare fillet and full-penetration options.", "Record heat input and distortion risk.", "Write inspection method and acceptance criteria.", "Split cost into weld length, preparation, and inspection."],
      mistakes: ["Treating the full geometric perimeter as effective weld length.", "Passing fatigue risk with a static-only check.", "Not planning fixtures for post-weld distortion."],
      faq: [
        ["When is a fillet weld enough?", "It may be enough when load and fatigue effects are limited and throat size is correct."],
        ["Is full-penetration welding always better?", "No. It can improve quality but adds preparation, inspection, and distortion cost."],
        ["What is the most common weld design mistake?", "Not checking effective weld length and load direction against the real assembly."],
      ],
    },
    links: ["weld", "bending", "quality"],
    glossary: ["stress", "fatigue", "safety"],
  },
  {
    slug: "press-fit-baglantilari-tolerans-secimi",
    tr: {
      title: "Press fit bağlantılarında tolerans seçimi",
      description: "Sıkı geçme bağlantılarda tolerans, montaj kuvveti, yüzey pürüzlülüğü ve servis güvenliği için kontrol listesi.",
      category: "Tolerans",
      tags: ["press fit", "tolerans", "geçme", "montaj"],
      problem: "Sıkı geçme bağlantıda fazla girişim montaj hasarı oluşturabilir, düşük girişim ise servis sırasında gevşemeye yol açar.",
      assumptions: ["Mil ve delik malzemeleri elastik aralıkta kalır.", "Yüzey pürüzlülüğü ve yuvarlaklık kontrol edilir.", "Montaj sıcaklık farkı veya pres kuvveti planlanır."],
      steps: ["Çap ve yük aktarım ihtiyacını belirle.", "ISO geçme ailesinden başlangıç toleransı seç.", "Girişim aralığını minimum ve maksimum olarak hesapla.", "Montaj kuvveti veya ısıl montaj stratejisini yaz.", "Sökme, servis ve yüzey hasarı riskini değerlendir."],
      mistakes: ["Nominal çapı tolerans aralığı sanmak.", "Yüzey pürüzlülüğünün gerçek girişimi azaltmasını unutmak.", "İnce cidarlı parçadaki gerilmeyi kontrol etmemek."],
      faq: [
        ["Press fit ne zaman kullanılır?", "Boşluksuz, kompakt ve kaymaya dirençli bir bağlantı gerektiğinde kullanılır."],
        ["Isıl montaj ne sağlar?", "Geçici genleşme veya büzülme ile montaj kuvvetini düşürür."],
        ["En kritik tolerans hangisidir?", "Minimum girişim yük aktarımı için, maksimum girişim de montaj hasarı için kritiktir."],
      ],
    },
    en: {
      title: "Press fit tolerance selection guide",
      description: "A checklist for interference fit tolerance, assembly force, surface roughness, and service reliability.",
      category: "Tolerance",
      tags: ["press fit", "tolerance", "interference", "assembly"],
      problem: "Too much interference can damage parts during assembly; too little can allow loosening in service.",
      assumptions: ["Shaft and hub materials stay elastic.", "Surface roughness and roundness are controlled.", "Thermal assembly or press force is planned."],
      steps: ["Define diameter and load transfer need.", "Choose a starting ISO fit family.", "Calculate minimum and maximum interference.", "Write assembly force or thermal assembly strategy.", "Review removal, service, and surface damage risk."],
      mistakes: ["Treating nominal diameter as the tolerance range.", "Forgetting roughness reduces effective interference.", "Not checking stresses in thin-walled hubs."],
      faq: [
        ["When is a press fit used?", "It is used when a compact, backlash-free, slip-resistant connection is needed."],
        ["What does thermal assembly provide?", "Temporary expansion or contraction lowers assembly force."],
        ["Which tolerance limit matters most?", "Minimum interference matters for load transfer; maximum interference matters for assembly damage."],
      ],
    },
    links: ["reference", "fixture", "unit"],
    glossary: ["tolerance", "stress", "safety"],
  },
  {
    slug: "cnc-makineleme-malzeme-secimi",
    tr: {
      title: "CNC makinelemede malzeme seçimi ve kesme hızı",
      description: "Çelik, alüminyum, paslanmaz ve titanyum işlerken kesme hızı, ilerleme ve takım ömrü için hızlı karar rehberi.",
      category: "İmalat",
      tags: ["CNC", "makineleme", "kesme hızı", "malzeme"],
      problem: "Aynı geometri farklı malzemelerde tamamen farklı kesme davranışı gösterir. Yanlış kesme hızı takım aşınması, yüzey kalitesi ve ölçü stabilitesini bozar.",
      assumptions: ["Takım üreticisi önerileri başlangıç alınır.", "Makine rijitliği ve bağlama güvenliği yeterlidir.", "Soğutma veya yağlama stratejisi belirlenir."],
      steps: ["Malzeme grubunu ve sertliği yaz.", "Takım malzemesi ve kaplamasını seç.", "Kesme hızı ve ilerlemeyi üretici aralığından başlat.", "Deneme parçasında talaş, sıcaklık ve yüzeyi izle.", "Takım ömrüne göre parametreyi kademeli düzelt."],
      mistakes: ["Alüminyum parametresini paslanmazda kullanmak.", "Bağlama rijitliğini hesap dışında bırakmak.", "Takım aşınmasını sadece süreyle takip etmek."],
      faq: [
        ["Kesme hızı nasıl seçilir?", "Malzeme, takım, kaplama ve soğutma durumuna göre üretici aralığı başlangıç alınır."],
        ["Titanyum neden zor işlenir?", "Isı iletkenliği düşük olduğu için takım ucunda ısı birikir ve aşınma hızlanır."],
        ["Yüzey kalitesi nasıl iyileştirilir?", "Rijit bağlama, doğru ilerleme, keskin takım ve stabil soğutma birlikte gerekir."],
      ],
    },
    en: {
      title: "CNC machining material and cutting speed guide",
      description: "Quick decisions for cutting speed, feed, and tool life when machining steel, aluminum, stainless steel, and titanium.",
      category: "Manufacturing",
      tags: ["CNC", "machining", "cutting speed", "material"],
      problem: "The same geometry behaves very differently across materials. Wrong cutting speed can harm tool wear, surface finish, and dimensional stability.",
      assumptions: ["Tool supplier data is used as the starting point.", "Machine rigidity and clamping are adequate.", "Cooling or lubrication strategy is selected."],
      steps: ["Write material group and hardness.", "Choose tool material and coating.", "Start speed and feed from supplier ranges.", "Watch chips, temperature, and finish on a trial part.", "Adjust gradually based on tool life."],
      mistakes: ["Using aluminum parameters on stainless steel.", "Ignoring clamping rigidity.", "Tracking tool wear only by time."],
      faq: [
        ["How is cutting speed selected?", "Start from supplier ranges based on material, tool, coating, and coolant condition."],
        ["Why is titanium hard to machine?", "Low thermal conductivity keeps heat near the tool edge and accelerates wear."],
        ["How can surface finish improve?", "Rigid clamping, correct feed, sharp tooling, and stable coolant are needed together."],
      ],
    },
    links: ["materials", "reference", "quality"],
    glossary: ["tolerance", "hardness"],
  },
  {
    slug: "yuzey-isleme-yontemleri-rehberi",
    tr: {
      title: "Yüzey işleme yöntemleri rehberi",
      description: "Kaplama, boya, anodize, galvaniz ve pasivasyon seçeneklerini ortam, maliyet ve bakım açısından karşılaştırın.",
      category: "İmalat",
      tags: ["yüzey işleme", "kaplama", "anodize", "korozyon"],
      problem: "Yüzey işlemi parçanın korozyon direncini, sürtünmesini, görünümünü ve bakım maliyetini belirler. Yanlış seçim iyi malzemeyi kısa sürede sorunlu hale getirebilir.",
      assumptions: ["Ana malzeme ve servis ortamı bilinir.", "Kaplama kalınlığı tolerans zincirine dahil edilir.", "Bakım ve temizlik koşulları gerçekçi seçilir."],
      steps: ["Ortam ve korozyon riskini sınıflandır.", "Kaplama kalınlığının toleransa etkisini kontrol et.", "Aşınma, sürtünme ve görünüm ihtiyacını yaz.", "Proses sıcaklığı ve parça deformasyonu riskini incele.", "Kontrol planına kalınlık ve yapışma testlerini ekle."],
      mistakes: ["Kaplama kalınlığını ölçü toleransından ayrı düşünmek.", "Boya ve galvanizi aynı performans seviyesinde varsaymak.", "Keskin köşelerde kaplama sürekliliğini unutmak."],
      faq: [
        ["Anodize hangi malzemede kullanılır?", "Genellikle alüminyum alaşımlarında korozyon ve yüzey sertliği için kullanılır."],
        ["Kaplama toleransı etkiler mi?", "Evet. Kaplama kalınlığı özellikle geçme ve dişli yüzeylerde ölçüyü değiştirir."],
        ["Pasivasyon ne işe yarar?", "Paslanmaz çelikte yüzeyin koruyucu oksit tabakasını güçlendirmeye yardımcı olur."],
      ],
    },
    en: {
      title: "Surface finishing methods guide",
      description: "Compare coating, paint, anodizing, galvanizing, and passivation by environment, cost, and maintenance.",
      category: "Manufacturing",
      tags: ["surface finishing", "coating", "anodizing", "corrosion"],
      problem: "Surface finish determines corrosion resistance, friction, appearance, and maintenance cost. A wrong finish can make a good material fail early.",
      assumptions: ["Base material and service environment are known.", "Coating thickness is included in the tolerance stack.", "Maintenance and cleaning conditions are realistic."],
      steps: ["Classify environment and corrosion risk.", "Check coating thickness impact on tolerance.", "Write wear, friction, and appearance needs.", "Review process temperature and distortion risk.", "Add thickness and adhesion tests to the control plan."],
      mistakes: ["Treating coating thickness separately from dimensional tolerance.", "Assuming paint and galvanizing provide the same performance.", "Forgetting coating continuity on sharp edges."],
      faq: [
        ["Which material is anodized?", "It is usually used on aluminum alloys for corrosion resistance and surface hardness."],
        ["Does coating affect tolerance?", "Yes. Coating thickness changes dimensions, especially on fits and threaded surfaces."],
        ["What does passivation do?", "It helps strengthen the protective oxide layer on stainless steel."],
      ],
    },
    links: ["materials", "reference", "quality"],
    glossary: ["corrosion", "tolerance"],
  },
  {
    slug: "tolerans-zinciri-ve-gdt-rehberi",
    tr: {
      title: "Tolerans zinciri ve GD&T rehberi",
      description: "Parça ölçülerinin montaj sonucuna etkisini, datum seçimini ve geometrik toleransları pratik örneklerle değerlendirin.",
      category: "Tolerans",
      tags: ["GD&T", "tolerans", "datum", "montaj"],
      problem: "Tek tek doğru görünen ölçüler montajda hatalı sonuç verebilir. Tolerans zinciri ve datum stratejisi, parçaların nasıl bir araya geleceğini belirler.",
      assumptions: ["Montaj fonksiyonu ve kritik ölçü kapalıdır.", "Üretim yöntemi tolerans kapasitesi bilinir.", "Ölçüm fikstürü datum stratejisiyle uyumludur."],
      steps: ["Kritik fonksiyon ölçüsünü belirle.", "Tolerans zincirine giren ölçüleri listele.", "En kötü durum ve istatistiksel yaklaşımı ayır.", "Datum yüzeylerini montaj fonksiyonuna göre seç.", "Kontrol planında ölçüm yöntemini netleştir."],
      mistakes: ["Datumları çizimde rastgele seçmek.", "Tüm toleransları eşit sıkmak.", "Ölçüm yöntemini üretimden sonra düşünmek."],
      faq: [
        ["Tolerans zinciri neyi gösterir?", "Birden fazla ölçü toleransının montajdaki toplam boşluk veya girişime etkisini gösterir."],
        ["GD&T ne zaman gerekir?", "Geometrik ilişki, yönelim veya konum fonksiyon için kritik olduğunda gerekir."],
        ["Datum nasıl seçilir?", "Parçanın montajda gerçekten dayandığı ve ölçümde tekrarlanabilir olan yüzeylerden seçilir."],
      ],
    },
    en: {
      title: "Tolerance stack-up and GD&T guide",
      description: "Evaluate how part dimensions affect assembly outcome with datum selection and geometric tolerancing examples.",
      category: "Tolerance",
      tags: ["GD&T", "tolerance", "datum", "assembly"],
      problem: "Dimensions that look correct one by one can create a poor assembly result. Tolerance stack-up and datum strategy define how parts come together.",
      assumptions: ["Assembly function and critical dimension are defined.", "Manufacturing tolerance capability is known.", "Inspection fixture matches the datum strategy."],
      steps: ["Define the critical functional dimension.", "List dimensions in the tolerance chain.", "Separate worst-case and statistical approaches.", "Choose datums based on assembly function.", "Define measurement method in the control plan."],
      mistakes: ["Choosing drawing datums randomly.", "Tightening every tolerance equally.", "Thinking about measurement only after production."],
      faq: [
        ["What does tolerance stack-up show?", "It shows how multiple dimensional tolerances affect final clearance or interference."],
        ["When is GD&T needed?", "It is needed when geometric relationship, orientation, or position is critical to function."],
        ["How should a datum be selected?", "Use surfaces that locate the part in assembly and can be measured repeatedly."],
      ],
    },
    links: ["reference", "fixture", "materials"],
    glossary: ["tolerance"],
  },
  {
    slug: "doner-ekipman-dengeleme-titresim-kontrolu",
    tr: {
      title: "Döner ekipmanda dengeleme ve titreşim kontrolü",
      description: "Statik ve dinamik dengeleme, rezonans ve bakım izleme için mühendislik kontrol listesi.",
      category: "Bakım",
      tags: ["titreşim", "rezonans", "denge", "bakım"],
      problem: "Dengesizlik, yatak ömrünü kısaltır ve bağlantı elemanlarında gevşeme oluşturabilir. Rezonans bölgesinde küçük kuvvetler büyük titreşim genliğine dönüşür.",
      assumptions: ["Rotor çalışma hızı ve yatak düzeni bilinir.", "Titreşim ölçümü tekrar edilebilir noktadan alınır.", "Kritik hızlara yaklaşım servis koşulunda kontrol edilir."],
      steps: ["Nominal devir ve çalışma hız aralığını yaz.", "Statik mi dinamik mi dengeleme gerektiğini belirle.", "Ölçüm noktalarını ve kabul limitini tanımla.", "Rezonans riskini hız taramasıyla kontrol et.", "Bakım planına trend izleme ekle."],
      mistakes: ["Tek düzlem dengelemenin her rotor için yeterli olduğunu sanmak.", "Titreşim sensörünü farklı noktalarda karşılaştırmak.", "Temel gevşekliğini rotor arızası sanmak."],
      faq: [
        ["Statik dengeleme ne zaman yeterlidir?", "Dar ve düşük hız etkili rotorlar için yeterli olabilir."],
        ["Dinamik dengeleme ne sağlar?", "İki düzlem etkisini hesaba katarak uzun veya hızlı rotorları daha doğru dengeler."],
        ["Rezonans nasıl anlaşılır?", "Belirli hızda titreşim hızlı yükselir ve hız değişince düşer."],
      ],
    },
    en: {
      title: "Rotating equipment balancing and vibration control",
      description: "An engineering checklist for static balancing, dynamic balancing, resonance, and maintenance monitoring.",
      category: "Maintenance",
      tags: ["vibration", "resonance", "balancing", "maintenance"],
      problem: "Unbalance shortens bearing life and can loosen fasteners. Near resonance, small forces can create large vibration amplitudes.",
      assumptions: ["Rotor speed and bearing arrangement are known.", "Vibration is measured from repeatable points.", "Critical speeds are checked under service conditions."],
      steps: ["Write nominal speed and operating speed range.", "Decide whether static or dynamic balancing is needed.", "Define measurement points and acceptance limit.", "Check resonance risk with a speed sweep.", "Add trend monitoring to the maintenance plan."],
      mistakes: ["Assuming single-plane balancing suits every rotor.", "Comparing vibration readings from different sensor points.", "Mistaking foundation looseness for a rotor fault."],
      faq: [
        ["When is static balancing enough?", "It may be enough for narrow rotors with limited speed effects."],
        ["What does dynamic balancing add?", "It accounts for two-plane effects and works better for long or fast rotors."],
        ["How is resonance recognized?", "Vibration rises quickly at a certain speed and drops when speed changes."],
      ],
    },
    links: ["bearing", "torque", "quality"],
    glossary: ["resonance", "fatigue"],
  },
  {
    slug: "akiskan-dinamigi-temelleri-boru-kanal-akisi",
    tr: {
      title: "Akışkan dinamiği temelleri: boru ve kanal akışı",
      description: "Laminer ve türbülanslı akış, Reynolds sayısı, hidrolik çap ve basınç kaybı için hızlı başlangıç rehberi.",
      category: "Akışkanlar",
      tags: ["akışkanlar", "Reynolds", "basınç kaybı", "boru"],
      problem: "Boru ve kanal akışında hız, çap, viskozite ve pürüzlülük birlikte sonucu belirler. Sadece debiye bakmak basınç kaybını ve pompa yükünü eksik gösterir.",
      assumptions: ["Akış sıkıştırılamaz kabul edilir.", "Akışkan özellikleri çalışma sıcaklığına göre seçilir.", "Boru veya kanal geometrisi bilinir."],
      steps: ["Debi, çap ve kesit alanından hızı hesapla.", "Reynolds sayısıyla akış rejimini belirle.", "Pürüzlülük ve sürtünme katsayısını seç.", "Darcy-Weisbach veya uygun yöntemle kaybı hesapla.", "Dirsek, vana ve giriş kayıplarını ekle."],
      mistakes: ["Hidrolik çapı kanal hesabında unutmak.", "Sıcaklık değişince viskozitenin değiştiğini atlamak.", "Sadece düz boru kaybını hesaplayıp lokal kayıpları eklememek."],
      faq: [
        ["Reynolds sayısı ne işe yarar?", "Akışın laminer, geçiş veya türbülanslı davranacağını tahmin eder."],
        ["Hidrolik çap nedir?", "Dairesel olmayan kanalları eşdeğer akış çapıyla temsil etmeye yarar."],
        ["Basınç kaybı neden artar?", "Hız, uzunluk, pürüzlülük ve lokal dirençler arttıkça basınç kaybı yükselir."],
      ],
    },
    en: {
      title: "Fluid dynamics basics: pipe and duct flow",
      description: "A quick guide to laminar flow, turbulent flow, Reynolds number, hydraulic diameter, and pressure loss.",
      category: "Fluids",
      tags: ["fluids", "Reynolds", "pressure loss", "pipe"],
      problem: "In pipe and duct flow, velocity, diameter, viscosity, and roughness define the result together. Looking only at flow rate hides pressure loss and pump load.",
      assumptions: ["Flow is treated as incompressible.", "Fluid properties are selected at operating temperature.", "Pipe or duct geometry is known."],
      steps: ["Calculate velocity from flow, diameter, and area.", "Use Reynolds number to identify flow regime.", "Select roughness and friction factor.", "Calculate loss with Darcy-Weisbach or a suitable method.", "Add elbow, valve, and entrance losses."],
      mistakes: ["Forgetting hydraulic diameter in duct calculations.", "Skipping viscosity changes with temperature.", "Calculating only straight pipe loss and missing local losses."],
      faq: [
        ["What does Reynolds number do?", "It estimates whether flow behaves as laminar, transitional, or turbulent."],
        ["What is hydraulic diameter?", "It represents non-circular ducts with an equivalent flow diameter."],
        ["Why does pressure loss increase?", "Pressure loss rises with velocity, length, roughness, and local resistances."],
      ],
    },
    links: ["pipe", "hydraulic", "unit"],
    glossary: ["reynolds", "viscosity"],
  },
  {
    slug: "isi-yalitimi-termal-genlesme-rehberi",
    tr: {
      title: "Isı yalıtımı ve termal genleşme rehberi",
      description: "Yüksek sıcaklık uygulamalarında ısı akışı, yalıtım kalınlığı ve termal genleşme payını birlikte kontrol edin.",
      category: "Termal",
      tags: ["ısı transferi", "yalıtım", "termal genleşme"],
      problem: "Yalıtım sadece enerji kaybını azaltmaz; yüzey sıcaklığı, güvenlik, genleşme boşluğu ve bağlantı gerilmelerini de etkiler.",
      assumptions: ["Isı iletimi baskın mekanizma olarak alınır.", "Malzeme ısıl iletkenliği çalışma sıcaklığına göre seçilir.", "Genleşme için hareket serbestliği veya kompansasyon planlanır."],
      steps: ["Sıcaklık farkını ve temas alanını belirle.", "Malzeme iletkenliğini çalışma sıcaklığında seç.", "Yalıtım kalınlığı ile yüzey sıcaklığını kontrol et.", "Termal genleşme miktarını hesapla.", "Bağlantı ve boşluk tasarımını genleşmeye göre revize et."],
      mistakes: ["Yalıtım kalınlığını mekanik montaj boşluğundan bağımsız seçmek.", "Sıcaklıkla iletkenlik değişimini unutmak.", "Genleşmeyi sabit bağlantıyla tamamen kısıtlamak."],
      faq: [
        ["Yalıtım kalınlığı nasıl belirlenir?", "Enerji kaybı, yüzey sıcaklığı, yerleşim ve maliyet birlikte değerlendirilir."],
        ["Termal genleşme neden önemlidir?", "Kısıtlanırsa bağlantılarda ek gerilme ve şekil değişimi oluşturabilir."],
        ["Isıl iletkenlik sabit midir?", "Birçok malzemede sıcaklığa bağlı değişir; veri sayfası sıcaklık aralığı kontrol edilmelidir."],
      ],
    },
    en: {
      title: "Thermal insulation and expansion guide",
      description: "Check heat flow, insulation thickness, and thermal expansion allowance together in high-temperature applications.",
      category: "Thermal",
      tags: ["heat transfer", "insulation", "thermal expansion"],
      problem: "Insulation does more than reduce energy loss; it affects surface temperature, safety, expansion gaps, and connection stresses.",
      assumptions: ["Conduction is treated as the dominant heat transfer mode.", "Thermal conductivity is selected at operating temperature.", "Movement freedom or compensation is planned for expansion."],
      steps: ["Define temperature difference and contact area.", "Select conductivity at operating temperature.", "Check surface temperature with insulation thickness.", "Calculate thermal expansion.", "Revise joints and clearances for expansion."],
      mistakes: ["Selecting insulation thickness separately from assembly clearance.", "Forgetting conductivity changes with temperature.", "Fully restraining expansion with fixed joints."],
      faq: [
        ["How is insulation thickness selected?", "Energy loss, surface temperature, packaging, and cost are evaluated together."],
        ["Why does thermal expansion matter?", "If restrained, it can create extra stress and deformation in joints."],
        ["Is thermal conductivity constant?", "For many materials it changes with temperature; check the data sheet range."],
      ],
    },
    links: ["unit", "reference", "materials"],
    glossary: ["stress", "safety"],
  },
  {
    slug: "makine-ogesi-omru-yorulma-rehberi",
    tr: {
      title: "Makine öğesi ömrü, Wöhler eğrisi ve yorulma rehberi",
      description: "Tekrarlı yük altındaki miller, cıvatalar, kaynaklar ve yataklar için yorulma yaklaşımını hızlıca kurun.",
      category: "Makine Elemanları",
      tags: ["yorulma", "Wöhler", "ömür", "makine elemanları"],
      problem: "Parça statik yükte güvenli görünse bile tekrarlı yük altında çatlak başlatabilir. Yorulma hesabı yük çevrimi, gerilme aralığı ve çentik etkisini birlikte ele alır.",
      assumptions: ["Yük çevrimi ve ortalama gerilme yaklaşık bilinir.", "Malzeme S-N veya Wöhler verisi bulunur.", "Yüzey, boyut ve çentik etkileri düzeltme faktörüyle ele alınır."],
      steps: ["Yük çevrimini ve gerilme aralığını belirle.", "Malzemenin yorulma verisini seç.", "Çentik, yüzey ve boyut düzeltmelerini ekle.", "Güvenlik faktörünü yorulma için ayrı değerlendir.", "Kritik bölgede kalite kontrol veya test planı yaz."],
      mistakes: ["Statik güvenlik faktörünü yorulma için yeterli sanmak.", "Kaynak dikişindeki çentik etkisini unutmak.", "Yüzey pürüzlülüğünü yorulma dayanımından bağımsız düşünmek."],
      faq: [
        ["Yorulma nedir?", "Tekrarlı yük altında çatlak oluşumu ve ilerlemesiyle parça hasarıdır."],
        ["Wöhler eğrisi ne gösterir?", "Gerilme seviyesi ile çevrim ömrü arasındaki ilişkiyi gösterir."],
        ["Yorulma için en kritik bölge neresidir?", "Çentik, kesit değişimi, kaynak ucu ve yüzey kusurları genellikle kritiktir."],
      ],
    },
    en: {
      title: "Machine element life, S-N curve, and fatigue guide",
      description: "Set up a fatigue approach for shafts, bolts, welds, and bearings under repeated loading.",
      category: "Machine Elements",
      tags: ["fatigue", "S-N curve", "life", "machine elements"],
      problem: "A part may look safe under static load and still crack under repeated load. Fatigue analysis combines load cycle, stress range, and notch effect.",
      assumptions: ["Load cycle and mean stress are approximately known.", "Material S-N data is available.", "Surface, size, and notch effects are handled with correction factors."],
      steps: ["Define load cycle and stress range.", "Select material fatigue data.", "Add notch, surface, and size corrections.", "Evaluate fatigue safety factor separately.", "Write inspection or test plan for the critical area."],
      mistakes: ["Assuming static safety factor is enough for fatigue.", "Forgetting notch effect at weld toes.", "Treating surface roughness as independent from fatigue strength."],
      faq: [
        ["What is fatigue?", "It is failure by crack initiation and growth under repeated loading."],
        ["What does an S-N curve show?", "It shows the relation between stress level and cycle life."],
        ["Where is fatigue usually critical?", "Notches, section changes, weld toes, and surface defects are common critical regions."],
      ],
    },
    links: ["shaft", "bearing", "weld"],
    glossary: ["fatigue", "stress", "safety"],
  },
];

const resolveGuideLinks = (keys, locale) =>
  keys
    .map((key) => toolLinks[key] ?? null)
    .filter(Boolean)
    .map((link) => `- [${link[locale]}](${link.href})`)
    .join("\n");

const resolveGlossaryLinks = (keys, locale) =>
  keys
    .map((key) => glossaryLinks[key] ?? null)
    .filter(Boolean)
    .map((link) => `- [${link[locale]}](${link.href})`)
    .join("\n");

const buildGuide = (guide, locale) => {
  const copy = guide[locale];
  const isTr = locale === "tr";
  const relatedTools = resolveGuideLinks(guide.links, locale);
  const relatedGlossary = resolveGlossaryLinks(guide.glossary, locale);
  const faq = copy.faq
    .map(([question, answer]) => `### ${isTr ? "Soru" : "Question"}: ${question}\n\n${answer}`)
    .join("\n\n");

  return `${frontmatter({
    title: copy.title,
    description: copy.description,
    tags: copy.tags,
    category: copy.category,
    readingTime: 7,
  })}<Callout type="info" title="${isTr ? "Kullanım notu" : "Usage note"}">
${isTr
  ? "Bu rehber hızlı mühendislik kontrolü için hazırlanmıştır. Kritik tasarım kararlarında ilgili standart, tedarikçi verisi ve sorumlu mühendis onayı gerekir."
  : "This guide is prepared for quick engineering review. Critical design decisions still require the relevant standard, supplier data, and engineering approval."}
</Callout>

## ${isTr ? "Problem / Amaç" : "Problem / Objective"}

${copy.problem}

## ${isTr ? "Varsayımlar" : "Assumptions"}

${list(copy.assumptions)}

## ${isTr ? "Adım adım yöntem" : "Step by step method"}

${numbered(copy.steps)}

## ${isTr ? "Sık hatalar" : "Common mistakes"}

${list(copy.mistakes)}

## ${isTr ? "İlgili hesaplayıcılar" : "Related calculators"}

${relatedTools}

## ${isTr ? "İlgili sözlük terimleri" : "Related glossary terms"}

${relatedGlossary}

## ${isTr ? "Kısa FAQ" : "Quick FAQ"}

${faq}
`;
};

const terms = [
  ["torque", "Tork", "Torque", "Mekanik", "Mechanical", ["tork", "moment", "kuvvet"], ["torque", "moment", "force"], "Tork, bir kuvvetin bir eksen etrafında döndürme etkisidir.", "Torque is the turning effect of a force around an axis.", "Cıvata sıkma, mil tasarımı ve güç aktarımında temel büyüklüktür.", "It is a core value in bolt tightening, shaft design, and power transmission.", "10 N kuvvet 2 m koldan uygulanırsa tork 20 N m olur.", "A 10 N force applied at a 2 m arm creates 20 N m of torque.", "Torque = Force x radius", ["torque", "shaft", "bolt"]],
  ["stress", "Gerilme", "Stress", "Mekanik", "Mechanical", ["gerilme", "mukavemet", "malzeme"], ["stress", "strength", "material"], "Gerilme, iç kuvvetin kesit alanına oranıdır.", "Stress is internal force divided by cross-sectional area.", "Parçanın emniyetli çalışıp çalışmayacağını değerlendirmek için kullanılır.", "It is used to judge whether a part can operate safely.", "1000 N yük 100 mm2 alana yayılırsa gerilme 10 MPa olur.", "A 1000 N load over 100 mm2 produces 10 MPa stress.", "Stress = Force / Area", ["bending", "materials"]],
  ["strain", "Şekil değiştirme", "Strain", "Mekanik", "Mechanical", ["şekil değiştirme", "elastisite"], ["strain", "elasticity"], "Şekil değiştirme, boy değişiminin ilk boya oranıdır.", "Strain is the change in length divided by original length.", "Malzemenin elastik veya plastik bölgede çalıştığını anlamaya yardım eder.", "It helps identify whether a material works in the elastic or plastic region.", "1 m boy 1 mm uzarsa birim şekil değiştirme 0.001 olur.", "A 1 m length that extends by 1 mm has strain of 0.001.", "Strain = delta L / L0", ["materials", "bending"]],
  ["youngs-modulus", "Elastisite modülü", "Young's Modulus", "Malzeme", "Materials", ["elastisite", "malzeme", "sehim"], ["elasticity", "material", "deflection"], "Elastisite modülü, malzemenin elastik rijitliğini gösterir.", "Young's modulus measures elastic stiffness.", "Sehim, uzama ve titreşim davranışını doğrudan etkiler.", "It directly affects deflection, elongation, and vibration behavior.", "Çelik yaklaşık 210 GPa, alüminyum yaklaşık 70 GPa mertebesindedir.", "Steel is around 210 GPa and aluminum is around 70 GPa.", "E = Stress / Strain", ["materials", "bending"]],
  ["shear-stress", "Kesme gerilmesi", "Shear Stress", "Mekanik", "Mechanical", ["kesme", "gerilme", "tork"], ["shear", "stress", "torque"], "Kesme gerilmesi, yüzeye paralel etki eden iç kuvvetin oluşturduğu gerilmedir.", "Shear stress is stress created by internal force acting parallel to a surface.", "Pim, cıvata, kaynak ve burulma kontrollerinde kritik hale gelir.", "It is critical in pins, bolts, welds, and torsion checks.", "Bir pimde yük kesit boyunca kayma eğilimi oluşturuyorsa kesme gerilmesi kontrol edilir.", "If a pin load tends to slide across the section, shear stress is checked.", "Shear stress = Shear force / Area", ["shaft", "weld", "bolt"]],
  ["fatigue", "Yorulma", "Fatigue", "Mekanik", "Mechanical", ["yorulma", "ömür", "çatlak"], ["fatigue", "life", "crack"], "Yorulma, tekrarlı yükler altında çatlak oluşumu ve ilerlemesidir.", "Fatigue is crack initiation and growth under repeated loads.", "Statik olarak güvenli parçalar bile çevrimli yükte hasar görebilir.", "Parts that are safe statically can still fail under cyclic loading.", "Dönen milde değişken eğilme gerilmesi yorulma kontrolü gerektirir.", "Alternating bending stress in a rotating shaft requires fatigue review.", "", ["shaft", "bearing", "weld"]],
  ["bending-moment", "Eğilme momenti", "Bending Moment", "Mekanik", "Mechanical", ["eğilme", "moment", "kiriş"], ["bending", "moment", "beam"], "Eğilme momenti, bir kesitte eğilmeye neden olan kuvvet etkisidir.", "Bending moment is the force effect that causes bending at a section.", "Kiriş, mil ve plaka boyutlandırmasında gerilme hesabının temel girdisidir.", "It is a key input for stress in beams, shafts, and plates.", "Ortasından yüklenen basit kirişte en büyük moment genellikle açıklığın ortasında oluşur.", "A simply supported beam with center load usually has maximum moment at midspan.", "Moment = Force x distance", ["bending"]],
  ["buckling", "Burkulma", "Buckling", "Mekanik", "Mechanical", ["burkulma", "kolon", "stabilite"], ["buckling", "column", "stability"], "Burkulma, basınç altındaki ince elemanın yanal kararsızlıkla şekil değiştirmesidir.", "Buckling is lateral instability of a slender member under compression.", "Dayanım yeterli olsa bile geometri kararsızlığı parçayı sınırlayabilir.", "Even when strength is adequate, geometric instability can limit the part.", "Uzun ince bir kolon akma gerilmesine ulaşmadan burkulabilir.", "A long slender column can buckle before reaching yield stress.", "", ["materials", "reference"]],
  ["resonance", "Rezonans", "Resonance", "Dinamik", "Dynamics", ["rezonans", "titreşim", "doğal frekans"], ["resonance", "vibration", "natural frequency"], "Rezonans, uyarı frekansının doğal frekansa yaklaşmasıyla titreşim genliğinin büyümesidir.", "Resonance is vibration amplification when excitation frequency approaches natural frequency.", "Döner ekipman, şasi ve bağlantı elemanlarında yorulma riskini artırır.", "It increases fatigue risk in rotating equipment, frames, and joints.", "Bir fan belirli devirde aniden titreşimi artırıyorsa rezonans bölgesi olabilir.", "If a fan suddenly vibrates at a certain speed, it may be near resonance.", "", ["bearing", "torque"]],
  ["hardness", "Sertlik", "Hardness", "Malzeme", "Materials", ["sertlik", "malzeme", "aşınma"], ["hardness", "material", "wear"], "Sertlik, malzemenin batmaya veya çizilmeye karşı direncidir.", "Hardness is resistance to indentation or scratching.", "Aşınma, işlenebilirlik ve ısıl işlem kontrolünde hızlı gösterge sağlar.", "It is a quick indicator for wear, machinability, and heat treatment control.", "HRC değeri yüksek bir takım çeliği aşınmaya dayanıklı olabilir fakat kırılganlık artabilir.", "A high HRC tool steel may resist wear but can become more brittle.", "", ["materials", "reference"]],
  ["tensile-strength", "Çekme dayanımı", "Tensile Strength", "Malzeme", "Materials", ["çekme dayanımı", "malzeme"], ["tensile strength", "material"], "Çekme dayanımı, malzemenin çekme altında taşıyabildiği en yüksek gerilme seviyesidir.", "Tensile strength is the maximum stress a material can carry in tension.", "Kopma öncesi kapasiteyi gösterir, fakat tasarımda tek başına yeterli değildir.", "It indicates capacity before fracture but is not enough alone for design.", "Bir malzeme yüksek çekme dayanımına sahip olsa bile akma sınırı düşükse kalıcı şekil değiştirebilir.", "A material may have high tensile strength but still yield permanently if yield strength is low.", "", ["materials", "simpleStress"]],
  ["yield-strength", "Akma dayanımı", "Yield Strength", "Malzeme", "Materials", ["akma", "dayanım", "tasarım"], ["yield", "strength", "design"], "Akma dayanımı, kalıcı şekil değiştirmenin başladığı yaklaşık gerilme seviyesidir.", "Yield strength is the approximate stress where permanent deformation begins.", "Birçok mekanik tasarımda izin verilen gerilme bu değerden türetilir.", "Many mechanical allowable stresses are derived from this value.", "S235 çelikte akma dayanımı tasarım kontrolünün temel girdilerinden biridir.", "For S235 steel, yield strength is a key design check input.", "", ["materials", "bending"]],
  ["ductility", "Süneklik", "Ductility", "Malzeme", "Materials", ["süneklik", "malzeme", "şekil verme"], ["ductility", "material", "forming"], "Süneklik, malzemenin kopmadan plastik şekil değiştirebilme yeteneğidir.", "Ductility is the ability to plastically deform before fracture.", "Darbelere, şekil vermeye ve hasar öncesi uyarı davranışına katkı sağlar.", "It helps impact behavior, forming, and warning before failure.", "Düşük sıcaklık bazı çeliklerde sünekliği azaltabilir.", "Low temperature can reduce ductility in some steels.", "", ["materials"]],
  ["corrosion-resistance", "Korozyon direnci", "Corrosion Resistance", "Malzeme", "Materials", ["korozyon", "paslanmaz", "kaplama"], ["corrosion", "stainless", "coating"], "Korozyon direnci, malzemenin kimyasal veya elektrokimyasal bozulmaya karşı dayanımıdır.", "Corrosion resistance is resistance to chemical or electrochemical degradation.", "Dış ortam, deniz ortamı ve kimyasal proseslerde ömür maliyetini belirler.", "It controls life-cycle cost in outdoor, marine, and chemical service.", "316 paslanmaz çelik klorürlü ortamda 304 kaliteye göre daha güvenli olabilir.", "316 stainless can be safer than 304 in chloride service.", "", ["materials", "reference"]],
  ["thermal-conductivity", "Isıl iletkenlik", "Thermal Conductivity", "Termal", "Thermal", ["ısı", "iletkenlik", "malzeme"], ["heat", "conductivity", "material"], "Isıl iletkenlik, malzemenin ısıyı iletme yeteneğidir.", "Thermal conductivity is the ability of a material to conduct heat.", "Soğutucu, yalıtım ve sıcaklık gradyeni hesaplarında temel parametredir.", "It is essential for heat sinks, insulation, and temperature gradient checks.", "Alüminyum yüksek iletkenliğiyle ısı yaymada sık kullanılır.", "Aluminum is often used for heat spreading because of high conductivity.", "Heat flow = conductivity x area x temperature difference / thickness", ["materials", "unit"]],
  ["coefficient-of-friction", "Sürtünme katsayısı", "Coefficient of Friction", "Mekanik", "Mechanical", ["sürtünme", "temas", "tork"], ["friction", "contact", "torque"], "Sürtünme katsayısı, iki yüzeyin kaymaya karşı gösterdiği direnç oranıdır.", "Coefficient of friction is the ratio describing resistance to sliding between two surfaces.", "Cıvata torku, frenleme, kama ve kızak tasarımında sonucu güçlü etkiler.", "It strongly affects bolt torque, braking, wedge, and slide design.", "Yağlama değişirse aynı cıvata torku farklı ön yük üretebilir.", "A change in lubrication can make the same bolt torque produce a different preload.", "", ["bolt", "reference"]],
  ["viscosity", "Viskozite", "Viscosity", "Akışkanlar", "Fluids", ["viskozite", "akışkan", "pompa"], ["viscosity", "fluid", "pump"], "Viskozite, akışkanın akmaya karşı gösterdiği iç dirençtir.", "Viscosity is the internal resistance of a fluid to flow.", "Pompa gücü, basınç kaybı, yağlama filmi ve sıcaklık davranışını etkiler.", "It affects pump power, pressure loss, lubrication film, and temperature behavior.", "Soğuk yağın viskozitesi yükselir ve ilk çalışma torkunu artırabilir.", "Cold oil has higher viscosity and can increase starting torque.", "", ["pipe", "hydraulic"]],
  ["density", "Yoğunluk", "Density", "Malzeme", "Materials", ["yoğunluk", "ağırlık", "malzeme"], ["density", "weight", "material"], "Yoğunluk, birim hacimdeki kütle miktarıdır.", "Density is mass per unit volume.", "Ağırlık, atalet, kaldırma kuvveti ve lojistik maliyet hesaplarını etkiler.", "It affects weight, inertia, buoyancy, and logistics cost.", "Aynı hacimde çelik parça alüminyum parçadan yaklaşık üç kat ağır olabilir.", "For the same volume, a steel part can be about three times heavier than aluminum.", "Density = Mass / Volume", ["materials", "unit"]],
  ["factor-of-safety", "Güvenlik faktörü", "Factor of Safety", "Tasarım", "Design", ["güvenlik faktörü", "tasarım", "risk"], ["factor of safety", "design", "risk"], "Güvenlik faktörü, kapasitenin beklenen yüke oranıdır.", "Factor of safety is the ratio of capacity to expected load.", "Belirsizlik, tolerans, malzeme dağılımı ve servis koşullarını karşılamak için kullanılır.", "It covers uncertainty, tolerance, material scatter, and service conditions.", "Kapasite 3000 N ve yük 1000 N ise güvenlik faktörü 3 olur.", "If capacity is 3000 N and load is 1000 N, the factor of safety is 3.", "FoS = Capacity / Demand", ["bending", "bolt"]],
  ["tolerance", "Tolerans", "Tolerance", "Tasarım", "Design", ["tolerans", "ölçü", "imalat"], ["tolerance", "dimension", "manufacturing"], "Tolerans, bir ölçünün kabul edilebilir değişim aralığıdır.", "Tolerance is the acceptable variation range of a dimension.", "Üretilebilirlik, montaj boşluğu ve maliyeti doğrudan belirler.", "It directly affects manufacturability, assembly clearance, and cost.", "25.00 plus minus 0.02 mm ölçüde toplam tolerans aralığı 0.04 mm olur.", "A 25.00 plus minus 0.02 mm dimension has a total tolerance range of 0.04 mm.", "", ["reference", "fixture"]],
  ["clearance", "Açıklık", "Clearance", "Tasarım", "Design", ["açıklık", "geçme", "tolerans"], ["clearance", "fit", "tolerance"], "Açıklık, iki parça arasında kalan pozitif boşluktur.", "Clearance is the positive space between two parts.", "Dönme, kayma, montaj ve termal genleşme için gerekli olabilir.", "It can be required for rotation, sliding, assembly, and thermal expansion.", "Mil çapı delikten küçükse aradaki fark açıklık olarak değerlendirilir.", "If the shaft is smaller than the hole, the difference is clearance.", "", ["reference"]],
  ["interference", "Girişim", "Interference", "Tasarım", "Design", ["girişim", "press fit", "tolerans"], ["interference", "press fit", "tolerance"], "Girişim, montaj öncesi iki parçanın ölçülerinin birbirine bindirmesidir.", "Interference is dimensional overlap before assembly.", "Sıkı geçme bağlantılarda tork ve kuvvet aktarımı için kullanılır.", "It is used for torque and force transfer in press fits.", "Mil delikten büyük seçilirse montaj için pres veya ısıl yöntem gerekir.", "If the shaft is larger than the hole, pressing or thermal assembly is needed.", "", ["reference", "fixture"]],
  ["gdt", "GD&T", "GD&T", "Tasarım", "Design", ["GD&T", "tolerans", "datum"], ["GD&T", "tolerance", "datum"], "GD&T, geometrik boyutlandırma ve toleranslandırma sistemidir.", "GD&T is geometric dimensioning and tolerancing.", "Parçanın form, yönelim, konum ve salınım gereksinimlerini işlev odaklı tanımlar.", "It defines form, orientation, location, and runout requirements by function.", "Konum toleransı, bir deliğin gerçek yerini basit artı eksi ölçüden daha net kontrol eder.", "Position tolerance controls hole location more clearly than simple plus-minus dimensions.", "", ["reference", "fixture"]],
  ["datum", "Referans yüzeyi", "Datum", "Tasarım", "Design", ["datum", "referans", "ölçüm"], ["datum", "reference", "inspection"], "Datum, ölçüm ve toleransların dayandığı referans yüzey, eksen veya noktadır.", "A datum is a reference surface, axis, or point for measurement and tolerances.", "Montaj fonksiyonunu ve ölçüm tekrar edilebilirliğini belirler.", "It defines assembly function and measurement repeatability.", "Bir fikstürde parçanın oturduğu ana yüzey genellikle birincil datum olur.", "The main seating face in a fixture is often the primary datum.", "", ["fixture", "reference"]],
  ["runout", "Salınım", "Runout", "Tasarım", "Design", ["salınım", "mil", "döner ekipman"], ["runout", "shaft", "rotating equipment"], "Salınım, dönen bir yüzeyin referans eksene göre yalpalama miktarıdır.", "Runout is the wobble of a rotating surface relative to a reference axis.", "Mil, rulman yatağı, dişli ve kasnaklarda titreşim ve aşınmayı etkiler.", "It affects vibration and wear in shafts, bearing seats, gears, and pulleys.", "Torna sonrası mil ucunda komparatörle toplam salınım kontrol edilebilir.", "Total runout at a shaft end can be checked with a dial indicator after turning.", "", ["bearing", "gear"]],
  ["concentricity", "Konsantriklik", "Concentricity", "Tasarım", "Design", ["konsantriklik", "eksen", "ölçüm"], ["concentricity", "axis", "inspection"], "Konsantriklik, iki dairesel özelliğin merkezlerinin aynı eksende olma durumudur.", "Concentricity describes circular features sharing the same central axis.", "Dönen parçalarda dengesizlik, salınım ve montaj kalitesini etkileyebilir.", "It can affect unbalance, runout, and assembly quality in rotating parts.", "Kaplin göbeği ve mil eksenleri uyumlu değilse titreşim artabilir.", "If coupling hub and shaft axes do not align, vibration can increase.", "", ["bearing", "fixture"]],
  ["parallelism", "Paralellik", "Parallelism", "Tasarım", "Design", ["paralellik", "GD&T", "ölçüm"], ["parallelism", "GD&T", "inspection"], "Paralellik, iki yüzey veya eksenin aralarındaki mesafeyi sabit tutma gereksinimidir.", "Parallelism controls whether two surfaces or axes maintain constant separation.", "Kızak, tabla, fikstür ve yatak yüzeylerinde temas kalitesini belirler.", "It defines contact quality for slides, tables, fixtures, and bearing faces.", "Freze tablasına paralel olmayan bir bağlama yüzeyi ölçü hatası oluşturabilir.", "A clamping face not parallel to the mill table can create dimensional error.", "", ["fixture", "reference"]],
  ["iso", "ISO", "ISO", "Standartlar", "Standards", ["ISO", "standart", "kalite"], ["ISO", "standard", "quality"], "ISO, uluslararası standartlar geliştiren kuruluştur.", "ISO is an organization that develops international standards.", "Ölçü, kalite, malzeme ve yönetim sistemlerinde ortak dil sağlar.", "It provides common language for dimensions, quality, materials, and management systems.", "ISO 286 geçme toleransları için sık kullanılan bir referanstır.", "ISO 286 is a common reference for limits and fits.", "", ["reference"]],
  ["din", "DIN", "DIN", "Standartlar", "Standards", ["DIN", "standart", "Almanya"], ["DIN", "standard", "Germany"], "DIN, Alman standart kuruluşu tarafından yayımlanan standart ailesidir.", "DIN is a family of standards published by the German standards body.", "Makine elemanları, bağlantı elemanları ve üretim detaylarında sık kullanılır.", "It is common in machine elements, fasteners, and manufacturing details.", "DIN cıvata ve rondela standartları Avrupa tedarikinde sık görülür.", "DIN bolt and washer standards are common in European supply chains.", "", ["reference", "bolt"]],
  ["asme", "ASME", "ASME", "Standartlar", "Standards", ["ASME", "standart", "basınç"], ["ASME", "standard", "pressure"], "ASME, mekanik mühendislik ve basınçlı ekipman standartlarıyla bilinen kuruluştur.", "ASME is known for mechanical engineering and pressure equipment standards.", "Kazan, basınçlı kap, borulama ve GD&T uygulamalarında referans olabilir.", "It can be a reference for boilers, pressure vessels, piping, and GD&T.", "ASME Y14.5 geometrik toleranslandırma için yaygın bir kaynaktır.", "ASME Y14.5 is a common source for geometric tolerancing.", "", ["pipe", "reference"]],
  ["astm", "ASTM", "ASTM", "Standartlar", "Standards", ["ASTM", "malzeme", "test"], ["ASTM", "material", "test"], "ASTM, malzeme, test yöntemi ve ürün standartları yayımlayan kuruluştur.", "ASTM publishes material, test method, and product standards.", "Malzeme sertifikası ve test prosedürü yorumunda sık kullanılır.", "It is often used when interpreting material certificates and test procedures.", "ASTM A36 yapısal çelik için bilinen bir malzeme standardıdır.", "ASTM A36 is a well-known structural steel material standard.", "", ["materials", "reference"]],
  ["ansi", "ANSI", "ANSI", "Standartlar", "Standards", ["ANSI", "standart", "ABD"], ["ANSI", "standard", "USA"], "ANSI, ABD standart sisteminde koordinasyon rolü olan kuruluştur.", "ANSI coordinates standards in the United States standards system.", "Ölçü, güvenlik ve ürün uyumluluğu dokümanlarında karşınıza çıkabilir.", "It appears in dimensional, safety, and product conformity documents.", "ANSI sınıfı bir flanş basınç-sıcaklık sınıfıyla birlikte değerlendirilir.", "An ANSI class flange is reviewed with pressure-temperature rating.", "", ["reference"]],
  ["machining", "Makineleme", "Machining", "İmalat", "Manufacturing", ["makineleme", "CNC", "talaş"], ["machining", "CNC", "chips"], "Makineleme, malzemenin kesici takımla talaş kaldırılarak şekillendirilmesidir.", "Machining shapes material by removing chips with cutting tools.", "Tolerans, yüzey kalitesi ve prototip üretimde temel süreçtir.", "It is essential for tolerance, surface finish, and prototype production.", "Torna ve freze işlemleri en yaygın talaşlı imalat örnekleridir.", "Turning and milling are common machining examples.", "", ["materials", "reference"]],
  ["casting", "Döküm", "Casting", "İmalat", "Manufacturing", ["döküm", "imalat", "kalıp"], ["casting", "manufacturing", "mold"], "Döküm, ergimiş malzemenin kalıba dökülerek şekillendirilmesidir.", "Casting forms parts by pouring molten material into a mold.", "Karmaşık geometriler ve seri üretim için avantaj sağlar.", "It is useful for complex shapes and production volumes.", "Pompa gövdeleri ve motor blokları sık döküm örnekleridir.", "Pump housings and engine blocks are common casting examples.", "", ["materials"]],
  ["forging", "Dövme", "Forging", "İmalat", "Manufacturing", ["dövme", "imalat", "dayanım"], ["forging", "manufacturing", "strength"], "Dövme, katı metalin basınç altında plastik şekillendirilmesidir.", "Forging plastically shapes solid metal under pressure.", "Lif akışı ve yoğun yapı sayesinde yüksek dayanım gerektiren parçalarda kullanılır.", "It is used for high-strength parts because of grain flow and dense structure.", "Krank mili ve bağlantı kolları dövme üretime örnek olabilir.", "Crankshafts and connecting rods can be forged parts.", "", ["materials"]],
  ["welding", "Kaynak", "Welding", "İmalat", "Manufacturing", ["kaynak", "birleştirme", "imalat"], ["welding", "joining", "manufacturing"], "Kaynak, parçaların ısı veya basınç etkisiyle kalıcı olarak birleştirilmesidir.", "Welding permanently joins parts using heat or pressure.", "Yük yolu, deformasyon, kalite kontrol ve yorulma davranışını etkiler.", "It affects load path, distortion, inspection, and fatigue behavior.", "Köşe kaynakta etkin boğaz kalınlığı dayanım hesabının ana girdisidir.", "In fillet welds, effective throat size is a key strength input.", "", ["weld"]],
  ["grinding", "Taşlama", "Grinding", "İmalat", "Manufacturing", ["taşlama", "yüzey", "hassas işleme"], ["grinding", "surface", "precision"], "Taşlama, aşındırıcı tanelerle hassas talaş kaldırma işlemidir.", "Grinding removes material with abrasive grains for precision finishing.", "Sert parçalar, sıkı toleranslar ve iyi yüzey kalitesi için kullanılır.", "It is used for hard parts, tight tolerances, and good surface finish.", "Rulman yatağı yüzeyleri taşlama ile hassas hale getirilebilir.", "Bearing seat surfaces can be precision ground.", "", ["reference"]],
  ["rolling", "Haddeleme", "Rolling", "İmalat", "Manufacturing", ["haddeleme", "sac", "profil"], ["rolling", "sheet", "profile"], "Haddeleme, malzemenin merdaneler arasından geçirilerek inceltilmesi veya şekillendirilmesidir.", "Rolling reduces thickness or forms material by passing it through rolls.", "Sac, profil ve çubuk üretiminde yaygın bir temel prosestir.", "It is a common base process for sheet, profile, and bar production.", "Sıcak hadde malzeme yapısını, soğuk hadde ölçü ve yüzey kalitesini etkiler.", "Hot rolling affects structure; cold rolling affects dimension and surface quality.", "", ["materials"]],
  ["cnc", "CNC", "CNC", "İmalat", "Manufacturing", ["CNC", "makineleme", "otomasyon"], ["CNC", "machining", "automation"], "CNC, takım tezgahının bilgisayar sayısal kontrol ile yönetilmesidir.", "CNC means computer numerical control of a machine tool.", "Tekrarlanabilir ölçü, karmaşık takım yolu ve seri üretim için kullanılır.", "It enables repeatable dimensions, complex tool paths, and production runs.", "CNC frezede takım yolu CAM programı ile oluşturulabilir.", "In CNC milling, tool paths can be generated with CAM software.", "", ["materials", "reference"]],
  ["additive-manufacturing", "Katmanlı imalat", "Additive Manufacturing", "İmalat", "Manufacturing", ["3D baskı", "katmanlı imalat", "prototip"], ["3D printing", "additive manufacturing", "prototype"], "Katmanlı imalat, parçayı malzeme ekleyerek katman katman üretir.", "Additive manufacturing builds a part layer by layer by adding material.", "Prototip, karmaşık iç kanal ve düşük adetli üretimde esneklik sağlar.", "It helps prototypes, complex internal channels, and low-volume production.", "Bir fikstür çenesi hızlı prototip için 3D baskı ile denenebilir.", "A fixture jaw can be trialed with 3D printing for rapid prototyping.", "", ["fixture", "quality"]],
  ["surface-finishing", "Yüzey işleme", "Surface Finishing", "İmalat", "Manufacturing", ["yüzey işleme", "kaplama", "korozyon"], ["surface finishing", "coating", "corrosion"], "Yüzey işleme, parçanın yüzey özelliklerini değiştiren son işlemlerin genel adıdır.", "Surface finishing is the family of final processes that change surface properties.", "Korozyon, sürtünme, görünüm ve temizlenebilirlik üzerinde etkilidir.", "It affects corrosion, friction, appearance, and cleanability.", "Anodize, galvaniz, boya ve pasivasyon yaygın örneklerdir.", "Anodizing, galvanizing, paint, and passivation are common examples.", "", ["materials", "reference"]],
  ["laminar-flow", "Laminer akış", "Laminar Flow", "Akışkanlar", "Fluids", ["laminer akış", "Reynolds", "boru"], ["laminar flow", "Reynolds", "pipe"], "Laminer akış, akışkanın düzenli tabakalar halinde hareket ettiği rejimdir.", "Laminar flow is a regime where fluid moves in orderly layers.", "Düşük hız veya yüksek viskozite koşullarında basınç kaybı tahminini değiştirir.", "It changes pressure loss estimates under low speed or high viscosity conditions.", "İnce yağ kanallarında laminer davranış görülebilir.", "Laminar behavior can occur in narrow oil channels.", "", ["pipe"]],
  ["turbulent-flow", "Türbülanslı akış", "Turbulent Flow", "Akışkanlar", "Fluids", ["türbülans", "Reynolds", "basınç kaybı"], ["turbulence", "Reynolds", "pressure loss"], "Türbülanslı akış, girdaplı ve karışımlı akış rejimidir.", "Turbulent flow is a mixed flow regime with eddies.", "Boru kayıpları, karışım ve ısı transferi davranışını güçlü etkiler.", "It strongly affects pipe loss, mixing, and heat transfer behavior.", "Yüksek debili su hatlarında türbülanslı akış sık görülür.", "High-flow water lines commonly operate in turbulent flow.", "", ["pipe"]],
  ["reynolds-number", "Reynolds sayısı", "Reynolds Number", "Akışkanlar", "Fluids", ["Reynolds", "akış", "viskozite"], ["Reynolds", "flow", "viscosity"], "Reynolds sayısı, atalet kuvvetlerinin viskoz kuvvetlere oranını temsil eden boyutsuz sayıdır.", "Reynolds number is a dimensionless ratio of inertial to viscous forces.", "Akış rejimini belirlemek için pratik bir ilk kontroldür.", "It is a practical first check for flow regime.", "Boru akışında düşük Reynolds laminer, yüksek Reynolds türbülanslı davranışı gösterir.", "In pipe flow, low Reynolds suggests laminar behavior and high Reynolds suggests turbulent behavior.", "Re = density x velocity x diameter / dynamic viscosity", ["pipe"]],
  ["head-loss", "Basınç kaybı", "Head Loss", "Akışkanlar", "Fluids", ["basınç kaybı", "boru", "pompa"], ["head loss", "pipe", "pump"], "Basınç kaybı, akış sırasında sürtünme ve lokal dirençlerle kaybedilen enerjiye karşılık gelir.", "Head loss is the energy lost to friction and local resistances during flow.", "Pompa seçimi, enerji tüketimi ve proses kararlılığı için temel hesaptır.", "It is essential for pump selection, energy use, and process stability.", "Uzun boru, dar çap ve çok sayıda dirsek basınç kaybını artırır.", "Long pipe, small diameter, and many elbows increase head loss.", "Darcy loss = friction factor x length / diameter x velocity head", ["pipe", "hydraulic"]],
  ["cavitation", "Kavitasyon", "Cavitation", "Akışkanlar", "Fluids", ["kavitasyon", "pompa", "basınç"], ["cavitation", "pump", "pressure"], "Kavitasyon, yerel basınç buhar basıncının altına düştüğünde kabarcık oluşup çökmesidir.", "Cavitation is vapor bubble formation and collapse when local pressure drops below vapor pressure.", "Pompa çarkında aşınma, gürültü ve performans kaybı oluşturur.", "It causes impeller damage, noise, and performance loss in pumps.", "Emiş hattı kayıpları yüksekse pompa girişinde kavitasyon başlayabilir.", "High suction line losses can trigger cavitation at pump inlet.", "", ["pipe", "hydraulic"]],
  ["hydraulic-diameter", "Hidrolik çap", "Hydraulic Diameter", "Akışkanlar", "Fluids", ["hidrolik çap", "kanal", "akış"], ["hydraulic diameter", "duct", "flow"], "Hidrolik çap, dairesel olmayan kesitleri akış hesabında eşdeğer çapla temsil eder.", "Hydraulic diameter represents non-circular sections with an equivalent diameter for flow calculations.", "Kanal, dikdörtgen boru ve açık kanal yaklaşımlarında kullanılır.", "It is used for ducts, rectangular passages, and channel calculations.", "Dikdörtgen kanalda alan ve ıslak çevre üzerinden hidrolik çap hesaplanır.", "In a rectangular duct, hydraulic diameter uses area and wetted perimeter.", "Hydraulic diameter = 4 x area / wetted perimeter", ["pipe"]],
  ["voltage", "Voltaj", "Voltage", "Elektrik", "Electrical", ["voltaj", "elektrik", "güç"], ["voltage", "electrical", "power"], "Voltaj, elektriksel potansiyel farkıdır.", "Voltage is electrical potential difference.", "Motor, sensör ve kontrol devresi seçiminde temel giriş değeridir.", "It is a basic input for selecting motors, sensors, and control circuits.", "24 V DC kontrol devresi, endüstriyel otomasyonda sık kullanılır.", "A 24 V DC control circuit is common in industrial automation.", "", ["unit"]],
  ["resistance", "Direnç", "Resistance", "Elektrik", "Electrical", ["direnç", "elektrik", "ohm"], ["resistance", "electrical", "ohm"], "Direnç, elektrik akımına karşı gösterilen zorluktur.", "Resistance is opposition to electrical current.", "Isınma, gerilim düşümü ve sensör devrelerinde dikkate alınır.", "It matters for heating, voltage drop, and sensor circuits.", "Uzun kabloda direnç artarsa gerilim düşümü büyüyebilir.", "A long cable with higher resistance can create larger voltage drop.", "Resistance = Voltage / Current", ["unit"]],
  ["power-factor", "Güç faktörü", "Power Factor", "Elektrik", "Electrical", ["güç faktörü", "motor", "AC"], ["power factor", "motor", "AC"], "Güç faktörü, gerçek gücün görünür güce oranıdır.", "Power factor is the ratio of real power to apparent power.", "AC motor ve tesis enerji kalitesi hesaplarında kullanılır.", "It is used in AC motor and facility power quality calculations.", "Düşük güç faktörü aynı gerçek güç için daha yüksek akım gerektirebilir.", "Low power factor can require higher current for the same real power.", "Power factor = real power / apparent power", ["unit"]],
];

const termToolMap = {
  tork: ["torque", "shaft", "bolt"],
  torque: ["torque", "shaft", "bolt"],
  gerilme: ["bending", "materials"],
  stress: ["bending", "materials"],
  viskozite: ["pipe", "hydraulic"],
  viscosity: ["pipe", "hydraulic"],
  tolerans: ["reference", "fixture"],
  tolerance: ["reference", "fixture"],
  korozyon: ["materials", "reference"],
  corrosion: ["materials", "reference"],
  Reynolds: ["pipe"],
  basınç: ["pipe", "hydraulic"],
  pressure: ["pipe", "hydraulic"],
  kaynak: ["weld"],
  welding: ["weld"],
  CNC: ["materials", "reference"],
  malzeme: ["materials"],
  material: ["materials"],
};

const relatedToolsForTerm = (tags, locale, explicit = []) => {
  const keys = new Set(explicit);
  for (const tag of tags) {
    const matches = termToolMap[tag] ?? [];
    matches.forEach((key) => keys.add(key));
  }
  if (keys.size === 0) keys.add("reference");
  return Array.from(keys)
    .map((key) => toolLinks[key])
    .filter(Boolean)
    .slice(0, 4)
    .map((link) => `- [${link[locale]}](${link.href})`)
    .join("\n");
};

const buildGlossary = (term, locale) => {
  const [
    slug,
    titleTr,
    titleEn,
    categoryTr,
    categoryEn,
    tagsTr,
    tagsEn,
    defTr,
    defEn,
    importanceTr,
    importanceEn,
    exampleTr,
    exampleEn,
    formula,
    explicitTools = [],
  ] = term;
  const isTr = locale === "tr";
  const title = isTr ? titleTr : titleEn;
  const tags = isTr ? tagsTr : tagsEn;
  const category = isTr ? categoryTr : categoryEn;
  const definition = isTr ? defTr : defEn;
  const importance = isTr ? importanceTr : importanceEn;
  const example = isTr ? exampleTr : exampleEn;
  const description = isTr
    ? `${title}, mühendislik hesaplarında kullanılan temel bir kavramdır. Tanım, kullanım ve pratik örnek.`
    : `${title} is a core engineering term. Definition, usage notes, and a practical example.`;
  const formulaBlock = formula
    ? `
<Formula label="${isTr ? "Temel ifade" : "Basic expression"}">
${formula}
</Formula>
`
    : "";

  return {
    slug,
    content: `${frontmatter({ title, description, tags, category, readingTime: 3 })}${definition}

## ${isTr ? "Neden önemli?" : "Why it matters"}

${importance}

## ${isTr ? "Nasıl kullanılır?" : "How it is used"}

${isTr
  ? "Tasarım kontrolünde önce ilgili yük, ölçü, malzeme veya akış koşulu belirlenir. Sonra bu terim, hesap formülündeki rolüne göre yorumlanır ve sınır değerlerle karşılaştırılır."
  : "In a design check, first define the relevant load, dimension, material, or flow condition. Then interpret this term by its role in the formula and compare it with limits."}

${formulaBlock}
<Callout type="info" title="${isTr ? "Örnek" : "Example"}">
${example}
</Callout>

## ${isTr ? "İlgili hesaplayıcılar ve kaynaklar" : "Related calculators and resources"}

${relatedToolsForTerm(tags, locale, explicitTools)}
`,
  };
};

const writeGeneratedFile = async (type, slug, locale, content) => {
  const dir = path.join(CONTENT_ROOT, type);
  await ensureDir(dir);
  const filePath = path.join(dir, `${slug}.${locale}.mdx`);
  await fs.writeFile(filePath, content, "utf8");
  return path.relative(ROOT, filePath);
};

const run = async () => {
  const written = [];

  for (const guide of guides) {
    written.push(await writeGeneratedFile("guides", guide.slug, "tr", buildGuide(guide, "tr")));
    written.push(await writeGeneratedFile("guides", guide.slug, "en", buildGuide(guide, "en")));
  }

  for (const term of terms) {
    const tr = buildGlossary(term, "tr");
    const en = buildGlossary(term, "en");
    written.push(await writeGeneratedFile("glossary", tr.slug, "tr", tr.content));
    written.push(await writeGeneratedFile("glossary", en.slug, "en", en.content));
  }

  console.log(`[seo-content] Wrote ${written.length} files.`);
  written.forEach((file) => console.log(`- ${file}`));
};

run().catch((error) => {
  console.error("[seo-content] Failed to generate content.");
  console.error(error);
  process.exit(1);
});
