'use client';

/**
 * 区域详情卡开关 — 对标 World Monitor Round 8「国家/区域详情」
 * 由搜索或区域切换触发，展示该区域的画像与数据覆盖。
 */

import { create } from 'zustand';
import type { RegionId } from '@/types/region';

interface RegionDetailState {
  regionId: RegionId | null;
  open: (id: RegionId) => void;
  close: () => void;
}

export const useRegionDetailStore = create<RegionDetailState>((set) => ({
  regionId: null,
  open: (regionId) => set({ regionId }),
  close: () => set({ regionId: null }),
}));
