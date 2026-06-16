'use client';

/**
 * 信息流跑马灯 — LIFEOS-005 交互增强
 *
 * 把当前区域的事件 + 社媒热帖汇成一条横向滚动信息流（态势大屏底部走马灯）。
 * - 无缝循环（内容复制一份）
 * - 悬停暂停
 * - 点击事件项 → 选中并在侧栏展示
 * - 数据驱动 + 受面板停靠开关控制（dock 的「跑马灯」）
 */

import { useMemo } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { useRegionData } from '@/hooks/useRegionData';
import { usePanelStore } from '@/store/usePanelStore';
import { useLaunchLog } from '@/hooks/useLaunchLog';
import type { EventDetail } from '@/types/geo';

interface MarqueeTickerProps {
  className?: string;
}

interface TickerItem {
  key: string;
  dot: string;
  text: string;
  sub: string;
  event: EventDetail | null;
}

function impactColor(level: EventDetail['impact_level']): string {
  if (level === 'critical') return '#ef4444';
  if (level === 'high') return '#f59e0b';
  if (level === 'medium') return '#3b82f6';
  return '#94a3b8';
}

export function MarqueeTicker({ className = '' }: MarqueeTickerProps) {
  const open = usePanelStore((s) => s.open.marquee);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const { events, social } = useRegionData();

  const { entries: launchEntries } = useLaunchLog('1y');

  const items = useMemo<TickerItem[]>(() => {
    const launch = launchEntries[0] ?? null;
    const launchItem: TickerItem | null = launch
      ? {
          key: 'launch-' + launch.id,
          dot: launch.status === 'failure' ? '#ef4444' : launch.status === 'scheduled' ? '#3b82f6' : '#22c55e',
          text: `🚀 ${launch.title}`,
          sub: launch.launchTime.slice(0, 10),
          event: {
            id: launch.id,
            title: launch.title,
            source: launch.provider,
            timestamp: launch.launchTime,
            location: [launch.location.lng, launch.location.lat],
            impact_level: launch.status === 'failure' ? 'critical' : 'low',
            category: 'launch_log',
            description: launch.payload ?? '',
          },
        }
      : null;

    const evs: TickerItem[] = (events ?? []).map((e) => ({
      key: 'e-' + e.id,
      dot: impactColor(e.impact_level),
      text: e.title,
      sub: (e.timestamp || '').slice(0, 10) || e.source || '',
      event: e,
    }));
    const socs: TickerItem[] = (social ?? []).slice(0, 14).map((s) => ({
      key: 's-' + s.id,
      dot: '#22d3ee',
      text: `${s.authorName}：${s.content}`.slice(0, 90),
      sub: s.platform,
      event: null,
    }));
    return [...(launchItem ? [launchItem] : []), ...evs, ...socs];
  }, [events, social, launchEntries]);

  if (!open || items.length === 0) return null;

  // 无缝循环：复制一份；时长随条数增长
  const loop = [...items, ...items];
  const durationSec = Math.max(24, items.length * 4.5);

  return (
    <div
      className={`mq group rounded-lg bg-dashboard-bg/90 border border-dashboard-neutral/20 overflow-hidden ${className}`}
      aria-label="信息流跑马灯"
    >
      <style>{`
        @keyframes mqScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .mq:hover .mq-track { animation-play-state: paused; }
      `}</style>
      <div className="flex items-center">
        <span className="shrink-0 px-3 py-1.5 text-[11px] font-medium text-white bg-white/5 border-r border-dashboard-neutral/20">
          实时信息流
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div
            className="mq-track flex w-max items-center gap-6 py-1.5 will-change-transform"
            style={{ animation: `mqScroll ${durationSec}s linear infinite` }}
          >
            {loop.map((it, i) => (
              <button
                key={it.key + '-' + i}
                type="button"
                onClick={() => it.event && selectEvent(it.event)}
                className={`flex items-center gap-1.5 text-xs text-dashboard-neutral hover:text-white transition-colors ${it.event ? 'cursor-pointer' : 'cursor-default'}`}
                title={it.text}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: it.dot }}
                />
                <span className="whitespace-nowrap">{it.text}</span>
                {it.sub && (
                  <span className="whitespace-nowrap text-dashboard-neutral/50 text-[10px]">
                    · {it.sub}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
