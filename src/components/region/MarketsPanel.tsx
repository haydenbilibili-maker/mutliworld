'use client';

/**
 * 实时市场面板 — 对标 World Monitor「Finance」维度（Round 5）
 * 股市指数 + 外汇（USD 基准主要货币 + 卢布）+ 加密（BTC/ETH/SOL）。
 * 二级筛选：股指按当前区域过滤；外汇/加密全球通用。
 */

import { useMemo } from 'react';
import { useMarkets } from '@/hooks/useMarkets';
import { useMapStore } from '@/store/useMapStore';
import { getRegion } from '@/regions';
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
  const { items, isLoading } = useMarkets();

  const filtered = useMemo(
    () => filterMarketQuotes(items, region),
    [items, region],
  );

  const indices = filtered.filter((q) => q.kind === 'index');
  const fx = filtered.filter((q) => q.kind === 'fx');
  const crypto = filtered.filter((q) => q.kind === 'crypto');
  const regionName = getRegion(region)?.name ?? '全球';
  const isEmpty = !isLoading && filtered.length === 0;

  return (
    <DockPanel
      id="markets"
      title={`实时市场 · ${regionName}`}
      count={filtered.length || undefined}
      className={`w-64 max-h-[60vh] max-sm:w-[min(16rem,calc(100vw-2rem))] ${className}`}
    >
      {isLoading && filtered.length === 0 ? (
        <div className="text-[11px] text-dashboard-neutral/60">加载中…</div>
      ) : isEmpty ? (
        <div className="text-[11px] text-dashboard-neutral/60">
          {EMPTY_REGION_MESSAGE}
        </div>
      ) : (
        <div className="space-y-2">
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
          </div>
        </div>
      )}
    </DockPanel>
  );
}
