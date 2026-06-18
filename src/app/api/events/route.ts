import { aggregateLiveEvents } from '@/lib/events/aggregate';
import { batchTranslate } from '@/lib/translate';

/**
 * 统一真实事件流接口 — USGS/GDACS/ReliefWeb/GDELT 聚合、去重、按时排序。
 * 服务端抓取避 CORS；CDN 缓存 5 分钟。任一源失败如实反映在 providerCounts，不造假。
 * 英文标题与摘要自动翻译为简体中文。
 */
export async function GET() {
  try {
    const body = await aggregateLiveEvents();

    // 翻译事件标题与摘要
    try {
      const allTexts: string[] = [];
      const indexMap: { idx: number; field: 'title' | 'summary' }[] = [];
      for (const ev of body.events) {
        if (ev.title) {
          indexMap.push({ idx: allTexts.length, field: 'title' });
          allTexts.push(ev.title);
        }
        if (ev.summary) {
          indexMap.push({ idx: allTexts.length, field: 'summary' });
          allTexts.push(ev.summary);
        }
      }
      if (allTexts.length > 0) {
        const translationMap = await batchTranslate(allTexts);
        for (const ev of body.events) {
          const tTitle = ev.title ? translationMap.get(ev.title) : undefined;
          if (tTitle && tTitle !== ev.title) ev.title = tTitle;
          const tSummary = ev.summary ? translationMap.get(ev.summary) : undefined;
          if (tSummary && tSummary !== ev.summary) ev.summary = tSummary;
        }
      }
    } catch {
      // 翻译失败不影响事件返回
    }

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
