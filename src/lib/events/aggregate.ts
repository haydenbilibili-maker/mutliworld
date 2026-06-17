/**
 * 统一真实事件管道 — 聚合四源、去重、按时间排序、分类计数。
 * 只用真实 API；任一源失败贡献 0 条（providerCounts 如实反映），不造假。
 */

import type { LiveEvent, LiveEventProvider, LiveEventsResponse } from '@/types/liveEvent';
import {
  fetchUsgsEvents,
  fetchGdacsEvents,
  fetchReliefWebEvents,
  fetchGdeltEvents,
} from '@/lib/events/sources';

const MAX_EVENTS = 120;

export async function aggregateLiveEvents(): Promise<LiveEventsResponse> {
  const settled = await Promise.allSettled([
    fetchUsgsEvents(),
    fetchGdacsEvents(),
    fetchReliefWebEvents(),
    fetchGdeltEvents(),
  ]);

  const providerCounts: Record<LiveEventProvider, number> = {
    USGS: 0,
    GDACS: 0,
    ReliefWeb: 0,
    GDELT: 0,
  };

  const all: LiveEvent[] = [];
  for (const r of settled) {
    if (r.status !== 'fulfilled') continue;
    for (const e of r.value) {
      providerCounts[e.provider] += 1;
      all.push(e);
    }
  }

  // 去重（按 sourceUrl）
  const seen = new Set<string>();
  const dedup: LiveEvent[] = [];
  for (const e of all) {
    const key = e.sourceUrl || e.id;
    if (seen.has(key)) continue;
    seen.add(key);
    dedup.push(e);
  }

  // 按时间降序
  dedup.sort((a, b) => b.time.localeCompare(a.time));
  const events = dedup.slice(0, MAX_EVENTS);

  return {
    events,
    providerCounts,
    generatedAt: new Date().toISOString(),
    count: events.length,
  };
}
