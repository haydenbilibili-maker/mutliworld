import { NextResponse } from 'next/server';

/**
 * 风暴/热带气旋图层数据 — 地表层（NASA EONET 自然事件追踪器）。
 * 真实数据：NASA EONET v3（category=severeStorms, status=open），免费无 key，近实时。
 * 取每个事件最新位置（风暴路径末点），转 GeoJSON 点（名称/最新时刻）。服务端缓存 30 分钟。
 */

const FEED = 'https://eonet.gsfc.nasa.gov/api/v3/events?category=severeStorms&status=open';
const CACHE_TTL_MS = 30 * 60 * 1000;

interface StormFC {
  type: 'FeatureCollection';
  features: Array<{ type: 'Feature'; id: string; geometry: { type: 'Point'; coordinates: [number, number] }; properties: { title: string; date: string } }>;
  generatedAt: string;
  source: string;
}
let cache: { expires: number; body: StormFC } | null = null;

interface EonetGeometry { date?: string; type?: string; coordinates?: number[] }
interface EonetEvent { id?: string; title?: string; geometry?: EonetGeometry[] }
interface EonetResp { events?: EonetEvent[] }

export async function GET() {
  const now = Date.now();
  if (cache && cache.expires > now) {
    return NextResponse.json(cache.body, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  }
  try {
    const res = await fetch(FEED, { signal: AbortSignal.timeout(20000), next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`EONET HTTP ${res.status}`);
    const d = (await res.json()) as EonetResp;
    const events = Array.isArray(d.events) ? d.events : [];
    const features = events
      .map((ev) => {
        const geoms = (ev.geometry ?? []).filter((g) => g.type === 'Point' && Array.isArray(g.coordinates) && g.coordinates.length >= 2);
        const last = geoms[geoms.length - 1];
        if (!last) return null;
        const c = last.coordinates!;
        return {
          type: 'Feature' as const,
          id: ev.id ?? `${c[0]},${c[1]}`,
          geometry: { type: 'Point' as const, coordinates: [c[0], c[1]] as [number, number] },
          properties: { title: String(ev.title ?? '热带气旋'), date: String(last.date ?? '') },
        };
      })
      .filter((f): f is NonNullable<typeof f> => f !== null);
    const body: StormFC = { type: 'FeatureCollection', features, generatedAt: new Date().toISOString(), source: 'NASA EONET 自然事件追踪器（风暴）' };
    cache = { expires: now + CACHE_TTL_MS, body };
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  } catch (err) {
    if (cache) return NextResponse.json({ ...cache.body, stale: true });
    return NextResponse.json({ type: 'FeatureCollection', features: [], error: err instanceof Error ? err.message : '风暴获取失败' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
