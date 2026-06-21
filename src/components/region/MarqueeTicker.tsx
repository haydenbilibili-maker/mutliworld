'use client';

/**
 * 信息流跑马灯 — 时政/政经/国际局势快讯流
 *
 * - 精选种子 + RSS 实时条目混排（useNewsFeed）
 * - 无缝循环、悬停暂停、边缘渐隐
 * - 分类色标；点击 → 侧栏详情 + 可选地图定位
 * - 与 NewsPanel 区分：跑马灯=快讯流，面板=完整 RSS 列表
 */

import { useMemo, useCallback } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { usePanelStore } from '@/store/usePanelStore';
import { useNewsFeed } from '@/hooks/useNewsFeed';
import {
  newsFeedItemToEventDetail,
  NEWS_CATEGORY_COLORS,
  NEWS_CATEGORY_BG,
  type NewsFeedCategory,
  type NewsFeedItem,
} from '@/data/news-feed';
import { EMPTY_REGION_MESSAGE } from '@/lib/region/contentFilter';

interface MarqueeTickerProps {
  className?: string;
}

interface TickerRow {
  key: string;
  item: NewsFeedItem;
}

function formatDateShort(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}-${dd}`;
}

function hasMapLocation(item: NewsFeedItem): boolean {
  return item.location != null && (item.location[0] !== 0 || item.location[1] !== 0);
}

export function MarqueeTicker({ className = '' }: MarqueeTickerProps) {
  const open = usePanelStore((s) => s.open.marquee);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const focusOnMap = useMapStore((s) => s.focusOnMap);
  const setViewport = useMapStore((s) => s.setViewport);

  const { items, isLoading, hasLiveItems, error } = useNewsFeed(32);

  const rows = useMemo<TickerRow[]>(
    () => items.map((item) => ({ key: item.id, item })),
    [items],
  );

  // 跑马灯动画防抖：duration 仅与「条目数量」挂钩，而非 items 引用。
  // 否则 useNewsFeed 每 5 分钟轮询刷新 → items 引用变更 → React 重设 inline style.animation
  // → CSS 动画从 0% 重启，跑马灯「跳回起点」造成可见抖动。
  const count = rows.length;
  const durationSec = useMemo(() => Math.max(28, count * 5), [count]);
  // trackKey 仅在条目集合（数量+首尾 id）真正变化时才变；轮询刷新内容相同则保持不变，
  // 从而不触发 DOM 重挂、不重启动画。内容更新由 React 对子节点 diff 平滑过渡。
  const trackKey = useMemo(() => {
    if (count === 0) return 'empty';
    const head = rows[0]?.key ?? '';
    const tail = rows[count - 1]?.key ?? '';
    return `${count}:${head}:${tail}`;
  }, [count, rows]);

  const handleClick = useCallback(
    (item: NewsFeedItem) => {
      const event = newsFeedItemToEventDetail(item);
      focusOnMap(event);
      selectEvent(null); // 关闭右侧面板，信息先显示在地图浮窗
      if (hasMapLocation(item)) {
        setViewport(item.location!, 5);
      }
    },
    [focusOnMap, selectEvent, setViewport],
  );

  if (!open) return null;

  const showEmpty = !isLoading && rows.length === 0;
  const loop = rows.length > 0 ? [...rows, ...rows] : [];

  return (
    <div
      className={`mq group rounded-lg bg-dashboard-bg/90 border border-dashboard-neutral/20 overflow-hidden backdrop-blur-sm ${className}`}
      aria-label="信息流跑马灯"
      role="region"
    >
      <style>{`
        @keyframes mqScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .mq:hover .mq-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .mq-track { animation: none !important; flex-wrap: wrap; }
        }
      `}</style>
      <div className="flex items-stretch min-h-[2rem] max-sm:min-h-[1.75rem]">
        <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 max-sm:px-2 max-sm:py-1 text-[11px] max-sm:text-[10px] font-medium text-white bg-white/5 border-r border-dashboard-neutral/20">
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${isLoading ? 'animate-pulse bg-amber-400' : 'bg-emerald-400'}`}
            aria-hidden
          />
          实时信息流
        </span>

        <div className="relative flex-1 overflow-hidden min-w-0">
          {/* 左右渐隐遮罩 */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-6 z-10 bg-gradient-to-r from-dashboard-bg/90 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-6 z-10 bg-gradient-to-l from-dashboard-bg/90 to-transparent"
            aria-hidden
          />

          {showEmpty ? (
            <div className="flex items-center px-3 py-1.5 text-xs text-dashboard-neutral/60">
              {error ? '快讯暂不可用，请稍后刷新' : EMPTY_REGION_MESSAGE}
            </div>
          ) : isLoading && rows.length === 0 ? (
            <div className="flex items-center px-3 py-1.5 text-xs text-dashboard-neutral/60 animate-pulse">
              加载快讯中…
            </div>
          ) : (
            <div
              key={trackKey}
              className="mq-track flex w-max items-center gap-4 max-sm:gap-3 py-1.5 px-1 will-change-transform"
              style={{ animation: `mqScroll ${durationSec}s linear infinite` }}
            >
              {loop.map(({ key, item }, i) => (
                <TickerChip
                  key={`${key}-${i}`}
                  item={item}
                  onClick={() => handleClick(item)}
                />
              ))}
            </div>
          )}
        </div>

        {hasLiveItems && rows.length > 0 && (
          <span className="shrink-0 hidden sm:flex items-center px-2 text-[9px] text-dashboard-neutral/40 border-l border-dashboard-neutral/20">
            LIVE
          </span>
        )}
      </div>
    </div>
  );
}

function TickerChip({
  item,
  onClick,
}: {
  item: NewsFeedItem;
  onClick: () => void;
}) {
  const cat = item.category as NewsFeedCategory;
  const color = NEWS_CATEGORY_COLORS[cat];
  const bg = NEWS_CATEGORY_BG[cat];

  return (
    <button
      type="button"
      onClick={onClick}
      className="group/chip flex items-center gap-1.5 text-xs max-sm:text-[11px] text-dashboard-neutral hover:text-white transition-colors cursor-pointer shrink-0"
      title={`${item.title}\n${item.summary}`}
    >
      <span
        className="shrink-0 rounded px-1 py-px text-[9px] max-sm:text-[8px] font-medium leading-tight"
        style={{ color, backgroundColor: bg, border: `1px solid ${color}33` }}
      >
        {cat}
      </span>
      <span className="whitespace-nowrap max-w-[min(42vw,22rem)] max-sm:max-w-[55vw] truncate group-hover/chip:whitespace-normal group-hover/chip:max-w-none">
        {item.title}
      </span>
      <span className="whitespace-nowrap text-dashboard-neutral/45 text-[10px] max-sm:text-[9px] shrink-0">
        · {item.source} · {formatDateShort(item.publishedAt)}
      </span>
    </button>
  );
}
