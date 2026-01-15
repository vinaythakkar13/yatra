import Link from 'next/link';

export default function RegisterError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-spiritual-zen-surface p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-spiritual-zen-accent/20 p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-100 rounded-full">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-spiritual-zen-charcoal mb-3">
          No Active Yatra Found
        </h2>
        <p className="text-spiritual-textLight mb-6">
          There is currently no active yatra available for registration.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-spiritual-zen-forest text-white rounded-lg hover:bg-spiritual-zen-charcoal hover:shadow-lg transition-all"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

