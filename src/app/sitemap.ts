// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { tools } from "@/data/tools";
import { blogs } from "@/data/blog";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://tools.themabtech.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/tools",
    "/blog",
    "/about-us",
    "/contact-us",
  ].map((p) => ({
    url: `${SITE_URL}${p ? p : ""}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const toolRoutes: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${SITE_URL}/tools/${t.slug}`, // ✅ use slug not id
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${SITE_URL}/blog/${b.slug}`, // ✅ use slug not id
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...toolRoutes, ...blogRoutes];
}
