'use client';

/**
 * 时间机器（3.0 B · 最小闭环：事件层回放）— 仅地表层显示。
 * 在「过去 N 小时 → 此刻」时间窗内回放真实事件（地震随发生时刻逐步出现）。
 * 仅按真实时间戳过滤既有数据，不预测、不编造；播放头到「此刻」即回到实时。
 * 播放头推进用低频 setInterval（非每帧整图重绘），契合深度防抖。
 */

import { useEffect } from 'react';
import { useMapStore } from '@/store/useMapStore';

const WINDOWS: { h: number; label: string }[] = [
  { h: 24, label: '24h' },
  { h: 72, label: '3天' },
  { h: 168, label: '7天' },
];
const STEP_MS = 250; // 推进间隔
const STEPS = 120; // 整窗约 30s 播完

function fmt(ts: number): string {
  return new Date(ts).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
}

export function TimeMachineBar() {
  const inSurface = useMapStore((s) => s.activeBody === 'earth' && s.activeTier === 'surface');
  const active = useMapStore((s) => s.tmActive);
  const playing = useMapStore((s) => s.tmPlaying);
  const windowH = useMapStore((s) => s.tmWindowH);
  const playhead = useMapStore((s) => s.tmPlayhead);
  const setTM = useMapStore((s) => s.setTimeMachine);
  const toggleLayer = useMapStore((s) => s.toggleLayer);

  const now = Date.now();
  const start = now - windowH * 3600 * 1000;

  // 播放推进（低频）：到达此刻则停在实时
  useEffect(() => {
    if (!active || !playing) return;
    const inc = (windowH * 3600 * 1000) / STEPS;
    const t = setInterval(() => {
      const s = useMapStore.getState();
      const nx = s.tmPlayhead + inc;
      const ceil = Date.now();
      if (nx >= ceil) s.setTimeMachine({ tmPlayhead: ceil, tmPlaying: false });
      else s.setTimeMachine({ tmPlayhead: nx });
    }, STEP_MS);
    return () => clearInterval(t);
  }, [active, playing, windowH]);

  if (!inSurface) return null;

  const enable = () => {
    // 开启回放：确保地震层可见，播放头置于时间窗起点
    if (!useMapStore.getState().activeLayers.includes('earthquakes')) toggleLayer('earthquakes');
    setTM({ tmActive: true, tmPlayhead: Date.now() - windowH * 3600 * 1000, tmPlaying: true });
  };
  const atLive = playhead >= now - 1000;

  return (
    <div className="pointer-events-none fixed bottom-[9.5rem] left-1/2 z-20 w-[min(40rem,calc(100vw-1.5rem))] -translate-x-1/2 max-sm:bottom-[10.25rem]">
      <div className="pointer-events-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-dashboard-neutral/20 bg-dashboard-bg/92 px-3 py-2 text-[11px] shadow-xl backdrop-blur-md">
        {!active ? (
          <button type="button" onClick={enable} className="flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] text-dashboard-neutral hover:bg-white/5 hover:text-white">
            <span aria-hidden>⏱</span> 时间机器 · 事件回放
          </button>
        ) : (
          <>
            <span className="text-[10px] font-medium text-dashboard-neutral/55">时间机器</span>
            <div className="flex gap-0.5">
              {WINDOWS.map((w) => (
                <button
                  key={w.h}
                  type="button"
                  onClick={() => setTM({ tmWindowH: w.h, tmPlayhead: Date.now() - w.h * 3600 * 1000 })}
                  className={['rounded px-1.5 py-0.5 text-[10px] transition-colors', windowH === w.h ? 'bg-sky-500/25 text-sky-200' : 'text-dashboard-neutral/55 hover:bg-white/5'].join(' ')}
                >
                  {w.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => (atLive ? setTM({ tmPlayhead: start, tmPlaying: true }) : setTM({ tmPlaying: !playing }))}
              className="rounded px-1.5 py-0.5 text-[12px] text-sky-200 hover:bg-white/5"
              title={playing ? '暂停' : '播放'}
            >
              {atLive ? '↻' : playing ? '⏸' : '▶'}
            </button>
            <input
              type="range"
              min={start}
              max={now}
              step={60000}
              value={Math.min(Math.max(playhead, start), now)}
              onChange={(e) => setTM({ tmPlayhead: Number(e.target.value), tmPlaying: false })}
              className="h-1 min-w-[8rem] flex-1 accent-sky-400"
              aria-label="回放时间"
            />
            <span className="tabular-nums text-[10px] text-dashboard-neutral/70">{atLive ? '实时' : fmt(playhead)}</span>
            <button
              type="button"
              onClick={() => setTM({ tmActive: false, tmPlaying: false, tmPlayhead: Date.now() })}
              className="rounded px-1.5 py-0.5 text-[10px] text-dashboard-neutral/45 hover:bg-white/5 hover:text-white"
            >
              退出
            </button>
          </>
        )}
      </div>
    </div>
  );
}
