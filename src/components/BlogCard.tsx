"use client";

import * as React from "react";
import Link from "next/link";
import { formatDateUTC, getRelativeLabel } from "@/lib/date";

type Blog = {
  slug: string;
  title: string;
  excerpt?: string;
  description?: string;
  publishedAt?: string;
  date?: string;
  createdAt?: string;
};

export default function BlogCard({ blog }: { blog: Blog }) {
  const publishedISO =
    blog.publishedAt || blog.date || blog.createdAt || null;

  // relative time state
  const [rel, setRel] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!publishedISO) return;
    setRel(getRelativeLabel(publishedISO));
  }, [publishedISO]);

  const staticDate = publishedISO ? formatDateUTC(publishedISO) : "";

  return (
    <article className="group rounded-2xl border bg-white p-5 hover:shadow-sm transition">
      <header className="mb-2">
        {staticDate ? (
          <span
            className="text-xs text-gray-500"
            suppressHydrationWarning
          >
            {rel ?? staticDate}
          </span>
        ) : null}
        <h3 className="mt-1 text-base font-semibold leading-snug">
          <Link
            href={`/blog/${blog.slug}`}
            className="hover:underline"
          >
            {blog.title}
          </Link>
        </h3>
      </header>

      <p className="text-sm text-gray-600 line-clamp-3">
        {blog.excerpt ?? blog.description ?? ""}
      </p>

      <div className="mt-4 text-sm text-blue-600">Read More →</div>
    </article>
  );
}
