export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';

/**
 * 化学污染物 + 颗粒物（粗网格标量场）— 近地层标量叠加数据底座。
 * 真实数据：Open-Meteo Air-Quality（CAMS），免费无 key。CO/SO₂/NO₂/O₃ + PM2.5/PM10。
 * 服务端缓存 1 小时。返回各参数的规则网格，供前端等距投影成栅格叠加。
 */

const DLON = 15, DLAT = 15, LON0 = -180, LAT0 = -75, NX = 24, NY = 11;
const CACHE_TTL_MS = 60 * 60 * 1000;
const PARAMS = ['carbon_monoxide', 'sulphur_dioxide', 'nitrogen_dioxide', 'ozone', 'pm2_5', 'pm10'] as const;
type Param = (typeof PARAMS)[number];

interface AqGrid {
  nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number;
  params: Record<Param, number[]>;
  generatedAt: string; source: string;
}
let cache: { expires: number; body: AqGrid } | null = null;

type OMAir = { current?: Partial<Record<Param, number>> };

export async function GET() {
  const now = Date.now();
  if (cache && cache.expires > now) {
    return NextResponse.json(cache.body, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  }
  const lats: number[] = [], lons: number[] = [];
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { lats.push(LAT0 + j * DLAT); lons.push(LON0 + i * DLON); }

  const url =
    'https://air-quality-api.open-meteo.com/v1/air-quality' +
    `?latitude=${lats.join(',')}&longitude=${lons.join(',')}` +
    `&current=${PARAMS.join(',')}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000), next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`Open-Meteo AQ HTTP ${res.status}`);
    const data = (await res.json()) as OMAir[] | OMAir;
    const arr: OMAir[] = Array.isArray(data) ? data : [data];
    const params = Object.fromEntries(PARAMS.map((p) => [p, new Array(NX * NY).fill(0)])) as Record<Param, number[]>;
    for (let k = 0; k < arr.length && k < NX * NY; k++) {
      const c = arr[k]?.current;
      for (const p of PARAMS) {
        const val = typeof c?.[p] === 'number' ? (c[p] as number) : 0;
        params[p][k] = val;
      }
    }
    const body: AqGrid = { nx: NX, ny: NY, lon0: LON0, lat0: LAT0, dLon: DLON, dLat: DLAT, params, generatedAt: new Date().toISOString(), source: 'Open-Meteo Air-Quality（CAMS）' };
    cache = { expires: now + CACHE_TTL_MS, body };
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  } catch (err) {
    if (cache) return NextResponse.json({ ...cache.body, stale: true });
    return NextResponse.json({ error: err instanceof Error ? err.message : '空气质量获取失败', nx: 0, ny: 0 }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
