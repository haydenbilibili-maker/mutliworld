'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMapStore } from '@/store/useMapStore';
import { useNearEarthStore, SCALAR_META, type ScalarParam } from '@/store/useNearEarthStore';
import type { LayerId } from '@/types/geo';
import type { RegionId } from '@/types/region';
import type { SpatialTier } from '@/types/tier';
import type { ColorScheme } from '@/lib/map/scalarColor';
import { PROJECTIONS, type ProjectionId } from '@/lib/projection/projections';
import { parseBasemapMode } from '@/lib/map/basemap';
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  DEFAULT_LAYERS,
} from '@/lib/constants';
import { ALL_REGION_IDS } from '@/lib/regions/ids';

const LAYER_SEP = ',';
const VALID_REGIONS: RegionId[] = ALL_REGION_IDS;
/** 视野 URL 防抖 — 避免每次 moveend 触发 router.replace 导致整页软导航抖动 */
const VIEWPORT_URL_DEBOUNCE_MS = 450;

function parseNumber(value: string | null, fallback: number): number {
  if (value == null) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseLayers(value: string | null): LayerId[] {
  if (!value) return DEFAULT_LAYERS;
  const ids = value.split(LAYER_SEP).map((s) => s.trim()).filter(Boolean);
  return ids.length ? (ids as LayerId[]) : DEFAULT_LAYERS;
}

function parseRegion(value: string | null): RegionId | null {
  if (value && VALID_REGIONS.includes(value as RegionId)) {
    return value as RegionId;
  }
  return null;
}

const VALID_TIERS: SpatialTier[] = ['space', 'near_earth', 'surface', 'subsurface'];

function buildUrl(
  pathname: string,
  state: {
    activeRegion: RegionId;
    center: [number, number];
    zoom: number;
    view: string;
    timeRange: string;
    activeLayers: LayerId[];
    basemapMode: string;
    tier: SpatialTier;
    projMode: 'map' | ProjectionId;
    overlayScheme: ColorScheme;
    param: ScalarParam;
  },
): string {
  const params = new URLSearchParams();
  params.set('lat', state.center[1].toFixed(4));
  params.set('lon', state.center[0].toFixed(4));
  params.set('zoom', state.zoom.toFixed(2));
  params.set('view', state.view);
  params.set('timeRange', state.timeRange);
  params.set('layers', state.activeLayers.join(LAYER_SEP));
  params.set('region', state.activeRegion);
  params.set('tier', state.tier);
  if (state.basemapMode !== 'hybrid') params.set('basemap', state.basemapMode);
  if (state.projMode !== 'map') params.set('proj', state.projMode);
  if (state.overlayScheme !== 'default') params.set('scheme', state.overlayScheme);
  if (state.param !== 'nitrogen_dioxide') params.set('ov', state.param);
  return `${pathname}?${params.toString()}`;
}

/**
 * 将 URL 查询态应用到 store（命令式，经 getState 设值）。
 * 供「初始读入」与「故事线播放（按帧还原视图态）」共用，确保解析口径一致。
 * 返回是否检测到可识别的视图态参数。
 */
export function applyViewStateFromParams(sp: URLSearchParams): boolean {
  const lat = sp.get('lat');
  const lon = sp.get('lon');
  const z = sp.get('zoom');
  const v = sp.get('view');
  const tr = sp.get('timeRange');
  const layers = sp.get('layers');
  const region = sp.get('region');
  const basemap = sp.get('basemap');
  const tierP = sp.get('tier');
  const projP = sp.get('proj');
  const schemeP = sp.get('scheme');
  const ovP = sp.get('ov');

  const hasUrlState =
    lat != null || lon != null || z != null || v != null || tr != null ||
    layers != null || region != null || basemap != null || tierP != null ||
    projP != null || schemeP != null || ovP != null;
  if (!hasUrlState) return false;

  const m = useMapStore.getState();
  const parsedRegion = parseRegion(region);
  if (parsedRegion) m.setRegion(parsedRegion);
  if (lat != null || lon != null) {
    m.setCenter([parseNumber(lon, DEFAULT_CENTER[0]), parseNumber(lat, DEFAULT_CENTER[1])]);
  }
  if (z != null) m.setZoom(parseNumber(z, DEFAULT_ZOOM));
  if (v === 'global' || v === 'asia') m.setView(v);
  if (tr === '24h' || tr === '7d' || tr === '30d') m.setTimeRange(tr);
  // tier 须在 layers 之前应用（setTier 会重置为该层默认图层），随后再用 layers 覆盖
  if (tierP && VALID_TIERS.includes(tierP as SpatialTier)) m.setTier(tierP as SpatialTier);
  if (layers != null) m.setActiveLayers(parseLayers(layers));
  if (basemap != null) m.setBasemapMode(parseBasemapMode(basemap));
  if (projP && projP in PROJECTIONS) m.setProjMode(projP as ProjectionId);
  if (schemeP && ['default', 'turbo', 'viridis', 'grayscale'].includes(schemeP)) m.setOverlayScheme(schemeP as ColorScheme);
  if (ovP && ovP in SCALAR_META) useNearEarthStore.getState().setParam(ovP as ScalarParam);
  return true;
}

/** 从 URL 读入初始状态并同步 store -> URL */
export function useSyncStateToUrl() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeRegion = useMapStore((s) => s.activeRegion);
  const center = useMapStore((s) => s.center);
  const zoom = useMapStore((s) => s.zoom);
  const view = useMapStore((s) => s.view);
  const timeRange = useMapStore((s) => s.timeRange);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const basemapMode = useMapStore((s) => s.basemapMode);
  const activeTier = useMapStore((s) => s.activeTier);
  const projMode = useMapStore((s) => s.projMode);
  const overlayScheme = useMapStore((s) => s.overlayScheme);
  const param = useNearEarthStore((s) => s.param);

  const lastSyncedUrlRef = useRef<string | null>(null);
  const viewportTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    applyViewStateFromParams(searchParams as unknown as URLSearchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replaceUrl = (nextUrl: string) => {
    if (lastSyncedUrlRef.current === nextUrl) return;
    lastSyncedUrlRef.current = nextUrl;
    // 用 history.replaceState 而非 router.replace：仅更新地址栏，不触发 Next 软导航/RSC 重渲染，
    // 根治视野同步引发的周期性闪烁与初始加载抖动。
    if (typeof window !== 'undefined') {
      window.history.replaceState(window.history.state, '', nextUrl);
    }
  };

  const syncFromStore = () => {
    const s = useMapStore.getState();
    return buildUrl(pathname, {
      activeRegion: s.activeRegion,
      center: s.center,
      zoom: s.zoom,
      view: s.view,
      timeRange: s.timeRange,
      activeLayers: s.activeLayers,
      basemapMode: s.basemapMode,
      tier: s.activeTier,
      projMode: s.projMode,
      overlayScheme: s.overlayScheme,
      param: useNearEarthStore.getState().param,
    });
  };

  // 区域/图层/视图等非视野状态：立即同步 URL
  useEffect(() => {
    replaceUrl(syncFromStore());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router, activeRegion, view, timeRange, activeLayers, basemapMode, activeTier, projMode, overlayScheme, param]);

  // 视野 lat/lon/zoom：防抖，避免拖拽地图时频繁软导航
  useEffect(() => {
    if (viewportTimerRef.current) clearTimeout(viewportTimerRef.current);
    viewportTimerRef.current = setTimeout(() => {
      viewportTimerRef.current = null;
      replaceUrl(syncFromStore());
    }, VIEWPORT_URL_DEBOUNCE_MS);

    return () => {
      if (viewportTimerRef.current) {
        clearTimeout(viewportTimerRef.current);
        viewportTimerRef.current = null;
      }
    };
  }, [
    pathname,
    router,
    activeRegion,
    center,
    zoom,
    view,
    timeRange,
    activeLayers,
    basemapMode,
  ]);
}

/** 挂载于 Suspense 内，满足 Next.js 对 useSearchParams 的要求 */
export function UrlStateSync() {
  useSyncStateToUrl();
  return null;
}
