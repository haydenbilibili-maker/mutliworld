/**
 * 能源经济聚合 — 汇集四个真实数据源为统一 EconResponse
 *  FRED(大宗/利率/部分宏观) · EIA(能源实物) · World Bank(国别宏观) · Stooq(股指)
 *
 * 原则：只用真实 API；任一源失败/缺 Key → 在 degraded 如实标记并省略，绝不以假值替代。
 */

import type { EconCategory, EconDegradation, EconResponse, EconSeries } from '@/types/econ';
import { fetchFredSeries, hasFredKey } from '@/lib/datasources/fred';
import { fetchEiaSeries, hasEiaKey } from '@/lib/datasources/eia';
import { fetchWorldBankSeries } from '@/lib/datasources/worldbank';
import { fetchStooqIndexSeries } from '@/lib/datasources/stooq';

const ALL_CATEGORIES: EconCategory[] = [
  'commodity', 'energy_supply', 'macro', 'rate', 'index', 'fx', 'crypto',
];

export async function aggregateEcon(): Promise<EconResponse> {
  const degraded: EconDegradation[] = [];
  const series: EconSeries[] = [];

  const [fred, eia, wb, stooq] = await Promise.allSettled([
    fetchFredSeries(),
    fetchEiaSeries(),
    fetchWorldBankSeries(),
    fetchStooqIndexSeries(),
  ]);

  // FRED
  if (fred.status === 'fulfilled') {
    if (fred.value.length) series.push(...fred.value);
    else degraded.push({ provider: 'FRED', reason: 'empty' });
  } else {
    const noKey = !hasFredKey() || /no_key/.test(String(fred.reason));
    degraded.push({ provider: 'FRED', reason: noKey ? 'no_key' : 'fetch_error', detail: noKey ? '未配置 FRED_API_KEY' : String(fred.reason) });
  }

  // EIA
  if (eia.status === 'fulfilled') {
    if (eia.value.length) series.push(...eia.value);
    else degraded.push({ provider: 'EIA', reason: 'empty' });
  } else {
    const noKey = !hasEiaKey() || /no_key/.test(String(eia.reason));
    degraded.push({ provider: 'EIA', reason: noKey ? 'no_key' : 'fetch_error', detail: noKey ? '未配置 EIA_API_KEY' : String(eia.reason) });
  }

  // World Bank（无 Key）
  if (wb.status === 'fulfilled') {
    if (wb.value.length) series.push(...wb.value);
    else degraded.push({ provider: 'WorldBank', reason: 'empty' });
  } else {
    degraded.push({ provider: 'WorldBank', reason: 'fetch_error', detail: String(wb.reason) });
  }

  // Stooq（无 Key）
  if (stooq.status === 'fulfilled') {
    if (stooq.value.length) series.push(...stooq.value);
    else degraded.push({ provider: 'Stooq', reason: 'empty' });
  } else {
    degraded.push({ provider: 'Stooq', reason: 'fetch_error', detail: String(stooq.reason) });
  }

  const available = Object.fromEntries(
    ALL_CATEGORIES.map((c) => [c, series.some((s) => s.category === c)]),
  ) as Record<EconCategory, boolean>;

  return {
    series,
    available,
    degraded,
    generatedAt: new Date().toISOString(),
    count: series.length,
  };
}
