"use client";

import { useState } from "react";

interface TikTokPreviewData {
  title: string;
  authorName: string;
  authorUrl?: string;
  thumbnailUrl: string;
  embedHtml: string;
  originalUrl: string;
}

export default function TikTokDownloaderClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TikTokPreviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [showEmbed, setShowEmbed] = useState(false);

  const handlePasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard) {
        setError("Clipboard access not available in this browser.");
        return;
      }
      const text = await navigator.clipboard.readText();
      if (!text) {
        setError("Clipboard is empty.");
        return;
      }
      setUrl(text);
      setError(null);
    } catch {
      setError("Failed to paste from clipboard.");
    }
  };

  const handleFetchPreview = async () => {
    if (!url.trim()) {
      setError("Please enter a TikTok video URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    setInfoMessage(null);
    setShowEmbed(false);

    try {
      const res = await fetch("/api/tools/tiktok-oembed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Failed to fetch TikTok preview.");
      }

      const preview: TikTokPreviewData = {
        title: json.title,
        authorName: json.authorName,
        authorUrl: json.authorUrl,
        thumbnailUrl: json.thumbnailUrl,
        embedHtml: json.embedHtml,
        originalUrl: json.originalUrl,
      };

      setData(preview);
      setInfoMessage(
        "This preview uses TikTok's official embed. Direct video downloads are not provided."
      );
    } catch (err: any) {
      setError(err?.message || "Something went wrong while fetching preview.");
    } finally {
      setLoading(false);
    }
  };

  const handleWatchInside = () => {
    if (!data) return;
    setShowEmbed(true);
  };

  const handleOpenOnTikTok = () => {
    if (!data) return;
    window.open(data.originalUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.originalUrl);
      setInfoMessage("TikTok link copied to clipboard.");
    } catch {
      setError("Failed to copy link.");
    }
  };

  const handleCopyEmbedCode = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.embedHtml);
      setInfoMessage("Embed code copied to clipboard.");
    } catch {
      setError("Failed to copy embed code.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border border-gray-300 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
            placeholder="Paste TikTok video link here..."
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePasteFromClipboard}
            className="flex-1 sm:flex-none px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
          >
            Paste
          </button>
          <button
            type="button"
            onClick={handleFetchPreview}
            disabled={loading}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
          >
            {loading ? "Loading..." : "Generate Preview"}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {infoMessage && (
          <p className="text-sm text-amber-700" role="status">
            {infoMessage}
          </p>
        )}
      </div>

      {/* Result area */}
      {data && (
        <div className="space-y-4 border border-gray-200 rounded-lg p-4 sm:p-5 bg-gray-50">
          {/* Thumbnail + meta */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
            <div className="w-full sm:w-64">
              <div className="relative w-full overflow-hidden rounded-lg bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.thumbnailUrl}
                  alt={data.title || "TikTok video thumbnail"}
                  className="w-full h-full max-h-80 object-cover"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                {data.title || "TikTok video"}
              </h2>
              <p className="text-sm text-gray-500">
                by{" "}
                {data.authorUrl ? (
                  <a
                    href={data.authorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-gray-700"
                  >
                    {data.authorName}
                  </a>
                ) : (
                  data.authorName
                )}
              </p>
              <p className="text-xs text-gray-400">
                This tool uses TikTok&apos;s official oEmbed API for legal
                previews and embeds. Direct video downloads are not provided.
              </p>
            </div>
          </div>

          {/* Optional embed preview inside card */}
          {showEmbed && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="relative w-full overflow-hidden">
                <div
                  className="w-full"
                  // TikTok oEmbed returns responsive iframe HTML
                  dangerouslySetInnerHTML={{ __html: data.embedHtml }}
                />
              </div>
            </div>
          )}

          {/* Action buttons (4 buttons layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {/* Button 1: Watch inside page (embed) */}
            <button
              type="button"
              onClick={handleWatchInside}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
            >
              <span>Watch inside page</span>
            </button>

            {/* Button 2: Open on TikTok */}
            <button
              type="button"
              onClick={handleOpenOnTikTok}
              className="flex items-center justify-center px-4 py-2.5 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
            >
              Open on TikTok
            </button>

            {/* Button 3: Copy share link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center justify-center px-4 py-2.5 rounded-md bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1"
            >
              Copy share link
            </button>

            {/* Button 4: Copy embed code */}
            <button
              type="button"
              onClick={handleCopyEmbedCode}
              className="flex items-center justify-center px-4 py-2.5 rounded-md bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-1"
            >
              Copy embed code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
