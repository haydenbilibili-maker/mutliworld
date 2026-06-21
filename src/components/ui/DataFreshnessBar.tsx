'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGeodataContext } from '@/context/GeodataContext';
import { REFRESH_INTERVAL_MS } from '@/lib/timeRange';
import { ageLabel, formatDate, nextRefreshIn, timeAgo, isStale } from '@/lib/format/time';
import { useRelativeTimeTick } from '@/hooks/useRelativeTimeTick';
import type { TimeRange } from '@/types/geo';

interface DataFreshnessBarProps {
  className?: string;
}

/**
 * 过滤种子占位等异常未来时间戳（如 launchTime 2039-12-31）。
 * 与 lib/admin/stats 的 sanitizeFutureIso 同语义：超过阈值视为无效，返回 null。
 */
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

/** 数据「陈旧」阈值：超过轮询间隔 2 倍视为可能滞后（如弱网/源故障） */
const STALE_THRESHOLD_MULT = 2;

export function DataFreshnessBar({ className = '' }: DataFreshnessBarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { meta, isValidating, isLoading, mutate, error } = useGeodataContext();
  // 相对时间自动刷新：停留时龄期/倒计时持续更新，不可见时暂停省电
  useRelativeTimeTick(15_000);

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
  const refreshMs = REFRESH_INTERVAL_MS[timeRange];
  const latestEventAt = sanitizeLatestEventAt(meta.latestEventAt);
  const generatedAge = ageLabel(meta.generatedAt);
  const latestEventAge = latestEventAt ? timeAgo(latestEventAt) : '';
  const staleThreshold = refreshMs * STALE_THRESHOLD_MULT;
  const dataStale = isStale(meta.generatedAt, staleThreshold);
  // 下次自动刷新倒计时（基于服务端生成时刻 + 轮询间隔推算）
  const refreshIn = nextRefreshIn(meta.generatedAt, refreshMs);
  const refreshLabel =
    refreshIn == null
      ? REFRESH_LABEL[timeRange]
      : isValidating
        ? '刷新中…'
        : refreshIn > 0
          ? `${refreshIn} 秒后刷新`
          : '即将刷新';
  // 数据就绪后的状态点：stale（滞后）用琥珀色，与刷新中的琥珀态区分用透明度
  const readyDotClass = dataStale ? 'bg-amber-400/70' : 'bg-emerald-400';
  const readyTitle = isValidating
    ? '刷新中'
    : dataStale
      ? '数据可能滞后（已超过 2 倍刷新周期）'
      : '数据已就绪';

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
        <span className="text-[10px] tabular-nums text-dashboard-neutral/55">
          {generatedAge}
        </span>
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${readyDotClass}`}
          title={readyTitle}
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
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-white">数据说明</span>
              <span
                className={[
                  'rounded px-1.5 py-0.5 text-[10px] font-medium',
                  dataStale
                    ? 'bg-amber-500/15 text-amber-300'
                    : 'bg-emerald-500/15 text-emerald-300',
                ].join(' ')}
                role="status"
                aria-live="polite"
              >
                {dataStale ? '可能滞后' : '就绪'}
              </span>
            </div>
            <div
              className="space-y-1.5 text-xs text-dashboard-neutral"
              role="status"
              aria-live="polite"
            >
              <p className="flex items-center justify-between gap-2">
                <span>数据更新</span>
                <span className="tabular-nums text-dashboard-neutral/85">
                  {formatDate(meta.generatedAt)}
                </span>
              </p>
              <p className="flex items-center justify-between gap-2">
                <span>数据龄期</span>
                <span
                  className={[
                    'tabular-nums',
                    dataStale ? 'text-amber-300' : 'text-emerald-300',
                  ].join(' ')}
                >
                  {generatedAge}
                  {isValidating && ' · 刷新中…'}
                </span>
              </p>
              {latestEventAge && (
                <p className="flex items-center justify-between gap-2">
                  <span>最新事件</span>
                  <span className="tabular-nums text-dashboard-neutral/85">
                    {latestEventAge}
                  </span>
                </p>
              )}
              <p className="flex items-center justify-between gap-2">
                <span>点位数量</span>
                <span className="tabular-nums text-dashboard-neutral/85">
                  {meta.featureCount} 个
                </span>
              </p>
              <p className="flex items-center justify-between gap-2 border-t border-dashboard-neutral/10 pt-1.5 text-dashboard-neutral/70">
                <span>下次刷新</span>
                <span className="tabular-nums">{refreshLabel}</span>
              </p>
              <p className="text-dashboard-neutral/55">
                轮询周期 {REFRESH_LABEL[timeRange]}（按窗口自动调节）
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
