/**
 * 五角大楼披萨指数（Pentagon Pizza Index / PizzINT）类型
 *
 * 数据来源参考：pizzint.watch（Google Maps Popular Times，无公开 REST API）
 * 当前默认使用服务端模拟；设置 PIZZINT_API_URL 可接入第三方代理。
 */

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
  /** simulated | pizzint-proxy | external */
  source: string;
  disclaimer: string;
}
