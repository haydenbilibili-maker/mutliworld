import { fetchLiveSatellites } from '@/lib/space/liveSatellites';

/**
 * 实时卫星位置接口：ISS / 天宫 / 代表性 LEO 卫星（wheretheiss.at，免费无 key）。
 * 服务端抓取（无 CORS），CDN 缓存 8 秒（兼顾实时性与限频）。
 */
export async function GET() {
  const items = await fetchLiveSatellites();
  return Response.json(
    { items, generatedAt: new Date().toISOString(), count: items.length },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=8, stale-while-revalidate=20',
      },
    },
  );
}
