/**
 * 股市指数种子数据 — 供市场面板「股市指数」区块展示
 *
 * 当前为静态种子 + 按日微扰（演示波动）；后续可替换为 Yahoo / Alpha Vantage 等实时接口。
 * 基准数值参考 middleeast.energy 全球股指种子，并补充 A 股深证/创业板。
 */

import type { MarketQuote } from '@/lib/markets/markets';
import type { RegionId } from '@/types/region';

export interface StockIndexSeed {
  id: string;
  symbol: string;
  label: string;
  region: string;
  regionIds: RegionId[];
  value: number;
  changePercent: number;
}

/** 主要股指种子（A 股 / 港股 / 美股） */
export const STOCK_INDEX_SEEDS: StockIndexSeed[] = [
  { id: 'sse', symbol: '000001.SH', label: '上证指数', region: '中国', regionIds: ['china'], value: 3024.8, changePercent: -0.6 },
  { id: 'szse', symbol: '399001.SZ', label: '深证成指', region: '中国', regionIds: ['china'], value: 9256.3, changePercent: -0.82 },
  { id: 'chinext', symbol: '399006.SZ', label: '创业板指', region: '中国', regionIds: ['china'], value: 1782.5, changePercent: -1.15 },
  { id: 'hsi', symbol: 'HSI', label: '恒生指数', region: '中国香港', regionIds: ['china', 'asia_pacific'], value: 16280.5, changePercent: -2.0 },
  { id: 'dji', symbol: 'DJI', label: '道琼斯', region: '美国', regionIds: ['north_america'], value: 39102.4, changePercent: -0.79 },
  { id: 'nasdaq', symbol: 'NASDAQ', label: '纳斯达克', region: '美国', regionIds: ['north_america'], value: 18234.1, changePercent: -0.16 },
  { id: 'sp500', symbol: 'S&P 500', label: '标普 500', region: '美国', regionIds: ['north_america'], value: 6881.62, changePercent: -0.61 },
];

/** 简易日期哈希，用于按日微扰演示（非随机 API 调用） */
function dayHash(id: string, ymd: string): number {
  let h = 0;
  for (const c of `${id}:${ymd}`) h = (h * 31 + c.charCodeAt(0)) | 0;
  return (h % 1000) / 1000;
}

/**
 * 将种子转为 MarketQuote；按 UTC 日期对价格/涨跌做 ±0.25% 微扰，模拟日内波动。
 * 对接实时 API 时替换此函数即可。
 */
export function buildStockIndexQuotes(asOf: Date = new Date()): MarketQuote[] {
  const ymd = asOf.toISOString().slice(0, 10);

  return STOCK_INDEX_SEEDS.map((s) => {
    const jitter = (dayHash(s.id, ymd) - 0.5) * 0.5; // ±0.25%
    const changePct = Number((s.changePercent + jitter).toFixed(2));
    const price = Number((s.value * (1 + jitter / 100)).toFixed(2));

    return {
      id: `index-${s.id}`,
      kind: 'index' as const,
      symbol: s.symbol,
      label: s.label,
      price,
      changePct,
      unit: '点',
      asOf: asOf.toISOString(),
      region: s.region,
      regionIds: s.regionIds,
    };
  });
}

/** 异步封装，预留 API 钩子 */
export async function fetchStockIndices(): Promise<MarketQuote[]> {
  // TODO: 可在此接入 Yahoo Finance proxy / Alpha Vantage 等
  return buildStockIndexQuotes();
}
