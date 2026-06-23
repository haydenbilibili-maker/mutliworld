'use client';

/**
 * 实时事件流 — Wave 4 重构：消费统一真实事件管道 /api/events
 * 源：USGS 地震 · GDACS 灾害 · ReliefWeb 人道 · GDELT 地缘新闻（全真实，无种子）。
 * 分类筛选 + 点击地图联动（带坐标的事件飞行定位）+ 可点击溯源。
 *
 * 时效性提升专项：
 *  - 列表项同时显示绝对时刻（MM-DD HH:MM）与相对龄期（3 分钟前），双重感知
 *  - 顶部 header 显示数据龄期 + 下次刷新倒计时，停留时自动 tick 更新
 */

import { useMemo, useState } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { formatShort, timeAgo, ageLabel, nextRefreshIn } from '@/lib/format/time';
import { SkeletonRows } from '@/components/ui/Skeleton';
import { useRelativeTimeTick } from '@/hooks/useRelativeTimeTick';
import type { LiveEvent, LiveEventCategory, LiveEventSeverity } from '@/types/liveEvent';
import type { EventDetail, ImpactLevel } from '@/types/geo';

/** 事件流轮询间隔（与 useLiveEvents 的 refreshInterval 对齐） */
const EVENT_REFRESH_MS = 300_000;

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

interface LiveEventFeedProps {
  className?: string;
  maxItems?: number;
}

type CatFilter = 'all' | LiveEventCategory;

export function LiveEventFeed({ className = '', maxItems = 14 }: LiveEventFeedProps) {
  const { events, byCategory, providerCounts, generatedAt, isLoading, isValidating, error } = useLiveEvents(true);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const focusOnMap = useMapStore((s) => s.focusOnMap);
  const setViewport = useMapStore((s) => s.setViewport);
  const [collapsed, setCollapsed] = useState(true);
  const [cat, setCat] = useState<CatFilter>('all');
  // 相对时间自动刷新：列表项「X分钟前」与 header 龄期/倒计时随停留持续更新
  useRelativeTimeTick(30_000);

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
    focusOnMap(detail);
    selectEvent(null);
    if (e.lat != null && e.lng != null) setViewport([e.lng, e.lat], 5);
  };

  const providerLine = providerCounts
    ? `USGS ${providerCounts.USGS} · GDACS ${providerCounts.GDACS} · ReliefWeb ${providerCounts.ReliefWeb} · GDELT ${providerCounts.GDELT}`
    : '';

  // 数据龄期 + 下次刷新倒计时（generatedAt 由聚合 API 返回，±5min 轮询）
  const dataAge = generatedAt ? ageLabel(generatedAt) : '';
  const refreshIn = generatedAt ? nextRefreshIn(generatedAt, EVENT_REFRESH_MS) : null;
  const refreshLabel =
    refreshIn == null
      ? ''
      : isValidating
        ? '刷新中…'
        : refreshIn > 0
          ? `${refreshIn}s 后刷新`
          : '即将刷新';

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
        <span className="flex items-center gap-2 text-sm font-medium text-white">
          实时事件流
          {dataAge && (
            <span
              className="rounded bg-dashboard-neutral/10 px-1.5 py-0.5 text-[10px] font-normal tabular-nums text-dashboard-neutral/60"
              title="数据聚合时刻距现在的龄期"
            >
              {isValidating ? '刷新中…' : dataAge}
            </span>
          )}
        </span>
        <span className="flex items-center gap-2 text-dashboard-neutral/50 text-xs">
          <span className="tabular-nums">{collapsed ? '展开' : `共 ${events.length} 条`}</span>
          {refreshLabel && !collapsed && (
            <span
              className="tabular-nums text-dashboard-neutral/35"
              title="距下次自动刷新"
            >
              {refreshLabel}
            </span>
          )}
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
              <div className="px-1 py-1"><SkeletonRows rows={5} /></div>
            ) : list.length === 0 ? (
              <div className="px-3 py-3 text-dashboard-neutral/50">该分类暂无事件</div>
            ) : (
              list.map((e, i) => (
                <div
                  key={e.id}
                  className="lef-row flex items-start gap-2 px-3 py-2 hover:bg-white/5"
                  style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
                >
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
                        <span
                          className="text-dashboard-neutral/40"
                          title={formatShort(e.time)}
                        >
                          {formatShort(e.time)}
                          {(() => {
                            const rel = timeAgo(e.time);
                            return rel ? (
                              <span className="ml-1 text-dashboard-neutral/30">· {rel}</span>
                            ) : null;
                          })()}
                        </span>
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
