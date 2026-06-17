'use client';

/**
 * 区域态势面板 — 社媒 / 趋势 / 态势统一 feed（全区域通用）
 * 子标签筛选 + 热度排序；中东等区域保留 ECharts 趋势图（dataset.trend）。
 */

import { useMemo, useState } from 'react';
import { useRegionData } from '@/hooks/useRegionData';
import { useMapStore } from '@/store/useMapStore';
import { DockPanel } from '@/components/region/DockPanel';
import { EChart } from '@/components/charts/EChart';
import { situationToEvent } from '@/lib/regional-situation/toEvent';
import type {
  RegionalSituationItem,
  SituationItemType,
} from '@/types/regional-situation';

interface RegionalSituationPanelProps {
  className?: string;
}

type TabKey = 'all' | SituationItemType;

const TAB_LABEL: Record<TabKey, string> = {
  all: '全部',
  社媒: '社媒',
  趋势: '趋势',
  态势: '态势',
};

const SENTIMENT_COLOR: Record<string, string> = {
  positive: '#22c55e',
  negative: '#ef4444',
  neutral: '#94a3b8',
  mixed: '#f59e0b',
};

const SENTIMENT_LABEL: Record<string, string> = {
  positive: '正面',
  negative: '负面',
  neutral: '中性',
  mixed: '混合',
};

const FACTION_COLOR: Record<string, string> = {
  us: '#3b82f6',
  israel: '#e2e8f0',
  iran: '#ef4444',
};

const FACTION_LABEL: Record<string, string> = {
  us: '美国',
  israel: '以色列',
  iran: '伊朗',
};

const AXIS = {
  axisLabel: { color: '#8b949e', fontSize: 9 },
  axisLine: { lineStyle: { color: '#30363d' } },
  splitLine: { lineStyle: { color: '#1c2330' } },
};

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return '';
  const m = Math.floor(ms / 60000);
  if (m < 1) return '刚刚';
  if (m < 60) return `${m}分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}小时前`;
  return `${Math.floor(h / 24)}天前`;
}

function fmtEngagement(n?: number): string {
  if (n == null) return '';
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

export function RegionalSituationPanel({ className = '' }: RegionalSituationPanelProps) {
  const { situation, trend } = useRegionData();
  const selectEvent = useMapStore((s) => s.selectEvent);
  const openSidePanel = useMapStore((s) => s.openSidePanel);
  const [tab, setTab] = useState<TabKey>('all');

  const list = useMemo(() => {
    const arr = (situation ?? []).filter((item) => tab === 'all' || item.type === tab);
    return [...arr].sort((a, b) => b.heat - a.heat);
  }, [situation, tab]);

  const forceOption = useMemo<Record<string, unknown> | null>(() => {
    if (!trend || tab !== '趋势') return null;
    const dates = Array.from(new Set(trend.force.map((d) => d.date))).sort();
    const factions = Array.from(new Set(trend.force.map((d) => d.faction ?? 'us')));
    const series = factions.map((f) => ({
      name: FACTION_LABEL[f] ?? f,
      type: 'line',
      smooth: true,
      symbol: 'none',
      connectNulls: true,
      lineStyle: { color: FACTION_COLOR[f] ?? '#94a3b8' },
      itemStyle: { color: FACTION_COLOR[f] ?? '#94a3b8' },
      data: dates.map((dt) => {
        const p = trend.force.find((x) => x.date === dt && (x.faction ?? 'us') === f);
        return p ? p.value : null;
      }),
    }));
    return {
      backgroundColor: 'transparent',
      grid: { top: 24, right: 8, bottom: 20, left: 28 },
      legend: { top: 0, textStyle: { color: '#8b949e', fontSize: 9 } },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: dates.map((d) => d.slice(5)), ...AXIS },
      yAxis: { type: 'value', ...AXIS },
      series,
    };
  }, [trend, tab]);

  const intensityOption = useMemo<Record<string, unknown> | null>(() => {
    if (!trend || tab !== '趋势') return null;
    const dates = trend.intensity.map((d) => d.date.slice(5));
    return {
      backgroundColor: 'transparent',
      grid: { top: 12, right: 8, bottom: 20, left: 28 },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: dates, ...AXIS },
      yAxis: { type: 'value', max: 100, ...AXIS },
      series: [
        {
          name: '烈度指数',
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: { color: 'rgba(239,68,68,0.18)' },
          lineStyle: { color: '#ef4444' },
          itemStyle: { color: '#ef4444' },
          data: trend.intensity.map((d) => d.index),
        },
      ],
    };
  }, [trend, tab]);

  if (!situation || situation.length === 0) return null;

  const tabs: TabKey[] = ['all', '社媒', '趋势', '态势'];

  const chips = (
    <div className="flex gap-1 text-[10px]">
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTab(t)}
          className={`px-1.5 py-0.5 rounded ${tab === t ? 'bg-white/15 text-white' : 'text-dashboard-neutral'}`}
        >
          {TAB_LABEL[t]}
        </button>
      ))}
    </div>
  );

  const openDetail = (item: RegionalSituationItem) => {
    selectEvent(situationToEvent(item));
    openSidePanel(true);
  };

  return (
    <DockPanel
      id="situation"
      title="区域态势"
      count={list.length}
      headerRight={chips}
      className={`w-80 max-h-[60vh] ${className}`}
    >
      {tab === '趋势' && forceOption && intensityOption && (
        <div className="mb-3 pb-2 border-b border-dashboard-neutral/10">
          <div className="text-xs text-dashboard-neutral mb-1">军力趋势</div>
          <div style={{ height: 130 }}>
            <EChart option={forceOption} />
          </div>
          <div className="text-xs text-dashboard-neutral mt-2 mb-1">冲突烈度</div>
          <div style={{ height: 110 }}>
            <EChart option={intensityOption} />
          </div>
        </div>
      )}

      <ul className="space-y-2">
        {list.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => openDetail(item)}
              className="w-full rounded-md border border-dashboard-neutral/15 p-2 text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[10px] px-1 py-0.5 rounded shrink-0"
                  style={{
                    color: SENTIMENT_COLOR[item.sentiment],
                    backgroundColor: `${SENTIMENT_COLOR[item.sentiment]}22`,
                  }}
                >
                  {item.type}
                </span>
                <span className="text-xs text-white truncate flex-1">{item.title}</span>
                <span
                  className="text-[10px] tabular-nums shrink-0"
                  style={{ color: item.heat >= 75 ? '#ef4444' : '#94a3b8' }}
                >
                  {item.heat}°
                </span>
              </div>
              <p className="text-[11px] text-dashboard-neutral/85 leading-snug mt-1 line-clamp-2">
                {item.summary}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] px-1 rounded bg-white/5 text-dashboard-neutral/60"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-[10px] text-dashboard-neutral/50 ml-auto">
                  {SENTIMENT_LABEL[item.sentiment]}
                  {item.platform ? ` · ${item.platform}` : ''}
                  {item.engagement != null ? ` · ${fmtEngagement(item.engagement)}` : ''}
                  {' · '}
                  {timeAgo(item.timestamp)}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <div className="text-[10px] text-dashboard-neutral/60 pt-2 mt-1 border-t border-dashboard-neutral/10">
        区域态势统一 feed · 社媒/趋势/态势合并 · 点击条目查看详情
      </div>
    </DockPanel>
  );
}
