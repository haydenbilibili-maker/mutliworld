'use client';

/**
 * 关联洞察面板 — Wave 4 投资/政策模块底座
 * 展示「真实事件 × 真实经济序列」的透明关联信号；每条含可核对依据与置信层级。
 * 仅观测、不预测、非投资建议。
 */

import { DockPanel } from '@/components/region/DockPanel';
import { useInsights } from '@/hooks/useInsights';
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

export function InsightsPanel({ className = '' }: InsightsPanelProps) {
  const { signals, disclaimer, generatedAt, isLoading, error } = useInsights(true);

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
        <div className="py-3 text-[11px] text-dashboard-neutral/60">关联真实数据中…</div>
      ) : signals.length === 0 ? (
        <div className="py-3 text-[11px] text-dashboard-neutral/60">
          当前真实数据未触发关联信号（配置 FRED/EIA Key 可丰富能源经济序列以提升关联覆盖）。
        </div>
      ) : (
        <ul className="space-y-2">
          {signals.map((s) => {
            const meta = KIND_META[s.kind];
            return (
              <li key={s.id} className="rounded-md border border-dashboard-neutral/15 p-2">
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
        {generatedAt ? ` · ${new Date(generatedAt).toLocaleTimeString('zh-CN')}` : ''}
      </div>
    </DockPanel>
  );
}
