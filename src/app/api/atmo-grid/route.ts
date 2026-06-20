import { NextResponse } from 'next/server';

/**
 * 近地大气标量场（粗网格）— 2m 气温 + 降水。
 * 真实数据：Open-Meteo Forecast（GFS / NCEP / NWS 系），免费无 key。
 * temperature_2m 单位 °C；precipitation 单位 mm（近一小时）。缺测记 NaN→前端透明。
 * 服务端缓存 30 分钟。
 */

const DLON = 15, DLAT = 15, LON0 = -180, LAT0 = -75, NX = 24, NY = 11;
const CACHE_TTL_MS = 30 * 60 * 1000;
const PARAMS = ['temperature_2m', 'precipitation'] as const;
type Param = (typeof PARAMS)[number];

interface ScalarGrid {
  nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number;
  params: Record<Param, number[]>;
  generatedAt: string; source: string;
}
let cache: { expires: number; body: ScalarGrid } | null = null;

type OMForecast = { current?: Partial<Record<Param, number>> };

export async function GET() {
  const now = Date.now();
  if (cache && cache.expires > now) {
    return NextResponse.json(cache.body, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  }
  const lats: number[] = [], lons: number[] = [];
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { lats.push(LAT0 + j * DLAT); lons.push(LON0 + i * DLON); }

  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${lats.join(',')}&longitude=${lons.join(',')}` +
    `&current=${PARAMS.join(',')}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000), next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`Open-Meteo Forecast HTTP ${res.status}`);
    const data = (await res.json()) as OMForecast[] | OMForecast;
    const arr: OMForecast[] = Array.isArray(data) ? data : [data];
    const params = Object.fromEntries(PARAMS.map((p) => [p, new Array(NX * NY).fill(NaN)])) as Record<Param, number[]>;
    for (let k = 0; k < arr.length && k < NX * NY; k++) {
      const c = arr[k]?.current;
      for (const p of PARAMS) {
        params[p][k] = typeof c?.[p] === 'number' ? (c[p] as number) : NaN;
      }
    }
    const body: ScalarGrid = { nx: NX, ny: NY, lon0: LON0, lat0: LAT0, dLon: DLON, dLat: DLAT, params, generatedAt: new Date().toISOString(), source: 'Open-Meteo（GFS）2m 气温/降水' };
    cache = { expires: now + CACHE_TTL_MS, body };
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  } catch (err) {
    if (cache) return NextResponse.json({ ...cache.body, stale: true });
    return NextResponse.json({ error: err instanceof Error ? err.message : '大气标量获取失败', nx: 0, ny: 0 }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
