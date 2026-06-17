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
  const { data, error, isLoading, isValidating, mutate } = useSWR<LiveWeatherResponse>(
    enabled ? '/api/weather' : null,
    fetcher,
    {
      refreshInterval: 900_000,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
      errorRetryCount: 2,
      errorRetryInterval: 8_000,
      shouldRetryOnError: true,
    },
  );

  return {
    points: data?.points ?? EMPTY_POINTS,
    generatedAt: data?.generatedAt ?? null,
    isLoading,
    isValidating,
    error,
    retry: () => mutate(),
  };
}

/** 降水雷达元数据 Hook：15 分钟自动刷新 */
export function useWeatherRadar(enabled = true) {
  const radarFetcher = (url: string) =>
    fetch(url).then(async (r) => {
      const data = (await r.json()) as RadarFrameMeta & { error?: string };
      if (!r.ok) {
        return {
          timestamp: data.timestamp ?? 0,
          tiles: data.tiles ?? [],
          host: data.host ?? '',
          generatedAt: data.generatedAt ?? new Date().toISOString(),
          error: data.error ?? '雷达暂不可用',
        } as RadarFrameMeta & { error?: string };
      }
      return data;
    });

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    RadarFrameMeta & { error?: string }
  >(enabled ? '/api/weather/radar' : null, radarFetcher, {
      refreshInterval: 900_000,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
      errorRetryCount: 2,
      errorRetryInterval: 8_000,
      shouldRetryOnError: true,
    },
  );

  return {
    radar: data ?? null,
    isLoading,
    isValidating,
    error,
    retry: () => mutate(),
  };
}
