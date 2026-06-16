'use client';

/**
 * 中东社媒热帖面板 — LIFEOS-005 阶段3 第七批（面板停靠系统）
 * SocialMediaWidget 的 React 化：按热度排序的热帖卡 + 平台筛选(置于 header)。
 */

import { useMemo, useState } from 'react';
import { useRegionData } from '@/hooks/useRegionData';
import { DockPanel } from '@/components/region/DockPanel';
import type { SocialPlatform } from '@/types/middleeast';

interface MideastSocialPanelProps {
  className?: string;
}

const PLATFORM_LABEL: Record<SocialPlatform, string> = {
  x_twitter: 'X',
  telegram: 'TG',
  instagram: 'IG',
  facebook: 'FB',
  weibo: '微博',
};

function fmt(n?: number): string {
  if (n == null) return '';
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

type FilterKey = 'all' | SocialPlatform;

export function MideastSocialPanel({ className = '' }: MideastSocialPanelProps) {
  const { social } = useRegionData();
  const [filter, setFilter] = useState<FilterKey>('all');

  const list = useMemo(() => {
    const arr = (social ?? []).filter(
      (p) => filter === 'all' || p.platform === filter,
    );
    return [...arr].sort(
      (a, b) => (a.hotRank ?? 999) - (b.hotRank ?? 999),
    );
  }, [social, filter]);

  if (!social || social.length === 0) return null;

  const filters: FilterKey[] = ['all', 'x_twitter', 'telegram', 'weibo'];
  const chips = (
    <div className="flex gap-1 text-[10px]">
      {filters.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => setFilter(f)}
          className={`px-1.5 py-0.5 rounded ${filter === f ? 'bg-white/15 text-white' : 'text-dashboard-neutral'}`}
        >
          {f === 'all' ? '全部' : PLATFORM_LABEL[f]}
        </button>
      ))}
    </div>
  );

  return (
    <DockPanel
      id="social"
      title="社媒热帖"
      count={list.length}
      headerRight={chips}
      className={`w-80 max-h-[60vh] ${className}`}
    >
      <ul className="space-y-2">
        {list.map((p) => (
          <li
            key={p.id}
            className="rounded-md border border-dashboard-neutral/15 p-2"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{p.avatar ?? '💬'}</span>
              <span className="text-xs text-white truncate">{p.authorName}</span>
              {p.verified && <span className="text-[10px] text-sky-400">✓</span>}
              <span className="text-[10px] text-dashboard-neutral truncate">
                @{p.handle}
              </span>
              <span className="ml-auto text-[10px] text-dashboard-neutral/70 shrink-0">
                {PLATFORM_LABEL[p.platform]}
              </span>
            </div>
            <div className="text-[11px] text-dashboard-neutral/90 leading-snug mt-1">
              {p.content}
            </div>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-dashboard-neutral/60">
              <span>👍 {fmt(p.likes)}</span>
              <span>🔁 {fmt(p.shares)}</span>
              <span>💬 {fmt(p.comments)}</span>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener"
                  className="ml-auto text-sky-400 hover:underline"
                >
                  原文 ↗
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="text-[10px] text-dashboard-neutral/60 pt-2 mt-1 border-t border-dashboard-neutral/10">
        数据迁自 Iran 中东大屏 · 真实账号热帖
      </div>
    </DockPanel>
  );
}
