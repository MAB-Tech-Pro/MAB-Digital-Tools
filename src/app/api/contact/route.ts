// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

// Ensure Node runtime (not edge)
export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_TO = process.env.CONTACT_TO || "info@themabtech.com";
const CONTACT_FROM = process.env.CONTACT_FROM || "MAB Digital Tools <noreply@themabtech.com>";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body?.name ?? "").toString().trim();
    const email = (body?.email ?? "").toString().trim();
    const topic = (body?.topic ?? "feedback").toString().trim();
    const message = (body?.message ?? "").toString().trim();

    // Basic validation
    const emailOk = /^\S+@\S+\.\S+$/.test(email);
    if (name.length < 2 || !emailOk || message.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Validation failed" },
        { status: 400 }
      );
    }

    const subject =
      (topic === "bug" && "Bug Report") ||
      (topic === "feature" && "Feature Request") ||
      "General Feedback";

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#111">
        <h2 style="margin:0 0 12px">New Contact Message</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Topic:</b> ${escapeHtml(topic)}</p>
        <hr style="margin:12px 0; border:none; border-top:1px solid #eee"/>
        <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message)}</pre>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      replyTo: email,
      subject: `[MAB Digital Tools] ${subject}: ${name}`,
      html,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message || "Email send failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
