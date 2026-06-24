export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { TRAVERSE_ROVERS } from '@/bodies/traverse';
import { fetchTraverses } from '@/lib/bodies/traverse';

/**
 * 巡视器行进轨迹 — NASA MMGIS 公开 waypoints 构建折线（好奇号/毅力号）。
 * 服务端聚合避 CORS；CDN 缓存 1 小时。失败的巡视器记入 degraded，不造假。
 */
export async function GET() {
  try {
    const paths = await fetchTraverses(TRAVERSE_ROVERS);
    const got = new Set(paths.map((p) => p.id));
    const degraded = TRAVERSE_ROVERS.filter((t) => !got.has(t.id)).map((t) => ({ id: t.id, rover: t.rover }));
    return Response.json(
      { paths, degraded, generatedAt: new Date().toISOString(), count: paths.length },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'traverse 聚合失败';
    return Response.json(
      { paths: [], degraded: [], generatedAt: new Date().toISOString(), count: 0, error: message },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
