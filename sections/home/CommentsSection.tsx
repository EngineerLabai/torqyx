import CommentStream from "@/components/community/CommentStream";
import type { Locale } from "@/utils/locale";

type CommentsSectionProps = {
  locale: Locale;
};

export default function CommentsSection({ locale }: CommentsSectionProps) {
  const copy =
    locale === "en"
      ? {
          kicker: "Live",
          title: "Realtime comment stream",
          lead:
            "When auth is active, messages sent from the form land in Firestore; the live list shows the latest 6 comments.",
        }
      : {
          kicker: "Canli",
          title: "Giris yapan kullanicilarin yorum akisi",
          lead:
            "Auth aktifken formdan gonderilen mesajlar Firestore'a duser; canli listede son 6 yorum gorunur.",
        };

  return (
    <section id="comments" className="relative z-10 px-4 pb-20 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">{copy.kicker}</p>
          <h2 className="text-2xl font-bold text-white md:text-3xl">{copy.title}</h2>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">{copy.lead}</p>
        </div>
        <CommentStream />
      </div>
    </section>
  );
}
