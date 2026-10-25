// Engineering Glossary Data - Part 1 (Slugs 1 - 25)

export const glossaryPart1 = {
  "additive-manufacturing": {
    tags: ["eklemeli imalat", "3D baskı", "DMLS", "SLM", "hızlı prototipleme"],
    category: "İmalat",
    tr: {
      title: "Eklemeli imalat (3D baskı)",
      description: "Eklemeli imalat teknolojileri (DMLS, SLM, FDM), tasarım serbestliği, topoloji optimizasyonu ve mekanik parça üretimi.",
      body: `Eklemeli imalat (Additive Manufacturing), CAD verisini kullanarak malzemeyi katman katman ekleyerek üç boyutlu parçalar üreten gelişmiş imalat teknolojisidir. Geleneksel talaşlı imalatın aksine malzeme eksilterek değil, yalnızca gereken bölgeye malzeme yığarak çalışır.

## Neden önemli?

Hafifletme ve topoloji optimizasyonu gerektiren havacılık ve medikal bileşenlerde geleneksel yöntemlerle işlenemeyen karmaşık iç soğutma kanalları, kafes (lattice) yapılar ve monoblok montajlar üretmeye olanak tanır. Malzeme israfını (buy-to-fly oranını) radikal biçimde düşürür.

## Mühendislik uygulaması ve standartlar

ISO/ASTM 52900 standardına göre sınıflandırılan eklemeli imalat yöntemlerinde:
- **Metal Sistemler (PBF - DMLS / SLM):** Titanyum (Ti-6Al-4V), Nikel süperalaşımları (Inconel 718) ve AlSi10Mg tozları lazerle eritilerek dövme kalitesine yakın mekanik dayanım elde edilir.
- **Anizotropi Kontrolü:** Parçanın Z eksenindeki çekme ve yorulma mukavemeti, katmanlar arası yapışma nedeniyle X-Y düzlemine göre %10-20 daha düşük olabilir; bu durum gerilme analizinde ortotropik malzeme modeliyle hesaba katılmalıdır.
- **Gerilim Giderme:** Lazer sinterleme sonrası oluşan yüksek termal iç gerilmeleri gidermek için parça tabladan kesilmeden önce vakum fırınında gerilim giderme tavlamasına tabi tutulur.

<Callout type="info" title="Endüstriyel Örnek">
Bir havacılık yakıt nozulu 20 farklı döküm ve kaynaklı parçanın birleşiminden oluşurken, DMLS eklemeli imalat ile tek parça (monoblok) olarak üretilmiş; parça ağırlığı %25 azalırken dayanıklılığı 5 kat artırılmıştır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Malzeme Kütüphanesi ve Dayanım Değerleri](/tr/materials)
- [Birim Dönüştürücü](/tr/tools/unit-converter)
- [Basit Gerilme Hesaplayıcı](/tr/tools/simple-stress)
`
    },
    en: {
      title: "Additive manufacturing (3D printing)",
      description: "Additive manufacturing technologies (DMLS, SLM, FDM), design freedom, topology optimization, and structural part fabrication.",
      body: `Additive manufacturing (AM) is an advanced manufacturing methodology that builds three-dimensional components layer by layer directly from 3D CAD models. Unlike subtractive machining that carves material away, additive processes consolidate material strictly where structurally required.

## Why it matters

AM enables organic topology-optimized geometries, internal conformal cooling channels, and lightweight cellular lattice structures that are impossible to machine via conventional 5-axis CNC or casting. It drastically reduces buy-to-fly ratios in high-value aerospace and biomedical hardware.

## Engineering application & standards

Governed by the ISO/ASTM 52900 standard classification:
- **Metal Laser Powder Bed Fusion (PBF - DMLS / SLM):** Uses high-power lasers to fuse fine alloy powders (Ti-6Al-4V, Inconel 718, AlSi10Mg) into near-wrought mechanical densities (>99.5%).
- **Anisotropy Management:** Build orientation strongly affects mechanical performance; Z-axis tensile and fatigue strength can be 10-20% lower than horizontal X-Y properties due to interlayer boundaries, requiring orthotropic finite element modeling.
- **Post-Process Stress Relief:** Extreme thermal gradients during laser scanning introduce severe residual stress; parts must undergo furnace stress-relief annealing prior to substrate wire-EDM cut-off.

<Callout type="info" title="Industrial Example">
A turbine fuel injector nozzle previously fabricated from 20 individually brazed precision components was consolidated into a single DMLS build, slashing total assembly mass by 25% while increasing service lifetime fivefold.
</Callout>

## Related calculators and resources

- [Materials Library and Mechanical Properties](/en/materials)
- [Unit Converter](/en/tools/unit-converter)
- [Simple Stress Calculator](/en/tools/simple-stress)
`
    }
  },
  "ansi": {
    tags: ["ANSI", "standartlar", "Amerikan standartları", "bağlantı elemanları"],
    category: "Standartlar",
    tr: {
      title: "ANSI (Amerikan Ulusal Standartlar Enstitüsü)",
      description: "ANSI standartlarının endüstriyel makine tasarımı, inç dişli bağlantı elemanları ve borulama sistemlerindeki rolü.",
      body: `ANSI (American National Standards Institute), Amerika Birleşik Devletleri'nde endüstriyel ve teknik standartların geliştirilmesini koordine eden ve onaylayan ulusal akreditasyon kuruluşudur. Kendi başına teknik şartname yazmaktan ziyade ASME, ASTM ve SAE gibi uzman kuruluşların hazırladığı standartları denetler ve resmi ulusal norm haline getirir.

## Neden önemli?

Kuzey Amerika pazarına veya Amerikan normlarına (ASME B1.1 inç dişler, ASME B16.5 boru flanşları) uygun ihracat projelerinde makine ve basınçlı ekipman güvenliğini temin etmek için ANSI standartlarına uyum zorunludur.

## Mühendislik uygulaması ve standartlar

- **ANSI/ASME B1.1:** Unified Inch Screw Threads (UNC kaba, UNF ince diş serileri). Metrik $60^\circ$ diş profili ile benzer temel üçgen geometriye sahip olmakla birlikte vida adımı inç başına diş sayısı (TPI) ile tanımlanır.
- **ANSI/ASME B16.5:** Çelik boru flanşları ve flanşlı bağlantı elemanları (Class 150, 300, 600, 900 basınç kademeleri).
- **ANSI B4.1:** Silindirik parçalar için inç bazlı tolerans ve geçme (Running and Sliding fits, Locating fits, Force fits) sistemi.

<Callout type="info" title="Pratik Tasarım Örneği">
1/2"-13 UNC cıvata tanımında "1/2"" anma dış çapını ($12.7\text{ mm}$), "13" ise bir inç boyundaki diş sayısını ifade eder. Metrik hatve karşılığı $P = 25.4 / 13 \approx 1.954\text{ mm}$'dir.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Birim Dönüştürücü (İnç - Metrik)](/tr/tools/unit-converter)
- [Cıvata Mukavemeti ve Tork Hesabı](/tr/tools/bolt-calculator)
- [Standartlar Kütüphanesi](/tr/standards)
`
    },
    en: {
      title: "ANSI (American National Standards Institute)",
      description: "Role of ANSI standards in industrial equipment design, Unified inch threaded fasteners, and process piping systems.",
      body: `The American National Standards Institute (ANSI) is the primary private non-profit organization that oversees the development of voluntary consensus standards for products, services, and systems in the United States. ANSI coordinates US standards with international bodies and accredits standard development organizations such as ASME, ASTM, and SAE.

## Why it matters

Exporting machinery, pressure vessels, or structural skids to North American industries requires rigorous conformance to ANSI-accredited codes to ensure mechanical interchangeability, structural integrity, and statutory safety compliance.

## Engineering application & standards

- **ANSI/ASME B1.1:** Unified Inch Screw Threads (UNC coarse, UNF fine pitches). Shares the $60^\circ$ symmetrical thread profile with ISO metric fasteners but measures lead as threads per inch (TPI).
- **ANSI/ASME B16.5:** Pipe Flanges and Flanged Fittings covering Class 150 through Class 2500 pressure-temperature ratings.
- **ANSI B4.1:** Preferred Limits and Fits for Cylindrical Parts, specifying precision running, clearance, transition, and interference fits in imperial units.

<Callout type="info" title="Practical Engineering Note">
In a 1/2"-13 UNC bolt callout, 1/2" designates nominal major diameter ($12.7\text{ mm}$) and 13 denotes pitch as threads per inch. The equivalent thread pitch is $P = 25.4 / 13 \approx 1.954\text{ mm}$.
</Callout>

## Related calculators and resources

- [Unit Converter (Imperial - Metric)](/en/tools/unit-converter)
- [Bolt Strength and Preload Calculator](/en/tools/bolt-calculator)
- [Standards Index](/en/standards)
`
    }
  },
  "asme": {
    tags: ["ASME", "kazan ve basınçlı kaplar", "GD&T", "ASME Y14.5", "borulama"],
    category: "Standartlar",
    tr: {
      title: "ASME (Amerikan Mekanik Mühendisleri Topluluğu)",
      description: "ASME standartları, BPVC kazan ve basınçlı kap yönetmelikleri, ASME Y14.5 geometrik toleranslandırma ve borulama kodları.",
      body: `ASME (American Society of Mechanical Engineers), mekanik mühendisliği alanında dünya çapında kabul gören teknik kodlar ve standartlar yayınlayan köklü bir meslek kuruluşudur. Özellikle basınçlı kaplar, nükleer tesisler, proses borulaması ve geometrik ürün şartnamelerinde küresel referans kabul edilir.

## Neden önemli?

Yüksek basınç altında patlama riski taşıyan depolama tankları, buhar kazanları ve boru hatları ASME onaylı imalat ve kaynak prosedürleri olmadan uluslararası işletmeye alınamaz. Ayrıca teknik resim standardizasyonunda ASME Y14.5 küresel dildir.

## Mühendislik uygulaması ve standartlar

- **ASME BPVC (Boiler and Pressure Vessel Code):** Section VIII Div 1 ve Div 2 basınçlı kap tasarım formülleri, izin verilen gerilmeler, kaynaklı ek verimleri ve tahribatsız muayene (NDT) şartlarını tanımlar.
- **ASME B31 Serisi:** Endüstriyel borulama kodları (B31.1 Güç borulaması, B31.3 Kimyasal proses borulaması). Termal genleşme gerilmesi ve iç basınç et kalınlığı hesaplarını kurallar bağlar.
- **ASME Y14.5:** Geometrik Boyutlandırma ve Toleranslandırma (GD&T) standardı; datum referans sistemleri ve geometrik tolerans sembollerinin resmi şartnamesidir.

<Callout type="info" title="Tasarım Kuralı">
ASME B31.3'e göre et kalınlığı hesabı: $t = \frac{P \cdot D}{2(S \cdot E + P \cdot Y)} + c$ formülüyle yapılır ($S$: izin verilen gerilme, $E$: kaynak dikiş katsayısı, $c$: korozyon payı).
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Tolerans Yığılması ve GD&T Laboratuvarı](/tr/tools/tolerance-lab)
- [Boru Basınç Kaybı Hesaplayıcı](/tr/tools/pipe-pressure-loss)
- [Standartlar Kütüphanesi](/tr/standards)
`
    },
    en: {
      title: "ASME (American Society of Mechanical Engineers)",
      description: "ASME Boiler & Pressure Vessel Code (BPVC), ASME Y14.5 geometric tolerancing, and process piping design codes.",
      body: `The American Society of Mechanical Engineers (ASME) is a premier engineering authority that authors world-renowned technical codes governing pressure containment, piping integrity, nuclear components, and engineering drawing standards.

## Why it matters

Pressure equipment operating at elevated pressures presents catastrophic burst hazards. ASME accreditation is mandatory across global oil & gas, chemical, power generation, and manufacturing sectors to certify safe design margins and quality assurance.

## Engineering application & standards

- **ASME BPVC (Boiler and Pressure Vessel Code):** Section VIII Divisions 1 and 2 define allowable material stresses, joint efficiencies, ellipsoidal head geometries, and hydrostatic proof test pressures.
- **ASME B31 Process Piping Series:** B31.1 (Power Piping) and B31.3 (Process Piping) regulate wall thickness calculations, thermal expansion flexibility stress analysis, and allowable sustained stress limits.
- **ASME Y14.5:** The authoritative global standard for Geometric Dimensioning and Tolerancing (GD&T), establishing datum reference frames, material condition modifiers, and feature control frames.

<Callout type="info" title="Design Formula">
Under ASME B31.3, minimum pipe wall thickness is calculated as: $t = \frac{P \cdot D}{2(S \cdot E + P \cdot Y)} + c$, where $S$ is basic allowable stress, $E$ is weld joint quality factor, and $c$ is mechanical/corrosion allowance.
</Callout>

## Related calculators and resources

- [Tolerance Stack-Up & GD&T Lab](/en/tools/tolerance-lab)
- [Pipe Pressure Loss Calculator](/en/tools/pipe-pressure-loss)
- [Standards Index](/en/standards)
`
    }
  },
  "astm": {
    tags: ["ASTM", "malzeme testleri", "çelik kaliteleri", "çekme testi"],
    category: "Standartlar",
    tr: {
      title: "ASTM (Amerikan Test ve Malzeme Kuruluşu)",
      description: "ASTM malzeme şartnameleri, metalik ve polimerik test standartları, mekanik test yöntemleri (ASTM E8 çekme testi).",
      body: `ASTM International (American Society for Testing and Materials), metallerden kompozitlere, petrolden inşaat ürünlerine kadar tüm mühendislik malzemelerinin kimyasal bileşimini, mekanik özelliklerini ve test yöntemlerini standartlaştıran uluslararası kuruluştur.

## Neden önemli?

Bir malzemenin sertifikasında "ASTM A36" veya "ASTM A193 B7" ibaresi bulunması, malzemenin kimyasal sınırlarının ve akma/çekme dayanımlarının bağımsız laboratuvarlarca doğrulanabilir olmasını sağlar. İmalatçılar arasındaki malzeme eşdeğerlik analizinin temelidir.

## Mühendislik uygulaması ve standartlar

- **ASTM A36 / A572:** Yapısal karbon çeliği ve yüksek mukavemetli düşük alaşımlı çelik levha/profil şartnameleri.
- **ASTM A193 / A194:** Yüksek sıcaklık ve basınç servislerinde kullanılan alaşımlı çelik saplama ve somun standartları (B7 saplamalar, 2H somunlar).
- **ASTM E8 / E8M:** Metalik malzemelerin standart çekme testi yöntemi; akma ($R_{p0.2}$), çekme ($R_m$) ve % uzama ($A_5$) tespit protokolüdür.
- **ASTM C547:** Mineral yün boru yalıtımı malzeme ve ısıl iletkenlik şartnamesi.

<Callout type="info" title="Malzeme Eşdeğerliği">
ASTM A36 yapısal çeliğinin minimum akma mukavemeti $36\text{ ksi} \approx 250\text{ MPa}$'dır. Avrupa normundaki EN 10025 S235JR veya S275JR kalitelerine yakın mekanik eşdeğerlik gösterir.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Malzeme Kütüphanesi ve Dayanım Değerleri](/tr/materials)
- [Basit Gerilme Hesaplayıcı](/tr/tools/simple-stress)
- [Cıvata Mukavemeti ve Tork Hesabı](/tr/tools/bolt-calculator)
`
    },
    en: {
      title: "ASTM (American Society for Testing and Materials)",
      description: "ASTM material specifications, metallic and polymer testing standards, and mechanical testing methods (ASTM E8 tensile test).",
      body: `ASTM International is a globally recognized standardization body that establishes technical specifications, test methods, and testing protocols for raw materials, manufactured metals, polymers, and chemical products across all engineering disciplines.

## Why it matters

Specifying materials by their ASTM designation (e.g., ASTM A36 structural steel or ASTM A193 B7 alloy studs) ensures chemical purity, heat-treatment compliance, and certified mechanical strength limits, forming the legal basis of material procurement and vendor QA.

## Engineering application & standards

- **ASTM A36 / A572:** Standard specifications for carbon and high-strength low-alloy structural steel plates, shapes, and bars.
- **ASTM A193 / A194:** Alloy-steel and stainless-steel bolting materials for high-temperature or high-pressure service (such as Grade B7 studs and Grade 2H heavy hex nuts).
- **ASTM E8 / E8M:** Standard test methods for tension testing of metallic materials, defining proof stress, ultimate tensile strength, and elongation measurement procedures.
- **ASTM B117:** Standard practice for operating salt spray (fog) apparatus for accelerated corrosion assessment.

<Callout type="info" title="Material Equivalence">
ASTM A36 carbon steel features a minimum specified yield strength of $36\text{ ksi} \approx 250\text{ MPa}$, making it functionally equivalent to European structural grades EN 10025 S235JR and S275JR.
</Callout>

## Related calculators and resources

- [Materials Library and Mechanical Properties](/en/materials)
- [Simple Stress Calculator](/en/tools/simple-stress)
- [Bolt Strength and Preload Calculator](/en/tools/bolt-calculator)
`
    }
  },
  "backlash": {
    tags: ["dişli boşluğu", "backlash", "mekanizma", "redüktör", "pozisyonlama"],
    category: "Mekanik",
    tr: {
      title: "Dişli boşluğu (backlash)",
      description: "Dişli çarklarda ve tahrik mekanizmalarında diş boşluğu, pozisyonlama hassasiyeti, ısıl genleşme payı ve minimum boşluk hesabı.",
      body: `Dişli boşluğu (Backlash), birbiriyle kavraşan iki dişlinin çalışma esnasında temas etmeyen arka diş yanakları arasında kalan dairesel veya normal boşluktur. Dişlilerin sıkışmadan dönebilmesi için zorunlu bir mühendislik payıdır.

## Neden önemli?

Boşluğun sıfır veya yetersiz olması ısıl genleşmeyle dişlerin birbirini sıkıştırmasına, yağ filminin yırtılmasına ve diş kırılmasına yol açar. Aşırı boşluk ise robotik ve CNC eksenlerinde pozisyonlama hatasına, yön değişimlerinde darbe sesine ve dinamik titreşime neden olur.

## Mühendislik uygulaması ve standartlar

ISO 21771 ve DIN 3967 standartlarına göre dişli boşluğu modüle ($m$) ve eksenler arası mesafeye ($a$) göre belirlenir:
- **Minimum Diş Boşluğu ($j_{t,min}$):** Çalışma sıcaklığındaki ısıl genleşme farkını ($\Delta a_{th} = a \cdot \Delta T \cdot (\alpha_{govde} - \alpha_{disli})$) ve yağlama filmi payını karşılayacak seviyede tutulmalıdır.
- **Boşluksuz Çözümler:** CNC döner tablalarında ve robot eklemlerinde backlash'i sıfıra indirmek için harmonik tahrik (strain wave gears), sikloit redüktörler veya ön yüklemeli çift pinyon (dual pinion) mekanizmaları kullanılır.

<Callout type="info" title="Pratik Tasarım Kuralı">
Genel sanayi dişlilerinde normal diş boşluğu genellikle $j_n \approx 0.03 \dots 0.05 \cdot m$ (burada $m$ modüldür) formülüyle tayin edilir. Modül 4 dişli için tavsiye edilen boşluk $0.12 - 0.20\text{ mm}$ aralığındadır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Dişli Modülü ve Geometrisi Hesaplayıcı](/tr/tools/gear-module)
- [Tolerans Yığılması ve GD&T Laboratuvarı](/tr/tools/tolerance-lab)
- [Güç - Tork - Devir Hesaplayıcı](/tr/tools/torque-power)
`
    },
    en: {
      title: "Gear backlash",
      description: "Rotational backlash in gear trains and precision actuators, positioning accuracy, thermal growth allowances, and minimum clearance rules.",
      body: `Gear backlash is the intentional clearance between the non-driving tooth flanks of a mating gear pair when the driving flanks are in full meshing contact. It is measured either along the pitch circle (circumferential backlash) or perpendicular to the tooth profile (normal backlash).

## Why it matters

Zero or insufficient backlash causes severe tooth jamming, lubrication starvation, extreme bearing loads, and premature gear scuffing due to operational thermal expansion. Conversely, excessive backlash produces positioning lost motion, velocity hunting, and shock chatter during rotational reversals.

## Engineering application & standards

Governed by ISO 21771 and DIN 3967 gear accuracy standards:
- **Minimum Operational Backlash ($j_{t,min}$):** Must comfortably accommodate differential thermal expansion between the gear blanks and the gearbox housing ($\Delta a_{thermal} = a \cdot \Delta T \cdot (\alpha_{housing} - \alpha_{gear})$) plus lubricant film thickness.
- **Zero-Backlash Systems:** Precision robotic joints and machine tool feed drives employ planetary preloaded dual-pinions, cycloidal drives, or harmonic strain-wave gearing to eliminate lost motion entirely.

<Callout type="info" title="Rule of Thumb">
In standard industrial spur and helical gear drives, normal backlash is typically sized as: $j_n \approx 0.03 \dots 0.05 \cdot m$ (where $m$ is module). For a module 4 gear, nominal backlash is $0.12\text{ mm}$ to $0.20\text{ mm}$.
</Callout>

## Related calculators and resources

- [Gear Module and Geometry Calculator](/en/tools/gear-module)
- [Tolerance Stack-Up & GD&T Lab](/en/tools/tolerance-lab)
- [Power - Torque - Speed Calculator](/en/tools/torque-power)
`
    }
  },
  "bending-moment": {
    tags: ["eğilme momenti", "mukavemet", "kiriş", "gerilme", "atalet momenti"],
    category: "Mekanik",
    tr: {
      title: "Eğilme momenti",
      description: "Kiriş ve millerde eğilme momenti dağılımı, Navier eğilme gerilmesi formülü, kesme kuvveti diyagramı ve mukavemet momenti hesabı.",
      body: `Eğilme momenti ($M_b$), bir yapısal elemanın (kiriş, mil, profil) enine yüklere veya dış kuvvet çiftlerine maruz kaldığında kesit boyunca eksenel eğilmeye zorlayan iç moment bileşkesidir.

## Neden önemli?

Millerde ve makine şaselerinde en yüksek çekme ve basma gerilmeleri genellikle eğilme momentinden kaynaklanır. Eğilme momentinin tepe yaptığı kesitlerin doğru tespit edilmemesi, makine millerinde yorulma kırılmalarının ve kirişlerde kalıcı sehimlerin ana nedenidir.

## Mühendislik uygulaması ve standartlar

Euler-Bernoulli kiriş teorisine (Navier formülü) göre eğilme gerilmesi:
$$\sigma_b = \frac{M_b \cdot y}{I_x} = \frac{M_b}{W_b}$$
- $M_b$: Kesitteki eğilme momenti [$\text{N}\cdot\text{mm}$],
- $y$: Tarafsız eksenden en uzak lifin mesafesi [$\text{mm}$],
- $I_x$: Kesitin tarafsız eksene göre atalet momenti [$\text{mm}^4$],
- $W_b = I_x / y_{max}$: Kesit mukavemet momenti [$\text{mm}^3$] (Dairesel dolu mil için $W_b = \frac{\pi \cdot d^3}{32}$).

<Callout type="info" title="Mühendislik Hesabı">
$d = 50\text{ mm}$ çapında bir çelik mil üzerinde $M_b = 600\text{ Nm} = 600\,000\text{ N}\cdot\text{mm}$ eğilme momenti etkiyorsa:
$$W_b = \frac{\pi \times 50^3}{32} \approx 12\,272\text{ mm}^3 \implies \sigma_b = \frac{600\,000}{12\,272} \approx \mathbf{48.9\text{ MPa}}$$
Bu gerilme izin verilen dinamik eğilme yorulma sınırıyla karşılaştırılır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Eğilme Gerilmesi ve Kiriş Hesaplayıcı](/tr/tools/bending-stress)
- [Şaft Boyutlandırma ve Burulma](/tr/tools/shaft-torsion)
- [Basit Gerilme Hesaplayıcı](/tr/tools/simple-stress)
`
    },
    en: {
      title: "Bending moment",
      description: "Bending moment distribution in shafts and structural beams, Navier flexural stress formula, shear force diagrams, and section modulus sizing.",
      body: `A bending moment ($M_b$) is the internal reaction induced in a structural element (such as a shaft, beam, or bracket) when external lateral loads or couples cause transverse bending curvature across the longitudinal axis.

## Why it matters

In rotating machinery and chassis structures, flexural stresses produced by bending moments dominate fatigue loading. Misidentifying peak bending locations results in unexpected shaft fatigue failures, bearing misalignment, and unacceptable elastic deflections.

## Engineering application & standards

Governed by Euler-Bernoulli beam theory and the Navier flexural stress formula:
$$\sigma_b = \frac{M_b \cdot y}{I_x} = \frac{M_b}{W_b}$$
- $M_b$: Internal bending moment [$\text{N}\cdot\text{mm}$],
- $y$: Perpendicular distance from neutral axis [$\text{mm}$],
- $I_x$: Second moment of area (area moment of inertia) [$\text{mm}^4$],
- $W_b = I_x / y_{max}$: Elastic section modulus [$\text{mm}^3$] (For solid round shafts: $W_b = \frac{\pi \cdot d^3}{32}$).

<Callout type="info" title="Engineering Calculation">
For a solid shaft with $d = 50\text{ mm}$ subjected to $M_b = 600\text{ Nm} = 600\,000\text{ N}\cdot\text{mm}$:
$$W_b = \frac{\pi \times 50^3}{32} \approx 12\,272\text{ mm}^3 \implies \sigma_b = \frac{600\,000}{12\,272} \approx \mathbf{48.9\text{ MPa}}$$
This stress is evaluated against fatigue endurance limits using the modified Goodman criterion.
</Callout>

## Related calculators and resources

- [Bending Stress and Beam Calculator](/en/tools/bending-stress)
- [Shaft Sizing and Torsion](/en/tools/shaft-torsion)
- [Simple Stress Calculator](/en/tools/simple-stress)
`
    }
  },
  "buckling": {
    tags: ["burkulma", "kolon", "Euler", "kritik yük", "stabilite"],
    category: "Mekanik",
    tr: {
      title: "Burkulma (buckling)",
      description: "Basma altındaki narin elemanlarda Euler burkulması, kritik yük ($P_{cr}$), narinlik oranı ve elastik stabilite kaybı analizi.",
      body: `Burkulma (Buckling), eksenel basma yüküne maruz kalan ince ve uzun (narin) yapısal elemanların, malzemenin akma dayanımına ulaşmadan önce aniden yanal olarak bükülerek geometrik stabilitesini kaybetmesidir.

## Neden önemli?

Bir hidrolik silindir mili veya kolon statik basma gerilmesi açısından tamamen emniyetli görünse bile, narinlik sebebiyle akma gerilmesinin onda biri bir yükte elastik olarak çökebilir. Burkulma anlık ve yıkıcı biçimde gerçekleşir.

## Mühendislik uygulaması ve standartlar

Euler formülü elastik burkulma için kritik yükü ($P_{cr}$) verir:
$$P_{cr} = \frac{\pi^2 \cdot E \cdot I}{(K \cdot L)^2}$$
- $E$: Elastisite modülü [$\text{MPa}$],
- $I$: En küçük kesit atalet momenti [$\text{mm}^4$],
- $L$: Elemanın serbest boyu [$\text{mm}$],
- $K$: Uç mesnet katsayısı (İki ucu mafsallı: $K = 1.0$, bir ucu ankastre bir ucu serbest: $K = 2.0$, iki ucu ankastre: $K = 0.5$).
Narinlik oranı $\lambda = \frac{K \cdot L}{r_{gyr}}$ kritik narinlik sınırından ($\lambda_c \approx 89 - 105$ çelik için) küçükse Tetmajer veya Johnson elastoplastik burkulma formülleri uygulanır.

<Callout type="info" title="Çözümlü Örnek">
$L = 1000\text{ mm}$ boyunda iki ucu mafsallı ($K = 1$) çelik çubuk ($d = 20\text{ mm}$, $E = 210\,000\text{ MPa}$, $I = \frac{\pi \times 20^4}{64} \approx 7854\text{ mm}^4$):
$$P_{cr} = \frac{\pi^2 \times 210\,000 \times 7854}{(1 \times 1000)^2} \approx \mathbf{16\,277\text{ N}} \approx \mathbf{16.3\text{ kN}}$$
16.3 kN üzerindeki eksenel basma yükünde çubuk anında burkulur.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Hidrolik Silindir Kuvvet ve Hız](/tr/tools/hydraulic-cylinder)
- [Basit Gerilme ve Güvenlik Faktörü](/tr/tools/simple-stress)
- [Malzeme Kütüphanesi](/tr/materials)
`
    },
    en: {
      title: "Column buckling",
      description: "Euler column buckling under axial compression, critical load ($P_{cr}$), slenderness ratio, and elastic instability failure analysis.",
      body: `Buckling is a sudden catastrophic mode of structural failure where a slender member subjected to compressive axial stress deflects laterally perpendicular to the loading axis before the material achieves its compressive yield strength.

## Why it matters

A long lead screw or hydraulic cylinder piston rod can fail catastrophically under compressive loads that represent only a fraction of its nominal yield limit. Buckling is governed by geometric stiffness and flexural rigidity rather than raw yield strength.

## Engineering application & standards

Governed by the classical Euler buckling equation for elastic columns:
$$P_{cr} = \frac{\pi^2 \cdot E \cdot I}{(K \cdot L)^2}$$
- $E$: Modulus of elasticity [$\text{MPa}$],
- $I$: Minimum cross-sectional area moment of inertia [$\text{mm}^4$],
- $L$: Unsupported column length [$\text{mm}$],
- $K$: Effective column length factor (Pinned-pinned: $K = 1.0$, fixed-free: $K = 2.0$, fixed-fixed: $K = 0.5$, fixed-pinned: $K = 0.7$).
When the slenderness ratio $\lambda = \frac{K \cdot L}{r_g}$ falls below the transition threshold ($\lambda_c \approx 89$ for structural steel), the inelastic Johnson parabolic formula must be used.

<Callout type="info" title="Worked Example">
A pinned-pinned ($K = 1$) steel rod of length $L = 1000\text{ mm}$ with $d = 20\text{ mm}$ ($E = 210\,000\text{ MPa}$, $I = \frac{\pi \times 20^4}{64} \approx 7854\text{ mm}^4$):
$$P_{cr} = \frac{\pi^2 \times 210\,000 \times 7854}{(1 \times 1000)^2} \approx \mathbf{16\,277\text{ N}} \approx \mathbf{16.3\text{ kN}}$$
Any compressive axial load exceeding 16.3 kN triggers immediate catastrophic flexural buckling.
</Callout>

## Related calculators and resources

- [Hydraulic Cylinder Force and Speed](/en/tools/hydraulic-cylinder)
- [Simple Stress and Factor of Safety](/en/tools/simple-stress)
- [Materials Library and Mechanical Properties](/en/materials)
`
    }
  },
  "casting": {
    tags: ["döküm", "metal döküm", "çekme payı", "dökme demir", "imalat"],
    category: "İmalat",
    tr: {
      title: "Metal döküm (casting)",
      description: "Döküm imalat yöntemleri (kum döküm, kokil, hassas döküm), döküm çekme payı, gözeneklilik ve dökme demir mekanik özellikleri.",
      body: `Döküm (Casting), ergimiş sıvı metalin önceden hazırlanmış bir kalıp boşluğuna dökülerek katılaşması yoluyla istenen geometrinin elde edildiği temel imalat yöntemidir. Redüktör gövdeleri, motor blokları ve karmaşık vanaların üretiminde en ekonomik çözümdür.

## Neden önemli?

Talaşlı imalatla boşaltılması imkansız veya çok pahalı olan karmaşık iç kaviteler ve eğrisel gövdeler döküm ile tek seferde üretilir. Ancak katılaşma esnasında meydana gelen hacimsel çekme (büzülme) ve gaz gözenekliliği doğru yönetilmezse parça hurdaya çıkar.

## Mühendislik uygulaması ve standartlar

- **Döküm Çekme Payı:** Sıvı metal soğurken büzülür; model boyutlarına dökme demir için %1, çelik döküm için %2 çekme toleransı eklenir.
- **Tasarım Kuralları (DFM):** Keskin köşelerden kaçınılmalı, homojen et kalınlığı korunmalı ve kalıptan çıkarma için $1^\circ - 3^\circ$ döküm eğimi (draft angle) verilmelidir.
- **Malzeme Türleri:** Gri dökme demir (EN-GJL-250) mükemmel titreşim sönümleme sağlar; sfero dökme demir (EN-GJS-400-15) ise küresel grafit yapısıyla çeliğe yakın tokluk ve süneklik sunar.

<Callout type="info" title="İmalat İpucu">
Döküm parçalarda et kalınlığının aniden değiştiği bölgelerde sıcak nokta (hot spot) ve çekme boşluğu oluşur; kesit geçişleri daima $R \ge \text{et kalınlığı}$ radyusları ile yumuşatılmalıdır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Malzeme Kütüphanesi ve Dayanım Değerleri](/tr/materials)
- [Tolerans Yığılması ve GD&T Laboratuvarı](/tr/tools/tolerance-lab)
- [Birim Dönüştürücü](/tr/tools/unit-converter)
`
    },
    en: {
      title: "Metal casting",
      description: "Metal casting processes (sand, die, investment casting), pattern shrinkage allowance, porosity mitigation, and cast iron metallurgy.",
      body: `Metal casting is a foundational manufacturing process wherein molten liquid metal is poured into a refractory or permanent mold cavity containing the negative shape of the target part, solidifying into near-net-shape mechanical components.

## Why it matters

Casting provides unparalleled cost efficiency for complex geometry, large gearbox housings, valve bodies, and pump volutes with internal passages that cannot be milled. However, liquid-to-solid volumetric shrinkage and gaseous porosity require strict metallurgical control.

## Engineering application & standards

- **Patternmaker Shrinkage Allowance:** Metals contract as they cool; pattern tooling must scale up by approximately 1.0% for gray cast iron and 1.8% to 2.2% for cast carbon steel.
- **Design for Casting (DFC):** Requires uniform wall thickness to eliminate hot spots, generous fillet transitions ($R \ge \text{thickness}$), and $1^\circ$ to $3^\circ$ draft angles to facilitate pattern extraction.
- **Metallurgical Families:** Gray iron (EN-GJL-250) offers unmatched compressive strength and vibration damping; ductile nodular iron (EN-GJS-400-15) delivers high tensile toughness comparable to structural carbon steel.

<Callout type="info" title="Manufacturing Tip">
Abrupt section thickness transitions create isolated molten pools that cool last, causing internal shrinkage cavities (voids); cross-sections must transition gradually with generous blending radii.
</Callout>

## Related calculators and resources

- [Materials Library and Mechanical Properties](/en/materials)
- [Tolerance Stack-Up & GD&T Lab](/en/tools/tolerance-lab)
- [Unit Converter](/en/tools/unit-converter)
`
    }
  },
  "cavitation": {
    tags: ["kavitasyon", "pompa", "NPSH", "buhar basıncı", "akışkanlar"],
    category: "Akışkanlar",
    tr: {
      title: "Kavitasyon",
      description: "Hidrolik sistemlerde kavitasyon mekanizması, buhar basıncı, çark kanadı erozyonu ve NPSH güvenlik payı hesabı.",
      body: `Kavitasyon, hidrolik pompalarda, vanalarda ve boru hatlarında yerel statik basıncın akışkanın o sıcaklıktaki doymuş buhar basıncının ($P_v$) altına düşmesiyle mikroskobik buhar kabarcıklarının oluşması ve ardından yüksek basınç bölgesinde şiddetle patlayarak çökmesidir.

## Neden önemli?

Buhar kabarcıklarının çökmesi sırasında oluşan mikro-jetler metal yüzeye $1000\text{ MPa}$'yı aşan yerel darbe basınçları uygular. Bu durum pompa çark kanatlarında süngerimsi oyuklaşma (pitting), gürültü, şiddetli titreşim ve pompalama veriminin tamamen çökmesine yol açar.

## Mühendislik uygulaması ve standartlar

Kavitasyonu engellemek için sistemin net pozitif emme yüksekliği ($NPSH_A$) pompanın gerektirdiği değerden ($NPSH_R$) büyük olmalıdır:
$$NPSH_A = \frac{P_{ortam} - P_v}{\rho \cdot g} \pm h_s - h_{f,emis} \ge NPSH_R + 0.5\dots 1.0\text{ m}$$
- **Emiş Borusu Boyutlandırma:** Emiş hattındaki akış hızı $1.0 - 1.2\text{ m/s}$ ile sınırlandırılmalı, emiş filtresi ve dirsek sürtünme kayıpları en aza indirilmelidir.
- **Sıcaklık Kontrolü:** Akışkan sıcaklığı arttıkça buhar basıncı üstel olarak artar; $80\text{ °C}$ suyun buhar basıncı $47.4\text{ kPa}$'ya çıkarak kavitasyon riskini katlar.

<Callout type="info" title="Pratik Teşhis">
Pompa içinde sanki çakıl taşları veya bilyalar dönüyormuş gibi çatırtılı bir ses geliyorsa ve debi aniden dalgalanıyorsa pompa kavitasyondadır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Boru Basınç Kaybı Hesaplayıcı](/tr/tools/pipe-pressure-loss)
- [Pompa Türleri ve Seçim Rehberi](/tr/guides/pompa-turleri-secim-rehberi)
- [Birim Dönüştürücü](/tr/tools/unit-converter)
`
    },
    en: {
      title: "Cavitation",
      description: "Hydraulic cavitation mechanisms, vapor pressure flashing, impeller erosion pitting, and Net Positive Suction Head (NPSH) safety margin.",
      body: `Cavitation is a fluid mechanics phenomenon occurring in pumps, valves, and propellers when localized static fluid pressure drops below the liquid saturated vapor pressure ($P_v$), causing instantaneous vapor bubble nucleation followed by violent micro-jet collapse in higher-pressure recovery zones.

## Why it matters

The implosion of cavitation bubbles generates localized micro-jets with shockwave pressures exceeding $1000\text{ MPa}$. This hammer-like erosion rapidly erodes metal surfaces into porous sponges (pitting), destroys seals and bearings through severe vibration, and collapses pump head.

## Engineering application & standards

Preventing cavitation requires maintaining available net positive suction head ($NPSH_A$) strictly above vendor-certified required head ($NPSH_R$):
$$NPSH_A = \frac{P_{ambient} - P_v}{\rho \cdot g} \pm h_s - h_{f,suction} \ge NPSH_R + 0.5\dots 1.0\text{ m}$$
- **Suction Line Design:** Suction liquid velocities must remain below $1.0 - 1.2\text{ m/s}$, avoiding sharp elbows directly at the pump suction nozzle.
- **Fluid Temperature Impact:** Vapor pressure rises exponentially with temperature; water at $80\text{ °C}$ exhibits a vapor pressure of $47.4\text{ kPa}$, slashing suction margins.

<Callout type="info" title="Diagnostic Indicator">
A pump sounding like it is pumping gravel or marbles accompanied by severe low-frequency vibration and discharge head collapse is undergoing active cavitation.
</Callout>

## Related calculators and resources

- [Pipe Pressure Loss Calculator](/en/tools/pipe-pressure-loss)
- [Pump Selection Guide](/en/guides/pompa-turleri-secim-rehberi)
- [Unit Converter](/en/tools/unit-converter)
`
    }
  },
  "clearance": {
    tags: ["boşluk", "tolerans", "ISO 286", "çalışma boşluğu", "yataklama"],
    category: "Tolerans",
    tr: {
      title: "Çalışma boşluğu (clearance)",
      description: "ISO 286 boşluklu geçmeler (H7/g6, H7/h6), radyal yatak çalışma boşluğu, yağ filmi kalınlığı ve ısıl genleşme payı.",
      body: `Çalışma boşluğu (Clearance), montaj halindeki bir delik ve mil çiftinde delik çapının mil çapından daima daha büyük olması durumunda aradaki pozitif boyutsal farktır. Parçaların birbirine göre serbestçe dönmesini veya kaymasını sağlar.

## Neden önemli?

Döner yataklarda ve kayar burçlarda hidrodinamik yağ filminin oluşabilmesi ve parçaların ısıl genleşme ile sıkışmaması için belirli bir minimum boşluk zorunludur. Boşluğun aşırı büyük olması ise eksen kaçıklığına, vuruntuya ve titreşime yol açar.

## Mühendislik uygulaması ve standartlar

ISO 286-1 geçme sisteminde boşluklu geçmeler (Clearance fits):
- **H7/h6:** Sıfır boşluklu kayar geçme; elle rahat hareket eden, boşluksuz merkezleme gerektiren takımlar ve pimler.
- **H7/g6:** Hassas dönme geçmesi; takım tezgahı milleri ve hassas mekanizmalar.
- **H8/f7:** Genel makine mühendisliği döner yatak geçmesi; termal genleşmeye ve yağlamaya uygun çalışma boşluğu sağlar.
- **Minimum ve Maksimum Boşluk Hesabı:**
  $$C_{min} = D_{delik,min} - d_{mil,max}, \quad C_{max} = D_{delik,max} - d_{mil,min}$$

<Callout type="info" title="Endüstriyel Kural">
Hidrodinamik kaymalı yataklarda tavsiye edilen radyal boşluk oranı genellikle mil çapının binde biri mertebesindedir: $\psi = \frac{\Delta d}{d} \approx 0.001 \dots 0.0015$.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Tolerans Yığılması ve GD&T Laboratuvarı](/tr/tools/tolerance-lab)
- [Rulman Ömrü Hesaplayıcı](/tr/tools/bearing-life)
- [Standartlar Kütüphanesi](/tr/standards)
`
    },
    en: {
      title: "Operating clearance",
      description: "ISO 286 clearance fit pairings (H7/g6, H7/h6), hydrodynamic journal bearing diametral clearance, and thermal expansion offsets.",
      body: `Clearance is the positive dimensional difference between mating internal (hole) and external (shaft) features where the hole diameter is strictly larger than the shaft diameter under all tolerance extremes, permitting relative rotation or translation.

## Why it matters

In journal bearings and sliding guides, an accurate operating clearance is required to establish a continuous hydrodynamic lubricant film and prevent thermal seizure. Excessive clearance causes shaft whirling, oil film instability, and noisy chatter.

## Engineering application & standards

Governed by the ISO 286-1 system of limits and fits:
- **H7/h6:** Snug sliding fit; easily assembled by hand, used for precision index pins and demountable spigots.
- **H7/g6:** Precision running fit; typical for machine tool spindles and precision gearing journals where rotational play must remain minimal.
- **H8/f7:** Normal industrial running fit; accommodates thermal expansion and standard hydrodynamic grease/oil regimes.
- **Clearance Formulation:**
  $$C_{min} = D_{hole,min} - d_{shaft,max}, \quad C_{max} = D_{hole,max} - d_{shaft,min}$$

<Callout type="info" title="Engineering Rule">
In hydrodynamic journal bearings, optimal diametral clearance typically equals approximately 0.1% to 0.15% of shaft journal diameter: $\psi = \frac{\Delta d}{d} \approx 0.001 \dots 0.0015$.
</Callout>

## Related calculators and resources

- [Tolerance Stack-Up & GD&T Lab](/en/tools/tolerance-lab)
- [Bearing Life Calculator](/en/tools/bearing-life)
- [Standards Index](/en/standards)
`
    }
  },
  "cnc": {
    tags: ["CNC", "talaşlı imalat", "frezeleme", "torna", "kesme parametreleri"],
    category: "İmalat",
    tr: {
      title: "CNC (Bilgisayarlı Sayısal Kontrol)",
      description: "CNC talaşlı imalat tezgahları (3/5 eksen frezeleme, torna), G-kodları, kesme hızı ($v_c$), diş başına ilerleme ($f_z$) ve takım ömrü.",
      body: `CNC (Computer Numerical Control), takım tezgahlarının mikroişlemci tabanlı bilgisayar programları (G ve M kodları) ile otomatik olarak yönlendirildiği modern talaşlı imalat teknolojisidir. 3, 4 ve 5 eksenli frezeler ve çok taretli tornalar endüstrinin omurgasını oluşturur.

## Neden önemli?

Mikron seviyesinde boyutsal tekrarlanabilirlik ($IT6 - IT7$), karmaşık serbest formlu 3D yüzeylerin işlenmesi ve seri üretimde insan kaynaklı imalat hatalarının ortadan kaldırılmasını sağlar.

## Mühendislik uygulaması ve standartlar

- **Kesme Hızı ($v_c$ [$\text{m/dak}$]):** Takım çapı ($D_c$) ve fener mili devri ($n$) ilişkisi:
  $$v_c = \frac{\pi \cdot D_c \cdot n}{1000} \implies n = \frac{1000 \cdot v_c}{\pi \cdot D_c}$$
- **Tabla İlerleme Hızı ($v_f$ [$\text{mm/dak}$]):** Kesici diş sayısı ($z$) ve diş başına ilerleme ($f_z$):
  $$v_f = n \cdot z \cdot f_z$$
- **Talaş Hacmi Kaldırma Oranı (MRR):**
  $$MRR = \frac{a_p \cdot a_e \cdot v_f}{1000} \quad [\text{cm}^3\text{/dak}]$$
  *(burada $a_p$ eksenel kesme derinliği, $a_e$ radyal kesme genişliğidir).*

<Callout type="info" title="İmalat Örneği">
$D_c = 10\text{ mm}$ 4 ağızlı karbür freze ile çelik işlerken ($v_c = 120\text{ m/dak}$, $f_z = 0.05\text{ mm/diş}$):
$$n = \frac{1000 \times 120}{\pi \times 10} \approx \mathbf{3820\text{ rpm}}, \quad v_f = 3820 \times 4 \times 0.05 \approx \mathbf{764\text{ mm/dak}}$$
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Tolerans Yığılması ve GD&T Laboratuvarı](/tr/tools/tolerance-lab)
- [Birim Dönüştürücü](/tr/tools/unit-converter)
- [Malzeme Kütüphanesi](/tr/materials)
`
    },
    en: {
      title: "CNC (Computer Numerical Control)",
      description: "CNC machining principles (3/5-axis milling, turning), G-code programming, cutting speed ($v_c$), feed per tooth ($f_z$), and MRR formulas.",
      body: `Computer Numerical Control (CNC) is the automated control of machining machine tools (mills, lathes, routers, grinders) by means of computer-executable programs (G-code commands) executing precise multi-axis coordinate trajectories.

## Why it matters

CNC manufacturing delivers repeatable micron-level dimensional precision ($IT6 - IT7$ tolerance grades), produces complex sculpted aerodynamic and mold surfaces, and enables automated high-volume production without operator intervention.

## Engineering application & standards

- **Cutting Surface Speed ($v_c$ [$\text{m/min}$]):** Relationship between tool cutter diameter ($D_c$) and spindle speed ($n$):
  $$v_c = \frac{\pi \cdot D_c \cdot n}{1000} \implies n = \frac{1000 \cdot v_c}{\pi \cdot D_c}$$
- **Table Feed Rate ($v_f$ [$\text{mm/min}$]):** For a cutter with tooth count $z$ and feed per tooth $f_z$:
  $$v_f = n \cdot z \cdot f_z$$
- **Material Removal Rate (MRR):**
  $$MRR = \frac{a_p \cdot a_e \cdot v_f}{1000} \quad [\text{cm}^3\text{/min}]$$
  *(where $a_p$ is axial depth of cut and $a_e$ is radial cut stepover).*

<Callout type="info" title="Machining Calculation">
Milling structural steel using a $D_c = 10\text{ mm}$ 4-flute solid carbide endmill ($v_c = 120\text{ m/min}$, $f_z = 0.05\text{ mm/tooth}$):
$$n = \frac{1000 \times 120}{\pi \times 10} \approx \mathbf{3820\text{ rpm}}, \quad v_f = 3820 \times 4 \times 0.05 \approx \mathbf{764\text{ mm/min}}$$
</Callout>

## Related calculators and resources

- [Tolerance Stack-Up & GD&T Lab](/en/tools/tolerance-lab)
- [Unit Converter](/en/tools/unit-converter)
- [Materials Library and Mechanical Properties](/en/materials)
`
    }
  },
  "coefficient-of-friction": {
    tags: ["sürtünme katsayısı", "triboloji", "Coulomb sürtünmesi", "fren", "cıvata torku"],
    category: "Mekanik",
    tr: {
      title: "Sürtünme katsayısı",
      description: "Statik ve dinamik sürtünme katsayısı ($\mu$), Coulomb sürtünme yasası, cıvata tork-önyük ilişkisi ve tribolojik yüzey etkileri.",
      body: `Sürtünme katsayısı ($\mu$), birbirine temas eden iki katı cisim arasındaki teğetsel sürtünme direnç kuvvetinin ($F_s$), yüzeyleri birbirine bastıran dik normal kuvvete ($F_n$) oranını temsil eden boyutsuz bir katsayıdır.

## Neden önemli?

Cıvatalı bağlantılarda torkun %90'ı sürtünmeyi yenmeye harcanır. Frenlerde, kavramalarda ve pres geçmelerde sürtünme katsayısının doğru bilinmesi emniyetli güç aktarımının temelini oluşturur.

## Mühendislik uygulaması ve standartlar

Coulomb sürtünme modeline göre:
$$F_s = \mu \cdot F_n$$
- **Statik Sürtünme Katsayısı ($\mu_s$):** Hareketi başlatmak için gereken eşik değerdir.
- **Kinetik / Dinamik Sürtünme Katsayısı ($\mu_k$):** Hareket devam ederken etkiyen değerdir ($\mu_k < \mu_s$).
- **Cıvata Bağlantılarında K Katsayısı:** Tork formülü $T = K \cdot F_p \cdot d$ olup buradaki $K$ faktörü diş sürtünmesi ($\mu_{dis}$) ve başaltı sürtünmesine ($\mu_{bas}$) doğrudan bağlıdır. Yağsız çelikte $\mu \approx 0.14$, yağlı çelikte $\mu \approx 0.10$, PTFE kaplıda $\mu \approx 0.07$'dir.

<Callout type="info" title="Mühendislik Uyarısı">
Yağsız montaj için hesaplanan tork ile yağlı bir cıvatayı sıkarsanız sürtünme düşeceği için aynı torkta cıvataya %40 daha fazla ön gerilme biner ve cıvata kopabilir.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Cıvata Mukavemeti ve Tork Hesabı](/tr/tools/bolt-calculator)
- [Birim Dönüştürücü](/tr/tools/unit-converter)
- [Basit Gerilme Hesaplayıcı](/tr/tools/simple-stress)
`
    },
    en: {
      title: "Coefficient of friction",
      description: "Static and dynamic friction coefficient ($\mu$), Coulomb friction law, bolt torque-preload relationship, and tribological contact mechanics.",
      body: `The coefficient of friction ($\mu$) is a dimensionless scalar ratio defining the tangential frictional force ($F_f$) resisting relative motion between two contacting solid bodies relative to the perpendicular normal clamping force ($F_n$).

## Why it matters

In bolted joints, over 80% to 90% of applied torque is consumed overcoming friction. In disc brakes, clutches, and interference fits, accurate empirical knowledge of friction coefficients governs load capacity and safety margins.

## Engineering application & standards

Governed by the classical Amontons-Coulomb friction model:
$$F_f = \mu \cdot F_n$$
- **Static Coefficient ($\mu_s$):** Frictional resistance threshold required to initiate sliding from rest.
- **Kinetic / Dynamic Coefficient ($\mu_k$):** Sustained sliding resistance ($\mu_k < \mu_s$).
- **Fastener Tightening ($K$-factor):** In bolt torquing $T = K \cdot F_{preload} \cdot d$, the nut factor $K$ is dictated by thread friction ($\mu_{th}$) and underhead collar friction ($\mu_b$). Dry steel yields $\mu \approx 0.14$; lubricated steel drops to $\mu \approx 0.10$; MoS2 pastes achieve $\mu \approx 0.08$.

<Callout type="info" title="Engineering Caution">
Applying a dry-specified tightening torque to a heavily lubricated fastener dramatically over-stretches the bolt shank by up to 50%, risking instant tensile yield rupture.
</Callout>

## Related calculators and resources

- [Bolt Strength and Preload Calculator](/en/tools/bolt-calculator)
- [Unit Converter](/en/tools/unit-converter)
- [Simple Stress Calculator](/en/tools/simple-stress)
`
    }
  },
  "concentricity": {
    tags: ["eşmerkezlilik", "GD&T", "ASME Y14.5", "salgı", "koaksiyellik"],
    category: "Tolerans",
    tr: {
      title: "Eşmerkezlilik (concentricity)",
      description: "ASME Y14.5 ve ISO 1101 standartlarında eşmerkezlilik, silindirik parçaların medyan eksen kontrolü ve salgı (runout) ile farkı.",
      body: `Eşmerkezlilik (Concentricity), dönel bir yüzeyin tüm karşıt elemanlarının medyan noktalarının (eksenel merkez noktalarının), datum olarak seçilen referans eksenle ne derece çakıştığını denetleyen 3 boyutlu bir GD&T konum toleransıdır.

## Neden önemli?

Yüksek devirli millerde ve hassas dişli gövdelerinde eşmerkezlilikten sapma, dinamik dengesizliğe, santrifüj kuvvetlere, rulmanlarda aşırı titreşime ve dişli temas çizgisinin bozulmasına yol açar.

## Mühendislik uygulaması ve standartlar

- **ASME Y14.5 Standardı:** Eşmerkezlilik sembolü iç içe iki dairedir ($\circledcirc$). Tolerans bölgesi datum ekseni etrafında silindirik bir alandır.
- **Ölçüm Zorluğu:** Eşmerkezlilik parçanın yüzeyini değil, karşıt noktaların matematiksel orta noktasını denetlediği için CMM veya özel ölçüm probları gerektirir; ölçüm maliyeti yüksektir.
- **Tasarım Tavsiyesi:** Parçanın dengesini veya temasını sağlamak için çoğu zaman eşmerkezlilik yerine ölçümü komparatörle son derece kolay olan **Dairesel Salgı (Circular Runout)** veya **Toplam Salgı (Total Runout)** tercih edilir.

<Callout type="info" title="Tasarım İpucu">
Yalnızca yüksek devirli hassas rotorlarda ($n > 10\,000\text{ rpm}$) kütle merkezi kaçıklığını denetlemek amacıyla eşmerkezlilik kullanılmalı; genel mekanik geçmelerde eşeksenlilik (koaksiyellik) veya dairesel salgı tercih edilmelidir.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Tolerans Yığılması ve GD&T Laboratuvarı](/tr/tools/tolerance-lab)
- [Döner Ekipmanda Dengeleme ve Titreşim Rehberi](/tr/guides/doner-ekipman-dengeleme-titresim-kontrolu)
- [Rulman Ömrü Hesaplayıcı](/tr/tools/bearing-life)
`
    },
    en: {
      title: "Concentricity",
      description: "Concentricity tolerance in ASME Y14.5 and ISO 1101, median axis symmetry verification, and distinction from runout controls.",
      body: `Concentricity is a complex 3D Geometric Dimensioning and Tolerancing (GD&T) location control that establishes a cylindrical tolerance zone centered on a datum axis within which the derived median points of all diametrically opposed surface points must lie.

## Why it matters

In high-speed rotating equipment, concentricity deviation generates centrifugal rotor unbalance, destructive bearing vibration, and tooth contact misalignment in planetary gear trains.

## Engineering application & standards

- **ASME Y14.5 Definition:** Symbolized by two concentric circles ($\circledcirc$). It controls median-point axis symmetry rather than direct surface form.
- **Inspection Complexity:** Measuring concentricity requires point-cloud scanning on a Coordinate Measuring Machine (CMM) to calculate cross-sectional median centroids, making it expensive to verify on factory floors.
- **Design Alternative:** Because concentricity is costly to verify, ASME design standards strongly recommend replacing it with **Circular Runout** or **Total Runout**, which control concentricity, circularity, and coaxiality simultaneously using a standard dial indicator.

<Callout type="info" title="Design Rule">
Reserve concentricity strictly for extreme high-speed rotating components ($n > 10\,000\text{ rpm}$) sensitive to mass centroid eccentricity. For static assemblies, use Position or Total Runout.
</Callout>

## Related calculators and resources

- [Tolerance Stack-Up & GD&T Lab](/en/tools/tolerance-lab)
- [Rotating Equipment Balancing Guide](/en/guides/doner-ekipman-dengeleme-titresim-kontrolu)
- [Bearing Life Calculator](/en/tools/bearing-life)
`
    }
  },
  "corrosion-resistance": {
    tags: ["korozyon", "paslanmaz çelik", "PREN", "galvanik korozyon", "kaplama"],
    category: "Malzeme",
    tr: {
      title: "Korozyon direnci",
      description: "Metalik malzemelerin korozyon direnci, paslanmaz çeliklerde PREN katsayısı, galvanik korozyon önleme ve tuz sisi dayanımı.",
      body: `Korozyon direnci, bir metalin veya alaşımın çevresindeki ortamla (nem, asit, tuz, oksijen) elektrokimyasal reaksiyona girerek oksitlenmeye, çözünmeye ve mekanik özelliklerini kaybetmeye karşı gösterdiği direnç kabiliyetidir.

## Neden önemli?

Dünya genelinde üretilen çeliğin yaklaşık %3'ü korozyon sebebiyle kullanılamaz hale gelir. Korozyon, cıvatalarda gerilmeli korozyon çatlağına (SCC), boru hatlarında delinmelere ve köprü bağlantılarında feci yapısal çökmelere yol açar.

## Mühendislik uygulaması ve standartlar

- **Pasivasyon Tabakası:** Paslanmaz çeliklerde en az %10.5 Krom (Cr) bulunması, yüzeyde kendiliğinden onarılan mikroskobik bir $Cr_2O_3$ oksit tabakası oluşturur.
- **PREN Katsayısı (Pitting Resistance Equivalent Number):** Çukurcuk korozyonu direncini ölçmek için kullanılır:
  $$PREN = \%Cr + 3.3 \cdot \%Mo + 16 \cdot \%N$$
  *(Standart AISI 304 için $PREN \approx 18 - 20$, deniz suyuna dayanıklı AISI 316 için $PREN \approx 23 - 25$, Super Duplex 2507 için $PREN > 40$ olmalıdır).*
- **Galvanik Korozyon Önleme:** Elektrokimyasal seride birbirinden uzak iki farklı metal (örneğin alüminyum ile paslanmaz çelik) temas ettiğinde araya yalıtkan rondela konmalıdır.

<Callout type="info" title="Mühendislik İpucu">
Deniz kenarında veya klorlu ortamlarda AISI 304 çeliği çukurcuk korozyonuna uğrar; minimum %2 Molibden içeren AISI 316 veya Duplex paslanmaz çelikler seçilmelidir.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Malzeme Kütüphanesi ve Kimyasal Dayanım](/tr/materials)
- [Yüzey İşleme ve Kaplama Rehberi](/tr/guides/yuzey-isleme-yontemleri-rehberi)
- [Standartlar Kütüphanesi](/tr/standards)
`
    },
    en: {
      title: "Corrosion resistance",
      description: "Metallic corrosion resistance, Pitting Resistance Equivalent Number (PREN) in stainless steels, galvanic isolation, and salt spray performance.",
      body: `Corrosion resistance is the capacity of an engineering metal or alloy to withstand electrochemical oxidation and chemical degradation induced by interaction with environmental electrolytes (moisture, atmospheric salts, acids).

## Why it matters

Uncontrolled corrosion destroys structural steelwork, causes stress corrosion cracking (SCC) in pressurized components, triggers wall thinning in piping, and compromises fastener structural integrity.

## Engineering application & standards

- **Self-Healing Passive Film:** Stainless steels require a minimum of 10.5% Chromium to form an adherent, self-repairing nanometer-scale chromium oxide ($Cr_2O_3$) passive barrier.
- **Pitting Resistance Equivalent Number (PREN):** Quantifies alloy resistance to localized chloride pitting corrosion according to ASTM G48:
  $$PREN = \%Cr + 3.3 \cdot \%Mo + 16 \cdot \%N$$
  *(Standard AISI 304: $PREN \approx 18 - 20$; marine-grade AISI 316: $PREN \approx 23 - 25$; Super Duplex 2507: $PREN > 40$).*
- **Galvanic Corrosion Isolation:** When dissimilar metals (e.g., carbon steel and copper) are in electrical contact in an electrolyte, the anodic metal dissolves rapidly; non-conductive dielectric isolation kits must be installed.

<Callout type="info" title="Engineering Rule">
In coastal or chloride-rich atmospheres, AISI 304 suffers aggressive tea-staining and pitting; a molybdenum-bearing grade such as AISI 316 ($2\% - 3\%\text{ Mo}$) or Duplex 2205 is mandatory.
</Callout>

## Related calculators and resources

- [Materials Library and Chemical Data](/en/materials)
- [Surface Finishing and Coating Guide](/en/guides/yuzey-isleme-yontemleri-rehberi)
- [Standards Index](/en/standards)
`
    }
  },
  "datum": {
    tags: ["datum", "referans", "GD&T", "ASME Y14.5", "koordinat"],
    category: "Tolerans",
    tr: {
      title: "Referans yüzeyi (datum)",
      description: "ASME Y14.5 ve ISO 5459 standartlarına göre datum referans çerçevesi (DRF), 3-2-1 kuralı ve ölçüm referansları.",
      body: `Datum, bir parçanın geometrik toleranslarını, konumunu ve oryantasyonunu tanımlamak ve ölçmek için teorik olarak tam kabul edilen referans düzlem, eksen, nokta veya çizgidir. İmalat ve kontrolde koordinat sisteminin başlangıcını oluşturur.

## Neden önemli?

Datumlar olmadan teknik resimdeki toleransların nereden başlayıp nerede bittiği bilinemez. Datumların rastgele seçilmesi, talaşlı imalatta parça bağlama fikstürü ile CMM kalite ölçüm cihazı arasında referans uyuşmazlığına yol açar.

## Mühendislik uygulaması ve standartlar

ASME Y14.5 ve ISO 5459 standartlarına göre **Datum Referans Çerçevesi (DRF - 3-2-1 Kuralı)** ile parçanın 6 serbestlik derecesi kilitlenir:
- **Birincil Datum (Primary Datum - A):** En az 3 temas noktasıyla 3 serbestlik derecesini (1 öteleme, 2 dönme) kilitler. Montajın oturduğu ana düzlemdir.
- **İkincil Datum (Secondary Datum - B):** Birincil datuma dik, en az 2 temas noktasıyla 2 serbestlik derecesini kilitler.
- **Üçüncül Datum (Tertiary Datum - C):** Her iki datuma dik, en az 1 temas noktasıyla son serbestlik derecesini kilitler.

<Callout type="info" title="Montaj Kuralı">
Teknik resimdeki datum harflerinin sırası ($[A|B|C]$) montaj sırasını temsil eder. Birincil datum daima parçanın montajda fiziksel olarak ilk temas ettiği en geniş ve rijit yüzey olmalıdır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Tolerans Yığılması ve GD&T Laboratuvarı](/tr/tools/tolerance-lab)
- [Tolerans Zinciri ve GD&T Rehberi](/tr/guides/tolerans-zinciri-ve-gdt-rehberi)
- [Fikstür ve Merkezleme Araçları](/fixture-tools)
`
    },
    en: {
      title: "Datum reference",
      description: "Datum reference frames (DRF) according to ASME Y14.5 and ISO 5459, 3-2-1 locating principle, and coordinate measurement setup.",
      body: `A datum is a theoretically exact reference plane, axis, point, or coordinate system from which the location, orientation, and geometric tolerance boundaries of component features are established and inspected.

## Why it matters

Without datums, drawing callouts lack an origin of measurement. Arbitrary datum selection creates costly discrepancies between CNC machining fixture workholding clamps and CMM inspection coordinates, resulting in false part rejections.

## Engineering application & standards

Governed by ASME Y14.5 and ISO 5459 via the **Datum Reference Frame (DRF / 3-2-1 Rule)** to constrain all six spatial degrees of freedom:
- **Primary Datum (A):** Minimum 3 contact points constraining 3 degrees of freedom (1 translation, 2 rotations). Represents the primary functional seating interface.
- **Secondary Datum (B):** Perpendicular to primary, using minimum 2 contact points to constrain 2 degrees of freedom.
- **Tertiary Datum (C):** Perpendicular to both, using 1 contact point to lock the final remaining translational or rotational degree of freedom.

<Callout type="info" title="Design Rule">
The sequence of datum letters in a feature control frame ($[A|B|C]$) dictates the physical precedence of engagement. The primary datum must be the largest and most rigid mounting face.
</Callout>

## Related calculators and resources

- [Tolerance Stack-Up & GD&T Lab](/en/tools/tolerance-lab)
- [Tolerance Stack-up and GD&T Guide](/en/guides/tolerans-zinciri-ve-gdt-rehberi)
- [Fixture & Locating Tools](/fixture-tools)
`
    }
  },
  "density": {
    tags: ["yoğunluk", "özgül kütle", "malzeme ağırlığı", "eylemsizlik", "kütle"],
    category: "Malzeme",
    tr: {
      title: "Özgül kütle (yoğunluk)",
      description: "Mühendislik malzemelerinin yoğunluğu ($\rho$), parça kütlesi hesabı, atalet momenti ve hafif tasarım malzeme seçimi.",
      body: `Özgül kütle veya yoğunluk ($\rho$), homojen bir malzemenin birim hacmindeki kütle miktarıdır ($\rho = m / V$). SI birim sisteminde kilogram bölü metreküp [$\text{kg/m}^3$] veya gram bölü santimetreküp [$\text{g/cm}^3$] olarak ifade edilir.

## Neden önemli?

Dönen ve hareket eden makine elemanlarında eylemsizlik kuvvetleri ($F = m \cdot a$) ve kütle atalet momenti ($I = m \cdot r^2$) doğrudan malzeme yoğunluğuyla orantılıdır. Hafif malzemeler motor güç tüketimini düşürür ve hızlanma dinamiklerini iyileştirir.

## Mühendislik uygulaması ve standartlar

Mekanik tasarımda sık kullanılan metallerin tipik yoğunlukları:
- **Karbon ve Alaşımlı Çelikler:** $7850\text{ kg/m}^3$ ($7.85\text{ g/cm}^3$)
- **Dökme Demir (Pik / Sfero):** $7100 - 7300\text{ kg/m}^3$
- **Titanyum (Ti-6Al-4V):** $4430\text{ kg/m}^3$ (Çeliğe göre %43 daha hafif)
- **Alüminyum Alaşımları (6082, 7075):** $2700 - 2800\text{ kg/m}^3$ (Çeliğe göre yaklaşık 3 kat hafif)
- **Magnezyum Alaşımları:** $1780\text{ kg/m}^3$
- **Plastikler (POM / PA6 / PEEK):** $1140 - 1420\text{ kg/m}^3$

<Callout type="info" title="Hesaplama Örneği">
$D = 60\text{ mm}$ çapında ve $L = 500\text{ mm}$ uzunluğunda dolu bir milin kütlesi:
$$V = \frac{\pi \cdot 0.06^2}{4} \times 0.50 \approx 0.001414\text{ m}^3$$
- Çelik ise: $m = 0.001414 \times 7850 = \mathbf{11.1\text{ kg}}$
- Alüminyum ise: $m = 0.001414 \times 2700 = \mathbf{3.8\text{ kg}}$
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Malzeme Kütüphanesi ve Dayanım Değerleri](/tr/materials)
- [Birim Dönüştürücü](/tr/tools/unit-converter)
- [Güç - Tork - Devir Hesaplayıcı](/tr/tools/torque-power)
`
    },
    en: {
      title: "Mass density",
      description: "Material density ($\rho$), component mass calculation, rotational mass moment of inertia, and lightweight structural optimization.",
      body: `Density ($\rho$) is the mass per unit volume of a homogeneous substance ($\rho = m / V$). In the SI metric system, it is quantified in kilograms per cubic meter [$\text{kg/m}^3$] or grams per cubic centimeter [$\text{g/cm}^3$].

## Why it matters

In dynamic, rotating, and reciprocating machinery, inertial loads ($F = m \cdot a$) and mass moments of inertia ($I = \int r^2 dm$) scale directly with component density. Reducing material density improves acceleration dynamics and cuts drive motor sizing.

## Engineering application & standards

Typical density benchmarks for structural engineering materials:
- **Carbon and Low-Alloy Steels:** $7850\text{ kg/m}^3$ ($7.85\text{ g/cm}^3$)
- **Cast Irons (Gray / Ductile):** $7100 - 7300\text{ kg/m}^3$
- **Titanium Grade 5 (Ti-6Al-4V):** $4430\text{ kg/m}^3$ (43% lighter than structural steel)
- **Aluminum Alloys (6061, 7075):** $2700 - 2800\text{ kg/m}^3$ (~65% lighter than steel)
- **Magnesium Alloys (AZ91):** $1780\text{ kg/m}^3$
- **Engineering Plastics (POM, PA6, PEEK):** $1140 - 1420\text{ kg/m}^3$

<Callout type="info" title="Engineering Calculation">
For a solid round shaft of $D = 60\text{ mm}$ and length $L = 500\text{ mm}$:
$$V = \frac{\pi \cdot 0.06^2}{4} \times 0.50 \approx 0.001414\text{ m}^3$$
- In alloy steel: $m = 0.001414 \times 7850 = \mathbf{11.1\text{ kg}}$
- In structural aluminum: $m = 0.001414 \times 2700 = \mathbf{3.8\text{ kg}}$
</Callout>

## Related calculators and resources

- [Materials Library and Mechanical Properties](/en/materials)
- [Unit Converter](/en/tools/unit-converter)
- [Power - Torque - Speed Calculator](/en/tools/torque-power)
`
    }
  },
  "din": {
    tags: ["DIN", "Alman standartları", "bağlantı elemanları", "toleranslar", "DIN 6885"],
    category: "Standartlar",
    tr: {
      title: "DIN (Alman Standart Enstitüsü)",
      description: "DIN standartlarının makine mühendisliğindeki rolü, DIN 6885 paralel kamalar, DIN 931/933 cıvatalar ve ISO dönüşümü.",
      body: `DIN (Deutsches Institut für Normung), Almanya'nın resmi standardizasyon kuruluşudur. Makine mühendisliği, talaşlı imalat, toleranslar ve bağlantı elemanları konularında dünya genelinde en çok benimsenen teknik standartların öncüsüdür.

## Neden önemli?

Avrupa ve küresel makine imalatında kullanılan teknik resimlerin, cıvata ve somunların, segmanların ve mil kamalarının ezici çoğunluğu DIN kökenlidir. Birçok DIN standardı zamanla ISO ve EN normlarına dönüştürülmüştür.

## Mühendislik uygulaması ve standartlar

- **DIN 6885:** Tahrik ve mil-göbek paralel kamaları (feder) standardı (Form A yuvarlak uçlu, Form B düz uçlu).
- **DIN 931 / DIN 933:** Altıköşe başlı cıvatalar (DIN 931 yarım dişli şaftlı, DIN 933 tam boy dişli). ISO 4014 ve ISO 4017 normlarına karşılık gelir.
- **DIN 471 / DIN 472:** Miller ve delikler için emniyet segmanları (retaining rings).
- **DIN 7190:** Silindirik pres geçmelerin (sıkı geçme) hesaplama kuralları.

<Callout type="info" title="Standart Dönüşüm Notu">
DIN 931 cıvatalar ISO 4014'e dönüştürülürken M10, M12 ve M14 cıvataların anahtar ağız (AF) ölçülerinde 1 mm'lik değişiklikler yapılmıştır (örn: M10 cıvatada DIN anahtarı 17 mm iken ISO anahtarı 16 mm'dir).
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Cıvata Mukavemeti ve Tork Hesabı](/tr/tools/bolt-calculator)
- [Kama Tasarımı Rehberi](/tr/guides/kama-tasarimi-101)
- [Standartlar Kütüphanesi](/tr/standards)
`
    },
    en: {
      title: "DIN (German Institute for Standardization)",
      description: "Role of DIN standards in precision mechanical engineering, DIN 6885 parallel keys, DIN 931/933 fasteners, and ISO harmonization.",
      body: `DIN (Deutsches Institut für Normung) is the German national standards body whose mechanical engineering, precision tolerancing, and fastener standards have shaped modern industrial manufacturing worldwide.

## Why it matters

DIN standards define the global geometry and metallurgy of standard mechanical parts including metric bolts, parallel keys, retaining rings, and interference press-fits. Many fundamental DIN codes serve as the direct foundation for international ISO/EN standards.

## Engineering application & standards

- **DIN 6885-1:** Parallel drive keys and keyways for shaft-hub torque transmission (Form A rounded, Form B square).
- **DIN 931 / DIN 933:** Hexagon head bolts (DIN 931 partial thread with plain shank, DIN 933 fully threaded), superseded internationally by ISO 4014 and ISO 4017.
- **DIN 471 / DIN 472:** Circlips and retaining rings for shafts and internal bores.
- **DIN 7190:** Calculation and design principles for cylindrical interference press-fits.

<Callout type="info" title="Standardization Note">
Harmonizing DIN 931/933 to ISO 4014/4017 altered the across-flats wrench width (WAF) for M10, M12, and M14 fasteners (e.g., M10 hex heads changed from 17 mm under DIN to 16 mm under ISO).
</Callout>

## Related calculators and resources

- [Bolt Strength and Preload Calculator](/en/tools/bolt-calculator)
- [Key Design 101 Guide](/en/guides/kama-tasarimi-101)
- [Standards Index](/en/standards)
`
    }
  },
  "ductility": {
    tags: ["süneklik", "uzama", "çekme testi", "kopma uzaması", "gevrek kırılma"],
    category: "Malzeme",
    tr: {
      title: "Süneklik (ductility)",
      description: "Malzemelerin süneklik özelliği, çekme deneyinde kopma uzaması ($A\%$), kesit daralması ($Z\%$) ve gevrek kırılma önleme.",
      body: `Süneklik (Ductility), bir malzemenin çekme gerilmesi altında kırılmadan önce kalıcı (plastik) deformasyon gösterebilme kabiliyetidir. Malzemenin tel haline getirilebilme ve bükülebilme kapasitesini ifade eder.

## Neden önemli?

Sünek malzemeler aşırı yüklendiğinde kırılmadan önce gözle görülür biçimde sarkar, akar ve şekil değiştirerek tehlikeyi haber verir. Gevrek (düşük sünek) malzemeler ise hiçbir uyarı vermeksizin aniden parçalanır (felaket kırılması).

## Mühendislik uygulaması ve standartlar

ASTM E8 ve ISO 6892 çekme testlerinde süneklik iki parametre ile ölçülür:
- **Kopma Uzaması ($A_5$ veya $A\%$):** Numunenin kopma anındaki uzama yüzdesi:
  $$A\% = \frac{L_u - L_0}{L_0} \times 100$$
- **Kesit Daralması ($Z\%$):** Boyun verme bölgesindeki alan daralma yüzdesi:
  $$Z\% = \frac{S_0 - S_u}{S_0} \times 100$$
- Yapı çeliklerinde (S235, S355) $A\% \ge 20 - %25$ süneklik bulunurken, gri dökme demirde (GG-25) bu oran $< %1$ seviyesindedir (gevrektir).

<Callout type="info" title="Tasarım Güvenliği">
Darbe, patlama veya deprem riski olan yapılarda gerilme yığılmalarını plastik akmayla sönümleyebilmek için kopma uzaması minimum %15'in üzerinde olan sünek çelikler şart koşulur.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Malzeme Kütüphanesi ve Dayanım Değerleri](/tr/materials)
- [Basit Gerilme Hesaplayıcı](/tr/tools/simple-stress)
- [Standartlar Kütüphanesi](/tr/standards)
`
    },
    en: {
      title: "Material ductility",
      description: "Ductility in engineering alloys, tensile elongation at fracture ($A\%$), reduction of area ($Z\%$), and brittle fracture prevention.",
      body: `Ductility is the mechanical property of an engineering material that allows it to undergo significant gross plastic deformation under tensile stress before physical rupture occurs. It reflects drawability, formability, and structural forgivingness.

## Why it matters

Ductile alloys provide visible structural yielding and necking before fracture, absorbing energy and alerting operators to severe overloads. In contrast, brittle materials with low ductility fracture instantaneously without prior macroscopic deformation.

## Engineering application & standards

Measured during ASTM E8 and ISO 6892 tensile testing via two primary metrics:
- **Percentage Elongation at Fracture ($A\%$):**
  $$A\% = \frac{L_u - L_0}{L_0} \times 100$$
- **Percentage Reduction of Area ($Z\%$):**
  $$Z\% = \frac{S_0 - S_u}{S_0} \times 100$$
- Structural steels (EN 10025 S355) exhibit $A\% \ge 20\% - 24\%$, whereas gray cast iron exhibits $A\% < 0.8\%$ (brittle).

<Callout type="info" title="Safety Guideline">
Components subjected to shock, vibration, or seismic loads must utilize ductile materials with minimum 15% tensile elongation to redistribute peak notch stresses through local yielding.
</Callout>

## Related calculators and resources

- [Materials Library and Mechanical Properties](/en/materials)
- [Simple Stress Calculator](/en/tools/simple-stress)
- [Standards Index](/en/standards)
`
    }
  },
  "factor-of-safety": {
    tags: ["güvenlik faktörü", "emniyet katsayısı", "tasarım marjı", "akma", "mukavemet"],
    category: "Mekanik",
    tr: {
      title: "Güvenlik faktörü (factor of safety)",
      description: "Mühendislik hesaplarında güvenlik faktörü ($S_f$), izin verilen emniyetli gerilme, tasarım belirsizlikleri ve ASME/Eurocode standartları.",
      body: `Güvenlik faktörü ($S_f$ veya $n$), bir mekanik parçanın nihai taşıma kapasitesinin (akma veya çekme mukavemeti), maruz kalacağı izin verilen maksimum çalışma gerilmesine oranıdır ($S_f = \text{Kapasite} / \text{Yük}$).

## Neden önemli?

Malzeme homojenliğindeki kusurları, imalat toleransı sapmalarını, hesaplama varsayımlarını ve tahmin edilemeyen dinamik tepe yüklerini karşılamak için emniyet marjı bırakmak zorunludur.

## Mühendislik uygulaması ve standartlar

- **Statik Sünek Malzemelerde (Akma Kriteri):**
  $$S_f = \frac{R_{p0.2}}{\sigma_{max}} \ge 1.3\dots 2.0$$
- **Statik Gevrek Malzemelerde (Çekme Kriteri):** Gevrek malzemelerde akma olmadığı için çekme mukavemeti kullanılır ve katsayı yüksek tutulur:
  $$S_f = \frac{R_m}{\sigma_{max}} \ge 3.0\dots 5.0$$
- **Havacılık vs İnşaat:** Havacılıkta ağırlık kritik olduğundan faktör $1.2 - 1.5$ aralığında tutulur ve sıkı testlerle doğrulanır; basınçlı kaplarda ve asansörlerde ise $3.0 - 5.0$ seçilir.

<Callout type="info" title="Hesaplama Örneği">
$R_e = 360\text{ MPa}$ akma sınırına sahip bir C45 mil üzerinde von Mises eşdeğer gerilmesi $\sigma_{vm} = 180\text{ MPa}$ hesaplanmışsa:
$$S_f = \frac{360}{180} = \mathbf{2.00}$$
Tasarım 2 kat statik emniyete sahiptir.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Basit Gerilme ve Güvenlik Faktörü](/tr/tools/simple-stress)
- [Cıvata Mukavemeti ve Tork Hesabı](/tr/tools/bolt-calculator)
- [Şaft Boyutlandırma ve Burulma](/tr/tools/shaft-torsion)
`
    },
    en: {
      title: "Factor of safety (FoS)",
      description: "Factor of safety ($S_f$) determination in structural engineering, allowable working stress, design uncertainty mitigation, and ASME guidelines.",
      body: `The Factor of Safety ($S_f$ or $n$) is a structural design multiplier expressing the ratio of a component's maximum structural carrying capacity (yield or ultimate strength) to its maximum anticipated operational design load or stress ($S_f = \text{Capacity} / \text{Demand}$).

## Why it matters

FoS accommodates unavoidable engineering uncertainties: metallurgical material variations, tolerance stack-ups, environmental degradation, calculation model assumptions, and unanticipated dynamic shock spikes.

## Engineering application & standards

- **Ductile Static Components (Yield Criterion):**
  $$S_f = \frac{S_y}{\sigma_{max}} \ge 1.3\dots 2.0$$
- **Brittle Static Components (Ultimate Tensile Criterion):** Lacking plastic redistribution, brittle designs require larger margins:
  $$S_f = \frac{S_{ut}}{\sigma_{max}} \ge 3.0\dots 5.0$$
- **Aerospace vs Heavy Industry:** Weight-critical aerospace structures specify $S_f \approx 1.25 - 1.50$ backed by exhaustive physical proof testing; elevators, cranes, and pressure vessels require $S_f \ge 3.0 - 5.0$.

<Callout type="info" title="Engineering Example">
A C45 drive shaft with yield strength $S_y = 360\text{ MPa}$ operates at peak von Mises stress $\sigma_{vm} = 180\text{ MPa}$:
$$S_f = \frac{360}{180} = \mathbf{2.00}$$
The design operates with a 2.0 static safety margin.
</Callout>

## Related calculators and resources

- [Simple Stress and Factor of Safety](/en/tools/simple-stress)
- [Bolt Strength and Preload Calculator](/en/tools/bolt-calculator)
- [Shaft Sizing and Torsion](/en/tools/shaft-torsion)
`
    }
  },
  "fatigue": {
    tags: ["yorulma", "Wöhler", "ömür", "Goodman", "S-N eğrisi", "çevrimsel yük"],
    category: "Mekanik",
    tr: {
      title: "Yorulma (fatigue)",
      description: "Dinamik yük altındaki makine elemanlarında metal yorulması, Wöhler S-N eğrisi, Marin faktörleri ve Goodman kırılma kriteri.",
      body: `Yorulma (Fatigue), tekrarlı veya çevrimsel mekanik gerilmelere maruz kalan bir bileşenin, malzemenin statik akma dayanımının ($R_e$) çok altındaki gerilme seviyelerinde dahi mikro çatlak başlatarak zamanla kırılması olayıdır.

## Neden önemli?

Mekanik makine arızalarının %80'inden fazlası dinamik yorulmadan kaynaklanır. Yorulma kırılması plastik akma veya boyutsal uzama uyarısı vermeden aniden ve gevrek biçimde gerçekleşir.

## Mühendislik uygulaması ve standartlar

DIN 50100 ve FKM Kılavuzu standartlarına göre yorulma analizi:
- **Wöhler (S-N) Eğrisi:** Gerilme genliği ($\sigma_a$) ile kırılma çevrim sayısı ($N$) arasındaki ilişkiyi gösterir. Çeliklerde $N \ge 10^6 - 10^7$ çevrimde yorulma dayanım sınırı ($S_e$) sabit bir platoya ulaşır (sonsuz ömür).
- **Goodman Yorulma Kriteri:** Ortalama gerilme ($\sigma_m$) ve genlik ($\sigma_a$) etkisi:
  $$\frac{\sigma_a}{S_e} + \frac{\sigma_m}{R_m} = \frac{1}{n_f}$$
- **Çentik Hassasiyeti:** Kademeli şaftlar, kama kanalları ve cıvata diş kökleri gerilme yığılması yaratarak yorulma ömrünü dramatik şekilde düşürür.

<Callout type="info" title="Tasarım Kuralı">
Yorulma dayanımını artırmak için kesit geçişlerinde çentik yarıçapı büyütülmeli, taşlama kalitesi artırılmalı ve basma gerilmesi oluşturan bilyeli dövme (shot peening) uygulanmalıdır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Makine Öğesi Ömrü ve Yorulma Rehberi](/tr/guides/makine-ogesi-omru-yorulma-rehberi)
- [Şaft Boyutlandırma ve Burulma](/tr/tools/shaft-torsion)
- [Cıvata Mukavemeti ve Tork Hesabı](/tr/tools/bolt-calculator)
`
    },
    en: {
      title: "Metal fatigue",
      description: "Metal fatigue under cyclic dynamic loads, S-N Wöhler curves, endurance limit modifications, and Goodman failure criteria.",
      body: `Fatigue is the progressive, localized structural damage process occurring in materials subjected to cyclic fluctuating stresses and strains, culminating in sudden brittle fracture at stresses well below monotonic static yield limits.

## Why it matters

Over 80% of all in-service mechanical engineering component failures stem from fatigue. Fatigue cracks initiate silently at microstructural discontinuities or stress concentrations with zero macroscopic plastic deformation before final rupture.

## Engineering application & standards

Governed by DIN 50100 and FKM fatigue guidelines:
- **Wöhler (S-N) Curves:** Maps alternating stress amplitude ($\sigma_a$) against cycles to failure ($N$). Ferrous alloys display a distinct horizontal endurance limit ($S_e$) below which infinite life ($N > 10^7$ cycles) is attained.
- **Modified Goodman Failure Criterion:** Accounts for tensile mean stress ($\sigma_m$):
  $$\frac{\sigma_a}{S_e} + \frac{\sigma_m}{S_{ut}} = \frac{1}{n_f}$$
- **Stress Concentrations:** Shaft transitions, keyseats, and thread roots amplify local stresses, severely reducing component fatigue thresholds.

<Callout type="info" title="Design Rule">
To improve fatigue resistance, specify generous fillet transition radii, polish high-stress surfaces, and introduce compressive surface stresses via shot peening or nitriding.
</Callout>

## Related calculators and resources

- [Fatigue and Service Life Guide](/en/guides/makine-ogesi-omru-yorulma-rehberi)
- [Shaft Sizing and Torsion](/en/tools/shaft-torsion)
- [Bolt Strength and Preload Calculator](/en/tools/bolt-calculator)
`
    }
  },
  "forging": {
    tags: ["dövme", "sıcak dövme", "tane akışı", "tokluk", "imalat"],
    category: "İmalat",
    tr: {
      title: "Metal dövme (forging)",
      description: "Sıcak ve soğuk dövme imalat yöntemleri, yönlü tane yapısı (grain flow), üstün darbe tokluğu ve yüksek mukavemetli şaft üretimi.",
      body: `Dövme (Forging), ısıtılmış veya soğuk metal hamurunun kalıplar ve presler altında plastik olarak deforme edilerek şekillendirildiği basınçlı imalat yöntemidir. Krank milleri, biyel kolları, cıvatalar ve dişli taslaklarının imalatında kullanılır.

## Neden önemli?

Döküm veya talaşlı imalat parçalarından farklı olarak, dövme işlemi metalin iç kristal tanelerini parçanın dış konturuna paralel akmaya (grain flow) zorlar. Bu kesintisiz tane akışı parçaya üstün darbe tokluğu ve yorulma direnci kazandırır.

## Mühendislik uygulaması ve standartlar

- **Kapalı Kalıpta Dövme (Closed Die Forging):** Karmaşık geometrili otomotiv parçalarında yüksek boyutsal doğruluk ve minimum çapak ile seri imalat sağlar.
- **İç Kusurların Kapanması:** Dövme esnasındaki yüksek hidrostatik basınç, metaldeki mikroskobik gözenekleri ve döküm boşluklarını ezerek kapatır.
- **Mukavemet Sınıfları:** 10.9 ve 12.9 kalite yüksek mukavemetli cıvataların başları ve dişleri mukavemeti artırmak için soğuk dövme ve ovalama (cold forging & thread rolling) ile şekillendirilir.

<Callout type="info" title="İmalat Karşılaştırması">
Dolu çubuktan frezelenerek işlenen bir dişlide talaş kaldırma sırasında tane lifleri kesilir; oysa dövülmüş dişli taslağında lifler diş kökünü sararak eğilme yorulması mukavemetini %30 artırır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Malzeme Kütüphanesi ve Dayanım Değerleri](/tr/materials)
- [Cıvata Mukavemeti ve Tork Hesabı](/tr/tools/bolt-calculator)
- [Standartlar Kütüphanesi](/tr/standards)
`
    },
    en: {
      title: "Metal forging",
      description: "Hot and cold forging processes, continuous grain flow orientation, superior impact fracture toughness, and heavy-duty shaft fabrication.",
      body: `Forging is a thermal-mechanical manufacturing process wherein raw metal billets are plastically deformed under compressive hammer strikes or hydraulic press dies into near-net structural components (crankshafts, connecting rods, high-strength bolts).

## Why it matters

Unlike casting (which yields random dendritic crystals) or machining (which severs material grain fibers), forging aligns the internal metallic grain structure continuously along the component contour (grain flow), imparting exceptional impact toughness and fatigue durability.

## Engineering application & standards

- **Closed-Die Impression Forging:** High-volume automotive hardware produced with minimal flash and tight metallurgical tolerances.
- **Porosity Elimination:** The immense hydrostatic compressive stresses collapse internal micro-voids and heal metallurgical shrinkage porosity.
- **High-Tensile Fasteners:** Grade 10.9 and 12.9 bolt heads and threads are cold-forged and rolled to preserve unbroken grain flow through high-stress root fillets.

<Callout type="info" title="Structural Comparison">
Machining a gear from bar stock cuts across continuous grain fibers, weakening tooth flanks; forging preserves unbroken grain flow around tooth roots, boosting flexural fatigue limits by over 30%.
</Callout>

## Related calculators and resources

- [Materials Library and Mechanical Properties](/en/materials)
- [Bolt Strength and Preload Calculator](/en/tools/bolt-calculator)
- [Standards Index](/en/standards)
`
    }
  },
  "gdt": {
    tags: ["GD&T", "geometrik toleranslar", "ASME Y14.5", "ISO 1101", "datum"],
    category: "Tolerans",
    tr: {
      title: "GD&T (Geometrik Boyutlandırma ve Toleranslandırma)",
      description: "ASME Y14.5 ve ISO 1101 standartlarında Geometrik Boyutlandırma ve Toleranslandırma (GD&T) sembolleri, konum toleransı ve kontrol çerçevesi.",
      body: `GD&T (Geometric Dimensioning and Tolerancing), teknik resimlerde parçanın yalnızca artı-eksi boyutsal ölçülerini değil; biçim (form), yönelim (orientation), profil ve konum (location) geometrisini sembolik bir dille tanımlayan küresel mühendislik standardıdır.

## Neden önemli?

Klasik artı-eksi ($\pm$) toleransları delik merkezlerinde kare tolerans bölgesi oluşturur ve montaj fonksiyonunu tam yansıtmaz. GD&T dairesel tolerans bölgeleri ve malzeme durumu modifiyerleri (MMC) kullanarak imalata %57 daha geniş tolerans alanı sağlar ve montaj uyumunu garanti eder.

## Mühendislik uygulaması ve standartlar

ASME Y14.5-2018 ve ISO 1101 (GPS) standartlarında GD&T 5 temel kategoriye ayrılır:
- **Biçim Toleransları:** Düzlemsellik ($\\unicode{x25B1}$), Doğrusallık ($-$), Dairesellik ($\bigcirc$), Silindiriklik ($\\unicode{x232D}$). (Datum gerektirmez).
- **Yönelim Toleransları:** Diklik ($\bot$), Paralellik ($//$), Açısallık ($\angle$).
- **Konum Toleransları:** Konum / Pozisyon ($\bigoplus$).
- **Salgı Toleransları:** Dairesel Salgı ($\nearrow$), Toplam Salgı ($\\unicode{x2330}$).
- **Profil Toleransları:** Yüzey Profili ($\\unicode{x2312}$).

<Callout type="info" title="Örnek Gösterim">
Bir delik ekseninde $[\bigoplus | \varnothing 0.2\text{ \textcircled{M}} | A | B | C]$ kontrol çerçevesi; deliğin A, B ve C datumlarına göre $0.2\text{ mm}$ silindirik bölge içinde kalması gerektiğini ve Maksimum Malzeme Koşulunda (MMC) bonus tolerans kazanacağını belirtir.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Tolerans Yığılması ve GD&T Laboratuvarı](/tr/tools/tolerance-lab)
- [Tolerans Zinciri ve GD&T Rehberi](/tr/guides/tolerans-zinciri-ve-gdt-rehberi)
- [Fikstür Araçları](/fixture-tools)
`
    },
    en: {
      title: "GD&T (Geometric Dimensioning & Tolerancing)",
      description: "GD&T symbol library, feature control frames, True Position, and ASME Y14.5 / ISO 1101 engineering standards.",
      body: `Geometric Dimensioning and Tolerancing (GD&T) is an international engineering drawing language that explicitly communicates the allowable variation of geometry across form, orientation, profile, and location using standard feature control frames.

## Why it matters

Conventional plus-minus ($\pm$) coordinate tolerancing creates restrictive square tolerance zones that do not reflect mating pin/hole physics. GD&T utilizes cylindrical tolerance zones and Material Condition Modifiers (MMC) to unlock 57% greater allowable manufacturing tolerance while guaranteeing 100% assembly fit.

## Engineering application & standards

Governed by ASME Y14.5-2018 and ISO 1101 across 5 primary categories:
- **Form Controls:** Flatness ($\\unicode{x25B1}$), Straightness ($-$), Circularity ($\bigcirc$), Cylindricity ($\\unicode{x232D}$). (No datums required).
- **Orientation Controls:** Perpendicularity ($\bot$), Parallelism ($//$), Angularity ($\angle$).
- **Location Controls:** True Position ($\bigoplus$).
- **Runout Controls:** Circular Runout ($\nearrow$), Total Runout ($\\unicode{x2330}$).
- **Profile Controls:** Profile of a Surface ($\\unicode{x2312}$).

<Callout type="info" title="Feature Control Frame Example">
A hole callout of $[\bigoplus | \varnothing 0.2\text{ \textcircled{M}} | A | B | C]$ establishes a $0.2\text{ mm}$ cylindrical tolerance zone referenced to Datum Reference Frame $ABC$, granting bonus tolerance as the hole departs from Maximum Material Condition (MMC).
</Callout>

## Related calculators and resources

- [Tolerance Stack-Up & GD&T Lab](/en/tools/tolerance-lab)
- [Tolerance Stack-up and GD&T Guide](/en/guides/tolerans-zinciri-ve-gdt-rehberi)
- [Fixture & Locating Tools](/fixture-tools)
`
    }
  },
  "grinding": {
    tags: ["taşlama", "hassas işleme", "yüzey pürüzlülüğü", "Ra", "rulman yuvası"],
    category: "İmalat",
    tr: {
      title: "Hassas taşlama (grinding)",
      description: "Taşlama talaşlı imalat prosesi (silindirik, düzlem ve puntasız taşlama), yüzey pürüzlülüğü ($Ra \le 0.4\ \mu\text{m}$) ve mikron toleranslar.",
      body: `Taşlama (Grinding), aşındırıcı mineral taneciklerden (alüminyum oksit, silisyum karbür, CBN veya elmas) oluşan döner bir taşlama diski vasıtasıyla sertleştirilmiş metallerden mikron mertebesinde talaş kaldıran hassas yüzey işleme yöntemidir.

## Neden önemli?

Isıl işlemle sertleştirilmiş ($> 50\text{ HRC}$) çelikleri tornalama veya frezeleme ile işlemek takım aşınması ve esneme sebebiyle zordur. Taşlama, sertleşmiş parçalara $IT4 - IT6$ tolerans sınıfı ve ayna gibi yüzey kalitesi ($Ra \le 0.2 - 0.4\ \mu\text{m}$) kazandırır.

## Mühendislik uygulaması ve standartlar

- **Silindirik Taşlama (Cylindrical Grinding):** Rulman basma faturaları, hidrolik silindir milleri ve şaft kademelerinde yüksek eşmerkezlilik ve salgısız silindiriklik elde etmek için kullanılır.
- **Puntasız Taşlama (Centerless Grinding):** Yüksek adetli pim, burç ve iğneli rulman millerinin merkezleme deliği açılmadan hızlı ve hassas işlenmesini sağlar.
- **Yüzey Yanığı (Grinding Burn) Kontrolü:** Aşırı talaş veya yetersiz soğutma sıvısı durumunda parça yüzeyinde $900\text{ °C}$'ye çıkan sıcaklık yeniden su verme (rehardening) veya menevişleşme yaparak yorulma çatlaklarına yol açar.

<Callout type="info" title="İmalat Tavsiyesi">
Rulman iç bileziğinin oturduğu millerde yüzey pürüzlülüğü $Ra \le 0.4\ \mu\text{m}$ olmalıdır; aksi halde montajda mikroskobik tepeler ezilerek geçme sıkılığını yok eder.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Tolerans Yığılması ve GD&T Laboratuvarı](/tr/tools/tolerance-lab)
- [Rulman Ömrü Hesaplayıcı](/tr/tools/bearing-life)
- [Yüzey İşleme Rehberi](/tr/guides/yuzey-isleme-yontemleri-rehberi)
`
    },
    en: {
      title: "Precision grinding",
      description: "Abrasive grinding operations (cylindrical, surface, centerless), achieving sub-micron tolerances ($IT5$) and mirror surface finish ($Ra \le 0.4\ \mu\text{m}$).",
      body: `Precision grinding is an abrasive machining process that utilizes bonded abrasive wheels (aluminum oxide, silicon carbide, CBN, or diamond) running at high surface speeds to remove minute chips from hardened metallic workpieces.

## Why it matters

Hardened alloy steels ($> 50\text{ HRC}$) cannot be economically turned or milled due to severe tool chatter and tool breakdown. Grinding delivers extreme dimensional accuracy ($IT4 - IT6$) and mirror surface finishes ($Ra \le 0.2 - 0.4\ \mu\text{m}$).

## Engineering application & standards

- **Cylindrical Grinding:** Used for precision bearing seat journals, hydraulic piston rods, and spindle shafts to guarantee true roundness and zero runout.
- **Centerless Grinding:** Enables rapid, high-volume finishing of cylindrical pins, needle rollers, and shafts without requiring center drilling.
- **Grinding Burn Prevention:** Excessive feed or inadequate flood coolant elevates localized temperatures above $900\text{ °C}$, triggering metallurgical rehardening burns and tensile residual surface stress cracking.

<Callout type="info" title="Manufacturing Guideline">
Shaft journals mating with precision bearing inner rings mandate surface finishes of $Ra \le 0.4\ \mu\text{m}$ ($R_z \le 1.6\ \mu\text{m}$) to eliminate asperity flattening under operational press-fits.
</Callout>

## Related calculators and resources

- [Tolerance Stack-Up & GD&T Lab](/en/tools/tolerance-lab)
- [Bearing Life Calculator](/en/tools/bearing-life)
- [Surface Finishing Guide](/en/guides/yuzey-isleme-yontemleri-rehberi)
`
    }
  },
  "hardness": {
    tags: ["sertlik", "Rockwell HRC", "Brinell HB", "Vickers HV", "aşınma"],
    category: "Malzeme",
    tr: {
      title: "Malzeme sertliği",
      description: "Mühendislik malzemelerinde sertlik ölçüm yöntemleri (Rockwell HRC, Brinell HB, Vickers HV), çekme mukavemeti ilişkisi ve aşınma direnci.",
      body: `Sertlik (Hardness), bir malzemenin daha sert bir batıcı cisim tarafından yüzeyine uygulanan kalıcı plastik batmaya, çizilmeye ve aşınmaya karşı gösterdiği mekanik dirençtir.

## Neden önemli?

Dişli çark yanaklarında, rulman yuvarlanma yollarında ve kesici takımlarda yüzey sertliği temas aşınmasını, ezilmeyi ve pullanmayı (spalling / pitting) önleyen birincil parametredir.

## Mühendislik uygulaması ve standartlar

ISO 6506, ISO 6508 ve ASTM E18 standartlarına göre sertlik test yöntemleri:
- **Rockwell C (HRC):** $120^\circ$ elmas koni uçla ölçülür; ıslah ve sementasyon çelikleri ($20 - 65\text{ HRC}$) için endüstriyel standarttır.
- **Brinell (HBW):** Sertleştirilmiş bilya uçla ölçülür; dökme demir ve dövme çelikler için heterojen yapıyı ortalama almakta idealdir.
- **Vickers (HV):** $136^\circ$ elmas piramit uçla ölçülür; mikroyapı ve ince kaplama tabakalarının sertliğinde kullanılır.
- **Sertlik ile Çekme Mukavemeti İlişkisi:** Karbon çelikleri için yaklaşık pratik formül:
  $$R_m \approx 3.2\dots 3.5 \cdot HB \quad [\text{MPa}]$$

<Callout type="info" title="Tasarım Değerleri">
Bir dişli çark gövdesinde $30\text{ HRC}$ ıslah sertliği tokluk sağlarken, diş yanaklarında indüksiyon veya sementasyon ile $58 - 62\text{ HRC}$ yüzey sertliği temin edilerek aşınma direnci maksimize edilir.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Malzeme Kütüphanesi ve Dayanım Değerleri](/tr/materials)
- [Basit Gerilme Hesaplayıcı](/tr/tools/simple-stress)
- [Standartlar Kütüphanesi](/tr/standards)
`
    },
    en: {
      title: "Material hardness",
      description: "Hardness test methods (Rockwell HRC, Brinell HB, Vickers HV), correlation with ultimate tensile strength, and wear resistance design.",
      body: `Hardness is the measure of a material's resistance to localized permanent plastic penetration, indentation, scratching, and abrasive wear when loaded by a rigid indenter.

## Why it matters

In gear flanks, rolling element bearing raceways, and cutting tools, high surface hardness is the primary defense against contact adhesive wear, galling, and subsurface shear spalling.

## Engineering application & standards

Governed by ASTM E18, ISO 6506, and ISO 6508:
- **Rockwell C (HRC):** Uses a $120^\circ$ diamond sphero-conical indenter under $150\text{ kgf}$ load; the primary standard for hardened and tempered alloy steels ($20 - 65\text{ HRC}$).
- **Brinell (HBW):** Employs tungsten carbide spherical indenters; preferred for cast irons and raw forgings to average across inhomogeneous grain structures.
- **Vickers (HV):** Employs a $136^\circ$ square-based diamond pyramid; standard for thin nitrided or case-hardened case depths.
- **Tensile Strength Correlation:** For structural carbon steels:
  $$S_{ut} \approx 3.45 \cdot HB \quad [\text{MPa}]$$

<Callout type="info" title="Industrial Guideline">
Heavy-duty transmission gears are designed with a tough $30\text{ HRC}$ core to resist shock loads, combined with a case-carburized $58 - 62\text{ HRC}$ surface flank to eliminate pitting wear.
</Callout>

## Related calculators and resources

- [Materials Library and Mechanical Properties](/en/materials)
- [Simple Stress Calculator](/en/tools/simple-stress)
- [Standards Index](/en/standards)
`
    }
  },
  "head-loss": {
    tags: ["yük kaybı", "basınç kaybı", "Darcy-Weisbach", "akışkanlar", "boru"],
    category: "Akışkanlar",
    tr: {
      title: "Yük kaybı (head loss)",
      description: "Boru hatlarında ve hidrolik devrelerde sürtünme yük kaybı ($h_f$), Darcy-Weisbach denklemi, armatür lokal kayıpları ve pompa gücü.",
      body: `Yük kaybı ($h_f$ veya $\Delta H$), bir akışkanın boru, kanal veya hidrolik devrede akışı esnasında akışkanın iç viskoz sürtünmesi ve çeper pürüzlülüğü sebebiyle kaybettiği mekanik enerji miktarının sıvı sütunu yüksekliği [$\text{mSS}$] cinsinden ifadesidir.

## Neden önemli?

Pompa seçiminde debi ile birlikte basma yüksekliğini ($H$) belirleyen ana bileşen yük kaybıdır. Yük kayıplarının yanlış hesaplanması pompanın sistemi basamamasına veya aşırı büyük motor seçilerek enerji israf edilmesine yol açar.

## Mühendislik uygulaması ve standartlar

Darcy-Weisbach denklemi düz borulardaki ana sürtünme yük kaybını ($h_f$) verir:
$$h_f = f \cdot \frac{L}{D} \cdot \frac{v^2}{2g} \quad [\text{m}]$$
- $f$: Darcy sürtünme faktörü (Laminer akışta $f = 64/Re$, türbülanslı akışta Colebrook veya Haaland formülü),
- $L$: Boru hattı toplam boyu [$\text{m}$],
- $D$: Boru iç çapı [$\text{m}$],
- $v$: Akış hızı [$\text{m/s}$], $g = 9.81\text{ m/s}^2$.
**Lokal / Minör Kayıplar ($h_{lokal}$):** Dirsekler, vanalar ve redüksiyonlar için kayıp katsayısı ($K$) kullanılarak toplanır:
$$h_{lokal} = \sum K \cdot \frac{v^2}{2g}$$

<Callout type="info" title="Hızın Karesi Etkisi">
Boru çapı yarıya indirilirse akış hızı 4 katına, sürtünme kaybı ise hızın karesi ve çapın etkisiyle ($v^2/D$) tam **32 katına** çıkar!
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Boru Basınç Kaybı Hesaplayıcı](/tr/tools/pipe-pressure-loss)
- [Pompa Türleri ve Seçim Rehberi](/tr/guides/pompa-turleri-secim-rehberi)
- [Akışkan Dinamiği Temelleri Rehberi](/tr/guides/akiskan-dinamigi-temelleri-boru-kanal-akisi)
`
    },
    en: {
      title: "Hydraulic head loss",
      description: "Frictional head loss ($h_f$) in piping networks, Darcy-Weisbach equation, minor fitting losses ($K$), and total dynamic head.",
      body: `Head loss ($h_f$ or $\Delta H$) is the measure of the reduction in total mechanical energy (stagnation head) per unit weight of fluid flowing through a piping system, dissipated as heat due to internal viscous shear and pipe wall friction, expressed in meters of fluid column [$\text{m}$].

## Why it matters

Head loss dictates total dynamic head ($H$) required by pumps and fans. Underestimating head loss causes pumps to run at reduced capacity or dead-head, while overestimation results in oversized equipment running far off BEP efficiency.

## Engineering application & standards

Governed by the universal Darcy-Weisbach equation for major friction loss:
$$h_f = f \cdot \frac{L}{D} \cdot \frac{v^2}{2g} \quad [\text{m}]$$
- $f$: Darcy friction factor ($f = 64/Re$ for laminar; Colebrook-Haaland explicit approximation for turbulent),
- $L$: Straight pipe length [$\text{m}$],
- $D$: Internal pipe bore [$\text{m}$],
- $v$: Mean fluid velocity [$\text{m/s}$], $g = 9.81\text{ m/s}^2$.
**Minor Component Losses ($h_{minor}$):** Valves, tees, and bends evaluated via loss coefficients ($K$):
$$h_{minor} = \sum K \cdot \frac{v^2}{2g}$$

<Callout type="info" title="Power of Velocity">
Because head loss scales with $v^2 / D$, halving the pipe diameter quadruples fluid velocity and increases friction loss by a factor of **32**!
</Callout>

## Related calculators and resources

- [Pipe Pressure Loss Calculator](/en/tools/pipe-pressure-loss)
- [Pump Selection Guide](/en/guides/pompa-turleri-secim-rehberi)
- [Fluid Dynamics Basics Guide](/en/guides/akiskan-dinamigi-temelleri-boru-kanal-akisi)
`
    }
  }
};
