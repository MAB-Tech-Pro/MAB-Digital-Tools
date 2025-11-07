"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toolsData from "../../data/tools.json";

export default function ToolsPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return toolsData;
    return toolsData.filter((t) =>
      [t.name, t.description, t.category]
        .filter(Boolean)
        .some((v: string) => v.toLowerCase().includes(term))
    );
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">All Tools</h1>
        <p className="mt-2 text-gray-600">
          Lightweight, fast and privacy-friendly utilities. No sign-up required.
        </p>
      </header>

      {/* Search */}
      <div className="mb-8">
        <label htmlFor="tool-search" className="sr-only">
          Search tools
        </label>
        <input
          id="tool-search"
          type="text"
          placeholder="Search tools by name or description..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search tools"
        />
        <div className="mt-2 text-sm text-gray-500">
          Showing <span className="font-medium">{filtered.length}</span> of{" "}
          <span className="font-medium">{toolsData.length}</span> tools
        </div>
      </div>

      {/* Tools Grid (icons removed) */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 6) * 0.05, duration: 0.4 }}
              className="p-6 bg-white rounded-2xl shadow-sm border hover:shadow-md transition cursor-pointer"
            >
              {/* Icon intentionally removed */}
              <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
              {tool.category ? (
                <div className="mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-gray-600">
                  {tool.category}
                </div>
              ) : null}
              <p className="mt-2 text-sm text-gray-600">{tool.description}</p>

              <div className="mt-4">
                <Link
                  href={`/tools/${tool.id}`}
                  className="inline-block text-blue-600 hover:underline font-medium"
                >
                  Use Tool →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-600">
          No tools matched <span className="font-medium">“{q}”</span>. Try another search.
        </div>
      )}

      {/* Small note */}
      <div className="mt-10 text-xs text-gray-400">
        Tip: Press <kbd className="px-1 py-0.5 border rounded">Ctrl</kbd> +{" "}
        <kbd className="px-1 py-0.5 border rounded">K</kbd> to focus the search (if you implement a global shortcut later).
      </div>
    </div>
  );
}
