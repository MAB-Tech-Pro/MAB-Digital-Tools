// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

type Payload = {
  name?: string;
  email?: string;
  message?: string;
  // optional honeypot field (UI me nahi dikhana)
  website?: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

// ---------- Simple helpers ----------

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const clamp = (s: string, n: number) => (s.length > n ? s.slice(0, n) : s);

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ---------- Rate limiting (1 request / minute per IP) ----------

// NOTE: Vercel serverless par yeh in-memory map har instance ke andar rahega,
// isliye "best effort" rate limit hai (perfect global nahi, but bots ko slow karne ke liye kaafi hai).
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 1; // per window

// Map<ip, { count: number; windowStart: number }>
const ipUsage = new Map<string, { count: number; windowStart: number }>();

function getClientIp(req: Request): string {
  // X-Forwarded-For se pehla IP
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const ip = xff.split(",")[0]?.trim();
    if (ip) return ip;
  }
  // Fallback
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

function checkRateLimit(req: Request) {
  const ip = getClientIp(req);
  const now = Date.now();

  const entry = ipUsage.get(ip);
  if (!entry) {
    ipUsage.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }

  const elapsed = now - entry.windowStart;

  if (elapsed > RATE_LIMIT_WINDOW_MS) {
    // naya window start
    ipUsage.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil(
      (RATE_LIMIT_WINDOW_MS - elapsed) / 1000
    );
    return {
      allowed: false,
      retryAfterSeconds,
    };
  }

  entry.count += 1;
  ipUsage.set(ip, entry);
  return { allowed: true };
}

// ---------- Handler ----------

export async function POST(req: Request) {
  try {
    // 1) Rate limit check
    const rate = checkRateLimit(req);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: "Too many requests. Please try again in a minute.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rate.retryAfterSeconds ?? 60),
          },
        }
      );
    }

    // 2) Hard payload size cap (10KB)
    const contentLength = req.headers.get("content-length");
    if (contentLength && Number(contentLength) > 10 * 1024) {
      return NextResponse.json(
        { ok: false, error: "Payload too large." },
        { status: 413 }
      );
    }

    const body = (await req.json()) as Payload;

    // 3) Honeypot (bots ke liye)
    if (body.website) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // 4) Normalize + trim + clamp
    const name = clamp((body.name || "").trim(), 100);
    const email = clamp((body.email || "").trim(), 150);
    const message = clamp((body.message || "").trim(), 5000);

    // 5) Validation
    const errors: Record<string, string> = {};
    if (!name || name.length < 2) errors.name = "Name is required.";
    if (!email || !isEmail(email)) errors.email = "Valid email is required.";
    if (!message || message.length < 10) {
      errors.message = "Message must be at least 10 characters.";
    }

    if (Object.keys(errors).length) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    // 6) Email meta from env (no hardcoding)
    const FROM = process.env.RESEND_FROM_EMAIL;
    const TO =
      process.env.CONTACT_TO_EMAIL || process.env.RESEND_FROM_EMAIL || "";

    if (!FROM || !TO) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Email routing is not configured. Please set RESEND_FROM_EMAIL and CONTACT_TO_EMAIL.",
        },
        { status: 500 }
      );
    }

    const subject = `New contact message from ${name}`;
    const html = `
      <div>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;font-family:ui-monospace,monospace">${escapeHtml(
          message
        )}</pre>
      </div>
    `;

    // 7) Dev/preview safe guard
    const isProd =
      process.env.NODE_ENV === "production" &&
      (process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true);

    if (!isProd) {
      console.log("[contact][dev-preview] simulated email", {
        from: FROM,
        to: TO,
        subject,
      });
      return NextResponse.json({ ok: true, simulated: true });
    }

    // 8) Production send via Resend
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject,
      html,
    });

    if (error) {
      console.error("[contact] resend error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to send message. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] error:", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
