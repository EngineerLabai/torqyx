"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatMessage, getMessages } from "@/utils/messages";

type Topic = {
  slug: string;
  title: string;
  author: string;
  category: string;
  details: string;
  updated: string;
  tags: string[];
  replies: number;
};

type Answer = { user: string; text: string; time: string };

const isSampleContent = true;

export default function QaBoard() {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.qaBoard;
  const topics = copy.topics as Topic[];
  const answersByTopic = copy.answers as Record<string, Answer[]>;

  const [selectedSlug, setSelectedSlug] = useState<Topic["slug"]>(() => topics[0]?.slug ?? "");
  const selectedTopic = topics.find((t) => t.slug === selectedSlug) ?? topics[0];
  const answers = selectedTopic ? answersByTopic[selectedTopic.slug] ?? [] : [];

  if (!selectedTopic) return null;

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700">
              {copy.badge}
            </span>
            {isSampleContent ? (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-700">
                {copy.sampleBadge}
              </span>
            ) : null}
          </div>
          <h1 className="text-2xl font-semibold leading-snug text-slate-900">{copy.title}</h1>
          <p className="text-sm leading-relaxed text-slate-700">{copy.description}</p>
        </div>
      </section>

      <section id="soru-cevap" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
            {selectedTopic.category}
          </span>
          {isSampleContent ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
              {copy.sampleBadge}
            </span>
          ) : null}
          <h2 className="text-base font-semibold text-slate-900">{selectedTopic.title}</h2>
        </div>
        <p className="mt-2 text-sm text-slate-700">{selectedTopic.details}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
          <span>
            {copy.authorLabel}: {selectedTopic.author}
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-400" />
          <span>{selectedTopic.updated}</span>
          <div className="flex flex-wrap gap-1">
            {selectedTopic.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">{copy.answersTitle}</h3>
          {answers.map((answer) => (
            <div key={answer.user + answer.time} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="flex items-center justify-between text-[12px] text-slate-600">
                <span className="font-semibold text-slate-800">{answer.user}</span>
                <span>{answer.time}</span>
              </div>
              <p className="text-sm text-slate-700">{answer.text}</p>
            </div>
          ))}
        </div>

        <form className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
          <label className="text-xs font-semibold text-slate-700" htmlFor="reply">
            {copy.replyLabel}
          </label>
          <textarea
            id="reply"
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            placeholder={copy.replyPlaceholder}
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="tap-target inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-500"
            >
              {copy.replyButton}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">{copy.topicsTitle}</h2>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              {formatMessage(copy.topicCountLabel, { count: topics.length })}
            </span>
            {isSampleContent ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                {copy.sampleBadge}
              </span>
            ) : null}
          </div>
        </div>
        <div className="mt-3 space-y-2">
          {topics.map((topic) => (
            <button
              key={topic.slug}
              onClick={() => setSelectedSlug(topic.slug)}
              className="flex w-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left text-sm shadow-sm transition hover:border-sky-200 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  {topic.category}
                </span>
                {isSampleContent ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                    {copy.sampleBadge}
                  </span>
                ) : null}
                <span className="font-semibold text-slate-900">{topic.title}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
                <span>{formatMessage(copy.replyCountLabel, { count: topic.replies })}</span>
                <span className="h-1 w-1 rounded-full bg-slate-400" />
                <span>{topic.updated}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
