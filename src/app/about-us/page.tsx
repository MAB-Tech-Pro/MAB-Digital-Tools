// src/app/about/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About • MAB Digital Tools",
  description:
    "MAB Digital Tools ka mission: fast, privacy-first utilities jo bina sign-up ke turant kaam karen. Lightweight, responsive aur SEO-friendly.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About • MAB Digital Tools",
    description:
      "Fast, privacy-first utilities — no sign-up, no clutter. Learn more about our mission and approach.",
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About • MAB Digital Tools",
    description:
      "Fast, privacy-first utilities — no sign-up, no clutter. Learn more about our mission and approach.",
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">About MAB Digital Tools</h1>
        <p className="mt-2 text-gray-600">
          Fast, privacy-first utilities — no sign-up, no clutter. Yeh project simple workflows aur clean
          results ke liye design kiya gaya hai.
        </p>
      </header>

      {/* Mission */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
        <p className="mt-2 text-sm text-gray-700">
          Humara goal hai aise online tools banana jo instantly kaam karen, har device par smoothly
          chalain, aur aapki privacy ko respect karein. Isi liye hum signup, popups aur unnecessary
          distractions se bachte hain.
        </p>
      </section>

      {/* What we focus on */}
      <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">What We Focus On</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <span className="leading-6">•</span>
            <span>Performance-first builds — minimal bundle, fast load.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <span className="leading-6">•</span>
            <span>Privacy — inputs ko transiently handle karna (no accounts).</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <span className="leading-6">•</span>
            <span>Accessibility — clean UI, predictable keyboard navigation.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <span className="leading-6">•</span>
            <span>SEO — clear metadata, semantic sections, fast pages.</span>
          </li>
        </ul>
      </section>

      {/* Roadmap (light, since demo content) */}
      <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Roadmap</h2>
        <ol className="mt-2 list-decimal pl-5 text-sm text-gray-700 space-y-1">
          <li>Tools catalog expand — converters, downloaders, format helpers.</li>
          <li>Better per-tool docs &amp; in-app guidance.</li>
          <li>Stability improvements and performance tuning.</li>
        </ol>
        <p className="mt-3 text-sm text-gray-600">
          Aap feature request bhejna chahte hain?{" "}
          <Link href="/contact-us" className="text-blue-600 hover:underline font-medium">
            Contact us
          </Link>
          .
        </p>
      </section>

      {/* CTA */}
      <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Try Our Tools</h2>
        <p className="mt-2 text-sm text-gray-700">
          Start using the tools without any sign-up. Lightweight, responsive and easy.
        </p>
        <div className="mt-4">
          <Link
            href="/tools"
            className="inline-block rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 transition font-medium"
          >
            Explore Tools →
          </Link>
        </div>
      </section>
    </div>
  );
}
