export interface Paste {
  content: string;
  maxViews: number | null;
  views: number;
  createdAt: number;
  ttlSeconds?: number;
  destroyed?: boolean;
  reason?: 'view_limit' | 'time_expired';
}