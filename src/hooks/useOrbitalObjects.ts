'use client';

import useSWR from 'swr';
import type { OrbitalCategory, OrbitalObjectsMeta } from '@/types/orbital';
import type { FeatureCollection } from 'geojson';

export interface OrbitalObjectsResponse extends FeatureCollection {
  meta: OrbitalObjectsMeta;
}

const EMPTY_GEOJSON: FeatureCollection = { type: 'FeatureCollection', features: [] };

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('orbital-objects fetch failed');
    return r.json() as Promise<OrbitalObjectsResponse>;
  });

/** 图层 ID → TLE 类别 */
export const LAYER_TO_ORBITAL_CATEGORY: Record<string, OrbitalCategory> = {
  space_stations: 'station',
  satellites: 'satellite',
  space_debris: 'debris',
};

/**
 * 轨道物体实时位置 Hook（SGP4 + TLE）
 * 宇宙层激活且至少一层轨道图层开启时，每 60 秒刷新
 */
export function useOrbitalObjects(enabled = true) {
  const { data, error, isLoading, mutate } = useSWR<OrbitalObjectsResponse>(
    enabled ? '/api/orbital-objects' : null,
    fetcher,
    {
      refreshInterval: 60_000,
      revalidateOnFocus: false,
      dedupingInterval: 10_000,
    },
  );

  return {
    geojson: data ?? EMPTY_GEOJSON,
    meta: data?.meta ?? null,
    isLoading,
    error,
    refresh: mutate,
  };
}
