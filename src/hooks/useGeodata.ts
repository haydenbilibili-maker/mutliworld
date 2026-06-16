'use client';

import useSWR from 'swr';
import type { GeodataResponse } from '@/types/geo';
import type { LayerId } from '@/types/geo';
import { useMapStore } from '@/store/useMapStore';
import { REFRESH_INTERVAL_MS } from '@/lib/timeRange';

const GEO_DATA_URL = '/api/geodata';

async function fetcher(url: string): Promise<GeodataResponse> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('获取地理数据失败');
  return res.json();
}

function parseLayersParam(layers: LayerId[]): LayerId[] {
  return layers.length ? layers : ['conflicts', 'economic', 'weather'];
}

/**
 * 按当前 store 的 region、timeRange、activeLayers 拉取 GeoJSON，并按时间范围自动轮询
 */
export function useGeodata() {
  const { activeRegion, timeRange, activeLayers } = useMapStore();
  const layers = parseLayersParam(activeLayers);

  const params = new URLSearchParams({
    region: activeRegion,
    timeRange,
    layers: layers.join(','),
  });

  const { data, error, isLoading, isValidating, mutate } = useSWR<GeodataResponse>(
    `${GEO_DATA_URL}?${params.toString()}`,
    fetcher,
    {
      refreshInterval: REFRESH_INTERVAL_MS[timeRange],
      revalidateOnFocus: true,
      dedupingInterval: 5_000,
    },
  );

  return {
    data: data ?? null,
    meta: data?.meta ?? null,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
