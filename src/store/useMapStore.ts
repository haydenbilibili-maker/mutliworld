'use client';

import { create } from 'zustand';
import type { LayerId, TimeRange, ViewPreset } from '@/types/geo';
import type { EventDetail } from '@/types/geo';
import type { RegionId } from '@/types/region';
import type { SpatialTier } from '@/types/tier';
import { getRegion, DEFAULT_REGION_ID } from '@/regions';
import { getTier, DEFAULT_TIER_ID } from '@/tiers';
import { filterSensitive, SENSITIVE_LAYERS } from '@/lib/layers/sensitivity';
import type { GlobeMotionSpeed } from '@/lib/globe/motionConstants';
import { centersEqual, layersEqual, zoomsEqual } from '@/lib/map/viewState';

export interface MapState {
  /** 当前区域模块（LIFEOS-005 平台化） */
  activeRegion: RegionId;
  /** 当前空间层（三位一体：宇宙/地表/洋底） */
  activeTier: SpatialTier;
  /** 商用：一键下架敏感图层 */
  hideSensitive: boolean;
  /** 3D 地球（globe 投影）开关；需 maplibre v5 才实际生效，v4 下为 no-op */
  globe: boolean;
  /** 宇宙层地球自转动效播放（仅 space tier 生效） */
  globeMotionPlaying: boolean;
  /** 宇宙层动效速度倍率 */
  globeMotionSpeed: GlobeMotionSpeed;
  center: [number, number];
  zoom: number;
  view: ViewPreset;
  timeRange: TimeRange;
  activeLayers: LayerId[];
  selectedEvent: EventDetail | null;
  sidePanelOpen: boolean;
}

export interface MapActions {
  /** 切换区域：应用该区域的默认视野 / 图层 / 时间范围 */
  setRegion: (regionId: RegionId) => void;
  /** 切换空间层：应用该层默认图层（保持当前地理视野，原地穿越） */
  setTier: (tierId: SpatialTier) => void;
  /** 一键下架/恢复敏感图层 */
  setHideSensitive: (hide: boolean) => void;
  /** 切换 3D 地球（globe）投影 */
  setGlobe: (globe: boolean) => void;
  setGlobeMotionPlaying: (playing: boolean) => void;
  setGlobeMotionSpeed: (speed: GlobeMotionSpeed) => void;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setView: (view: ViewPreset) => void;
  setTimeRange: (timeRange: TimeRange) => void;
  setActiveLayers: (layers: LayerId[]) => void;
  toggleLayer: (layerId: LayerId) => void;
  selectEvent: (event: EventDetail | null) => void;
  openSidePanel: (open: boolean) => void;
}

const initialState: MapState = {
  activeRegion: DEFAULT_REGION_ID,
  activeTier: DEFAULT_TIER_ID,
  hideSensitive: false,
  globe: false,
  globeMotionPlaying: true,
  globeMotionSpeed: 1,
  center: [105, 28],
  zoom: 3.5,
  view: 'global',
  timeRange: '7d',
  activeLayers: ['conflicts', 'economic', 'weather'],
  selectedEvent: null,
  sidePanelOpen: false,
};

export const useMapStore = create<MapState & MapActions>((set) => ({
  ...initialState,
  setRegion: (regionId) =>
    set(() => {
      const mod = getRegion(regionId);
      if (!mod) return { activeRegion: regionId };
      return {
        activeRegion: regionId,
        center: mod.center,
        zoom: mod.zoom,
        activeLayers: mod.defaultLayers ?? mod.layers,
        timeRange: mod.timeRange ?? '7d',
        selectedEvent: null,
        sidePanelOpen: false,
      };
    }),
  setTier: (tierId) =>
    set((s) => {
      const tier = getTier(tierId);
      if (!tier) return { activeTier: tierId };
      return {
        activeTier: tierId,
        activeLayers: filterSensitive(tier.defaultLayers, s.hideSensitive),
        selectedEvent: null,
        sidePanelOpen: false,
      };
    }),
  setHideSensitive: (hideSensitive) =>
    set((s) => ({
      hideSensitive,
      activeLayers: filterSensitive(s.activeLayers, hideSensitive),
    })),
  setGlobe: (globe) => set({ globe }),
  setGlobeMotionPlaying: (globeMotionPlaying) => set({ globeMotionPlaying }),
  setGlobeMotionSpeed: (globeMotionSpeed) => set({ globeMotionSpeed }),
  setCenter: (center) =>
    set((s) => (centersEqual(s.center, center) ? {} : { center })),
  setZoom: (zoom) => set((s) => (zoomsEqual(s.zoom, zoom) ? {} : { zoom })),
  setView: (view) => set({ view }),
  setTimeRange: (timeRange) => set({ timeRange }),
  setActiveLayers: (activeLayers) =>
    set((s) => (layersEqual(s.activeLayers, activeLayers) ? {} : { activeLayers })),
  toggleLayer: (layerId) =>
    set((s) => {
      // 敏感图层已下架时，禁止开启
      if (s.hideSensitive && !s.activeLayers.includes(layerId) && SENSITIVE_LAYERS.has(layerId)) {
        return {};
      }
      return {
        activeLayers: s.activeLayers.includes(layerId)
          ? s.activeLayers.filter((id) => id !== layerId)
          : [...s.activeLayers, layerId],
      };
    }),
  selectEvent: (selectedEvent) =>
    set((s) => {
      const same =
        s.selectedEvent?.id === selectedEvent?.id &&
        s.sidePanelOpen === !!selectedEvent;
      if (same) return {};
      return { selectedEvent, sidePanelOpen: !!selectedEvent };
    }),
  openSidePanel: (sidePanelOpen) => set({ sidePanelOpen }),
}));
