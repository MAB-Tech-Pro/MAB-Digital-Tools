import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
// Vercel Analytics & Speed Insights
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

/**
 * NOTE:
 * - Aapki global CSS me user-select: none already set hai (body + *).
 * - Is file me hum sirf SEO metadata improve kar rahe hain.
 * - LIVE URL ko yahan update rakhein (vercel domain ya custom domain).
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://tools.themabtech.com";

const SITE_NAME = "MAB Digital Tools";
const TITLE = `${SITE_NAME} — Free, Fast & Privacy-Friendly Utilities`;
const DESCRIPTION =
  "Convert PDFs, download videos (allowed sources), and more. No sign-up. Lightweight, responsive, and privacy-first tools by MAB Tech.";

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
  ],
  authors: [{ name: "MAB Tech" }],
  creator: "MAB Tech",
  publisher: "MAB Tech",
  alternates: {
    canonical: "/",
  },
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

export const viewport = {
  themeColor: "#0ea5e9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Performance & SEO friendly defaults */}
      <body className="flex flex-col min-h-screen">
        <SpeedInsights />
        <Header />
        <main className="flex-1 mt-16">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
