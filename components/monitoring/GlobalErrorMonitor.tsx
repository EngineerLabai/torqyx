"use client";

import { useEffect, useRef } from "react";

const CLIENT_ERROR_ENDPOINT = "/api/client-errors";
const MAX_CLIENT_ERRORS_PER_SESSION = 20;

export default function GlobalErrorMonitor() {
  const sentHashesRef = useRef<Set<string>>(new Set());
  const sentCountRef = useRef(0);

  useEffect(() => {
    const sendClientError = (payload: {
      type: "error" | "unhandledrejection";
      message: string;
      stack?: string | null;
      source?: string | null;
      line?: number | null;
      column?: number | null;
    }) => {
      if (sentCountRef.current >= MAX_CLIENT_ERRORS_PER_SESSION) return;

      const key = [
        payload.type,
        payload.message,
        payload.source ?? "",
        payload.line ?? "",
        payload.column ?? "",
        window.location.pathname,
      ].join("|");
      if (sentHashesRef.current.has(key)) return;
      sentHashesRef.current.add(key);
      sentCountRef.current += 1;

      const body = JSON.stringify({
        ...payload,
        href: window.location.href,
        ts: new Date().toISOString(),
      });

      if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon(CLIENT_ERROR_ENDPOINT, blob);
        return;
      }

      fetch(CLIENT_ERROR_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => undefined);
    };

    const onError = (event: ErrorEvent) => {
      console.error("[global:error]", {
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error instanceof Error ? event.error.stack : undefined,
      });
      sendClientError({
        type: "error",
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error instanceof Error ? event.error.stack : null,
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("[global:unhandledrejection]", event.reason);
      const reason = event.reason;
      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === "string"
            ? reason
            : JSON.stringify(reason);
      sendClientError({
        type: "unhandledrejection",
        message,
        stack: reason instanceof Error ? reason.stack : null,
        source: null,
        line: null,
        column: null,
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
