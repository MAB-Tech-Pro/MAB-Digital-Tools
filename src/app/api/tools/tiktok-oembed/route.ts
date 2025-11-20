// src/app/api/tools/tiktok-oembed/route.ts
import { NextResponse } from "next/server";

interface OEmbedResponse {
  title: string;
  author_name: string;
  author_url?: string;
  thumbnail_url: string;
  html: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as { url?: string } | null;

    const rawUrl = body?.url?.trim();
    if (!rawUrl) {
      return NextResponse.json(
        { error: "TikTok URL is required." },
        { status: 400 }
      );
    }

    // Basic TikTok URL validation
    const tiktokUrlPattern = /^https?:\/\/(www\.)?tiktok\.com\//i;
    if (!tiktokUrlPattern.test(rawUrl)) {
      return NextResponse.json(
        { error: "Please enter a valid TikTok video URL." },
        { status: 400 }
      );
    }

    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(
      rawUrl
    )}`;

    const res = await fetch(oembedUrl, {
      // TikTok sometimes expects a browser-like User-Agent
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch TikTok preview data." },
        { status: 502 }
      );
    }

    const data = (await res.json()) as OEmbedResponse;

    if (!data || !data.thumbnail_url || !data.html) {
      return NextResponse.json(
        { error: "Invalid response from TikTok oEmbed." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        title: data.title,
        authorName: data.author_name,
        authorUrl: data.author_url,
        thumbnailUrl: data.thumbnail_url,
        embedHtml: data.html,
        originalUrl: rawUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("TikTok oEmbed API error:", error);
    return NextResponse.json(
      { error: "Unexpected error fetching TikTok preview." },
      { status: 500 }
    );
  }
}
