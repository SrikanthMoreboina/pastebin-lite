import { Redis } from '@upstash/redis';
import type { Paste } from '@/types';

const redis = Redis.fromEnv();

const TEST_MODE = process.env.TEST_MODE === '1';

function getCurrentTimeMs(headers?: Headers): number {
  if (TEST_MODE && headers) {
    const testHeader = headers.get('x-test-now-ms');
    if (testHeader && !isNaN(Number(testHeader))) {
      return Number(testHeader);
    }
  }
  return Date.now();
}

export async function createPaste(paste: Paste) {
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 10);
  const key = `paste:${id}`;

  if (paste.ttlSeconds) {
    await redis.set(key, paste, { ex: paste.ttlSeconds });
  } else {
    await redis.set(key, paste);
  }

  return id;
}

export async function getPasteAndIncrement(id: string, headers?: Headers): Promise<Paste | null> {
  const key = `paste:${id}`;
  const paste = await redis.get<Paste>(key);

  if (!paste) return null;

  const now = getCurrentTimeMs(headers);

  // Manual TTL check (backup for precision)
  if (paste.ttlSeconds && now - paste.createdAt >= paste.ttlSeconds * 1000) {
    await redis.del(key);
    return null;
  }

  // View limit check — destroy if this would exceed
  if (paste.maxViews !== null && paste.views + 1 > paste.maxViews) {
    // Mark as destroyed due to view limit
    const destroyedPaste = {
      ...paste,
      destroyed: true,
      reason: 'view_limit' as const,
    };
    // Briefly set with reason, then delete (for detection)
    if (paste.ttlSeconds) {
      await redis.set(key, destroyedPaste, { ex: paste.ttlSeconds });
    } else {
      await redis.set(key, destroyedPaste);
    }
    await redis.del(key);
    return null;
  }

  // Increment views
  paste.views += 1;

  // Save updated
  if (paste.ttlSeconds) {
    await redis.set(key, paste, { ex: paste.ttlSeconds });
  } else {
    await redis.set(key, paste);
  }

  return paste;
}

export async function checkHealth(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}