export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';

/**
 * 海洋表层洋流（粗网格）— 近地层洋流粒子流数据底座。
 * 真实数据：Open-Meteo Marine（ocean_current_velocity/direction），免费无 key。
 * 仅海洋点有数据，陆地点流速记 0（粒子在该处重生）。服务端缓存 1 小时。
 */

const DLON = 15, DLAT = 15, LON0 = -180, LAT0 = -75, NX = 24, NY = 11;
const CACHE_TTL_MS = 60 * 60 * 1000;

interface VecGrid {
  nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number;
  u: number[]; v: number[]; generatedAt: string; source: string;
}
let cache: { expires: number; body: VecGrid } | null = null;

interface OMMarine { current?: { ocean_current_velocity?: number; ocean_current_direction?: number } }

export async function GET() {
  const now = Date.now();
  if (cache && cache.expires > now) {
    return NextResponse.json(cache.body, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  }
  const lats: number[] = [], lons: number[] = [];
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { lats.push(LAT0 + j * DLAT); lons.push(LON0 + i * DLON); }

  const url =
    'https://marine-api.open-meteo.com/v1/marine' +
    `?latitude=${lats.join(',')}&longitude=${lons.join(',')}` +
    '&current=ocean_current_velocity,ocean_current_direction';

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000), next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`Open-Meteo Marine HTTP ${res.status}`);
    const data = (await res.json()) as OMMarine[] | OMMarine;
    const arr: OMMarine[] = Array.isArray(data) ? data : [data];
    const u = new Array(NX * NY).fill(0), v = new Array(NX * NY).fill(0);
    for (let k = 0; k < arr.length && k < NX * NY; k++) {
      const c = arr[k]?.current;
      const velKmh = typeof c?.ocean_current_velocity === 'number' ? c.ocean_current_velocity : 0;
      const dir = typeof c?.ocean_current_direction === 'number' ? c.ocean_current_direction : 0;
      const ms = velKmh / 3.6;
      const rad = (dir * Math.PI) / 180; // 海流方向为「流向」
      u[k] = ms * Math.sin(rad);
      v[k] = ms * Math.cos(rad);
    }
    const body: VecGrid = { nx: NX, ny: NY, lon0: LON0, lat0: LAT0, dLon: DLON, dLat: DLAT, u, v, generatedAt: new Date().toISOString(), source: 'Open-Meteo Marine 表层洋流' };
    cache = { expires: now + CACHE_TTL_MS, body };
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  } catch (err) {
    if (cache) return NextResponse.json({ ...cache.body, stale: true });
    return NextResponse.json({ error: err instanceof Error ? err.message : '洋流获取失败', nx: 0, ny: 0 }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
