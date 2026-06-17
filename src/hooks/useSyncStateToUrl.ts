'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMapStore } from '@/store/useMapStore';
import type { LayerId } from '@/types/geo';
import type { RegionId } from '@/types/region';
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
  if (state.basemapMode !== 'hybrid') {
    params.set('basemap', state.basemapMode);
  }
  return `${pathname}?${params.toString()}`;
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
  const setRegion = useMapStore((s) => s.setRegion);
  const setCenter = useMapStore((s) => s.setCenter);
  const setZoom = useMapStore((s) => s.setZoom);
  const setView = useMapStore((s) => s.setView);
  const setTimeRange = useMapStore((s) => s.setTimeRange);
  const setActiveLayers = useMapStore((s) => s.setActiveLayers);
  const setBasemapMode = useMapStore((s) => s.setBasemapMode);

  const lastSyncedUrlRef = useRef<string | null>(null);
  const viewportTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const z = searchParams.get('zoom');
    const v = searchParams.get('view');
    const tr = searchParams.get('timeRange');
    const layers = searchParams.get('layers');
    const region = searchParams.get('region');
    const basemap = searchParams.get('basemap');

    const hasUrlState =
      lat != null ||
      lon != null ||
      z != null ||
      v != null ||
      tr != null ||
      layers != null ||
      region != null ||
      basemap != null;

    if (!hasUrlState) return;

    const parsedRegion = parseRegion(region);
    if (parsedRegion) setRegion(parsedRegion);

    if (lat != null || lon != null) {
      setCenter([
        parseNumber(lon, DEFAULT_CENTER[0]),
        parseNumber(lat, DEFAULT_CENTER[1]),
      ]);
    }
    if (z != null) setZoom(parseNumber(z, DEFAULT_ZOOM));
    if (v === 'global' || v === 'asia') setView(v);
    if (tr === '24h' || tr === '7d' || tr === '30d') setTimeRange(tr);
    setActiveLayers(parseLayers(layers));
    if (basemap != null) setBasemapMode(parseBasemapMode(basemap));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replaceUrl = (nextUrl: string) => {
    if (lastSyncedUrlRef.current === nextUrl) return;
    lastSyncedUrlRef.current = nextUrl;
    router.replace(nextUrl, { scroll: false });
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
    });
  };

  // 区域/图层/视图等非视野状态：立即同步 URL
  useEffect(() => {
    replaceUrl(syncFromStore());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router, activeRegion, view, timeRange, activeLayers, basemapMode]);

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
