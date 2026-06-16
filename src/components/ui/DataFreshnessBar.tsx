'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGeodataContext } from '@/context/GeodataContext';
import { REFRESH_INTERVAL_MS } from '@/lib/timeRange';
import type { TimeRange } from '@/types/geo';

interface DataFreshnessBarProps {
  className?: string;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const MM = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
}

/** 过滤种子占位等异常未来时间戳（如 launchTime 2039-12-31） */
function sanitizeLatestEventAt(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return null;
  const maxFutureMs = 5 * 60 * 1000;
  if (ms > Date.now() + maxFutureMs) return null;
  return iso;
}

const REFRESH_LABEL: Record<TimeRange, string> = {
  '24h': '30 秒',
  '7d': '60 秒',
  '30d': '120 秒',
};

export function DataFreshnessBar({ className = '' }: DataFreshnessBarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { meta, isValidating, isLoading, mutate, error } = useGeodataContext();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const statusDotClass = error
    ? 'bg-dashboard-conflict'
    : isValidating
      ? 'bg-amber-400'
      : 'bg-emerald-400';

  if (!meta && isLoading) {
    return (
      <div ref={rootRef} className={`relative ${className}`}>
        <button
          type="button"
          disabled
          aria-label="数据说明"
          className="flex items-center gap-2 rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/85 px-3 py-2 text-sm text-dashboard-neutral/60 shadow-lg backdrop-blur-sm"
        >
          <span aria-hidden>📊</span>
          <span>数据</span>
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-dashboard-neutral/40" />
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div ref={rootRef} className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="数据说明"
          className={[
            'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg backdrop-blur-sm transition-colors',
            open
              ? 'border-dashboard-conflict/50 bg-dashboard-bg/95 text-white'
              : 'border-dashboard-conflict/40 bg-dashboard-bg/85 text-dashboard-conflict hover:border-dashboard-conflict/60',
          ].join(' ')}
        >
          <span aria-hidden>📊</span>
          <span>数据</span>
          <span className={`h-2 w-2 shrink-0 rounded-full ${statusDotClass}`} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              role="dialog"
              aria-label="数据说明"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-0 z-30 mb-2 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-dashboard-conflict/40 bg-dashboard-bg/95 p-3 shadow-xl backdrop-blur-md"
            >
              <p className="text-sm text-dashboard-conflict">数据拉取失败</p>
              <button
                type="button"
                onClick={() => mutate()}
                className="mt-2 text-sm text-dashboard-military hover:underline"
              >
                重试
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (!meta) return null;

  const timeRange = meta.timeRange as TimeRange;
  const latestEventAt = sanitizeLatestEventAt(meta.latestEventAt);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="数据说明"
        className={[
          'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg backdrop-blur-sm transition-colors',
          open
            ? 'border-dashboard-military/50 bg-dashboard-bg/95 text-white'
            : 'border-dashboard-neutral/25 bg-dashboard-bg/85 text-dashboard-neutral hover:border-dashboard-neutral/40 hover:text-white',
        ].join(' ')}
      >
        <span aria-hidden>📊</span>
        <span>数据</span>
        <span className="rounded-full bg-dashboard-neutral/15 px-1.5 py-0.5 text-xs tabular-nums text-dashboard-neutral/80">
          {meta.featureCount}
        </span>
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${statusDotClass}`}
          title={isValidating ? '刷新中' : error ? '拉取失败' : '数据已就绪'}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="数据说明"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 z-30 mb-2 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/95 p-3 shadow-xl backdrop-blur-md"
          >
            <div className="mb-2 text-sm font-medium text-white">数据说明</div>
            <div
              className="space-y-1.5 text-xs text-dashboard-neutral"
              role="status"
              aria-live="polite"
            >
              <p>
                数据更新：{formatTime(meta.generatedAt)}
                {isValidating ? ' · 刷新中…' : ''}
              </p>
              <p>点位数量：{meta.featureCount} 个</p>
              {latestEventAt && (
                <p>最新事件：{formatTime(latestEventAt)}</p>
              )}
              <p className="text-dashboard-neutral/70">
                自动刷新：{REFRESH_LABEL[timeRange]}（
                {Math.round(REFRESH_INTERVAL_MS[timeRange] / 1000)} 秒间隔）
              </p>
            </div>
            <button
              type="button"
              onClick={() => mutate()}
              className="mt-2.5 text-xs text-dashboard-military hover:underline"
              aria-label="手动刷新态势数据"
            >
              立即刷新
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
