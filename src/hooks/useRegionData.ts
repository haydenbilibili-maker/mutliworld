'use client';

/**
 * 区域数据 Hook — LIFEOS-005（通用能力沉淀后）
 *
 * 不再硬编码任何区域：直接从注册表取当前区域的 RegionModule.dataset。
 * 新区域接入只需建 RegionModule + 填 dataset，本 Hook 与所有面板自动适配。
 */

import { useMemo } from 'react';
import { useMapStore } from '@/store/useMapStore';
import type { EventDetail } from '@/types/geo';
import type { RegionId, RegionDataset } from '@/types/region';
import { getRegion } from '@/regions';
import { getSituationForRegion } from '@/regions/regional-situation';

export interface RegionData extends RegionDataset {
  regionId: RegionId;
  /** 区域地理边界（用于高亮框），无则 null */
  bounds: [[number, number], [number, number]] | null;
  /** 始终存在（默认空数组），供地图种子层使用 */
  events: EventDetail[];
}

/** 稳定的空数组引用，避免每次渲染产生新引用导致副作用反复执行 */
const EMPTY_EVENTS: EventDetail[] = [];

export function useRegionData(): RegionData {
  const region = useMapStore((s) => s.activeRegion);

  // useMemo 锁定引用：仅当区域变化时重算，地图副作用不会每帧重跑。
  return useMemo<RegionData>(() => {
    const mod = getRegion(region);
    const ds: RegionDataset = mod?.dataset ?? {};
    return {
      regionId: region,
      bounds: mod?.bounds ?? null,
      ...ds,
      events: ds.events ?? EMPTY_EVENTS,
      situation: ds.situation ?? getSituationForRegion(region),
    };
  }, [region]);
}
