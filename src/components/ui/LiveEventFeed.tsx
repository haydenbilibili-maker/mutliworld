'use client';

/**
 * 实时事件流 — Wave 4 重构：消费统一真实事件管道 /api/events
 * 源：USGS 地震 · GDACS 灾害 · ReliefWeb 人道 · GDELT 地缘新闻（全真实，无种子）。
 * 分类筛选 + 点击地图联动（带坐标的事件飞行定位）+ 可点击溯源。
 */

import { useMemo, useState } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import type { LiveEvent, LiveEventCategory, LiveEventSeverity } from '@/types/liveEvent';
import type { EventDetail, ImpactLevel } from '@/types/geo';

const SEVERITY_DOT: Record<LiveEventSeverity, string> = {
  critical: 'bg-red-400',
  high: 'bg-orange-400',
  medium: 'bg-yellow-400',
  low: 'bg-blue-400',
};
const SEVERITY_COLOR: Record<LiveEventSeverity, string> = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
  low: 'text-blue-400',
};
const SEVERITY_LABEL: Record<LiveEventSeverity, string> = {
  critical: '严重',
  high: '高',
  medium: '中',
  low: '低',
};

const CATEGORY_LABEL: Record<LiveEventCategory, string> = {
  quake: '地震',
  disaster: '灾害',
  humanitarian: '人道',
  geopolitics: '地缘',
  general: '综合',
};
const CATEGORY_EMOJI: Record<LiveEventCategory, string> = {
  quake: '📳',
  disaster: '🌋',
  humanitarian: '🆘',
  geopolitics: '📰',
  general: '•',
};

const SEVERITY_TO_IMPACT: Record<LiveEventSeverity, ImpactLevel> = {
  critical: 'critical',
  high: 'high',
  medium: 'medium',
  low: 'low',
};

function formatTimestamp(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const MM = String(d.getMinutes()).padStart(2, '0');
  return `${mm}-${dd} ${HH}:${MM}`;
}

interface LiveEventFeedProps {
  className?: string;
  maxItems?: number;
}

type CatFilter = 'all' | LiveEventCategory;

export function LiveEventFeed({ className = '', maxItems = 14 }: LiveEventFeedProps) {
  const { events, byCategory, providerCounts, isLoading, isValidating, error } = useLiveEvents(true);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const setViewport = useMapStore((s) => s.setViewport);
  const [collapsed, setCollapsed] = useState(true);
  const [cat, setCat] = useState<CatFilter>('all');

  const cats = useMemo<LiveEventCategory[]>(
    () => (['quake', 'disaster', 'humanitarian', 'geopolitics', 'general'] as LiveEventCategory[]).filter((c) => (byCategory.get(c) ?? 0) > 0),
    [byCategory],
  );

  const list = useMemo(() => {
    const filtered = cat === 'all' ? events : events.filter((e) => e.category === cat);
    return filtered.slice(0, maxItems);
  }, [events, cat, maxItems]);

  const handleClick = (e: LiveEvent) => {
    const detail: EventDetail = {
      id: e.id,
      title: e.title,
      source: e.source,
      timestamp: e.time,
      location: [e.lng ?? 0, e.lat ?? 0],
      impact_level: SEVERITY_TO_IMPACT[e.severity],
      category: e.category,
      description: e.summary ?? `${e.source}${e.area ? ' · ' + e.area : ''}`,
      url: e.sourceUrl,
    };
    selectEvent(detail);
    if (e.lat != null && e.lng != null) setViewport([e.lng, e.lat], 5);
  };

  const providerLine = providerCounts
    ? `USGS ${providerCounts.USGS} · GDACS ${providerCounts.GDACS} · ReliefWeb ${providerCounts.ReliefWeb} · GDELT ${providerCounts.GDELT}`
    : '';

  return (
    <div className={`rounded-lg bg-dashboard-bg/90 border border-dashboard-neutral/20 text-sm overflow-hidden ${className}`}>
      <div
        className="flex cursor-pointer select-none items-center justify-between border-b border-dashboard-neutral/10 px-3 py-2"
        onClick={() => setCollapsed((c) => !c)}
        role="button"
        tabIndex={0}
        aria-expanded={!collapsed}
        aria-label="实时事件流"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setCollapsed((c) => !c);
          }
        }}
      >
        <span className="text-sm font-medium text-white">
          实时事件流
          {isValidating && !isLoading && (
            <span className="ml-2 text-xs text-dashboard-neutral/50">刷新中…</span>
          )}
        </span>
        <span className="text-dashboard-neutral/50 text-xs">
          {collapsed ? '展开' : `共 ${events.length} 条`}
        </span>
      </div>

      {!collapsed && (
        <>
          <div className="flex flex-wrap gap-1 border-b border-dashboard-neutral/10 px-2 py-1.5 text-[10px]">
            <button
              type="button"
              onClick={() => setCat('all')}
              className={`rounded px-1.5 py-0.5 ${cat === 'all' ? 'bg-white/15 text-white' : 'text-dashboard-neutral'}`}
            >
              全部
            </button>
            {cats.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`rounded px-1.5 py-0.5 ${cat === c ? 'bg-white/15 text-white' : 'text-dashboard-neutral'}`}
              >
                {CATEGORY_EMOJI[c]} {CATEGORY_LABEL[c]} {byCategory.get(c)}
              </button>
            ))}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-dashboard-neutral/10">
            {error ? (
              <div className="px-3 py-3 text-dashboard-conflict/80">事件数据暂不可用</div>
            ) : isLoading && events.length === 0 ? (
              <div className="px-3 py-3 text-dashboard-neutral/50">加载真实事件…</div>
            ) : list.length === 0 ? (
              <div className="px-3 py-3 text-dashboard-neutral/50">该分类暂无事件</div>
            ) : (
              list.map((e) => (
                <div key={e.id} className="flex items-start gap-2 px-3 py-2 hover:bg-white/5">
                  <button
                    type="button"
                    onClick={() => handleClick(e)}
                    title={e.lat != null ? '点击定位至地图' : '查看详情'}
                    className="flex min-w-0 flex-1 items-start gap-2 text-left"
                  >
                    <span className="mt-0.5 flex-shrink-0 text-base leading-none" aria-hidden>
                      {CATEGORY_EMOJI[e.category]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-dashboard-neutral leading-snug">{e.title}</span>
                      <span className="mt-0.5 flex flex-wrap gap-2">
                        <span className="text-dashboard-neutral/50">{e.source}</span>
                        <span className={SEVERITY_COLOR[e.severity]}>{SEVERITY_LABEL[e.severity]}</span>
                        {e.magnitude != null && (
                          <span className="text-dashboard-neutral/60">M{e.magnitude.toFixed(1)}</span>
                        )}
                        <span className="text-dashboard-neutral/40">{formatTimestamp(e.time)}</span>
                      </span>
                    </span>
                  </button>
                  <a
                    href={e.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="原文溯源"
                    className="mt-0.5 shrink-0 text-[11px] text-dashboard-neutral/40 hover:text-sky-300"
                  >
                    ↗
                  </a>
                </div>
              ))
            )}
          </div>

          {providerLine && (
            <div className="border-t border-dashboard-neutral/10 px-3 py-1.5 text-[10px] text-dashboard-neutral/40">
              真实源：{providerLine}
            </div>
          )}
        </>
      )}
    </div>
  );
}
