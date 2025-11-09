// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

// Lightweight schema without zod to avoid extra deps; feel free to use zod if you prefer.
type Payload = {
  name?: string;
  email?: string;
  message?: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

const isEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    const name = (body.name ?? "").toString().trim();
    const email = (body.email ?? "").toString().trim();
    const message = (body.message ?? "").toString().trim();

    // Basic validation
    const errors: Record<string, string> = {};
    if (!name || name.length < 2) errors.name = "Please enter your full name.";
    if (!email || !isEmail(email)) errors.email = "Please enter a valid email.";
    if (!message || message.length < 10)
      errors.message = "Message must be at least 10 characters.";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    const TO = process.env.CONTACT_TO;
    const FROM = process.env.CONTACT_FROM;

    if (!TO || !FROM || !process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Email service not configured. Please try again later.",
        },
        { status: 500 }
      );
    }

    // Compose email
    const subject = `New contact message from ${name}`;
    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;">
        <h2 style="margin:0 0 12px;">New Contact Message</h2>
        <p style="margin:0 0 6px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 6px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin:12px 0 6px;"><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;background:#f7f7f8;border:1px solid #eee;padding:12px;border-radius:8px;">${escapeHtml(
          message
        )}</pre>
      </div>
    `;

    // Send with Resend
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email, // allows you to reply directly
      subject,
      html,
    });

    if (error) {
      // Resend SDK level error
      return NextResponse.json(
        { ok: false, error: "Failed to send message. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: unknown) {
    // Parse JSON error or unexpected failures
    return NextResponse.json(
      { ok: false, error: "Unexpected error. Please try again later." },
      { status: 500 }
    );
  }
}

// Small HTML escape helper
function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
