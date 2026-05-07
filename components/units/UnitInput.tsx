"use client";

import { forwardRef, useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { useUnitConversion } from "@/hooks/useUnit";
import { getUnitDefinition } from "@/utils/units";
import type { UnitSystem } from "@/utils/units";

interface UnitInputProps extends Omit<ComponentProps<typeof Input>, 'value' | 'onChange'> {
  value: number; // Always SI value
  onChange: (value: number) => void; // Always returns SI value
  unit: string; // SI unit
  system?: UnitSystem;
  placeholder?: string;
  showUnit?: boolean;
  className?: string;
}

// Input component that handles unit conversion automatically
// Internal state is always SI, display is converted based on system
export const UnitInput = forwardRef<HTMLInputElement, UnitInputProps>(
  ({
    value,
    onChange,
    unit,
    system: forcedSystem,
    placeholder,
    showUnit = true,
    className,
    ...props
  }, ref) => {
    const { system: currentSystem } = useUnitConversion();
    const system = forcedSystem || currentSystem;

    const unitDef = getUnitDefinition(unit);
    const displayUnit = system === 'SI' ? unitDef?.si || unit : unitDef?.imperial || unit;

    // Convert SI value to display value
    const displayValue = unitDef && system !== 'SI'
      ? unitDef.toImperial(value)
      : value;

    const precision = unitDef?.precision || 2;
    const formattedDisplayValue = displayValue.toFixed(precision);
    const [draft, setDraft] = useState(() => ({
      base: formattedDisplayValue,
      text: formattedDisplayValue,
    }));
    const inputValue = draft.base === formattedDisplayValue ? draft.text : formattedDisplayValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setDraft({ base: formattedDisplayValue, text: newValue });

      // Convert display value back to SI
      const numericValue = parseFloat(newValue);
      if (!isNaN(numericValue)) {
        let siValue: number;
        if (unitDef && system !== 'SI') {
          siValue = unitDef.fromImperial(numericValue);
        } else {
          siValue = numericValue;
        }
        onChange(siValue);
      }
    };

    const handleBlur = () => {
      // Format on blur
      const numericValue = parseFloat(inputValue);
      if (!isNaN(numericValue)) {
        setDraft({ base: formattedDisplayValue, text: numericValue.toFixed(precision) });
      }
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="number"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={className}
          {...props}
        />
        {showUnit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            {displayUnit}
          </span>
        )}
      </div>
    );
  }
);

UnitInput.displayName = "UnitInput";
