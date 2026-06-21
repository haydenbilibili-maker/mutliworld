'use client';

/**
 * 关注阈值告警 toast — 被关注类别出现越阈真实异常时右下角弹窗。
 * 点击「定位」飞向事件并打开详情；~15s 自动消失；可手动关闭。与 AI 简报 toast 同区错层堆叠。
 */

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWatchlistStore } from '@/store/useWatchlistStore';
import { useMapStore } from '@/store/useMapStore';
import type { EventDetail } from '@/types/geo';

const AUTO_MS = 15_000;

export function WatchlistAlertToast() {
  const alerts = useWatchlistStore((s) => s.alerts);
  const dismiss = useWatchlistStore((s) => s.dismissAlert);
  const setViewport = useMapStore((s) => s.setViewport);
  const selectEvent = useMapStore((s) => s.selectEvent);

  // 每条 ~15s 自动消失
  useEffect(() => {
    if (alerts.length === 0) return;
    const timers = alerts.map((a) => window.setTimeout(() => dismiss(a.key), AUTO_MS));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [alerts, dismiss]);

  const locate = (key: string) => {
    const a = useWatchlistStore.getState().alerts.find((x) => x.key === key);
    if (!a) return;
    setViewport(a.coords, Math.max(useMapStore.getState().zoom, 3.5));
    selectEvent({
      id: a.key,
      title: `${a.icon} 关注告警 · ${a.label}`,
      source: '关注清单·阈值告警（基于实时真实数据，非预测）',
      timestamp: a.time ?? '',
      location: a.coords,
      impact_level: a.score >= 70 ? 'high' : a.score >= 55 ? 'medium' : 'low',
      category: 'natural',
      description: `${a.kind} · 显著度 ${a.score} 已达告警阈值。`,
    } as EventDetail);
    dismiss(key);
  };

  return (
    <div className="pointer-events-none fixed bottom-[10.5rem] right-4 z-[81] flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-2">
      <AnimatePresence>
        {alerts.slice(-4).map((a) => (
          <motion.div
            key={a.key}
            layout
            initial={{ opacity: 0, x: 24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto rounded-lg border border-amber-500/35 bg-dashboard-bg/95 p-3 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-start gap-2">
              <span
                className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                style={{ background: '#fbbf24', boxShadow: '0 0 8px #fbbf24' }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-medium text-white">
                  <span aria-hidden className="mr-1">{a.icon}</span>关注告警 · {a.kind}
                </div>
                <div className="mt-0.5 truncate text-[11px] text-amber-200/90" title={a.label}>{a.label}</div>
                <div className="mt-0.5 text-[10px] text-dashboard-neutral/55">显著度 {a.score} · 已越阈</div>
              </div>
              <button
                type="button"
                onClick={() => dismiss(a.key)}
                aria-label="关闭告警"
                className="shrink-0 rounded px-1 text-dashboard-neutral/60 hover:bg-white/5 hover:text-white"
              >
                ×
              </button>
            </div>
            <button
              type="button"
              onClick={() => locate(a.key)}
              className="mt-2 w-full rounded-md border border-amber-400/40 bg-amber-400/10 px-2 py-1 text-[11px] text-amber-200 transition-colors hover:bg-amber-400/20"
            >
              定位查看 →
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
