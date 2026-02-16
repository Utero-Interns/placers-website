'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
        <p className="text-gray-600 mb-6">
          Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <p className="text-sm text-gray-500 mb-4 font-mono bg-gray-100 p-3 rounded">
            {error.message}
          </p>
        )}
        <button
          onClick={reset}
          className="w-full px-6 py-3 bg-[#D12027] text-white rounded-lg hover:bg-[#B01820] transition-colors font-semibold"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
