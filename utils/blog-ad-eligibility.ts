import { isContentIndexable } from "@/utils/content-quality";

type BlogAdCandidate = {
  type: "blog" | "guides" | "glossary" | "qa";
  title: string;
  description: string;
  content: string;
  draft?: boolean;
};

export const isBlogPostAdEligible = (post: BlogAdCandidate | null | undefined) =>
  Boolean(post && post.type === "blog" && !post.draft && isContentIndexable(post));
