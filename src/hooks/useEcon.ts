'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import type { EconCategory, EconResponse, EconSeries } from '@/types/econ';

const EMPTY: EconSeries[] = [];

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('获取能源经济数据失败');
    return r.json();
  });

/** 能源经济 Hook：10 分钟自动刷新（真实 API） */
export function useEcon(enabled = true) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<EconResponse>(
    enabled ? '/api/econ' : null,
    fetcher,
    {
      refreshInterval: 600_000,
      revalidateOnFocus: false,
      dedupingInterval: 120_000,
      errorRetryCount: 2,
      errorRetryInterval: 8_000,
    },
  );

  const series = data?.series ?? EMPTY;

  const byCategory = useMemo(() => {
    const m = new Map<EconCategory, EconSeries[]>();
    for (const s of series) {
      const arr = m.get(s.category) ?? [];
      arr.push(s);
      m.set(s.category, arr);
    }
    return m;
  }, [series]);

  return {
    series,
    byCategory,
    available: data?.available,
    degraded: data?.degraded ?? [],
    generatedAt: data?.generatedAt ?? null,
    isLoading,
    isValidating,
    error,
    retry: () => mutate(),
  };
}
