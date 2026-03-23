export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-black bg-white p-8 text-center shadow-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Invalid Connect Link
        </h1>
        <p className="text-gray-600">
          Use the full connect URL shared with you to continue.
        </p>
      </div>
    </main>
  );
}
