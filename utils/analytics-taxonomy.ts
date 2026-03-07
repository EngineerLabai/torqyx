export type SignupStartSource = "hero" | "modal" | "cta";

export type AnalyticsEventMap = {
  tool_run: {
    tool_id: string;
    tool_name: string;
    input_count: number;
  };
  export_pdf: {
    tool_id: string;
    page: string;
  };
  copy_link: {
    page: string;
    element: string;
  };
  signup_start: {
    source: SignupStartSource;
  };
  upgrade_click: {
    plan: string;
    source: string;
  };
  plan_view: {
    plan: string;
    source: string;
  };
  checkout_start: {
    plan: string;
    source: string;
  };
  payment_info_entered: {
    plan: string;
    source: string;
  };
  upgrade_success: {
    plan: string;
    amount: number;
  };
  funnel_abandoned: {
    plan: string;
    source: string;
    drop_off_step: "upgrade_click" | "plan_view" | "checkout_start" | "payment_info_entered";
    elapsed_seconds: number;
  };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

export type AnalyticsEventParams<TEventName extends AnalyticsEventName> = AnalyticsEventMap[TEventName];

export const ANALYTICS_TAXONOMY_EVENTS = [
  "tool_run",
  "export_pdf",
  "copy_link",
  "signup_start",
  "upgrade_click",
  "plan_view",
  "checkout_start",
  "payment_info_entered",
  "upgrade_success",
  "funnel_abandoned",
] as const satisfies ReadonlyArray<AnalyticsEventName>;
