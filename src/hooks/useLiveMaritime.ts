'use client';

import useSWR from 'swr';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { FeatureCollection } from 'geojson';
import type { MaritimeMeta, MaritimeResponse } from '@/types/maritime';

const EMPTY_GEOJSON: FeatureCollection = { type: 'FeatureCollection', features: [] };

const fetcher = (url: string) =>
  fetch(url).then(async (r) => {
    const data = (await r.json()) as MaritimeResponse;
    if (!r.ok && !data.meta?.error) {
      throw new Error('获取海运数据失败');
    }
    return data;
  });

export interface ViewBounds {
  lamin: number;
  lomin: number;
  lamax: number;
  lomax: number;
}

/** 由 store 中心/缩放估算 bbox（zoom ≥ 4 时启用区域过滤） */
export function boundsFromView(
  center: [number, number],
  zoom: number,
): ViewBounds | null {
  if (zoom < 4) return null;
  const lngSpan = 360 / Math.pow(2, zoom);
  const latSpan = lngSpan * 0.55;
  const [lng, lat] = center;
  return {
    lomin: lng - lngSpan / 2,
    lomax: lng + lngSpan / 2,
    lamin: Math.max(lat - latSpan / 2, -85),
    lamax: Math.min(lat + latSpan / 2, 85),
  };
}

function buildMaritimeUrl(bounds: ViewBounds | null): string {
  if (!bounds) return '/api/maritime/live';
  const q = new URLSearchParams({
    lamin: bounds.lamin.toFixed(4),
    lomin: bounds.lomin.toFixed(4),
    lamax: bounds.lamax.toFixed(4),
    lomax: bounds.lomax.toFixed(4),
  });
  return `/api/maritime/live?${q.toString()}`;
}

/**
 * 全球海运实时 Hook
 * 地表层且图层开启时，每 75 秒刷新
 */
export function useLiveMaritime(
  enabled = true,
  center: [number, number] = [0, 0],
  zoom = 3,
) {
  const debouncedCenter = useDebouncedValue(center, 500);
  const debouncedZoom = useDebouncedValue(zoom, 500);
  const bounds = enabled ? boundsFromView(debouncedCenter, debouncedZoom) : null;
  const url = enabled ? buildMaritimeUrl(bounds) : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<MaritimeResponse>(
    url,
    fetcher,
    {
      refreshInterval: 75_000,
      revalidateOnFocus: false,
      dedupingInterval: 20_000,
      keepPreviousData: true,
    },
  );

  return {
    geojson: data ?? EMPTY_GEOJSON,
    meta: (data?.meta ?? null) as MaritimeMeta | null,
    isLoading,
    isValidating,
    error,
    refresh: mutate,
  };
}
