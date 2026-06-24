export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';

/**
 * 海洋标量场（粗网格）— 近地层标量叠加：海面温度 + 有效波高。
 * 真实数据：Open-Meteo Marine（sea_surface_temperature / wave_height），免费无 key。
 * sea_surface_temperature 单位 °C；wave_height 单位 m。陆地点无值记 NaN→前端透明。
 * 服务端缓存 1 小时。
 */

const DLON = 15, DLAT = 15, LON0 = -180, LAT0 = -75, NX = 24, NY = 11;
const CACHE_TTL_MS = 60 * 60 * 1000;
const PARAMS = ['sea_surface_temperature', 'wave_height'] as const;
type Param = (typeof PARAMS)[number];

interface ScalarGrid {
  nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number;
  params: Record<Param, number[]>;
  generatedAt: string; source: string;
}
let cache: { expires: number; body: ScalarGrid } | null = null;

type OMMarine = { current?: Partial<Record<Param, number>> };

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
    `&current=${PARAMS.join(',')}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000), next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`Open-Meteo Marine HTTP ${res.status}`);
    const data = (await res.json()) as OMMarine[] | OMMarine;
    const arr: OMMarine[] = Array.isArray(data) ? data : [data];
    const params = Object.fromEntries(PARAMS.map((p) => [p, new Array(NX * NY).fill(NaN)])) as Record<Param, number[]>;
    for (let k = 0; k < arr.length && k < NX * NY; k++) {
      const c = arr[k]?.current;
      for (const p of PARAMS) {
        params[p][k] = typeof c?.[p] === 'number' ? (c[p] as number) : NaN;
      }
    }
    const body: ScalarGrid = { nx: NX, ny: NY, lon0: LON0, lat0: LAT0, dLon: DLON, dLat: DLAT, params, generatedAt: new Date().toISOString(), source: 'Open-Meteo Marine 海面温度/有效波高' };
    cache = { expires: now + CACHE_TTL_MS, body };
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  } catch (err) {
    if (cache) return NextResponse.json({ ...cache.body, stale: true });
    return NextResponse.json({ error: err instanceof Error ? err.message : '海洋标量获取失败', nx: 0, ny: 0 }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
