export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';

/**
 * 极光带图层数据 — 地表层（NOAA SWPC OVATION 极光预报）。
 * 真实数据：NOAA Space Weather Prediction Center OVATION 模型，免费无 key，约 5 分钟更新。
 * 原始 1°×1° 全球极光出现概率(0–100%)；此处仅取高值点(≥8%)转 GeoJSON，前端以辉光圆点呈现极光卵。
 * 经度由 0–359 归一到 -180–180。服务端缓存 10 分钟。
 */

const FEED = 'https://services.swpc.noaa.gov/json/ovation_aurora_latest.json';
const CACHE_TTL_MS = 10 * 60 * 1000;
const MIN_PROB = 8;

interface AuroraFC {
  type: 'FeatureCollection';
  features: Array<{ type: 'Feature'; geometry: { type: 'Point'; coordinates: [number, number] }; properties: { aurora: number } }>;
  forecastTime: string;
  generatedAt: string;
  source: string;
}
let cache: { expires: number; body: AuroraFC } | null = null;

interface Ovation { coordinates?: number[][]; ['Forecast Time']?: string }

export async function GET() {
  const now = Date.now();
  if (cache && cache.expires > now) {
    return NextResponse.json(cache.body, { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800' } });
  }
  try {
    const res = await fetch(FEED, { signal: AbortSignal.timeout(20000), next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`SWPC OVATION HTTP ${res.status}`);
    const d = (await res.json()) as Ovation;
    const coords = Array.isArray(d.coordinates) ? d.coordinates : [];
    const features = coords
      .filter((c) => Array.isArray(c) && c.length >= 3 && typeof c[2] === 'number' && c[2] >= MIN_PROB)
      .map((c) => {
        const lon = c[0] > 180 ? c[0] - 360 : c[0];
        return { type: 'Feature' as const, geometry: { type: 'Point' as const, coordinates: [lon, c[1]] as [number, number] }, properties: { aurora: c[2] } };
      });
    const body: AuroraFC = {
      type: 'FeatureCollection', features,
      forecastTime: typeof d['Forecast Time'] === 'string' ? d['Forecast Time'] : '',
      generatedAt: new Date().toISOString(),
      source: 'NOAA SWPC OVATION 极光预报',
    };
    cache = { expires: now + CACHE_TTL_MS, body };
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800' } });
  } catch (err) {
    if (cache) return NextResponse.json({ ...cache.body, stale: true });
    return NextResponse.json({ type: 'FeatureCollection', features: [], error: err instanceof Error ? err.message : '极光获取失败' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
