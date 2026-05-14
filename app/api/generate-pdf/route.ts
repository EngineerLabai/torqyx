import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { generatePdfReport } from "@/lib/pdf/generatePdfReport";
import type { ReportData } from "@/lib/pdf/types";
import { apiError, zodIssueDetails } from "@/utils/api-response";

export const runtime = "nodejs";

const scalarSchema = z.union([z.string().max(1000), z.number().finite()]);

const reportParameterSchema = z.object({
  label: z.string().trim().min(1).max(160),
  value: scalarSchema,
  unit: z.string().trim().max(48).optional(),
});

const reportFormulaSchema = z.object({
  label: z.string().trim().min(1).max(160),
  latex: z.string().trim().min(1).max(2000),
  description: z.string().trim().max(1000).optional(),
});

const reportResultSchema = z.object({
  label: z.string().trim().min(1).max(160),
  value: scalarSchema,
  unit: z.string().trim().max(48).optional(),
  status: z.enum(["pass", "fail", "warning", "info"]),
});

const reportCalculationStepSchema = z.object({
  id: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(160),
  formula: z.string().trim().min(1).max(2000),
  variables: z.array(reportParameterSchema).max(100),
  result: scalarSchema,
  unit: z.string().trim().max(48),
  standard: z.string().trim().max(160).optional(),
  status: z.enum(["pass", "fail", "warning", "info"]),
});

const reportStandardSchema = z.object({
  code: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(240),
  url: z.string().trim().url().max(500).optional(),
});

const reportDataSchema = z.object({
  toolName: z.string().trim().min(1).max(160),
  toolId: z.string().trim().min(1).max(128),
  parameters: z.array(reportParameterSchema).max(200),
  formulas: z.array(reportFormulaSchema).max(40),
  results: z.array(reportResultSchema).max(200),
  standards: z.array(reportStandardSchema).max(80),
  calculationSteps: z.array(reportCalculationStepSchema).max(100).optional(),
  calculationDate: z.string().trim().refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date"),
  unitSystem: z.enum(["SI", "Imperial", "Mixed"]),
  notes: z.string().trim().max(5000).optional(),
}) satisfies z.ZodType<ReportData>;

const generatePdfSchema = z.object({
  toolId: z.string().trim().min(1).max(128).regex(/^[a-z0-9/_-]+$/i),
  reportData: reportDataSchema,
});

const billingStatusSchema = z.object({
  effectivePlan: z.string(),
});

const safeFilenamePart = (value: string) =>
  value
    .trim()
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "report";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiError("unauthorized", 401);
    }

    const billingResponse = await fetch(`${request.nextUrl.origin}/api/billing/status`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (!billingResponse.ok) {
      return apiError("billing_check_failed", 500);
    }

    const billingStatus = billingStatusSchema.safeParse(await billingResponse.json());
    if (!billingStatus.success) {
      return apiError("billing_check_failed", 500);
    }

    if (billingStatus.data.effectivePlan === "free") {
      return apiError("premium_required", 403);
    }

    let rawPayload: unknown;
    try {
      rawPayload = await request.json();
    } catch {
      return apiError("invalid_json", 400);
    }

    const parsed = generatePdfSchema.safeParse(rawPayload);
    if (!parsed.success) {
      return apiError("invalid_payload", 400, {
        details: zodIssueDetails(parsed.error),
      });
    }

    const { toolId, reportData } = parsed.data;
    const pdfBuffer = await generatePdfReport(toolId, reportData, session.user);
    const pdfBytes = new Uint8Array(pdfBuffer);
    const date = new Date().toISOString().split("T")[0];
    const filename = `${safeFilenamePart(toolId)}-report-${date}.pdf`;

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return apiError("pdf_generation_failed", 500);
  }
}
