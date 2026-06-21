'use client';

/**
 * 人物资料库统计图表 — 4 张可视化（资料库专项）
 *  · 领域分布饼图（复用 DOMAIN_AVATAR_HEX 配色）
 *  · 区域分布横向柱状图
 *  · 代际分布柱状图（按 birthYear/since 分桶）
 *  · 地理分布密度网格（lng/lat 聚合）
 *
 * 全部复用 <EChart> 封装；深色主题；option 由 useMemo 从人物数据聚合。
 */

import { useMemo } from 'react';
import { EChart } from '@/components/charts/EChart';
import { DOMAIN_AVATAR_HEX } from '@/lib/person/avatar';
import {
  countByDomain,
  countByRegion,
  bucketByDecade,
} from '@/lib/persons/dedup';
import type { Person, PersonDomain } from '@/types/person';
import type { RegionId } from '@/types/region';

interface PersonChartsProps {
  persons: Person[];
  className?: string;
}

const DOMAIN_ORDER: PersonDomain[] = ['政治', '经济', '军事', '社会', '文化'];

const REGION_LABELS: Partial<Record<RegionId, string>> = {
  global: '全球',
  china: '中国',
  middleeast: '中东',
  asia_pacific: '亚太',
  north_america: '北美',
  latin_america: '拉美',
  southeast_asia: '东南亚',
  western_europe: '西欧',
  eastern_europe: '东欧',
};

/** 深色坐标轴样式（与 RegionalSituationPanel 对齐） */
const AXIS = {
  axisLabel: { color: '#8b949e', fontSize: 10 },
  axisLine: { lineStyle: { color: '#30363d' } },
  splitLine: { lineStyle: { color: '#1c2330' } },
};

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4">
      <div className="mb-2">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        {subtitle && (
          <p className="text-[10px] text-dashboard-neutral/50">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function PersonCharts({ persons, className = '' }: PersonChartsProps) {
  // ① 领域分布饼图
  const domainOption = useMemo(() => {
    const counts = countByDomain(persons);
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        backgroundColor: '#0a0e17',
        borderColor: '#30363d',
        textStyle: { color: '#e6edf3', fontSize: 11 },
      },
      legend: {
        bottom: 0,
        textStyle: { color: '#8b949e', fontSize: 10 },
        itemWidth: 10,
        itemHeight: 10,
      },
      series: [
        {
          type: 'pie',
          radius: ['38%', '65%'],
          center: ['50%', '42%'],
          avoidLabelOverlap: true,
          itemStyle: { borderColor: '#0a0e17', borderWidth: 2 },
          label: { show: false },
          emphasis: {
            label: { show: true, color: '#e6edf3', fontSize: 11 },
          },
          data: DOMAIN_ORDER.filter((d) => counts[d] > 0).map((d) => ({
            name: d,
            value: counts[d],
            itemStyle: { color: DOMAIN_AVATAR_HEX[d] },
          })),
        },
      ],
    };
  }, [persons]);

  // ② 区域分布横向柱状图
  const regionOption = useMemo(() => {
    const counts = countByRegion(persons);
    const entries = (Object.entries(counts) as [RegionId, number][])
      .map(([r, n]) => ({ name: REGION_LABELS[r] ?? r, value: n }))
      .sort((a, b) => a.value - b.value); // 升序，最大在顶部
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#0a0e17',
        borderColor: '#30363d',
        textStyle: { color: '#e6edf3', fontSize: 11 },
      },
      grid: { left: 60, right: 24, top: 8, bottom: 24 },
      xAxis: {
        type: 'value',
        ...AXIS,
      },
      yAxis: {
        type: 'category',
        data: entries.map((e) => e.name),
        axisLabel: { ...AXIS.axisLabel },
        axisLine: AXIS.axisLine,
      },
      series: [
        {
          type: 'bar',
          data: entries.map((e) => e.value),
          barWidth: '60%',
          itemStyle: {
            color: '#1890FF',
            borderRadius: [0, 3, 3, 0],
          },
        },
      ],
    };
  }, [persons]);

  // ③ 代际分布柱状图
  const decadeOption = useMemo(() => {
    const buckets = bucketByDecade(persons);
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#0a0e17',
        borderColor: '#30363d',
        textStyle: { color: '#e6edf3', fontSize: 11 },
        formatter: '{b}: {c} 人',
      },
      grid: { left: 32, right: 16, top: 8, bottom: 28 },
      xAxis: {
        type: 'category',
        data: buckets.map((b) => b.decade),
        ...AXIS,
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        ...AXIS,
      },
      series: [
        {
          type: 'bar',
          data: buckets.map((b) => b.count),
          barWidth: '70%',
          itemStyle: {
            color: '#22d3ee',
            borderRadius: [3, 3, 0, 0],
          },
        },
      ],
    };
  }, [persons]);

  // ④ 地理分布密度网格（lng/lat 聚合到 30°×30° 单元）
  const geoOption = useMemo(() => {
    const grid = new Map<string, number>();
    for (const p of persons) {
      if (p.lng === 0 && p.lat === 0) continue;
      const gx = Math.floor((p.lng + 180) / 30);
      const gy = Math.floor((p.lat + 90) / 30);
      const key = `${gx},${gy}`;
      grid.set(key, (grid.get(key) ?? 0) + 1);
    }
    // 转为散点数据：[中心经度, 中心纬度, 数量]
    const data = Array.from(grid.entries()).map(([key, count]) => {
      const [gx, gy] = key.split(',').map(Number);
      return [gx * 30 - 180 + 15, gy * 30 - 90 + 15, count];
    });
    const maxCount = Math.max(1, ...data.map((d) => d[2]));
    return {
      tooltip: {
        backgroundColor: '#0a0e17',
        borderColor: '#30363d',
        textStyle: { color: '#e6edf3', fontSize: 11 },
        formatter: (params: { value: [number, number, number] }) =>
          `区域 ${params.value[0].toFixed(0)}°,${params.value[1].toFixed(0)}°: ${params.value[2]} 人`,
      },
      grid: { left: 32, right: 16, top: 8, bottom: 28 },
      xAxis: {
        type: 'value',
        name: '经度',
        nameTextStyle: { color: '#64748b', fontSize: 9 },
        min: -180,
        max: 180,
        ...AXIS,
      },
      yAxis: {
        type: 'value',
        name: '纬度',
        nameTextStyle: { color: '#64748b', fontSize: 9 },
        min: -90,
        max: 90,
        ...AXIS,
      },
      series: [
        {
          type: 'scatter',
          data,
          symbolSize: (val: number[]) => 6 + (val[2] / maxCount) * 24,
          itemStyle: {
            color: '#f59e0b',
            opacity: 0.7,
          },
        },
      ],
    };
  }, [persons]);

  return (
    <div className={`grid gap-4 md:grid-cols-2 ${className}`}>
      <ChartCard title="领域分布" subtitle="按政治/经济/军事/社会/文化">
        <div style={{ height: 220 }}>
          <EChart option={domainOption} />
        </div>
      </ChartCard>
      <ChartCard title="区域分布" subtitle="按地理区域（可跨区）">
        <div style={{ height: 220 }}>
          <EChart option={regionOption} />
        </div>
      </ChartCard>
      <ChartCard title="代际分布" subtitle="按出生/任职年份分桶">
        <div style={{ height: 200 }}>
          <EChart option={decadeOption} />
        </div>
      </ChartCard>
      <ChartCard title="地理分布密度" subtitle="按经纬度聚合（30°网格）">
        <div style={{ height: 200 }}>
          <EChart option={geoOption} />
        </div>
      </ChartCard>
    </div>
  );
}
