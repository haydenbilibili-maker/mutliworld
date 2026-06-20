'use client';

/**
 * AI 简报完成通知 — 后台生成完成后右下角弹窗 toast，可「查看」打开详情或关闭。
 * 自动 ~12s 消失；多条堆叠。生成过程中用户浏览其他页面不受影响。
 */

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBriefingStore, type BriefingStatus } from '@/store/useBriefingStore';

const STATUS_TEXT: Record<BriefingStatus, string> = {
  loading: '生成中…',
  done: 'AI 态势简报已生成',
  no_key: '未配置 LLM 密钥（已回落规则化简报）',
  error: '简报生成失败，请稍后重试',
};

const STATUS_COLOR: Record<BriefingStatus, string> = {
  loading: '#38bdf8',
  done: '#34d399',
  no_key: '#fbbf24',
  error: '#f87171',
};

export function BriefingToast() {
  const notifications = useBriefingStore((s) => s.notifications);
  const tasks = useBriefingStore((s) => s.tasks);
  const openDetail = useBriefingStore((s) => s.openDetail);
  const dismiss = useBriefingStore((s) => s.dismissNotification);

  // 每条通知 12s 自动消失
  useEffect(() => {
    if (notifications.length === 0) return;
    const timers = notifications.map((key) => window.setTimeout(() => dismiss(key), 12_000));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [notifications, dismiss]);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-2">
      <AnimatePresence>
        {notifications.slice(-3).map((key) => {
          const t = tasks[key];
          if (!t) return null;
          const color = STATUS_COLOR[t.status];
          return (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-auto rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/95 p-3 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-medium text-white">✨ {t.label}</div>
                  <div className="mt-0.5 text-[11px]" style={{ color }}>{STATUS_TEXT[t.status]}</div>
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(key)}
                  aria-label="关闭通知"
                  className="shrink-0 rounded px-1 text-dashboard-neutral/60 hover:bg-white/5 hover:text-white"
                >
                  ×
                </button>
              </div>
              {(t.status === 'done' || t.status === 'no_key') && (
                <button
                  type="button"
                  onClick={() => openDetail(key)}
                  className="mt-2 w-full rounded-md border border-brand-cyan/40 bg-brand-cyan/10 px-2 py-1 text-[11px] text-brand-cyan transition-colors hover:bg-brand-cyan/20"
                >
                  查看详情 →
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
