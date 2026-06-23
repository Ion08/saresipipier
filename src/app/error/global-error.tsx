"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-6xl text-accent mb-4">Error</h1>
          <p className="text-text-light mb-8">Something went wrong</p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-rosso text-white font-bold uppercase tracking-wider"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
