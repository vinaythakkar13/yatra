export default function RegisterLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-spiritual-zen-surface p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-spiritual-zen-accent/20 p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spiritual-zen-forest"></div>
        </div>
        <h2 className="text-xl font-bold text-spiritual-zen-charcoal mb-2">
          Loading Yatra Details
        </h2>
        <p className="text-sm text-spiritual-textLight">
          Please wait while we fetch the yatra information...
        </p>
      </div>
    </div>
  );
}

