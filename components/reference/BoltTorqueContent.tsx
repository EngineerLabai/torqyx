import Link from "next/link";
import type { Locale } from "@/utils/locale";
import { withLocalePrefix } from "@/utils/locale-path";

type BoltTorqueContentProps = {
  locale: Locale;
};

export default function BoltTorqueContent({ locale }: BoltTorqueContentProps) {
  if (locale === "tr") {
    return (
      <article className="prose prose-slate max-w-none space-y-10 text-slate-700">
        {/* Section 1: Theory and Fundamentals */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Cıvata Sıkma Torku ve Eksenel Ön Yük Dinamiği
          </h2>
          <p className="leading-relaxed text-sm sm:text-base">
            Mekanik montajlarda cıvatanın birincil görevi, birleştirilen parçaları işletme sırasında ayrılmayacak ve kaymayacak şekilde birbirine bastırmaktır. Bir cıvatayı tork anahtarı ile döndürdüğümüzde uyguladığımız döndürme momenti (tork), vida dişlerinin helisel geometrisi ve sürtünme yüzeyleri üzerinden eksenel bir çekme kuvvetine (<strong>ön yük kuvveti, F<sub>v</sub></strong>) dönüştürülür.
          </p>
          <p className="leading-relaxed text-sm sm:text-base">
            Mühendislik uygulamalarında tork ile ön yük arasındaki temel bağıntı ampirik <strong>Somun Faktörü (Nut Factor / K Katsayısı)</strong> formülü ile ifade edilir:
          </p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 font-mono text-center text-sm sm:text-base text-slate-900 shadow-inner">
            T = K · F<sub>v</sub> · d
          </div>
          <p className="leading-relaxed text-sm sm:text-base">
            Burada <strong>T</strong> sıkma torku (N·m), <strong>K</strong> boyutsuz tork katsayısı, <strong>F<sub>v</sub></strong> eksenel ön yük kuvveti (N) ve <strong>d</strong> cıvatanın nominal anma çapıdır (metre cinsinden).
          </p>
          <div className="rounded-xl border-l-4 border-emerald-500 bg-emerald-50/50 p-4 text-xs sm:text-sm text-slate-700">
            <p className="font-semibold text-emerald-950">Uygulanan Tork Nereye Gider?</p>
            <p className="mt-1 leading-relaxed">
              Standart bir metrik cıvata sıkılırken uygulanan toplam torkun yalnızca yaklaşık <strong>%10 ila %15&apos;i</strong> cıvatayı eksenel olarak gererek faydalı ön yüke dönüşür. Kalan enerjinin yaklaşık <strong>%50&apos;si cıvata başı veya somun altı sürtünmesinde</strong>, yaklaşık <strong>%40&apos;ı ise vida dişlerindeki helisel sürtünmede</strong> ısıya dönüşerek kaybolur. Bu nedenle sürtünme katsayısındaki en ufak bir değişim cıvataya binen ön yükü dramatik biçimde etkiler.
            </p>
          </div>
        </section>

        {/* Section 2: K-Factor & Lubrication */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Sürtünme Durumu ve K Katsayısı: Kuru vs. Yağlı Montaj
          </h2>
          <p className="leading-relaxed text-sm sm:text-base">
            Tork katsayısı (K), tek başına klasik Coulomb sürtünme katsayısı (&mu;) değildir; diş helis açısını, cıvata başı oturma geometrisini ve diş temas yüzeylerindeki mikroskobik sürtünmeleri tek bir ampirik katsayıda birleştiren bileşik bir parametredir:
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
              <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                K = 0.25 (Kuru Montaj)
              </span>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Temizlenmiş, yağsız veya galvanizli çelik yüzeyler. Yüksek sürtünme nedeniyle aynı ön yükü oluşturmak için daha yüksek tork gerekir.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
              <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                K = 0.20 (Hafif Yağlı)
              </span>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Makine imalatında en sık karşılaşılan durum. İnce mineral yağ veya korozyon koruyucu film içeren standart bağlantı elemanları.
              </p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
              <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                K = 0.18 (Kaplamalı / Yağlayıcılı)
              </span>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Molibden disülfit (MoS₂), PTFE, grafitli montaj pastası veya fosfat kaplı özel düşük sürtünmeli yüzeyler.
              </p>
            </div>
          </div>
          <div className="rounded-xl border-l-4 border-rose-500 bg-rose-50/60 p-4 text-xs sm:text-sm text-slate-800">
            <p className="font-bold text-rose-950">Kritik Mühendislik Uyarısı: Yağlı Cıvatada Aşırı Gerilme Riski</p>
            <p className="mt-1 leading-relaxed">
              Kuru cıvata için belirlenmiş tork değerini (K = 0.25) yanlışlıkla yağlanmış bir cıvataya (K = 0.20) uygularsanız, sürtünme azaldığı için torkun çok daha büyük bir bölümü eksenel kuvvete dönüşür. Cıvatada <strong>%25 daha yüksek ön yük kuvveti</strong> meydana gelir. Bu durum cıvatanın akma sınırını aşmasına, vida dişlerinin sıyrılmasına veya montaj esnasında cıvatanın kopmasına yol açabilir!
            </p>
          </div>
        </section>

        {/* Section 3: ISO 898-1 Classes */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            ISO 898-1 Mukavemet Sınıfları (8.8, 10.9, 12.9)
          </h2>
          <p className="leading-relaxed text-sm sm:text-base">
            Metrik cıvataların başlarında kabartma olarak basılan kalite sınıfları (8.8, 10.9, 12.9), malzemenin mekanik dayanım sınırlarını tanımlar:
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Kalite Sınıfı</th>
                  <th className="px-4 py-2.5">Çekme Dayanımı R<sub>m</sub> [MPa]</th>
                  <th className="px-4 py-2.5">Akma Dayanımı R<sub>e</sub> [MPa]</th>
                  <th className="px-4 py-2.5">%70 Ön Yük Gerilmesi [MPa]</th>
                  <th className="px-4 py-2.5">Tipik Kullanım Alanı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-2.5 font-bold text-blue-700">8.8</td>
                  <td className="px-4 py-2.5 font-mono">800</td>
                  <td className="px-4 py-2.5 font-mono">640</td>
                  <td className="px-4 py-2.5 font-mono font-semibold">448</td>
                  <td className="px-4 py-2.5 text-slate-600">Genel makine imalatı, şaseler, flanşlar</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-bold text-purple-700">10.9</td>
                  <td className="px-4 py-2.5 font-mono">1000</td>
                  <td className="px-4 py-2.5 font-mono">940</td>
                  <td className="px-4 py-2.5 font-mono font-semibold">658</td>
                  <td className="px-4 py-2.5 text-slate-600">Otomotiv yürüyen aksam, motor blokları, ağır makineler</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-bold text-rose-700">12.9</td>
                  <td className="px-4 py-2.5 font-mono">1200</td>
                  <td className="px-4 py-2.5 font-mono">1100</td>
                  <td className="px-4 py-2.5 font-mono font-semibold">770</td>
                  <td className="px-4 py-2.5 text-slate-600">Yüksek dinamik ve darbe yükleri, presler, hidrolik kafalar</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            * Sayısal gösterimde ilk rakam (örn. 8), 100 ile çarpılarak nominal çekme dayanımını (800 MPa); ikinci rakam (0.8) ise akma dayanımının çekme dayanımına oranını (%80 &rarr; 640 MPa) verir.
          </p>
        </section>

        {/* Section 4: Worked Example */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Çözümlü Mühendislik Örneği: M12 8.8 Cıvata Tork Hesabı
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <p className="text-sm font-semibold text-slate-900">
              Soru: Nominal çapı d = 12 mm, hatvesi P = 1.75 mm olan 8.8 kalite bir metrik kaba adımlı cıvatanın akma sınırının %70&apos;i ile sıkılması hedeflenmektedir. Etkin gerilme alanını (A<sub>s</sub>), hedeflenen eksenel ön yükü (F<sub>v</sub>) ve kuru (K=0.25) ile hafif yağlı (K=0.20) durumlar için gereken sıkma torklarını hesaplayınız.
            </p>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">1. Adım: ISO 898-1 Etkin Gerilme Alanı (A<sub>s</sub>) Hesabı</p>
                <p className="mt-1 font-mono text-slate-700">
                  A<sub>s</sub> = (&pi; / 4) · (d - 0.9382 · P)<sup>2</sup>
                </p>
                <p className="mt-1 font-mono text-slate-700">
                  A<sub>s</sub> = (&pi; / 4) · (12 - 0.9382 · 1.75)<sup>2</sup> = (&pi; / 4) · (10.358)<sup>2</sup> = <strong>84.27 mm²</strong>
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">2. Adım: Eksenel Ön Yük Kuvveti (F<sub>v</sub>) Hesabı</p>
                <p className="mt-1 text-slate-600">
                  8.8 kalite cıvata için akma dayanımı R<sub>e</sub> = 640 MPa. %70 akma hedefiyle:
                </p>
                <p className="mt-1 font-mono text-slate-700">
                  F<sub>v</sub> = 0.70 · R<sub>e</sub> · A<sub>s</sub> = 0.70 · 640 N/mm² · 84.27 mm² = 37,752.4 N = <strong>37.75 kN</strong>
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">3. Adım: Sıkma Torku Hesabı (Kuru vs. Yağlı)</p>
                <p className="mt-1 text-slate-600">Formül: T = K · F<sub>v</sub> · (d / 1000)</p>
                <ul className="mt-2 space-y-1 font-mono text-slate-700 list-disc list-inside">
                  <li>
                    <strong>Kuru Montaj (K = 0.25):</strong> T = 0.25 · 37,752.4 N · 0.012 m = <strong>113.26 N·m</strong>
                  </li>
                  <li>
                    <strong>Hafif Yağlı (K = 0.20):</strong> T = 0.20 · 37,752.4 N · 0.012 m = <strong>90.61 N·m</strong>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs text-slate-700">
              <strong>Mühendislik Yorumu:</strong> Yağlama sürtünmeyi düşürdüğü için, aynı 37.75 kN ön yükü elde etmek adına gereken sıkma torku 113.3 N·m&apos;den 90.6 N·m&apos;ye (%20 oranında) azalmıştır. Bu değer tablomuzdaki M12 satırıyla ve TORQYX Bolt Calculator çıktısıyla birebir örtüşmektedir.
            </div>
          </div>
        </section>

        {/* Section 5: Common Pitfalls */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Cıvata Montajında Sık Yapılan 5 Kritik Hata
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-bold text-rose-600">1. Hata: Sürtünme Durumunu Görmezden Gelmek</span>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Kuru tork değerini yağlı cıvataya veya yağlı tork değerini kuru cıvataya uygulamak. Kuru cıvataya yağlı tork verilirse ön yük yetersiz kalır ve cıvata yorulma kırılmasına uğrar; tersi durumda cıvata akar veya kopar.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-bold text-rose-600">2. Hata: Tork Anahtarının Yanlış Aralığında Çalışmak</span>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Tork anahtarları kapasitelerinin en alt (%20 altı) veya en üst sınırlarında yüksek ölçüm belirsizliği (&plusmn;%15-25) taşır. En yüksek hassasiyet anahtarın kapasitesinin %20 ile %80 aralığında elde edilir.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-bold text-rose-600">3. Hata: Yerleşme (Settlement) Kayıplarını Unutmak</span>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Montaj sonrası temas yüzeylerindeki mikroskobik pürüzlülüklerin plastik olarak ezilmesi nedeniyle ilk birkaç saat içinde cıvata ön yükünün %5 ila %15&apos;i kaybolur. Kritik flanş ve motor bağlantılarında kademeli ve yeniden sıkma (retorque) zorunludur.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-xs font-bold text-rose-600">4. Hata: İnce ve Kaba Adımı Karıştırmak</span>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                İnce adım cıvataların diş derinliği daha sığ olduğu için çekirdek kesit alanı (A<sub>s</sub>) daha büyüktür. Bu durum aynı akma gerilmesinde daha yüksek ön yük ve farklı tork gerektirir.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
              <span className="text-xs font-bold text-rose-600">5. Hata: Sıvı Diş Tutucuların (Loctite vb.) Yağlayıcı Etkisini Unutmak</span>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Anaerobik vida sabitleyiciler (Loctite vb.) sıvı haldeyken güçlü bir yağlayıcı gibi davranır ve tork katsayısını K &approx; 0.16 - 0.18 bandına düşürür. Diş tutucu sürülen cıvatalarda kuru tork tablosu kullanılırsa bağlantı aşırı gerilir.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Related Tools and Guides */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            İlgili Mühendislik Araçları ve Kılavuzlar
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href={withLocalePrefix("/tools/bolt-calculator", "tr")}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
            >
              <span className="text-xs font-bold text-emerald-700">Hesaplama Aracı</span>
              <p className="mt-1 text-sm font-semibold text-slate-900">Cıvata Boyut ve Ön Yük Hesaplayıcı</p>
              <p className="mt-1 text-xs text-slate-500">
                Özel hatve, malzeme sınıfı, %Re ön yük oranı ve audit trail adımlarıyla dinamik cıvata analizi.
              </p>
            </Link>

            <Link
              href={withLocalePrefix("/blog/civata-on-yuku-vdi-2230", "tr")}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
            >
              <span className="text-xs font-bold text-blue-700">Mühendislik Makalesi</span>
              <p className="mt-1 text-sm font-semibold text-slate-900">Cıvata Ön Yükü ve VDI 2230 Standardı</p>
              <p className="mt-1 text-xs text-slate-500">
                Sistematik cıvata hesaplama metodolojisi, bağlantı rijitlikleri ve gömülme analizleri.
              </p>
            </Link>

            <Link
              href={withLocalePrefix("/blog/tork-katsayisi-k-faktoru-nedir", "tr")}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
            >
              <span className="text-xs font-bold text-purple-700">Teknik Rehber</span>
              <p className="mt-1 text-sm font-semibold text-slate-900">Tork Katsayısı (K Faktörü) Nedir?</p>
              <p className="mt-1 text-xs text-slate-500">
                Somun faktörü, diş sürtünmesi ve baş altı sürtünme modellerinin detaylı karşılaştırması.
              </p>
            </Link>

            <Link
              href={withLocalePrefix("/blog/civata-mukavemet-siniflari-8-8-10-9-12-9", "tr")}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
            >
              <span className="text-xs font-bold text-amber-700">Malzeme Standartları</span>
              <p className="mt-1 text-sm font-semibold text-slate-900">Cıvata Mukavemet Sınıfları (8.8, 10.9, 12.9)</p>
              <p className="mt-1 text-xs text-slate-500">
                Çekme dayanımı, akma dayanımı ve cıvata seçimi için mühendislik kriterleri.
              </p>
            </Link>

            <Link
              href={withLocalePrefix("/blog/iso-898-1-civata-standartlari", "tr")}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
            >
              <span className="text-xs font-bold text-slate-700">Standart İncelemesi</span>
              <p className="mt-1 text-sm font-semibold text-slate-900">ISO 898-1 Bağlantı Elemanı Mekaniği</p>
              <p className="mt-1 text-xs text-slate-500">
                Karbon çeliği ve alaşımlı cıvataların mekanik özellikleri, çekme testleri ve toleransları.
              </p>
            </Link>

            <Link
              href={withLocalePrefix("/guides/civata-basi-sekilleri-ve-turleri", "tr")}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
            >
              <span className="text-xs font-bold text-teal-700">Tasarım Rehberi</span>
              <p className="mt-1 text-sm font-semibold text-slate-900">Cıvata Başı Şekilleri ve Türleri</p>
              <p className="mt-1 text-xs text-slate-500">
                Altıköşe, alyan, havşa başlı ve flanşlı cıvata tasarımlarının kuvvet iletim özellikleri.
              </p>
            </Link>
          </div>
        </section>
      </article>
    );
  }

  // English version
  return (
    <article className="prose prose-slate max-w-none space-y-10 text-slate-700">
      {/* Section 1: Theory and Fundamentals */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Bolt Tightening Torque and Clamping Preload Mechanics
        </h2>
        <p className="leading-relaxed text-sm sm:text-base">
          In mechanical assemblies, the primary function of a threaded fastener is to clamp mating components together so firmly that they resist joint separation, sliding, and fatigue opening under cyclic service loads. When a torque wrench applies torsional moment to a bolt head or nut, helical thread incline converts rotational torque into axial tension (<strong>clamping preload force, F<sub>v</sub></strong>).
        </p>
        <p className="leading-relaxed text-sm sm:text-base">
          In standard mechanical engineering practice, the relationship between applied torque and developed preload is governed by the empirical <strong>Nut Factor (K-Factor) equation</strong>:
        </p>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 font-mono text-center text-sm sm:text-base text-slate-900 shadow-inner">
          T = K · F<sub>v</sub> · d
        </div>
        <p className="leading-relaxed text-sm sm:text-base">
          Where <strong>T</strong> is tightening torque (N·m), <strong>K</strong> is the dimensionless torque factor, <strong>F<sub>v</sub></strong> is the axial clamp load (N), and <strong>d</strong> is the nominal bolt diameter (in meters).
        </p>
        <div className="rounded-xl border-l-4 border-emerald-500 bg-emerald-50/50 p-4 text-xs sm:text-sm text-slate-700">
          <p className="font-semibold text-emerald-950">Where Does the Applied Torque Actually Go?</p>
          <p className="mt-1 leading-relaxed">
            During standard metric bolt tightening, only approximately <strong>10% to 15%</strong> of the applied torque is converted into useful axial clamp load. Roughly <strong>50% is consumed overcoming underhead or washer friction</strong>, and another <strong>40% is dissipated as thread flank friction</strong>. Consequently, minor fluctuations in friction coefficients generate dramatic variations in clamp force.
          </p>
        </div>
      </section>

      {/* Section 2: K-Factor & Lubrication */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Friction Conditions and the K-Factor: Dry vs. Lubricated Assembly
        </h2>
        <p className="leading-relaxed text-sm sm:text-base">
          The torque factor (K) is not an isolated Coulomb friction coefficient (&mu;); it is a lumped empirical constant combining thread pitch helix angle, underhead contact radius, and interface friction coefficients:
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
            <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
              K = 0.25 (Dry / As-Received)
            </span>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Degreased, dry, or zinc-plated steel fasteners. Higher contact friction necessitates greater tightening torque to achieve the target preload.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
            <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
              K = 0.20 (Lightly Oiled)
            </span>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              The universal standard baseline for general machine manufacturing. Standard fasteners coated with rust-preventative oil film or light mineral oil.
            </p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
            <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
              K = 0.18 (Coated / Anti-Seize)
            </span>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Fasteners lubricated with molybdenum disulfide (MoS₂), PTFE pastes, phosphate coatings, or anti-seize compounds.
            </p>
          </div>
        </div>
        <div className="rounded-xl border-l-4 border-rose-500 bg-rose-50/60 p-4 text-xs sm:text-sm text-slate-800">
          <p className="font-bold text-rose-950">Critical Safety Warning: Danger of Over-Torquing Lubricated Fasteners</p>
          <p className="mt-1 leading-relaxed">
            Applying dry tightening torque (K = 0.25) to a lubricated bolt (K = 0.20) causes <strong>25% higher axial preload force</strong> than intended. This excessive stress frequently pushes the fastener past its proof strength into permanent plastic deformation or triggers catastrophic bolt fracture during torquing!
          </p>
        </div>
      </section>

      {/* Section 3: ISO 898-1 Classes */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          ISO 898-1 Property Classes (8.8, 10.9, 12.9)
        </h2>
        <p className="leading-relaxed text-sm sm:text-base">
          Metric property classes stamped on bolt heads specify the metallurgical strength limits under ISO 898-1:
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Property Class</th>
                <th className="px-4 py-2.5">Tensile Strength R<sub>m</sub> [MPa]</th>
                <th className="px-4 py-2.5">Yield Strength R<sub>e</sub> [MPa]</th>
                <th className="px-4 py-2.5">70% Preload Stress [MPa]</th>
                <th className="px-4 py-2.5">Typical Applications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-2.5 font-bold text-blue-700">8.8</td>
                <td className="px-4 py-2.5 font-mono">800</td>
                <td className="px-4 py-2.5 font-mono">640</td>
                <td className="px-4 py-2.5 font-mono font-semibold">448</td>
                <td className="px-4 py-2.5 text-slate-600">General industrial machinery, structural steel frames, pipe flanges</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-bold text-purple-700">10.9</td>
                <td className="px-4 py-2.5 font-mono">1000</td>
                <td className="px-4 py-2.5 font-mono">940</td>
                <td className="px-4 py-2.5 font-mono font-semibold">658</td>
                <td className="px-4 py-2.5 text-slate-600">Automotive chassis, powertrain mounts, heavy construction equipment</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-bold text-rose-700">12.9</td>
                <td className="px-4 py-2.5 font-mono">1200</td>
                <td className="px-4 py-2.5 font-mono">1100</td>
                <td className="px-4 py-2.5 font-mono font-semibold">770</td>
                <td className="px-4 py-2.5 text-slate-600">High dynamic fatigue joints, industrial presses, hydraulic cylinder heads</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          * In metric class designations, the first digit multiplied by 100 defines nominal tensile strength (8 &times; 100 = 800 MPa); the second digit defines the yield ratio (80% &rarr; 640 MPa).
        </p>
      </section>

      {/* Section 4: Worked Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Worked Engineering Example: M12 Class 8.8 Torque Calculation
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <p className="text-sm font-semibold text-slate-900">
            Problem: Calculate the tensile stress area (A<sub>s</sub>), target preload force (F<sub>v</sub> at 70% yield), and required tightening torques for dry (K=0.25) and lightly oiled (K=0.20) conditions for an M12 &times; 1.75 coarse pitch Class 8.8 metric bolt.
          </p>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">Step 1: Tensile Stress Area (A<sub>s</sub>) per ISO 898-1</p>
              <p className="mt-1 font-mono text-slate-700">
                A<sub>s</sub> = (&pi; / 4) · (d - 0.9382 · P)<sup>2</sup>
              </p>
              <p className="mt-1 font-mono text-slate-700">
                A<sub>s</sub> = (&pi; / 4) · (12 - 0.9382 · 1.75)<sup>2</sup> = (&pi; / 4) · (10.358)<sup>2</sup> = <strong>84.27 mm²</strong>
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">Step 2: Axial Clamp Preload Force (F<sub>v</sub>)</p>
              <p className="mt-1 text-slate-600">
                For Class 8.8 steel, yield strength R<sub>e</sub> = 640 MPa. Targeting 70% yield:
              </p>
              <p className="mt-1 font-mono text-slate-700">
                F<sub>v</sub> = 0.70 · R<sub>e</sub> · A<sub>s</sub> = 0.70 · 640 N/mm² · 84.27 mm² = 37,752.4 N = <strong>37.75 kN</strong>
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">Step 3: Tightening Torque Determination (Dry vs. Oiled)</p>
              <p className="mt-1 text-slate-600">Formula: T = K · F<sub>v</sub> · (d / 1000)</p>
              <ul className="mt-2 space-y-1 font-mono text-slate-700 list-disc list-inside">
                <li>
                  <strong>Dry Assembly (K = 0.25):</strong> T = 0.25 · 37,752.4 N · 0.012 m = <strong>113.26 N·m</strong>
                </li>
                <li>
                  <strong>Lightly Oiled (K = 0.20):</strong> T = 0.20 · 37,752.4 N · 0.012 m = <strong>90.61 N·m</strong>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs text-slate-700">
            <strong>Engineering Takeaway:</strong> Lubrication reduces required tightening torque from 113.3 N·m to 90.6 N·m (a 20% reduction) while achieving the exact same 37.75 kN clamping force. This matches our reference table and the TORQYX Bolt Calculator output with full mathematical precision.
          </div>
        </div>
      </section>

      {/* Section 5: Common Pitfalls */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          5 Common Bolted Joint Torque Pitfalls
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-bold text-rose-600">Pitfall 1: Ignoring Surface Lubrication</span>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Applying dry torque specifications to oiled fasteners severely over-stresses threads, leading to bolt necking or stripping. Conversely, applying oiled specs to dry bolts results in insufficient clamp force and subsequent fatigue loosening.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-bold text-rose-600">Pitfall 2: Operating Outside Torque Wrench Calibration Band</span>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Mechanical click torque wrenches exhibit substantial error (&plusmn;15% to 25%) below 20% of full-scale capacity. Always select tools operating in their certified 20% to 80% range.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-bold text-rose-600">Pitfall 3: Neglecting Joint Embedding and Relaxation</span>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Microscopic surface asperities collapse under compressive contact stress, causing 5% to 15% preload decay within hours after initial assembly. Critical structural joints require multi-stage torque sequences and retightening.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-bold text-rose-600">Pitfall 4: Conflating Coarse and Fine Pitches</span>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Fine pitch threads possess shallower thread depths and higher tensile stress areas (A<sub>s</sub>), demanding higher preload forces and specific tightening torque values compared to coarse threads of the same diameter.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
            <span className="text-xs font-bold text-rose-600">Pitfall 5: Overlooking Threadlocker Lubrication Effects</span>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Liquid anaerobic threadlockers (e.g. Loctite) act as potent lubricants before curing, lowering the effective torque factor to K &approx; 0.16 - 0.18. Using dry torque values on threadlocked fasteners will dramatically overload the joint.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Related Tools and Guides */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Related Engineering Calculators and Guides
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href={withLocalePrefix("/tools/bolt-calculator", "en")}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
          >
            <span className="text-xs font-bold text-emerald-700">Interactive Calculator</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">Bolt Size &amp; Preload Calculator</p>
            <p className="mt-1 text-xs text-slate-500">
              Compute stress area, custom preload %Re, safety factors, and complete calculation audit trails.
            </p>
          </Link>

          <Link
            href={withLocalePrefix("/blog/civata-on-yuku-vdi-2230", "en")}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
          >
            <span className="text-xs font-bold text-blue-700">Engineering Article</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">Bolt Preload and VDI 2230 Standard</p>
            <p className="mt-1 text-xs text-slate-500">
              Systematic bolted joint calculation methodology, resilience diagrams, and embedding losses.
            </p>
          </Link>

          <Link
            href={withLocalePrefix("/blog/tork-katsayisi-k-faktoru-nedir", "en")}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
          >
            <span className="text-xs font-bold text-purple-700">Technical Guide</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">What is the Nut Factor (K-Factor)?</p>
            <p className="mt-1 text-xs text-slate-500">
              In-depth breakdown of torque factor, thread friction, and underhead bearing friction models.
            </p>
          </Link>

          <Link
            href={withLocalePrefix("/blog/civata-mukavemet-siniflari-8-8-10-9-12-9", "en")}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
          >
            <span className="text-xs font-bold text-amber-700">Fastener Standards</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">Bolt Property Classes 8.8, 10.9, 12.9</p>
            <p className="mt-1 text-xs text-slate-500">
              Tensile strength, proof loads, and engineering selection criteria for industrial fasteners.
            </p>
          </Link>

          <Link
            href={withLocalePrefix("/blog/iso-898-1-civata-standartlari", "en")}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
          >
            <span className="text-xs font-bold text-slate-700">Standard Analysis</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">ISO 898-1 Fastener Mechanics</p>
            <p className="mt-1 text-xs text-slate-500">
              Mechanical properties of carbon steel and alloy steel fasteners, tensile test methods, and tolerances.
            </p>
          </Link>

          <Link
            href={withLocalePrefix("/guides/civata-basi-sekilleri-ve-turleri", "en")}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
          >
            <span className="text-xs font-bold text-teal-700">Design Guide</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">Bolt Head Types and Shapes</p>
            <p className="mt-1 text-xs text-slate-500">
              Hexagon head, socket head cap, countersunk, and flanged bolt head geometries and force distribution.
            </p>
          </Link>
        </div>
      </section>
    </article>
  );
}
