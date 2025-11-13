// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Content Security Policy (report-only for now)
  const cspDirectives = [
    // default policy
    "default-src 'self'",

    // JS: self only, allow inline/eval for now (to avoid breaking existing behavior)
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",

    // CSS: self + inline + (optional) Google Fonts CSS
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

    // Images: self, data URLs, blobs
    "img-src 'self' data: blob:",

    // Fonts: self + (optional) Google Fonts
    "font-src 'self' https://fonts.gstatic.com",

    // XHR / fetch / websockets, etc.
    "connect-src 'self'",

    // Disallow embedding by other sites
    "frame-ancestors 'self'",

    // Restrict where forms can submit
    "form-action 'self'",

    // Prevent base tag from changing base URL
    "base-uri 'self'",

    // Prefer HTTPS for all subrequests
    "upgrade-insecure-requests",
  ].join("; ");

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Limit high-risk browser features
  response.headers.set(
    "Permissions-Policy",
    [
      "geolocation=()",
      "microphone=()",
      "camera=()",
      "fullscreen=(self)",
      "payment=()",
    ].join(", ")
  );

  // HSTS (only really effective over HTTPS, which Vercel uses)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // CSP in report-only mode so nothing breaks visually/functionally
  response.headers.set("Content-Security-Policy-Report-Only", cspDirectives);

  return response;
}

// Apply to all routes (pages + API)
// You can customize matcher later if needed.
export const config = {
  matcher: "/:path*",
};
