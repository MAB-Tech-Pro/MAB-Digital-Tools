// src/app/tools/[id]/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import toolsData from "../../../data/tools.json";

// Types (lightweight to match your demo JSON)
type Tool = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  features?: string[];
  steps?: string[];
};

// ------- SEO: per-tool dynamic metadata -------
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const tool = (toolsData as Tool[]).find((t) => String(t.id) === String(params.id));
  const title = tool ? `${tool.name} • MAB Digital Tools` : "Tool • MAB Digital Tools";
  const description =
    tool?.description ||
    "Fast, privacy-friendly online utilities by MAB Tech. No sign-up required.";

  return {
    title,
    description,
    alternates: {
      canonical: `/tools/${params.id}`,
    },
    openGraph: {
      title,
      description,
      url: `/tools/${params.id}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

// ------- Page -------
export default function ToolDetailPage({ params }: { params: { id: string } }) {
  const tool = (toolsData as Tool[]).find((t) => String(t.id) === String(params.id));

  if (!tool) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/tools" className="hover:underline">← Back to Tools</Link>
        </nav>
        <div className="rounded-2xl border bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Tool not found</h1>
          <p className="mt-2 text-gray-600">Requested tool does not exist.</p>
        </div>
      </div>
    );
  }

  // Fallbacks for optional demo fields
  const features = tool.features && tool.features.length > 0
    ? tool.features
    : [
        "Fast processing with a clean UI",
        "Privacy-friendly — no account required",
        "Works on all modern devices",
      ];

  const steps = tool.steps && tool.steps.length > 0
    ? tool.steps
    : [
        "Open the tool from this page.",
        "Add your input (upload/paste).",
        "Click Process and download your result.",
      ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/tools" className="hover:underline">Tools</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{tool.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{tool.name}</h1>
        {tool.category ? (
          <div className="mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-gray-600">
            {tool.category}
          </div>
        ) : null}
        {tool.description ? (
          <p className="mt-3 text-gray-700 max-w-3xl">{tool.description}</p>
        ) : null}
      </header>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-10">
        {/* Primary CTA — same page, future UI can mount below */}
        <Link
          href={`/tools/${tool.id}`}
          className="px-5 py-3 bg-blue-600 text-white rounded-lg text-sm md:text-base hover:bg-blue-700 transition font-medium inline-block"
        >
          Start Using {tool.name}
        </Link>
        <Link
          href="/contact-us"
          className="px-5 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm md:text-base hover:bg-gray-100 transition font-medium inline-block"
        >
          Report an Issue / Request Feature
        </Link>
      </div>

      {/* Layout: Overview (left) + Help (right) */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Left: Overview / Features */}
        <section className="md:col-span-2">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
            <p className="mt-2 text-sm text-gray-700">
              Use this tool to quickly process your content with a minimal, distraction-free workflow.
              It’s designed to be fast, stable, and privacy-friendly.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-gray-900">Key Features</h3>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-base leading-6">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Placeholder: Real UI mount area */}
          <div className="mt-8 rounded-2xl border border-dashed bg-white p-6 text-center text-gray-600">
            <p className="font-medium">Tool UI Placeholder</p>
            <p className="mt-1 text-sm">
              Yahan par aap is tool ka actual UI mount karein (forms, inputs, output).  
              Abhi demo data ke sath ye section placeholder rakha gaya hai.
            </p>
          </div>
        </section>

        {/* Right: How to Use / Notes */}
        <aside className="md:col-span-1">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">How to Use</h3>
            <ol className="mt-2 list-decimal pl-5 text-sm text-gray-700 space-y-1">
              {steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>

            <div className="mt-5 rounded-xl bg-gray-50 border p-4">
              <p className="text-xs text-gray-500">
                Note: Hamaray tools privacy-first approach follow karte hain. Sensitve data upload na karein.
              </p>
            </div>
          </div>

          {/* Optional legal/info note (generic) */}
          <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900">Info</h4>
            <p className="mt-2 text-sm text-gray-700">
              Kuch tools 3rd-party content policies ke under aate hain. Humesha allowed sources ka hi istemal karein.
            </p>
          </div>
        </aside>
      </div>

      {/* Footer Nav */}
      <div className="mt-10">
        <Link href="/tools" className="text-blue-600 hover:underline font-medium">
          ← Back to All Tools
        </Link>
      </div>
    </div>
  );
}
