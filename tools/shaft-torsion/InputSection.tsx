import { useLocale } from "@/components/i18n/LocaleProvider";
import type { ToolInputProps } from "@/tools/_shared/types";
import type { ShaftTorsionInput } from "./types";
import { getShaftTorsionCopy } from "./copy";

export default function InputSection({ input, onChange, errors }: ToolInputProps<ShaftTorsionInput>) {
  const { locale } = useLocale();
  const copy = getShaftTorsionCopy(locale).input;
  const handleChange = <K extends keyof ShaftTorsionInput>(key: K, value: ShaftTorsionInput[K]) => {
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
          <label className="block text-[11px] font-medium text-slate-700">{copy.torqueLabel}</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.torque}
            onChange={(event) => handleChange("torque", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.torque ? <p className="text-[10px] text-red-600">{errors.torque}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">{copy.diameterLabel}</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.diameter}
            onChange={(event) => handleChange("diameter", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.diameter ? <p className="text-[10px] text-red-600">{errors.diameter}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">{copy.lengthLabel}</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.length}
            onChange={(event) => handleChange("length", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.length ? <p className="text-[10px] text-red-600">{errors.length}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">{copy.shearModulusLabel}</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.shearModulus}
            onChange={(event) => handleChange("shearModulus", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.shearModulus ? <p className="text-[10px] text-red-600">{errors.shearModulus}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">{copy.allowableShearLabel}</label>
          <input
            type="number"
            inputMode="decimal"
            value={input.allowableShear}
            onChange={(event) => handleChange("allowableShear", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
          />
          {errors?.allowableShear ? <p className="text-[10px] text-red-600">{errors.allowableShear}</p> : null}
        </div>
      </div>
    </div>
  );
}
