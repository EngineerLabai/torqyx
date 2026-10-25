// Engineering Glossary Data - Part 2 (Slugs 26 - 51)

export const glossaryPart2 = {
  "hydraulic-diameter": {
    tags: ["hidrolik çap", "kanal akışı", "akışkanlar", "Reynolds", "basınç kaybı"],
    category: "Akışkanlar",
    tr: {
      title: "Hidrolik çap (hydraulic diameter)",
      description: "Dairesel olmayan boru ve havalandırma kanallarında hidrolik çap ($D_h$), ıslak çevre hesabı ve Reynolds sayısı eşdeğerliği.",
      body: `Hidrolik çap ($D_h$), dairesel olmayan enkesitlere (dikdörtgen kanallar, eliptik borular, eşmerkezli boru halkaları) sahip akış hatlarında akış dinamiği ve sürtünme kaybı hesaplarını eşdeğer dairesel boru formüllerine uyarlamak için kullanılan karakteristik boyuttur.

## Neden önemli?

Dikdörtgen bir havalandırma kanalında doğrudan genişlik veya yükseklik üzerinden hesap yapmak hidrolik sürtünmeyi %20'den fazla saptırır. Hidrolik çap doğru Reynolds sayısını ve sürtünme faktörünü bulmanın tek yoludur.

## Mühendislik uygulaması ve standartlar

Hidrolik çap akış kesit alanı ($A$) ve ıslak çevre ($P_{islak}$) üzerinden tanımlanır:
$$D_h = \frac{4 \cdot A}{P_{islak}}$$
- **Genişliği $a$, yüksekliği $b$ olan dikdörtgen kanal:**
  $$D_h = \frac{4 \cdot (a \cdot b)}{2(a + b)} = \frac{2 \cdot a \cdot b}{a + b}$$
- **İç çapı $D_i$, dış çapı $D_o$ olan konsantrik boru halkası (annulus):**
  $$D_h = D_o - D_i$$
- Reynolds sayısı ve Darcy sürtünme kaybı hesaplarında doğrudan $D_h$ kullanılır.

<Callout type="info" title="Hesaplama Örneği">
$a = 400\text{ mm}$, $b = 200\text{ mm}$ dikdörtgen hava kanalının hidrolik çapı:
$$D_h = \frac{2 \times 400 \times 200}{400 + 200} = \frac{160\,000}{600} \approx \mathbf{266.7\text{ mm}}$$
Akış hızı ve Reynolds hesabı bu eşdeğer çap üzerinden yapılır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Boru Basınç Kaybı Hesaplayıcı](/tr/tools/pipe-pressure-loss)
- [Akışkan Dinamiği Temelleri Rehberi](/tr/guides/akiskan-dinamigi-temelleri-boru-kanal-akisi)
- [Birim Dönüştürücü](/tr/tools/unit-converter)
`
    },
    en: {
      title: "Hydraulic diameter",
      description: "Hydraulic diameter ($D_h$) for non-circular conduits and ductwork, wetted perimeter formulation, and equivalent Reynolds calculation.",
      body: `Hydraulic diameter ($D_h$) is a standardized characteristic length used in non-circular tubes, rectangular ducting, and concentric annular channels to calculate dimensionless Reynolds numbers and hydraulic friction losses as if the conduit were a circular pipe.

## Why it matters

Using simple geometric averages (like width or height) in rectangular HVAC ductwork yields gross errors exceeding 20% in pressure drop and fan sizing. $D_h$ equates frictional boundary layer shear correctly.

## Engineering application & standards

Formulated as four times cross-sectional flow area ($A$) divided by the wetted perimeter ($P_{wetted}$):
$$D_h = \frac{4 \cdot A}{P_{wetted}}$$
- **Rectangular Duct (width $a$, height $b$):**
  $$D_h = \frac{4 \cdot (a \cdot b)}{2(a + b)} = \frac{2 \cdot a \cdot b}{a + b}$$
- **Concentric Annulus (outer bore $D_o$, inner tube $D_i$):**
  $$D_h = D_o - D_i$$
- Darcy friction factor $f$ and Reynolds number $Re$ are evaluated directly with $D_h$.

<Callout type="info" title="Calculation Example">
For a rectangular ventilation duct with $a = 400\text{ mm}$ and $b = 200\text{ mm}$:
$$D_h = \frac{2 \times 400 \times 200}{400 + 200} = \frac{160\,000}{600} \approx \mathbf{266.7\text{ mm}}$$
Hydraulic head loss is computed using this equivalent diameter.
</Callout>

## Related calculators and resources

- [Pipe Pressure Loss Calculator](/en/tools/pipe-pressure-loss)
- [Fluid Dynamics Basics Guide](/en/guides/akiskan-dinamigi-temelleri-boru-kanal-akisi)
- [Unit Converter](/en/tools/unit-converter)
`
    }
  },
  "interference": {
    tags: ["sıkı geçme", "girişim", "ISO 286", "press fit", "Lamé", "tork iletimi"],
    category: "Tolerans",
    tr: {
      title: "Sıkı geçme girişimi (interference)",
      description: "ISO 286 sıkı geçmelerde negatif boşluk (girişim), Lamé temas basıncı formülü, iletilebilir tork ve ısıl büzülme montajı.",
      body: `Girişim (Interference), montaj öncesinde dış elemanın (şaft / mil) dış çapının, iç elemanın (delik / göbek) iç çapından büyük olması durumunda aradaki negatif boyutsal farktır ($\Delta = d_{mil} - D_{delik} > 0$). Sıkı geçme bağlantısının temelidir.

## Neden önemli?

Kamasız, boşluksuz ve yüksek dinamik yorulma dayanımlı mil-göbek bağlantıları (H7/s6, H7/u6) bu elastik girişim sayesinde tork aktarır. Yetersiz girişim kaymaya, aşırı girişim ise göbeğin radyal çatlamasına yol açar.

## Mühendislik uygulaması ve standartlar

ISO 286 ve DIN 7190 standartlarına göre:
- **Minimum ve Maksimum Girişim:**
  $$\Delta_{min} = d_{mil,min} - D_{delik,max}, \quad \Delta_{max} = d_{mil,max} - D_{delik,min}$$
- **Lamé Temas Basıncı ($p$):** Katı çelik mil ve göbek için ($E = 210\,000\text{ MPa}$):
  $$p = \frac{\Delta_{eff}}{d} \cdot \frac{E}{2} \cdot \left(1 - \frac{d^2}{D_o^2}\right)$$
- **Tork Aktarım Kapasitesi:** $T = \frac{1}{2} \pi \cdot d^2 \cdot L \cdot p \cdot \mu$.

<Callout type="info" title="Tasarım Uyarısı">
Yüzey pürüzlülük tepeleri montaj esnasında ezildiği için efektif girişim $\Delta_{eff} = \Delta - 1.2(R_{z,mil} + R_{z,delik})$ formülüyle düzeltilmelidir.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Press Fit ve Tolerans Seçim Rehberi](/tr/guides/press-fit-baglantilari-tolerans-secimi)
- [Tolerans Yığılması ve GD&T Laboratuvarı](/tr/tools/tolerance-lab)
- [Şaft Boyutlandırma ve Burulma](/tr/tools/shaft-torsion)
`
    },
    en: {
      title: "Interference fit allowance",
      description: "Interference fit sizing according to ISO 286, Lamé interfacial contact pressure, torque capacity, and shrink-fit thermal sizing.",
      body: `Interference is the negative clearance between mating cylindrical components where the shaft outside diameter exceeds the bore inside diameter prior to assembly ($\Delta = d_{shaft} - D_{bore} > 0$). It generates elastic radial contact pressure.

## Why it matters

Interference fits provide keyless, backlash-free torque transmission with superior fatigue resistance (such as ISO H7/s6 or H7/u6 pairings). Insufficient interference triggers joint fretting slippage, while excessive interference bursts the outer hub.

## Engineering application & standards

Governed by ISO 286-1 and DIN 7190:
- **Interference Extremes:**
  $$\Delta_{min} = d_{shaft,min} - D_{bore,max}, \quad \Delta_{max} = d_{shaft,max} - D_{bore,min}$$
- **Interface Contact Pressure ($p$) via Lamé Equations:** For solid steel shaft and hub ($E = 210\,000\text{ MPa}$):
  $$p = \frac{\Delta_{eff}}{d} \cdot \frac{E}{2} \cdot \left(1 - \frac{d^2}{D_o^2}\right)$$
- **Transmissible Torque:** $T = \frac{1}{2} \pi \cdot d^2 \cdot L \cdot p \cdot \mu$.

<Callout type="info" title="Engineering Caution">
Surface roughness peaks flatten plastically during assembly pressing, requiring effective interference correction: $\Delta_{eff} = \Delta - 1.2(R_{z,shaft} + R_{z,bore})$.
</Callout>

## Related calculators and resources

- [Press-Fit Tolerance Selection Guide](/en/guides/press-fit-baglantilari-tolerans-secimi)
- [Tolerance Stack-Up & GD&T Lab](/en/tools/tolerance-lab)
- [Shaft Sizing and Torsion](/en/tools/shaft-torsion)
`
    }
  },
  "iso": {
    tags: ["ISO", "uluslararası standartlar", "kalite", "toleranslar", "ISO 286"],
    category: "Standartlar",
    tr: {
      title: "ISO (Uluslararası Standartlar Teşkilatı)",
      description: "ISO standartları, ISO 286 tolerans sistemi, ISO 281 rulman ömrü ve küresel makine imalatında uluslararası uyumluluk.",
      body: `ISO (International Organization for Standardization), dünya genelinde 160'tan fazla ülkenin ulusal standart kuruluşlarının katılımıyla kurulan, teknik şartnamelerin ve endüstriyel normların küresel düzeyde uyumlaştırılmasını sağlayan bağımsız kuruluştur.

## Neden önemli?

Küresel ticaret ve tedarik zincirinde farklı ülkelerde üretilen cıvataların, rulmanların ve işlenmiş millerin birbirine tam oturması ve aynı kalite kriterlerini karşılaması ISO standartları ile güvence altına alınır.

## Mühendislik uygulaması ve standartlar

- **ISO 286-1 / 286-2:** Delik ve mil tolerans sınıfları (H7, h6, js6 vb.) ve temel sapmalar sistemi.
- **ISO 281:** Döner rulmanların dinamik yük kapasitesi ve $L_{10}$ ömür hesabı formülü.
- **ISO 898-1:** Karbon çeliği ve alaşımlı cıvataların mekanik özellikleri (8.8, 10.9, 12.9 mukavemet sınıfları).
- **ISO 12241:** Endüstriyel borularda ve tesisatta ısı yalıtımı hesap kuralları.

<Callout type="info" title="Küresel Standartlaşma">
Bir cıvata üzerinde "ISO 4014 M12x50 8.8" ibaresi, geometrisinin ISO 4014'e, mekanik dayanımının ise ISO 898-1 Sınıf 8.8 şartnamesine tam uyduğunu garanti eder.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Rulman Ömrü Hesaplayıcı (ISO 281)](/tr/tools/bearing-life)
- [Cıvata Mukavemeti ve Tork Hesabı (ISO 898-1)](/tr/tools/bolt-calculator)
- [Standartlar Kütüphanesi](/tr/standards)
`
    },
    en: {
      title: "ISO (International Organization for Standardization)",
      description: "ISO standards framework, ISO 286 limits and fits, ISO 281 bearing life ratings, and global interchangeability.",
      body: `The International Organization for Standardization (ISO) is the foremost global federation of national standards bodies responsible for developing harmonized international technical and quality specifications across mechanical and industrial manufacturing.

## Why it matters

ISO standards eliminate cross-border trade friction, ensuring that a bearing manufactured in Japan fits a shaft machined in Germany and mounts into a gearbox casting poured in the United States.

## Engineering application & standards

- **ISO 286-1 / 286-2:** ISO System of Limits and Fits for precision cylindrical engineering (hole/shaft fundamentals).
- **ISO 281:** Rolling bearings dynamic load ratings and $L_{10}$ statistical rating life equations.
- **ISO 898-1:** Mechanical properties of fasteners made of carbon and alloy steel (property classes 8.8, 10.9, 12.9).
- **ISO 1101:** Geometrical product specifications (GPS) - Geometrical tolerancing.

<Callout type="info" title="Standardization Benchmark">
A fastener designated as "ISO 4014 M12x50 8.8" unequivocally specifies hex head geometry, thread pitch, and certified proof/yield metallurgy compliant with ISO 898-1 Class 8.8.
</Callout>

## Related calculators and resources

- [Bearing Life Calculator (ISO 281)](/en/tools/bearing-life)
- [Bolt Strength and Preload Calculator (ISO 898-1)](/en/tools/bolt-calculator)
- [Standards Index](/en/standards)
`
    }
  },
  "laminar-flow": {
    tags: ["laminer akış", "Reynolds", "akışkanlar", "viskozite", "Poiseuille"],
    category: "Akışkanlar",
    tr: {
      title: "Laminer akış",
      description: "Laminer akış rejimi ($Re < 2300$), düzenli katmanlı akış, Hagen-Poiseuille yasası ve düşük sürtünmeli boru hidroliği.",
      body: `Laminer akış, akışkan parçacıklarının birbirine karışmadan, düzgün paralel katmanlar (laminalar) halinde ve düzenli yörüngelerde hareket ettiği akış rejimidir. Viskoz kuvvetlerin atalet kuvvetlerine baskın olduğu düşük hızlarda görülür.

## Neden önemli?

Laminer akışta çeper sürtünmesi pürüzlülükten tamamen bağımsızdır ve akış direnci türbülanslı akışa göre çok daha düşüktür. Yağlama kanallarında, mikroakışkanlarda ve ağır yağ transfer hatlarında laminer rejim geçerlidir.

## Mühendislik uygulaması ve standartlar

- **Reynolds Sayısı Kriteri:** Dairesel borularda $Re < 2300$ olduğunda akış kesin olarak laminerdir.
- **Parabolik Hız Profili:** Boru çeperinde hız sıfır (kaymama koşulu), merkez eksende ise ortalama hızın iki katıdır ($v_{max} = 2 \cdot v_{ort}$).
- **Hagen-Poiseuille Yasası:** Laminer akışta basınç kaybı boru pürüzlülüğünden bağımsızdır ve viskoziteyle doğru orantılıdır:
  $$\Delta P = \frac{32 \cdot \mu \cdot L \cdot v}{D^2} = \frac{128 \cdot \mu \cdot L \cdot Q}{\pi \cdot D^4}$$
  *(Darcy sürtünme faktörü: $f = \frac{64}{Re}$)*.

<Callout type="info" title="Akışkan Karşılaştırması">
Laminer akışta boru iç yüzeyinin pürüzlü veya ayna gibi olması basınç kaybını zerre kadar değiştirmez; sürtünme tamamen akışkanın iç vizkozitesi tarafından belirlenir.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Boru Basınç Kaybı Hesaplayıcı](/tr/tools/pipe-pressure-loss)
- [Akışkan Dinamiği Temelleri Rehberi](/tr/guides/akiskan-dinamigi-temelleri-boru-kanal-akisi)
- [Birim Dönüştürücü](/tr/tools/unit-converter)
`
    },
    en: {
      title: "Laminar flow",
      description: "Laminar flow regime ($Re < 2300$), smooth streamline layers, Hagen-Poiseuille equation, and viscous pipe hydraulics.",
      body: `Laminar flow is a fluid flow regime characterized by smooth, parallel fluid layers (laminae) sliding past one another with no macroscopic cross-stream mixing or eddy dissipation, governed strictly by viscous shear.

## Why it matters

In laminar flow, hydraulic wall friction is completely independent of pipe wall roughness. It governs lubrication circuits, heavy hydraulic oils, capillary tubes, and microfluidics.

## Engineering application & standards

- **Reynolds Criterion:** In closed circular pipe flow, flow is laminar when $Re < 2300$.
- **Parabolic Velocity Profile:** Fluid velocity is zero at the pipe wall (no-slip condition) and peaks at exactly twice the average velocity at the centerline ($v_{max} = 2 \cdot v_{avg}$).
- **Hagen-Poiseuille Law:** Pressure drop is linearly proportional to fluid viscosity and flow rate, independent of pipe roughness:
  $$\Delta P = \frac{32 \cdot \mu \cdot L \cdot v}{D^2} = \frac{128 \cdot \mu \cdot L \cdot Q}{\pi \cdot D^4}$$
  *(Darcy friction factor: $f = \frac{64}{Re}$)*.

<Callout type="info" title="Fluid Dynamics Benchmark">
In pure laminar flow, whether the pipe wall is rusty cast iron or polished glass has zero effect on pressure drop; frictional dissipation is 100% internal fluid molecular shear.
</Callout>

## Related calculators and resources

- [Pipe Pressure Loss Calculator](/en/tools/pipe-pressure-loss)
- [Fluid Dynamics Basics Guide](/en/guides/akiskan-dinamigi-temelleri-boru-kanal-akisi)
- [Unit Converter](/en/tools/unit-converter)
`
    }
  },
  "machining": {
    tags: ["talaşlı imalat", "torna", "freze", "kesme hızı", "takım ömrü"],
    category: "İmalat",
    tr: {
      title: "Talaşlı imalat (machining)",
      description: "Geleneksel talaşlı imalat (torna, freze, matkap), kesme hızı ($v_c$), Taylor takım ömrü formülü ve işlenebilirlik katsayısı.",
      body: `Talaşlı imalat (Machining), ana iş parçasından kesici bir takım vasıtasıyla mekanik kesme kuvveti uygulanarak talaş şeklinde malzeme kaldırılması ve istenen boyutsal tolerans ile yüzey kalitesinin elde edildiği imalat yöntemidir.

## Neden önemli?

Döküm veya dövme parçaların montaj yüzeyleri, rulman yuvaları ve vida dişleri yalnızca talaşlı imalat ile mikron mertebesinde hassasiyetle işlenebilir. Talaşlı imalat parça maliyetinin en büyük kalemidir.

## Mühendislik uygulaması ve standartlar

- **Temel Operasyonlar:** Tornalama (silindirik dönel işleme), Frezeleme (döner takım ile prizmatik işleme), Delik Delme ve Raybalama.
- **Taylor Takım Ömrü Denklemi:** Kesme hızı ($v_c$) ile takımın aşınma ömrü ($T$ [dakika]) arasındaki ilişki:
  $$v_c \cdot T^n = C$$
  *(Kesme hızının %20 artırılması takım ömrünü %50'den fazla düşürebilir).*
- **Kesme Kuvveti ve Güç:** Kienzle formülüyle talaş kesme kuvveti ($F_c = k_{c1.1} \cdot b \cdot h^{1-m_c}$) ve tezgah motor gücü ($P_c = F_c \cdot v_c / 60\,000$) hesaplanır.

<Callout type="info" title="İmalat Kuralı">
İşleme maliyetini düşürmek için parçada yalnızca çalışan yatak ve montaj yüzeylerine dar tolerans ($IT6 - IT7$) verilmeli; serbest yüzeyler kaba işleme toleransında ($IT11 - IT13$) bırakılmalıdır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Tolerans Yığılması ve GD&T Laboratuvarı](/tr/tools/tolerance-lab)
- [Malzeme Kütüphanesi ve İşlenebilirlik](/tr/materials)
- [Birim Dönüştürücü](/tr/tools/unit-converter)
`
    },
    en: {
      title: "Conventional machining",
      description: "Subtractive machining processes (turning, milling, drilling), cutting speed ($v_c$), Taylor tool life equation, and cutting power sizing.",
      body: `Machining is a family of subtractive manufacturing operations wherein material is mechanically sheared away from a raw workpiece in the form of chips using sharp cutting tools to achieve specified tolerances and surface texture.

## Why it matters

Cast, forged, or additive near-net blanks require precision machining to establish bearing seats, mating flanged faces, and threaded holes down to micron tolerances. It represents a primary driver of finished manufacturing cost.

## Engineering application & standards

- **Core Processes:** Turning (rotating workpiece), Milling (rotating multi-point cutter), Boring, Reaming, and Tapping.
- **Taylor Tool Life Equation:** Relates cutting velocity ($v_c$) to tool wear life ($T$ [minutes]):
  $$v_c \cdot T^n = C$$
  *(A 20% increase in cutting speed can cut tool flank wear life in half).*
- **Cutting Force and Spindle Power:** Sized via specific cutting force ($k_c$) formulations:
  $$P_c = \frac{F_c \cdot v_c}{60\,000 \cdot \eta} \quad [\text{kW}]$$

<Callout type="info" title="Design for Machining">
To optimize cycle time and tooling expenditure, restrict precision tolerances ($IT6 - IT7$) strictly to functional journals and dowel holes; uncritical surfaces should specify coarse general tolerances ($ISO\ 2768-m$).
</Callout>

## Related calculators and resources

- [Tolerance Stack-Up & GD&T Lab](/en/tools/tolerance-lab)
- [Materials Library and Machinability](/en/materials)
- [Unit Converter](/en/tools/unit-converter)
`
    }
  },
  "parallelism": {
    tags: ["paralellik", "GD&T", "ASME Y14.5", "yönelim", "datum"],
    category: "Tolerans",
    tr: {
      title: "Paralellik (parallelism)",
      description: "ASME Y14.5 ve ISO 1101 standartlarında paralellik toleransı ($//$), yüzey ve eksen paralelliği, komparatörle kontrol yöntemleri.",
      body: `Paralellik (Parallelism), teknik resimlerde bir yüzeyin, eksenin veya orta düzlemin, datum olarak belirlenen referans bir düzleme veya eksene olan yönelim sapmasını denetleyen bir GD&T oryantasyon toleransıdır. Sembolü iki eğik paralel çizgidir ($//$).

## Neden önemli?

Lineer kızaklarda, hidrolik silindir bağlama plakalarında ve pres tablalarında paralellikten sapma olması, mekanizmanın sıkışmasına (binding), lineer araba bilyalarının ezilmesine ve kılavuzların tek taraflı aşınmasına yol açar.

## Mühendislik uygulaması ve standartlar

ASME Y14.5 ve ISO 1101 standartlarında:
- **Yüzey Paralelliği:** Tolerans bölgesi, datum düzlemine teorik olarak paralel olan ve aralarındaki mesafe tolerans değeri ($t$) kadar olan iki paralel düzlemle sınırlandırılmıştır.
- **Eksen Paralelliği:** Datum eksenine paralel olan silindirik bir tolerans bölgesidir.
- **Ölçüm Yöntemi:** Datum yüzeyi pleyt üzerine oturtulur ve kontrol edilecek yüzey komparatör saatiyle taranarak toplam ibre sapması (FIR) ölçülür.

<Callout type="info" title="Tasarım Notu">
Paralellik toleransı daima parçanın kalınlık veya boy ölçü toleransından daha dar olmalıdır ($t_{paralellik} \le T_{boyut}$); aksi halde boyutsal sınır zaten paralelliği kontrol eder.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Tolerans Yığılması ve GD&T Laboratuvarı](/tr/tools/tolerance-lab)
- [Tolerans Zinciri ve GD&T Rehberi](/tr/guides/tolerans-zinciri-ve-gdt-rehberi)
- [Fikstür Araçları](/fixture-tools)
`
    },
    en: {
      title: "Parallelism tolerance",
      description: "Parallelism orientation tolerance ($//$) under ASME Y14.5 and ISO 1101, planar and axis parallelism zones, and surface plate dial inspection.",
      body: `Parallelism is an orientation geometric control (symbolized by two inclined parallel lines $//$) that defines the allowable angular deviation of a planar surface, center plane, or feature axis relative to a designated datum plane or datum axis.

## Why it matters

In machine tool linear ways, hydraulic manifold mounting plates, and press platens, non-parallel surfaces induce binding, unequal bearing raceway loads, and accelerated edge wear.

## Engineering application & standards

Governed by ASME Y14.5 and ISO 1101:
- **Surface Parallelism:** The tolerance zone is bounded by two parallel planes oriented exactly parallel to the datum plane, spaced by the tolerance value ($t$).
- **Axis Parallelism:** The tolerance zone is a cylinder or two parallel planes parallel to the datum axis.
- **Inspection Setup:** The datum face is placed on a granite surface plate; an indicator scans the controlled surface to measure full indicator movement (FIM).

<Callout type="info" title="Design Rule">
A parallelism orientation tolerance must always be strictly tighter than the bounding size tolerance ($t_{parallelism} < T_{size}$); otherwise the size tolerance envelope already satisfies the constraint.
</Callout>

## Related calculators and resources

- [Tolerance Stack-Up & GD&T Lab](/en/tools/tolerance-lab)
- [Tolerance Stack-up and GD&T Guide](/en/guides/tolerans-zinciri-ve-gdt-rehberi)
- [Fixture & Locating Tools](/fixture-tools)
`
    }
  },
  "power-factor": {
    tags: ["güç faktörü", "elektrik", "cos phi", "reaktif güç", "motor"],
    category: "Elektrik",
    tr: {
      title: "Güç faktörü (cos phi)",
      description: "Elektrik motorlarında ve endüstriyel tesislerde güç faktörü ($\cos\phi$), aktif, reaktif ve görünür güç dengesi ve kompanzasyon.",
      body: `Güç faktörü ($\cos\phi$ veya PF), alternatif akım (AC) elektrik sistemlerinde şebekeden çekilen gerçek işi yapan aktif gücün ($P$ [$\text{kW}$]), devredeki görünür güce ($S$ [$\text{kVA}$]) olan boyutsuz oranıdır ($PF = P / S$).

## Neden önemli?

Asenkron motorlar ve kaynak makineleri manyetik alan oluşturmak için şebekeden endüktif reaktif güç ($Q$ [$\text{kVAr}$]) çeker. Düşük güç faktörü kablolarda aşırı ısınmaya, gerilim düşümüne ve elektrik faturalarında yüksek reaktif ceza ödenmesine yol açar.

## Mühendislik uygulaması ve standartlar

Güç üçgeni ilişkisi:
$$S = \sqrt{P^2 + Q^2}, \quad \cos\phi = \frac{P}{S}$$
- **Asenkron Motorlar:** Tam yükte tipik $\cos\phi \approx 0.82 - 0.88$ seviyesindedir. Ancak motor düşük yükte (%25 yük) çalıştırıldığında $\cos\phi$ değeri $0.50$'nin altına düşer.
- **Kompanzasyon:** Güç faktörünü $0.95 - 0.98$ seviyesine yükseltmek için sisteme paralel kondansatör grupları bağlanarak endüktif reaktif güç dengelenir.

<Callout type="info" title="Endüstriyel Kural">
Bir motoru gereğinden çok büyük seçmek motorun sürekli yüksüz çalışmasına ve tesisin güç faktörünü aşağı çekerek reaktif enerji cezası üretmesine neden olur.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Güç - Tork - Devir Hesaplayıcı](/tr/tools/torque-power)
- [Birim Dönüştürücü](/tr/tools/unit-converter)
- [Elektriksel Hesaplama Araçları](/tr/tools/basic-engineering)
`
    },
    en: {
      title: "Electrical power factor",
      description: "Power factor ($\cos\phi$) in AC industrial systems, active ($kW$) vs reactive ($kVAR$) power, and capacitor power factor correction.",
      body: `Power factor ($\cos\phi$ or PF) is the dimensionless ratio of real operational active power ($P$ measured in $\text{kW}$) performing actual mechanical work to total apparent power ($S$ measured in $\text{kVA}$) circulating in an alternating current (AC) electrical circuit ($PF = P / S$).

## Why it matters

Induction motors, solenoid valves, and transformers draw inductive magnetizing current (reactive power $Q$). A low power factor causes resistive $I^2 R$ transmission line losses, excessive voltage sags, and substantial utility reactive billing penalties.

## Engineering application & standards

Derived from the fundamental AC power triangle:
$$S = \sqrt{P^2 + Q^2}, \quad \cos\phi = \frac{P}{S}$$
- **Electric Induction Motors:** Operate at nominal full-load power factors of $\cos\phi \approx 0.82 - 0.88$. However, under light loading (25% load), the power factor degrades below $0.50$.
- **Power Factor Correction (PFC):** Shunt capacitor banks are installed in motor control centers to deliver leading reactive power, driving the net facility power factor above $0.95$.

<Callout type="info" title="Engineering Rule">
Oversizing an electric motor causes it to operate continuously in its low-efficiency, low-power-factor regime, needlessly inflating factory reactive power consumption.
</Callout>

## Related calculators and resources

- [Power - Torque - Speed Calculator](/en/tools/torque-power)
- [Unit Converter](/en/tools/unit-converter)
- [Basic Engineering Calculators](/en/tools/basic-engineering)
`
    }
  },
  "resistance": {
    tags: ["direnç", "elektrik", "Ohm yasası", "iletkenlik", "gerilim düşümü"],
    category: "Elektrik",
    tr: {
      title: "Elektriksel direnç (resistance)",
      description: "Ohm yasası ($V=IR$), iletken direnci formülü ($R = \rho L / A$), sıcaklık katsayısı ve kablo gerilim düşümü hesabı.",
      body: `Elektriksel direnç ($R$), bir elektrik devresinde veya iletkende serbest elektronların akışına (elektrik akımına) karşı gösterilen zorluk derecesidir. SI birim sisteminde birimi Ohm [$\Omega$]'dur.

## Neden önemli?

Kablo kesiti yetersiz seçildiğinde direnç sebebiyle kabloda gerilim düşümü ($\Delta V = I \cdot R$) ve Joule ısınması ($P = I^2 \cdot R$) oluşur. Bu durum motor klemensinde düşük voltaja, yangın tehlikesine ve enerji kaybına yol açar.

## Mühendislik uygulaması ve standartlar

- **İletken Direnci Formülü:** Malzemenin özdirenci ($\rho_e$), boyu ($L$) ve kesit alanı ($A$):
  $$R = \rho_e \cdot \frac{L}{A}$$
  *(Örn: Standart bakır için $\rho_e \approx 0.0175\ \Omega\cdot\text{mm}^2\text{/m}$).*
- **Sıcaklıkla Direnç Değişimi:** Metallerde sıcaklık arttıkça direnç artar:
  $$R_T = R_0 \cdot [1 + \alpha \cdot (T - T_0)]$$
- **Gerilim Düşümü Sınırı:** Endüstriyel tesislerde ana panodan motora giden hatlarda gerilim düşümü %3'ü, aydınlatma hatlarında %1.5'i aşmamalıdır (IEC 60364).

<Callout type="info" title="Kablo Hesabı Örneği">
$50\text{ m}$ mesafedeki motora $2.5\text{ mm}^2$ bakır kablo çekildiğinde gidiş-dönüş ($100\text{ m}$) hat direnci:
$$R = 0.0175 \times \frac{100}{2.5} = \mathbf{0.70\ \Omega}$$
16 A akım geçtiğinde kabloda $11.2\text{ V}$ gerilim düşümü ve $179\text{ W}$ ısı kaybı oluşur.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Birim Dönüştürücü](/tr/tools/unit-converter)
- [Güç - Tork - Devir Hesaplayıcı](/tr/tools/torque-power)
- [Temel Mühendislik Araçları](/tr/tools/basic-engineering)
`
    },
    en: {
      title: "Electrical resistance",
      description: "Ohm's Law ($V=IR$), conductor resistance formulation ($R = \rho L / A$), temperature coefficient, and cable voltage drop sizing.",
      body: `Electrical resistance ($R$) is the measure of the opposition that a conductor or circuit component offers to the flow of electric charge (current). In the SI system, resistance is quantified in Ohms [$\Omega$].

## Why it matters

Undersized cabling exhibits elevated resistance, triggering line voltage drop ($\Delta V = I \cdot R$) and Joule resistive heating ($P = I^2 R$). Excessive voltage drop causes motor stalling, nuisance breaker tripping, and electrical fire risks.

## Engineering application & standards

- **Conductor Resistance Equation:** Based on material electrical resistivity ($\rho_e$), length ($L$), and cross-sectional area ($A$):
  $$R = \rho_e \cdot \frac{L}{A}$$
  *(Electrolytic copper at 20 °C: $\rho_e \approx 0.0175\ \Omega\cdot\text{mm}^2\text{/m}$).*
- **Temperature Dependence:** Metal conductor resistance increases with temperature:
  $$R_T = R_0 \cdot [1 + \alpha \cdot (T - T_0)]$$
- **Allowable Voltage Drop:** IEC 60364 and NEC standards mandate limiting cable voltage drop to under 3% for industrial power feeders and under 5% total branch distribution.

<Callout type="info" title="Cable Sizing Example">
A 50-meter cable run to an induction motor using $2.5\text{ mm}^2$ copper conductors (100 m round-trip loop):
$$R = 0.0175 \times \frac{100}{2.5} = \mathbf{0.70\ \Omega}$$
Carrying a 16 A motor current, the cable loop generates an $11.2\text{ V}$ drop and dissipates $179\text{ W}$ in thermal heat loss.
</Callout>

## Related calculators and resources

- [Unit Converter](/en/tools/unit-converter)
- [Power - Torque - Speed Calculator](/en/tools/torque-power)
- [Basic Engineering Tools](/en/tools/basic-engineering)
`
    }
  },
  "resonance": {
    tags: ["rezonans", "doğal frekans", "kritik devir", "titreşim", "modal analiz"],
    category: "Mekanik",
    tr: {
      title: "Rezonans",
      description: "Mekanik sistemlerde doğal frekans ($f_n$), tahrik frekansı, rezonans felaketi, kritik devir sayısı ve titreşim sönümleme.",
      body: `Rezonans, periyodik bir dış zorlayıcı kuvvetin frekansının (tahrik frekansı), mekanik sistemin doğal titreşim frekansıyla ($f_n$) eşleşmesi durumunda titreşim genliğinin teorik olarak sonsuza doğru hızla büyümesi olayıdır.

## Neden önemli?

Rezonans durumunda çok küçük bir döner dengesizlik kuvveti dahi devasa mekanik gerilmelere dönüşür. Köprülerin yıkılması, türbin şaftlarının kırılması, boru hatlarının flanşlardan kopması rezonans kaynaklı feci arızalardır.

## Mühendislik uygulaması ve standartlar

- **Doğal Frekans Formülü (Tek Serbestlik Dereceli Sistem):**
  $$\omega_n = \sqrt{\frac{k}{m}} \quad [\text{rad/s}], \quad f_n = \frac{1}{2\pi}\sqrt{\frac{k}{m}} \quad [\text{Hz}]$$
  *(burada $k$ sistem rijitliği [$\text{N/m}$], $m$ hareketli kütledir [$\text{kg}$]).*
- **Kritik Hız ($n_{kritik}$):** Döner şaftlarda doğal eğilme frekansına karşılık gelen devir sayısıdır ($n_{kr} = 60 \cdot f_n$).
- **Rezonanstan Kaçınma Kuralı:** Makinenin çalışma devri doğal frekansın en az $\pm %20 - %30$ uzağında tutulmalıdır:
  $$f_{calisma} < 0.70 \cdot f_n \quad (\text{rijit sistem}) \quad \text{veya} \quad f_{calisma} > 1.30 \cdot f_n \quad (\text{esnek sistem})$$

<Callout type="info" title="Tasarım Çözümü">
Rezonansa giren bir makine şasesini kurtarmak için ya kütle ($m$) artırılarak frekans düşürülür ya da takviye kaburgaları ile rijitlik ($k$) artırılarak doğal frekans çalışma devrinin üzerine taşınır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Döner Ekipmanda Dengeleme ve Titreşim Rehberi](/tr/guides/doner-ekipman-dengeleme-titresim-kontrolu)
- [Güç - Tork - Devir Hesaplayıcı](/tr/tools/torque-power)
- [Şaft Boyutlandırma ve Burulma](/tr/tools/shaft-torsion)
`
    },
    en: {
      title: "Mechanical resonance",
      description: "Mechanical system natural frequency ($f_n$), critical shaft speeds, catastrophic resonance amplification, and structural damping.",
      body: `Mechanical resonance is a dynamic phenomenon occurring when the forcing frequency of an external periodic excitation aligns with a structure's natural frequency of vibration ($f_n$), triggering extreme dynamic amplitude amplification limited only by internal damping.

## Why it matters

Under resonance, minuscule residual rotor unbalance forces produce catastrophic vibration amplitudes, inducing rapid fatigue cracking, foundation destruction, and violent machine failure.

## Engineering application & standards

- **Natural Frequency (Single Degree of Freedom):**
  $$\omega_n = \sqrt{\frac{k}{m}} \quad [\text{rad/s}], \quad f_n = \frac{1}{2\pi}\sqrt{\frac{k}{m}} \quad [\text{Hz}]$$
  *(where $k$ is structural stiffness [$\text{N/m}$] and $m$ is vibrating mass [$\text{kg}$]).*
- **Critical Shaft Speed ($n_{critical}$):** Rotational speed matching flexural resonance ($n_{crit} = 60 \cdot f_n$).
- **Frequency Separation Margin:** Steady-state operating speeds must maintain a minimum $\pm 20\% - 30\%$ exclusion band around natural frequencies:
  $$f_{operating} < 0.70 \cdot f_n \quad (\text{rigid rotor}) \quad \text{or} \quad f_{operating} > 1.30 \cdot f_n \quad (\text{flexible rotor})$$

<Callout type="info" title="Remediation Strategy">
To eliminate resonance, structural stiffness ($k$) can be reinforced with gussets to shift $f_n$ higher, or structural mass ($m$) increased to drop $f_n$ below operating speed.
</Callout>

## Related calculators and resources

- [Rotating Equipment Balancing Guide](/en/guides/doner-ekipman-dengeleme-titresim-kontrolu)
- [Power - Torque - Speed Calculator](/en/tools/torque-power)
- [Shaft Sizing and Torsion](/en/tools/shaft-torsion)
`
    }
  },
  "reynolds-number": {
    tags: ["Reynolds sayısı", "akış rejimleri", "laminer", "türbülanslı", "akışkanlar"],
    category: "Akışkanlar",
    tr: {
      title: "Reynolds sayısı (Re)",
      description: "Boyutsuz Reynolds sayısı formülü ($Re = \rho v D / \mu$), laminer ve türbülanslı akış geçiş kriteri ve boru sürtünme faktörü.",
      body: `Reynolds sayısı ($Re$), akışkanlar mekaniğinde akışkanın atalet kuvvetlerinin viskoz sürtünme kuvvetlerine oranını temsil eden en temel boyutsuz sayıdır. Akışın düzenli laminer mi yoksa girdaplı türbülanslı mı davranacağını belirler.

## Neden önemli?

Boru çapı, debi, viskozite veya sıcaklık değiştiğinde akış rejiminin değişip değişmediğini bilmenin tek yolu Reynolds sayısıdır. Isı transfer katsayıları ve sürtünme basınç kayıpları doğrudan Reynolds sayısına bağlıdır.

## Mühendislik uygulaması ve standartlar

Dairesel boru akışında Reynolds sayısı formülü:
$$Re = \frac{\rho \cdot v \cdot D}{\mu} = \frac{v \cdot D}{\nu}$$
- $\rho$: Akışkan yoğunluğu [$\text{kg/m}^3$],
- $v$: Ortalama akış hızı [$\text{m/s}$],
- $D$: Boru iç çapı [$\text{m}$],
- $\mu$: Dinamik viskozite [$\text{Pa}\cdot\text{s}$], $\nu$: Kinematik viskozite [$\text{m}^2\text{/s}$].
**Kritik Sınırlar:**
- $Re < 2300$: Kararlı Laminer Akış.
- $2300 \le Re \le 4000$: Geçiş Bölgesi (kararsız akış).
- $Re > 4000$: Tam Türbülanslı Akış.

<Callout type="info" title="Pratik Örnek">
20 °C su ($\nu = 1.0 \times 10^{-6}\text{ m}^2\text{/s}$), $D = 50\text{ mm}$ borudan $v = 1.5\text{ m/s}$ hızla akarken:
$$Re = \frac{1.5 \times 0.050}{1.0 \times 10^{-6}} = \mathbf{75\,000}$$
$75\,000 \gg 4000$ olduğundan akış tam türbülanslıdır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Boru Basınç Kaybı Hesaplayıcı](/tr/tools/pipe-pressure-loss)
- [Akışkan Dinamiği Temelleri Rehberi](/tr/guides/akiskan-dinamigi-temelleri-boru-kanal-akisi)
- [Birim Dönüştürücü](/tr/tools/unit-converter)
`
    },
    en: {
      title: "Reynolds number (Re)",
      description: "Dimensionless Reynolds number ($Re = \rho v D / \mu$), transition criteria between laminar and turbulent flow regimes, and friction scaling.",
      body: `The Reynolds number ($Re$) is the preeminent dimensionless quantity in fluid mechanics, expressing the ratio of dynamic inertial forces to viscous shear forces within a moving fluid medium.

## Why it matters

The Reynolds number determines whether boundary layer flow is smooth laminar or chaotic turbulent. Convective heat transfer coefficients, drag forces, and piping friction factors are direct mathematical functions of $Re$.

## Engineering application & standards

In internal circular pipe flow:
$$Re = \frac{\rho \cdot v \cdot D}{\mu} = \frac{v \cdot D}{\nu}$$
- $\rho$: Fluid density [$\text{kg/m}^3$],
- $v$: Mean flow velocity [$\text{m/s}$],
- $D$: Pipe inner diameter [$\text{m}$],
- $\mu$: Dynamic viscosity [$\text{Pa}\cdot\text{s}$], $\nu$: Kinematic viscosity [$\text{m}^2\text{/s}$].
**Regime Boundaries:**
- $Re < 2300$: Stable Laminar Flow.
- $2300 \le Re \le 4000$: Critical Transition Zone.
- $Re > 4000$: Fully Developed Turbulent Flow.

<Callout type="info" title="Engineering Example">
Water at 20 °C ($\nu = 1.0 \times 10^{-6}\text{ m}^2\text{/s}$) flowing through a $D = 50\text{ mm}$ pipe at $v = 1.5\text{ m/s}$:
$$Re = \frac{1.5 \times 0.050}{1.0 \times 10^{-6}} = \mathbf{75\,000}$$
Because $75\,000 \gg 4000$, the flow is fully turbulent.
</Callout>

## Related calculators and resources

- [Pipe Pressure Loss Calculator](/en/tools/pipe-pressure-loss)
- [Fluid Dynamics Basics Guide](/en/guides/akiskan-dinamigi-temelleri-boru-kanal-akisi)
- [Unit Converter](/en/tools/unit-converter)
`
    }
  },
  "rolling": {
    tags: ["haddeleme", "sac", "profil", "sıcak hadde", "soğuk hadde"],
    category: "İmalat",
    tr: {
      title: "Metal haddeleme (rolling)",
      description: "Sıcak ve soğuk haddeleme imalat prosesleri, sac ve profil imalatı, tane yönlenmesi ve soğuk şekil sertleşmesi.",
      body: `Haddeleme (Rolling), metal kütüklerin veya levhaların birbirine ters yönde dönen iki silindirik merdane arasından geçirilerek kalınlığının azaltıldığı ve boyunun uzatıldığı en yaygın plastik şekil verme yöntemidir.

## Neden önemli?

Dünya genelinde üretilen tüm metallerin %80'inden fazlası son formuna getirilmeden önce en az bir kez haddeleme prosesinden geçer. Çelik saclar, I-kirişler, raylar ve boru et kalınlıkları haddeleme ile üretilir.

## Mühendislik uygulaması ve standartlar

- **Sıcak Haddeleme (Hot Rolling):** Yeniden kristalleşme sıcaklığının üzerinde ($> 900 - 1200\text{ °C}$) yapılır; düşük kuvvet gerekir, gözenekler kapanır ancak yüzeyde tufal (scale) oluşur ve toleranslar daha kabadır.
- **Soğuk Haddeleme (Cold Rolling):** Oda sıcaklığında yapılır; pekleşme (iş sertleşmesi) mekanizması ile malzemenin akma ve çekme mukavemeti %30-50 artar, ayna gibi pürüzsüz yüzey ve dar tolerans elde edilir.
- **Tane Yönlenmesi (Anizotropi):** Haddeleme yönündeki akma mukavemeti ve tokluk, enine yöne göre daha yüksektir; sac büküm kalıplarında büküm ekseni hadde yönüne dik planlanmalıdır.

<Callout type="info" title="Tasarım İpucu">
Sac parçalarda büküm yaparken büküm çizgisi haddeleme yönüne paralel olursa dış kavis bölgesinde çatlama meydana gelir; büküm ekseni hadde liflerine $90^\circ$ dik olmalıdır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Malzeme Kütüphanesi ve Dayanım Değerleri](/tr/materials)
- [Basit Gerilme Hesaplayıcı](/tr/tools/simple-stress)
- [Standartlar Kütüphanesi](/tr/standards)
`
    },
    en: {
      title: "Metal rolling",
      description: "Hot and cold metal rolling processes, sheet metal forming, directional grain anisotropy, and strain hardening mechanics.",
      body: `Metal rolling is a high-tonnage compressive forming process where metal stock (billets, blooms, slabs) is passed between counter-rotating cylindrical rolls to reduce cross-sectional thickness and establish uniform profiles (structural beams, sheet, plate, rails).

## Why it matters

Over 80% of all primary metallic engineering stock passes through rolling mills. The process governs initial material properties, surface texture, and dimensional tolerances of raw engineering stock.

## Engineering application & standards

- **Hot Rolling:** Performed above recrystallization temperature ($> 900 - 1200\text{ °C}$ for steel); lowers deformation forces and heals casting defects, but creates surface oxide scale with looser dimensional tolerances.
- **Cold Rolling:** Executed at room temperature; induces substantial strain hardening (work hardening), boosting yield strength by 30% to 50% while delivering tight thickness tolerances and smooth surface finishes.
- **Mechanical Anisotropy:** Rolling elongates metallic grains along the rolling direction; tensile and bend properties exhibit distinct directional variation.

<Callout type="info" title="Forming Guideline">
When press-braking sheet metal, orienting bend axes parallel to the rolling grain direction induces outer radius tensile cracking; bend lines must lie perpendicular ($90^\circ$) to the rolling direction.
</Callout>

## Related calculators and resources

- [Materials Library and Mechanical Properties](/en/materials)
- [Simple Stress Calculator](/en/tools/simple-stress)
- [Standards Index](/en/standards)
`
    }
  },
  "runout": {
    tags: ["salgı", "yalpalama", "GD&T", "ASME Y14.5", "komparatör", "TIR"],
    category: "Tolerans",
    tr: {
      title: "Salgı ve yalpalama (runout)",
      description: "Dairesel ve toplam salgı toleransları ($\nearrow$, $\\unicode{x2330}$), komparatör saati ile TIR ölçümü ve rotor balansına etkisi.",
      body: `Salgı (Runout), dönel bir parçanın kendi referans ekseni etrafında $360^\circ$ döndürülmesi sırasında yüzeyinin referans eksene göre gösterdiği radyal veya eksenel sapma (yalpalama) miktarıdır. İbreli komparatör saati (TIR - Total Indicator Reading) ile ölçülür.

## Neden önemli?

Döner millerde, volanlarda ve kasnaklarda salgı olması; merkezkaç kuvvetler, dinamik titreşim, kayışların kasnaktan atması, keçelerin erken yağ kaçırması ve yatak ömrünün tükenmesine sebep olur.

## Mühendislik uygulaması ve standartlar

ASME Y14.5 ve ISO 1101 standartlarında iki tür salgı denetlenir:
- **Dairesel Salgı (Circular Runout - $\nearrow$):** Parça döndürülürken komparatör tek bir dairesel kesitte sabit tutulur; dairesellik ve eşmerkezlilik sapmalarının bileşkesini denetler.
- **Toplam Salgı (Total Runout - $\\unicode{x2330}$):** Komparatör parça dönerken eksen boyunca boydan boya taranır; dairesellik, eşmerkezlilik, silindiriklik ve doğrusallık hatalarını aynı anda denetleyen en sıkı toleranstır.

<Callout type="info" title="Ölçüm İpucu">
Radyal salgı milin ovalliğini ve kaçıklığını ölçerken, eksenel salgı (alın yalpalaması) mil faturasının dönme eksenine dikliğini denetler.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Tolerans Yığılması ve GD&T Laboratuvarı](/tr/tools/tolerance-lab)
- [Döner Ekipmanda Dengeleme ve Titreşim Rehberi](/tr/guides/doner-ekipman-dengeleme-titresim-kontrolu)
- [Rulman Ömrü Hesaplayıcı](/tr/tools/bearing-life)
`
    },
    en: {
      title: "Runout tolerance",
      description: "Circular and total runout tolerances ($\nearrow$, $\\unicode{x2330}$) in ASME Y14.5 and ISO 1101, dial indicator TIR measurement, and rotational balance.",
      body: `Runout is a composite geometric tolerance that controls the cumulative deviation of a rotational surface feature relative to a designated datum rotational axis as the part is rotated $360^\circ$ about that axis, quantified as Total Indicator Reading (TIR).

## Why it matters

Radial and axial runout in spinning shafts, pulleys, and brake rotors excites dynamic vibration, accelerates oil seal leakage, promotes belt tracking failures, and destroys bearing raceways.

## Engineering application & standards

Governed by ASME Y14.5 and ISO 1101:
- **Circular Runout ($\nearrow$):** Evaluated at a fixed axial station; simultaneously controls circularity and coaxiality at individual cross-sections.
- **Total Runout ($\\unicode{x2330}$):** The dial indicator traverses the entire length of the cylindrical or planar feature as the component rotates, controlling circularity, cylindricity, coaxiality, straightness, and taper in one single metric.

<Callout type="info" title="Inspection Principle">
Radial runout measures shaft journal eccentricity and out-of-roundness, whereas axial runout inspects face wobble and perpendicularity of shaft shoulders against bearing inner rings.
</Callout>

## Related calculators and resources

- [Tolerance Stack-Up & GD&T Lab](/en/tools/tolerance-lab)
- [Rotating Equipment Balancing Guide](/en/guides/doner-ekipman-dengeleme-titresim-kontrolu)
- [Bearing Life Calculator](/en/tools/bearing-life)
`
    }
  },
  "shear-stress": {
    tags: ["kayma gerilmesi", "kesme gerilmesi", "burulma", "tresca", "von mises"],
    category: "Mekanik",
    tr: {
      title: "Kayma gerilmesi (kesme gerilmesi)",
      description: "Mekanik kayma gerilmesi ($\tau = F/A$), cıvatalarda çift tesirli kesme, millerde burulma kayma gerilmesi ve Tresca akma kriteri.",
      body: `Kayma gerilmesi ($\tau$), bir elemanın kesitine paralel (teğetsel) doğrultuda etkiyen kuvvetlerin, malzemenin düzlemlerini birbirinin üzerinden kaydırmaya zorlamasıyla oluşan iç gerilmedir. SI birim sisteminde Megapaskal [$\text{MPa}$] veya [$\text{N/mm}^2$] olarak ölçülür.

## Neden önemli?

Pimler, perçinler, kama gövdeleri ve cıvatalı mafsal bağlantıları doğrudan kesme gerilmesiyle yük taşır. Ayrıca burulmaya maruz kalan tüm döner millerde oluşan gerilme türü kayma gerilmesidir.

## Mühendislik uygulaması ve standartlar

- **Doğrudan (Düzlem) Kesme Gerilmesi:**
  $$\tau = \frac{F}{A_{kesit}} \le \tau_{em}$$
  Çift tesirli pim bağlantılarında kesilen yüzey iki katına çıkar: $\tau = \frac{F}{2 \cdot A}$.
- **Şaft Burulma Kayma Gerilmesi:**
  $$\tau_{tork} = \frac{T \cdot r}{I_p} = \frac{T}{W_p} = \frac{16 \cdot T}{\pi \cdot d^3}$$
- **Kayma Akma Dayanımı:** von Mises akma kriterine göre çeliklerin kayma akma sınırı çekme akma sınırının %57.7'sidir:
  $$\tau_y \approx 0.577 \cdot R_e$$

<Callout type="info" title="Hesaplama Örneği">
$10\text{ mm}$ çapında 8.8 kalite bir pim ($R_e = 640\text{ MPa}$, $\tau_y \approx 370\text{ MPa}$) tek tesirli olarak $20\text{ kN}$ kesme kuvveti taşıyorsa:
$$A = \frac{\pi \times 10^2}{4} \approx 78.5\text{ mm}^2 \implies \tau = \frac{20\,000}{78.5} \approx \mathbf{254.8\text{ MPa}} \le 370\text{ MPa}$$
Pim emniyetlidir.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Şaft Boyutlandırma ve Burulma](/tr/tools/shaft-torsion)
- [Basit Gerilme Hesaplayıcı](/tr/tools/simple-stress)
- [Cıvata Mukavemeti ve Tork Hesabı](/tr/tools/bolt-calculator)
`
    },
    en: {
      title: "Shear stress",
      description: "Mechanical shear stress ($\tau = F/A$), direct double shear in pins, torsional shear in rotating shafts, and von Mises yield criteria.",
      body: `Shear stress ($\tau$) is the coplanar stress component arising from forces acting tangential to the cross-sectional plane, inducing internal parallel crystal planes to slide past one another. Measured in Megapascals [$\text{MPa}$].

## Why it matters

Mechanical dowel pins, rivets, keyseats, and shear bolts transmit loads through direct shear. Furthermore, torsional twisting moments applied to rotating drive shafts resolve internally into pure shear stress fields.

## Engineering application & standards

- **Direct Transverse Shear Stress:**
  $$\tau = \frac{F}{A_{shear}} \le \tau_{allow}$$
  In double-shear clevis pin joints, load is divided across two shear planes: $\tau = \frac{F}{2 \cdot A}$.
- **Torsional Shear Stress in Circular Shafts:**
  $$\tau_{torsion} = \frac{T \cdot r}{J} = \frac{T}{W_p} = \frac{16 \cdot T}{\pi \cdot d^3}$$
- **Shear Yield Threshold:** Under the distortion energy (von Mises) yield criterion for ductile metals, shear yield strength is 57.7% of tensile yield:
  $$\tau_y \approx 0.577 \cdot S_y$$

<Callout type="info" title="Engineering Example">
A $d = 10\text{ mm}$ Grade 8.8 steel pin ($S_y = 640\text{ MPa}$, $\tau_y \approx 370\text{ MPa}$) in single shear under $F = 20\text{ kN}$:
$$A = \frac{\pi \times 10^2}{4} \approx 78.5\text{ mm}^2 \implies \tau = \frac{20\,000}{78.5} \approx \mathbf{254.8\text{ MPa}} \le 370\text{ MPa}$$
The pin is mechanically safe against shear yielding.
</Callout>

## Related calculators and resources

- [Shaft Sizing and Torsion](/en/tools/shaft-torsion)
- [Simple Stress Calculator](/en/tools/simple-stress)
- [Bolt Strength and Preload Calculator](/en/tools/bolt-calculator)
`
    }
  },
  "strain": {
    tags: ["birim şekil değiştirme", "deformasyon", "uzama", "Hooke yasası", "Poisson oranı"],
    category: "Mekanik",
    tr: {
      title: "Birim şekil değiştirme (strain)",
      description: "Mekanik birim şekil değiştirme ($\varepsilon = \Delta L / L_0$), gerinim ölçer (strain gauge), Poisson oranı ve elastik-plastik deformasyon.",
      body: `Birim şekil değiştirme veya gerinim ($\varepsilon$), bir cismin mekanik gerilme veya sıcaklık etkisi altında orijinal boyutuna göre gösterdiği boyutsal uzama veya kısalma miktarının boyutsuz oranıdır ($\varepsilon = \Delta L / L_0$).

## Neden önemli?

Gerilme doğrudan gözle görülemez veya ölçülemez; fiziksel olarak ölçülebilen tek büyüklük birim şekil değiştirmedir. Deneysel gerilme analizinde parçalara gerinim ölçer (strain gauge) yapıştırılarak gerilme dolaylı olarak hesaplanır.

## Mühendislik uygulaması ve standartlar

- **Normal Birim Şekil Değiştirme (Hooke Yasası):** Elastik bölgede gerilme ile gerinim arasındaki ilişki:
  $$\varepsilon = \frac{\Delta L}{L_0} = \frac{\sigma}{E}$$
- **Kayma Gerinimi ($\gamma$):** Dik açılı elemanın açısal distorsiyonudur: $\gamma = \tau / G$.
- **Poisson Oranı ($\nu$):** Eksenel çekme esnasında enine meydana gelen daralmanın eksenel uzamaya oranıdır:
  $$\nu = -\frac{\varepsilon_{enine}}{\varepsilon_{eksenel}}$$
  *(Çelik için $\nu \approx 0.30$, alüminyum için $\nu \approx 0.33$, mantar için $\nu \approx 0.0$'dır).*

<Callout type="info" title="Pratik Dönüşüm">
$1000\text{ mm}$ boyundaki bir çelik kolon $1\text{ mm}$ kısaldığında birim şekil değiştirme:
$$\varepsilon = \frac{1}{1000} = 0.001 = 1000\ \mu\varepsilon\ (\text{mikrostrain})$$
Oluşan basma gerilmesi: $\sigma = E \cdot \varepsilon = 210\,000 \times 0.001 = \mathbf{210\text{ MPa}}$'dır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Basit Gerilme Hesaplayıcı](/tr/tools/simple-stress)
- [Malzeme Kütüphanesi ve Elastisite](/tr/materials)
- [Birim Dönüştürücü](/tr/tools/unit-converter)
`
    },
    en: {
      title: "Engineering strain",
      description: "Mechanical strain formulation ($\varepsilon = \Delta L / L_0$), strain gauge measurement, Poisson's ratio ($\nu$), and Hooke's law elasticity.",
      body: `Engineering strain ($\varepsilon$) is the dimensionless measure of deformation representing the relative displacement or elongation of material particles per unit original reference length under external stress or thermal excitation ($\varepsilon = \Delta L / L_0$).

## Why it matters

Stress cannot be physically measured directly; sensors (foil strain gauges) measure localized surface strain, from which structural mechanical stress is derived via constitutive elasticity relations.

## Engineering application & standards

- **Axial Normal Strain (Hooke's Law):** Within linear elastic boundaries:
  $$\varepsilon = \frac{\Delta L}{L_0} = \frac{\sigma}{E}$$
- **Shear Strain ($\gamma$):** Angular distortion of orthogonal reference lines: $\gamma = \tau / G$.
- **Poisson's Ratio ($\nu$):** Negative ratio of transverse contraction strain to longitudinal extension strain:
  $$\nu = -\frac{\varepsilon_{transverse}}{\varepsilon_{axial}}$$
  *(Structural steel: $\nu \approx 0.30$; aluminum alloys: $\nu \approx 0.33$; rubber: $\nu \approx 0.499$).*

<Callout type="info" title="Engineering Conversion">
A $1000\text{ mm}$ structural tie-rod compressing by $1\text{ mm}$:
$$\varepsilon = \frac{1}{1000} = 0.001 = 1000\ \mu\varepsilon\ (\text{microstrain})$$
The corresponding internal normal compressive stress is: $\sigma = E \cdot \varepsilon = 210\,000 \times 0.001 = \mathbf{210\text{ MPa}}$.
</Callout>

## Related calculators and resources

- [Simple Stress Calculator](/en/tools/simple-stress)
- [Materials Library and Elasticity](/en/materials)
- [Unit Converter](/en/tools/unit-converter)
`
    }
  },
  "stress": {
    tags: ["gerilme", "çekme", "basma", "von Mises", "mukavemet"],
    category: "Mekanik",
    tr: {
      title: "Mekanik gerilme (stress)",
      description: "Mekanik gerilme türleri ($\sigma = F/A$), çekme, basma, eğilme, burulma ve çok eksenli von Mises eşdeğer gerilmesi.",
      body: `Gerilme ($\sigma$ veya $\tau$), bir cismin uygulanan dış kuvvetlere, momentlere veya termal genleşmeye karşı kendi iç moleküler bağları arasında birim alana düşen iç direnç kuvvetidir. SI birim sisteminde Megapaskal [$\text{MPa}$] veya [$\text{N/mm}^2$] olarak tanımlanır.

## Neden önemli?

Bir parçanın kırılıp kırılmayacağını toplam kuvvet değil, gerilmenin büyüklüğü belirler. Kuvvet aynı kalsa bile kesit alanının küçülmesi gerilmeyi katlayarak parçayı akma veya kırılma sınırına taşır.

## Mühendislik uygulaması ve standartlar

- **Normal Gerilme (Çekme / Basma):**
  $$\sigma = \frac{F}{A} \quad [\text{MPa}]$$
- **Eğilme Gerilmesi:** $\sigma_b = \frac{M_b}{W_b}$.
- **Burulma Gerilmesi:** $\tau = \frac{T}{W_p}$.
- **von Mises Eşdeğer Gerilmesi ($\sigma_{vm}$):** Çok eksenli karmaşık yükler altındaki sünek metallerde eşdeğer gerilme:
  $$\sigma_{vm} = \sqrt{\sigma_x^2 - \sigma_x \cdot \sigma_y + \sigma_y^2 + 3\tau_{xy}^2} \le \frac{R_{p0.2}}{S_f}$$

<Callout type="info" title="Tasarım Kuralı">
$F = 50\text{ kN}$ çekme kuvveti taşıyan çelik bir çubukta kesit alanı $A = 250\text{ mm}^2$ ise nominal çekme gerilmesi:
$$\sigma = \frac{50\,000\text{ N}}{250\text{ mm}^2} = \mathbf{200\text{ MPa}}$$
Bu gerilme seçilen malzemenin emniyetli akma dayanımıyla ($R_e / S_f$) karşılaştırılır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Basit Gerilme ve Güvenlik Faktörü](/tr/tools/simple-stress)
- [Şaft Boyutlandırma ve Burulma](/tr/tools/shaft-torsion)
- [Cıvata Mukavemeti ve Tork Hesabı](/tr/tools/bolt-calculator)
`
    },
    en: {
      title: "Mechanical stress",
      description: "Mechanical stress fundamentals ($\sigma = F/A$), tensile, compressive, bending, and multi-axial von Mises equivalent stress failure criteria.",
      body: `Mechanical stress ($\sigma$ or $\tau$) is the measure of internal restoring forces per unit area exerted between adjacent material particles across an internal surface to resist deformation caused by external loads, moments, or thermal expansion. Expressed in Megapascals [$\text{MPa}$].

## Why it matters

Structural integrity is governed by stress intensity rather than absolute force magnitude. Concentrating a moderate force into a reduced cross-section spikes local stress, triggering structural yielding or fatigue failure.

## Engineering application & standards

- **Normal Tensile/Compressive Stress:**
  $$\sigma = \frac{F}{A} \quad [\text{MPa}]$$
- **Flexural Bending Stress:** $\sigma_b = \frac{M_b}{W_b}$.
- **Torsional Shear Stress:** $\tau = \frac{T}{W_p}$.
- **von Mises Equivalent Stress ($\sigma_{vm}$):** In multi-axial stress states for ductile metals:
  $$\sigma_{vm} = \sqrt{\sigma_x^2 - \sigma_x \cdot \sigma_y + \sigma_y^2 + 3\tau_{xy}^2} \le \frac{S_y}{S_f}$$

<Callout type="info" title="Design Example">
A structural tie bar carrying an axial tension of $F = 50\text{ kN}$ with cross-sectional area $A = 250\text{ mm}^2$:
$$\sigma = \frac{50\,000\text{ N}}{250\text{ mm}^2} = \mathbf{200\text{ MPa}}$$
This stress level is checked against the material allowable design limit ($S_y / S_f$).
</Callout>

## Related calculators and resources

- [Simple Stress and Factor of Safety](/en/tools/simple-stress)
- [Shaft Sizing and Torsion](/en/tools/shaft-torsion)
- [Bolt Strength and Preload Calculator](/en/tools/bolt-calculator)
`
    }
  },
  "surface-finishing": {
    tags: ["yüzey pürüzlülüğü", "Ra", "Rz", "yüzey işleme", "ISO 4287", "kaplama"],
    category: "İmalat",
    tr: {
      title: "Yüzey işleme ve pürüzlülük",
      description: "Yüzey pürüzlülük parametreleri ($Ra$, $Rz$), ISO 4287 standardı, talaşlı imalat yöntemlerinin pürüzlülük kabiliyeti ve korozyon direnci.",
      body: `Yüzey işleme ve pürüzlülük, imalat süreçleri (torna, freze, taşlama, honlama) sonrasında parçanın yüzeyinde kalan mikroskobik tepe ve vadilerin geometrik profil sapmalarıdır. ISO 4287 standardına göre aritmetik ortalama sapma ($Ra$ [$\mu\text{m}$]) ile ifade edilir.

## Neden önemli?

Yüzey pürüzlülüğü yorulma mukavemetini, hidrodinamik sürtünmeyi, sızdırmazlık keçelerinin aşınmasını ve korozyon direncini doğrudan belirler. Kaba işlenmiş bir yüzey gerilme yığılması yaratarak yorulma ömrünü %30'a kadar düşürür.

## Mühendislik uygulaması ve standartlar

- **Aritmetik Ortalama Pürüzlülük ($Ra$):** Profil sapmalarının mutlak değer ortalamasıdır:
  $$Ra = \frac{1}{L} \int_0^L |y(x)| dx$$
- **On Nokta Yükseklik Ortalaması ($Rz$):** En yüksek 5 tepe ile en derin 5 vadi arasındaki farktır ($Rz \approx 4\dots 7 \cdot Ra$).
- **İmalat Yöntemleri Kabiliyeti:**
  - Kaba Torna / Freze: $Ra = 3.2 - 6.3\ \mu\text{m}$
  - Hassas Torna / Freze: $Ra = 0.8 - 1.6\ \mu\text{m}$
  - Silindirik Taşlama: $Ra = 0.2 - 0.4\ \mu\text{m}$
  - Honlama / Parlatma: $Ra \le 0.05 - 0.1\ \mu\text{m}$

<Callout type="info" title="Keçe Yüzeyi Kuralı">
Döner mil radyal yağ keçelerinin (simmering) bastığı bölgelerde $Ra = 0.2 - 0.5\ \mu\text{m}$ ve $Rz = 1.0 - 3.0\ \mu\text{m}$ olmalı; ayrıca yüzeyde spiral işleme izi (lead-in) kesinlikle bulunmamalıdır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Yüzey İşleme Yöntemleri Rehberi](/tr/guides/yuzey-isleme-yontemleri-rehberi)
- [Tolerans Yığılması ve GD&T Laboratuvarı](/tr/tools/tolerance-lab)
- [Rulman Ömrü Hesaplayıcı](/tr/tools/bearing-life)
`
    },
    en: {
      title: "Surface finish and roughness",
      description: "Surface texture parameters ($Ra$, $Rz$), ISO 4287 standard, manufacturing process roughness capabilities, and tribological seal integrity.",
      body: `Surface finish and roughness describe the microscopic topographical deviations (peaks and valleys) formed on a component's surface during manufacturing processes (turning, milling, grinding, honing), standardized under ISO 4287 as arithmetic mean deviation ($Ra$ in $\mu\text{m}$).

## Why it matters

Surface texture dictates fatigue crack initiation, hydrodynamic boundary friction, radial oil seal longevity, and coating adhesion. Rough finishes act as microscopic notch root stress raisers, slashing endurance limits by up to 35%.

## Engineering application & standards

- **Arithmetic Average Roughness ($Ra$):** Mean deviation of surface profile:
  $$Ra = \frac{1}{L} \int_0^L |y(x)| dx$$
- **Mean Peak-to-Valley Height ($Rz$):** Vertical distance between the 5 highest peaks and 5 deepest valleys ($Rz \approx 4\dots 7 \cdot Ra$).
- **Process Capability Benchmarks:**
  - Rough Turning/Milling: $Ra = 3.2 - 6.3\ \mu\text{m}$
  - Precision Finish Machining: $Ra = 0.8 - 1.6\ \mu\text{m}$
  - Cylindrical Grinding: $Ra = 0.2 - 0.4\ \mu\text{m}$
  - Superfinishing/Lapping: $Ra \le 0.05 - 0.1\ \mu\text{m}$

<Callout type="info" title="Sealing Journal Rule">
Rotary shaft lip seals require plunge-ground journals ($Ra = 0.2 - 0.5\ \mu\text{m}$, $Rz = 1.0 - 3.0\ \mu\text{m}$) free of machine lead spiral marks to prevent dynamic fluid leakage.
</Callout>

## Related calculators and resources

- [Surface Finishing and Coating Guide](/en/guides/yuzey-isleme-yontemleri-rehberi)
- [Tolerance Stack-Up & GD&T Lab](/en/tools/tolerance-lab)
- [Bearing Life Calculator](/en/tools/bearing-life)
`
    }
  },
  "tensile-strength": {
    tags: ["çekme mukavemeti", "Rm", "kopma dayanımı", "çekme testi", "ASTM E8"],
    category: "Malzeme",
    tr: {
      title: "Çekme mukavemeti (tensile strength)",
      description: "Çekme mukavemeti ($R_m$), çekme deneyinde ulaşılan tepe mühendislik gerilmesi, cıvata mukavemet sınıfları ve malzeme sınırları.",
      body: `Çekme mukavemeti ($R_m$ veya UTS), bir malzemenin eksenel çekme deneyi esnasında boyun verme (necking) başlamadan önce taşıyabildiği en yüksek mühendislik gerilmesidir. Malzemenin nihai mekanik dayanım sınırını temsil eder.

## Neden önemli?

Statik tasarımda genellikle akma mukavemeti ($R_e$) esas alınsa da, darbe, patlama ve basınçlı kap hesaplarında nihai güvenlik çekme mukavemeti üzerinden belirlenir. Ayrıca cıvata kalite sınıfları doğrudan çekme mukavemetiyle kodlanır.

## Mühendislik uygulaması ve standartlar

ISO 6892-1 ve ASTM E8 çekme testi standartlarına göre:
$$R_m = \frac{F_{max}}{S_0} \quad [\text{MPa}]$$
- $F_{max}$: Çekme eğrisindeki tepe kuvvet [$\text{N}$],
- $S_0$: Numunenin başlangıç orijinal kesit alanı [$\text{mm}^2$].
- **Cıvata Mukavemet Kodları (ISO 898-1):**
  - **8.8 Cıvata:** İlk rakam "8", nominal çekme mukavemetinin $R_m = 8 \times 100 = \mathbf{800\text{ MPa}}$ olduğunu belirtir.
  - **10.9 Cıvata:** $R_m = 10 \times 100 = \mathbf{1000\text{ MPa}}$.
  - **12.9 Cıvata:** $R_m = 12 \times 100 = \mathbf{1200\text{ MPa}}$.

<Callout type="info" title="Çözümlü Örnek">
M16 (8.8 kalite) bir cıvatanın gerilme kesit alanı $A_s = 157\text{ mm}^2$'dir. Bu cıvatanın kopabileceği teorik çekme yükü:
$$F_{kopma} = R_m \cdot A_s = 800\text{ MPa} \times 157\text{ mm}^2 = \mathbf{125\,600\text{ N}} \approx \mathbf{125.6\text{ kN}}$$
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Cıvata Mukavemeti ve Tork Hesabı](/tr/tools/bolt-calculator)
- [Basit Gerilme Hesaplayıcı](/tr/tools/simple-stress)
- [Malzeme Kütüphanesi ve Dayanım Değerleri](/tr/materials)
`
    },
    en: {
      title: "Ultimate tensile strength (UTS)",
      description: "Ultimate tensile strength ($R_m$ / UTS), peak engineering stress on stress-strain curves, fastener property classes, and ASTM E8 testing.",
      body: `Ultimate Tensile Strength ($R_m$ or UTS) is the maximum engineering tensile stress that an engineering material can withstand before necking instability begins and progressive cross-sectional contraction occurs during monotonic tensile loading.

## Why it matters

While operational machine design relies on yield strength ($S_y$) to prevent permanent deformation, ultimate strength governs burst safety factors in pressure vessels and structural fastener load ratings.

## Engineering application & standards

Governed by ASTM E8 and ISO 6892-1:
$$R_m = \frac{F_{max}}{A_0} \quad [\text{MPa}]$$
- $F_{max}$: Maximum peak force sustained by specimen [$\text{N}$],
- $A_0$: Original unloaded cross-sectional area [$\text{mm}^2$].
- **ISO 898-1 Metric Bolt Property Classes:**
  - **Class 8.8:** First digit represents nominal ultimate strength: $R_m = 8 \times 100 = \mathbf{800\text{ MPa}}$.
  - **Class 10.9:** Nominal $R_m = 10 \times 100 = \mathbf{1000\text{ MPa}}$.
  - **Class 12.9:** Nominal $R_m = 12 \times 100 = \mathbf{1200\text{ MPa}}$.

<Callout type="info" title="Calculation Example">
An M16 Class 8.8 bolt features an effective tensile stress area of $A_s = 157\text{ mm}^2$. Its ultimate tensile breaking load is:
$$F_{ultimate} = R_m \cdot A_s = 800\text{ MPa} \times 157\text{ mm}^2 = \mathbf{125\,600\text{ N}} \approx \mathbf{125.6\text{ kN}}$$
</Callout>

## Related calculators and resources

- [Bolt Strength and Preload Calculator](/en/tools/bolt-calculator)
- [Simple Stress Calculator](/en/tools/simple-stress)
- [Materials Library and Mechanical Properties](/en/materials)
`
    }
  },
  "thermal-conductivity": {
    tags: ["ısıl iletkenlik", "ısı transferi", "Fourier", "yalıtım", "termodinamik"],
    category: "Termal",
    tr: {
      title: "Isıl iletkenlik (thermal conductivity)",
      description: "Isıl iletkenlik katsayısı ($k$), Fourier ısı iletim yasası, endüstriyel yalıtım malzemeleri ve eşanjör tasarımı.",
      body: `Isıl iletkenlik ($k$ veya $\lambda$), bir malzemenin sıcaklık farkı etkisi altında birim alandan ve birim kalınlıktan birim zamanda iletebildiği ısı enerjisi miktarını temsil eden temel termofiziksel özelliktir. SI birim sisteminde $[\text{W/(m}\cdot\text{K)}]$ olarak tanımlanır.

## Neden önemli?

Elektronik soğutucularda (heat sink) ve eşanjörlerde ısıl iletkenliğin yüksek olması istenirken; fırın gövdelerinde ve kızgın buhar borularında enerji kaybını durdurmak için ısıl iletkenliğin mümkün olduğunca düşük olması gerekir.

## Mühendislik uygulaması ve standartlar

Fourier 1 boyutlu ısı iletim yasası:
$$q = -k \cdot \frac{dT}{dx} \implies Q = k \cdot A \cdot \frac{T_{sicak} - T_{soguk}}{s} \quad [\text{W}]$$
- $k$: Malzemenin ısıl iletkenliği [$\text{W/(m}\cdot\text{K)}$],
- $A$: Isı transfer alanı [$\text{m}^2$], $s$: Et kalınlığı [$\text{m}$].
**Tipik Malzeme Değerleri (20 °C):**
- Bakır: $k \approx 390 - 400\text{ W/(m}\cdot\text{K)}$ (mükemmel iletken)
- Alüminyum (6082): $k \approx 170 - 200\text{ W/(m}\cdot\text{K)}$
- Karbon Çeliği: $k \approx 45 - 55\text{ W/(m}\cdot\text{K)}$
- Titanyum (Ti-6Al-4V): $k \approx 7.2\text{ W/(m}\cdot\text{K)}$ (çok düşük iletken)
- Taş Yünü Yalıtımı: $k \approx 0.035 - 0.040\text{ W/(m}\cdot\text{K)}$ (yüksek yalıtım)

<Callout type="info" title="Yalıtım Örneği">
$k = 0.04\text{ W/(m}\cdot\text{K)}$ taş yünü ile yalıtılmış $s = 50\text{ mm}$ ($0.05\text{ m}$) kalınlığındaki bir boruda $\Delta T = 100\text{ °C}$ sıcaklık farkında birim alandan geçen ısı kaybı $q = \frac{0.04}{0.05} \times 100 = \mathbf{80\text{ W/m}^2}$ seviyesine düşer.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Isı Yalıtımı ve Termal Genleşme Rehberi](/tr/guides/isi-yalitimi-termal-genlesme-rehberi)
- [Birim Dönüştürücü](/tr/tools/unit-converter)
- [Malzeme Kütüphanesi ve Termal Özellikler](/tr/materials)
`
    },
    en: {
      title: "Thermal conductivity",
      description: "Thermal conductivity ($k$), Fourier's law of 1D heat conduction, industrial thermal insulation sizing, and heat exchanger efficiency.",
      body: `Thermal conductivity ($k$ or $\lambda$) is an intrinsic thermophysical property that quantifies a material's capacity to conduct heat energy through molecular collisions and electron transport under a temperature gradient. Measured in Watts per meter-Kelvin $[\text{W/(m}\cdot\text{K)}]$.

## Why it matters

Thermal conductivity dictates heat exchanger sizing, electronics CPU heat sink dissipation, and the insulation thickness required to prevent piping boil-off, freeze-up, or personnel burn hazards.

## Engineering application & standards

Governed by Fourier's 1D law of heat conduction:
$$q = -k \cdot \frac{dT}{dx} \implies Q = k \cdot A \cdot \frac{T_{hot} - T_{cold}}{s} \quad [\text{W}]$$
- $k$: Thermal conductivity $[\text{W/(m}\cdot\text{K)}]$,
- $A$: Conduction surface area [$\text{m}^2$], $s$: Wall thickness [$\text{m}$].
**Benchmark Material Properties (at 20 °C):**
- Pure Copper: $k \approx 390 - 400\text{ W/(m}\cdot\text{K)}$ (superior conductor)
- Aluminum 6061: $k \approx 167 - 200\text{ W/(m}\cdot\text{K)}$
- Carbon Steel: $k \approx 45 - 54\text{ W/(m}\cdot\text{K)}$
- Titanium Grade 5: $k \approx 7.2\text{ W/(m}\cdot\text{K)}$ (thermal barrier behavior)
- Mineral Wool Insulation: $k \approx 0.035 - 0.040\text{ W/(m}\cdot\text{K)}$ (high thermal resistance)

<Callout type="info" title="Insulation Example">
Insulating a $150\text{ °C}$ steam pipe with $s = 50\text{ mm}$ mineral wool ($k = 0.04\text{ W/(m}\cdot\text{K)}$) against $25\text{ °C}$ ambient yields a heat loss flux of: $q = \frac{0.04}{0.05} \times 125 = \mathbf{100\text{ W/m}^2}$.
</Callout>

## Related calculators and resources

- [Thermal Insulation and Expansion Guide](/en/guides/isi-yalitimi-termal-genlesme-rehberi)
- [Unit Converter](/en/tools/unit-converter)
- [Materials Library and Thermal Properties](/en/materials)
`
    }
  },
  "tolerance": {
    tags: ["tolerans", "ISO 286", "sapma", "imalat", "kalite"],
    category: "Tolerans",
    tr: {
      title: "İmalat toleransı",
      description: "ISO 286 boyut ve geçme toleransları, temel sapmalar, izin verilen ölçü aralığı ve talaşlı imalat maliyet ilişkisi.",
      body: `Tolerans ($T$), imal edilen bir parçanın teknik resimdeki nominal ölçüsünden sapmasına izin verilen üst limit ölçü ile alt limit ölçü arasındaki mutlak farktır ($T = \text{Üst Limit} - \text{Alt Limit}$).

## Neden önemli?

Fiziksel dünyada hiçbir parça tam olarak sıfır hata ile nominal ölçüsünde işlenemez. Tolerans verilmediğinde imalatçı parçayı üretemez; gereğinden dar tolerans verildiğinde ise işleme maliyetleri üstel olarak artar.

## Mühendislik uygulaması ve standartlar

ISO 286-1 standardına göre tolerans sistemi:
- **Tolerans Sınıfları (IT Kaliteleri):** IT01'den IT18'e kadar tanımlanır.
  - $IT4 - IT5$: Yüksek hassasiyetli taşlama, mastarlar.
  - $IT6 - IT7$: Hassas talaşlı imalat, rulman yuvaları, geçmeler.
  - $IT8 - IT9$: Genel torna ve freze operasyonları.
  - $IT11 - IT13$: Kaba döküm, dövme ve sac işleri.
- **Tolerans Alanı Gösterimi:** Büyük harfler delikleri ($H7$), küçük harfler milleri ($h6$, $s6$) temsil eder.
  - $50\text{ H7}$: Nominal $50\text{ mm}$, alt sapma $0$, üst sapma $+25\ \mu\text{m}$ $\implies [50.000\dots 50.025\text{ mm}]$.

<Callout type="info" title="Maliyet Kuralı">
Toleransı yarıya indirmek (örneğin $\pm 0.1\text{ mm}$'den $\pm 0.05\text{ mm}$'ye) tezgah işleme süresini ve kalite kontrol maliyetini yaklaşık **2 ila 3 kat** artırır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Tolerans Yığılması ve GD&T Laboratuvarı](/tr/tools/tolerance-lab)
- [Tolerans Zinciri ve GD&T Rehberi](/tr/guides/tolerans-zinciri-ve-gdt-rehberi)
- [Press Fit ve Tolerans Seçim Rehberi](/tr/guides/press-fit-baglantilari-tolerans-secimi)
`
    },
    en: {
      title: "Manufacturing tolerance",
      description: "ISO 286 dimensional tolerance grades (IT), fundamental deviations, bilateral limits, and machining cost curves.",
      body: `Tolerance ($T$) is the total permissible variation of a physical component dimension about its designated nominal value, quantified as the difference between the upper maximum material limit and the lower least material limit ($T = USL - LSL$).

## Why it matters

It is physically impossible to machine identical components with absolute mathematical zero deviation. Inadequate tolerancing prevents assembly fit, while unnecessarily tight tolerances exponentially inflate CNC cycle times and scrap rates.

## Engineering application & standards

Governed by ISO 286-1 via Fundamental Tolerance Grades (IT):
- **IT4 to IT5:** Ultra-precision cylindrical grinding, inspection slip gauges.
- **IT6 to IT7:** Precision finish machining, bearing journal seats, interference fits.
- **IT8 to IT9:** General industrial turning and milling operations.
- **IT11 to IT14:** Rough casting, forging, and sheet metal stamping.
- **Notation Convention:** Uppercase letters denote internal features/holes ($H7$), while lowercase letters denote external features/shafts ($g6, h6, s6$).
  - $\varnothing 50\text{ H7}$: Nominal $50\text{ mm}$, lower deviation $0$, upper deviation $+25\ \mu\text{m}$ $\implies [50.000\dots 50.025\text{ mm}]$.

<Callout type="info" title="Cost Curve">
Halving a dimensional tolerance (e.g., from $\pm 0.1\text{ mm}$ to $\pm 0.05\text{ mm}$) increases machining time and metrology costs by a factor of **2 to 3**.
</Callout>

## Related calculators and resources

- [Tolerance Stack-Up & GD&T Lab](/en/tools/tolerance-lab)
- [Tolerance Stack-up and GD&T Guide](/en/guides/tolerans-zinciri-ve-gdt-rehberi)
- [Press-Fit Tolerance Selection Guide](/en/guides/press-fit-baglantilari-tolerans-secimi)
`
    }
  },
  "torque": {
    tags: ["tork", "döndürme momenti", "güç", "devir", "şaft", "Nm"],
    category: "Mekanik",
    tr: {
      title: "Tork (döndürme momenti)",
      description: "Tork formülü ($T = F \times r$), motor gücü ve devir sayısı ilişkisi ($P = T \cdot \omega$), burulma gerilmesi ve tork hesabı.",
      body: `Tork ($T$), bir kuvvetin bir cismi belirli bir dönme ekseni veya merkez noktası etrafında döndürme eğilimini ifade eden mekanik döndürme momentidir. SI birim sisteminde Newton metre [$\text{Nm}$] olarak ifade edilir.

## Neden önemli?

Elektrik motorları, redüktörler ve tahrik milleri tork üreterek ve aktararak iş yapar. Şaft çaplarının burulma dayanımı, kamaların ezilme hesabı ve cıvataların sıkılması doğrudan tork değerine dayanır.

## Mühendislik uygulaması ve standartlar

- **Temel Tork Formülü:** Kuvvet ($F$) ve dönme merkezine olan dik mesafe ($r$):
  $$T = F \cdot r \quad [\text{Nm}]$$
- **Güç, Tork ve Devir Sayısı İlişkisi:**
  $$P = T \cdot \omega = T \cdot \frac{2\pi \cdot n}{60} \implies T = \frac{9550 \cdot P}{n}$$
  *(burada $P$ mekanik güç [$\text{kW}$], $n$ dönme devri [$\text{rpm}$], $T$ torktur [$\text{Nm}$]).*
- **Burulma Kayma Gerilmesi:**
  $$\tau = \frac{16 \cdot T}{\pi \cdot d^3} \le \tau_{em}$$

<Callout type="info" title="Motor Torku Hesabı">
$15\text{ kW}$ gücünde ve $n = 1450\text{ rpm}$ devirle dönen bir asenkron elektrik motorunun milindeki tork:
$$T = \frac{9550 \times 15}{1450} \approx \mathbf{98.8\text{ Nm}}$$
Redüktör ile devir 10 kat düşürülürse ($145\text{ rpm}$), tork yaklaşık 10 katına ($988\text{ Nm}$) çıkar.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Güç - Tork - Devir Hesaplayıcı](/tr/tools/torque-power)
- [Şaft Boyutlandırma ve Burulma](/tr/tools/shaft-torsion)
- [Cıvata Mukavemeti ve Tork Hesabı](/tr/tools/bolt-calculator)
`
    },
    en: {
      title: "Mechanical torque",
      description: "Torque formulation ($T = F \times r$), mechanical power and rotational speed relationship ($P = T \cdot \omega$), and torsional shaft stress.",
      body: `Torque ($T$) is the rotational equivalent of linear force, representing the rotational moment exerted by a tangential force acting at a perpendicular radial lever arm about a designated axis of rotation. Quantified in Newton-meters [$\text{Nm}$].

## Why it matters

Electric motors, gearboxes, and drivetrain shafts generate and transmit operational torque. Shaft sizing, keyway shear verification, and threaded fastener clamping are direct mathematical functions of torque.

## Engineering application & standards

- **Fundamental Lever Equation:** Tangential force ($F$) multiplied by radius ($r$):
  $$T = F \cdot r \quad [\text{Nm}]$$
- **Power, Torque, and Rotational Speed:**
  $$P = T \cdot \omega = T \cdot \frac{2\pi \cdot n}{60} \implies T = \frac{9550 \cdot P}{n}$$
  *(where $P$ is power [$\text{kW}$], $n$ is speed [$\text{rpm}$], and $T$ is torque [$\text{Nm}$]).*
- **Torsional Shear Stress in Circular Shafts:**
  $$\tau = \frac{16 \cdot T}{\pi \cdot d^3} \le \tau_{allow}$$

<Callout type="info" title="Electric Motor Example">
A $15\text{ kW}$ induction motor operating at rated speed $n = 1450\text{ rpm}$ delivers shaft torque of:
$$T = \frac{9550 \times 15}{1450} \approx \mathbf{98.8\text{ Nm}}$$
If a 10:1 reduction gearbox reduces speed to $145\text{ rpm}$, output torque increases tenfold to approximately $988\text{ Nm}$.
</Callout>

## Related calculators and resources

- [Power - Torque - Speed Calculator](/en/tools/torque-power)
- [Shaft Sizing and Torsion](/en/tools/shaft-torsion)
- [Bolt Strength and Preload Calculator](/en/tools/bolt-calculator)
`
    }
  },
  "turbulent-flow": {
    tags: ["türbülanslı akış", "Reynolds", "akışkanlar", "girdap", "basınç kaybı"],
    category: "Akışkanlar",
    tr: {
      title: "Türbülanslı akış",
      description: "Türbülanslı akış rejimi ($Re > 4000$), kaotik girdaplar, çeper pürüzlülüğü etkisi, Colebrook denklemi ve yüksek ısı transferi.",
      body: `Türbülanslı akış, akışkan parçacıklarının kaotik, düzensiz ve üç boyutlu girdaplar (eddies) halinde hızla birbirine karıştığı yüksek enerjili akış rejimidir. Atalet kuvvetlerinin viskoz sönümleme kuvvetlerine baskın geldiği durumlarda oluşur.

## Neden önemli?

Endüstriyel su borularında, havalandırma kanallarında ve proses hatlarında akışın %95'ten fazlası türbülanslı rejimdedir. Türbülans akış sürtünmesini artırırken, ısı ve kütle transfer verimini katbekat yükseltir.

## Mühendislik uygulaması ve standartlar

- **Reynolds Kriteri:** Dairesel borularda $Re > 4000$ olduğunda akış tam türbülanslıdır.
- **Yüzey Pürüzlülüğü Etkisi:** Laminer akışın aksine türbülanslı akışta boru çeper pürüzlülüğü ($\varepsilon$) sürtünme faktörünü doğrudan etkiler.
- **Colebrook-White ve Haaland Denklemi:** Darcy sürtünme faktörü ($f$):
  $$\frac{1}{\sqrt{f}} \approx -1.8 \cdot \log_{10}\left[ \left(\frac{\varepsilon / D}{3.7}\right)^{1.11} + \frac{6.9}{Re} \right]$$
- **Hız Profili:** Türbülanslı akışta hız profili laminerdeki gibi sivri parabolik değil; çekirdek bölgesinde düz ve homojen, çeperde ise çok dik bir gradyene sahiptir.

<Callout type="info" title="Eşanjör Tasarımı">
Isı eşanjörlerinde boru içindeki akışın türbülanslı olması istenir; girdaplı karışma akışkanın çeperle ısı alışverişini 5 ila 10 kat hızlandırır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Boru Basınç Kaybı Hesaplayıcı](/tr/tools/pipe-pressure-loss)
- [Akışkan Dinamiği Temelleri Rehberi](/tr/guides/akiskan-dinamigi-temelleri-boru-kanal-akisi)
- [Birim Dönüştürücü](/tr/tools/unit-converter)
`
    },
    en: {
      title: "Turbulent flow",
      description: "Turbulent flow regime ($Re > 4000$), chaotic eddy mixing, relative pipe roughness ($\varepsilon/D$), and Colebrook friction factor.",
      body: `Turbulent flow is a fluid dynamic regime characterized by chaotic fluid particle trajectories, rapid 3D eddy mixing, and transverse momentum exchange, occurring when fluid inertial forces overpower viscous shear damping.

## Why it matters

Over 95% of industrial fluid piping networks, heat exchangers, and HVAC ducts operate in the turbulent regime. While turbulence elevates frictional head loss, it substantially improves convective heat transfer rates.

## Engineering application & standards

- **Reynolds Criterion:** In pipe flow, the turbulent regime governs when $Re > 4000$.
- **Roughness Influence:** Unlike laminar flow, turbulent friction factor ($f$) depends strongly on relative pipe wall roughness ($\varepsilon / D$).
- **Haaland Explicit Friction Formulation:**
  $$\frac{1}{\sqrt{f}} \approx -1.8 \cdot \log_{10}\left[ \left(\frac{\varepsilon / D}{3.7}\right)^{1.11} + \frac{6.9}{Re} \right]$$
- **Velocity Profile:** Features a relatively flat, uniform velocity core across the pipe cross-section with a steep velocity gradient across the viscous sublayer directly adjacent to the pipe wall.

<Callout type="info" title="Heat Exchanger Design">
Shell-and-tube heat exchangers are engineered to operate strictly in the turbulent regime because turbulent eddy mixing accelerates convective heat transfer rates by a factor of 5 to 10 over laminar flow.
</Callout>

## Related calculators and resources

- [Pipe Pressure Loss Calculator](/en/tools/pipe-pressure-loss)
- [Fluid Dynamics Basics Guide](/en/guides/akiskan-dinamigi-temelleri-boru-kanal-akisi)
- [Unit Converter](/en/tools/unit-converter)
`
    }
  },
  "viscosity": {
    tags: ["viskozite", "akışkanlar", "dinamik viskozite", "kinematik viskozite", "cSt", "yağlama"],
    category: "Akışkanlar",
    tr: {
      title: "Viskozite (akışkanlık direnci)",
      description: "Dinamik ($\mu$) ve kinematik ($\nu$) viskozite, cSt/cPoise birimleri, sıcaklıkla viskozite değişimi ve madeni yağ sınıflandırması.",
      body: `Viskozite, bir akışkanın iç sürtünmesi sebebiyle akmaya ve kesme gerilmelerine karşı gösterdiği direnç kabiliyetidir. "Akışkanın koyuluğu" veya "ağdalığı" olarak bilinir.

## Neden önemli?

Rulmanların ve dişlilerin yağlanmasında doğru viskoziteye sahip yağ seçilmezse metal-metale temas ve aşınma yaşanır. Boru hatlarında ve pompalarda ise viskozite sürtünme basınç kaybını ve gereken pompa motor gücünü doğrudan belirler.

## Mühendislik uygulaması ve standartlar

- **Dinamik Viskozite ($\mu$):** Kesme kuvveti ile hız gradyeni oranıdır: $\tau = \mu \cdot \frac{dv}{dy}$. Birimi Pascal-saniye [$\text{Pa}\cdot\text{s}$] veya centipoise [$\text{cP}$].
- **Kinematik Viskozite ($\nu$):** Dinamik viskozitenin yoğunluğa oranıdır:
  $$\nu = \frac{\mu}{\rho} \quad [\text{m}^2\text{/s}] \quad (1\text{ cSt} = 1\text{ mm}^2\text{/s})$$
- **Sıcaklık Bağımlılığı (Viskozite İndeksi - VI):** Sıcaklık arttıkça sıvıların viskozitesi üstel olarak düşer. Örneğin ISO VG 46 hidrolik yağın viskozitesi $40\text{ °C}$'de $46\text{ cSt}$ iken $100\text{ °C}$'de $6.8\text{ cSt}$'ye düşer.

<Callout type="info" title="Pratik Referanslar (20 °C)">
- Su: $\mu \approx 1.0\text{ cP}$ ($\nu \approx 1.0\text{ cSt}$)
- Motor Yağı (SAE 30): $\mu \approx 100 - 300\text{ cP}$
- Gliserin: $\mu \approx 1400\text{ cP}$
- Bal: $\mu \approx 10\,000\text{ cP}$
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Boru Basınç Kaybı Hesaplayıcı](/tr/tools/pipe-pressure-loss)
- [Pompa Türleri ve Seçim Rehberi](/tr/guides/pompa-turleri-secim-rehberi)
- [Birim Dönüştürücü](/tr/tools/unit-converter)
`
    },
    en: {
      title: "Fluid viscosity",
      description: "Dynamic ($\mu$) and kinematic ($\nu$) viscosity, centistoke (cSt) and centipoise units, temperature-viscosity index (VI), and lubricant selection.",
      body: `Viscosity is the fundamental fluid transport property that quantifies a fluid's internal molecular resistance to gradual shear deformation or continuous laminar flow. Informally described as fluid thickness or resistance to pouring.

## Why it matters

In industrial bearing and gear lubrication, improper lubricant viscosity causes boundary friction metal-to-metal contact and catastrophic adhesive scuffing. In piping circuits, viscosity dictates pump head loss and motor horsepower sizing.

## Engineering application & standards

- **Dynamic (Absolute) Viscosity ($\mu$):** Ratio of shear stress to shear rate: $\tau = \mu \cdot \frac{du}{dy}$. Expressed in Pascal-seconds [$\text{Pa}\cdot\text{s}$] or centipoise [$1\text{ cP} = 10^{-3}\text{ Pa}\cdot\text{s}$].
- **Kinematic Viscosity ($\nu$):** Ratio of absolute viscosity to mass density:
  $$\nu = \frac{\mu}{\rho} \quad [\text{m}^2\text{/s}] \quad (1\text{ cSt} = 1\text{ mm}^2\text{/s})$$
- **Temperature Dependence (Viscosity Index):** Liquid viscosity drops exponentially with rising temperature. For example, ISO VG 46 mineral oil provides $46\text{ cSt}$ at $40\text{ °C}$ but thins to $6.8\text{ cSt}$ at $100\text{ °C}$.

<Callout type="info" title="Viscosity Benchmarks (at 20 °C)">
- Water: $\mu \approx 1.0\text{ cP}$ ($\nu \approx 1.0\text{ cSt}$)
- SAE 30 Engine Oil: $\mu \approx 150 - 300\text{ cP}$
- Pure Glycerol: $\mu \approx 1400\text{ cP}$
- Honey: $\mu \approx 10\,000\text{ cP}$
</Callout>

## Related calculators and resources

- [Pipe Pressure Loss Calculator](/en/tools/pipe-pressure-loss)
- [Pump Selection Guide](/en/guides/pompa-turleri-secim-rehberi)
- [Unit Converter](/en/tools/unit-converter)
`
    }
  },
  "voltage": {
    tags: ["gerilim", "voltaj", "elektrik", "Ohm yasası", "üç faz", "motor"],
    category: "Elektrik",
    tr: {
      title: "Elektriksel gerilim (voltaj)",
      description: "Elektriksel potansiyel farkı (Volt), Ohm yasası, tek faz ve üç faz ($400\text{ V}$) sistemler ve elektrik motoru beslemesi.",
      body: `Elektriksel gerilim veya voltaj ($V$ veya $U$), bir elektrik devresinde iki nokta arasında birim elektrik yükünü hareket ettirmek için gereken elektriksel potansiyel farkıdır. SI birim sisteminde birimi Volt [$\text{V}$]'tur.

## Neden önemli?

Elektrik motorlarının mil torku şebeke geriliminin karesiyle orantılıdır ($T \propto V^2$). Gerilimdeki %10'luk bir düşüş motor torkunu yaklaşık %19 düşürerek motorun yük altında sıkışmasına ve aşırı akım çekerek yanmasına sebep olur.

## Mühendislik uygulaması ve standartlar

- **Ohm Yasası:** Gerilim ($V$), akım ($I$) ve direnç ($R$) ilişkisi:
  $$V = I \cdot R$$
- **Üç Fazlı Sanayi Şebekesi (400V / 230V):**
  - Faz-Nötr Gerilimi: $V_{fn} = 230\text{ V}$
  - Faz-Faz (Hat) Gerilimi: $V_{ff} = \sqrt{3} \cdot 230\text{ V} \approx 400\text{ V}$
- **Üç Fazlı Motor Elektrik Gücü:**
  $$P_{elektrik} = \sqrt{3} \cdot V \cdot I \cdot \cos\phi \quad [\text{W}]$$

<Callout type="info" title="Akım ve Gerilim Dengesi">
Güç sabitken ($P = V \cdot I$) gerilim yükseltildiğinde akım düşer. Bu nedenle endüstriyel tesislerde kablo kesitlerini ve ısı kayıplarını düşürmek için 230V yerine 400V üç fazlı besleme tercih edilir.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Güç - Tork - Devir Hesaplayıcı](/tr/tools/torque-power)
- [Birim Dönüştürücü](/tr/tools/unit-converter)
- [Temel Mühendislik Araçları](/tr/tools/basic-engineering)
`
    },
    en: {
      title: "Electrical voltage",
      description: "Electrical potential difference (Volts), Ohm's law, single-phase vs three-phase ($400\text{ V}$) systems, and induction motor torque dependence.",
      body: `Voltage ($V$ or $U$), also known as electric potential difference, is the work required per unit electric charge to move a test charge between two points in a stationary electric field. Quantified in Volts [$\text{V}$].

## Why it matters

In industrial alternating current (AC) motors, starting and breakdown torque scale with the square of applied terminal voltage ($T \propto V^2$). A 10% line voltage drop reduces available motor torque by nearly 19%, risking locked-rotor motor burnout.

## Engineering application & standards

- **Ohm's Law:** Voltage ($V$), current ($I$), and resistance ($R$):
  $$V = I \cdot R$$
- **Three-Phase Industrial Grid (400V / 230V):**
  - Line-to-Neutral Voltage: $V_{L-N} = 230\text{ V}$
  - Line-to-Line Voltage: $V_{L-L} = \sqrt{3} \cdot 230\text{ V} \approx 400\text{ V}$
- **Three-Phase Motor Electrical Power:**
  $$P_{electric} = \sqrt{3} \cdot V_{L-L} \cdot I \cdot \cos\phi \quad [\text{W}]$$

<Callout type="info" title="Efficiency Principle">
For constant power delivery ($P = V \cdot I$), operating at higher system voltage cuts operating current proportionally, drastically reducing conductor $I^2 R$ transmission heat dissipation.
</Callout>

## Related calculators and resources

- [Power - Torque - Speed Calculator](/en/tools/torque-power)
- [Unit Converter](/en/tools/unit-converter)
- [Basic Engineering Tools](/en/tools/basic-engineering)
`
    }
  },
  "welding": {
    tags: ["kaynak", "köşe kaynak", "kaynak dikişi", "Eurocode 3", "HAZ", "birleştirme"],
    category: "İmalat",
    tr: {
      title: "Kaynaklı birleştirme (welding)",
      description: "Kaynak yöntemleri (MIG/MAG, TIG, Elektrot), köşe kaynak dikişi boynu ($a$), ısıdan etkilenen bölge (HAZ) ve kaynak statik dayanım hesabı.",
      body: `Kaynaklı birleştirme (Welding), birbiriyle birleştirilecek metal parçaların temas yüzeylerinin ısı, basınç veya her ikisi birden kullanılarak ilave dolgu teli ile ergitilip atomik bağlar oluşturularak monoblok hale getirilmesi işlemidir.

## Neden önemli?

Çelik yapılarda, vinç kollarında ve basınçlı kaplarda cıvata deliği delmeden ve sızdırmaz şekilde en yüksek mukavemet kaynak dikişleriyle sağlanır. Ancak kaynak dikişindeki gözenekler, cüruf kalıntıları ve çentik etkisi yorulma çatlaklarının en yaygın başlangıç noktasıdır.

## Mühendislik uygulaması ve standartlar

Eurocode 3 (EN 1993-1-8) ve AWS D1.1 standartlarına göre köşe kaynak boyutu:
- **Kaynak Dikiş Boynu (Boğaz Kalınlığı - $a$):** Köşe kaynağının üçgen kesitinde kökten hipotenüse çizilen en kısa dik mesafedir ($a = z \cdot \sin 45^\circ \approx 0.7 \cdot z$).
- **Köşe Kaynak Gerilmesi:**
  $$\tau_{kaynak} = \frac{F}{a \cdot \sum L_{kaynak}} \le f_{vw,d} = \frac{f_u}{\sqrt{3} \cdot \beta_w \cdot \gamma_{M2}}$$
- **Isıdan Etkilenen Bölge (HAZ - Heat Affected Zone):** Kaynak dikişinin hemen yanındaki erimemiş ancak yüksek ısıyla mikroyapısı değişmiş bölgedir; sertleşme ve soğuk çatlak riskine karşı ön ısıtma (preheating) uygulanır.

<Callout type="info" title="Tasarım Kuralı">
Köşe kaynak boyun kalınlığı ($a$) birleştirilen en ince sac kalınlığının en az %70'i olmalı ($a \approx 0.7 \cdot t_{min}$), ancak hiçbir zaman sac kalınlığını aşmamalıdır.
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Köşe Kaynak Boyutlandırma Hesaplayıcı](/tr/tools/fillet-weld)
- [Malzeme Kütüphanesi ve Kaynak Edilebilirlik](/tr/materials)
- [Basit Gerilme Hesaplayıcı](/tr/tools/simple-stress)
`
    },
    en: {
      title: "Welded joints (welding)",
      description: "Fusion welding processes (MIG/MAG, TIG, SMAW), fillet weld effective throat thickness ($a$), Heat Affected Zone (HAZ), and structural strength verification.",
      body: `Welding is a metallurgical joining process wherein contacting workpieces are coalesced into a monolithic continuum through localized melting induced by electric arcs, laser, or friction, typically supplemented with molten filler wire.

## Why it matters

Welding delivers rigid, hermetically sealed, and keyless load-bearing connections for pressure vessels, bridge girders, and machinery frames without requiring fastener clearance holes. However, weld toes act as inherent fatigue notch stress concentrations.

## Engineering application & standards

Governed by Eurocode 3 (EN 1993-1-8) and AWS D1.1 structural welding codes:
- **Fillet Weld Effective Throat Thickness ($a$):** The minimum internal dimension from the root to the hypotenuse face ($a = z \cdot \sin 45^\circ \approx 0.7 \cdot z$, where $z$ is leg length).
- **Fillet Weld Directional Stress Method:**
  $$\tau_{weld} = \frac{F}{a \cdot \sum L_{eff}} \le f_{vw,d} = \frac{f_u}{\sqrt{3} \cdot \beta_w \cdot \gamma_{M2}}$$
- **Heat-Affected Zone (HAZ):** The adjacent unmelted parent metal microstructurally altered by welding thermal cycles; preheating prevents martensitic hardening and delayed hydrogen cracking.

<Callout type="info" title="Design Rule">
Fillet weld throat thickness should typically scale to approximately 70% of the thinner joining plate thickness ($a \approx 0.7 \cdot t_{min}$), avoiding oversized welds that cause severe angular distortion.
</Callout>

## Related calculators and resources

- [Fillet Weld Sizing Calculator](/en/tools/fillet-weld)
- [Materials Library and Weldability](/en/materials)
- [Simple Stress Calculator](/en/tools/simple-stress)
`
    }
  },
  "yield-strength": {
    tags: ["akma mukavemeti", "Rp0.2", "elastik sınır", "plastik deformasyon", "akma gerilmesi"],
    category: "Malzeme",
    tr: {
      title: "Akma mukavemeti (yield strength)",
      description: "Akma mukavemeti ($R_e$, $R_{p0.2}$), kalıcı plastik deformasyon eşiği, çekme diyagramı ve makine tasarımında izin verilen emniyetli gerilme.",
      body: `Akma mukavemeti ($R_e$ veya $R_{p0.2}$), bir malzemenin uygulanan gerilme altında geri dönüşümlü (elastik) şekil değiştirmeden kalıcı (plastik) şekil değiştirmeye geçtiği kritik gerilme sınırıdır.

## Neden önemli?

Makine elemanları (miller, dişliler, flanşlar) çalışma sırasında şekil değiştirmemeli, yük kalktığında orijinal boyutuna dönmelidir. Bu nedenle statik makine tasarımında izin verilen emniyetli gerilme daima akma mukavemetine göre belirlenir.

## Mühendislik uygulaması ve standartlar

ISO 6892 ve ASTM E8 çekme testlerinde:
- **Belirgin Akma Gösteren Çelikler:** Üst akma ($R_{eH}$) ve alt akma ($R_{eL}$) sınırı görülür.
- **Ofset Akma Mukavemeti ($R_{p0.2}$):** Belirgin akma göstermeyen alaşımlarda (paslanmaz çelik, alüminyum) çekme eğrisinde %0.2 (%0.002) kalıcı plastik uzamaya karşılık gelen gerilmedir.
- **Tasarım Emniyet Kriteri:**
  $$\sigma_{em} = \frac{R_{p0.2}}{S_f} \quad (S_f \ge 1.3\dots 2.0)$$

<Callout type="info" title="Çelik Kaliteleri Karşılaştırması">
- Yapı Çeliği (S235JR): $R_e \ge 235\text{ MPa}$
- Islah Çeliği (C45): $R_e \ge 360 - 430\text{ MPa}$
- Yüksek Mukavemetli Alaşımlı Çelik (42CrMo4): $R_e \ge 650 - 900\text{ MPa}$
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Basit Gerilme ve Güvenlik Faktörü](/tr/tools/simple-stress)
- [Cıvata Mukavemeti ve Tork Hesabı](/tr/tools/bolt-calculator)
- [Malzeme Kütüphanesi ve Dayanım Değerleri](/tr/materials)
`
    },
    en: {
      title: "Yield strength",
      description: "Material yield strength ($R_e$, $R_{p0.2}$), onset of irreversible plastic deformation, stress-strain curves, and allowable working stress design.",
      body: `Yield strength ($R_e$ or $R_{p0.2}$ / $S_y$) is the fundamental engineering stress threshold marking the boundary between reversible linear elastic behavior and irreversible permanent plastic deformation during mechanical loading.

## Why it matters

Mechanical components (shafts, structural brackets, gears, fasteners) must not deform permanently under operational duty cycles. Consequently, structural sizing and factors of safety are calibrated against yield strength.

## Engineering application & standards

Governed by ASTM E8 and ISO 6892-1:
- **Discontinuous Yielding:** Mild carbon steels exhibit distinct upper ($R_{eH}$) and lower ($R_{eL}$) yield points due to interstitial carbon dislocation pinning.
- **0.2% Offset Proof Stress ($R_{p0.2}$):** For continuous-yielding alloys (austenitic stainless steels, structural aluminum), proof stress is determined by drawing a line parallel to the elastic slope offset by 0.2% plastic strain ($\varepsilon = 0.002$).
- **Working Stress Formulation:**
  $$\sigma_{allow} = \frac{S_y}{S_f} \quad (S_f \ge 1.3\dots 2.0)$$

<Callout type="info" title="Alloy Yield Benchmarks">
- Structural Steel (EN 10025 S235): $S_y \ge 235\text{ MPa}$
- Quenched & Tempered Medium Carbon (C45): $S_y \ge 360 - 430\text{ MPa}$
- High-Tensile CrMo Alloy (42CrMo4 / AISI 4140): $S_y \ge 650 - 900\text{ MPa}$
</Callout>

## Related calculators and resources

- [Simple Stress and Factor of Safety](/en/tools/simple-stress)
- [Bolt Strength and Preload Calculator](/en/tools/bolt-calculator)
- [Materials Library and Mechanical Properties](/en/materials)
`
    }
  },
  "youngs-modulus": {
    tags: ["elastisite modülü", "Young modülü", "rijitlik", "Hooke yasası", "sehim"],
    category: "Malzeme",
    tr: {
      title: "Elastisite modülü (Young modülü)",
      description: "Young elastisite modülü ($E$), malzemenin elastik rijitliği, Hooke yasası ($\sigma = E \cdot \varepsilon$), kiriş sehimi ve malzeme karşılaştırması.",
      body: `Elastisite modülü veya Young modülü ($E$), bir malzemenin elastik gerilme altında boyutsal deformasyona karşı gösterdiği iç rijitlik veya esnemezlik katsayısıdır. Hooke yasasının orantı sabitidir ($E = \sigma / \varepsilon$). SI birim sisteminde Gigapaskal [$\text{GPa}$] veya [$\text{N/mm}^2$] olarak ifade edilir.

## Neden önemli?

Isıl işlem veya alaşımlama çeliğin akma dayanımını 3 kat artırabilir; ancak elastisite modülünü zerre kadar değiştirmez ($E \approx 210\text{ GPa}$ sabit kalır). Bir milin sehimini ve rijitliğini belirleyen tek şey malzemenin $E$ modülü ve kesit atalet momentidir ($I$).

## Mühendislik uygulaması ve standartlar

- **Hooke Yasası:** Tek eksenli gerilme altında:
  $$\sigma = E \cdot \varepsilon \implies \Delta L = \frac{F \cdot L_0}{E \cdot A}$$
- **Kiriş Sehimi Formülü:** Konsol bir kirişte sehim doğrudan $E$ modülüyle ters orantılıdır:
  $$f = \frac{F \cdot L^3}{3 \cdot E \cdot I}$$
- **Malzemelerin Tipik Elastisite Modülleri:**
  - Karbon ve Alaşımlı Çelikler: $E \approx 200 - 210\text{ GPa}$
  - Titanyum Alaşımları (Ti-6Al-4V): $E \approx 110 - 114\text{ GPa}$ (Çeliğin yaklaşık yarısı)
  - Alüminyum Alaşımları: $E \approx 70\text{ GPa}$ (Çeliğin üçte biri)
  - Gri Dökme Demir: $E \approx 100 - 120\text{ GPa}$
  - Plastikler (PA6, POM): $E \approx 2.5 - 3.5\text{ GPa}$

<Callout type="info" title="Tasarım Karşılaştırması">
Çelik bir mili aynı geometriye sahip alüminyum bir mil ile değiştirirseniz, aynı yük altında alüminyum mil tam **3 kat daha fazla sehim** yapar!
</Callout>

## İlgili hesaplayıcılar ve kaynaklar

- [Eğilme Gerilmesi ve Kiriş Sehimi](/tr/tools/bending-stress)
- [Basit Gerilme Hesaplayıcı](/tr/tools/simple-stress)
- [Malzeme Kütüphanesi ve Rijitlik Değerleri](/tr/materials)
`
    },
    en: {
      title: "Young's modulus of elasticity",
      description: "Young's modulus ($E$), material elastic stiffness, Hooke's law ($\sigma = E \cdot \varepsilon$), structural beam deflection, and alloy comparisons.",
      body: `Young's Modulus of Elasticity ($E$) is the fundamental mechanical property that quantifies the intrinsic elastic stiffness or resistance of a solid material to elastic elongation under applied tensile or compressive normal stress ($E = \sigma / \varepsilon$). Measured in Gigapascals [$\text{GPa}$].

## Why it matters

Heat treatment and alloying can triple a steel's yield strength, but leave Young's Modulus completely unchanged ($E \approx 210\text{ GPa}$). Shaft deflection, structural rigidity, and vibrational frequencies are strictly dictated by $E$ and area moment of inertia ($I$).

## Engineering application & standards

- **Hooke's Constitutive Law:**
  $$\sigma = E \cdot \varepsilon \implies \Delta L = \frac{F \cdot L_0}{E \cdot A}$$
- **Flexural Beam Deflection:** In structural beam mechanics, deflection scales inversely with flexural rigidity ($E \cdot I$):
  $$f = \frac{F \cdot L^3}{3 \cdot E \cdot I}$$
- **Benchmark Alloy Moduli:**
  - Carbon and Alloy Steels: $E \approx 200 - 210\text{ GPa}$
  - Titanium Grade 5 (Ti-6Al-4V): $E \approx 110 - 114\text{ GPa}$ (~50% of steel)
  - Structural Aluminum (6061, 7075): $E \approx 70\text{ GPa}$ (~33% of steel)
  - Gray Cast Iron: $E \approx 100 - 120\text{ GPa}$
  - Engineering Thermoplastics: $E \approx 2.5 - 3.5\text{ GPa}$

<Callout type="info" title="Engineering Comparison">
Swapping a steel spindle with an aluminum component of identical geometry causes the shaft to deflect **three times more** under identical operational cutting forces.
</Callout>

## Related calculators and resources

- [Bending Stress and Deflection Calculator](/en/tools/bending-stress)
- [Simple Stress Calculator](/en/tools/simple-stress)
- [Materials Library and Elasticity](/en/materials)
`
    }
  }
};
