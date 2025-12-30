'use client';

import { useState } from 'react';
import { Loader2, Clock, Eye, Copy, Check } from 'lucide-react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult('');
    setCopied(false);
    setLoading(true);

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError('Message cannot be empty');
      setLoading(false);
      return;
    }

    const payload: any = { content: trimmedContent };
    if (ttl) payload.ttl_seconds = Number(ttl);
    if (maxViews) payload.max_views = Number(maxViews);

    try {
      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');

      setResult(data.url);
      setContent('');
      setTtl('');
      setMaxViews('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900  flex items-center justify-center px-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <header className="text-center mb-8 mt-2">
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            Pastebin Lite
          </h1>
          <p className="text-gray-400 mt-3">
            Share text securely with time & view limits
          </p>
        </header>

        {/* Card */}
        <div className="bg-black/30 border border-white/30 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT SIDE */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Message */}
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Message
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="Write your message here..."
                  className="w-full rounded-xl bg-[#0B0E14] border border-white/30 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4" />
                    Expire (seconds)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={ttl}
                    onChange={(e) => setTtl(e.target.value)}
                    className="w-full rounded-lg bg-[#0B0E14] border border-white/20 px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                    placeholder="3600"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                    <Eye className="w-4 h-4" />
                    Max views
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={maxViews}
                    onChange={(e) => setMaxViews(e.target.value)}
                    className="w-full rounded-lg bg-[#0B0E14] border border-white/20 px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition text-white font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  'Create share link'
                )}
              </button>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
            </form>

            {/* RIGHT SIDE */}
            <div className="flex flex-col justify-center">
              {!result ? (
                <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-gray-500">
                  Generated link will appear here
                </div>
              ) : (
                <div className="bg-[#0B0E14] border border-white/30 rounded-xl p-6 space-y-4">
                  <p className="text-gray-400 text-sm">Your shareable link</p>

                  <div className="flex items-center gap-3">
                    <code className="flex-1 text-indigo-400 break-all text-sm bg-black/30 px-3 py-2 rounded-lg">
                      {result}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                      title="Copy"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500">
                    Link expires automatically based on limits
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
       <footer className="mt-10 mb-15 border-t border-white/20 pt-2">
  <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-300">
    <div className="text-center md:text-left">
      <p className="font-semibold text-white">
        Pastebin Lite
      </p>
      <p className="mt-2 text-gray-400 max-w-md">
        Simple and secure text sharing with automatic expiration
        and optional view limits.
      </p>
    </div>

    <div className="flex flex-wrap items-center justify-center gap-5 text-gray-300">
      <span className="px-3 py-1 rounded-full bg-white/10">
        Time-based expiry
      </span>
      <span className="px-3 py-1 rounded-full bg-white/10">
        View limits
      </span>
      <span className="px-3 py-1 rounded-full bg-white/10">
        No sign-up
      </span>
    </div>
  </div>
</footer>



      </div>
    </main>
  );
}
