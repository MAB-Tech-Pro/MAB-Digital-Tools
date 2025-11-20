import type { Metadata } from "next";
import Ad728x90 from "@/components/ads/Ad728x90";
import Ad336x280 from "@/components/ads/Ad336x280";
import Ad300x600 from "@/components/ads/Ad300x600";
import Ad300x100 from "@/components/ads/Ad300x100";
import Ad300x250 from "@/components/ads/Ad300x250";
import TikTokDownloaderClient from "./TikTokDownloaderClient";

export const metadata: Metadata = {
  title: "TikTok Video Downloader | MAB Digital Tools",
  description:
    "Preview and embed TikTok videos using the MAB Digital Tools TikTok helper tool. Generate legal TikTok embeds, thumbnails, and share links.",
};

export default function TikTokDownloaderPage() {
  return (
    <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-6">
      {/* Top Ad - Desktop (728x90) */}
      <div className="hidden md:flex justify-center">
        <Ad728x90 />
      </div>

      {/* Top Ad - Mobile (300x100) */}
      <div className="md:hidden flex justify-center">
        <Ad300x100 />
      </div>

      {/* Main Layout: Side Ads + Tool Body */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1.5fr_300px] gap-4 items-start">
        {/* Left Sidebar Ad - Desktop (300x600) */}
        <div className="hidden md:flex justify-center">
          <Ad300x600 />
        </div>

        {/* Tool Area (center column) */}
        <section
          aria-label="TikTok Video Downloader"
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 space-y-4"
        >
          <header className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              TikTok Video Helper Tool
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              Preview TikTok videos, copy share links, and generate official embeds.
            </p>
          </header>

          <TikTokDownloaderClient />
        </section>

        {/* Right Sidebar Ad - Desktop (300x600) */}
        <div className="hidden md:flex justify-center">
          <Ad300x600 />
        </div>
      </div>

      {/* Bottom Ad - Desktop (728x90) */}
      <div className="hidden md:flex justify-center">
        <Ad728x90 />
      </div>

      {/* Bottom Ad - Mobile (300x250) */}
      <div className="md:hidden flex justify-center">
        <Ad300x250 />
      </div>
    </main>
  );
}
