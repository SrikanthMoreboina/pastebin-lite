import { createPaste } from '@/lib/kv';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return NextResponse.json(
        { error: 'ttl_seconds must be an integer >= 1' },
        { status: 400 }
      );
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return NextResponse.json(
        { error: 'max_views must be an integer >= 1' },
        { status: 400 }
      );
    }

    const paste = {
      content: content.trim(),
      maxViews: max_views ?? null,
      views: 0,
      createdAt: Date.now(),
      ttlSeconds: ttl_seconds,
    };

    const id = await createPaste(paste);

    const url = new URL(request.url);
    const baseUrl = url.origin;

    return NextResponse.json({
      id,
      url: `${baseUrl}/p/${id}`,
    });
  } catch (error) {
  console.error('Create paste error:', error); 
  return NextResponse.json(
    { error: 'Invalid request body - must be valid JSON' },
    { status: 400 }
  );
}
}