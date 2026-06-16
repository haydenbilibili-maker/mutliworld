'use client';

import useSWR from 'swr';
import type { NewsItem } from '@/lib/news/rss';

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('news fetch failed');
    return r.json();
  });

/** 实时新闻 Hook：5 分钟自动刷新 */
export function useNews() {
  const { data, error, isLoading } = useSWR<{
    items: NewsItem[];
    generatedAt: string;
  }>('/api/news', fetcher, {
    refreshInterval: 300_000,
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });

  return {
    items: (data?.items ?? []) as NewsItem[],
    generatedAt: data?.generatedAt ?? null,
    isLoading,
    error,
  };
}
