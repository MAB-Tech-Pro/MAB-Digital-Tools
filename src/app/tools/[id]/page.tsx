import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { tools } from "@/data/tools";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tools.themabtech.com";

type Params = { id: string };

export function generateStaticParams() {
  return tools.map((t) => ({ id: t.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const tool = tools.find((t) => t.slug === params.id);
  if (!tool) {
    return { title: "Tool Not Found • MAB Digital Tools", robots: { index: false } };
  }
  const title = `${tool.name} • MAB Digital Tools`;
  const description = tool.description || "Explore this tool on MAB Digital Tools.";
  const path = `/tools/${tool.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default function ToolDetailPage({ params }: { params: Params }) {
  const tool = tools.find((t) => t.slug === params.id);
  if (!tool) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <nav className="mb-4">
        <Link href="/tools" className="text-sm text-muted-foreground hover:underline">
          ← Back to all tools
        </Link>
      </nav>

      <header className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border text-xl">
          {tool.icon ?? "🛠️"}
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{tool.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {/* category removed */}
            {tool.status ? (
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]">
                {tool.status}
              </span>
            ) : null}
          </div>
          {tool.description ? (
            <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
          ) : null}
        </div>
      </header>

      <div className="my-6 h-px w-full bg-border" />

      <section className="rounded-2xl border p-5">
        <h2 className="text-base font-medium">Tool Interface</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Yeh page abhi template/placeholder hai. TikTok Video Downloader yahin implement hoga.
        </p>
      </section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: tool.name,
            description: tool.description || "Explore this tool on MAB Digital Tools.",
            applicationCategory: tool.category || "Utility",
            operatingSystem: "Web",
            url: `${SITE_URL}/tools/${tool.slug}`,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            creator: {
              "@type": "Organization",
              name: "MAB Digital Tools",
            },
          }),
        }}
      />
    </main>
  );
}
