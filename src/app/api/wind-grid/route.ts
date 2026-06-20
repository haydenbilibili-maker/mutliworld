import { NextResponse } from 'next/server';

/**
 * 近地大气风场（粗网格）— 对标 earth.nullschool 的粒子流场数据底座。
 * 真实数据：Open-Meteo（基于 GFS）10m 风，免费无 key。粗网格（15°）一次批量请求，服务端缓存 30 分钟。
 * 返回 u(东向)/v(北向) m/s 的规则网格，供前端粒子层双线性插值平流。
 */

const DLON = 15;
const DLAT = 15;
const LON0 = -180;
const LAT0 = -75;
const NX = 24; // -180..165
const NY = 11; // -75..75
const CACHE_TTL_MS = 30 * 60 * 1000;

interface WindGrid {
  nx: number;
  ny: number;
  lon0: number;
  lat0: number;
  dLon: number;
  dLat: number;
  u: number[];
  v: number[];
  generatedAt: string;
  source: string;
}

let cache: { expires: number; body: WindGrid } | null = null;

interface OMCurrent {
  current?: { wind_speed_10m?: number; wind_direction_10m?: number };
}

export async function GET() {
  const now = Date.now();
  if (cache && cache.expires > now) {
    return NextResponse.json(cache.body, { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800' } });
  }

  const lats: number[] = [];
  const lons: number[] = [];
  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      lats.push(LAT0 + j * DLAT);
      lons.push(LON0 + i * DLON);
    }
  }

  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${lats.join(',')}&longitude=${lons.join(',')}` +
    '&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=ms';

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000), next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
    const data = (await res.json()) as OMCurrent[] | OMCurrent;
    const arr: OMCurrent[] = Array.isArray(data) ? data : [data];

    const u = new Array(NX * NY).fill(0);
    const v = new Array(NX * NY).fill(0);
    for (let k = 0; k < arr.length && k < NX * NY; k++) {
      const c = arr[k]?.current;
      const spd = typeof c?.wind_speed_10m === 'number' ? c.wind_speed_10m : 0;
      const wd = typeof c?.wind_direction_10m === 'number' ? c.wind_direction_10m : 0;
      const rad = (wd * Math.PI) / 180;
      // 气象风向为「风的来向」→ 速度矢量取反
      u[k] = -spd * Math.sin(rad);
      v[k] = -spd * Math.cos(rad);
    }

    const body: WindGrid = {
      nx: NX, ny: NY, lon0: LON0, lat0: LAT0, dLon: DLON, dLat: DLAT,
      u, v, generatedAt: new Date().toISOString(), source: 'Open-Meteo（GFS）10m 风',
    };
    cache = { expires: now + CACHE_TTL_MS, body };
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800' } });
  } catch (err) {
    if (cache) return NextResponse.json({ ...cache.body, stale: true }, { headers: { 'Cache-Control': 'public, s-maxage=120' } });
    const message = err instanceof Error ? err.message : '风场获取失败';
    return NextResponse.json({ error: message, nx: 0, ny: 0 }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
