"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import useFirebaseServices from "@/components/firebase/useFirebaseServices";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";

type AttachmentPayload = {
  url: string;
  name?: string;
  size?: number;
  type?: string;
};

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

export default function SupportForm() {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.supportForm;
  const { services } = useFirebaseServices();
  const storage = services?.storage ?? null;
  const canUploadFile = Boolean(storage);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isBusy = status === "uploading" || status === "submitting";

  const submitLabel = useMemo(() => {
    if (status === "uploading") return copy.submit.uploading;
    if (status === "submitting") return copy.submit.submitting;
    return copy.submit.idle;
  }, [status, copy]);

  useEffect(() => {
    if (status !== "success") return;
    setToastMessage(copy.successToast ?? copy.success);
  }, [status, copy.successToast, copy.success]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleChange = (field: "name" | "email" | "message") =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (status !== "idle") setStatus("idle");
      if (errorMessage) setErrorMessage("");
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (status !== "idle") setStatus("idle");
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setAttachment(null);
      return;
    }

    if (file.size > MAX_ATTACHMENT_SIZE) {
      setAttachment(null);
      setErrorMessage(copy.errors.fileTooLarge);
      return;
    }

    setErrorMessage("");
    setAttachment(file);
  };

  const uploadAttachment = async (file: File): Promise<AttachmentPayload> => {
    if (!storage) {
      throw new Error(copy.errors.uploadUnavailable);
    }
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `support/${Date.now()}-${safeName}`;
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return { url, name: file.name, size: file.size, type: file.type };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMessage(copy.errors.required);
      setStatus("error");
      return;
    }

    let attachmentPayload: AttachmentPayload | undefined;

    try {
      if (attachment) {
        setStatus("uploading");
        attachmentPayload = await uploadAttachment(attachment);
      }

      setStatus("submitting");
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          attachment: attachmentPayload,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        if (data?.error === "support_unavailable") {
          throw new Error(copy.errors.supportUnavailable);
        }
        throw new Error(data?.error ?? copy.errors.submitFailed);
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setAttachment(null);
    } catch (error) {
      console.error("[support] submit failed", error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : copy.errors.submitFailed);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 shadow-sm"
    >
      {toastMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-xs font-semibold text-emerald-700 shadow-lg"
        >
          {toastMessage}
        </div>
      ) : null}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700" htmlFor="name">
            {copy.fields.name.label}
          </label>
          <input
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange("name")}
            className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            placeholder={copy.fields.name.placeholder}
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700" htmlFor="email">
            {copy.fields.email.label}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange("email")}
            className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            placeholder={copy.fields.email.placeholder}
            disabled={isBusy}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700" htmlFor="message">
          {copy.fields.message.label}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          value={form.message}
          onChange={handleChange("message")}
          className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          placeholder={copy.fields.message.placeholder}
          disabled={isBusy}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700" htmlFor="attachment">
          {copy.fields.attachment.label}
        </label>
        <input
          id="attachment"
          name="attachment"
          type="file"
          onChange={handleFileChange}
          disabled={!canUploadFile || isBusy}
          className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-emerald-500 disabled:opacity-60"
        />
        <p className="text-[11px] text-slate-600">
          {canUploadFile ? copy.fields.attachment.helper : copy.fields.attachment.unavailable}
        </p>
      </div>

      {status === "success" ? (
        <p className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs text-emerald-700">
          {copy.success}
        </p>
      ) : null}

      {status === "error" && errorMessage ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isBusy}
        className="tap-target w-full rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitLabel}
      </button>
    </form>
  );
}
