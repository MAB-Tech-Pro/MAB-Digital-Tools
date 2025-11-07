"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";

const SUPPORT_EMAIL = "info@themabtech.com";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("feedback");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; msg: string }>(null);

  const canSend = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      /\S+@\S+\.\S+/.test(email) &&
      message.trim().length >= 10
    );
  }, [name, email, message]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSend || submitting) return;

      setSubmitting(true);
      setResult(null);

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, topic, message }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || `Failed to send (HTTP ${res.status})`);
        }

        setResult({ ok: true, msg: "Message sent successfully. We'll reply soon!" });
        setName("");
        setEmail("");
        setTopic("feedback");
        setMessage("");
      } catch (err: any) {
        setResult({ ok: false, msg: err?.message || "Something went wrong" });
      } finally {
        setSubmitting(false);
      }
    },
    [canSend, submitting, name, email, topic, message]
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-2 text-gray-600">
          Support, feedback ya feature requests — humein message bhejein. Hum simple aur fast communication prefer karte hain.
        </p>
      </header>

      <div className="rounded-2xl border bg-white p-6 shadow-sm mb-8">
        <p className="text-sm text-gray-700">
          Prefer direct email?{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-600 hover:underline font-medium">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border bg-white p-6 shadow-sm" noValidate>
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-800">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Muhammad Ali"
            aria-required="true"
            aria-invalid={name.trim().length > 0 && name.trim().length < 2}
          />
          <p className="mt-1 text-xs text-gray-500">At least 2 characters.</p>
        </div>

        {/* Email */}
        <div className="mt-5">
          <label htmlFor="email" className="block text-sm font-medium text-gray-800">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            aria-required="true"
            aria-invalid={email.length > 0 && !/\S+@\S+\.\S+/.test(email)}
          />
          <p className="mt-1 text-xs text-gray-500">We’ll reply to this address.</p>
        </div>

        {/* Topic */}
        <div className="mt-5">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-800">
            Topic
          </label>
          <select
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select a topic"
          >
            <option value="feedback">General Feedback</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
          </select>
        </div>

        {/* Message */}
        <div className="mt-5">
          <label htmlFor="message" className="block text-sm font-medium text-gray-800">
            Message
          </label>
          <textarea
            id="message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your issue or idea..."
            aria-required="true"
            aria-invalid={message.length > 0 && message.length < 10}
          />
          <p className="mt-1 text-xs text-gray-500">At least 10 characters.</p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={!canSend || submitting}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 transition font-medium disabled:opacity-60"
            aria-disabled={!canSend || submitting}
          >
            {submitting ? "Sending..." : "Send Message"}
          </button>
          <Link
            href="/"
            className="rounded-lg border px-5 py-3 text-gray-700 hover:bg-gray-100 transition font-medium"
          >
            Cancel
          </Link>
        </div>

        {/* Result */}
        {result ? (
          <div
            className={`mt-4 rounded-lg border p-3 text-sm ${
              result.ok ? "border-green-300 text-green-700 bg-green-50" : "border-red-300 text-red-700 bg-red-50"
            }`}
          >
            {result.msg}
          </div>
        ) : null}
      </form>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
