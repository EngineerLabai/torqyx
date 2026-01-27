import type { ReactNode } from "react";

type TableProps = {
  caption?: string;
  children: ReactNode;
};

export default function Table({ caption, children }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="mdx-table w-full text-sm text-slate-700">
        {caption ? (
          <caption className="caption-bottom border-t border-slate-200 px-4 py-2 text-xs text-slate-500">
            {caption}
          </caption>
        ) : null}
        {children}
      </table>
    </div>
  );
}
