'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMapStore } from '@/store/useMapStore';
import type { LayerId } from '@/types/geo';
import type { RegionId } from '@/types/region';
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  DEFAULT_LAYERS,
} from '@/lib/constants';
import { ALL_REGION_IDS } from '@/lib/regions/ids';

const LAYER_SEP = ',';
const VALID_REGIONS: RegionId[] = ALL_REGION_IDS;

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

/** 从 URL 读入初始状态并同步 store -> URL */
export function useSyncStateToUrl() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    activeRegion,
    center,
    zoom,
    view,
    timeRange,
    activeLayers,
    setRegion,
    setCenter,
    setZoom,
    setView,
    setTimeRange,
    setActiveLayers,
  } = useMapStore();

  const lastSyncedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const z = searchParams.get('zoom');
    const v = searchParams.get('view');
    const tr = searchParams.get('timeRange');
    const layers = searchParams.get('layers');
    const region = searchParams.get('region');

    const hasUrlState =
      lat != null ||
      lon != null ||
      z != null ||
      v != null ||
      tr != null ||
      layers != null ||
      region != null;

    if (!hasUrlState) return;

    const parsedRegion = parseRegion(region);
    if (parsedRegion) setRegion(parsedRegion);

    setCenter([
      parseNumber(lon, DEFAULT_CENTER[0]),
      parseNumber(lat, DEFAULT_CENTER[1]),
    ]);
    setZoom(parseNumber(z, DEFAULT_ZOOM));
    if (v === 'global' || v === 'asia') setView(v);
    if (tr === '24h' || tr === '7d' || tr === '30d') setTimeRange(tr);
    setActiveLayers(parseLayers(layers));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('lat', center[1].toFixed(4));
    params.set('lon', center[0].toFixed(4));
    params.set('zoom', zoom.toFixed(2));
    params.set('view', view);
    params.set('timeRange', timeRange);
    params.set('layers', activeLayers.join(LAYER_SEP));
    params.set('region', activeRegion);
    const nextUrl = `${pathname}?${params.toString()}`;
    if (lastSyncedUrlRef.current === nextUrl) return;
    lastSyncedUrlRef.current = nextUrl;
    router.replace(nextUrl, { scroll: false });
  }, [
    pathname,
    router,
    activeRegion,
    center,
    zoom,
    view,
    timeRange,
    activeLayers,
  ]);
}

/** 挂载于 Suspense 内，满足 Next.js 对 useSearchParams 的要求 */
export function UrlStateSync() {
  useSyncStateToUrl();
  return null;
}
