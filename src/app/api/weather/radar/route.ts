import { fetchRadarFrame } from '@/lib/weather/rainviewer';

/**
 * 降水雷达瓦片元数据（RainViewer，免费无 key）。
 * 返回最新雷达帧 timestamp 与 MapLibre raster tiles 模板。
 */
export async function GET() {
  try {
    const frame = await fetchRadarFrame();
    if (!frame) {
      return Response.json({ error: '暂无雷达帧', timestamp: null, tiles: [] }, { status: 503 });
    }
    return Response.json(frame, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '雷达数据拉取失败';
    return Response.json({ error: message, timestamp: null, tiles: [] }, {
      status: 502,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
