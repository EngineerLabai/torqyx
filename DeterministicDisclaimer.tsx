import React from "react";

interface DeterministicDisclaimerProps {
  locale: string;
}

export default function DeterministicDisclaimer({ locale }: DeterministicDisclaimerProps) {
  const isEn = locale === "en";

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm">
      <p className="mb-1 font-semibold">
        {isEn ? "Disclaimer & Limitations" : "Sorumluluk Reddi ve Sınırlar"}
      </p>
      <p>
        {isEn
          ? "Calculations and results provided by this platform are for reference and preliminary design purposes only. You remain fully responsible for the final design and validation against official standards."
          : "Bu platform tarafından sağlanan hesaplamalar yalnızca referans ve ön tasarım amaçlıdır. Nihai tasarımın resmi standartlara göre doğrulanması ve onaylanması tamamen sizin sorumluluğunuzdadır."}
      </p>
    </div>
  );
}