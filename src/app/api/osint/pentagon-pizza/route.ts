export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { fetchPizzintWatch } from '@/lib/pizza-index/pizzint';
import { computePizzaIndex } from '@/lib/pizza-index/simulate';
import type { PizzaIndexResponse } from '@/types/pizza-index';

const LIVE_CACHE_TTL_MS = 300_000;
const SIM_CACHE_TTL_MS = 180_000;

let cache: { expires: number; body: PizzaIndexResponse } | null = null;

const FALLBACK_NOTE = ' 实时源 pizzint.watch 暂不可用，以下为模拟演示数据。';

/**
 * GET /api/osint/pentagon-pizza
 *
 * 五角大楼披萨指数（Pentagon Pizza Index / PizzINT）
 * 优先拉取 pizzint.watch；失败时回退服务端模拟。
 */
export async function GET() {
  const now = Date.now();
  if (cache && cache.expires > now) {
    const isLive = cache.body.source === 'pizzint.watch';
    return Response.json(cache.body, {
      headers: {
        'Cache-Control': isLive
          ? 'public, s-maxage=300, stale-while-revalidate=600'
          : 'public, s-maxage=120, stale-while-revalidate=300',
      },
    });
  }

  let body: PizzaIndexResponse;
  let ttl: number;

  try {
    const live = await fetchPizzintWatch();
    if (live) {
      body = live;
      ttl = LIVE_CACHE_TTL_MS;
    } else {
      body = computePizzaIndex();
      body.disclaimer = `${body.disclaimer}${FALLBACK_NOTE}`;
      ttl = SIM_CACHE_TTL_MS;
    }
  } catch {
    // 实时源不可用（网络超时/API 错误），回退模拟
    try {
      body = computePizzaIndex();
    } catch {
      // 模拟计算也失败时返回错误，不给 HTTP 200 falsehood
      return Response.json(
        { error: '披萨指数实时源不可用且模拟计算失败', source: 'error', index: null },
        { status: 502, headers: { 'Cache-Control': 'no-store' } },
      );
    }
    body.disclaimer = `${body.disclaimer}${FALLBACK_NOTE}`;
    ttl = SIM_CACHE_TTL_MS;
  }

  cache = { expires: now + ttl, body };

  const isLive = body.source === 'pizzint.watch';
  return Response.json(body, {
    headers: {
      'Cache-Control': isLive
        ? 'public, s-maxage=300, stale-while-revalidate=600'
        : 'public, s-maxage=120, stale-while-revalidate=300',
    },
  });
}
