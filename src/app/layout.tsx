import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
// Vercel Analytics & Speed Insights
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://tools.themabtech.com";

const SITE_NAME = "MAB Digital Tools";
const TITLE = `${SITE_NAME} — Free, Fast & Privacy-Friendly Utilities`;
const DESCRIPTION =
  "MAB Digital Tools provides fast, free, browser-based utilities for video downloads, file conversion, SEO helpers, and more. Lightweight, responsive, and privacy-first tools by MAB Tech.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s • ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "MAB Digital Tools",
    "Online Tools",
    "PDF to Image",
    "Video Downloader",
    "Free Tools",
    "SEO Tools",
    "Image Tools",
    "Document Tools",
    "MAB Tech",
  ],
  authors: [{ name: "MAB Tech", url: SITE_URL }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    // Agar aapke paas OG image ready ho, /og-image.png place karke uncomment karein:
    // images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    // images: ["/og-image.png"], // optional
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/tools?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      {/* Performance & SEO friendly defaults */}
      <body className="flex flex-col min-h-screen">
        <SpeedInsights />
        <Header />
        <main className="flex-1 mt-16">{children}</main>

        {/* Global WebSite JSON-LD (SEO only, no UI impact) */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteJsonLd),
          }}
        />

        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
