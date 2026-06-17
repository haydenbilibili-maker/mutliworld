'use client';

import useSWR from 'swr';
import type { LiveWeatherResponse, RadarFrameMeta } from '@/types/weather';

const EMPTY_POINTS: LiveWeatherResponse['points'] = [];

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('获取天气数据失败');
    return r.json();
  });

/** 实时天气 Hook：15 分钟自动刷新 */
export function useLiveWeather(enabled = true) {
  const { data, error, isLoading } = useSWR<LiveWeatherResponse>(
    enabled ? '/api/weather' : null,
    fetcher,
    {
      refreshInterval: 900_000,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );

  return {
    points: data?.points ?? EMPTY_POINTS,
    generatedAt: data?.generatedAt ?? null,
    isLoading,
    error,
  };
}

/** 降水雷达元数据 Hook：15 分钟自动刷新 */
export function useWeatherRadar(enabled = true) {
  const { data, error, isLoading } = useSWR<RadarFrameMeta>(
    enabled ? '/api/weather/radar' : null,
    fetcher,
    {
      refreshInterval: 900_000,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );

  return {
    radar: data ?? null,
    isLoading,
    error,
  };
}
