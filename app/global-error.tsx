'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Terjadi Kesalahan Global</h2>
            <p className="mb-4">Aplikasi mengalami masalah. Silakan refresh halaman.</p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-red-600 text-white rounded-lg"
            >
              Reset
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
