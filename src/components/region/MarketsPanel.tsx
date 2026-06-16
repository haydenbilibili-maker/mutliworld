'use client';

/**
 * 实时市场面板 — 对标 World Monitor「Finance」维度（Round 5）
 * 外汇（USD 基准主要货币 + 卢布）+ 加密（BTC/ETH/SOL）。全局（非区域专属）。
 * 仅展示公开行情，不构成投资建议。
 */

import { useMarkets } from '@/hooks/useMarkets';
import type { MarketQuote } from '@/lib/markets/markets';
import { DockPanel } from '@/components/region/DockPanel';

interface MarketsPanelProps {
  className?: string;
}

function fmtPrice(q: MarketQuote): string {
  if (q.kind === 'crypto') {
    return q.price >= 1000
      ? q.price.toLocaleString('en-US', { maximumFractionDigits: 0 })
      : q.price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  // FX：人民币/欧元等保留 4 位有效
  return q.price.toLocaleString('en-US', { maximumFractionDigits: 4 });
}

function ChangeTag({ pct }: { pct: number | null }) {
  if (pct == null)
    return <span className="text-[10px] text-dashboard-neutral/40">—</span>;
  const up = pct >= 0;
  return (
    <span
      className={`text-[10px] font-medium ${
        up ? 'text-emerald-400' : 'text-rose-400'
      }`}
    >
      {up ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%
    </span>
  );
}

function Row({ q }: { q: MarketQuote }) {
  return (
    <li className="flex items-center justify-between gap-2 border-b border-dashboard-neutral/10 py-1 last:border-0">
      <div className="min-w-0">
        <div className="text-[11px] text-dashboard-neutral leading-tight">
          {q.symbol}
        </div>
        <div className="text-[10px] text-dashboard-neutral/50 leading-tight">
          {q.label}
        </div>
      </div>
      <div className="text-right">
        <div className="text-[11px] text-white tabular-nums leading-tight">
          {fmtPrice(q)}
          {q.kind === 'crypto' && (
            <span className="text-[9px] text-dashboard-neutral/40 ml-0.5">
              USD
            </span>
          )}
        </div>
        <ChangeTag pct={q.changePct} />
      </div>
    </li>
  );
}

export function MarketsPanel({ className = '' }: MarketsPanelProps) {
  const { items, isLoading } = useMarkets();

  if (!isLoading && items.length === 0) return null;

  const fx = items.filter((q) => q.kind === 'fx');
  const crypto = items.filter((q) => q.kind === 'crypto');

  return (
    <DockPanel
      id="markets"
      title="实时市场"
      count={items.length || undefined}
      className={`w-64 max-h-[60vh] ${className}`}
    >
      {isLoading && items.length === 0 ? (
        <div className="text-[11px] text-dashboard-neutral/60">加载中…</div>
      ) : (
        <div className="space-y-2">
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
            来源 Frankfurter / CoinGecko · 仅供参考，非投资建议
          </div>
        </div>
      )}
    </DockPanel>
  );
}
