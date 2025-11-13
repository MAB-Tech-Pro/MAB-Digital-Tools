// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
          404 — Page Not Found
        </p>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
          Sorry, we couldn’t find this page.
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          The page you are looking for may have been moved, deleted, or might never
          have existed. You can return to the homepage or explore available tools below.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Go to Home
          </Link>

          <Link
            href="/tools"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
          >
            Browse Tools
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Please check the URL for mistakes and try again.
        </p>
      </div>
    </main>
  );
}
