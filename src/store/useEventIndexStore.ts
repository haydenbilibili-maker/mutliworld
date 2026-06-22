'use client';

/**
 * 事件空间索引 — 各实时事件层把当前要素的精简点登记到此，供详情页「邻近同类事件」关联列表使用。
 * 仅会话内存（不持久化），按类别分桶；查询用 haversine 求最近同类。真实点位、不编造。
 */

import { create } from 'zustand';

export interface IndexItem {
  id: string;
  title: string;
  category: string;
  lng: number;
  lat: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
}

interface EventIndexState {
  byCat: Record<string, IndexItem[]>;
  setCategory: (category: string, items: IndexItem[]) => void;
}

export const useEventIndexStore = create<EventIndexState>((set) => ({
  byCat: {},
  setCategory: (category, items) =>
    set((s) => {
      const prev = s.byCat[category];
      // 浅比较长度+首尾 id，避免 SWR 静默刷新引发无谓重渲染
      if (prev && prev.length === items.length && prev[0]?.id === items[0]?.id && prev[prev.length - 1]?.id === items[items.length - 1]?.id) return s;
      return { byCat: { ...s.byCat, [category]: items } };
    }),
}));

/** 近似球面距离（km） */
export function haversineKm(aLng: number, aLat: number, bLng: number, bLat: number): number {
  const R = 6371, toRad = Math.PI / 180;
  const dLat = (bLat - aLat) * toRad, dLng = (bLng - aLng) * toRad;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * toRad) * Math.cos(bLat * toRad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

/** 取同类最近的 k 个事件（排除自身） */
export function nearbySameCategory(category: string, lng: number, lat: number, excludeId: string, k = 5): (IndexItem & { distKm: number })[] {
  const items = useEventIndexStore.getState().byCat[category] ?? [];
  return items
    .filter((it) => it.id !== excludeId && Number.isFinite(it.lng) && Number.isFinite(it.lat))
    .map((it) => ({ ...it, distKm: haversineKm(lng, lat, it.lng, it.lat) }))
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, k);
}
