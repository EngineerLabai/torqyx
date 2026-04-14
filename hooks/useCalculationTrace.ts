import { useMemo } from "react";
import type { CalculationStep } from "@/tools/_shared/types";

type TraceSource = {
  auditTrail?: CalculationStep[] | (() => CalculationStep[] | null) | null;
};

export function useCalculationTrace(source: TraceSource | null | undefined, enabled: boolean) {
  return useMemo(() => {
    if (!enabled) return [] as CalculationStep[];

    const traceSource = source?.auditTrail;
    if (!traceSource) return [] as CalculationStep[];

    return typeof traceSource === "function" ? traceSource() ?? [] : traceSource;
  }, [enabled, source]);
}
