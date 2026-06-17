/**
 * 五角大楼披萨指数（Pentagon Pizza Index / PizzINT）类型
 *
 * 默认从 pizzint.watch 拉取实时数据；失败时回退服务端模拟。
 * PIZZINT_API_URL 可覆盖 API 基址（默认 https://www.pizzint.watch）。
 */

export type PizzaIndexSource = 'pizzint.watch' | 'simulated' | 'pizzint-proxy' | 'external';

export type PizzaIndexLevel = 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export type PizzaIndexTrend = 'up' | 'down' | 'flat';

export interface PizzaVenue {
  id: string;
  name: string;
  brand: string;
  lat: number;
  lng: number;
  /** 当前繁忙度 0–100 */
  busyLevel: number;
  /** 相对基线变化（百分点） */
  delta: number;
  /** 对综合指数的权重贡献 0–100 */
  contribution: number;
}

export interface PizzaIndexHistoryPoint {
  /** ISO 时间或小时标签 */
  at: string;
  score: number;
}

export interface PizzaIndexResponse {
  score: number;
  level: PizzaIndexLevel;
  trend: PizzaIndexTrend;
  venues: PizzaVenue[];
  history: PizzaIndexHistoryPoint[];
  updatedAt: string;
  source: PizzaIndexSource | string;
  disclaimer: string;
}
