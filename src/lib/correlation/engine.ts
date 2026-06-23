/**
 * 关联引擎 — 事件流 × 能源经济序列 的透明关联观测（投资/政策模块底座）
 *
 * 纯函数、可单测、无副作用。只用真实输入；只陈述已观测关系，不编造预测。
 * 每条信号引用真实事件 id 与真实序列 id，依据含具体数值，便于上层核对与扩展。
 */

import type { EconSeries } from '@/types/econ';
import type { LiveEvent } from '@/types/liveEvent';
import type { CorrelationSignal } from '@/types/correlation';

const ENERGY_RE =
  /oil|crude|opec|petrol|gas|lng|pipeline|refiner|energy|sanction|embargo|strait|hormuz|suez|iran|saudi|opec|russia|ukraine|venezuela|nuclear/i;

/** 供应链关键词：关键矿产/半导体/化工的出口管制、禁运、断供 */
const SUPPLY_CHAIN_RE =
  /semiconductor|chip|wafer|tsmc|asml|lithium|cobalt|rare.?earth|稀土|出口管制|禁运|断供|export.?control|embargo|gallium|germanium|graphite|tungsten|sanction/i;

function findSeries(series: EconSeries[], id: string): EconSeries | undefined {
  return series.find((s) => s.id === id);
}

function pct(s: EconSeries | undefined): number | null {
  return s?.changePercent ?? null;
}

/** 由真实事件 + 真实序列推导关联信号。 */
export function deriveSignals(events: LiveEvent[], series: EconSeries[]): CorrelationSignal[] {
  const out: CorrelationSignal[] = [];
  const now = new Date().toISOString();

  const brent = findSeries(series, 'fred-DCOILBRENTEU');
  const wti = findSeries(series, 'fred-DCOILWTICO');
  const natgas = findSeries(series, 'fred-DHHNGSP');
  const vix = findSeries(series, 'fred-VIXCLS');
  const t10y2y = findSeries(series, 'fred-T10Y2Y');

  // 1) 能源冲击：地缘事件(含能源关键词) ↔ 原油价格异动
  const energyEvents = events.filter(
    (e) => e.category === 'geopolitics' && ENERGY_RE.test(`${e.title} ${e.area ?? ''}`),
  );
  const oil = brent ?? wti;
  if (energyEvents.length > 0 && oil && pct(oil) != null && Math.abs(pct(oil)!) >= 2) {
    const ch = pct(oil)!;
    out.push({
      id: 'sig-energy-shock',
      kind: 'energy_shock',
      tier: Math.abs(ch) >= 4 ? 'observed' : 'emerging',
      title: `能源冲击观测：${oil.label} ${ch >= 0 ? '上行' : '下行'} ${Math.abs(ch).toFixed(1)}%`,
      rationale: `过去 24h 检出 ${energyEvents.length} 条含能源关键词的地缘事件，同期 ${oil.label} 收于 ${oil.latest}${oil.unit}（较前值 ${ch >= 0 ? '+' : ''}${ch.toFixed(2)}%）${natgas && pct(natgas) != null ? `，天然气 ${pct(natgas)! >= 0 ? '+' : ''}${pct(natgas)!.toFixed(2)}%` : ''}。`,
      refs: {
        eventIds: energyEvents.slice(0, 8).map((e) => e.id),
        seriesIds: [oil.id, ...(natgas ? [natgas.id] : [])],
      },
      eventCategories: ['geopolitics'],
      econCategories: ['commodity'],
      magnitude: ch,
      asOf: now,
    });
  }

  // 2) 供应链扰动：高烈度灾害/地震，或含供应链关键词的地缘事件 ↔ 股指/能源实物
  const disasterEvents = events.filter(
    (e) => (e.category === 'disaster' || e.category === 'quake') && (e.severity === 'high' || e.severity === 'critical'),
  );
  const supplyChainEvents = events.filter(
    (e) => e.category === 'geopolitics' && SUPPLY_CHAIN_RE.test(`${e.title} ${e.area ?? ''}`),
  );
  const scEvents = [...disasterEvents, ...supplyChainEvents];
  if (scEvents.length > 0) {
    const indices = series.filter((s) => s.category === 'index' && s.changePercent != null);
    const worst = indices.sort((a, b) => (a.changePercent ?? 0) - (b.changePercent ?? 0))[0];
    const hasExportCtrl = supplyChainEvents.length > 0;
    out.push({
      id: 'sig-supply-chain',
      kind: 'supply_chain',
      tier: worst && Math.abs(worst.changePercent ?? 0) >= 1 ? 'emerging' : 'watch',
      title: hasExportCtrl
        ? `供应链扰动关注：${supplyChainEvents.length} 条关键矿产/半导体/化工管制事件`
        : `供应链扰动关注：${disasterEvents.length} 起高烈度灾害/地震`,
      rationale: hasExportCtrl
        ? `检出 ${supplyChainEvents.length} 条含关键矿产/半导体/化工出口管制或断供关键词的地缘事件${disasterEvents.length > 0 ? `，另有 ${disasterEvents.length} 起高烈度灾害` : ''}${worst ? `；同期 ${worst.area ?? ''}${worst.label} ${(worst.changePercent ?? 0) >= 0 ? '+' : ''}${(worst.changePercent ?? 0).toFixed(2)}%` : ''}。出口管制与断供可能冲击半导体、电池、航空制造等产业链，需跟踪相关库存与替代供应。`
        : `检出 ${disasterEvents.length} 起高/严重级灾害或地震事件${worst ? `；同期 ${worst.area ?? ''}${worst.label} ${(worst.changePercent ?? 0) >= 0 ? '+' : ''}${(worst.changePercent ?? 0).toFixed(2)}%` : ''}。灾害可能扰动区域物流与大宗供应，需结合实物库存跟踪。`,
      refs: {
        eventIds: scEvents.slice(0, 8).map((e) => e.id),
        seriesIds: worst ? [worst.id] : [],
      },
      eventCategories: ['disaster', 'quake', 'geopolitics'],
      econCategories: ['index', 'energy_supply'],
      magnitude: worst?.changePercent ?? null,
      asOf: now,
    });
  }

  // 3) 宏观风险：收益率曲线倒挂（10Y-2Y < 0）
  if (t10y2y && t10y2y.latest < 0) {
    out.push({
      id: 'sig-macro-inversion',
      kind: 'macro_risk',
      tier: 'observed',
      title: `收益率曲线倒挂：10Y-2Y ${t10y2y.latest.toFixed(2)}%`,
      rationale: `美债 10 年-2 年利差为 ${t10y2y.latest.toFixed(2)}%（${t10y2y.asOf}），处于倒挂区间，历史上常被视作衰退前瞻指标，宜对周期性资产保持谨慎。`,
      refs: { eventIds: [], seriesIds: [t10y2y.id] },
      eventCategories: [],
      econCategories: ['rate'],
      magnitude: t10y2y.latest,
      asOf: now,
    });
  }

  // 4) 避险情绪：VIX 抬升
  if (vix && vix.latest >= 20) {
    out.push({
      id: 'sig-risk-off',
      kind: 'risk_off',
      tier: vix.latest >= 25 ? 'observed' : 'emerging',
      title: `避险升温：VIX ${vix.latest.toFixed(1)}`,
      rationale: `CBOE 波动率指数 VIX 收于 ${vix.latest.toFixed(1)}（${vix.asOf}），市场避险情绪偏高，风险资产波动放大概率上升。`,
      refs: { eventIds: [], seriesIds: [vix.id] },
      eventCategories: [],
      econCategories: ['rate'],
      magnitude: vix.latest,
      asOf: now,
    });
  }

  return out;
}

export const INSIGHTS_DISCLAIMER =
  '本信号仅对「真实事件流」与「真实经济序列」做透明关联观测，依据均可溯源；不构成投资建议或确定性预测。';
