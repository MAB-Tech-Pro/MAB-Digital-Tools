"use client";

import CountUp from "react-countup";
import Link from "next/link";
import { motion } from "framer-motion";
import toolsData from "../data/tools.json";
import blogData from "../data/blog.json";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ================= HERO ================= */}
      <section className="relative py-20 text-center select-none overflow-hidden">
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
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-green-300 rounded-full opacity-20 blur-3xl"
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

        {/* Buttons (Next.js Link) */}
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

        {/* Search Input (static for now) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="relative z-10 mt-10 max-w-xl mx-auto px-4"
        >
          <input
            type="text"
            placeholder="Search tools..."
            aria-label="Search tools"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>
      </section>

      {/* ================= FEATURE CARDS (Benefits) ================= */}
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

      {/* ================= FEATURED TOOLS (Icons removed) ================= */}
      <section className="mt-16 select-none">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-blue-500 w-fit pb-1">
          Featured Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {toolsData.slice(0, 3).map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              {/* Icon removed as requested */}
              <h3 className="font-semibold text-xl mb-2 text-gray-800">{tool.name}</h3>
              <p className="text-gray-600 text-sm font-normal">{tool.description}</p>
              <Link
                href={`/tools/${tool.id}`}
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

      {/* ================= HOW IT WORKS ================= */}
      <section className="mt-16 select-none">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-purple-500 w-fit pb-1">
          How It Works
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { step: "1", title: "Select a Tool", desc: "Pick from converters, downloaders, and more." },
            { step: "2", title: "Add Input", desc: "Upload a file or paste a link — super simple." },
            { step: "3", title: "Get Result", desc: "Download instantly or copy to clipboard." },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="text-4xl font-bold text-purple-600">{s.step}</div>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= COUNTERS (Social Proof) ================= */}
      <section className="mt-16 text-center select-none">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div>
            <h3 className="text-4xl font-bold text-blue-600">
              <CountUp end={toolsData.length} duration={2} />+
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

      {/* ================= TESTIMONIALS ================= */}
      <section className="mt-16 select-none">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-amber-500 w-fit pb-1">
          What Users Say
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: "Ahsan", text: "Super fast and clean UI. Love the PDF converter!", rating: 5 },
            { name: "Sara", text: "No signup, no nonsense. Exactly what I needed.", rating: 5 },
            { name: "Bilal", text: "Video downloader works smoothly for allowed sources.", rating: 4 },
          ].map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="text-yellow-500 mb-2">
                {"⭐".repeat(t.rating)}{t.rating < 5 ? "☆" : ""}
              </div>
              <blockquote className="text-gray-700">{t.text}</blockquote>
              <figcaption className="mt-3 text-sm text-gray-500">— {t.name}</figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* ================= ABOUT / WHY CHOOSE US ================= */}
      <section className="mt-16 select-none">
        <div className="rounded-2xl border bg-white p-8 md:p-10 shadow-sm">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Why Choose MAB Digital Tools?</h2>
          <p className="text-gray-700 max-w-3xl">
            We build small, fast and privacy-first utilities so you can get results in seconds — without sign-ups,
            popups, or clutter. Everything is optimized for simple workflows and clean downloads.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            <li className="flex items-start gap-3">
              <span className="text-xl">✅</span><span>Privacy-respecting: process and go, no accounts.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">✅</span><span>Lightweight UI: minimal clicks, clear results.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">✅</span><span>Free forever: no hidden costs.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">✅</span><span>Regular new tools & improvements.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="mt-16 select-none">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-teal-500 w-fit pb-1">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-4">
          {[
            {
              q: "Is it free to use?",
              a: "Yes — all tools are free. If anything changes, we’ll announce clearly.",
            },
            {
              q: "Do I need to create an account?",
              a: "No account needed. Use and download instantly.",
            },
            {
              q: "Is my data stored?",
              a: "We aim to process inputs transiently. Avoid uploading sensitive data.",
            },
          ].map((f, i) => (
            <details key={i} className="rounded-xl border bg-white p-4 open:shadow-sm">
              <summary className="cursor-pointer select-none font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ================= RECENT BLOG POSTS (Images removed) ================= */}
      <section className="mt-16 mb-16 select-none">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 border-green-500 w-fit pb-1">
          Recent Blog Posts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogData.slice(0, 3).map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Image removed as requested */}
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">{blog.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 font-normal">
                  {blog.description}
                </p>
                <Link href={`/blog/${blog.id}`} className="text-green-600 hover:underline font-medium">
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
