'use client';

import useSWR from 'swr';
import type { MarketQuote } from '@/lib/markets/markets';

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('markets fetch failed');
    return r.json();
  });

/** 实时市场 Hook：2 分钟自动刷新 */
export function useMarkets() {
  const { data, error, isLoading } = useSWR<{
    items: MarketQuote[];
    sources: { fx: boolean; crypto: boolean; index: boolean };
    generatedAt: string;
  }>('/api/markets', fetcher, {
    refreshInterval: 120_000,
    revalidateOnFocus: false,
    dedupingInterval: 30_000,
  });

  return {
    items: (data?.items ?? []) as MarketQuote[],
    sources: data?.sources ?? { fx: false, crypto: false, index: false },
    generatedAt: data?.generatedAt ?? null,
    isLoading,
    error,
  };
}
