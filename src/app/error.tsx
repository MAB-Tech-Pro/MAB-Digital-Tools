"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
          Something Went Wrong
        </p>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
          An unexpected error has occurred.
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          This might have been caused by a temporary issue. You can try reloading the
          page or return to the homepage.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
          >
            Go to Home
          </Link>
        </div>

        {process.env.NODE_ENV !== "production" && error?.message && (
          <p className="mt-6 text-[11px] leading-snug text-gray-400">
            <span className="font-semibold">Developer Info:</span> {error.message}
          </p>
        )}
      </div>
    </main>
  );
}
