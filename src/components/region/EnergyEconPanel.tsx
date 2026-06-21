'use client';

/**
 * 能源经济面板 — Wave 4 真实数据重构
 * 数据全部来自真实 API（FRED/EIA/World Bank/Stooq），含日/周/年频时间序列。
 * 分类标签 + 迷你走势(sparkline) + 涨跌 + 可点击溯源；缺源如实降级，不造假。
 */

import { useMemo, useState } from 'react';
import { DockPanel } from '@/components/region/DockPanel';
import { useEcon } from '@/hooks/useEcon';
import { ageLabel } from '@/lib/format/time';
import { useRelativeTimeTick } from '@/hooks/useRelativeTimeTick';
import type { EconCategory, EconSeries } from '@/types/econ';

interface EnergyEconPanelProps {
  className?: string;
}

const CAT_LABEL: Record<EconCategory, string> = {
  commodity: '大宗商品',
  energy_supply: '能源实物',
  macro: '国别宏观',
  rate: '利率·金融',
  index: '股指',
  fx: '外汇',
  crypto: '加密',
};

/** 面板呈现的分类顺序（fx/crypto 在「市场」面板，此处不重复） */
const TAB_ORDER: EconCategory[] = ['commodity', 'energy_supply', 'rate', 'index', 'macro'];

const PROVIDER_NAME: Record<string, string> = {
  FRED: '美联储 FRED',
  EIA: '美国能源署 EIA',
  WorldBank: '世界银行',
  Stooq: 'Stooq',
  Frankfurter: 'ECB',
  CoinGecko: 'CoinGecko',
};

/** 由序列点生成迷你走势 SVG path（归一化到 0..1） */
function sparkPath(points: { value: number }[], w: number, h: number): string {
  if (points.length < 2) return '';
  const vals = points.map((p) => p.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const step = w / (points.length - 1);
  return vals
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / span) * h;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function fmt(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (abs >= 1) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return n.toLocaleString('en-US', { maximumFractionDigits: 4 });
}

function SeriesRow({ s }: { s: EconSeries }) {
  const up = (s.changePercent ?? 0) >= 0;
  const color = s.changePercent == null ? '#94a3b8' : up ? '#22c55e' : '#ef4444';
  const path = sparkPath(s.points, 64, 20);
  return (
    <li className="flex items-center gap-2 py-1.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="truncate text-xs text-white">{s.label}</span>
          <span className="shrink-0 text-[10px] text-dashboard-neutral/50">{s.unit}</span>
        </div>
        <div className="text-[10px] text-dashboard-neutral/45">
          {PROVIDER_NAME[s.provider] ?? s.provider} · {s.asOf}
        </div>
      </div>

      <svg width="64" height="20" className="shrink-0" aria-hidden>
        <path d={path} fill="none" stroke={color} strokeWidth="1.2" />
      </svg>

      <div className="w-20 shrink-0 text-right">
        <div className="text-xs tabular-nums text-white">{fmt(s.latest)}</div>
        <div className="text-[10px] tabular-nums" style={{ color }}>
          {s.changePercent == null
            ? '—'
            : `${up ? '▲' : '▼'} ${Math.abs(s.changePercent).toFixed(2)}%`}
        </div>
      </div>

      <a
        href={s.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="数据溯源"
        className="shrink-0 text-[10px] text-dashboard-neutral/40 hover:text-sky-300"
      >
        ↗
      </a>
    </li>
  );
}

export function EnergyEconPanel({ className = '' }: EnergyEconPanelProps) {
  const { byCategory, degraded, generatedAt, isLoading } = useEcon(true);
  const [tab, setTab] = useState<EconCategory>('commodity');
  // 相对时间自动刷新：底部龄期随停留更新
  useRelativeTimeTick(30_000);

  const tabs = useMemo(
    () => TAB_ORDER.filter((c) => (byCategory.get(c)?.length ?? 0) > 0),
    [byCategory],
  );

  const activeTab = tabs.includes(tab) ? tab : tabs[0];
  const rows = activeTab ? byCategory.get(activeTab) ?? [] : [];
  const total = useMemo(
    () => TAB_ORDER.reduce((n, c) => n + (byCategory.get(c)?.length ?? 0), 0),
    [byCategory],
  );
  const dataAge = generatedAt ? ageLabel(generatedAt) : '';

  return (
    <DockPanel
      id="econ"
      icon="📈"
      title="能源经济 · 真实行情"
      count={total}
      className={`w-[min(23rem,calc(100vw-2rem))] ${className}`}
    >
      {tabs.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1 text-[10px]">
          {tabs.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setTab(c)}
              className={`rounded px-2 py-0.5 transition-colors ${activeTab === c ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-dashboard-neutral hover:bg-white/5'}`}
            >
              {CAT_LABEL[c]}
              <span className="ml-0.5 tabular-nums opacity-60">{byCategory.get(c)?.length ?? 0}</span>
            </button>
          ))}
        </div>
      )}

      {isLoading && total === 0 ? (
        <div className="py-3 text-[11px] text-dashboard-neutral/60">加载真实数据…</div>
      ) : total === 0 ? (
        <div className="py-3 text-[11px] text-dashboard-neutral/60">
          暂无可用真实数据。配置 FRED_API_KEY / EIA_API_KEY 可解锁大宗商品与能源实物序列。
        </div>
      ) : (
        <ul className="divide-y divide-dashboard-neutral/10">
          {rows.map((s) => (
            <SeriesRow key={s.id} s={s} />
          ))}
        </ul>
      )}

      {degraded.length > 0 && (
        <div className="mt-2 border-t border-dashboard-neutral/10 pt-2 text-[10px] leading-snug text-amber-300/70">
          数据源降级（不以假值替代）：
          {degraded
            .map((d) => `${PROVIDER_NAME[d.provider] ?? d.provider}${d.reason === 'no_key' ? '(缺Key)' : d.reason === 'empty' ? '(空)' : '(异常)'}`)
            .join('、')}
        </div>
      )}

      <div className="mt-2 border-t border-dashboard-neutral/10 pt-2 text-[10px] text-dashboard-neutral/50">
        真实公开数据 · 仅供研究，非投资建议
        {dataAge && <span title={generatedAt ?? ''}> · {dataAge}更新</span>}
      </div>
    </DockPanel>
  );
}
