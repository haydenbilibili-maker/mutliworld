import { NextRequest } from 'next/server';
import type { BboxFilter } from '@/lib/flights/opensky';
import { fetchOpenSkyFlights, flightsToGeoJSON } from '@/lib/flights/opensky';
import { fetchAdsbFlights } from '@/lib/flights/adsb';

const GLOBAL_LIMIT = 1500;
const BBOX_LIMIT = 3000;

/** 主源 adsb.lol（免鉴权高密度），失败回退 OpenSky */
async function fetchFlights(opts: { bbox: BboxFilter | null; limit: number }) {
  try {
    return await fetchAdsbFlights({ ...opts, airborneOnly: true });
  } catch {
    return await fetchOpenSkyFlights({ ...opts, airborneOnly: true });
  }
}
const CACHE_TTL_MS = 45_000;

interface CacheEntry {
  key: string;
  expires: number;
  body: unknown;
}

let cache: CacheEntry | null = null;

function staleCacheBody(key: string, errorMessage: string): unknown | null {
  if (!cache || cache.key !== key) return null;
  const body = cache.body as { meta?: Record<string, unknown> };
  if (!body?.meta) return null;
  return {
    ...body,
    meta: {
      ...body.meta,
      stale: true,
      error: errorMessage,
      generatedAt: new Date().toISOString(),
    },
  };
}

function parseBbox(searchParams: URLSearchParams): BboxFilter | null {
  const lamin = searchParams.get('lamin');
  const lomin = searchParams.get('lomin');
  const lamax = searchParams.get('lamax');
  const lomax = searchParams.get('lomax');
  if (!lamin || !lomin || !lamax || !lomax) return null;

  const nums = [lamin, lomin, lamax, lomax].map((v) => parseFloat(v));
  if (nums.some((n) => !Number.isFinite(n))) return null;

  const [laMin, loMin, laMax, loMax] = nums;
  if (laMin >= laMax || loMin >= loMax) return null;
  if (laMin < -90 || laMax > 90 || loMin < -180 || loMax > 180) return null;

  return { lamin: laMin, lomin: loMin, lamax: laMax, lomax: loMax };
}

function cacheKey(bbox: BboxFilter | null, limit: number): string {
  if (!bbox) return `global:${limit}`;
  return `bbox:${bbox.lamin},${bbox.lomin},${bbox.lamax},${bbox.lomax}:${limit}`;
}

/**
 * GET /api/flights
 *
 * OpenSky ADS-B 实时航班代理（避免浏览器 CORS，短缓存）。
 *
 * Query:
 *   lamin,lomin,lamax,lomax — 可选 bbox（放大区域时传入以减轻负载）
 *   limit — 返回上限（默认 global 800 / bbox 2000，最大 2000）
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const bbox = parseBbox(searchParams);
  const defaultLimit = bbox ? BBOX_LIMIT : GLOBAL_LIMIT;
  const limitRaw = parseInt(searchParams.get('limit') ?? String(defaultLimit), 10);
  const limit = Number.isFinite(limitRaw)
    ? Math.min(Math.max(limitRaw, 50), BBOX_LIMIT)
    : defaultLimit;

  const key = cacheKey(bbox, limit);
  const now = Date.now();
  if (cache && cache.key === key && cache.expires > now) {
    return Response.json(cache.body, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    });
  }

  try {
    const { flights, source, total, capped } = await fetchFlights({ bbox, limit });
    const geojson = flightsToGeoJSON(flights);
    const body = {
      ...geojson,
      meta: {
        generatedAt: new Date().toISOString(),
        source,
        total,
        displayed: flights.length,
        capped,
        bbox: bbox ? ([bbox.lomin, bbox.lamin, bbox.lomax, bbox.lamax] as const) : null,
      },
    };

    cache = { key, expires: now + CACHE_TTL_MS, body };

    return Response.json(body, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '获取航班数据失败';
    const stale = staleCacheBody(key, message);
    if (stale) {
      return Response.json(stale, {
        headers: { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30' },
      });
    }
    return Response.json(
      {
        type: 'FeatureCollection',
        features: [],
        meta: {
          generatedAt: new Date().toISOString(),
          source: 'OpenSky Network',
          total: 0,
          displayed: 0,
          capped: false,
          bbox: bbox ? ([bbox.lomin, bbox.lamin, bbox.lomax, bbox.lamax] as const) : null,
          error: message,
        },
      },
      {
        status: 502,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }
}
