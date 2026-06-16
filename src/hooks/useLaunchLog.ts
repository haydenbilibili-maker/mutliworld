'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import type { LaunchLogEntry } from '@/regions/global.launchLog';
import { useMapStore } from '@/store/useMapStore';
import { getRegion } from '@/regions';

export interface LaunchLogResponse {
  launches: LaunchLogEntry[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    since: string;
    sinceMs: number;
    generatedAt: string;
  };
}

const LAUNCH_LOG_URL = '/api/launch-log';

async function fetcher(url: string): Promise<LaunchLogResponse> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('获取发射日志失败');
  return res.json();
}

function inBounds(
  lng: number,
  lat: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

/**
 * 近一年发射日志（独立于 geodata timeRange），按当前区域边界客户端过滤
 */
export function useLaunchLog(since = '1y') {
  const activeRegion = useMapStore((s) => s.activeRegion);

  const { data, error, isLoading, isValidating, mutate } = useSWR<LaunchLogResponse>(
    `${LAUNCH_LOG_URL}?since=${since}&limit=500`,
    fetcher,
    {
      refreshInterval: 300_000,
      revalidateOnFocus: true,
      dedupingInterval: 10_000,
    },
  );

  const entries = useMemo(() => {
    const all = data?.launches ?? [];
    const regionBounds = getRegion(activeRegion)?.bounds;
    if (!regionBounds) return all;
    return all.filter((e) =>
      inBounds(e.location.lng, e.location.lat, regionBounds),
    );
  }, [data?.launches, activeRegion]);

  return {
    entries,
    total: data?.meta.total ?? entries.length,
    meta: data?.meta ?? null,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
