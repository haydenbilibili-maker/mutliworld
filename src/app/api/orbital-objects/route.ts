import { NextRequest } from 'next/server';
import type { OrbitalCategory } from '@/types/orbital';
import { propagateAll, toOrbitalGeoJSON } from '@/lib/orbital/propagate';

const VALID_CATEGORIES: OrbitalCategory[] = ['station', 'satellite', 'debris'];

function parseCategories(raw: string | null): OrbitalCategory[] {
  if (!raw) return VALID_CATEGORIES;
  const parsed = raw
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is OrbitalCategory => VALID_CATEGORIES.includes(s as OrbitalCategory));
  return parsed.length ? parsed : VALID_CATEGORIES;
}

function parseLimit(raw: string | null, fallback: number): number {
  if (!raw) return fallback;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? Math.min(n, 500) : fallback;
}

/**
 * GET /api/orbital-objects
 *
 * 从本地 TLE（SGP4）计算当前星下点位置。
 *
 * Query:
 *   category — station,satellite,debris（逗号分隔，默认全部）
 *   limit    — 每类上限（默认 station 20 / satellite 200 / debris 300，最大 500）
 *
 * Response: GeoJSON FeatureCollection + meta
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const categories = parseCategories(searchParams.get('category'));
    const limit = parseLimit(searchParams.get('limit'), 200);

    const { objects, meta } = propagateAll({
      categories,
      limits: {
        station: parseLimit(searchParams.get('limit_station'), 20),
        satellite: categories.includes('satellite') ? limit : 0,
        debris: parseLimit(searchParams.get('limit_debris'), 300),
      },
    });

    const geojson = toOrbitalGeoJSON(objects);
    const total = objects.length;

    return Response.json(
      {
        ...geojson,
        meta: {
          generatedAt: new Date().toISOString(),
          tleFetchedAt: meta.tleFetchedAt,
          source: meta.source,
          counts: meta.counts,
          total,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=45',
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : '轨道目标计算失败';
    return Response.json(
      { type: 'FeatureCollection', features: [], meta: { generatedAt: new Date().toISOString(), tleFetchedAt: null, source: '', counts: null, total: 0, error: message } },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
