/**
 * pizzint.watch 实时数据接入
 *
 * GET {base}/api/dashboard-data?_t={30s bucket ms}
 * PIZZINT_API_URL 可选，覆盖 API 根地址（默认 https://www.pizzint.watch）
 */

import type {
  PizzaIndexHistoryPoint,
  PizzaIndexLevel,
  PizzaIndexResponse,
  PizzaIndexTrend,
  PizzaVenue,
} from '@/types/pizza-index';

const DEFAULT_BASE = 'https://www.pizzint.watch';

const LIVE_DISCLAIMER =
  '本指标为网络 OSINT meme，仅供娱乐参考；披萨订单激增与军事行动无因果关系。数据来自 pizzint.watch（Google Maps 热门时段）。';

export interface PizzintSparklinePoint {
  place_id: string;
  current_popularity: number | null;
  recorded_at: string;
}

export interface PizzintVenueRaw {
  place_id: string;
  name: string;
  address: string;
  current_popularity: number | null;
  percentage_of_usual: number | null;
  is_spike: boolean;
  spike_magnitude: number | null;
  data_source: string;
  recorded_at: string;
  data_freshness: string;
  sparkline_24h: PizzintSparklinePoint[];
  is_closed_now?: boolean;
}

export interface PizzintDashboardRaw {
  success: boolean;
  data: PizzintVenueRaw[];
  overall_index: number;
  defcon_level: number;
  timestamp: string;
}

/** 30 秒时间桶，与 pizzint.watch 前端缓存键一致 */
export function pizzintCacheBucketMs(now = Date.now()): number {
  return 30_000 * Math.floor(now / 30_000);
}

function pizzintBaseUrl(): string {
  const override = process.env.PIZZINT_API_URL?.trim();
  if (!override) return DEFAULT_BASE;
  return override.replace(/\/$/, '');
}

/** 从 Google Maps URL 解析 @lat,lng */
export function parseCoordsFromAddress(address: string): { lat: number; lng: number } | null {
  const match = address.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (!match) return null;
  return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
}

/** DEFCON 1（最高）→ CRITICAL；5（最低）→ LOW */
export function defconToLevel(defcon: number): PizzaIndexLevel {
  switch (defcon) {
    case 1:
      return 'CRITICAL';
    case 2:
      return 'HIGH';
    case 3:
      return 'ELEVATED';
    case 4:
    case 5:
    default:
      return 'LOW';
  }
}

/** null 时使用 sparkline 最近有效值，否则 0 */
export function resolvePopularity(venue: PizzintVenueRaw): number {
  if (venue.current_popularity != null && !Number.isNaN(venue.current_popularity)) {
    return venue.current_popularity;
  }
  for (let i = venue.sparkline_24h.length - 1; i >= 0; i--) {
    const pop = venue.sparkline_24h[i].current_popularity;
    if (pop != null && !Number.isNaN(pop)) return pop;
  }
  return 0;
}

function resolveDelta(venue: PizzintVenueRaw): number {
  if (venue.percentage_of_usual != null && !Number.isNaN(venue.percentage_of_usual)) {
    return Math.round((venue.percentage_of_usual - 100) * 10) / 10;
  }
  const valid = venue.sparkline_24h.filter((s) => s.current_popularity != null);
  if (valid.length >= 2) {
    const last = valid[valid.length - 1].current_popularity!;
    const prev = valid[valid.length - 2].current_popularity!;
    return Math.round((last - prev) * 10) / 10;
  }
  return 0;
}

function extractBrand(name: string): string {
  const parts = name.split(/[—–-]/);
  return parts[0]?.trim() || name;
}

/** 按时间戳聚合各门店 sparkline，取非 null 均值 */
export function aggregateSparklineHistory(venues: PizzintVenueRaw[]): PizzaIndexHistoryPoint[] {
  const buckets = new Map<string, { sum: number; count: number }>();

  for (const venue of venues) {
    for (const pt of venue.sparkline_24h) {
      if (pt.current_popularity == null || Number.isNaN(pt.current_popularity)) continue;
      const cur = buckets.get(pt.recorded_at) ?? { sum: 0, count: 0 };
      cur.sum += pt.current_popularity;
      cur.count += 1;
      buckets.set(pt.recorded_at, cur);
    }
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([at, { sum, count }]) => ({
      at,
      score: Math.round(sum / count),
    }));
}

function trendFromHistory(history: PizzaIndexHistoryPoint[], score: number): PizzaIndexTrend {
  if (history.length >= 2) {
    const prev = history[history.length - 2].score;
    const delta = score - prev;
    if (delta > 2) return 'up';
    if (delta < -2) return 'down';
  }
  return 'flat';
}

export function mapPizzintResponse(raw: PizzintDashboardRaw): PizzaIndexResponse {
  const venuesRaw = raw.data ?? [];
  const score = Math.round(raw.overall_index ?? 0);
  const level = defconToLevel(raw.defcon_level ?? 5);

  const venues: PizzaVenue[] = venuesRaw.map((v) => {
    const coords = parseCoordsFromAddress(v.address);
    return {
      id: v.place_id,
      name: v.name,
      brand: extractBrand(v.name),
      lat: coords?.lat ?? 0,
      lng: coords?.lng ?? 0,
      busyLevel: resolvePopularity(v),
      delta: resolveDelta(v),
      contribution: 0,
    };
  });

  const totalBusy = venues.reduce((s, v) => s + v.busyLevel, 0) || 1;
  for (const venue of venues) {
    venue.contribution = Math.round((venue.busyLevel / totalBusy) * 100);
  }

  const history = aggregateSparklineHistory(venuesRaw);
  const trend = trendFromHistory(history, score);

  return {
    score,
    level,
    trend,
    venues,
    history,
    updatedAt: raw.timestamp ?? new Date().toISOString(),
    source: 'pizzint.watch',
    disclaimer: LIVE_DISCLAIMER,
  };
}

/** 拉取 pizzint.watch dashboard-data；失败返回 null */
export async function fetchPizzintWatch(): Promise<PizzaIndexResponse | null> {
  const base = pizzintBaseUrl();
  const t = pizzintCacheBucketMs();
  const url = `${base}/api/dashboard-data?_t=${t}`;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8_000),
      headers: { Accept: 'application/json' },
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;

    const raw = (await res.json()) as PizzintDashboardRaw;
    if (!raw?.success || !Array.isArray(raw.data) || raw.data.length === 0) return null;

    return mapPizzintResponse(raw);
  } catch {
    return null;
  }
}
