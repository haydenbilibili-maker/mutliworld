'use client';

import useSWR from 'swr';
import type { CorrelationSignal, InsightsResponse } from '@/types/correlation';

const EMPTY: CorrelationSignal[] = [];

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('获取关联洞察失败');
    return r.json();
  });

/** 关联洞察 Hook：10 分钟刷新（真实事件 × 真实序列） */
export function useInsights(enabled = true) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<InsightsResponse>(
    enabled ? '/api/insights' : null,
    fetcher,
    {
      refreshInterval: 600_000,
      revalidateOnFocus: false,
      dedupingInterval: 120_000,
      errorRetryCount: 2,
      errorRetryInterval: 8_000,
    },
  );

  return {
    signals: data?.signals ?? EMPTY,
    disclaimer: data?.disclaimer ?? '',
    generatedAt: data?.generatedAt ?? null,
    isLoading,
    isValidating,
    error,
    retry: () => mutate(),
  };
}
