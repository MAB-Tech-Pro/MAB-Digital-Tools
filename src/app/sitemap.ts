// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import tools from "../data/tools.json";
import blog from "../data/blog.json";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://tools.themabtech.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/tools",
    "/blog",
    "/about",
    "/contact-us",
  ].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" ? 1.0 : 0.8,
  }));

  // Tools dynamic routes
  const toolRoutes: MetadataRoute.Sitemap = (tools as any[]).map((t) => ({
    url: `${SITE_URL}/tools/${t.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Blog dynamic routes
  const blogRoutes: MetadataRoute.Sitemap = (blog as any[]).map((b) => ({
    url: `${SITE_URL}/blog/${b.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...toolRoutes, ...blogRoutes];
}
