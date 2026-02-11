import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getMdxComponents } from "./index";
import type { Locale } from "@/utils/locale";

type MDXRendererProps = {
  source: string;
  locale?: Locale;
};

export default function MDXRenderer({ source, locale }: MDXRendererProps) {
  return (
    <MDXRemote
      source={source}
      components={getMdxComponents(locale)}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        },
      }}
    />
  );
}
