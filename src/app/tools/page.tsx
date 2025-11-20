"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { tools } from "@/data/tools";

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}>
      <ToolsPageInner />
    </Suspense>
  );
}

function ToolsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [q, setQ] = React.useState<string>(initialQ);

  const listRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const id = setTimeout(() => {
      const sp = new URLSearchParams(Array.from(searchParams.entries()));
      if (q) sp.set("q", q);
      else sp.delete("q");
      router.replace(`/tools${sp.toString() ? `?${sp.toString()}` : ""}`);
    }, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const normalized = (s: string) =>
    s.toLowerCase().normalize("NFKD").replace(/\s+/g, " ").trim();

  const filtered = React.useMemo(() => {
    if (!q) return tools;
    const n = normalized(q);
    return tools.filter((t) => {
      const hay = `${t.name ?? ""} ${t.description ?? ""}`.toLowerCase();
      return hay.includes(n);
    });
  }, [q]);

  const onSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="mx-auto w-full max-w-7xl p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Tools</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="w-full sm:w-80">
          <form onSubmit={onSubmit} className="relative">
            <label htmlFor="tool-search" className="sr-only">Search tools</label>
            <input
              id="tool-search"
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
              placeholder="Search by name or description…"
              className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-0 focus:border-ring"
              autoComplete="off"
              enterKeyHint="search"
            />
            {q ? (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
                type="button"
                onClick={() => setQ("")}
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
          No matching tools. Try a different keyword.
        </div>
      ) : (
        <section ref={listRef} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="group rounded-2xl border bg-background p-5 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border text-base">
                  {t.icon ?? "🛠️"}
                </div>
                <div>
                  <h2 className="text-base font-medium leading-none">{t.name}</h2>
                </div>
              </div>
              {t.description ? (
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{t.description}</p>
              ) : null}
              <div className="mt-4 text-sm opacity-70 transition group-hover:opacity-100">
                View →
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
