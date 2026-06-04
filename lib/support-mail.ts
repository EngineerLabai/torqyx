import "server-only";

import nodemailer from "nodemailer";
import { SITE_CONTACT_EMAIL } from "@/config/brand";

type SupportSubject = "technical" | "feature" | "bug" | "other";

type SupportNotificationPayload = {
  name: string;
  email: string;
  subject: SupportSubject;
  message: string;
  attachment?: {
    url: string;
    name?: string;
    size?: number;
    type?: string;
  } | null;
};

type SupportNotificationResult =
  | { status: "sent"; to: string }
  | { status: "skipped"; reason: "missing_smtp_config"; to: string };

const SUBJECT_LABELS: Record<SupportSubject, string> = {
  technical: "Teknik Soru",
  feature: "Ozellik Onerisi",
  bug: "Hata Bildirimi",
  other: "Diger",
};

const truthy = new Set(["1", "true", "yes", "on"]);

const getSupportRecipient = () => process.env.SUPPORT_EMAIL_TO?.trim() || SITE_CONTACT_EMAIL;

const parseSmtpSecure = (port: number) => {
  const value = process.env.SMTP_SECURE?.trim().toLowerCase();
  if (!value) return port === 465;
  return truthy.has(value);
};

const getSmtpConfig = () => {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.replace(/\s/g, "");
  const to = getSupportRecipient();

  if (!host || !user || !pass) {
    return null;
  }

  const parsedPort = Number(process.env.SMTP_PORT ?? "465");
  const port = Number.isFinite(parsedPort) ? parsedPort : 465;
  const from =
    process.env.SUPPORT_EMAIL_FROM?.trim() ||
    process.env.SMTP_FROM?.trim() ||
    `TORQYX <${user}>`;

  return {
    to,
    from,
    transport: {
      host,
      port,
      secure: parseSmtpSecure(port),
      auth: {
        user,
        pass,
      },
    },
  };
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });

const formatBytes = (value?: number) => {
  if (!value || !Number.isFinite(value)) return null;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

export const isSupportEmailRequired = () => {
  const value = process.env.SUPPORT_EMAIL_REQUIRED?.trim().toLowerCase();
  return value ? truthy.has(value) : false;
};

export async function sendSupportNotification(
  payload: SupportNotificationPayload,
  requestId?: string,
): Promise<SupportNotificationResult> {
  const config = getSmtpConfig();
  const to = getSupportRecipient();

  if (!config) {
    console.warn("[support] SMTP is not configured; support notification email was skipped.");
    return { status: "skipped", reason: "missing_smtp_config", to };
  }

  const subjectLabel = SUBJECT_LABELS[payload.subject] ?? payload.subject;
  const mailSubject = `[TORQYX] ${subjectLabel} - ${payload.name}`;
  const attachmentSize = formatBytes(payload.attachment?.size);
  const attachmentLines = payload.attachment
    ? [
        `Dosya: ${payload.attachment.name ?? "Ek dosya"}`,
        attachmentSize ? `Dosya boyutu: ${attachmentSize}` : null,
        payload.attachment.type ? `Dosya tipi: ${payload.attachment.type}` : null,
        `Dosya linki: ${payload.attachment.url}`,
      ].filter(Boolean)
    : ["Dosya: Yok"];

  const text = [
    "Yeni TORQYX destek talebi",
    requestId ? `Talep ID: ${requestId}` : null,
    `Ad Soyad: ${payload.name}`,
    `E-posta: ${payload.email}`,
    `Konu: ${subjectLabel}`,
    "",
    "Mesaj:",
    payload.message,
    "",
    ...attachmentLines,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const htmlRows = [
    ["Talep ID", requestId],
    ["Ad Soyad", payload.name],
    ["E-posta", payload.email],
    ["Konu", subjectLabel],
    ["Dosya", payload.attachment ? payload.attachment.name ?? "Ek dosya" : "Yok"],
    ["Dosya boyutu", attachmentSize],
    ["Dosya tipi", payload.attachment?.type],
  ].filter(([, value]) => Boolean(value));

  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.55;">
      <h2 style="margin: 0 0 16px;">Yeni TORQYX destek talebi</h2>
      <table style="border-collapse: collapse; margin-bottom: 18px;">
        ${htmlRows
          .map(
            ([label, value]) => `
              <tr>
                <td style="padding: 6px 12px 6px 0; font-weight: 700;">${escapeHtml(label ?? "")}</td>
                <td style="padding: 6px 0;">${escapeHtml(value ?? "")}</td>
              </tr>
            `,
          )
          .join("")}
      </table>
      <h3 style="margin: 0 0 8px;">Mesaj</h3>
      <p style="white-space: pre-wrap; margin: 0 0 18px;">${escapeHtml(payload.message)}</p>
      ${
        payload.attachment
          ? `<p style="margin: 0;"><a href="${escapeHtml(payload.attachment.url)}">Ek dosyayi ac</a></p>`
          : ""
      }
    </div>
  `;

  const transporter = nodemailer.createTransport(config.transport);
  await transporter.sendMail({
    from: config.from,
    to: config.to,
    replyTo: { name: payload.name, address: payload.email },
    subject: mailSubject,
    text,
    html,
  });

  return { status: "sent", to: config.to };
}
