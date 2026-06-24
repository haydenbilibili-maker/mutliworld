export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { fetchNews } from '@/lib/news/rss';

/**
 * 实时新闻接口：聚合公开 RSS（BBC/半岛/UN News）。
 * 对标 World Monitor 的新闻流。服务端抓取（无 CORS），CDN 缓存 5 分钟。
 */
export async function GET() {
  try {
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
  } catch (err) {
    const message = err instanceof Error ? err.message : '获取新闻失败';
    return Response.json(
      { error: message, items: [], generatedAt: new Date().toISOString(), count: 0 },
      { status: 502 },
    );
  }
}
