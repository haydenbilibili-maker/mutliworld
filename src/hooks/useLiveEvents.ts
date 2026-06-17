'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import type { LiveEvent, LiveEventCategory, LiveEventsResponse } from '@/types/liveEvent';

const EMPTY: LiveEvent[] = [];

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('获取事件流失败');
    return r.json();
  });

/** 统一真实事件流 Hook：5 分钟自动刷新 */
export function useLiveEvents(enabled = true) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<LiveEventsResponse>(
    enabled ? '/api/events' : null,
    fetcher,
    {
      refreshInterval: 300_000,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
      errorRetryCount: 2,
      errorRetryInterval: 8_000,
    },
  );

  const events = data?.events ?? EMPTY;

  const byCategory = useMemo(() => {
    const m = new Map<LiveEventCategory, number>();
    for (const e of events) m.set(e.category, (m.get(e.category) ?? 0) + 1);
    return m;
  }, [events]);

  return {
    events,
    byCategory,
    providerCounts: data?.providerCounts,
    generatedAt: data?.generatedAt ?? null,
    isLoading,
    isValidating,
    error,
    retry: () => mutate(),
  };
}
