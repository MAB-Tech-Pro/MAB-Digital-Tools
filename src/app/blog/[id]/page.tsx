import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogs } from "@/data/blog";

type Params = { id: string };

export function generateStaticParams() {
  return blogs.map((b) => ({ id: b.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const post = blogs.find((b) => b.slug === params.id);
  if (!post) {
    return { title: "Post Not Found • MAB Digital Tools", robots: { index: false } };
  }
  const title = `${post.title} • MAB Digital Tools`;
  const description = post.excerpt ?? "Read this post on MAB Digital Tools.";
  const path = `/blog/${post.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default function BlogDetailPage({ params }: { params: Params }) {
  const post = blogs.find((b) => b.slug === params.id);
  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <nav className="mb-4">
        <Link href="/blog" className="text-sm text-muted-foreground hover:underline">
          ← Back to blog
        </Link>
      </nav>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{post.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{post.author ?? "MAB Tech"}</span>
          {post.date ? <span>• {new Date(post.date).toLocaleDateString()}</span> : null}
          {/* category removed */}
          {post.tags?.length ? (
            <span className="inline-flex items-center gap-1">
              • {post.tags.map((t) => `#${t}`).join(" ")}
            </span>
          ) : null}
        </div>
        {post.excerpt ? (
          <p className="mt-3 text-sm text-muted-foreground">{post.excerpt}</p>
        ) : null}
        {post.cover ? (
          <img
            src={post.cover}
            alt={post.title}
            className="mt-4 aspect-video w-full rounded-2xl object-cover border"
          />
        ) : null}
      </header>

      <div className="my-6 h-px w-full bg-border" />

      <article className="prose prose-sm max-w-none dark:prose-invert">
        {post.content ? (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <p className="text-sm text-muted-foreground">Content coming soon. Stay tuned!</p>
        )}
      </article>
    </main>
  );
}
