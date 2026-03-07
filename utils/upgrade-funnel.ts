"use client";

export const UPGRADE_FUNNEL_STATE_STORAGE_KEY = "analytics:upgrade_funnel_state";
export const UPGRADE_FUNNEL_STATE_UPDATED_EVENT = "analytics:upgrade-funnel-updated";
export const UPGRADE_FUNNEL_TIMEOUT_MS = 10 * 60 * 1000;

const UPGRADE_FUNNEL_STEP_ORDER = {
  upgrade_click: 1,
  plan_view: 2,
  checkout_start: 3,
  payment_info_entered: 4,
  upgrade_success: 5,
} as const;

type UpgradeFunnelStepOrder = typeof UPGRADE_FUNNEL_STEP_ORDER;

export type UpgradeFunnelStep = keyof UpgradeFunnelStepOrder;

type UpgradeFunnelState = {
  startedAt: number;
  funnelStep: UpgradeFunnelStep;
  plan: string;
  source: string;
  successAt: number | null;
  abandonedAt: number | null;
};

type UpgradeFunnelStepUpdate = {
  step: UpgradeFunnelStep;
  plan?: string;
  source?: string;
};

export type UpgradeFunnelAbandonmentCandidate = {
  plan: string;
  source: string;
  dropOffStep: UpgradeFunnelStep;
  elapsedSeconds: number;
};

const UPGRADE_FUNNEL_STEPS = Object.keys(UPGRADE_FUNNEL_STEP_ORDER) as UpgradeFunnelStep[];
const UPGRADE_FUNNEL_STEP_SET = new Set<string>(UPGRADE_FUNNEL_STEPS);

const isBrowser = () => typeof window !== "undefined";

const normalizeString = (value: unknown) => {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const normalizeStep = (value: unknown): UpgradeFunnelStep | null => {
  if (typeof value !== "string") return null;
  return UPGRADE_FUNNEL_STEP_SET.has(value) ? (value as UpgradeFunnelStep) : null;
};

const parseStoredState = (rawValue: string | null): UpgradeFunnelState | null => {
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue) as Partial<UpgradeFunnelState> | null;
    if (!parsed || typeof parsed !== "object") return null;

    if (typeof parsed.startedAt !== "number" || !Number.isFinite(parsed.startedAt) || parsed.startedAt <= 0) {
      return null;
    }

    const funnelStep = normalizeStep(parsed.funnelStep);
    if (!funnelStep) return null;

    const plan = normalizeString(parsed.plan) ?? "unknown";
    const source = normalizeString(parsed.source) ?? "unknown";
    const successAt = typeof parsed.successAt === "number" && Number.isFinite(parsed.successAt) ? parsed.successAt : null;
    const abandonedAt =
      typeof parsed.abandonedAt === "number" && Number.isFinite(parsed.abandonedAt) ? parsed.abandonedAt : null;

    return {
      startedAt: parsed.startedAt,
      funnelStep,
      plan,
      source,
      successAt,
      abandonedAt,
    };
  } catch {
    return null;
  }
};

const readStoredUpgradeFunnelState = () => {
  if (!isBrowser()) return null;
  try {
    return parseStoredState(window.sessionStorage.getItem(UPGRADE_FUNNEL_STATE_STORAGE_KEY));
  } catch {
    return null;
  }
};

const notifyUpgradeFunnelUpdated = () => {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(UPGRADE_FUNNEL_STATE_UPDATED_EVENT));
};

const writeStoredUpgradeFunnelState = (state: UpgradeFunnelState) => {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(UPGRADE_FUNNEL_STATE_STORAGE_KEY, JSON.stringify(state));
    notifyUpgradeFunnelUpdated();
  } catch {
    // ignore sessionStorage restrictions
  }
};

const shouldStartNewFunnel = (state: UpgradeFunnelState | null, now: number) => {
  if (!state) return true;
  if (state.successAt !== null || state.abandonedAt !== null) return true;
  return now - state.startedAt >= UPGRADE_FUNNEL_TIMEOUT_MS;
};

const advanceStep = (current: UpgradeFunnelStep, next: UpgradeFunnelStep): UpgradeFunnelStep => {
  return UPGRADE_FUNNEL_STEP_ORDER[next] > UPGRADE_FUNNEL_STEP_ORDER[current] ? next : current;
};

const createFunnelState = (update: UpgradeFunnelStepUpdate, now: number): UpgradeFunnelState => ({
  startedAt: now,
  funnelStep: update.step,
  plan: normalizeString(update.plan) ?? "unknown",
  source: normalizeString(update.source) ?? "unknown",
  successAt: update.step === "upgrade_success" ? now : null,
  abandonedAt: null,
});

export const updateUpgradeFunnelState = (update: UpgradeFunnelStepUpdate) => {
  if (!isBrowser()) return;
  const now = Date.now();
  const currentState = readStoredUpgradeFunnelState();

  if (update.step === "upgrade_click") {
    if (shouldStartNewFunnel(currentState, now)) {
      writeStoredUpgradeFunnelState(createFunnelState(update, now));
      return;
    }

    if (!currentState) return;
    const nextState: UpgradeFunnelState = {
      ...currentState,
      funnelStep: advanceStep(currentState.funnelStep, update.step),
      plan: currentState.plan === "unknown" ? normalizeString(update.plan) ?? currentState.plan : currentState.plan,
      source:
        currentState.source === "unknown" ? normalizeString(update.source) ?? currentState.source : currentState.source,
    };
    writeStoredUpgradeFunnelState(nextState);
    return;
  }

  if (!currentState || shouldStartNewFunnel(currentState, now)) {
    return;
  }

  const nextState: UpgradeFunnelState = {
    ...currentState,
    funnelStep: advanceStep(currentState.funnelStep, update.step),
    plan: currentState.plan === "unknown" ? normalizeString(update.plan) ?? currentState.plan : currentState.plan,
    source:
      currentState.source === "unknown" ? normalizeString(update.source) ?? currentState.source : currentState.source,
    successAt: update.step === "upgrade_success" ? now : currentState.successAt,
  };

  writeStoredUpgradeFunnelState(nextState);
};

export const getUpgradeFunnelState = () => readStoredUpgradeFunnelState();

export const getUpgradeFunnelRemainingMs = (now = Date.now()) => {
  const state = readStoredUpgradeFunnelState();
  if (!state) return null;
  if (state.successAt !== null || state.abandonedAt !== null) return null;
  return Math.max(UPGRADE_FUNNEL_TIMEOUT_MS - (now - state.startedAt), 0);
};

export const getUpgradeFunnelAbandonmentCandidate = (
  now = Date.now(),
): UpgradeFunnelAbandonmentCandidate | null => {
  const state = readStoredUpgradeFunnelState();
  if (!state) return null;
  if (state.successAt !== null || state.abandonedAt !== null) return null;

  const elapsedMs = now - state.startedAt;
  if (elapsedMs < UPGRADE_FUNNEL_TIMEOUT_MS) return null;

  return {
    plan: state.plan,
    source: state.source,
    dropOffStep: state.funnelStep,
    elapsedSeconds: Math.floor(elapsedMs / 1000),
  };
};

export const markUpgradeFunnelAbandoned = (now = Date.now()) => {
  const state = readStoredUpgradeFunnelState();
  if (!state) return;
  if (state.successAt !== null || state.abandonedAt !== null) return;

  writeStoredUpgradeFunnelState({
    ...state,
    abandonedAt: now,
  });
};
