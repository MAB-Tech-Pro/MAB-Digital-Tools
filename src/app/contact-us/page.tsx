"use client";

import * as React from "react";

export default function ContactUsPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [serverError, setServerError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setServerError(null);
    setErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.errors) setErrors(data.errors);
        else setServerError(data?.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }

      setSuccess("Thanks! Your message has been sent.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Contact Us</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Have a question or feedback? Send us a message.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border p-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Full name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            placeholder="John Doe"
            disabled={loading}
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          ) : null}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            placeholder="you@example.com"
            disabled={loading}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          ) : null}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            placeholder="How can we help?"
            disabled={loading}
          />
          {errors.message ? (
            <p className="mt-1 text-xs text-red-600">{errors.message}</p>
          ) : null}
        </div>

        {/* Foot */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:shadow disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send message"}
          </button>
          {success ? (
            <span className="text-sm text-green-600">{success}</span>
          ) : null}
          {serverError ? (
            <span className="text-sm text-red-600">{serverError}</span>
          ) : null}
        </div>
      </form>

      {/* (Optional) contact info / FAQs could go here */}
    </main>
  );
}
