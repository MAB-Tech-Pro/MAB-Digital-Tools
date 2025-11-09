"use client";

import * as React from "react";
import CountUp from "react-countup";
import Link from "next/link";
import { motion } from "framer-motion";
import { tools, type Tool } from "@/data/tools";
import { blogs, type Blog } from "@/data/blog";

/** ---------- Keyword pool (Google-like suggestions) ---------- */
function buildKeywordPool() {
  const base: string[] = [];

  // Tools: name, description, slug words
  for (const t of tools) {
    if (t.name) base.push(t.name);
    if (t.description) base.push(t.description);
    if (t.slug) base.push(t.slug.replace(/-/g, " "));
  }

  // Blogs: title, excerpt, tags, slug words
  for (const b of blogs) {
    if (b.title) base.push(b.title);
    if (b.excerpt) base.push(b.excerpt);
    if (b.slug) base.push(b.slug.replace(/-/g, " "));
    if (b.tags?.length) base.push(...b.tags);
  }

  // Split into tokens + keep phrases as-is; de-duplicate; min length 3
  const tokens = base
    .flatMap((s) => {
      const clean = s.trim();
      const words = clean.split(/[^a-zA-Z0-9]+/g).filter(Boolean);
      return [clean, ...words];
    })
    .map((s) => s.toLowerCase().trim())
    .filter((s) => s.length >= 3);

  return Array.from(new Set(tokens));
}

const KEYWORDS = buildKeywordPool();

function getSuggestions(q: string, limit = 8) {
  const n = q.toLowerCase().trim();
  if (n.length < 3) return [];

  // simple scoring: startsWith >> includes
  const scored = KEYWORDS
    .filter((k) => k.includes(n))
    .map((k) => ({
      k,
      score: (k.startsWith(n) ? 2 : 0) + (k.includes(n) ? 1 : 0) - k.length * 0.0005,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.k);

  return scored;
}

/** ------------------ Page ------------------ */
export default function Home() {
  // --- Search state ---
  const [q, setQ] = React.useState<string>("");

  // Debounce
  const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/\s+/g, " ").trim();
  const query = norm(q);
  const [debouncedQ, setDebouncedQ] = React.useState<string>("");
  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(query), 180);
    return () => clearTimeout(id);
  }, [query]);

  // Suggestions state
  const [showSug, setShowSug] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState<number>(-1);
  const suggestions = React.useMemo(() => getSuggestions(q, 8), [q]);
  const sugVisible = showSug && q.length >= 3 && suggestions.length > 0;

  // Filters (3+ chars trigger)
  const filteredTools = React.useMemo(() => {
    if (debouncedQ.length < 3) return [];
    return tools.filter((t) => {
      const hay = `${t.name ?? ""} ${t.description ?? ""}`.toLowerCase();
      return hay.includes(debouncedQ);
    });
  }, [debouncedQ]);

  const filteredBlogs = React.useMemo(() => {
    if (debouncedQ.length < 3) return [];
    return blogs.filter((b) => {
      const hay = `${b.title ?? ""} ${b.excerpt ?? ""} ${b.content ?? ""}`.toLowerCase();
      return hay.includes(debouncedQ);
    });
  }, [debouncedQ]);

  const showInline = debouncedQ.length >= 3;

  // ✅ Enter submit fix + smooth scroll target
  const resultsRef = React.useRef<HTMLDivElement | null>(null);
  const handleHeroSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();           // stop focus jump (mobile “Next” issue)
    setShowSug(false);
    setActiveIdx(-1);
    const current = (debouncedQ || q || "").trim();
    if (current.length >= 3) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const applySuggestion = (val: string) => {
    setQ(val);
    setShowSug(false);
  };

  // highlight match helper
  const highlight = (text: string, q: string) => {
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, i)}
        <mark className="bg-yellow-200 px-0.5">{text.slice(i, i + q.length)}</mark>
        {text.slice(i + q.length)}
      </>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ================= HERO ================= */}
      <section className="relative py-20 text-center select-none">
        {/* Floating Blobs */}
        <motion.div
          className="absolute -top-20 -left-20 w-60 h-60 bg-blue-300 rounded-full opacity-30 blur-3xl"
          animate={{ x: [0, 20, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "loop" }}
        />
        <motion.div
          className="absolute top-0 right-10 w-72 h-72 bg-pink-300 rounded-full opacity-30 blur-3xl"
          animate={{ x: [0, -25, 15, 0], y: [0, 20, -20, 0], scale: [1, 0.95, 1.05, 1] }}
          transition={{ duration: 14, repeat: Infinity, repeatType: "loop", delay: 2 }}
        />
        <motion.div
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-green-300 rounded-full opacity-20 blur-3xl"
          animate={{ x: [0, 30, -30, 0], y: [0, -20, 25, 0], scale: [1, 1.05, 0.95, 1] }}
          transition={{ duration: 16, repeat: Infinity, repeatType: "loop", delay: 4 }}
        />

        {/* Hero Text */}
        <motion.h1
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-4xl md:text-6xl font-bold text-gray-900"
        >
          Powerful & Free Online Tools
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative z-10 mt-4 text-lg text-gray-700 max-w-2xl mx-auto font-normal"
        >
          Boost your productivity with fast & smart tools for text, SEO, images, and more.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="relative z-10 mt-8 flex justify-center gap-4 flex-wrap"
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/tools"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition font-medium inline-block"
            >
              Browse Tools
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/contact-us"
              className="px-6 py-3 border border-gray-400 text-gray-700 rounded-lg text-lg hover:bg-gray-100 transition font-medium inline-block"
            >
              Contact Us
            </Link>
          </motion.div>
        </motion.div>

        {/* ✅ Search + Suggestions wrapped in <form> (Enter fix) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="relative z-10 mt-10 max-w-xl mx-auto px-4"
        >
          <form onSubmit={handleHeroSubmit} className="relative">
            <input
              type="text"
              placeholder="Search tools & blog…"
              aria-label="Search tools and blog"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setShowSug(true);
                setActiveIdx(-1);
              }}
              onFocus={() => setShowSug(true)}
              onBlur={() => setTimeout(() => setShowSug(false), 120)} // allow click
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setQ("");
                  setShowSug(false);
                  setActiveIdx(-1);
                  return;
                }
                if (e.key === "Enter") {
                  // Enter = select suggestion if any, otherwise submit/scroll
                  e.preventDefault();
                  if (sugVisible && activeIdx >= 0 && activeIdx < suggestions.length) {
                    applySuggestion(suggestions[activeIdx]);
                    return;
                  }
                  handleHeroSubmit();
                }
                if (!sugVisible) return;
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveIdx((p) => Math.min(p + 1, suggestions.length - 1));
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveIdx((p) => Math.max(p - 1, 0));
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
            />
            {q ? (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setShowSug(false);
                  setActiveIdx(-1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-gray-100"
              >
                Clear
              </button>
            ) : null}

            {/* Suggestions dropdown */}
            {sugVisible && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl border bg-white text-left shadow-xl overflow-hidden z-50">
                <ul className="max-h-[55vh] overflow-auto py-1">
                  {suggestions.map((s, i) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => applySuggestion(s)}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 ${
                          i === activeIdx ? "bg-gray-100" : ""
                        }`}
                      >
                        <span className="opacity-60">🔎</span>
                        <span className="text-left w-full">{highlight(s, q)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </motion.div>
      </section>

      {/* ================= INLINE SEARCH RESULTS ================= */}
      {showInline && (
        <section className="mt-4 select-none" ref={resultsRef}>
          {/* Tools */}
          <div className="rounded-2xl border bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Tools</h3>
              {filteredTools.length > 0 && (
                <Link
                  href={`/tools?q=${encodeURIComponent(q)}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  See all {filteredTools.length}
                </Link>
              )}
            </div>

            {filteredTools.length === 0 ? (
              <p className="text-sm text-muted-foreground">No matching tools.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTools.slice(0, 6).map((t: Tool) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="group rounded-2xl border p-4 hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border">
                        {t.icon ?? "🛠️"}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{t.name}</div>
                        {t.description ? (
                          <div className="text-xs text-gray-600 line-clamp-1">
                            {t.description}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="my-4 h-px w-full bg-gray-100" />

          {/* Blog */}
          <div className="rounded-2xl border bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Blog</h3>
              {filteredBlogs.length > 0 && (
                <Link
                  href={`/blog?q=${encodeURIComponent(q)}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  See all {filteredBlogs.length}
                </Link>
              )}
            </div>

            {filteredBlogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No matching posts.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBlogs.slice(0, 6).map((b: Blog) => (
                  <Link
                    key={b.slug}
                    href={`/blog/${b.slug}`}
                    className="group rounded-2xl border p-4 hover:shadow-sm transition"
                  >
                    <div className="text-sm font-medium">{b.title}</div>
                    {b.excerpt ? (
                      <div className="text-xs text-gray-600 line-clamp-2 mt-1">{b.excerpt}</div>
                    ) : null}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= REST OF PAGE (unchanged) ================= */}

      {/* FEATURE CARDS */}
      <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 select-none">
        <div className="p-6 bg-white shadow-md rounded-2xl border hover:shadow-lg transition">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-semibold text-lg">Fast & Lightweight</h3>
          <p className="text-gray-600 text-sm mt-1 font-normal">
            Ultra-optimized tools designed for instant performance.
          </p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-2xl border hover:shadow-lg transition">
          <div className="text-3xl mb-2">🛡️</div>
          <h3 className="font-semibold text-lg">Secure & Reliable</h3>
          <p className="text-gray-600 text-sm mt-1 font-normal">
            No login required. Your data stays on your device.
          </p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-2xl border hover:shadow-lg transition">
          <div className="text-3xl mb-2">💰</div>
          <h3 className="font-semibold text-lg">100% Free Tools</h3>
          <p className="text-gray-600 text-sm mt-1 font-normal">
            Every tool is completely free — no hidden cost.
          </p>
        </div>
      </section>

      {/* FEATURED TOOLS */}
      <section className="mt-16 select-none">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-blue-500 w-fit pb-1">
          Featured Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(tools ?? []).slice(0, 3).map((tool: Tool, index: number) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <h3 className="font-semibold text-xl mb-2 text-gray-800">{tool.name}</h3>
              {tool.description ? (
                <p className="text-gray-600 text-sm font-normal">{tool.description}</p>
              ) : null}
              <Link
                href={`/tools/${tool.slug}`}
                className="mt-4 inline-block text-blue-600 hover:underline font-medium"
              >
                Use Tool →
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 text-right">
          <Link href="/tools" className="text-green-600 hover:underline font-medium">
            View All Tools
          </Link>
        </div>
      </section>

      {/* COUNTERS */}
      <section className="mt-16 text-center select-none">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div>
            <h3 className="text-4xl font-bold text-blue-600">
              <CountUp end={tools.length} duration={2} />+
            </h3>
            <p className="text-gray-600 font-medium">Available Tools</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-green-600">
              <CountUp end={100} duration={2} separator="," />+
            </h3>
            <p className="text-gray-600 font-medium">Active Users</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-yellow-600">
              <CountUp end={10} duration={2} separator="," />+
            </h3>
            <p className="text-gray-600 font-medium">5-Star Feedback</p>
          </div>
        </div>
      </section>

      {/* RECENT BLOG POSTS */}
      <section className="mt-16 mb-16 select-none">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-green-500 w-fit pb-1">
          Recent Blog Posts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(blogs ?? []).slice(0, 3).map((blog: Blog, index: number) => (
            <motion.div
              key={blog.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">{blog.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 font-normal">
                  {blog.excerpt ?? ""}
                </p>
                <Link href={`/blog/${blog.slug}`} className="text-green-600 hover:underline font-medium">
                  Read More →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 text-right">
          <Link href="/blog" className="text-green-600 hover:underline font-medium">
            View All Posts
          </Link>
        </div>
      </section>
    </div>
  );
}
