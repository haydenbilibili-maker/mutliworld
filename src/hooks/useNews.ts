'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import { useMapStore } from '@/store/useMapStore';
import { filterByRegion } from '@/lib/region/contentFilter';
import type { NewsItem } from '@/lib/news/rss';
import type { RegionId } from '@/types/region';

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('news fetch failed');
    return r.json();
  });

/** 实时新闻 Hook：5 分钟自动刷新；按当前区域过滤（RSS 标为 global 通用） */
export function useNews(regionOverride?: RegionId) {
  const activeRegion = useMapStore((s) => s.activeRegion);
  const regionId = regionOverride ?? activeRegion;

  const { data, error, isLoading } = useSWR<{
    items: NewsItem[];
    generatedAt: string;
  }>('/api/news', fetcher, {
    refreshInterval: 300_000,
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });

  const items = useMemo(() => {
    const raw = (data?.items ?? []) as NewsItem[];
    const tagged = raw.map((n) => ({ ...n, regionIds: ['global'] as RegionId[] }));
    return filterByRegion(tagged, regionId);
  }, [data?.items, regionId]);

  return {
    items,
    generatedAt: data?.generatedAt ?? null,
    isLoading,
    error,
  };
}
