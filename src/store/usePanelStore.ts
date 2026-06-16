'use client';

/**
 * 面板停靠状态 — LIFEOS-005 面板系统
 * 集中管理各信息面板的开/关；停靠工具条与 DockPanel 外壳共用此 store。
 */

import { create } from 'zustand';

export type PanelId =
  | 'overview'
  | 'military'
  | 'energy'
  | 'targets'
  | 'diplomacy'
  | 'social'
  | 'trend'
  | 'marquee'
  | 'briefing'
  | 'china-briefing'
  | 'us-briefing'
  | 'news'
  | 'markets';

/** 面板元信息（用于停靠工具条按钮） */
export const PANEL_META: { id: PanelId; label: string }[] = [
  { id: 'briefing', label: '简报' },
  { id: 'china-briefing', label: '中国周边' },
  { id: 'us-briefing', label: '美国战略' },
  { id: 'news', label: '新闻' },
  { id: 'markets', label: '市场' },
  { id: 'overview', label: '态势' },
  { id: 'military', label: '军力' },
  { id: 'energy', label: '能源' },
  { id: 'targets', label: '目标' },
  { id: 'diplomacy', label: '外交' },
  { id: 'social', label: '社媒' },
  { id: 'trend', label: '趋势' },
  { id: 'marquee', label: '跑马灯' },
];

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
  targets: true,
  diplomacy: false,
  social: false,
  trend: false,
  marquee: true,
  briefing: true,
  'china-briefing': true,
  'us-briefing': true,
  news: false,
  markets: false,
};

export const usePanelStore = create<PanelState>((set) => ({
  open: { ...ALL },
  toggle: (id) =>
    set((s) => ({ open: { ...s.open, [id]: !s.open[id] } })),
  setOpen: (id, value) =>
    set((s) => ({ open: { ...s.open, [id]: value } })),
  showAll: () =>
    set(() => ({
      open: { overview: true, military: true, energy: true, targets: true, diplomacy: true, social: true, trend: true, marquee: true, briefing: true, 'china-briefing': true, 'us-briefing': true, news: true, markets: true },
    })),
  hideAll: () =>
    set(() => ({
      open: { overview: false, military: false, energy: false, targets: false, diplomacy: false, social: false, trend: false, marquee: false, briefing: false, 'china-briefing': false, 'us-briefing': false, news: false, markets: false },
    })),
}));
