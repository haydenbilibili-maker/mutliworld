'use client';

/**
 * 实时市场面板 — 对标 World Monitor「Finance」维度（Round 5）
 * 股市指数 + 外汇（USD 基准主要货币 + 卢布）+ 加密（BTC/ETH/SOL）。
 * 二级筛选：股指按当前区域过滤；外汇/加密全球通用。
 *
 * 信息增密专项：顶部汇总统计条（股指涨跌计数 + 均值方向），
 * 让用户一眼感知大盘整体走势而非逐条阅读；底部展示数据时效与源可用状态。
 */

import { useMemo } from 'react';
import { useMarkets } from '@/hooks/useMarkets';
import { useMapStore } from '@/store/useMapStore';
import { getRegion } from '@/regions';
import { ageLabel } from '@/lib/format/time';
import { useRelativeTimeTick } from '@/hooks/useRelativeTimeTick';
import { SkeletonRows } from '@/components/ui/Skeleton';
import type { MarketQuote } from '@/lib/markets/markets';
import {
  EMPTY_REGION_MESSAGE,
  filterMarketQuotes,
} from '@/lib/region/contentFilter';
import { DockPanel } from '@/components/region/DockPanel';

interface MarketsPanelProps {
  className?: string;
}

function fmtPrice(q: MarketQuote): string {
  if (q.kind === 'index') {
    return q.price.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
  }
  if (q.kind === 'crypto') {
    return q.price >= 1000
      ? q.price.toLocaleString('en-US', { maximumFractionDigits: 0 })
      : q.price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  return q.price.toLocaleString('en-US', { maximumFractionDigits: 4 });
}

function ChangeTag({
  pct,
  cnConvention = false,
}: {
  pct: number | null;
  cnConvention?: boolean;
}) {
  if (pct == null)
    return <span className="text-[10px] text-dashboard-neutral/40">—</span>;
  const up = pct >= 0;
  const colorClass = cnConvention
    ? up
      ? 'text-rose-400'
      : 'text-emerald-400'
    : up
      ? 'text-emerald-400'
      : 'text-rose-400';
  return (
    <span className={`text-[10px] font-medium ${colorClass}`}>
      {up ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%
    </span>
  );
}

function Row({
  q,
  cnConvention = false,
}: {
  q: MarketQuote;
  cnConvention?: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-2 border-b border-dashboard-neutral/10 py-1 last:border-0">
      <div className="min-w-0">
        <div className="text-[11px] text-white leading-tight truncate">
          {q.label}
        </div>
        <div className="text-[10px] text-dashboard-neutral/50 leading-tight truncate">
          {q.symbol}
          {q.region ? ` · ${q.region}` : ''}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[11px] text-white tabular-nums leading-tight">
          {fmtPrice(q)}
          {q.kind === 'crypto' && (
            <span className="text-[9px] text-dashboard-neutral/40 ml-0.5">
              USD
            </span>
          )}
          {q.kind === 'index' && (
            <span className="text-[9px] text-dashboard-neutral/40 ml-0.5">
              点
            </span>
          )}
        </div>
        <ChangeTag pct={q.changePct} cnConvention={cnConvention} />
      </div>
    </li>
  );
}

export function MarketsPanel({ className = '' }: MarketsPanelProps) {
  const region = useMapStore((s) => s.activeRegion);
  const { items, sources, generatedAt, isLoading } = useMarkets();
  // 相对时间自动刷新：底部「X分钟前」随停留持续更新
  useRelativeTimeTick(30_000);

  const filtered = useMemo(
    () => filterMarketQuotes(items, region),
    [items, region],
  );

  const indices = filtered.filter((q) => q.kind === 'index');
  const fx = filtered.filter((q) => q.kind === 'fx');
  const crypto = filtered.filter((q) => q.kind === 'crypto');
  const regionName = getRegion(region)?.name ?? '全球';
  const isEmpty = !isLoading && filtered.length === 0;

  // 汇总统计：股指整体涨跌方向（仅统计有 changePct 的）
  const indexSummary = useMemo(() => {
    const withChange = indices.filter((q) => q.changePct != null);
    if (withChange.length === 0) return null;
    const up = withChange.filter((q) => (q.changePct as number) >= 0).length;
    const down = withChange.length - up;
    const avg = withChange.reduce((s, q) => s + (q.changePct as number), 0) / withChange.length;
    return { up, down, avg, total: withChange.length };
  }, [indices]);

  const dataAge = generatedAt ? ageLabel(generatedAt) : '';
  // 源可用状态标签（成功拉取的源）
  const activeSources = [
    sources.index && '股指',
    sources.fx && '外汇',
    sources.crypto && '加密',
  ].filter(Boolean) as string[];

  return (
    <DockPanel
      id="markets"
      title={`实时市场 · ${regionName}`}
      count={filtered.length || undefined}
      className={`w-64 max-h-[60vh] max-sm:w-[min(16rem,calc(100vw-2rem))] ${className}`}
    >
      {isLoading && filtered.length === 0 ? (
        <SkeletonRows rows={5} />
      ) : isEmpty ? (
        <div className="text-[11px] text-dashboard-neutral/60">
          {EMPTY_REGION_MESSAGE}
        </div>
      ) : (
        <div className="space-y-2">
          {indexSummary && (
            <div className="flex items-center justify-between rounded-md bg-dashboard-neutral/8 px-2 py-1.5">
              <span className="text-[10px] text-dashboard-neutral/55">大盘方向</span>
              <div className="flex items-center gap-2 text-[10px] tabular-nums">
                <span className="text-emerald-400">▲ {indexSummary.up}</span>
                <span className="text-rose-400">▼ {indexSummary.down}</span>
                <span
                  className={
                    indexSummary.avg >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }
                  title={`${indexSummary.total} 只股指涨跌幅均值`}
                >
                  均 {indexSummary.avg >= 0 ? '+' : ''}
                  {indexSummary.avg.toFixed(2)}%
                </span>
              </div>
            </div>
          )}
          {indices.length > 0 && (
            <section>
              <div className="text-[10px] uppercase tracking-wide text-dashboard-neutral/40 mb-0.5">
                股市指数
              </div>
              <ul>
                {indices.map((q) => (
                  <Row key={q.id} q={q} cnConvention />
                ))}
              </ul>
            </section>
          )}
          {fx.length > 0 && (
            <section>
              <div className="text-[10px] uppercase tracking-wide text-dashboard-neutral/40 mb-0.5">
                外汇 · USD 基准
              </div>
              <ul>
                {fx.map((q) => (
                  <Row key={q.id} q={q} />
                ))}
              </ul>
            </section>
          )}
          {crypto.length > 0 && (
            <section>
              <div className="text-[10px] uppercase tracking-wide text-dashboard-neutral/40 mb-0.5">
                加密 · 24h
              </div>
              <ul>
                {crypto.map((q) => (
                  <Row key={q.id} q={q} />
                ))}
              </ul>
            </section>
          )}
          <div className="text-[9px] text-dashboard-neutral/30 pt-0.5">
            股指按区域筛选 · 外汇/加密全球通用 · 仅供参考
            {dataAge && (
              <>
                {' · '}
                <span title={generatedAt ?? ''}>{dataAge}更新</span>
              </>
            )}
            {activeSources.length > 0 && (
              <>
                {' · '}
                源：{activeSources.join('/')}
              </>
            )}
          </div>
        </div>
      )}
    </DockPanel>
  );
}
