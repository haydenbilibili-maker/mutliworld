export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { getEonetGeoJSON, getEonetStale } from '@/lib/geodata/eonet';

/** 沙尘/霾事件图层数据 — 地表层（NASA EONET dustHaze，免密钥真实，近实时）。服务端缓存 30 分钟。 */
export async function GET() {
  try {
    const body = await getEonetGeoJSON('dustHaze', 'NASA EONET 自然事件追踪器（沙尘/霾）');
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  } catch (err) {
    const stale = getEonetStale('dustHaze');
    if (stale) return NextResponse.json({ ...stale, stale: true });
    return NextResponse.json({ type: 'FeatureCollection', features: [], error: err instanceof Error ? err.message : '沙尘获取失败' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
