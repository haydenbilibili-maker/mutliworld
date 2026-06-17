'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import type { FeatureCollection } from 'geojson';
import type { FirePoint, LiveFiresResponse } from '@/types/fires';

const EMPTY_POINTS: FirePoint[] = [];
const EMPTY_FC: FeatureCollection = { type: 'FeatureCollection', features: [] };

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('获取火点数据失败');
    return r.json();
  });

/** 实时火点 Hook：10 分钟自动刷新（FIRMS 近实时） */
export function useLiveFires(enabled = true) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<LiveFiresResponse>(
    enabled ? '/api/fires' : null,
    fetcher,
    {
      refreshInterval: 600_000,
      revalidateOnFocus: false,
      dedupingInterval: 120_000,
      errorRetryCount: 2,
      errorRetryInterval: 8_000,
    },
  );

  const points = data?.points ?? EMPTY_POINTS;

  const geojson = useMemo<FeatureCollection>(() => {
    if (points.length === 0) return EMPTY_FC;
    return {
      type: 'FeatureCollection',
      features: points.map((p) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
        properties: {
          id: p.id,
          frp: p.frp,
          confidence: p.confidence,
          brightness: p.brightness,
          acqDate: p.acqDate,
          acqTime: p.acqTime,
          daynight: p.daynight,
          satellite: p.satellite,
        },
      })),
    };
  }, [points]);

  return {
    geojson,
    points,
    generatedAt: data?.generatedAt ?? null,
    noKey: data?.noKey ?? false,
    isLoading,
    isValidating,
    error,
    retry: () => mutate(),
  };
}
