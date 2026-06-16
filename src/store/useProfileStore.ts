'use client';

/**
 * 垂直剖面交互状态 — 三位一体招牌交互「天—地—海垂直剖面」
 * 开启后点击地图任一点 → 在该坐标垂直钻取，展示宇宙/地表/洋底三层叠加态势。
 */

import { create } from 'zustand';

interface ProfileState {
  /** 剖面模式开启 */
  active: boolean;
  /** 当前剖面点 [lng, lat]（未取点时为 null，面板回退到地图中心） */
  point: [number, number] | null;
  setActive: (active: boolean) => void;
  setPoint: (point: [number, number]) => void;
  close: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  active: false,
  point: null,
  setActive: (active) => set({ active }),
  setPoint: (point) => set({ point }),
  close: () => set({ active: false, point: null }),
}));
