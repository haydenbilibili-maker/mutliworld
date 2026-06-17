import type { EventDetail, ImpactLevel } from '@/types/geo';
import type { RegionalSituationItem } from '@/types/regional-situation';

function heatToImpact(heat: number): ImpactLevel {
  if (heat >= 85) return 'critical';
  if (heat >= 70) return 'high';
  if (heat >= 50) return 'medium';
  return 'low';
}

/** 区域态势条目 → 地图侧栏 EventDetail */
export function situationToEvent(item: RegionalSituationItem): EventDetail {
  const source =
    item.platform ??
    (item.type === '社媒'
      ? '社媒监测'
      : item.type === '趋势'
        ? '趋势指标'
        : '态势摘要');

  return {
    id: item.id,
    title: item.title,
    source: `${source} · ${item.type}`,
    timestamp: item.timestamp,
    location: [item.lng ?? 0, item.lat ?? 0],
    impact_level: heatToImpact(item.heat),
    description: `${item.summary}\n\n情绪：${item.sentiment} · 热度：${item.heat} · 标签：${item.tags.join('、')}`,
    category: `situation:${item.type}`,
  };
}
