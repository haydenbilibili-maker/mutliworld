import { NextResponse } from 'next/server';
import { getEonetGeoJSON, getEonetStale } from '@/lib/geodata/eonet';

/** 洪水事件图层数据 — 地表层（NASA EONET floods，免密钥真实，近实时）。服务端缓存 30 分钟。 */
export async function GET() {
  try {
    const body = await getEonetGeoJSON('floods', 'NASA EONET 自然事件追踪器（洪水）');
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  } catch (err) {
    const stale = getEonetStale('floods');
    if (stale) return NextResponse.json({ ...stale, stale: true });
    return NextResponse.json({ type: 'FeatureCollection', features: [], error: err instanceof Error ? err.message : '洪水获取失败' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
