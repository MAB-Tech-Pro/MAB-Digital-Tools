// src/data/tools.ts
export type Tool = {
  id: number;
  slug: string;            // e.g. "pdf-to-image"
  name: string;            // e.g. "PDF to Image"
  description: string;
  category?: string;       // e.g. "Video Downloader"
  icon?: string;           // emoji or lucide icon name
  status?: "demo" | "beta" | "stable";
  route?: string;
};

export const tools: Tool[] = [
  {
    id: 1,
    slug: "tiktok-video-downloader",
    name: "TikTok Video Downloader",
    description: "Download videos you have rights to save.",
    category: "Video Downloader",
    status: "beta",
    icon: "🎵",
  },
  {
    id: 2,
    slug: "tellabot",
    name: "Tellabot Integration Tool",
    description:
      "Manage Tellabot virtual numbers: request MDNs, read SMS codes, cancel or reactivate numbers using your Tellabot username and API key.",
    category: "Virtual Numbers & SMS",
    status: "beta",
    icon: "📱",
    route: "/tools/tellabot",
  },
];
