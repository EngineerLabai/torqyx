/// <reference lib="webworker" />

import { runMonteCarlo } from "@/lib/sanityCheck/engine";
import type { LabSession } from "@/lib/sanityCheck/types";

const ctx: DedicatedWorkerGlobalScope = self as DedicatedWorkerGlobalScope;

ctx.onmessage = (event: MessageEvent<{ session: LabSession }>) => {
  const result = runMonteCarlo(event.data.session);
  ctx.postMessage(result);
};
