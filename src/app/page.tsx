"use client";

import CountUp from "react-countup"
import Link from "next/link"
import { motion } from "framer-motion";
import toolsData from "../data/tools.json"
import blogData from "../data/blog.json"
import ToolCard from "../components/ToolCard"
import BlogCard from "../components/BlogCard"

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Hero Section with Floating Shapes */}
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

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="relative z-10 mt-8 flex justify-center gap-4 flex-wrap"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="/tools"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition font-medium"
          >
            Browse Tools
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="/contact-us"
            className="px-6 py-3 border border-gray-400 text-gray-700 rounded-lg text-lg hover:bg-gray-100 transition font-medium"
          >
            Contact Us
          </motion.a>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="relative z-10 mt-10 max-w-xl mx-auto px-4"
        >
          <input
            type="text"
            placeholder="Search tools..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>
      </section>

      {/* Feature Cards */}
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

      {/* Counter Section */}
      <section className="mt-20 text-center select-none">
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

      {/* Featured Tools Section */}
      <section className="mb-16 select-none">
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
              <div className="text-4xl mb-3">{tool.icon}</div>
              <h3 className="font-semibold text-xl mb-2 text-gray-800">{tool.name}</h3>
              <p className="text-gray-600 text-sm font-normal">{tool.description}</p>
              <Link href={`/tools/${tool.id}`} className="mt-4 inline-block text-blue-600 hover:underline font-medium">
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

      {/* Recent Blog Posts Section */}
      <section className="mb-16 select-none">
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
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
              )}
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">{blog.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 font-normal">{blog.description}</p>
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
  )
}
