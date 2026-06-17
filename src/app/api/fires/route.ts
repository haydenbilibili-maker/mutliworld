import { fetchActiveFires, hasFirmsKey } from '@/lib/fires/firms';
import type { LiveFiresResponse } from '@/types/fires';

/**
 * 实时活跃火点（NASA FIRMS VIIRS，近实时）。
 * 需 FIRMS_MAP_KEY（服务端环境变量）；未配置时返回空 + noKey。
 * 服务端抓取避 CORS，CDN 缓存 10 分钟。
 */
export async function GET() {
  try {
    const points = await fetchActiveFires(1);
    const body: LiveFiresResponse = {
      points,
      generatedAt: new Date().toISOString(),
      count: points.length,
      noKey: !hasFirmsKey(),
    };
    return Response.json(body, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '火点数据拉取失败';
    return Response.json(
      { error: message, points: [], generatedAt: new Date().toISOString(), count: 0 },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
