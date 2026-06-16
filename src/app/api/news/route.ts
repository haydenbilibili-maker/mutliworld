import { fetchNews } from '@/lib/news/rss';

/**
 * 实时新闻接口：聚合公开 RSS（BBC/半岛/UN News）。
 * 对标 World Monitor 的新闻流。服务端抓取（无 CORS），CDN 缓存 5 分钟。
 */
export async function GET() {
  const items = await fetchNews();
  return Response.json(
    { items, generatedAt: new Date().toISOString(), count: items.length },
    {
      headers: {
        'Cache-Control':
          'public, s-maxage=300, stale-while-revalidate=600',
      },
    },
  );
}
