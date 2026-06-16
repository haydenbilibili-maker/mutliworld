import { fetchMarkets } from '@/lib/markets/markets';

/**
 * 实时市场接口：外汇（Frankfurter）+ 加密（CoinGecko），免费无 key。
 * 对标 World Monitor 的 Finance 维度。服务端抓取（无 CORS），CDN 缓存 2 分钟。
 */
export async function GET() {
  const { quotes, sources } = await fetchMarkets();
  return Response.json(
    { items: quotes, sources, generatedAt: new Date().toISOString(), count: quotes.length },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
      },
    },
  );
}
