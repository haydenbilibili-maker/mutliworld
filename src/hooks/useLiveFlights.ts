'use client';

import useSWR from 'swr';
import type { FeatureCollection } from 'geojson';
import type { FlightsMeta, FlightsResponse } from '@/types/flights';

const EMPTY_GEOJSON: FeatureCollection = { type: 'FeatureCollection', features: [] };

const fetcher = (url: string) =>
  fetch(url).then(async (r) => {
    const data = (await r.json()) as FlightsResponse;
    if (!r.ok && !data.meta?.error) {
      throw new Error('获取航班数据失败');
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

function buildFlightsUrl(bounds: ViewBounds | null): string {
  if (!bounds) return '/api/flights';
  const q = new URLSearchParams({
    lamin: bounds.lamin.toFixed(4),
    lomin: bounds.lomin.toFixed(4),
    lamax: bounds.lamax.toFixed(4),
    lomax: bounds.lomax.toFixed(4),
  });
  return `/api/flights?${q.toString()}`;
}

/**
 * 实时航班 Hook（OpenSky ADS-B）
 * 地表层且图层开启时，每 45 秒刷新
 */
export function useLiveFlights(
  enabled = true,
  center: [number, number] = [0, 0],
  zoom = 3,
) {
  const bounds = enabled ? boundsFromView(center, zoom) : null;
  const url = enabled ? buildFlightsUrl(bounds) : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<FlightsResponse>(
    url,
    fetcher,
    {
      refreshInterval: 45_000,
      revalidateOnFocus: false,
      dedupingInterval: 15_000,
      keepPreviousData: true,
    },
  );

  return {
    geojson: data ?? EMPTY_GEOJSON,
    meta: (data?.meta ?? null) as FlightsMeta | null,
    isLoading,
    isValidating,
    error,
    refresh: mutate,
  };
}
