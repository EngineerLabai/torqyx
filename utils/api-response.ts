import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export const zodIssueDetails = (error: ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    code: issue.code,
    message: issue.message,
  }));

export const apiError = (
  error: string,
  status: number,
  options: {
    message?: string;
    details?: unknown;
    headers?: HeadersInit;
  } = {},
) =>
  NextResponse.json(
    {
      ok: false,
      error,
      ...(options.message ? { message: options.message } : {}),
      ...(options.details ? { details: options.details } : {}),
    },
    {
      status,
      headers: options.headers,
    },
  );
