"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUnitSystem } from "@/contexts/UnitSystemContext";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/utils/locale";
import type { UnitSystem } from "@/utils/units";

const UNIT_SYSTEM_LABELS: Record<Locale, Record<UnitSystem, string>> = {
  tr: {
    SI: "SI (mm, N, MPa)",
    Imperial: "Imperyal (in, lbf, psi)",
    Mixed: "Karma (her ikisi)",
  },
  en: {
    SI: "SI (mm, N, MPa)",
    Imperial: "Imperial (in, lbf, psi)",
    Mixed: "Mixed (both)",
  },
};

export function UnitSystemSwitcher() {
  const { system, setSystem } = useUnitSystem();
  const { locale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const labels = UNIT_SYSTEM_LABELS[locale];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title={locale === "tr" ? "Birim sistemi" : "Unit system"}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          {locale === "tr" ? "Birim sistemi" : "Unit system"}
        </div>
        {(Object.keys(UNIT_SYSTEM_LABELS) as UnitSystem[]).map((unitSystem) => (
          <DropdownMenuItem
            key={unitSystem}
            onClick={() => {
              setSystem(unitSystem);
              setIsOpen(false);
            }}
            className={`cursor-pointer ${
              system === unitSystem ? "bg-accent" : ""
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium">
                {unitSystem}
                {system === unitSystem && (
                  <span className="ml-2 text-primary">✓</span>
                )}
              </span>
              <span className="text-xs text-muted-foreground">
                {labels[unitSystem]}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Compact version for mobile
export function UnitSystemToggle() {
  const { system, setSystem } = useUnitSystem();
  const { locale } = useLocale();

  const toggleSystem = () => {
    if (system === 'SI') {
      setSystem('Imperial');
    } else if (system === 'Imperial') {
      setSystem('Mixed');
    } else {
      setSystem('SI');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSystem}
      className="h-8 px-2 text-xs"
      title={`${locale === "tr" ? "Şu anki" : "Current"}: ${UNIT_SYSTEM_LABELS[locale][system]}`}
    >
      {system === 'SI' ? 'SI' : system === 'Imperial' ? 'Imp' : 'Mix'}
    </Button>
  );
}
