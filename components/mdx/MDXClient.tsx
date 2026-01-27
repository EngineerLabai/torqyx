"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import mdxComponents from "@/components/mdx";

type MDXClientProps = {
  source: MDXRemoteSerializeResult;
};

export default function MDXClient({ source }: MDXClientProps) {
  return <MDXRemote {...source} components={mdxComponents} />;
}
