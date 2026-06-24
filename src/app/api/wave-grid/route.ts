export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';

/**
 * 海浪（粗网格矢量场）— 近地层「波浪」粒子流动效数据底座。
 * 真实数据：Open-Meteo Marine（wave_height/wave_direction，源自 WAVEWATCH III / NCEP / NWS 等业务化海浪模式），免费无 key。
 * wave_direction 为浪「来向」（气象约定）；可视化按「传播去向」= 来向+180° 平流。
 * 幅值取有效波高(m)。仅海洋点有数据，陆地点记 0（粒子在该处重生）。服务端缓存 1 小时。
 */

const DLON = 15, DLAT = 15, LON0 = -180, LAT0 = -75, NX = 24, NY = 11;
const CACHE_TTL_MS = 60 * 60 * 1000;

interface VecGrid {
  nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number;
  u: number[]; v: number[]; generatedAt: string; source: string;
}
let cache: { expires: number; body: VecGrid } | null = null;

interface OMMarine { current?: { wave_height?: number; wave_direction?: number } }

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
    '&current=wave_height,wave_direction';

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000), next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`Open-Meteo Marine HTTP ${res.status}`);
    const data = (await res.json()) as OMMarine[] | OMMarine;
    const arr: OMMarine[] = Array.isArray(data) ? data : [data];
    const u = new Array(NX * NY).fill(0), v = new Array(NX * NY).fill(0);
    for (let k = 0; k < arr.length && k < NX * NY; k++) {
      const c = arr[k]?.current;
      const h = typeof c?.wave_height === 'number' ? c.wave_height : 0;
      const fromDir = typeof c?.wave_direction === 'number' ? c.wave_direction : 0;
      const toRad = ((fromDir + 180) * Math.PI) / 180; // 来向 → 去向
      u[k] = h * Math.sin(toRad);
      v[k] = h * Math.cos(toRad);
    }
    const body: VecGrid = { nx: NX, ny: NY, lon0: LON0, lat0: LAT0, dLon: DLON, dLat: DLAT, u, v, generatedAt: new Date().toISOString(), source: 'Open-Meteo Marine 海浪（WAVEWATCH III 系）' };
    cache = { expires: now + CACHE_TTL_MS, body };
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  } catch (err) {
    if (cache) return NextResponse.json({ ...cache.body, stale: true });
    return NextResponse.json({ error: err instanceof Error ? err.message : '海浪获取失败', nx: 0, ny: 0 }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
