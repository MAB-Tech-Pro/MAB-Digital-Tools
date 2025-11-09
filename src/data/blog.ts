// src/data/blog.ts
export type Blog = {
  id: number;
  slug: string;                // URL slug, e.g. "seo-optimization-basics"
  title: string;
  excerpt: string;
  content?: string;            // (optional) HTML string for now; later CMS/MDX use kar sakte
  cover?: string;              // public/ ke andar image path ya full URL
  author?: string;
  date?: string;               // ISO: "2025-11-07"
  tags?: string[];
  category?: string;           // e.g. "SEO", "Product Updates"
  status?: "draft" | "published";
};

export const blogs: Blog[] = [
  {
    id: 1,
    slug: "digital-tools-overview",
    title: "Digital Tools Overview: Why They Matter",
    excerpt:
      "Creators, marketers, and developers ke liye digital tools workflows ko kaafi fast aur reliable banate hain.",
    cover: "/images/blogs/digital-tools.jpg",
    author: "MAB Tech",
    date: "2025-10-28",
    tags: ["Tools", "Productivity"],
    category: "Guides",
    status: "published",
    content: `
      <p>Is post me hum explain karte hain ke all-in-one tools hub ka kya fayda hota hai:
      <strong>speed</strong>, <strong>consistency</strong>, aur <strong>privacy</strong>.</p>
      <ul>
        <li>Ek jagah par multiple utilities → less context switching</li>
        <li>Consistent UI/UX → user learning curve kam</li>
        <li>Server-side processing with guardrails → safer handling</li>
      </ul>
    `,
  },
  {
    id: 2,
    slug: "seo-optimization-basics",
    title: "SEO Optimization Basics for 2025",
    excerpt:
      "Title/meta, clean URLs, fast loading, aur structured data — yeh sab abhi bhi fundamentals hain.",
    cover: "/images/blogs/seo-optimization.jpg",
    author: "MAB Tech",
    date: "2025-10-15",
    tags: ["SEO", "Marketing"],
    category: "SEO",
    status: "published",
    content: `
      <p>Start with basics: meaningful titles, meta descriptions, alt text, and a fast site.</p>
      <p>Next.js + Image Optimization, route-level metadata, aur sitemap/robots.xml properly configure karein.</p>
    `,
  },
  {
    id: 3,
    slug: "release-notes-oct-2025",
    title: "Release Notes — October 2025",
    excerpt: "UI polish, tools data typing, aur contact form reliability improvements.",
    cover: "/images/blogs/release-notes.jpg",
    author: "MAB Tech",
    date: "2025-10-05",
    tags: ["Changelog", "Release"],
    category: "Product Updates",
    status: "published",
    content: `
      <ul>
        <li>Tools data migrated to TypeScript module</li>
        <li>Search added on tools/blog listings</li>
        <li>Contact form validation + Resend integration hardening</li>
      </ul>
    `,
  },
];
