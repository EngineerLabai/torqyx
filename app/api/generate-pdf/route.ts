"use server";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generatePdfReport } from "@/lib/pdf/generatePdfReport";
import type { ReportData } from "@/lib/pdf/types";

export async function POST(request: NextRequest) {
  try {
    // Auth kontrolü
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Premium kontrolü - API seviyesinde
    const billingResponse = await fetch(`${request.nextUrl.origin}/api/billing/status`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (!billingResponse.ok) {
      return NextResponse.json({ error: "Billing check failed" }, { status: 500 });
    }

    const billingStatus = await billingResponse.json();
    if (billingStatus.effectivePlan === "free") {
      return NextResponse.json(
        { error: "Premium feature required" },
        { status: 403 }
      );
    }

    // Request body parse
    const body = await request.json();
    const { toolId, reportData }: { toolId: string; reportData: ReportData } = body;

    if (!toolId || !reportData) {
      return NextResponse.json(
        { error: "Missing required fields: toolId, reportData" },
        { status: 400 }
      );
    }

    // PDF oluştur
    const pdfBuffer = await generatePdfReport(toolId, reportData, session.user);

    // Response olarak PDF buffer dön
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${toolId}-report-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });

  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 }
    );
  }
}