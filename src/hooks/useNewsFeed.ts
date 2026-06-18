'use client';

/**
 * 跑马灯新闻流 Hook — 精选种子 + 可选 RSS 实时条目混排
 *
 * 与 useNews（NewsPanel 专用）共享 /api/news，但映射为 NewsFeedItem 并
 * 与 seed 合并去重；RSS 条目默认归类为「国际局势」。
 */

import { useMemo } from 'react';
import useSWR from 'swr';
import { useMapStore } from '@/store/useMapStore';
import {
  NEWS_FEED_SEED,
  sortNewsFeedItems,
  tagNewsFeedRegions,
  type NewsFeedItem,
} from '@/data/news-feed';
import { filterByRegion } from '@/lib/region/contentFilter';
import type { NewsItem } from '@/lib/news/rss';
import type { RegionId } from '@/types/region';

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('news fetch failed');
    return r.json();
  });

function rssToFeedItem(n: NewsItem): NewsFeedItem {
  return {
    id: `rss-${n.id}`,
    title: n.title,
    summary: n.title,
    category: '国际局势',
    source: n.source,
    publishedAt: n.publishedAt,
    url: n.link,
    impact_level: 'medium',
    regionIds: ['global'],
  };
}

export interface UseNewsFeedResult {
  items: NewsFeedItem[];
  isLoading: boolean;
  hasLiveItems: boolean;
  error: unknown;
}

export function useNewsFeed(maxItems = 36, regionOverride?: RegionId): UseNewsFeedResult {
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
    const live = (data?.items ?? []).slice(0, 12).map(rssToFeedItem);
    const seen = new Set<string>();
    const merged: NewsFeedItem[] = [];

    for (const item of sortNewsFeedItems(
      tagNewsFeedRegions([...NEWS_FEED_SEED, ...live]),
    )) {
      const key = item.url ?? item.title;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }

    // 时效性过滤：仅保留近 7 天内的条目（RSS 与种子数据均过滤）
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const cutoff = Date.now() - SEVEN_DAYS_MS;
    const recent = merged.filter((item) => {
      if (!item.publishedAt) return false;
      const ts = new Date(item.publishedAt).getTime();
      return !isNaN(ts) && ts >= cutoff;
    });

    return filterByRegion(recent, regionId).slice(0, maxItems);
  }, [data?.items, maxItems, regionId]);

  return {
    items,
    isLoading: isLoading && !data,
    hasLiveItems: (data?.items?.length ?? 0) > 0,
    error,
  };
}
