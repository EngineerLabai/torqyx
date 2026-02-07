import type { AnchorHTMLAttributes, HTMLAttributes } from "react";
import Callout from "./Callout";
import Formula from "./Formula";
import StepList from "./StepList";
import Table from "./Table";
import MdxImage from "./Image";
import ToolLink from "./ToolLink";
import Confidence from "./Confidence";

const mergeClassName = (base: string, extra?: string) => (extra ? `${base} ${extra}` : base);

const Anchor = ({ className, href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isExternal = href?.startsWith("http://") || href?.startsWith("https://");
  return (
    <a
      href={href}
      className={mergeClassName("text-emerald-700 underline-offset-4 hover:underline", className)}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      {...props}
    />
  );
};

const Paragraph = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={mergeClassName("text-[15px] leading-relaxed text-slate-700 md:text-base", className)} {...props} />
);

const UnorderedList = ({ className, ...props }: HTMLAttributes<HTMLUListElement>) => (
  <ul className={mergeClassName("list-disc space-y-2 pl-5 text-[15px] text-slate-700 md:text-base", className)} {...props} />
);

const OrderedList = ({ className, ...props }: HTMLAttributes<HTMLOListElement>) => (
  <ol className={mergeClassName("list-decimal space-y-2 pl-5 text-[15px] text-slate-700 md:text-base", className)} {...props} />
);

const ListItem = ({ className, ...props }: HTMLAttributes<HTMLLIElement>) => (
  <li className={mergeClassName("text-[15px] text-slate-700 md:text-base", className)} {...props} />
);

const HeadingTwo = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={mergeClassName("mt-10 text-2xl font-semibold text-slate-900 md:text-3xl", className)} {...props} />
);

const HeadingThree = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={mergeClassName("mt-8 text-xl font-semibold text-slate-900", className)} {...props} />
);

const HeadingFour = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h4 className={mergeClassName("mt-6 text-lg font-semibold text-slate-900", className)} {...props} />
);

const Blockquote = ({ className, ...props }: HTMLAttributes<HTMLQuoteElement>) => (
  <blockquote
    className={mergeClassName(
      "rounded-2xl border-l-4 border-slate-200 bg-slate-50 px-4 py-3 text-[15px] text-slate-600 md:text-base",
      className,
    )}
    {...props}
  />
);

const InlineCode = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const isBlock = className?.includes("language-");
  const baseClass = isBlock
    ? "text-slate-100"
    : "rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800";
  return <code className={mergeClassName(baseClass, className)} {...props} />;
};

const Pre = ({ className, ...props }: HTMLAttributes<HTMLPreElement>) => (
  <pre
    className={mergeClassName("overflow-x-auto rounded-2xl bg-slate-950 p-4 text-[13px] text-slate-100 md:text-sm", className)}
    {...props}
  />
);

export const mdxComponents = {
  Callout,
  Formula,
  StepList,
  Table,
  ToolLink,
  Confidence,
  Image: MdxImage,
  img: MdxImage,
  table: Table,
  a: Anchor,
  p: Paragraph,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  h2: HeadingTwo,
  h3: HeadingThree,
  h4: HeadingFour,
  blockquote: Blockquote,
  code: InlineCode,
  pre: Pre,
};

export default mdxComponents;
