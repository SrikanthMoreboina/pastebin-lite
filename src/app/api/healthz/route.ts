import { checkHealth } from '@/lib/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  const ok = await checkHealth();
  return NextResponse.json({ ok }, { status: ok ? 200 : 503 });
}