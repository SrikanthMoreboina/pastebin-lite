import { getPasteAndIncrement } from '@/lib/kv';

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paste = await getPasteAndIncrement(id);

  // Message is still available
  if (paste) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-8">
        <div className="max-w-3xl w-full">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10">
            <h1 className="text-3xl font-bold text-white text-center mb-10">
              Secret Message
            </h1>

            <div className="bg-black/30 rounded-xl p-8 border border-white/10">
              <pre className="whitespace-pre-wrap text-lg text-white font-mono leading-relaxed">
                {paste.content}
              </pre>
            </div>

            {paste.maxViews !== null && (
              <p className="text-center mt-8 text-purple-200 text-lg">
                Views remaining:{' '}
                <span className="font-bold text-white">
                  {paste.maxViews - paste.views}
                </span>
              </p>
            )}
          </div>
        </div>
      </main>
    );
  }

  // Expired / Unavailable — simple unified message
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8">404</h1>
        <p className="text-3xl text-purple-200 mb-6">
          This message has expired
        </p>
        <p className="text-lg text-purple-300 max-w-md mx-auto">
          It was either viewed too many times or the time limit was reached.
          The message has been permanently destroyed.
        </p>
        <p className="text-purple-400 text-sm mt-12">
          Privacy first • No traces left
        </p>
      </div>
    </main>
  );
}