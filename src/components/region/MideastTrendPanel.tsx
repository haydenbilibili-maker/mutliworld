'use client';

/**
 * 中东趋势面板 — LIFEOS-005 阶段3 第八批（ECharts）
 * TrendChartsWidget 的 React 化：军力趋势(多阵营折线) + 冲突烈度(折线)。
 */

import { useMemo } from 'react';
import { useRegionData } from '@/hooks/useRegionData';
import { DockPanel } from '@/components/region/DockPanel';
import { EChart } from '@/components/charts/EChart';

interface MideastTrendPanelProps {
  className?: string;
}

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

export function MideastTrendPanel({ className = '' }: MideastTrendPanelProps) {
  const { trend } = useRegionData();

  const forceOption = useMemo<Record<string, unknown> | null>(() => {
    if (!trend) return null;
    const dates = Array.from(new Set(trend.force.map((d) => d.date))).sort();
    const factions = Array.from(
      new Set(trend.force.map((d) => d.faction ?? 'us')),
    );
    const series = factions.map((f) => ({
      name: FACTION_LABEL[f] ?? f,
      type: 'line',
      smooth: true,
      symbol: 'none',
      connectNulls: true,
      lineStyle: { color: FACTION_COLOR[f] ?? '#94a3b8' },
      itemStyle: { color: FACTION_COLOR[f] ?? '#94a3b8' },
      data: dates.map((dt) => {
        const p = trend.force.find(
          (x) => x.date === dt && (x.faction ?? 'us') === f,
        );
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
  }, [trend]);

  const intensityOption = useMemo<Record<string, unknown> | null>(() => {
    if (!trend) return null;
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
  }, [trend]);

  if (!trend || !forceOption || !intensityOption) return null;

  return (
    <DockPanel id="trend" title="趋势" className={`w-80 max-h-[60vh] ${className}`}>
      <div className="text-xs text-dashboard-neutral mb-1">军力趋势</div>
      <div style={{ height: 150 }}>
        <EChart option={forceOption} />
      </div>
      <div className="text-xs text-dashboard-neutral mt-3 mb-1">冲突烈度</div>
      <div style={{ height: 130 }}>
        <EChart option={intensityOption} />
      </div>
      <div className="text-[10px] text-dashboard-neutral/60 pt-2 mt-1 border-t border-dashboard-neutral/10">
        数据迁自 Iran 中东大屏 · ECharts
      </div>
    </DockPanel>
  );
}
