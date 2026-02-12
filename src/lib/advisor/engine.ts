import type { Locale } from "@/utils/locale";

export type AdvisorSeverity = "info" | "warn" | "critical";

export type AdvisorInsight = {
  severity: AdvisorSeverity;
  title: string;
  message: string;
  actionHref?: string;
};

type AdvisorContext = {
  locale: Locale;
  reportUrl?: string;
};

const t = (locale: Locale, tr: string, en: string) => (locale === "tr" ? tr : en);

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const toString = (value: unknown) => (value === null || value === undefined ? "" : String(value));

export function getAdvisorInsights(
  toolId: string,
  inputs: Record<string, unknown> | null,
  context: AdvisorContext,
): AdvisorInsight[] {
  if (!inputs) return [];
  const locale = context.locale;
  const insights: AdvisorInsight[] = [];

  if (toolId === "bolt-calculator") {
    const preload = toNumber(inputs.preloadPercent);
    const friction = toString(inputs.friction);
    const grade = toString(inputs.grade);
    const presetId = toString(inputs.presetId);

    if (!friction) {
      insights.push({
        severity: "warn",
        title: t(locale, "Sürtünme durumu eksik", "Friction condition is missing"),
        message: t(
          locale,
          "Sürtünme seçilmezse tork tahmini sapabilir. Kuru/yağlı/kaplamalı seçimi yap.",
          "Torque estimates can drift without a friction assumption. Choose dry/oiled/coated.",
        ),
        actionHref: "/standards/threads",
      });
    }

    if (preload !== null && (preload < 50 || preload > 90)) {
      insights.push({
        severity: "warn",
        title: t(locale, "Ön yük tipik aralık dışında", "Preload outside typical range"),
        message: t(
          locale,
          "Tipik ön yük %50–90 Re aralığındadır. Daha düşük değerler gevşemeye, yüksek değerler akmaya yaklaşabilir.",
          "Typical preload sits around 50–90% of Re. Lower values may loosen; higher values can approach yielding.",
        ),
        actionHref: "/standards/threads",
      });
    }

    if (grade === "12.9" && preload !== null && preload < 60) {
      insights.push({
        severity: "info",
        title: t(locale, "Yüksek kalite – düşük ön yük", "High grade with low preload"),
        message: t(
          locale,
          "12.9 kalite için düşük ön yük seçildi. Civata sınıfını ve çalışma koşullarını doğrula.",
          "A low preload was set for grade 12.9. Verify the bolt class and service conditions.",
        ),
      });
    }

    if (presetId === "custom") {
      insights.push({
        severity: "info",
        title: t(locale, "Özel ölçü seçildi", "Custom size selected"),
        message: t(
          locale,
          "Standart dışı ölçülerde diş profili ve toleransları çizim/standartla doğrula.",
          "For custom dimensions, confirm thread profile and tolerances with the drawing/standard.",
        ),
        actionHref: "/standards/threads",
      });
    }
  }

  if (toolId === "torque-power") {
    const powerKw = toNumber(inputs.powerKw);
    const rpm = toNumber(inputs.rpm);
    const mechEff = toNumber(inputs.mechEff);

    if (rpm !== null && rpm <= 0) {
      insights.push({
        severity: "critical",
        title: t(locale, "RPM sıfır", "RPM is zero"),
        message: t(
          locale,
          "Devir 0 ise tork tanımsız olur. Giriş devrini doğrula.",
          "Torque is undefined at 0 rpm. Please verify input speed.",
        ),
        actionHref: "/reference",
      });
    }

    if (mechEff !== null && mechEff < 85) {
      insights.push({
        severity: "warn",
        title: t(locale, "Verim tipik aralık dışında", "Efficiency below typical range"),
        message: t(
          locale,
          "Mekanik verim genellikle %90–98 aralığındadır. Daha düşükse kayıpları doğrula.",
          "Mechanical efficiency is typically 90–98%. If lower, verify losses and assumptions.",
        ),
      });
    }

    if (powerKw !== null && rpm !== null && rpm > 0) {
      const torqueNm = (9550 * powerKw) / rpm;
      if (torqueNm > 5000 || torqueNm < 0.2) {
        insights.push({
          severity: "warn",
          title: t(locale, "Olağandışı tork seviyesi", "Unusual torque level"),
          message: t(
            locale,
            "kW ve rpm kombinasyonu alışılmadık bir tork veriyor. Birim ve oranları kontrol et.",
            "The kW-rpm combination yields an unusual torque. Double-check units and ratios.",
          ),
          actionHref: "/reference",
        });
      }
    }
  }

  if (toolId === "pipe-pressure-loss") {
    const rho = toNumber(inputs.rho);
    const mu = toNumber(inputs.mu);
    const flow = toNumber(inputs.flow);
    const diameterMm = toNumber(inputs.diameter);
    const roughness = toNumber(inputs.roughness);

    if (!roughness || roughness <= 0) {
      insights.push({
        severity: "info",
        title: t(locale, "Pürüzlülük varsayıldı", "Roughness assumed"),
        message: t(
          locale,
          "Pürüzlülük 0 ise boru yüzeyi pürüzsüz kabul edilir. Eski/korozif hatlarda ε gir.",
          "With roughness at 0, the pipe is treated as smooth. Enter ε for aged or rough lines.",
        ),
        actionHref: "/standards/fluids",
      });
    }

    if (rho !== null && mu !== null && flow !== null && diameterMm !== null && diameterMm > 0 && mu > 0) {
      const d = diameterMm / 1000;
      const area = (Math.PI * d * d) / 4;
      const v = area > 0 ? flow / area : 0;
      const Re = (rho * v * d) / mu;

      if (Re > 0 && Re < 2000) {
        insights.push({
          severity: "info",
          title: t(locale, "Laminer akış bölgesi", "Laminar flow"),
          message: t(
            locale,
            "Re < 2000: laminer akış. Sürtünme katsayısı f=64/Re yaklaşımı kullanılır.",
            "Re < 2000 indicates laminar flow. Use f=64/Re for friction factor.",
          ),
          actionHref: "/standards/fluids",
        });
      } else if (Re >= 2000 && Re <= 4000) {
        insights.push({
          severity: "warn",
          title: t(locale, "Geçiş bölgesi", "Transitional regime"),
          message: t(
            locale,
            "Re 2000–4000 aralığında; sonuçlar hassas olabilir. Deney veya güvenli katsayı kullan.",
            "Re is 2000–4000; results can be sensitive. Consider testing or a safety factor.",
          ),
          actionHref: "/standards/fluids",
        });
      } else if (Re > 100000) {
        insights.push({
          severity: "info",
          title: t(locale, "Türbülanslı akış", "Turbulent flow"),
          message: t(
            locale,
            "Re yüksek: türbülanslı akış. Pürüzlülük ve lokal kayıplar sonucu etkiler.",
            "High Re indicates turbulent flow. Roughness and minor losses affect the result.",
          ),
          actionHref: "/standards/fluids",
        });
      }

      if (v > 5) {
        insights.push({
          severity: "warn",
          title: t(locale, "Yüksek akış hızı", "High flow velocity"),
          message: t(
            locale,
            "Hız 5 m/s üzerindeyse gürültü/erozyon riski artabilir. Hat boyutu ve malzemeyi gözden geçir.",
            "Velocities above 5 m/s may increase noise/erosion risk. Revisit pipe size and material.",
          ),
        });
      }
    }
  }

  if (toolId === "gear-design/calculators/backlash-calculator") {
    const moduleVal = toNumber(inputs.module);
    const faceWidth = toNumber(inputs.faceWidth);
    const centerDistance = toNumber(inputs.centerDistance);
    const deltaT = toNumber(inputs.deltaT);

    if (moduleVal !== null && faceWidth !== null && moduleVal > 0 && faceWidth > 0) {
      const jNom = 0.04 * moduleVal + 0.001 * faceWidth;
      const jMin = 0.8 * jNom;
      if (jMin < 0.02 * moduleVal) {
        insights.push({
          severity: "warn",
          title: t(locale, "Backlash düşük olabilir", "Backlash may be too small"),
          message: t(
            locale,
            "Min backlash değeri düşük görünüyor. Isıl genleşme ve üretim toleranslarını dikkate al.",
            "Minimum backlash looks low. Account for thermal expansion and manufacturing tolerances.",
          ),
          actionHref: "/reference",
        });
      }
    }

    if (moduleVal !== null && centerDistance !== null && moduleVal > 0 && centerDistance > 0) {
      const totalTeeth = (2 * centerDistance) / moduleVal;
      if (totalTeeth < 30) {
        insights.push({
          severity: "warn",
          title: t(locale, "Düşük diş sayısı riski", "Low tooth count risk"),
          message: t(
            locale,
            "Merkez mesafesi/modül oranı düşük. Toplam diş sayısı az olabilir; undercut riski için kontrol et.",
            "Center distance to module ratio is low. Total tooth count may be small; check for undercut risk.",
          ),
        });
      }
    }

    if (deltaT !== null && Math.abs(deltaT) >= 40) {
      insights.push({
        severity: "info",
        title: t(locale, "Yüksek sıcaklık farkı", "Large temperature delta"),
        message: t(
          locale,
          "Sıcaklık farkı yüksekse backlash termal genleşme ile değişir. Tasarım boşluğu bırak.",
          "Large temperature changes will shift backlash. Allow thermal clearance in the design.",
        ),
      });
    }
  }

  if (toolId === "sanity-check") {
    const session = inputs.session as { variables?: Array<{ unit?: string }>; expectedUnit?: string } | undefined;
    const result = inputs.result as { warnings?: Array<{ type: string; expected?: string; actual?: string }>; error?: string } | undefined;

    if (result?.error) {
      insights.push({
        severity: "critical",
        title: t(locale, "Formül hatası", "Formula error"),
        message: t(
          locale,
          "Formül veya değişkenlerde hata var. Sembol isimlerini ve operatörleri kontrol et.",
          "There is a formula/variable error. Check symbol names and operators.",
        ),
      });
    }

    const unitMismatch = result?.warnings?.find((warning) => warning.type === "unit-mismatch");
    if (unitMismatch) {
      insights.push({
        severity: "warn",
        title: t(locale, "Birim uyuşmazlığı", "Unit mismatch"),
        message: t(
          locale,
          `Beklenen: ${unitMismatch.expected ?? "-"}, bulunan: ${unitMismatch.actual ?? "-"}. Birimleri veya beklenen birimi düzeltin.`,
          `Expected: ${unitMismatch.expected ?? "-"}, found: ${unitMismatch.actual ?? "-"}. Adjust units or the expected unit.`,
        ),
        actionHref: "/reference",
      });
    }

    const missingUnits = session?.variables?.some((variable) => !variable.unit);
    if (missingUnits) {
      insights.push({
        severity: "info",
        title: t(locale, "Birim girilmedi", "Missing units"),
        message: t(
          locale,
          "Değişkenlere birim eklemek, birim doğrulaması ve uyumsuzluk tespitini kolaylaştırır.",
          "Adding units enables dimension checks and clearer mismatch detection.",
        ),
      });
    }
  }

  if (context.reportUrl) {
    insights.push({
      severity: "info",
      title: t(locale, "Rapor oluştur", "Generate a report"),
      message: t(
        locale,
        "Hesabı kayıt altına almak için rapor çıktısı oluşturabilirsin.",
        "Create a report output to document this calculation.",
      ),
      actionHref: context.reportUrl,
    });
  }

  return insights;
}
