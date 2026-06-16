'use client';

import useSWR from 'swr';
import type { LiveSat } from '@/lib/space/liveSatellites';

const EMPTY_ITEMS: LiveSat[] = [];

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('获取卫星数据失败');
    return r.json();
  });

/** 实时卫星 Hook：12 秒自动刷新（空间站约每 1.5 小时绕地一圈，移动明显） */
export function useLiveSatellites(enabled = true) {
  const { data, error, isLoading } = useSWR<{
    items: LiveSat[];
    generatedAt: string;
  }>(enabled ? '/api/satellites' : null, fetcher, {
    refreshInterval: 12_000,
    revalidateOnFocus: false,
    dedupingInterval: 5_000,
  });

  return {
    items: data?.items ?? EMPTY_ITEMS,
    generatedAt: data?.generatedAt ?? null,
    isLoading,
    error,
  };
}
