import { isContentIndexable, countContentWords } from "@/utils/content-quality";

type BlogAdCandidate = {
  type: "blog" | "guides" | "glossary" | "qa";
  title: string;
  description: string;
  content: string;
  draft?: boolean;
};

export const BLOG_AD_MIN_WORDS = 600;

export const isBlogPostAdEligible = (post: BlogAdCandidate | null | undefined) =>
  Boolean(
    post &&
      post.type === "blog" &&
      !post.draft &&
      isContentIndexable(post) &&
      countContentWords(post.content) >= BLOG_AD_MIN_WORDS,
  );
