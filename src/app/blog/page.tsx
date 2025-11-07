"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import blogData from "../../data/blog.json";

export default function BlogPage() {
  const posts = blogData || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Blog</h1>
        <p className="mt-2 text-gray-600">
          Updates, tips aur product changelogs — simple, short aur useful.
        </p>
      </header>

      {/* Empty state */}
      {posts.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-gray-600">
          Abhi koi post available nahi. Jaldi hi updates aayengi.
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any, idx: number) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 6) * 0.05, duration: 0.4 }}
              className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              {/* NOTE: No image by requirement */}
              <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>

              {post.date ? (
                <time className="mt-1 block text-xs text-gray-500">{post.date}</time>
              ) : null}

              <p className="mt-2 text-sm text-gray-600 line-clamp-3">{post.description}</p>

              <div className="mt-4">
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-block text-blue-600 hover:underline font-medium"
                >
                  Read More →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
