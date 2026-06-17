import { aggregateLiveEvents } from '@/lib/events/aggregate';

/**
 * 统一真实事件流接口 — USGS/GDACS/ReliefWeb/GDELT 聚合、去重、按时排序。
 * 服务端抓取避 CORS；CDN 缓存 5 分钟。任一源失败如实反映在 providerCounts，不造假。
 */
export async function GET() {
  try {
    const body = await aggregateLiveEvents();
    return Response.json(body, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '事件流聚合失败';
    return Response.json(
      { events: [], providerCounts: { USGS: 0, GDACS: 0, ReliefWeb: 0, GDELT: 0 }, generatedAt: new Date().toISOString(), count: 0, error: message },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
