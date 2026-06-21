'use client';

/**
 * 实时新闻面板 — 对标 World Monitor Round 4
 * 聚合 BBC/半岛/UN News 公开 RSS；二级筛选按当前区域过滤。
 *
 * 时效性提升专项：相对时间收敛到统一工具，并接入自动 tick（停留时「X分钟前」持续更新）。
 */

import { useMapStore } from '@/store/useMapStore';
import { getRegion } from '@/regions';
import { useNews } from '@/hooks/useNews';
import { EMPTY_REGION_MESSAGE } from '@/lib/region/contentFilter';
import { timeAgo } from '@/lib/format/time';
import { useRelativeTimeTick } from '@/hooks/useRelativeTimeTick';
import { DockPanel } from '@/components/region/DockPanel';

interface NewsPanelProps {
  className?: string;
}

export function NewsPanel({ className = '' }: NewsPanelProps) {
  const region = useMapStore((s) => s.activeRegion);
  const { items, isLoading } = useNews();
  const regionName = getRegion(region)?.name ?? '全球';
  const isEmpty = !isLoading && items.length === 0;
  // 相对时间自动刷新：列表项「X分钟前」随停留持续更新，页面不可见时暂停省电
  useRelativeTimeTick(30_000);

  return (
    <DockPanel
      id="news"
      title={`实时新闻 · ${regionName}`}
      count={items.length || undefined}
      className={`w-80 max-h-[60vh] ${className}`}
    >
      {isLoading && items.length === 0 ? (
        <div className="text-[11px] text-dashboard-neutral/60">加载中…</div>
      ) : isEmpty ? (
        <div className="text-[11px] text-dashboard-neutral/60">
          {EMPTY_REGION_MESSAGE}
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li
              key={n.id}
              className="border-b border-dashboard-neutral/10 pb-1.5 last:border-0"
            >
              <a
                href={n.link}
                target="_blank"
                rel="noopener"
                className="text-[11px] leading-snug text-dashboard-neutral hover:text-white transition-colors"
              >
                {n.title}
              </a>
              <div className="text-[10px] text-dashboard-neutral/50 mt-0.5">
                {n.source} · {timeAgo(n.publishedAt)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </DockPanel>
  );
}
