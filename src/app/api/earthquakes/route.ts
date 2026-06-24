export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';

/**
 * 实时地震图层数据 — 地表层（USGS Earthquake Hazards Program）。
 * 真实数据：USGS 公开 GeoJSON feed（过去一天全球 M2.5+），免费无 key，近实时（约 1–5 分钟延迟）。
 * 转为精简 GeoJSON（震级/地点/深度/时刻），服务端缓存 5 分钟。
 */

const FEED = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson';
const CACHE_TTL_MS = 5 * 60 * 1000;

interface QuakeFC {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    id: string;
    geometry: { type: 'Point'; coordinates: [number, number] };
    properties: { mag: number; place: string; depth: number; time: number; tsunami: number };
  }>;
  generatedAt: string;
  source: string;
}
let cache: { expires: number; body: QuakeFC } | null = null;

interface UsgsFeature {
  id?: string;
  properties?: { mag?: number | null; place?: string | null; time?: number | null; tsunami?: number | null };
  geometry?: { coordinates?: number[] };
}
interface UsgsFC { features?: UsgsFeature[] }

export async function GET() {
  const now = Date.now();
  if (cache && cache.expires > now) {
    return NextResponse.json(cache.body, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900' } });
  }
  try {
    const res = await fetch(FEED, { signal: AbortSignal.timeout(20000), next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`USGS HTTP ${res.status}`);
    const data = (await res.json()) as UsgsFC;
    const features = (data.features ?? [])
      .filter((f) => Array.isArray(f.geometry?.coordinates) && f.geometry!.coordinates!.length >= 2 && typeof f.properties?.mag === 'number')
      .map((f) => {
        const c = f.geometry!.coordinates!;
        return {
          type: 'Feature' as const,
          id: f.id ?? `${c[0]},${c[1]},${f.properties?.time}`,
          geometry: { type: 'Point' as const, coordinates: [c[0], c[1]] as [number, number] },
          properties: {
            mag: Number(f.properties?.mag ?? 0),
            place: String(f.properties?.place ?? '未知区域'),
            depth: typeof c[2] === 'number' ? c[2] : 0,
            time: Number(f.properties?.time ?? Date.now()),
            tsunami: Number(f.properties?.tsunami ?? 0),
          },
        };
      });
    const body: QuakeFC = { type: 'FeatureCollection', features, generatedAt: new Date().toISOString(), source: 'USGS 地震灾害项目（近实时 M2.5+/24h）' };
    cache = { expires: now + CACHE_TTL_MS, body };
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900' } });
  } catch (err) {
    if (cache) return NextResponse.json({ ...cache.body, stale: true });
    return NextResponse.json({ type: 'FeatureCollection', features: [], error: err instanceof Error ? err.message : '地震获取失败' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
