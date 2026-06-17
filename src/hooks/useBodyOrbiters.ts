'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import type { OrbiterFix } from '@/lib/ephemeris/horizons';
import type { CelestialBody } from '@/types/body';

interface HorizonsResponse {
  fixes: OrbiterFix[];
  degraded: { id: string; name: string; body: CelestialBody }[];
  generatedAt: string;
  count: number;
}

const EMPTY: OrbiterFix[] = [];

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('获取星历失败');
    return r.json();
  });

/** 在轨轨道器星下点 Hook（按天体过滤）；5 分钟刷新 */
export function useBodyOrbiters(body: CelestialBody, enabled = true) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<HorizonsResponse>(
    enabled && body !== 'earth' ? '/api/horizons' : null,
    fetcher,
    { refreshInterval: 300_000, revalidateOnFocus: false, dedupingInterval: 120_000, errorRetryCount: 2 },
  );

  const fixes = useMemo(
    () => (data?.fixes ?? EMPTY).filter((f) => f.body === body),
    [data, body],
  );
  const degraded = useMemo(
    () => (data?.degraded ?? []).filter((d) => d.body === body),
    [data, body],
  );

  return { fixes, degraded, generatedAt: data?.generatedAt ?? null, isLoading, isValidating, error, retry: () => mutate() };
}
