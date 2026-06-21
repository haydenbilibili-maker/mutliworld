'use client';

/**
 * 人物履历时间线（资料库详情页用）
 * 垂直时间轴样式，按 career[] 顺序展示职务变迁。
 */

import type { PersonCareerEntry } from '@/types/person';

interface PersonCareerTimelineProps {
  career: PersonCareerEntry[];
  className?: string;
}

export function PersonCareerTimeline({
  career,
  className = '',
}: PersonCareerTimelineProps) {
  if (career.length === 0) {
    return (
      <p className="text-[11px] text-dashboard-neutral/40">暂无履历数据</p>
    );
  }

  return (
    <ol className={`relative space-y-3 border-l border-dashboard-neutral/20 pl-4 ${className}`}>
      {career.map((entry, i) => (
        <li key={i} className="relative">
          {/* 时间轴节点 */}
          <span
            className="absolute -left-[1.4rem] top-1 h-2 w-2 rounded-full bg-brand-cyan ring-2 ring-dashboard-bg"
            aria-hidden
          />
          <div className="flex flex-wrap items-baseline gap-2">
            {entry.year && (
              <span className="shrink-0 text-[11px] font-medium tabular-nums text-brand-cyan">
                {entry.year}
              </span>
            )}
            <span className="text-xs font-medium text-white">{entry.title}</span>
          </div>
          {entry.org && (
            <div className="text-[11px] text-dashboard-neutral/60">{entry.org}</div>
          )}
          {entry.description && (
            <div className="mt-0.5 text-[11px] leading-relaxed text-dashboard-neutral/75">
              {entry.description}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
