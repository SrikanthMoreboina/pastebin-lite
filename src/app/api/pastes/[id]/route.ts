import { getPasteAndIncrement } from '@/lib/kv';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Promise here too
) {
  const { id } = await params;  // ← Await

  const paste = await getPasteAndIncrement(id, request.headers);

  if (!paste) {
    return NextResponse.json(
      { error: 'Paste not found or unavailable' },
      { status: 404 }
    );
  }

  const remaining_views = paste.maxViews === null ? null : paste.maxViews - paste.views;
  const expires_at =
    paste.ttlSeconds === undefined
      ? null
      : new Date(paste.createdAt + paste.ttlSeconds * 1000).toISOString();

  return NextResponse.json({
    content: paste.content,
    remaining_views,
    expires_at,
  });
}