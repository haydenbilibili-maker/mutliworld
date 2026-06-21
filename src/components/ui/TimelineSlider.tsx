'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import type { TimeRange } from '@/types/geo';

interface TimelineSliderProps {
  className?: string;
  /** 嵌入 MapControlBar 时省略外层容器样式 */
  embedded?: boolean;
}

const OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '24h', label: '24 小时' },
  { value: '7d', label: '7 天' },
  { value: '30d', label: '30 天' },
];

// 事件回放（时间机器）窗口与推进
const TM_WINDOWS: { h: number; label: string }[] = [
  { h: 24, label: '24h' }, { h: 72, label: '3天' }, { h: 168, label: '7天' },
];
const TM_STEP_MS = 250, TM_STEPS = 120;
const tmFmt = (ts: number) => new Date(ts).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

/** 时间范围筛选 — 下拉选择（替代平铺按钮，提升坪效） */
export function TimelineSlider({ className = '', embedded = false }: TimelineSliderProps) {
  // 选择性订阅：仅 timeRange/timeTimeRange，避免拖拽地图时 center/zoom 变化引发重渲染。
  const timeRange = useMapStore((s) => s.timeRange);
  const setTimeRange = useMapStore((s) => s.setTimeRange);
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const current = OPTIONS.find((o) => o.value === timeRange) ?? OPTIONS[1];

  // 事件回放（时间机器，并入时间模块）
  const inSurface = useMapStore((s) => s.activeBody === 'earth' && s.activeTier === 'surface');
  const tmActive = useMapStore((s) => s.tmActive);
  const tmPlaying = useMapStore((s) => s.tmPlaying);
  const tmWindowH = useMapStore((s) => s.tmWindowH);
  const tmPlayhead = useMapStore((s) => s.tmPlayhead);
  const setTM = useMapStore((s) => s.setTimeMachine);
  const toggleLayer = useMapStore((s) => s.toggleLayer);
  const tmNow = Date.now();
  const tmStart = tmNow - tmWindowH * 3600 * 1000;
  const tmAtLive = tmPlayhead >= tmNow - 1000;

  // 播放头低频推进（非每帧重绘）；到此刻停在实时
  useEffect(() => {
    if (!tmActive || !tmPlaying) return;
    const inc = (tmWindowH * 3600 * 1000) / TM_STEPS;
    const t = setInterval(() => {
      const s = useMapStore.getState();
      const nx = s.tmPlayhead + inc;
      const ceil = Date.now();
      if (nx >= ceil) s.setTimeMachine({ tmPlayhead: ceil, tmPlaying: false });
      else s.setTimeMachine({ tmPlayhead: nx });
    }, TM_STEP_MS);
    return () => clearInterval(t);
  }, [tmActive, tmPlaying, tmWindowH]);

  const tmEnable = () => {
    if (!useMapStore.getState().activeLayers.includes('earthquakes')) toggleLayer('earthquakes');
    setTM({ tmActive: true, tmPlayhead: Date.now() - tmWindowH * 3600 * 1000, tmPlaying: true });
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
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

  return (
    <div
      ref={rootRef}
      className={['relative', embedded ? '' : 'rounded-lg border border-dashboard-neutral/20 bg-dashboard-bg/90', className].join(' ')}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`时间范围：${current.label}`}
        title="选择数据时间范围"
        className={[
          'flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors sm:px-3 sm:py-1.5 sm:text-sm',
          open
            ? 'bg-dashboard-military/25 text-white'
            : 'text-dashboard-neutral hover:bg-dashboard-neutral/20 hover:text-white',
        ].join(' ')}
      >
        <span aria-hidden>🕑</span>
        <span className="text-dashboard-neutral/70 max-sm:hidden">时间</span>
        <span className="font-medium text-white">{current.label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={['shrink-0 transition-transform duration-150', open ? 'rotate-180' : ''].join(' ')}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-label="时间范围与回放"
            className="absolute bottom-full left-0 z-50 mb-1.5 w-[min(17rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/95 p-1.5 shadow-xl backdrop-blur-md"
          >
            <div className="mb-1 px-1 text-[10px] text-dashboard-neutral/45">数据时间范围</div>
            <ul role="listbox" aria-label="时间范围">
              {OPTIONS.map(({ value, label }) => (
                <li key={value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={timeRange === value}
                    onClick={() => { setTimeRange(value); setOpen(false); }}
                    className={['flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[12px] transition-colors', timeRange === value ? 'bg-dashboard-military/20 text-white' : 'text-dashboard-neutral hover:bg-white/5 hover:text-white'].join(' ')}
                  >
                    <span>{label}</span>
                    {timeRange === value && <span aria-hidden className="text-dashboard-military">✓</span>}
                  </button>
                </li>
              ))}
            </ul>

            {inSurface && (
              <div className="mt-1.5 border-t border-dashboard-neutral/15 pt-1.5">
                <div className="mb-1 px-1 text-[10px] text-dashboard-neutral/45">⏱ 事件回放（时间机器 · 地震）</div>
                {!tmActive ? (
                  <button type="button" onClick={tmEnable} className="w-full rounded-md px-2.5 py-1.5 text-left text-[12px] text-sky-200 hover:bg-white/5">▶ 开启事件回放</button>
                ) : (
                  <div className="space-y-1.5 px-1">
                    <div className="flex items-center gap-1">
                      {TM_WINDOWS.map((w) => (
                        <button key={w.h} type="button" onClick={() => setTM({ tmWindowH: w.h, tmPlayhead: Date.now() - w.h * 3600 * 1000 })}
                          className={['rounded px-1.5 py-0.5 text-[10px]', tmWindowH === w.h ? 'bg-sky-500/25 text-sky-200' : 'text-dashboard-neutral/55 hover:bg-white/5'].join(' ')}>{w.label}</button>
                      ))}
                      <button type="button" onClick={() => (tmAtLive ? setTM({ tmPlayhead: tmStart, tmPlaying: true }) : setTM({ tmPlaying: !tmPlaying }))} className="ml-auto rounded px-1.5 py-0.5 text-[12px] text-sky-200 hover:bg-white/5">{tmAtLive ? '↻' : tmPlaying ? '⏸' : '▶'}</button>
                    </div>
                    <input type="range" min={tmStart} max={tmNow} step={60000} value={Math.min(Math.max(tmPlayhead, tmStart), tmNow)} onChange={(e) => setTM({ tmPlayhead: Number(e.target.value), tmPlaying: false })} className="h-1 w-full accent-sky-400" aria-label="回放时间" />
                    <div className="flex items-center justify-between text-[10px] text-dashboard-neutral/70">
                      <span className="tabular-nums">{tmAtLive ? '实时' : tmFmt(tmPlayhead)}</span>
                      <button type="button" onClick={() => setTM({ tmActive: false, tmPlaying: false, tmPlayhead: Date.now() })} className="text-dashboard-neutral/45 hover:text-white">退出</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
