import type { TimeRange } from '@/types/geo';

/** 时间范围对应毫秒窗口 */
export const TIME_RANGE_MS: Record<TimeRange, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
};

/** 按 timeRange 的 SWR 轮询间隔（毫秒） */
export const REFRESH_INTERVAL_MS: Record<TimeRange, number> = {
  '24h': 30_000,
  '7d': 60_000,
  '30d': 120_000,
};

export function parseIsoMs(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : null;
}

export function opacityByAge(ageMs: number, windowMs: number): number {
  if (ageMs <= windowMs * 0.25) return 0.95;
  if (ageMs <= windowMs * 0.6) return 0.72;
  return 0.45;
}

/** 将历史时间戳平移到“以当前为最新”的时间轴，便于展示时效性 */
export function shiftTimestampToNow(eventMs: number, latestMs: number): string {
  const deltaMs = Date.now() - latestMs;
  return new Date(eventMs + deltaMs).toISOString();
}

export function isWithinTimeWindow(
  eventMs: number | null,
  latestMs: number | null,
  windowMs: number,
  includeIfNoTimestamp = true,
): boolean {
  if (latestMs == null || eventMs == null) return includeIfNoTimestamp;
  return eventMs >= latestMs - windowMs;
}
