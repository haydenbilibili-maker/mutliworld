export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { aggregateEcon } from '@/lib/econ/aggregate';
import { aggregateLiveEvents } from '@/lib/events/aggregate';
import { deriveSignals, INSIGHTS_DISCLAIMER } from '@/lib/correlation/engine';
import type { InsightsResponse } from '@/types/correlation';

/**
 * 关联洞察接口 — 投资/政策模块底座。
 * 取真实事件流 × 真实能源经济序列，由纯函数关联引擎输出透明、可溯源的观测信号。
 * 不构成投资建议或预测。服务端聚合；CDN 缓存 10 分钟。
 */
export async function GET() {
  try {
    const [econ, events] = await Promise.all([aggregateEcon(), aggregateLiveEvents()]);
    const signals = deriveSignals(events.events, econ.series);
    const body: InsightsResponse = {
      signals,
      disclaimer: INSIGHTS_DISCLAIMER,
      generatedAt: new Date().toISOString(),
      count: signals.length,
    };
    return Response.json(body, {
      headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '关联洞察生成失败';
    return Response.json(
      { signals: [], disclaimer: INSIGHTS_DISCLAIMER, generatedAt: new Date().toISOString(), count: 0, error: message },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
