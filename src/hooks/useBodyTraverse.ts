'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import type { TraversePath } from '@/lib/bodies/traverse';
import type { CelestialBody } from '@/types/body';

interface TraverseResponse {
  paths: TraversePath[];
  degraded: { id: string; rover: string }[];
  generatedAt: string;
  count: number;
}

const EMPTY: TraversePath[] = [];

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('获取 traverse 失败');
    return r.json();
  });

/** 巡视器行进轨迹 Hook（按天体过滤）；1 小时刷新 */
export function useBodyTraverse(body: CelestialBody, enabled = true) {
  const { data, error, isLoading, mutate } = useSWR<TraverseResponse>(
    enabled && body === 'mars' ? '/api/traverse' : null,
    fetcher,
    { refreshInterval: 3_600_000, revalidateOnFocus: false, dedupingInterval: 600_000, errorRetryCount: 2 },
  );

  const paths = useMemo(() => (data?.paths ?? EMPTY).filter((p) => p.body === body), [data, body]);

  return { paths, generatedAt: data?.generatedAt ?? null, isLoading, error, retry: () => mutate() };
}
