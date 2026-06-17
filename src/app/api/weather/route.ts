import { fetchLiveWeatherPoints } from '@/lib/weather/openMeteo';
import type { LiveWeatherResponse } from '@/types/weather';

/**
 * 实时城市天气（Open-Meteo 当前观测，免费无 key）。
 * 服务端抓取避免 CORS，CDN 缓存 15 分钟。
 */
export async function GET() {
  try {
    const points = await fetchLiveWeatherPoints();
    const body: LiveWeatherResponse = {
      points,
      generatedAt: new Date().toISOString(),
    };
    return Response.json(body, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '天气数据拉取失败';
    return Response.json({ error: message, points: [], generatedAt: new Date().toISOString() }, {
      status: 502,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
