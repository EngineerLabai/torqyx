import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";
import type { ToolInputProps } from "@/tools/_shared/types";
import type { HeatInput } from "./types";

export default function InputSection({ input, onChange }: ToolInputProps<HeatInput>) {
  const { locale } = useLocale();
  const copy = getMessages(locale).tools["basic-engineering"].input;
  const handleFieldChange = <K extends keyof HeatInput>(key: K, value: HeatInput[K]) => {
    onChange({ ...input, [key]: value });
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">{copy.title}</h2>
        <p className="text-xs text-slate-500">{copy.description}</p>
      </div>

      <div className="grid gap-3 text-xs sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">{copy.conductivityLabel}</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.conductivity}
            onChange={(event) => handleFieldChange("conductivity", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder={copy.conductivityPlaceholder}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">{copy.areaLabel}</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.area}
            onChange={(event) => handleFieldChange("area", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder={copy.areaPlaceholder}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">{copy.deltaTLabel}</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.deltaT}
            onChange={(event) => handleFieldChange("deltaT", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder={copy.deltaTPlaceholder}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">{copy.thicknessLabel}</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.thickness}
            onChange={(event) => handleFieldChange("thickness", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
            placeholder={copy.thicknessPlaceholder}
          />
        </div>
      </div>
    </div>
  );
}
