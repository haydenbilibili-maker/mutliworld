import { NextResponse } from 'next/server';

/**
 * GDACS 全球灾害告警 — 地表层（GDACS geteventlist/MAP，免密钥真实，近实时）。
 * 多灾种（地震/热带气旋/洪水/火山/干旱/野火）带分级（绿/橙/红）与严重度。服务端缓存 30 分钟。
 * 仅做精简透传，不改判、不编造；失败回退上次成功缓存。
 */

export const dynamic = 'force-dynamic';

interface SlimFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: {
    eventtype: string; title: string; alertlevel: string; alertRank: number;
    alertscore: number | null; country: string; fromdate: string;
    severity: string; url: string;
  };
}
interface SlimFC { type: 'FeatureCollection'; features: SlimFeature[]; generatedAt: string; source: string; stale?: boolean }

const ALERT_RANK: Record<string, number> = { Green: 1, Orange: 2, Red: 3 };
let cache: { expires: number; body: SlimFC } | null = null;
const TTL = 30 * 60 * 1000;

function num(v: unknown): number | null { const n = Number(v); return Number.isFinite(n) ? n : null; }

export async function GET() {
  const now = Date.now();
  if (cache && cache.expires > now) {
    return NextResponse.json(cache.body, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  }
  try {
    const res = await fetch('https://www.gdacs.org/gdacsapi/api/events/geteventlist/MAP', {
      signal: AbortSignal.timeout(20000), headers: { Accept: 'application/json' }, next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`GDACS HTTP ${res.status}`);
    const d = (await res.json()) as { features?: Array<{ geometry?: { coordinates?: number[] }; properties?: Record<string, unknown> }> };
    const feats = Array.isArray(d.features) ? d.features : [];
    const features: SlimFeature[] = feats
      .map((f) => {
        const c = f.geometry?.coordinates;
        if (!Array.isArray(c) || c.length < 2 || !Number.isFinite(c[0]) || !Number.isFinite(c[1])) return null;
        const p = f.properties ?? {};
        const sev = (p.severitydata ?? {}) as { severitytext?: string };
        const alertlevel = String(p.alertlevel ?? 'Green');
        return {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [c[0], c[1]] as [number, number] },
          properties: {
            eventtype: String(p.eventtype ?? ''),
            title: String(p.name ?? p.eventname ?? '灾害事件'),
            alertlevel,
            alertRank: ALERT_RANK[alertlevel] ?? 1,
            alertscore: num(p.alertscore),
            country: String(p.country ?? ''),
            fromdate: String(p.fromdate ?? ''),
            severity: String(sev.severitytext ?? ''),
            url: String(p.url && typeof p.url === 'object' ? '' : (p.url ?? '')),
          },
        };
      })
      .filter((f): f is SlimFeature => f !== null);
    const body: SlimFC = { type: 'FeatureCollection', features, generatedAt: new Date().toISOString(), source: 'GDACS 全球灾害告警协调系统（近实时）' };
    cache = { expires: now + TTL, body };
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
  } catch (err) {
    if (cache) return NextResponse.json({ ...cache.body, stale: true });
    return NextResponse.json({ type: 'FeatureCollection', features: [], error: err instanceof Error ? err.message : 'GDACS 获取失败' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
