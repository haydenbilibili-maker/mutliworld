'use client';

/**
 * 面板停靠状态 — LIFEOS-005 面板系统
 * 集中管理各信息面板的开/关；停靠工具条与 DockPanel 外壳共用此 store。
 */

import { create } from 'zustand';
import type { RegionId } from '@/types/region';
import { formatDockPanelLabel, getRegionShortLabel } from '@/lib/region/contentFilter';

export type PanelId =
  | 'overview'
  | 'military'
  | 'energy'
  | 'persons'
  | 'diplomacy'
  | 'situation'
  | 'marquee'
  | 'briefing'
  | 'china-briefing'
  | 'us-briefing'
  | 'seabed-briefing'
  | 'space-briefing'
  | 'news'
  | 'markets'
  | 'econ'
  | 'insights';

/** 面板元信息（用于停靠工具条按钮） */
export const PANEL_META: { id: PanelId; label: string }[] = [
  { id: 'briefing', label: '简报' },
  { id: 'news', label: '新闻' },
  { id: 'markets', label: '市场' },
  { id: 'econ', label: '能源经济' },
  { id: 'insights', label: '关联洞察' },
  { id: 'overview', label: '态势' },
  { id: 'military', label: '军力' },
  { id: 'energy', label: '能源' },
  { id: 'persons', label: '人物' },
  { id: 'diplomacy', label: '外交' },
  { id: 'situation', label: '区域态势' },
  { id: 'marquee', label: '跑马灯' },
];

/** 区域专题简报 — 仅在该区域激活时出现在停靠工具条（非地图图层开关） */
export const REGION_BRIEFING_PANELS: {
  id: PanelId;
  label: string;
  region: RegionId;
  title: string;
}[] = [
  {
    id: 'china-briefing',
    label: '周边简报',
    region: 'china',
    title: '中国周边专题简报 · 汇总当前地图监测点，不切换图层',
  },
  {
    id: 'us-briefing',
    label: '战略简报',
    region: 'north_america',
    title: '美国战略专题简报 · 汇总当前地图监测点，不切换图层',
  },
];

/** 通用「简报」被区域专题简报替代的区域 */
const REGION_BRIEFING_REPLACES_GENERIC = new Set<RegionId>([
  'china',
  'north_america',
]);

/** 当前区域下应显示的停靠工具条按钮 */
export function getDockPanels(region: RegionId): { id: PanelId; label: string; title?: string }[] {
  const base = PANEL_META.filter(
    (p) => p.id !== 'briefing' || !REGION_BRIEFING_REPLACES_GENERIC.has(region),
  ).map((p) => ({
    ...p,
    label: formatDockPanelLabel(p.label, p.id, region),
    title:
      p.id === 'markets' || p.id === 'news' || p.id === 'marquee'
        ? `${p.label} — 按「${getRegionShortLabel(region)}」区域筛选`
        : undefined,
  }));
  const regional = REGION_BRIEFING_PANELS.filter((p) => p.region === region).map(
    ({ id, label, title }) => ({ id, label, title }),
  );
  const briefingIdx = base.findIndex((p) => p.id === 'briefing');
  if (briefingIdx >= 0 && regional.length > 0) {
    return [
      ...base.slice(0, briefingIdx + 1),
      ...regional,
      ...base.slice(briefingIdx + 1),
    ];
  }
  if (regional.length > 0) {
    return [...regional, ...base];
  }
  return base;
}

interface PanelState {
  open: Record<PanelId, boolean>;
  toggle: (id: PanelId) => void;
  setOpen: (id: PanelId, value: boolean) => void;
  showAll: () => void;
  hideAll: () => void;
}

const ALL: Record<PanelId, boolean> = {
  overview: false,
  military: true,
  energy: true,
  persons: true,
  diplomacy: false,
  situation: false,
  marquee: true,
  briefing: true,
  'china-briefing': true,
  'us-briefing': true,
  'seabed-briefing': true,
  'space-briefing': true,
  news: false,
  markets: false,
  econ: false,
  insights: false,
};

export const usePanelStore = create<PanelState>((set) => ({
  open: { ...ALL },
  toggle: (id) =>
    set((s) => ({ open: { ...s.open, [id]: !s.open[id] } })),
  setOpen: (id, value) =>
    set((s) => ({ open: { ...s.open, [id]: value } })),
  showAll: () =>
    set(() => ({
      open: { overview: true, military: true, energy: true, persons: true, diplomacy: true, situation: true, marquee: true, briefing: true, 'china-briefing': true, 'us-briefing': true, 'seabed-briefing': true, 'space-briefing': true, news: true, markets: true, econ: true, insights: true },
    })),
  hideAll: () =>
    set(() => ({
      open: { overview: false, military: false, energy: false, persons: false, diplomacy: false, situation: false, marquee: false, briefing: false, 'china-briefing': false, 'us-briefing': false, 'seabed-briefing': false, 'space-briefing': false, news: false, markets: false, econ: false, insights: false },
    })),
}));
