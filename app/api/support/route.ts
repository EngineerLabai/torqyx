import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { FieldValue, type DocumentReference } from "firebase-admin/firestore";
import { z } from "zod";
import { isSupportEmailRequired, sendSupportNotification } from "@/lib/support-mail";
import { getAdminFirestore } from "@/utils/firebase-admin";
import { apiError, zodIssueDetails } from "@/utils/api-response";

export const runtime = "nodejs";

const supportSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  subject: z.enum(["technical", "feature", "bug", "other"]).default("technical"),
  message: z.string().trim().min(20).max(5000),
  attachment: z
    .object({
      url: z.string().trim().url().max(1000),
      name: z.string().trim().max(200).optional(),
      size: z.number().max(25 * 1024 * 1024).optional(),
      type: z.string().trim().max(100).optional(),
    })
    .optional()
    .nullable(),
});

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return apiError("invalid_json", 400);
  }

  const parsed = supportSchema.safeParse(payload);
  if (!parsed.success) {
    return apiError("invalid_payload", 400, {
      details: zodIssueDetails(parsed.error),
    });
  }

  let requestRef: DocumentReference | null = null;
  let storeError: unknown = null;

  try {
    const db = getAdminFirestore();
    requestRef = await db.collection("supportRequests").add({
      ...parsed.data,
      attachment: parsed.data.attachment ?? null,
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
      source: "support-form",
      userAgent: request.headers.get("user-agent") ?? null,
      emailNotification: {
        status: "pending",
        updatedAt: FieldValue.serverTimestamp(),
      },
    });
  } catch (error) {
    storeError = error;
    console.error("[support] Failed to store request:", error);
  }

  try {
    const notification = await sendSupportNotification(parsed.data, requestRef?.id);
    if (requestRef) {
      await requestRef.update({
        emailNotification:
          notification.status === "sent"
            ? {
                status: "sent",
                to: notification.to,
                updatedAt: FieldValue.serverTimestamp(),
              }
            : {
                status: "skipped",
                to: notification.to,
                reason: notification.reason,
                updatedAt: FieldValue.serverTimestamp(),
              },
      });
    }

    if (notification.status !== "sent" && isSupportEmailRequired()) {
      console.error("[support] Email notification is required but SMTP is not configured.");
      return apiError("support_email_unavailable", 500);
    }
  } catch (emailError) {
    console.error("[support] Failed to send notification email:", emailError);
    if (requestRef) {
      await requestRef
        .update({
          emailNotification: {
            status: "failed",
            error: emailError instanceof Error ? emailError.message : "Unknown email error",
            updatedAt: FieldValue.serverTimestamp(),
          },
        })
        .catch((updateError) => {
          console.error("[support] Failed to update email notification status:", updateError);
        });
    }

    if (isSupportEmailRequired()) {
      return apiError("support_email_unavailable", 500);
    }
  }

  if (!requestRef && storeError && !isSupportEmailRequired()) {
    return apiError("support_unavailable", 500);
  }

  return NextResponse.json(
    { ok: true, persisted: Boolean(requestRef) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
