'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import {
  countActiveLiveApiLayers,
  LIVE_API_PERFORMANCE_THRESHOLD,
  LIVE_LAYER_PERF_DISMISS_KEY,
} from '@/lib/layers/liveApiLayers';

function isSessionDismissed(): boolean {
  try {
    return sessionStorage.getItem(LIVE_LAYER_PERF_DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

function dismissForSession(): void {
  try {
    sessionStorage.setItem(LIVE_LAYER_PERF_DISMISS_KEY, '1');
  } catch {
    // ignore quota / private mode
  }
}

/**
 * 当已开启的实时 API 图层数量从少于 3 升至 ≥3 时，弹出性能提示（不阻断开层）。
 */
export function LiveLayerPerformanceGuard() {
  const activeLayers = useMapStore((s) => s.activeLayers);
  const prevCountRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    const count = countActiveLiveApiLayers(activeLayers);
    const prev = prevCountRef.current;

    if (
      prev !== null &&
      prev < LIVE_API_PERFORMANCE_THRESHOLD &&
      count >= LIVE_API_PERFORMANCE_THRESHOLD &&
      !isSessionDismissed()
    ) {
      setLiveCount(count);
      setOpen(true);
    }

    prevCountRef.current = count;
  }, [activeLayers]);

  const close = useCallback(() => setOpen(false), []);

  const dismissAndClose = useCallback(() => {
    dismissForSession();
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[1px]"
            aria-label="关闭性能提示"
            onClick={close}
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="live-layer-perf-title"
            aria-describedby="live-layer-perf-desc"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className={[
              'fixed left-1/2 top-1/2 z-[61] w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2',
              'rounded-lg border border-amber-500/30 bg-dashboard-bg/97 p-4 shadow-2xl backdrop-blur-md',
            ].join(' ')}
          >
            <h2
              id="live-layer-perf-title"
              className="text-sm font-semibold text-white"
            >
              实时图层较多
            </h2>
            <p
              id="live-layer-perf-desc"
              className="mt-2 text-[13px] leading-relaxed text-dashboard-neutral/90"
            >
              您已开启 {liveCount} 个实时数据图层，可能增加网络请求与页面负载。建议按需关闭部分图层。
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={dismissAndClose}
                className="rounded-md px-3 py-1.5 text-xs text-dashboard-neutral/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                不再提示
              </button>
              <button
                type="button"
                onClick={close}
                className="rounded-md border border-dashboard-military/50 bg-dashboard-military/20 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-dashboard-military/30"
              >
                我知道了
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
