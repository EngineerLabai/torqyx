"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMdxComponents } from "@/components/mdx";

type MDXClientProps = {
  source: MDXRemoteSerializeResult;
};

export default function MDXClient({ source }: MDXClientProps) {
  const { locale } = useLocale();
  return <MDXRemote {...source} components={getMdxComponents(locale)} />;
}
