'use client';

import { create } from 'zustand';
import type { LayerId, TimeRange, ViewPreset } from '@/types/geo';
import type { EventDetail } from '@/types/geo';
import type { RegionId } from '@/types/region';
import type { SpatialTier } from '@/types/tier';
import type { BasemapMode } from '@/types/tier';
import type { CelestialBody } from '@/types/body';
import { getRegion, DEFAULT_REGION_ID } from '@/regions';
import { getTier, DEFAULT_TIER_ID } from '@/tiers';
import { getBody, DEFAULT_BODY } from '@/bodies';
import { filterSensitive, SENSITIVE_LAYERS } from '@/lib/layers/sensitivity';
import {
  CHINA_GLOBE_VIEW,
  type GlobeMotionSpeed,
} from '@/lib/globe/motionConstants';
import { centersEqual, layersEqual, zoomsEqual } from '@/lib/map/viewState';

export interface MapState {
  /** 当前天体（多天体探索 v2.0：地球/月球/火星），默认 earth 零回归 */
  activeBody: CelestialBody;
  /** 当前区域模块（LIFEOS-005 平台化） */
  activeRegion: RegionId;
  /** 当前空间层（三位一体：宇宙/地表/洋底） */
  activeTier: SpatialTier;
  /** 商用：一键下架敏感图层 */
  hideSensitive: boolean;
  /** 地表/宇宙层底图模式：卫星 · 政区 · 混合 */
  basemapMode: BasemapMode;
  /** 3D 地球（globe 投影）开关；需 maplibre v5 才实际生效，v4 下为 no-op */
  globe: boolean;
  /** 宇宙层地球自转动效播放（仅 space tier 生效） */
  globeMotionPlaying: boolean;
  /** 宇宙层动效速度倍率 */
  globeMotionSpeed: GlobeMotionSpeed;
  /** 递增以触发 CosmicGlobeAnimator 回正中国视角 */
  globeViewResetNonce: number;
  center: [number, number];
  zoom: number;
  view: ViewPreset;
  timeRange: TimeRange;
  activeLayers: LayerId[];
  selectedEvent: EventDetail | null;
  /** 地图标记弹窗（点击后在地图脉冲点附近显示的浮窗，不自动打开右侧面板） */
  mapTooltip: EventDetail | null;
  sidePanelOpen: boolean;
}

export interface MapActions {
  /** 切换天体：应用该天体默认视野与底图；earth 恢复当前区域视野 */
  setBody: (body: CelestialBody) => void;
  /** 切换区域：应用该区域的默认视野 / 图层 / 时间范围 */
  setRegion: (regionId: RegionId) => void;
  /** 切换空间层：应用该层默认图层（保持当前地理视野，原地穿越） */
  setTier: (tierId: SpatialTier) => void;
  /** 一键下架/恢复敏感图层 */
  setHideSensitive: (hide: boolean) => void;
  /** 切换地表/宇宙底图显示模式 */
  setBasemapMode: (mode: BasemapMode) => void;
  /** 切换 3D 地球（globe）投影 */
  setGlobe: (globe: boolean) => void;
  setGlobeMotionPlaying: (playing: boolean) => void;
  setGlobeMotionSpeed: (speed: GlobeMotionSpeed) => void;
  /** 一键回正：正视图居中中国，bearing/pitch 归零 */
  resetGlobeToChinaView: () => void;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  /** 原子更新视野，避免 moveend 连续触发两次 store 更新 */
  setViewport: (center: [number, number], zoom: number) => void;
  setView: (view: ViewPreset) => void;
  setTimeRange: (timeRange: TimeRange) => void;
  setActiveLayers: (layers: LayerId[]) => void;
  toggleLayer: (layerId: LayerId) => void;
  /** 在地图上聚焦显示脉冲标记+浮窗，不打开右侧面板 */
  focusOnMap: (event: EventDetail | null) => void;
  selectEvent: (event: EventDetail | null) => void;
  openSidePanel: (open: boolean) => void;
}

const initialState: MapState = {
  activeBody: DEFAULT_BODY,
  activeRegion: DEFAULT_REGION_ID,
  activeTier: DEFAULT_TIER_ID,
  hideSensitive: false,
  basemapMode: 'hybrid',
  globe: false,
  globeMotionPlaying: true,
  globeMotionSpeed: 1,
  globeViewResetNonce: 0,
  center: [105, 28],
  zoom: 3.5,
  view: 'global',
  timeRange: '7d',
  activeLayers: ['conflicts', 'economic', 'weather'],
  selectedEvent: null,
  mapTooltip: null,
  sidePanelOpen: false,
};

export const useMapStore = create<MapState & MapActions>((set) => ({
  ...initialState,
  setBody: (body) =>
    set((s) => {
      if (s.activeBody === body) return {};
      if (body === 'earth') {
        const region = getRegion(s.activeRegion);
        return {
          activeBody: 'earth',
          center: region?.center ?? [105, 28],
          zoom: region?.zoom ?? 3.5,
          activeLayers: filterSensitive(region?.defaultLayers ?? region?.layers ?? [], s.hideSensitive),
          globe: false,
          selectedEvent: null,
          mapTooltip: null,
          sidePanelOpen: false,
        };
      }
      const mod = getBody(body);
      return {
        activeBody: body,
        center: mod?.center ?? [0, 0],
        zoom: mod?.zoom ?? 2,
        activeLayers: [],
        // 天体默认 3D 球面视图
        globe: true,
        selectedEvent: null,
        mapTooltip: null,
        sidePanelOpen: false,
      };
    }),
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
        mapTooltip: null,
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
        mapTooltip: null,
        sidePanelOpen: false,
      };
    }),
  setHideSensitive: (hideSensitive) =>
    set((s) => ({
      hideSensitive,
      activeLayers: filterSensitive(s.activeLayers, hideSensitive),
    })),
  setBasemapMode: (basemapMode) => set({ basemapMode }),
  setGlobe: (globe) => set({ globe }),
  setGlobeMotionPlaying: (globeMotionPlaying) => set({ globeMotionPlaying }),
  setGlobeMotionSpeed: (globeMotionSpeed) => set({ globeMotionSpeed }),
  resetGlobeToChinaView: () =>
    set((s) => ({
      center: CHINA_GLOBE_VIEW.center,
      zoom: CHINA_GLOBE_VIEW.zoom,
      globeViewResetNonce: s.globeViewResetNonce + 1,
    })),
  setCenter: (center) =>
    set((s) => (centersEqual(s.center, center) ? {} : { center })),
  setZoom: (zoom) => set((s) => (zoomsEqual(s.zoom, zoom) ? {} : { zoom })),
  setViewport: (center, zoom) =>
    set((s) => {
      const sameCenter = centersEqual(s.center, center);
      const sameZoom = zoomsEqual(s.zoom, zoom);
      if (sameCenter && sameZoom) return {};
      return {
        ...(sameCenter ? {} : { center }),
        ...(sameZoom ? {} : { zoom }),
      };
    }),
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
  /** 在地图上聚焦（显示脉冲标记+浮窗），不打开右侧面板 */
  focusOnMap: (event: EventDetail | null) =>
    set((s) => {
      if (s.mapTooltip?.id === event?.id && !!event === !!s.mapTooltip) return {};
      return { mapTooltip: event };
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
