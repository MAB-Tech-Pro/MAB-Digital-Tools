"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BlogCard from "@/components/BlogCard";
import { blogs } from "@/data/blog";

// ✅ Export a tiny wrapper page that provides Suspense
export default function BlogPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}>
      <BlogPageInner />
    </Suspense>
  );
}

// 👇 Your existing logic moved here
function BlogPageInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const initialQ = sp.get("q") ?? "";
  const [q, setQ] = React.useState(initialQ);

  const listRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const id = setTimeout(() => {
      const next = new URLSearchParams(Array.from(sp.entries()));
      if (q) next.set("q", q);
      else next.delete("q");
      router.replace(`/blog${next.size ? `?${next.toString()}` : ""}`);
    }, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const norm = (s: string) =>
    s.toLowerCase().normalize("NFKD").replace(/\s+/g, " ").trim();

  const filtered = React.useMemo(() => {
    if (!q) return blogs;
    const n = norm(q);
    return blogs.filter((b) => {
      const hay = `${b.title ?? ""} ${b.excerpt ?? ""} ${b.content ?? ""}`.toLowerCase();
      return hay.includes(n);
    });
  }, [q]);

  const onSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="w-full sm:w-96">
          <form onSubmit={onSubmit} className="relative">
            <label htmlFor="blog-search" className="sr-only">Search blog</label>
            <input
              id="blog-search"
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setQ("");
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              placeholder="Search by title or content…"
              className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-ring"
              autoComplete="off"
              enterKeyHint="search"
            />
            {q ? (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
                aria-label="Clear search"
              >
                Clear
              </button>
            ) : null}
          </form>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border p-6 text-sm text-muted-foreground">
          No matching posts. Try a different keyword.
        </div>
      ) : (
        <section ref={listRef} className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <BlogCard key={b.slug} blog={b} />
          ))}
        </section>
      )}
    </main>
  );
}
