"use client";

import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useOptionalAuth } from "@/components/auth/AuthProvider";
import useFirebaseServices from "@/components/firebase/useFirebaseServices";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";

type Comment = {
  id: string;
  content: string;
  displayName?: string;
  createdAt?: { seconds?: number };
};

export default function CommentStream() {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.commentStream;
  const auth = useOptionalAuth();
  const { services, ready: servicesReady } = useFirebaseServices();
  const authUnavailable = Boolean(auth && !auth.available);
  const isDemoMode = servicesReady && !services && !authUnavailable;
  const user = auth?.user ?? null;
  const authLoading = auth?.loading ?? false;

  const [content, setContent] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [saving, setSaving] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authPending, setAuthPending] = useState(false);

  const userLabel = useMemo(
    () => user?.displayName ?? user?.email ?? copy.userFallback,
    [user, copy.userFallback],
  );
  const loadFailedMessage = copy.errors.loadFailed;

  useEffect(() => {
    if (!servicesReady) return;

    if (isDemoMode) {
      setCommentsLoading(false);
      return;
    }

    const firestore = services?.firestore;
    if (!firestore) {
      setCommentsLoading(false);
      return;
    }

    const q = query(collection(firestore, "comments"), orderBy("createdAt", "desc"), limit(6));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const next = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Comment, "id">) }));
        setComments(next);
        setCommentsLoading(false);
      },
      (err) => {
        console.error("[comments] Firestore listen failed:", err);
        setError(loadFailedMessage);
        setCommentsLoading(false);
      },
    );
    return () => unsub();
  }, [isDemoMode, services, servicesReady, loadFailedMessage]);

  const handleLogin = async () => {
    if (!auth?.loginWithGoogle || !services || authUnavailable) return;
    setAuthPending(true);
    setAuthError(null);

    try {
      await auth.loginWithGoogle();
    } catch (err) {
      console.error("[comments] Login failed:", err);
      setAuthError(copy.errors.loginFailed);
    } finally {
      setAuthPending(false);
    }
  };

  const handleLogout = async () => {
    if (!auth?.logout) return;
    setAuthPending(true);
    setAuthError(null);
    try {
      await auth.logout();
    } catch (err) {
      console.error("[comments] Logout failed:", err);
      setAuthError(copy.errors.logoutFailed);
    } finally {
      setAuthPending(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    if (!user && !isDemoMode) return;

    setSaving(true);
    setError(null);

    if (isDemoMode) {
      const now = Math.floor(Date.now() / 1000);
      const nextComment: Comment = {
        id: `demo-${Date.now()}`,
        content: trimmed,
        displayName: copy.demoUser,
        createdAt: { seconds: now },
      };
      setComments((prev) => [nextComment, ...prev].slice(0, 6));
      setContent("");
      setSaving(false);
      return;
    }

    try {
      const firestore = services?.firestore;
      if (!firestore) return;

      await addDoc(collection(firestore, "comments"), {
        content: trimmed,
        displayName: user?.displayName ?? user?.email ?? copy.userFallback,
        uid: user?.uid,
        createdAt: serverTimestamp(),
      });
      setContent("");
    } catch (err) {
      console.error("[comments] Comment save failed:", err);
      setError(copy.errors.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const placeholder = !servicesReady
    ? copy.placeholders.loading
    : isDemoMode
    ? copy.placeholders.demo
    : authUnavailable
      ? copy.placeholders.authUnavailable
    : user
      ? copy.placeholders.signedIn
      : copy.placeholders.signedOut;

  const helperText = !servicesReady
    ? copy.helpers.loading
    : isDemoMode
    ? copy.helpers.demo
    : authUnavailable
      ? copy.helpers.authUnavailable
    : user
      ? copy.helpers.signedIn
      : copy.helpers.signedOut;

  const submitDisabled = saving || !content.trim() || (!isDemoMode && !user) || !servicesReady || authUnavailable;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-transparent to-sky-50/60" aria-hidden />
      <div className="relative space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">{copy.kicker}</p>
            <h3 className="text-xl font-semibold text-slate-900">{copy.title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              {copy.realtimeBadge}
            </span>
            {isDemoMode ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600">
                {copy.demoBadge}
              </span>
            ) : null}
            {authLoading ? null : authUnavailable ? (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
                {copy.authUnavailable}
              </span>
            ) : user ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700">
                  {userLabel}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={authPending}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {authPending ? copy.logoutPending : copy.logout}
                </button>
              </div>
            ) : isDemoMode ? null : (
              <button
                type="button"
                onClick={handleLogin}
                disabled={authPending}
                className="rounded-full border border-emerald-300 bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {authPending ? copy.loginPending : copy.login}
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
            rows={3}
            disabled={saving || (!isDemoMode && !user) || !servicesReady || authUnavailable}
          />
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>{helperText}</span>
            <button
              type="submit"
              disabled={submitDisabled}
              className="rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? copy.submit.saving : copy.submit.idle}
            </button>
          </div>
          {authError ? <p className="text-sm text-amber-600">{authError}</p> : null}
          {error ? <p className="text-sm text-amber-600">{error}</p> : null}
        </form>

        <div className="grid gap-2 md:grid-cols-2">
          {commentsLoading ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              {copy.loading}
            </div>
          ) : comments.length ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm"
              >
                <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate">{comment.displayName ?? copy.userFallback}</span>
                  <span className="text-[10px] text-slate-400">
                    {comment.createdAt?.seconds
                      ? new Intl.DateTimeFormat(locale === "en" ? "en-US" : "tr-TR").format(
                          new Date(comment.createdAt.seconds * 1000),
                        )
                      : copy.newLabel}
                  </span>
                </div>
                <p className="text-slate-700">{comment.content}</p>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              {copy.empty}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
