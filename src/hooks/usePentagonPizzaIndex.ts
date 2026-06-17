'use client';

import useSWR from 'swr';
import type { PizzaIndexResponse } from '@/types/pizza-index';

const fetcher = (url: string) =>
  fetch(url).then(async (r) => {
    if (!r.ok) throw new Error('获取披萨指数失败');
    return r.json() as Promise<PizzaIndexResponse>;
  });

/**
 * 五角大楼披萨指数 SWR Hook
 * 面板或图层开启时每 3 分钟刷新
 */
export function usePentagonPizzaIndex(enabled = true) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<PizzaIndexResponse>(
    enabled ? '/api/osint/pentagon-pizza' : null,
    fetcher,
    {
      refreshInterval: 180_000,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
      keepPreviousData: true,
    },
  );

  return {
    data: data ?? null,
    isLoading,
    isValidating,
    error,
    refresh: mutate,
  };
}
