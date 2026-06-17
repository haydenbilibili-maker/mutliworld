import { computePizzaIndex } from '@/lib/pizza-index/simulate';
import type { PizzaIndexResponse } from '@/types/pizza-index';

const CACHE_TTL_MS = 180_000;

let cache: { expires: number; body: PizzaIndexResponse } | null = null;

/**
 * 可选：第三方 PizzINT 代理 URL（需自行部署或获授权）
 * 示例：PIZZINT_API_URL=https://your-proxy.example.com/pizza-index
 */
async function fetchExternal(url: string): Promise<PizzaIndexResponse | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<PizzaIndexResponse>;
    if (
      typeof data.score !== 'number' ||
      !data.level ||
      !Array.isArray(data.venues) ||
      !data.updatedAt
    ) {
      return null;
    }
    return {
      score: data.score,
      level: data.level,
      trend: data.trend ?? 'flat',
      venues: data.venues,
      history: data.history ?? [],
      updatedAt: data.updatedAt,
      source: data.source ?? 'external',
      disclaimer: data.disclaimer ?? computePizzaIndex().disclaimer,
    };
  } catch {
    return null;
  }
}

/**
 * GET /api/osint/pentagon-pizza
 *
 * 五角大楼披萨指数（Pentagon Pizza Index / PizzINT）
 * 默认 simulated；设置 PIZZINT_API_URL 时尝试拉取外部源并回退模拟。
 */
export async function GET() {
  const now = Date.now();
  if (cache && cache.expires > now) {
    return Response.json(cache.body, {
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' },
    });
  }

  const externalUrl = process.env.PIZZINT_API_URL?.trim();
  let body: PizzaIndexResponse;

  if (externalUrl) {
    const external = await fetchExternal(externalUrl);
    body = external ?? computePizzaIndex();
    if (external) body.source = external.source || 'pizzint-proxy';
  } else {
    body = computePizzaIndex();
  }

  cache = { expires: now + CACHE_TTL_MS, body };

  return Response.json(body, {
    headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' },
  });
}
