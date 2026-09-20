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
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

export type AnalyticsEventParams<TEventName extends AnalyticsEventName> = AnalyticsEventMap[TEventName];

export const ANALYTICS_TAXONOMY_EVENTS = [
  "tool_run",
  "export_pdf",
  "copy_link",
  "signup_start",
] as const satisfies ReadonlyArray<AnalyticsEventName>;
