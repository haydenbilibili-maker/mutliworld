/**
 * 五角大楼披萨指数 — 演示模拟引擎
 *
 * 真实数据源：pizzint.watch 使用 Google Maps「热门时段」对比历史基线（约 10 分钟刷新）。
 * 无公开 API；本模块用时段基线 + 确定性随机游走生成可信演示数据。
 * 接入实时源时替换 computePizzaIndex() 调用即可。
 */

import type {
  PizzaIndexHistoryPoint,
  PizzaIndexLevel,
  PizzaIndexResponse,
  PizzaIndexTrend,
  PizzaVenue,
} from '@/types/pizza-index';
import { PIZZA_VENUES } from '@/lib/pizza-index/venues';

const DISCLAIMER =
  '本指标为网络 OSINT meme，仅供娱乐参考；披萨订单激增与军事行动无因果关系。演示数据，待接入 pizzint.watch 或同类实时源。';

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function bucketSeed(now: Date): number {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const d = now.getUTCDate();
  const h = now.getUTCHours();
  const slot = Math.floor(now.getUTCMinutes() / 3);
  return y * 1_000_000 + m * 10_000 + d * 100 + h * 4 + slot;
}

/** 华盛顿特区本地小时（近似 EST/EDT，演示用 UTC-5） */
function localHourEt(now: Date): number {
  const h = now.getUTCHours() - 5;
  return h < 0 ? h + 24 : h;
}

/** 深夜加班时段基线抬升（22:00–04:00 ET） */
function nightSurgeFactor(hourEt: number): number {
  if (hourEt >= 22 || hourEt < 4) return 1.35;
  if (hourEt >= 18) return 1.12;
  if (hourEt >= 11 && hourEt <= 14) return 1.08;
  return 0.85;
}

function scoreToLevel(score: number): PizzaIndexLevel {
  if (score >= 76) return 'CRITICAL';
  if (score >= 51) return 'HIGH';
  if (score >= 26) return 'ELEVATED';
  return 'LOW';
}

function trendFromDelta(delta: number): PizzaIndexTrend {
  if (delta > 2) return 'up';
  if (delta < -2) return 'down';
  return 'flat';
}

const LEVEL_LABEL_ZH: Record<PizzaIndexLevel, string> = {
  LOW: '低',
  ELEVATED: '升高',
  HIGH: '高',
  CRITICAL: '危急',
};

export function levelLabelZh(level: PizzaIndexLevel): string {
  return LEVEL_LABEL_ZH[level];
}

function buildVenues(now: Date, rng: () => number): PizzaVenue[] {
  const hourEt = localHourEt(now);
  const surge = nightSurgeFactor(hourEt);

  return PIZZA_VENUES.map((v) => {
    const baseline = 28 + v.weight * 18 * surge;
    const noise = (rng() - 0.5) * 22;
    const spike = rng() > 0.88 ? rng() * 28 : 0;
    const busyLevel = Math.min(100, Math.max(5, Math.round(baseline + noise + spike)));
    const delta = Math.round((busyLevel - baseline) * 10) / 10;
    const contribution = Math.round((busyLevel * v.weight) / PIZZA_VENUES.reduce((s, x) => s + x.weight, 0));

    return {
      id: v.id,
      name: v.name,
      brand: v.brand,
      lat: v.lat,
      lng: v.lng,
      busyLevel,
      delta,
      contribution,
    };
  });
}

function aggregateScore(venues: PizzaVenue[]): number {
  const totalWeight = PIZZA_VENUES.reduce((s, v) => s + v.weight, 0);
  let weighted = 0;
  for (const venue of venues) {
    const seed = PIZZA_VENUES.find((v) => v.id === venue.id);
    weighted += venue.busyLevel * (seed?.weight ?? 1);
  }
  return Math.min(100, Math.max(0, Math.round(weighted / totalWeight)));
}

function buildHistory(now: Date, currentScore: number): PizzaIndexHistoryPoint[] {
  const points: PizzaIndexHistoryPoint[] = [];
  const rng = mulberry32(bucketSeed(now) ^ 0x9e3779b9);

  for (let i = 23; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourEt = localHourEt(t);
    const surge = nightSurgeFactor(hourEt);
    const base = 22 + surge * 18;
    const wobble = (rng() - 0.5) * 16;
    const score =
      i === 0
        ? currentScore
        : Math.min(100, Math.max(0, Math.round(base + wobble + (rng() > 0.93 ? 20 : 0))));
    const HH = String(t.getUTCHours()).padStart(2, '0');
    points.push({ at: `${HH}:00`, score });
  }

  return points;
}

export function computePizzaIndex(now = new Date()): PizzaIndexResponse {
  const seed = bucketSeed(now);
  const rng = mulberry32(seed);
  const prevRng = mulberry32(seed - 1);

  const venues = buildVenues(now, rng);
  const score = aggregateScore(venues);

  const prevVenues = buildVenues(new Date(now.getTime() - 3 * 60 * 1000), prevRng);
  const prevScore = aggregateScore(prevVenues);
  const trend = trendFromDelta(score - prevScore);

  return {
    score,
    level: scoreToLevel(score),
    trend,
    venues,
    history: buildHistory(now, score),
    updatedAt: now.toISOString(),
    source: 'simulated',
    disclaimer: DISCLAIMER,
  };
}
