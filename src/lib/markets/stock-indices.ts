/**
 * 股市指数 — 真实数据（Stooq，免费无 Key）
 *
 * Wave 4 重构：原「静态种子 + 按日微扰」已废弃，改为 Stooq 真实日收盘行情。
 * 用近两个交易日真实收盘价计算日涨跌幅；逐符号 try/catch，失败跳过（不造假）。
 */

import type { MarketQuote } from '@/lib/markets/markets';
import { STOOQ_INDICES, fetchStooqDaily } from '@/lib/datasources/stooq';

/** 拉取主要股指真实行情（供市场面板「股市指数」区块）。 */
export async function fetchStockIndices(): Promise<MarketQuote[]> {
  const settled = await Promise.allSettled(
    STOOQ_INDICES.map(async (d) => {
      const points = await fetchStooqDaily(d.symbol, 14);
      if (points.length === 0) return null;
      const latest = points[points.length - 1];
      const prev = points.length >= 2 ? points[points.length - 2] : null;
      const changePct =
        prev && prev.value !== 0 ? ((latest.value - prev.value) / prev.value) * 100 : null;
      const quote: MarketQuote = {
        id: `index-${d.symbol.replace(/[^a-z0-9]/gi, '')}`,
        kind: 'index',
        symbol: d.symbol.replace('^', '').toUpperCase(),
        label: d.label,
        price: Number(latest.value.toFixed(2)),
        changePct: changePct == null ? null : Number(changePct.toFixed(2)),
        unit: '点',
        asOf: latest.date,
        region: d.region,
        regionIds: d.regionIds,
      };
      return quote;
    }),
  );

  const out: MarketQuote[] = [];
  for (const s of settled) {
    if (s.status === 'fulfilled' && s.value) out.push(s.value);
  }
  return out;
}
