export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { ORBITERS } from '@/bodies/orbiters';
import { fetchOrbiterFixes } from '@/lib/ephemeris/horizons';

/**
 * 在轨轨道器星下点 — JPL Horizons 实时星历（绕月/绕火）。
 * 服务端聚合避 CORS、控配额；CDN 缓存 5 分钟。失败的轨道器记入 degraded，不造假。
 */
export async function GET() {
  try {
    const fixes = await fetchOrbiterFixes(ORBITERS);
    const gotIds = new Set(fixes.map((f) => f.id));
    const degraded = ORBITERS.filter((o) => !gotIds.has(o.id)).map((o) => ({ id: o.id, name: o.name, body: o.body }));
    return Response.json(
      { fixes, degraded, generatedAt: new Date().toISOString(), count: fixes.length },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : '星历聚合失败';
    return Response.json(
      { fixes: [], degraded: [], generatedAt: new Date().toISOString(), count: 0, error: message },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
