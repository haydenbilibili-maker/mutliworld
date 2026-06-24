export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';

/**
 * 世界陆地/海岸线（粗精度 110m）— 投影引擎(A)自绘底图。
 * 真实数据：Natural Earth 110m 陆地（公共领域，public domain），运行时拉取一次后长缓存。
 * 返回 GeoJSON（Polygon/MultiPolygon 陆地）；失败返回空集合（不伪造海岸线）。
 */

const SRC = 'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/110m/physical/ne_110m_land.json';
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 陆地为静态，长缓存

interface LandFC { type: 'FeatureCollection'; features: unknown[]; source: string }
let cache: { expires: number; body: LandFC } | null = null;

export async function GET() {
  const now = Date.now();
  if (cache && cache.expires > now) {
    return NextResponse.json(cache.body, { headers: { 'Cache-Control': 'public, s-maxage=2592000, stale-while-revalidate=86400' } });
  }
  try {
    const res = await fetch(SRC, { signal: AbortSignal.timeout(20000), next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`Natural Earth HTTP ${res.status}`);
    const data = (await res.json()) as { type?: string; features?: unknown[] };
    if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) throw new Error('陆地数据结构不符');
    const body: LandFC = { type: 'FeatureCollection', features: data.features, source: 'Natural Earth 110m 陆地（公共领域）' };
    cache = { expires: now + CACHE_TTL_MS, body };
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=2592000, stale-while-revalidate=86400' } });
  } catch (err) {
    if (cache) return NextResponse.json(cache.body);
    return NextResponse.json({ type: 'FeatureCollection', features: [], error: err instanceof Error ? err.message : '陆地获取失败' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
