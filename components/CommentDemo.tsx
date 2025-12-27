"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/src/lib/firebase";
import { useAuth } from "./AuthProvider";

type Comment = {
  id: string;
  content: string;
  displayName?: string;
  createdAt?: { seconds?: number };
};

export default function CommentDemo() {
  const { user, loading } = useAuth();
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(firestore, "comments"), orderBy("createdAt", "desc"), limit(6));
    const unsub = onSnapshot(q, (snapshot) => {
      const next = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Comment, "id">) }));
      setComments(next);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !content.trim()) return;

    setSaving(true);
    setError(null);
    try {
      await addDoc(collection(firestore, "comments"), {
        content: content.trim(),
        displayName: user.displayName ?? user.email ?? "Kullanıcı",
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
      setContent("");
    } catch (err) {
      setError("Yorum kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/80 p-6 shadow-[8px_8px_0px_rgba(74,222,128,0.2)] backdrop-blur">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-orange-400/10" aria-hidden />
      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Gerçek Yorumlar</p>
            <h3 className="text-xl font-bold text-white">Community Stream</h3>
          </div>
          <span className="rounded-full border border-emerald-400/40 px-3 py-1 text-[11px] font-semibold text-emerald-100">
            Realtime
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={user ? "Fikrini yaz..." : "Yorum göndermek için giriş yap."}
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
            rows={3}
            disabled={!user || saving}
          />
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{user ? "Yorumların Firestore’a kaydedilecek." : "Önce giriş yapmalısın."}</span>
            <button
              type="submit"
              disabled={!user || saving || !content.trim()}
              className="rounded-full border border-orange-400/60 bg-gradient-to-r from-emerald-500/30 to-orange-500/30 px-4 py-2 font-semibold text-white transition hover:-translate-y-0.5 hover:from-emerald-500/40 hover:to-orange-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Gönderiliyor..." : "Yorumu Gönder"}
            </button>
          </div>
          {error ? <p className="text-sm text-orange-300">{error}</p> : null}
        </form>

        <div className="grid gap-2 md:grid-cols-2">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-slate-100 shadow-sm"
            >
              <div className="mb-1 flex items-center justify-between text-[11px] text-emerald-200">
                <span className="truncate">{comment.displayName ?? "Kullanıcı"}</span>
                <span className="text-[10px] text-slate-500">
                  {comment.createdAt?.seconds ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString("tr-TR") : "Yeni"}
                </span>
              </div>
              <p className="text-slate-200">{comment.content}</p>
            </div>
          ))}
          {!comments.length ? (
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-slate-300">
              İlk yorumu sen bırak.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
