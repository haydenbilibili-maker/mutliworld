'use client';

/**
 * 关联洞察面板 — Wave 4 投资/政策模块底座
 * 展示「真实事件 × 真实经济序列」的透明关联信号；每条含可核对依据与置信层级。
 * 仅观测、不预测、非投资建议。
 *
 * 信息增密专项：按置信层级汇总信号计数，底部数据时效收敛到统一龄期。
 */

import { useMemo } from 'react';
import { DockPanel } from '@/components/region/DockPanel';
import { useInsights } from '@/hooks/useInsights';
import { ageLabel } from '@/lib/format/time';
import { useRelativeTimeTick } from '@/hooks/useRelativeTimeTick';
import { SkeletonRows } from '@/components/ui/Skeleton';
import type { SignalKind, SignalTier } from '@/types/correlation';

interface InsightsPanelProps {
  className?: string;
}

const KIND_META: Record<SignalKind, { emoji: string; color: string }> = {
  energy_shock: { emoji: '🛢️', color: '#f97316' },
  supply_chain: { emoji: '🚚', color: '#eab308' },
  macro_risk: { emoji: '📉', color: '#ef4444' },
  risk_off: { emoji: '⚠️', color: '#a855f7' },
};

const TIER_LABEL: Record<SignalTier, string> = {
  observed: '已观测',
  emerging: '初现',
  watch: '关注',
};
const TIER_COLOR: Record<SignalTier, string> = {
  observed: '#ef4444',
  emerging: '#f59e0b',
  watch: '#94a3b8',
};
/** 展示顺序：高置信 → 低置信 */
const TIER_ORDER: SignalTier[] = ['observed', 'emerging', 'watch'];

export function InsightsPanel({ className = '' }: InsightsPanelProps) {
  const { signals, disclaimer, generatedAt, isLoading, error } = useInsights(true);
  // 相对时间自动刷新：底部龄期随停留更新
  useRelativeTimeTick(30_000);

  // 按置信层级汇总计数（仅在有信号时展示）
  const tierCounts = useMemo(() => {
    if (signals.length === 0) return null;
    const m = new Map<SignalTier, number>();
    for (const s of signals) m.set(s.tier, (m.get(s.tier) ?? 0) + 1);
    return m;
  }, [signals]);

  const dataAge = generatedAt ? ageLabel(generatedAt) : '';

  return (
    <DockPanel
      id="insights"
      icon="🧠"
      title="关联洞察"
      count={signals.length}
      className={`w-[min(22rem,calc(100vw-2rem))] ${className}`}
    >
      {error ? (
        <div className="py-3 text-[11px] text-dashboard-conflict/80">洞察暂不可用</div>
      ) : isLoading && signals.length === 0 ? (
        <div className="py-1"><SkeletonRows rows={4} /></div>
      ) : signals.length === 0 ? (
        <div className="py-3 text-[11px] text-dashboard-neutral/60">
          当前真实数据未触发关联信号（配置 FRED/EIA Key 可丰富能源经济序列以提升关联覆盖）。
        </div>
      ) : (
        <ul className="space-y-2">
          {tierCounts && (
            <div className="flex flex-wrap items-center gap-1.5 rounded-md bg-dashboard-neutral/8 px-2 py-1 text-[10px]">
              <span className="text-dashboard-neutral/50">置信分布</span>
              {TIER_ORDER.filter((t) => (tierCounts.get(t) ?? 0) > 0).map((t) => (
                <span key={t} className="flex items-center gap-0.5">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: TIER_COLOR[t] }}
                  />
                  <span className="tabular-nums" style={{ color: TIER_COLOR[t] }}>
                    {TIER_LABEL[t]} {tierCounts.get(t)}
                  </span>
                </span>
              ))}
            </div>
          )}
          {signals.map((s) => {
            const meta = KIND_META[s.kind];
            return (
              <li key={s.id} className="mk-row rounded-md border border-dashboard-neutral/15 p-2">
                <div className="flex items-center gap-1.5">
                  <span aria-hidden>{meta.emoji}</span>
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-white">{s.title}</span>
                  <span
                    className="shrink-0 rounded px-1 text-[10px]"
                    style={{ color: TIER_COLOR[s.tier], backgroundColor: `${TIER_COLOR[s.tier]}22` }}
                  >
                    {TIER_LABEL[s.tier]}
                  </span>
                </div>
                <div className="mt-1 text-[11px] leading-snug text-dashboard-neutral/80">{s.rationale}</div>
                <div className="mt-1 flex gap-2 text-[10px] text-dashboard-neutral/45">
                  {s.refs.eventIds.length > 0 && <span>关联事件 {s.refs.eventIds.length}</span>}
                  {s.refs.seriesIds.length > 0 && <span>关联序列 {s.refs.seriesIds.length}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-2 border-t border-dashboard-neutral/10 pt-2 text-[10px] leading-snug text-dashboard-neutral/50">
        {disclaimer || '仅对真实数据做透明关联观测，非投资建议或预测。'}
        {dataAge && <span title={generatedAt ?? ''}> · {dataAge}更新</span>}
      </div>
    </DockPanel>
  );
}
