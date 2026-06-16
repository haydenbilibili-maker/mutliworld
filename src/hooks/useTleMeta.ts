'use client';

import useSWR from 'swr';
import type { TleMeta } from '@/types/orbital';

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('获取 TLE 元数据失败');
    return r.json() as Promise<TleMeta>;
  });

/** TLE 数据库元信息（不含 SGP4 传播） */
export function useTleMeta(enabled = true) {
  const { data, error, isLoading, mutate } = useSWR<TleMeta>(
    enabled ? '/api/orbital/tle/meta' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
    },
  );

  return {
    meta: data ?? null,
    isLoading,
    error,
    refresh: mutate,
  };
}
