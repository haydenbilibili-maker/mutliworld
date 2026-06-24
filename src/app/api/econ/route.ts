export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { aggregateEcon } from '@/lib/econ/aggregate';

/**
 * 能源经济统一接口 — 真实数据（FRED/EIA/World Bank/Stooq）。
 * 大宗商品价格 · 能源实物供需 · 国别宏观 · 利率金融条件 · 股指。
 * 服务端抓取避 CORS；CDN 缓存 10 分钟。缺 Key/源失败如实降级，不造假。
 */
export async function GET() {
  try {
    const body = await aggregateEcon();
    return Response.json(body, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '能源经济数据聚合失败';
    return Response.json(
      { series: [], available: {}, degraded: [], generatedAt: new Date().toISOString(), count: 0, error: message },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
